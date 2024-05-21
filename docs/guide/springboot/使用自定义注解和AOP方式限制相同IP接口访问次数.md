# 使用自定义注解和AOP方式限制相同IP接口访问次数


我使用的若依框架，没有相应依赖的自己百度一下，无法识别内网，如果用户使用wifi等网络会影响连接wifi的所有人



## 自定义注解

```java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

/**
 * @ClassName: RequestLimit
 * @Description: TODO(描述) 类说明:自定义注解限制访问时间长度最多访问次数
 *               <p>
 *               使用了com.ruoyi.framework.aspectj.RequestLimitContract切面
 *               </p>
 * @author zzy
 * @date 2023-03-15 06:00:11
 */

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
@Order(Ordered.HIGHEST_PRECEDENCE)
public @interface RequestLimit {

	/**
	 * 允许访问的最大次数
	 */
	int count() default Integer.MAX_VALUE;

	/**
	 * 时间段，单位为毫秒，默认值一分钟
	 */
	long time() default 600000;
}
```



## 自定义异常

```java
import com.ruoyi.common.exception.BaseException;

/**
 * @ClassName: RequestLimitException
 * @Description: TODO(描述)自定义IP访问异常
 * @author zzy
 * @date 2023-03-15 06:03:08
 */
public class RequestLimitException extends BaseException {

	private static final long serialVersionUID = 1L;

	public RequestLimitException(String code, Object[] args) {
		super("user", code, args, null);
	}

	public RequestLimitException(String message) {
		super(message);
	}
}
```



## 定义切点，处理逻辑 集成redis

```java
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.concurrent.BasicThreadFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.user.RequestLimitException;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.ip.IpUtils;
import com.ruoyi.system.customAnnotation.RequestLimit;

/**
 * @ClassName: RequestLimitContract
 * @Description: TODO IP限制切面
 * @author zzy
 * @date 2023-03-15 06:05:12
 */
@Aspect
@Component
public class RequestLimitContract {
	private static final Logger logger = LoggerFactory.getLogger(RequestLimitContract.class);

	@Autowired
	private RedisCache redis;

	private ScheduledExecutorService executorService2;

	public RequestLimitContract() {
		executorService2 = new ScheduledThreadPoolExecutor(8,
				new BasicThreadFactory.Builder().namingPattern("example-schedule-pool-%d").daemon(true).build());
	}

	// 强调@annotation中的值，需要和方法参数名相同，方法第二个参数代表注解名
	@Before("within(@org.springframework.web.bind.annotation.RestController *) && @annotation(limit)")
	public void requestLimit(final JoinPoint joinPoint, RequestLimit limit) throws RequestLimitException {
		try {

			// 请求的地址
			String ip = IpUtils.getIpAddr(ServletUtils.getRequest());
			String url = ServletUtils.getRequest().getRequestURI();
			String key = "req_limit_".concat(url).concat(ip);
			if (!redis.exists(key)) {
				redis.setCacheObject(key, String.valueOf(1));
			} else {
				Integer getValue = Integer.parseInt((String) redis.getCacheObject(key)) + 1;

				redis.setCacheObject(key, String.valueOf(getValue));
			}
			int count = Integer.parseInt((String) redis.getCacheObject(key));
			if (count > 0) {
				// 创建一个定时器

				Runnable timerTask = new Runnable() {
					@Override
					public void run() {
						// TODO 自动生成的方法存根
						redis.deleteObject(key);
					}
				};
				// 这个定时器设定在time规定的时间之后会执行上面的remove方法，也就是说在这个时间后它可以重新访问
//	                timer.schedule(timerTask, limit.time());
				// 利用线程池
				executorService2.schedule(timerTask, limit.time() / 1000, TimeUnit.SECONDS);
			}
			if (count > limit.count()) {
				/*
				 * logger.info("用户IP[" + ip + "]访问地址[" + url + "]超过了限定的次数[" + limit.count() +
				 * "]"); throw new RequestLimitException(); String toLomitPath ="http://" +
				 * request.getServerName()+ ":" + request.getServerPort()+limitPath; //端口号
				 * response.sendRedirect(toLomitPath);
				 */
				logger.info("用户IP[" + ip + "]访问地址[" + url + "]超过了限定的次数[" + limit.count() + "]");
				throw new RequestLimitException("登陆超出设定的限制！请" + limit.time() / 1000 + "秒再试");
			}
		} catch (RequestLimitException e) {
			throw e;
		} catch (Exception e) {
			logger.error("发生异常", e);
		}
	}
}
```



## 调用

```java

@RequestMapping("/backstageManagement")
public class TestController {

    @Autowired
    private IMenucontentsService iMenucontentsService;


// 默认一分钟  count 为 在规定时间内访问做多次数限制
    @RequestLimit(count = 5)
    @ApiOperation(value = "测试mybatis", notes = "测试mybatis-resultMap 分页查询")
    @PostMapping(value = "/test/page")
    public Result<?> testPage() Integer pageSize,HttpServletRequest req) {
        
        return Result.OK();
    }

```

