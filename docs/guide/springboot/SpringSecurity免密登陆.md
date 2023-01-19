# SpringSecurity免密登陆

> 自定义认证逻辑需要实现和继承三个类分别是
>
> SecurityConfigurerAdapter 构造器 用于配置userDetailsService的实现类
>
> AuthenticationProvider 认证类 定义认证逻辑
>
> AbstractAuthenticationToken 自定义Token 可以自定义Token中的参数

代码实例[详见](https://github.com/chougui123/RuoYi-Vue-SmsLogin)

## AbstractAuthenticationToken

继承AbstractAuthenticationToken的类

```java
import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;

/**
 * 邮件登录 AuthenticationToken，模仿 UsernamePasswordAuthenticationToken 实现
 */
public class MailCodeAuthenticationToken extends AbstractAuthenticationToken {
	private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

	/**
	 * 在 UsernamePasswordAuthenticationToken 中该字段代表登录的用户名，默认的还有密码，这里只要用户名
	 */
	private final Object principal;

	/**
	 * 构建一个没有鉴权的 SmsCodeAuthenticationToken
	 */
	public MailCodeAuthenticationToken(Object principal) {
		super(null);
		this.principal = principal;
		setAuthenticated(false);
	}

	/**
	 * 构建拥有鉴权的 SmsCodeAuthenticationToken
	 */
	public MailCodeAuthenticationToken(Object principal, Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.principal = principal;
		// must use super, as we override
		super.setAuthenticated(true);
	}

	@Override
	public Object getCredentials() {
		return null;
	}

	@Override
	public Object getPrincipal() {
		return this.principal;
	}

	@Override
	public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
		if (isAuthenticated) {
			throw new IllegalArgumentException(
					"Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
		}

		super.setAuthenticated(false);
	}

	@Override
	public void eraseCredentials() {
		super.eraseCredentials();
	}
}
```

## AuthenticationProvider

实现AuthenticationProvider

```java
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class MailCodeAuthenticationProvider implements AuthenticationProvider {
	private UserDetailsService userDetailsService;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		MailCodeAuthenticationToken authenticationToken = (MailCodeAuthenticationToken) authentication;

		String mobile = (String) authenticationToken.getPrincipal();

//	        checkMailCode(mobile);

		UserDetails userDetails = userDetailsService.loadUserByUsername(mobile);

		// 此时鉴权成功后，应当重新 new 一个拥有鉴权的 authenticationResult 返回
		MailCodeAuthenticationToken authenticationResult = new MailCodeAuthenticationToken(userDetails,
				userDetails.getAuthorities());

		authenticationResult.setDetails(authenticationToken.getDetails());

		return authenticationResult;
	}

	@Override
	public boolean supports(Class<?> authentication) {
		// 判断 authentication 是不是 MailCodeAuthenticationToken 的子类或子接口
		return MailCodeAuthenticationToken.class.isAssignableFrom(authentication);
	}

	public UserDetailsService getUserDetailsService() {
		return userDetailsService;
	}

	public void setUserDetailsService(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}
}

```

## SecurityConfigurerAdapter

继承SecurityConfigurerAdapter

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.stereotype.Component;

import com.workflow.framework.web.service.UserDetailsServiceImpl;

@Component
public class MailCodeAuthenticationSecurityConfig
		extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Override
	public void configure(HttpSecurity http) throws Exception {
		/*
		 * MailCodeAuthenticationFilter MailCodeAuthenticationFilter = new
		 * MailCodeAuthenticationFilter();
		 * MailCodeAuthenticationFilter.setAuthenticationManager(http.getSharedObject(
		 * AuthenticationManager.class));
		 * MailCodeAuthenticationFilter.setAuthenticationSuccessHandler(
		 * customAuthenticationSuccessHandler);
		 * MailCodeAuthenticationFilter.setAuthenticationFailureHandler(
		 * customAuthenticationFailureHandler);
		 */
		MailCodeAuthenticationProvider mailCodeAuthenticationProvider = new MailCodeAuthenticationProvider();
		mailCodeAuthenticationProvider.setUserDetailsService(userDetailsService);

		http.authenticationProvider(mailCodeAuthenticationProvider);
		/*
		 * http.authenticationProvider(smsCodeAuthenticationProvider)
		 * .addFilterAfter(smsCodeAuthenticationFilter,
		 * UsernamePasswordAuthenticationFilter.class);
		 */
	}

}
```

## 修改SecurityConfig

```java
	/**
	 * 自定义认证逻辑
	 */

	@Autowired
	private MailCodeAuthenticationSecurityConfig mailCodeAuthenticationSecurityConfig;
	
    //configure方法
	httpSecurity.apply(mailCodeAuthenticationSecurityConfig).and()
	
```

