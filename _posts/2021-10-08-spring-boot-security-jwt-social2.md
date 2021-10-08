---
layout: post
title: "Spring Boot 를 이용해 JWT + Social 로그인 처리 - Authorization Server (Social 로그인)"
description: "Spring Security + Social 로그인 처리 합니다."
date: 2021-10-08
tags: [JAVA, Spring, Security, JWT, Oauth2.0]
writer: syh8088
category: JAVA
comments: true
share: true
---
## Spring Boot 를 이용해 JWT 및 Social 인증, 인가 처리

Social 인증을 통해 사용자는 KaKao, Naver, Google 와 같은 기존 계정 ID 를 이용하여 인증 할 수 있습니다.

번거롭게 회원가입 양식을 작정 할 필요가 없고 패스워드를 기억할 필요가 없기 때문에 웹사이트에서 사용자 경험을 향상시킵니다.

### Social 인증 다이어그램

![Formula]({{ site.url }}{{ site.baseurl }}/images/2021/spring-boot-security-jwt-social/social_diagram.PNG)

Social 인증 다이어그램 입니다.

첫째로 우선 KaKao 인증 서버 통해 KaKao 로그인을 합니다. 그럼 KaKao 개발자센터에 등록된 redirect url 로 access token 을 발급 받게 됩니다.

Oauth 2.0 Authorization Code Grant 방식과 달리 client_secret 를 이용하지 않고 권한 부여 승인 코드 없이 바로 Access Token이 발급 됩니다.

이를 Implicit Grant(암묵적 승인 방식) 이라고 합니다.

KaKao 전용 access token 을 발급 받게 되면 이것을 Authorization Server 에 전달 하게 됩니다.

해당 서버는 이 access token 을 가지고 KaKao 로그인한 해당 유저 정보를 가져오고 정상적으로 인증이 이루어지면 JWT access token 을 발급 해주게 됩니다.

지금 부터 해당 내용 토대로 어떻게 로직을 구성 했는지 알아봅시다.

### Authorization Server 구현 (Social 로그인)

### Controller 설정

OAuthController.java
```markdown
@PostMapping("/oauth/authorize/{provider}")
public ResponseEntity<AuthorizationResponse> authenticateSocialLogin(
        @PathVariable Provider provider, @RequestBody OAuthAuthorizationLoginRequest oAuthAuthorizationLoginRequest,
        HttpServletRequest request, HttpServletResponse response
) {

    memberValidator.authenticateSocialLogin(oAuthAuthorizationLoginRequest);

    String accessToken = oAuthAuthorizationLoginRequest.getAccessToken();
    String refreshToken = oAuthAuthorizationLoginRequest.getRefreshToken();
    LocalDateTime expiredAt = oAuthAuthorizationLoginRequest.getExpiredAt();

    OAuthService oAuthService = OAuthServiceFactory.getOAuth2Service(provider, restTemplate);

    ClientRegistration clientRegistration = clientRegistrationRepository.selectByRegistrationId(provider.getProvider());
    OAuthMeResponse oAuthMeResponse = oAuthService.getMe(clientRegistration, accessToken);

    OAuthTokenResponse oAuthTokenResponse = OAuthTokenResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .expiredAt(expiredAt)
            .build();

    PrincipalDetails principalDetails = (PrincipalDetails) memberQueryService.loadUserByOAuth(provider, oAuthTokenResponse, oAuthMeResponse);
    String jwtAccessToken = authenticationService.generateAccessToken(principalDetails, request, response);
    String jwtRefreshToken = authenticationService.generateRefreshToken(principalDetails, request, response);

    AuthorizationResponse authorizationResponse = authenticationService.createAuthorizationResponse(jwtAccessToken, jwtRefreshToken, principalDetails);

    return ResponseEntity.ok().body(authorizationResponse);
}
```

Client 서버가 KaKao access token 을 발급 받게 되고 해당 token 을 Authorization Server 에 전달 할때 사용되는 Controller 단 입니다.

``@PathVariable Provider provider``

Provider 는 'KAKAO', 'NAVER', 'GOOGLE' Social 목록을 enum 으로 관리 했습니다.

``OAuthService oAuthService = OAuthServiceFactory.getOAuth2Service(provider, restTemplate);``

Provider 따라 KaKao, Naver, Google Flow 가 다르기 때문에 팩토리 패턴으로 이를 분리 및 관리 했습니다.

``OAuthMeResponse oAuthMeResponse = oAuthService.getMe(clientRegistration, accessToken);``

해당 Social access token 으로 유저 정보를 가져오는 메소드 입니다.

```markdown
PrincipalDetails principalDetails = (PrincipalDetails) memberQueryService.loadUserByOAuth(provider, oAuthTokenResponse, oAuthMeResponse);
String jwtAccessToken = authenticationService.generateAccessToken(principalDetails, request, response);
String jwtRefreshToken = authenticationService.generateRefreshToken(principalDetails, request, response);
```

유저 정보를 가져오게 되면 해당 유저 정보가 가입된 유저인지 가입 되지 않았으면 member 테이블에 insert 하게 됩니다.

PrincipalDetails 인증 객체를 만들어서 리턴 합니다. PrincipalDetails 인증 객체를 가지고 JWT access token 을 생성해서 응답 합니다.

Provider.java
```markdown
@Getter
public enum Provider {

    GOOGLE("google", GoogleOAuthMeResponse::new, GoogleOAuthService::new),
    KAKAO("kakao", KakaoOAuthMeResponse::new, KakaoOAuthService::new),
    NAVER("naver", NaverOAuthMeResponse::new, NaverOAuthService::new),
    NONE("none", attributes -> null, restTemplate -> null);

    private final String provider;
    private final Function<Map<String, Object>, OAuthMeResponse> expression;
    private final Function<RestTemplate, OAuthService> expression2;

    Provider(
            String provider,
            Function<Map<String, Object>, OAuthMeResponse> expression,
            Function<RestTemplate, OAuthService> expression2
    ) {

        this.provider = provider;
        this.expression = expression;
        this.expression2 = expression2;
    }

    public String getProvider() {
        return this.provider;
    }

    public static Provider getByProvider(String provider) {
        return Arrays.stream(Provider.values())
                .filter(data -> data.getProvider().equals(provider))
                .findFirst()
                .orElse(Provider.NONE);
    }

    public OAuthMeResponse oAuthMeCalculate(Map<String, Object> attributes) {
        return expression.apply(attributes);
    }

    public OAuthService oAuthServiceCalculate(RestTemplate restTemplate) {
        return expression2.apply(restTemplate);
    }
}
```
KAKAO, NAVER 등 Social 목록을 관리 하는 enum class 입니다.

Provider 값에 따른 OAuthService 자식 클래스와 OAuthMeResponse 자식 클래스를 구분화 시켰습니다.


```markdown
public OAuthMeResponse getMe(ClientRegistration clientRegistration, String accessToken) {

    HttpHeaders headers = new HttpHeaders();

    headers.add("Authorization", "Bearer " + accessToken);
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<?> httpEntity = new HttpEntity<>(headers);

    ResponseEntity<String> entity = null;
    try {
        entity = restTemplate.exchange(clientRegistration.getProviderDetails().getUserInfoUri(), HttpMethod.GET, httpEntity, String.class);
    } catch (HttpStatusCodeException exception) {
        
        int statusCode = exception.getStatusCode().value();
        throw new OAuthFailedException(MemberErrorCode.SOCIAL_GET_ME_ERROR, new Object[] { clientRegistration.getRegistrationId().getProvider().toUpperCase(), statusCode });
    }

    log.debug(entity.getBody());
    Map<String, Object> memberAttributes = JsonUtils.fromJson(entity.getBody(), Map.class);

    OAuthMeResponse oAuthMeResponse = OAuthMeFactory.getOAuthMe(clientRegistration.getRegistrationId(), memberAttributes);

    return oAuthMeResponse;
}
```

해당 Social 유저 정보를 가져오는 로직 입니다.

요청시 해당 Social access token 을 Authorization 키 값에 담아서 해더로 요청 하게 됩니다.

``OAuthMeResponse oAuthMeResponse = OAuthMeFactory.getOAuthMe(clientRegistration.getRegistrationId(), memberAttributes);``

각각 social 마다 유저정보를 조회 할때 응답 받는 키/값이 다르기 때문에 이를 구별화 시키기 위해 OAuthMeFactory 팩토리 패턴으로 디자인 하였습니다.

OAuthMeFactory.java
```markdown
public class OAuthMeFactory {

    public static OAuthMeResponse getOAuthMe(Provider provider, Map<String, Object> attributes) {

        OAuthMeResponse oAuthMeResponse = provider.oAuthMeCalculate(attributes);
        if (oAuthMeResponse == null) {
            throw new CommonException(MemberErrorCode.NOT_FOUND_PROVIDER, new Object[] { provider.getProvider().toUpperCase() });
        }

        return oAuthMeResponse;
    }
}
```
``OAuthMeResponse oAuthMeResponse = provider.oAuthMeCalculate(attributes);``

해당 Provider 에 따라 해당되는 자식 클래스를 가져오게 합니다.

MemberQueryService.java
```markdown
public UserDetails loadUserByOAuth(Provider provider, OAuthTokenResponse oAuthTokenResponse, OAuthMeResponse oAuthMeResponse) {

    MemberSocial memberSocial = memberSocialRepository.selectMemberSocialByProviderAndProviderId(provider, oAuthMeResponse.getId());
    Member member = null;
    
    if (memberSocial != null) {

        member = memberSocial.getMember();
        memberSocial.updateToken(oAuthTokenResponse.getAccessToken(), oAuthTokenResponse.getRefreshToken(), oAuthTokenResponse.getExpiredAt());

        memberService.saveMemberSocial(memberSocial);
    } else {

        MemberSocial newMemberSocial = MemberSocial.builder()
                .provider(provider)
                .providerId(oAuthMeResponse.getId())
                .accessToken(oAuthTokenResponse.getAccessToken())
                .refreshToken(oAuthTokenResponse.getRefreshToken())
                .expiredAt(oAuthTokenResponse.getExpiredAt()).build();

        String id = provider.getProvider() + "_" + oAuthMeResponse.getId();

        Config config = configService.selectConfig();
        Role clientRole = config.getClientRole();

        if (StringUtils.isNotBlank(oAuthMeResponse.getEmail())) {
        
            member = memberRepository.findByEmail(oAuthMeResponse.getEmail())
                    .orElse(Member.builder()
                            .email(oAuthMeResponse.getEmail())
                            .name(oAuthMeResponse.getName())
                            .id(id)
                            .todayLogin(LocalDateTime.now())
                            .role(clientRole)
                            .build());
        } else {
            member = Member.builder()
                    .email(oAuthMeResponse.getEmail())
                    .name(oAuthMeResponse.getName())
                    .id(id)
                    .todayLogin(LocalDateTime.now())
                    .role(clientRole)
                    .build();
        }
        
        member.setMemberType(MemberType.OAUTH);
        member.setMemberSocial(newMemberSocial);
        memberService.saveMember(member);
    }

    return PrincipalDetails.builder()
            .id(member.getMemberNo())
            .username(member.getId())
            .name(member.getName())
            .email(member.getEmail())
            .memberType(member.getMemberType())
            .authorities(member.getAuthorities()).build();
}
```
해당 Social 유저 정보를 가져와서 우리측 DB에 가입된 회원인지 가입 되지 않는 상태라면 저장하는 로직 입니다.


``memberSocialRepository.selectMemberSocialByProviderAndProviderId(provider, oAuthMeResponse.getId());``

처음에 해당 Social 유저 정보 유니크값인 'id'와 Social provider 로 DB 조회를 합니다.

만약에 null 값이면 회원가입을 하게 됩니다. return 할때는 PrincipalDetails 인증 객체를 만들어서 보내줍니다.
