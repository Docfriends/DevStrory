---
layout: post
title: "Spring Boot 를 이용해 JWT + Social 로그인 처리 - Authorization Server (일반 로그인)"
description: "Spring Security + JWT 로그인 처리 합니다."
date: 2021-10-08
tags: [JAVA, Spring, Security, JWT]
writer: syh8088
category: JAVA
comments: true
share: true
---

# 예제 소스 코드
이번 블로그에 사용되는 코드는 아래 링크 통해 확인 할 수 있습니다.

Authorization Server
https://github.com/syh8088/spring-restful-authorization-v2 (Spring Boot)

Resource Server
https://github.com/syh8088/Kiwi-Board (Spring Boot)

Client Server
https://github.com/syh8088/Kiwi-Board-Front (Vue Nuxt)

## 로그인 구현 페이지

![Formula]({{ site.url }}{{ site.baseurl }}/images/2021/spring-boot-security-jwt-social/login.git)


![Formula]({{ site.url }}{{ site.baseurl }}/images/2021/spring-boot-security-jwt-social/social_login.git)

## DB 구성

시작하기 앞써서 회원 정보 및 권한 그리고 리소스 관련 테이블을 설명 하도록 하겠습니다.

![Formula]({{ site.url }}{{ site.baseurl }}/images/2021/spring-boot-security-jwt-social/erd.PNG)

* member: 기본적인 회원 정보 테이블 입니다.
* member_social: 해당 회원이 만약 social 계정 통해 로그인 할때 관련 테이블 입니다. member 테이블 하고 OneToOne 관계 입니다.
* member_role_mapping: member 테이블하고 role 테이블 매핑 테이블 입니다. 한 유저당 여러 권한을 가질수 있도록 매핑 테이블로 설계 했습니다.
* role: 해당 회원의 권한 정보 테이블 입니다.
* role_resource_mapping: role 테이블하고 resource 테이블의 매핑 테이블 입니다.
* resource: 해당 role 이 권한 처리에 대한 resource 정보 테이블 입니다. 뒤에 인가 처리 part 에서 설명 하겠지만 해당 role 이 각각의 자원에 호출 대한 권한 및 인가 정보를 담고 있습니다.
* role_hierarchy: 권한 계층 정보 테이블 입니다. 예를들어 해당 자원이 role 중 'USER' 에게만 접속이 가능 하더라도 role 'ADMIN' 는 role 'USER' 보다 상위 계층이면 'ADMIN' 유저는 해당 자원에 접근 가능 합니다. 이때 계층 정보 데이터를 관리 할 수 있는게 role_hierarchy 테이블 입니다.

## Spring Boot 를 이용해 JWT 및 Social 인증, 인가 처리

Spring Boot 및 Social(KaKao) 를 이용하여 JWT 인증 및 인가 구현 하고 더불어 Social(KaKao) 인증 기능 통합 하는 방법에 대해 알아보는 시간을 갖겠습니다.

Social 로그인 경우 KaKao 뿐만 아니라 Google, Naver 등 가능 하도록 구현 했습니다.

본 글에 앞써 JWT 및 OAuth 2.0 기본적인 내용을 파악 하는 것이 좋습니다.

JWT 개념 파악하기 - https://docfriends.github.io/DevStrory/2021-09-27/jwt<br>
OAuth 2.0 개념 파악하기 - https://docfriends.github.io/DevStrory/2021-09-27/oauth2.0

그럼 시작 하도록 하겠습니다.

### JWT 인증 다이어그램

![Formula]({{ site.url }}{{ site.baseurl }}/images/2021/spring-boot-security-jwt-social/jwt_diagram.PNG)

JWT 인증 다이어그램 입니다.

첫째로 Client 서버로 부터 해당 계정의 ID/PASSWORD 데이터를 Authorization Server 에 전달 하게 되면(로그인 시도)

해당 데이터를 실제로 존재하는지 그리고 올바른 Password 를 입력했는지 검증하게 됩니다.

검증을 완료 되었으면 JWT Token 을 만들어서 응답 하게 됩니다.

이때 Client 는 Resource 를 접근 할때 발급 받았던 JWT Token 을 이용해서 Request 하게 됩니다.

검증이 완료 된다면 접근한 Resource 데이터를 응답 하는 형식 입니다.

### Authorization Server 구현

* Java 8
* Spring boot 2.4.10
* Spring boot Security 2.4.10

### Spring Security 설정

보안 설정 라이브러리는 Spring Security 를 사용했습니다.

인증 및 인가 처리에 대한 각각의 Filter 제공 및 Custom 가능하고 보안과 관련해서 체계적으로 많은 옵션을 제공해주기 때문에

선택 하였습니다. 개발자는 보안 이슈에 대한 하나하나 로직 구현 수고를 없애고 오로지 비니지니 로직에 집중 할 수 있습니다.

Spring Security 를 적용하기전 기본적인 제공하는 각각의 Filter 가 어떤 방식으로 구현되는지 및 전반적인 지식이 필요 합니다.

이는 나중에 하나하나 블로그를 제작 할 예정입니다.

지금은 우선 Spring Security 설정 적용 했다는 의미로 받아주시면 되겠습니다.

SecurityConfig.java
```markdown
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
                .antMatchers("/csrf-token").permitAll()
                .antMatchers(HttpMethod.POST, "/authorize", "/authorize/refresh", "/users").anonymous()
                .antMatchers(HttpMethod.POST, "/oauth/unlink").authenticated()
                .antMatchers("/oauth/**").permitAll()
                .anyRequest().authenticated().and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
    }
```

Spring Security 기본적인 사용자 정의 보안 설정 입니다.

Spring boot 가 기동 될때 해당 설정값을 통해 보안 전략이 변경 됩니다.

하나하나씩 알아보도록 하겠습니다.

``.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)``

이번에 개발하는 웹 통신 방식은 Stateless 로 구현해야 하기 때문에 설정하였습니다.

이는 JWT Token 특성 때문에 가능 합니다.

```markdown
.formLogin().disable()
.logout().disable()
.httpBasic().disable()
```

더불어 JWT 토큰 방식으로 인증 및 인가 처리 하기 때문에 Security 에서 기본적으로 제공하는 FORM 로그인, Logout 등 옵션을 비활성화 하고 자체적으로 Custom 하기로 했습니다.


```markdown
authorizeRequests()
    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    .antMatchers(HttpMethod.POST, "/authorize", "/authorize/refresh", "/users").anonymous()
    .antMatchers(HttpMethod.POST, "/oauth/unlink").authenticated()
    .antMatchers("/oauth/**").permitAll()
    .anyRequest().authenticated().and()
```

``.antMatchers(HttpMethod.POST, "/authorize", "/authorize/refresh", "/users").anonymous()``
OPTIONS 메소드와 POST 메소드 중 "/authorize", "/authorize/refresh" 는 인증 및 인가 처리 하지 않는 다는 의미 입니다.

``POST - /oauth/unlin`` 해당 URL 에 인증을 받겠다는 의미 입니다.

``.antMatchers("/oauth/**").permitAll()`` 해당 URL 는 인증 하지 않는다는 의미 입니다.

``.anyRequest().authenticated()`` 그외 모든 요청은 인증을 받겠다는 의미 입니다.


SecurityConfig.java
```markdown
private final UserServiceHandler userServiceHandler;

@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userServiceHandler).passwordEncoder(passwordEncoder());
}
```

AuthenticationManager (인증 처리 manager) 에서 authenticate 메소드 통해 인증 처리시

Custom 한  UserServiceHandler, PasswordEncoder 사용 하겠다는 의미 입니다.

UserServiceHandler 는 client 에서 전달 받은 ID/PASSWORD 데이터가 실제로 존재 하는지 그리고 패스워드가 올바르게 일치 하는지

검증 하는 Custom 구현한 클래스 입니다.

그리고 패스워드 암호화는 PasswordEncoder 를 사용하겠다는 의미입니다.

## 인증 처리 방법 (로그인 검증)

client 으로 부터 ID/PASSWORD 요청 받으면 Spring Security 에서 어떻게 인증(로그인) 처리 하는지 알아보겠습니다.

AuthenticationController.java -> @PostMapping("/authorize")
```markdown
Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
                authorizationRequest.getUsername(),
                authorizationRequest.getPassword()
        )
);
```
client 으로 부터 ID/PASSWORD 요청 받는 데이터는

UsernamePasswordAuthenticationToken 통해 요청 받은 ID/PASSWORD 를 담아서 인증 객체를 생성 하게 됩니다.

그런 다음 Spring Security 에 authenticationManager 에 인증 위임을 전달 하게 됩니다.

전달 받은 authenticationManager 는 우리가 Custom 한 UserServiceHandler 클래스에서 인증 검증을 하게 됩니다.

### ID/PASSWORD 검증

UserServiceHandler.java
```markdown
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceHandler implements UserDetailsService {

    private final MemberQueryService memberQueryService;
    private final RoleQueryService roleQueryService;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Member member = memberQueryService.selectMemberById(username);

        if (member == null) {
            throw new UserIdNotFoundException(MemberErrorCode.NOT_FOUND_USERNAME);
        }

        List<Role> roles = roleQueryService.selectAllRolesByMember(member);

        List<SimpleGrantedAuthority> grants = roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());

        PrincipalDetails userDetails = PrincipalDetails.builder()
                .id(member.getMemberNo())
                .username(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .password(member.getPassword())
                .memberType(member.getMemberType())
                .authorities(grants)
                .build();

        return userDetails;
    }
}
```
앞서 설명한 UserServiceHandler 는 ID/PASSWORD 검증 및 구현한 로직 입니다.

Default 로 Spring Security 에서는 UserDetailsService 에서 처리 하게 되는데 이것을 Override 를 하게 되어 대신 사용 하겠다는 의미 입니다.

client 으로 부터 ID/PASSWORD 요청 받게 된다면 Spring Security 는 Authentication 인증 객체를 담아서

AuthenticationManager 에 전달하게 되고 인증 처리 하게 됩니다.

그 이후 UserServiceHandler 클래스의 loadUserByUsername 매소드가 실행 되면서 직접 Custom 한 인증 처리를 하게 됩니다.

성공적으로 인증 처리가 완료 된다면 Spring Security 가 제공하는 인증 객체 UserDetails Override 한 PrincipalDetails 객체에

해당 계정 정보를 담아서 return 하게 됩니다.

그런 후 Spring Security 에서는 자체적으로 해당 인증 객체를 SecurityContext 에 저장 하게 됩니다.

SecurityContext 는 Local Thread 에 한에서 전역적으로 해당 인증 객체를 참조 가능 합니다.


AuthenticationController.java -> @PostMapping("/authorize")
```markdown
PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

String accessToken = generateAccessToken(principalDetails, request, response);
String refreshToken = generateRefreshToken(principalDetails, request, response);

AuthorizationResponse authorizationResponse = AuthorizationResponse.builder()
        .access_token(accessToken)
        .refresh_token(refreshToken)
        .expires_in(jwtProperties.getAccessTokenExpired())
        .member_seq(principalDetails.getId())
        .member_id(principalDetails.getUsername())
        .authorities(principalDetails.getAuthorities())
        .build();

return ResponseEntity.ok().body(authorizationResponse);
```
UserServiceHandler 에서 인증 검증을 완료하고 인증 객체를 return 받게 됩니다.

해당 인증 객체를 이용해 JWT Access Token 을 생성 할 차례 입니다.

JwtTokenProvider.java
```markdown
private String generateToken(Map<String, Object> claims, String subject, String key, Long expiryTime) {

    LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(expiryTime);
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(TimeConverter.toDate(LocalDateTime.now()))
            .setExpiration(TimeConverter.toDate(expiryDate))
            .signWith(jwtProperties.getSignatureAlgorithm(), key)
            .compact();
}
``` 
application.yml 에서 설정한 토큰 유효시간 및 비밀키 그리고 return 받았던 인증 객체 정보를 이용해

JWT 토큰을 생성하는 로직입니다.

생성 한 토큰은 AuthorizationResponse 클래스에 담아서 최종적으로 응답 하게 됩니다.

