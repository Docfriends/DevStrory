---
layout: post
title: "Spring Boot 를 이용해 JWT + Social 로그인 처리 - Resource Server"
description: "Spring Security 통해 인증 인가 처리 합니다."
date: 2021-10-08
tags: [JAVA, Spring, Security]
writer: syh8088
category: JAVA
comments: true
share: true
---
## Spring Boot 를 이용해 JWT 및 Social 인증, 인가 처리

### Resource Server 구현

인증 서버 통해 JWT 토큰을 발급 받게 되었다면 이 토큰을 이용해 원하는 Resource 로 접근해서 데이터를 받는 역활을 하는 Resource 서버를 구축 할려고 합니다.

Resource 서버로 요청 하게 된다면 Authorization 서버와 달리

1. 요청 받은 JWT Token 을 검증 한다.
2. 접속한 Resource 에 대한 권한이 올바른지 체크한다.
3. 모든 인증, 인가 처리가 완료된다면 해당 데이터를 조회해 응답 한다.

이제부터 하나하나씩 알아봅시다.

### Spring Security 설정

SecurityConfig.java
```markdown

private final JwtAuthenticationFilter jwtAuthenticationFilter;

@Override
    protected void configure(HttpSecurity http) throws Exception {
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .csrf().disable()
                .cors().disable()
                .formLogin().disable()
                .logout().disable()
                .httpBasic().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated().and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(customFilterSecurityInterceptor(), FilterSecurityInterceptor.class);
    }
```
Authorization Server 에서 설정한 것과 크게 다르지 않습니다.

다른 부분이 있다면

``http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);``

Spring Security 에서는 인증 및 인가 처리시 여러가지 Filter 를 거친다고 했습니다.

그 중 UsernamePasswordAuthenticationFilter 는 Spring Security 의 인증 처리 하는 대표적인 Filter 입니다. 즉 입력된 ID/PASSWORD 를 통해 올바른 회원인지 체크 하는 단계 입니다.

해당 소스는 UsernamePasswordAuthenticationFilter filter 거치기 전에 자체적으로 만든 JwtAuthenticationFilter 클래스를 거치도록 하겠다는 의미 입니다.

JwtAuthenticationFilter 는 응답 받은 JWT Token 을 올바른지 검증하고 올바른다면 Spring Security 인증 객체를 생성해서 SecurityContextHolder 에 저장 할려고 합니다.

``http.addFilterBefore(customFilterSecurityInterceptor(), FilterSecurityInterceptor.class);``

FilterSecurityInterceptor 클래스는 Spring Security Filter 중 맨 마지막에 위치한 사용자의 권한 체크를 하는 Filter 입니다.

이부분도 역시 FilterSecurityInterceptor 앞에 위치해서 customFilterSecurityInterceptor 메소드를 호출 시켜

자체적으로 FilterSecurityInterceptor 클래스를 extend 한 PermitAllFilter 클래스를 만든 후 사용 할 예정입니다. (뒤에 ' 인가처리 허용 필터 구현하기' 에서 자세히 설명 계획)



### Spring Security 인가 처리

보통 서비스 운영하는 업체라면 유저 권한에 따라 해당 페이지 접속이 제한 되는 부분이 있을겁니다.

예를들어 서비스 운영자만 사용할 수 있는 ADMIN 페이지가 대표적 입니다.

ADMIN 페이지는 반드시 해당 서비스 직원들에게만 권한을 부여하고 그외 고객들은 접속 하면 안됩니다.

이를 구현하기 위해서 각각 페이지마다 소스 코드로 권한 관련 로직을 작성 하는것은 번거로운 일이다.

매번 해당 API 가 ADMIN 만 접속이 가능하도록 변경 사항이 있다면 코드를 수정하고 서버를 재기동 해야 합니다.

관리자 페이지에서 해당 API 접속 권한을 변경만으로 코드 수정 및 서버 재기동 할 필요없이 동적으로 관리가 가능하도록 해야 합니다.

Spring Security 에서는 편리하게 동적으로 권한을 관리 할 수 있도록 도와줍니다.

즉 해당 API 에서는 일반 유저에게만 접속이 가능하도록 하다가 변경상황으로 인해 ADMIN 유저에게만 접속이 가능하도록 실시간으로 변경이 가능 합니다.

실제 서비스 업체에서는

1. 회원관리
2. 권한관리
3. 자원관리

이 3가지가 동적으로 관리가 가능 하도록 시스템이 구축되어 있어야 합니다.

이번 시간에는 3가지 기능을 프론트단에서는 구현을 안하지만 백엔드에서 어떻게 구성 해야 하는지 알아보는 시간을 갖도록 하겠습니다.

Spring Security 에서는 권한계층 관리 할 수 있도록 대표적으로 2가지 있는데

1. URL 요청시 인가처리
2. 메소드 호출시 인가처리

이 2가지를 제공해주며 우리는 보편적으로 사용하는 1번 URL 요청시 인가처리에 대해 알아보겠습니다.

### Role 및 Resource 테이블 Insert 하기

```markdown
INSERT INTO `role` (`role_no`, `name`, `use_yn`, `created_at`, `updated_at`) VALUES
	(1, 'ROLE_SUPER_ADMIN', 'Y', '2019-08-22 09:52:36', NULL),
	(2, 'ROLE_ADMIN', 'Y', '2019-08-22 09:52:36', NULL),
	(3, 'ROLE_CLIENT', 'Y', '2019-08-22 09:52:37', NULL),
	(4, 'ROLE_USER', 'Y', '2019-08-22 09:52:38', NULL);

INSERT INTO `resources` (`resource_no`, `name`, `http_method`, `order_num`, `type`, `use_yn`, `created_at`, `updated_at`) VALUES
	(1, '/api/boards', NULL, 1, 'url', 'N', '2021-09-25 20:08:45', NULL);
	

INSERT INTO `role_resources_mapping` (`resource_no`, `role_no`, `use_yn`, `created_at`, `updated_at`) VALUES
	(1, 1, 'Y', '2020-11-28 16:27:12', NULL);
	
	
INSERT INTO `role_hierarchy` (`role_hierarchy_no`, `parent_name`, `child_name`) VALUES
	(1, '', 'ROLE_SUPER_ADMIN'),
	(2, 'ROLE_SUPER_ADMIN', 'ROLE_ADMIN'),
	(3, 'ROLE_ADMIN', 'ROLE_CLIENT'),
	(4, 'ROLE_CLIENT', 'ROLE_USER');
```

인가 처리시 사용되는 DB 데이터 입니다.

role 테이블에서는

* ROLE_SUPER_ADMIN
* ROLE_ADMIN
* ROLE_CLIENT
* ROLE_USER

권한 목록을 추가 합니다.

그리고 resource 테이블에서는 어떤 자원을 url 방식으로 저장 합니다.

한 resource 자원 정보는 어떤 role 과 매칭 하는지 role_resources_mapping 테이블로 지정 합니다.

role_hierarchy 테이블은 role 계층 정보 입니다.

만약 해당 resource 정보의 권한이 'ROLE_CLIENT' 이라면 그보다 계층이 높은 'ROLE_SUPER_ADMIN' 통해 유저가 해당 자원을 접속 할 경우 권한을 통과 할수 있도록 설정 할 수 있는 테이블 입니다.


### Spring Security FilterInvocationSecurityMetadataSource 구현하기

Spring Security 에서는 권한 체크시 요청정보과 매칭되는 권한정보 추출 역활을 하는 SecurityMetadataSource 자식 클래스인 FilterInvocationSecurityMetadataSource(URL 자원 정보 체크 담당) 클래스에 구현되어 있습니다.

자세한 내용은 Spring Security 인가 처리편에 자세히 설명 할 예정입니다.

간단히 설명하자면 Spring Security 에서 URL 자원 정보 통해 권한 체크시 요청정보과 매칭되는 권한정보 추출 역활을 하는 FilterInvocationSecurityMetadataSource 를 Custom 해서 구현 할겁니다.

즉 기존에는 직접 소스코드(Spring Security 설정)에서 입력한 권한 정보 및 자원 정보들을 가져와 체크 하는것이 아닌 우리가 만든 DB 에서 접근 자원 및 권한 정보들을 모두 가져 올수 있도록 Custom 할겁니다.

참고로 접근 자원 및 권한 정보 로직만 Custom 하고 그 이후 Spring Security 에서 구현한 권한 체크 담당은 AccessDecisionManager 에서 최종적으로 하게 됩니다.

즉 우리가 DB에(resource 테이블) 입력한 권한 목록 및 자원정보를 가져와 requestMap(Map 테이블)에 저장하고(동시에 빈으로 생성한다.) 호출된 resource url 과 requestMap 를 비교해서 해당되는 권한 정보가 있다면

해당되는 권한 목록(requestMap) 중 권한 정보를 가져와 AccessDecisionManager 에 전달하게 되고 권한이 성립되는지 결정 하게 됩니다.

UrlFilterInvocationSecurityMetadataSource.java
```markdown
@Slf4j
public class UrlFilterInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {

    private LinkedHashMap<RequestMatcher, List<ConfigAttribute>> requestMap = new LinkedHashMap<>();
    private ResourceQueryService resourceQueryService;

    public UrlFilterInvocationSecurityMetadataSource(LinkedHashMap<RequestMatcher, List<ConfigAttribute>> resourcesMap, ResourceQueryService resourceQueryService) {
        this.requestMap = resourcesMap;
        this.resourceQueryService = resourceQueryService;
    }

    @Override
    public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {

        HttpServletRequest request = ((FilterInvocation) o).getRequest();

        if (requestMap != null) {
            for (Map.Entry<RequestMatcher, List<ConfigAttribute>> entry : requestMap.entrySet()) {

                RequestMatcher matcher = entry.getKey();

                if (matcher.matches(request)) {
                    return entry.getValue();
                }
            }
        }

        return null;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        Set<ConfigAttribute> allAttributes = new HashSet<>();

        for (Map.Entry<RequestMatcher, List<ConfigAttribute>> entry : requestMap.entrySet()) {
            allAttributes.addAll(entry.getValue());
        }

        return allAttributes;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return FilterInvocation.class.isAssignableFrom(aClass);
    }

    public void reload() {

        LinkedHashMap<RequestMatcher, List<ConfigAttribute>> reloadedMap = resourceQueryService.getResourceList();
        Iterator<Map.Entry<RequestMatcher, List<ConfigAttribute>>> iterator = reloadedMap.entrySet().iterator();

        requestMap.clear();

        while (iterator.hasNext()) {
            Map.Entry<RequestMatcher, List<ConfigAttribute>> entry = iterator.next();
            requestMap.put(entry.getKey(), entry.getValue());
        }
    }
}
```

``private LinkedHashMap<RequestMatcher, List<ConfigAttribute>> requestMap = new LinkedHashMap<>();``

requestMap 에서는 스프링이 초기 기동시 우리가 만든 DB 에서 요청정보과 매칭되는 권한정보(resource 테이블) 가져와 저장하게 됩니다.

Key: 요청 url 정보<br>
Value: 해당 요청 url 정보에 대한 role 정보 <br>

Ex> key -> 'api/boards', value -> 'ROLE_USER'

```markdown
@Override
public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {

    HttpServletRequest request = ((FilterInvocation) o).getRequest();

    if (requestMap != null) {
        for (Map.Entry<RequestMatcher, List<ConfigAttribute>> entry : requestMap.entrySet()) {

            RequestMatcher matcher = entry.getKey();

            if (matcher.matches(request)) {
                return entry.getValue();
            }
        }
    }

    return null;
}
```
우리가 만든 DB 에서 요청정보과 매칭되는 권한정보(resource 테이블) 가져와 for 문으로 실행해서 실제 HttpServletRequest 통해 요청 url 매칭 된다면

권한 정보를 추출 해서 리턴하게 됩니다.

```markdown
@Override
public boolean supports(Class<?> aClass) {
    return FilterInvocation.class.isAssignableFrom(aClass);
}
```

앞써 설명한대로 Spring Security 에서는 URL 방식의 권한 검증과 메소드 방식의 권한 검증이 있습니다.

우리는 URL 방식으로 권한 정보를 검증하기 때문에 URL 방식으로 설정한 것이 통과 된다면

Override 한 메소드가 실행 할 수 있도록 검증 하는 supports 메소드 입니다.

SecurityConfig.java
```markdown
@Bean
public PermitAllFilter customFilterSecurityInterceptor() throws Exception {

    PermitAllFilter permitAllFilter = new PermitAllFilter(permitAllResources);
    permitAllFilter.setSecurityMetadataSource(urlFilterInvocationSecurityMetadataSource());
    permitAllFilter.setAccessDecisionManager(affirmativeBased());

    return permitAllFilter;
}
```

```markdown
PermitAllFilter permitAllFilter = new PermitAllFilter(permitAllResources);
permitAllFilter.setSecurityMetadataSource(urlFilterInvocationSecurityMetadataSource());
```
우리가 만든 UrlFilterInvocationSecurityMetadataSource 클래스를 기존 Spring Security 에서 사용되는 FilterInvocationSecurityMetadataSource 대신해 사용 하겠다는 의미이다.

``permitAllFilter.setAccessDecisionManager(affirmativeBased());``

접근 결정 관리자를 설정하는 부분 입니다. Spring Security 에서는 총 3가지가 있는데

* AffirmativeBased
* ConsensusBased
* UnanimousBased

보편적으로 AffirmativeBased 를 많이 사용됩니다. 하나만 승인되도 통과됩니다.


### Spring Security UrlResourcesMapFactoryBean 구현하기


UrlResourcesMapFactoryBean.java
```markdown
public class UrlResourcesMapFactoryBean implements FactoryBean<LinkedHashMap<RequestMatcher, List<ConfigAttribute>>> {

    private ResourceQueryService resourceQueryService;
    private LinkedHashMap<RequestMatcher, List<ConfigAttribute>> resourceMap;

    public void setSecurityResourceService(ResourceQueryService resourceQueryService) {
        this.resourceQueryService = resourceQueryService;
    }

    @Override
    public LinkedHashMap<RequestMatcher, List<ConfigAttribute>> getObject() throws Exception {

        if (resourceMap == null) {
            init();
        }

        return resourceMap;
    }

    private void init() {
        resourceMap = resourceQueryService.getResourceList();
    }

    @Override
    public Class<?> getObjectType() {
        return LinkedHashMap.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

Spring 에서 지원하는 FactoryBean 을 이용해 Bean 을 생성 합니다.

Spring 기동시 DB 로부터 권한 정보 및 자원 정보를 가져와 (resource 테이블) resourceMap 에 Map 형식으로 저장 할겁니다.

```markdown
@Override
public LinkedHashMap<RequestMatcher, List<ConfigAttribute>> getObject() throws Exception {

    if (resourceMap == null) {
        init();
    }

    return resourceMap;
}

private void init() {
    resourceMap = resourceQueryService.getResourceList();
}
```

ResourceQueryService.java
```markdown
private final ResourceRepository resourceRepository;

public LinkedHashMap<RequestMatcher, List<ConfigAttribute>> getResourceList() {

    LinkedHashMap<RequestMatcher, List<ConfigAttribute>> result = new LinkedHashMap<>();

    List<Resource> resourcesList = resourceRepository.findAllResources();

    resourcesList.forEach(resource -> {

        List<ConfigAttribute> configAttributeList = new ArrayList<>();

        resource.getRoleSet().forEach(role -> {
            configAttributeList.add(new SecurityConfig(role.getName()));
        });

        result.put(new AntPathRequestMatcher(resource.getName()), configAttributeList);
    });

    return result;
}
```

getResourceList 메소드는 DB 에 있는 resource 테이블의 데이터를 가져와서 Hash Map 으로 저장 하는 역활을 합니다.

resource 테이블과 매핑된 role 테이블의 데이터들을 가져와 'resourcesList' HashMap 에 저장 합니다.

```markdown
@Override
public boolean isSingleton() {
    return true;
}
```

해당 HashMap 은 싱글톤으로 관리 하도록 합시다.

SecurityConfig.java
```markdown
private AccessDecisionManager affirmativeBased() {

    AffirmativeBased affirmativeBased = new AffirmativeBased(getAccessDecisionVoters());
    return affirmativeBased;
}

private List<AccessDecisionVoter<? extends Object>> getAccessDecisionVoters() {

    List<AccessDecisionVoter<? extends Object>> accessDecisionVoters = new ArrayList<>();
    accessDecisionVoters.add(roleVoter());  // Role Hierarchy 이용하기

    return accessDecisionVoters;
}

@Bean
public AccessDecisionVoter<? extends Object> roleVoter() {
    RoleHierarchyVoter roleHierarchyVoter = new RoleHierarchyVoter(roleHierarchy());
    return roleHierarchyVoter;
}

@Bean
public RoleHierarchyImpl roleHierarchy() {
    RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
    return roleHierarchy;
}

@Bean
public FilterInvocationSecurityMetadataSource urlFilterInvocationSecurityMetadataSource() throws Exception {
    return new UrlFilterInvocationSecurityMetadataSource(urlResourcesMapFactoryBean().getObject(), resourceQueryService);
}

private UrlResourcesMapFactoryBean urlResourcesMapFactoryBean() {

    UrlResourcesMapFactoryBean urlResourcesMapFactoryBean = new UrlResourcesMapFactoryBean();
    urlResourcesMapFactoryBean.setSecurityResourceService(resourceQueryService);

    return urlResourcesMapFactoryBean;
}
```
마지막으로 Resource 권한 정보를 담겨져 있는 UrlResourcesMapFactoryBean 빈을 앞에 생성한 UrlFilterInvocationSecurityMetadataSource 클래스에게 전달 해야 합니다.

생성자로 통해 전달 하도록 합니다.

### 인가처리 동적 반영하기

Resource 테이블에 권한 정보 목록이 만약 수정 된다면 싱글톤으로 관리 하고 있는 'resourceMap' 정보도 수정되어야 합니다.

UrlFilterInvocationSecurityMetadataSource.java
```markdown
public boolean supports(Class<?> aClass) {
    return FilterInvocation.class.isAssignableFrom(aClass);
}

public void reload() {

    LinkedHashMap<RequestMatcher, List<ConfigAttribute>> reloadedMap = resourceQueryService.getResourceList();
    Iterator<Map.Entry<RequestMatcher, List<ConfigAttribute>>> iterator = reloadedMap.entrySet().iterator();

    requestMap.clear();

    while (iterator.hasNext()) {
        Map.Entry<RequestMatcher, List<ConfigAttribute>> entry = iterator.next();
        requestMap.put(entry.getKey(), entry.getValue());
    }
}
```
UrlFilterInvocationSecurityMetadataSource 클래스에 reload 메소드를 새로 생성 합니다.

``LinkedHashMap<RequestMatcher, List<ConfigAttribute>> reloadedMap = resourceQueryService.getResourceList();``

새로 수정된 resource 정보 데이터를 DB 에서 가져와서 최신 정보로 reloadedMap 데이터에 업데이트 하게 됩니다.



### 인가처리 PermitAllFilter 구현하기

Spring Security 인가 처리 프로세스를 다시 생각해봅시다.

Spring 초기 기동시 resource 테이블에 데이터를 가져와 key (url 정보) value (권한정보) 를 reloadedMap 에 저장 합니다.

이후 요청 받을때 인가 처리시 초기에 FilterSecurityInterceptor 요청 받게 되는데 여기서 request 요청 url 를 이용해서

저장된 인증 정보 reloadedMap 에 해당 url 정보를 찾게 됩니다.

만약 정보가 없다면 null 로 리턴 하게 된다면 AccessDecisionManager 에 전달 되지 않아 인가 성립 시킵니다.

만약 해당 값이 존재한다면 reloadedMap 에 해당 권한 정보값과 유저 값을 AccessDecisionManager 에 전달하게 되고 권한이 성립되는지 결정 하게 됩니다.

우리는 여기서 PermitAllFilter(FilterSecurityInterceptor 상속 받는 클래스) 자체적으로 구현해서 인가 처리 할 필요없는 url 을 미리 특정 변수에 List 형식에 저장시키고

요청 url 과 List 형식으로 저장한 인가 처리 할 필요없는 url 정보와 매핑 된다면 null 로 리턴 시켜 일부러 AccessDecisionManager 전달 되지 않게 해서 인가 성립 하게 됩니다.

SecurityConfig.java
```markdown

private String[] permitAllResources = {"/", "/categories"};

@Bean
public PermitAllFilter customFilterSecurityInterceptor() throws Exception {

    PermitAllFilter permitAllFilter = new PermitAllFilter(permitAllResources);
    permitAllFilter.setSecurityMetadataSource(urlFilterInvocationSecurityMetadataSource());
    permitAllFilter.setAccessDecisionManager(affirmativeBased());

    return permitAllFilter;
}
```

Spring Security 설정 페이지에서 우리가 인가 처리 할 필요없는 url 을 'permitAllResources' 변수로 지정합니다.

그런 다음 FilterSecurityInterceptor extend 한 PermitAllFilter 클래스를 만들어 생성자 통해 값을 전달 시킵니다.

PermitAllFilter.java
```markdown
public class PermitAllFilter extends FilterSecurityInterceptor {

    private static final String FILTER_APPLIED = "__spring_security_filterSecurityInterceptor_filterApplied";
    private boolean observeOncePerRequest = true;

    private List<RequestMatcher> permitAllRequestMatchers =  new ArrayList<>();

    public PermitAllFilter(String...permitAllResources){

        for (String resource : permitAllResources) {
            permitAllRequestMatchers.add(new AntPathRequestMatcher(resource));
        }
    }

    @Override
    protected InterceptorStatusToken beforeInvocation(Object object) {

        boolean permitAll = false;
        HttpServletRequest request = ((FilterInvocation) object).getRequest();
        for (RequestMatcher requestMatcher : permitAllRequestMatchers) {
            if (requestMatcher.matches(request)) {
                permitAll = true;
                break;
            }
        }

        if (permitAll) {
            return null;
        }

        return super.beforeInvocation(object);
    }

    public void invoke(FilterInvocation fi) throws IOException, ServletException {
        if ((fi.getRequest() != null)
                && (fi.getRequest().getAttribute(FILTER_APPLIED) != null)
                && observeOncePerRequest) {
            // filter already applied to this request and user wants us to observe
            // once-per-request handling, so don't re-do security checking
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } else {
            // first time this request being called, so perform security checking
            if (fi.getRequest() != null && observeOncePerRequest) {
                fi.getRequest().setAttribute(FILTER_APPLIED, Boolean.TRUE);
            }

            InterceptorStatusToken token = beforeInvocation(fi);

            try {
                fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
            }
            finally {
                super.finallyInvocation(token);
            }

            super.afterInvocation(token, null);
        }
    }
}
```

beforeInvocation 메소드를 override 를 해서 요청 url 값과 생성자 통해 주입 받았던 인가 처리 할 필요없는 url 정보 데이터와 매핑 되는지

체크 후 매핑 되는것이 없다면 null 반환 시켜 AccessDecisionManager 전달 되지 않게 해서 인가 성립 하게 됩니다.


### 인가처리 계층 권한 구현하기

앞써 role 테이블 우리는

* ROLE_SUPER_ADMIN
* ROLE_ADMIN
* ROLE_CLIENT
* ROLE_USER

이렇게 총 4개 role 정보를 설정 했습니다.

그런데 만약 해당 resource 정보가 'ROLE_CLIENT' 이라면 그보다 계층이 높은 'ROLE_SUPER_ADMIN' 통해 유저가 해당 자원을 접속 할 경우

권한을 통과 되도록 해야 합니다. 하지만 일반적으로 Spring Security 에서는 설정을 하지 않는 이상 'ROLE_SUPER_ADMIN' 이나'ROLE_CLIENT' 는 서로 다른 권한 정보로 판단합니다.

즉 'ROLE_SUPER_ADMIN' 는 'ROLE_CLIENT' 보다 높은 계층 권한임을 설정 해야 합니다.

그것이 role_hierarchy 테이블이 있는 이유 입니다.

|parent_name|child_name|
|------|------|
| |ROLE_SUPER_ADMIN|
|ROLE_SUPER_ADMIN|ROLE_ADMIN|
|ROLE_ADMIN|ROLE_CLIENT|
|ROLE_CLIENT|ROLE_USER|


-> ROLE_SUPER_ADMIN > ROLE_ADMIN > ROLE_CLIENT > ROLE_USER

parent_name, child_name 각각 지정 하므로써 각각 role 권한 정보가 어떤 계층인지 표현 할 수 있습니다.

SecurityConfig.java
```markdown

private List<AccessDecisionVoter<? extends Object>> getAccessDecisionVoters() {

    List<AccessDecisionVoter<? extends Object>> accessDecisionVoters = new ArrayList<>();
    accessDecisionVoters.add(roleVoter());  // Role Hierarchy 이용하기

    return accessDecisionVoters;
}

@Bean
public AccessDecisionVoter<? extends Object> roleVoter() {
    RoleHierarchyVoter roleHierarchyVoter = new RoleHierarchyVoter(roleHierarchy());
    return roleHierarchyVoter;
}

@Bean
public RoleHierarchyImpl roleHierarchy() {
    RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
    return roleHierarchy;
}
```
Spring Security 에서 각각의 권한 설정의 계층을 설정 할때

``ROLE_SUPER_ADMIN > ROLE_ADMIN > ROLE_CLIENT > ROLE_USER``

이렇게 String 형식으로 전달 하게 하면 됩니다. 이것을 Spring Security 에서 지원하는 RoleHierarchy 클래스에 전달 하면 됩니다.

RoleHierarchy 구현체인 RoleHierarchyImpl 를 빈으로 등록 한 다음 (빈으로 등록한 이유는 바로 아래 설명이 나옵니다.) RoleHierarchyVoter 생성자로 주입 하면 됩니다.

RoleHierarchyQueryService.java
```markdown
private final RoleHierarchyRepository roleHierarchyRepository;
 
 public String selectHierarchies() {
 
     List<RoleHierarchy> rolesHierarchy = roleHierarchyRepository.findAll();
 
     Iterator<RoleHierarchy> roleHierarchyIterator = rolesHierarchy.iterator();
     StringBuilder stringBuilder = new StringBuilder();
 
     while (roleHierarchyIterator.hasNext()) {
 
         RoleHierarchy roleHierarchy = roleHierarchyIterator.next();
         if (roleHierarchy.getParentName() != null) {
             stringBuilder.append(roleHierarchy.getParentName().getChildName());
             stringBuilder.append(" > ");
             stringBuilder.append(roleHierarchy.getChildName());
             stringBuilder.append("\n");
         }
     }
 
     return stringBuilder.toString();
 }
```

```markdown
@Component
@RequiredArgsConstructor
public class SecurityInitializer implements ApplicationRunner {

    private final RoleHierarchyQueryService roleHierarchyQueryService;
    private final RoleHierarchyImpl roleHierarchy;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String allHierarchy = roleHierarchyQueryService.selectHierarchies();
        roleHierarchy.setHierarchy(allHierarchy);
    }
```

ApplicationRunner 이용해서 Spring Boot 기동 될때 RoleHierarchyQueryService 클래스의 selectHierarchies 메소드를 호출 해서

role_hierarchy 테이블에 있는 계층 권한 정보를 가져와

``ROLE_SUPER_ADMIN > ROLE_ADMIN > ROLE_CLIENT > ROLE_USER``

이렇게 String 형식으로 return 하게 됩니다. Spring Security 설정 페이지에서 빈으로 등록한 'RoleHierarchyImpl' 에 setHierarchy 메소드에 전달 하게 되면 설정은 끝나게 됩니다.

### 마치면서

권한의 인증 인가 처리는 실제 프로젝트 운영시 아주 중요한 요소 입니다. 한번의 실수로 모든 서비스가 엉망이 되기 때문입니다.

이 중요한 인증 인가 처리를 처음부터 끝까지 직접 손으로 하나하나 구현하는 것은 너무 힘든 부분이 아닐수 없습니다.

그래서 Spring Security 의 힘을 빌려서 최소한의 설정 및 커스텀 해서 서비스에 알맞게 반영 하였습니다.

그러나 전반적인 Spring Security 내용과 흐름을 알지 못하는 상황이라면 어려운 요소 일수도 있습니다.

그만큼 권한 부분은 어렵다고 느껴집니다. 다음에는 Spring Security 심도있게 준비해서 다음 블로그를 준비 하도록 하겠습니다.

여기까지 읽어주셔서 감사합니다.
