# springboot常见工具类

> springboot 常见工具类

## UUID

```java

/**
 * 提供通用唯一识别码（universally unique identifier）（UUID）实现
 *
 * @author ruoyi
 */
public final class UUID implements java.io.Serializable, Comparable<UUID>
{
    private static final long serialVersionUID = -1185015143654744140L;

    /**
     * SecureRandom 的单例
     *
     */
    private static class Holder
    {
        static final SecureRandom numberGenerator = getSecureRandom();
    }

    /** 此UUID的最高64有效位 */
    private final long mostSigBits;

    /** 此UUID的最低64有效位 */
    private final long leastSigBits;

    /**
     * 私有构造
     * 
     * @param data 数据
     */
    private UUID(byte[] data)
    {
        long msb = 0;
        long lsb = 0;
        assert data.length == 16 : "data must be 16 bytes in length";
        for (int i = 0; i < 8; i++)
        {
            msb = (msb << 8) | (data[i] & 0xff);
        }
        for (int i = 8; i < 16; i++)
        {
            lsb = (lsb << 8) | (data[i] & 0xff);
        }
        this.mostSigBits = msb;
        this.leastSigBits = lsb;
    }

    /**
     * 使用指定的数据构造新的 UUID。
     *
     * @param mostSigBits 用于 {@code UUID} 的最高有效 64 位
     * @param leastSigBits 用于 {@code UUID} 的最低有效 64 位
     */
    public UUID(long mostSigBits, long leastSigBits)
    {
        this.mostSigBits = mostSigBits;
        this.leastSigBits = leastSigBits;
    }

    /**
     * 获取类型 4（伪随机生成的）UUID 的静态工厂。 使用加密的本地线程伪随机数生成器生成该 UUID。
     * 
     * @return 随机生成的 {@code UUID}
     */
    public static UUID fastUUID()
    {
        return randomUUID(false);
    }

    /**
     * 获取类型 4（伪随机生成的）UUID 的静态工厂。 使用加密的强伪随机数生成器生成该 UUID。
     * 
     * @return 随机生成的 {@code UUID}
     */
    public static UUID randomUUID()
    {
        return randomUUID(true);
    }

    /**
     * 获取类型 4（伪随机生成的）UUID 的静态工厂。 使用加密的强伪随机数生成器生成该 UUID。
     * 
     * @param isSecure 是否使用{@link SecureRandom}如果是可以获得更安全的随机码，否则可以得到更好的性能
     * @return 随机生成的 {@code UUID}
     */
    public static UUID randomUUID(boolean isSecure)
    {
        final Random ng = isSecure ? Holder.numberGenerator : getRandom();

        byte[] randomBytes = new byte[16];
        ng.nextBytes(randomBytes);
        randomBytes[6] &= 0x0f; /* clear version */
        randomBytes[6] |= 0x40; /* set to version 4 */
        randomBytes[8] &= 0x3f; /* clear variant */
        randomBytes[8] |= 0x80; /* set to IETF variant */
        return new UUID(randomBytes);
    }

    /**
     * 根据指定的字节数组获取类型 3（基于名称的）UUID 的静态工厂。
     *
     * @param name 用于构造 UUID 的字节数组。
     *
     * @return 根据指定数组生成的 {@code UUID}
     */
    public static UUID nameUUIDFromBytes(byte[] name)
    {
        MessageDigest md;
        try
        {
            md = MessageDigest.getInstance("MD5");
        }
        catch (NoSuchAlgorithmException nsae)
        {
            throw new InternalError("MD5 not supported");
        }
        byte[] md5Bytes = md.digest(name);
        md5Bytes[6] &= 0x0f; /* clear version */
        md5Bytes[6] |= 0x30; /* set to version 3 */
        md5Bytes[8] &= 0x3f; /* clear variant */
        md5Bytes[8] |= 0x80; /* set to IETF variant */
        return new UUID(md5Bytes);
    }

    /**
     * 根据 {@link #toString()} 方法中描述的字符串标准表示形式创建{@code UUID}。
     *
     * @param name 指定 {@code UUID} 字符串
     * @return 具有指定值的 {@code UUID}
     * @throws IllegalArgumentException 如果 name 与 {@link #toString} 中描述的字符串表示形式不符抛出此异常
     *
     */
    public static UUID fromString(String name)
    {
        String[] components = name.split("-");
        if (components.length != 5)
        {
            throw new IllegalArgumentException("Invalid UUID string: " + name);
        }
        for (int i = 0; i < 5; i++)
        {
            components[i] = "0x" + components[i];
        }

        long mostSigBits = Long.decode(components[0]).longValue();
        mostSigBits <<= 16;
        mostSigBits |= Long.decode(components[1]).longValue();
        mostSigBits <<= 16;
        mostSigBits |= Long.decode(components[2]).longValue();

        long leastSigBits = Long.decode(components[3]).longValue();
        leastSigBits <<= 48;
        leastSigBits |= Long.decode(components[4]).longValue();

        return new UUID(mostSigBits, leastSigBits);
    }

    /**
     * 返回此 UUID 的 128 位值中的最低有效 64 位。
     *
     * @return 此 UUID 的 128 位值中的最低有效 64 位。
     */
    public long getLeastSignificantBits()
    {
        return leastSigBits;
    }

    /**
     * 返回此 UUID 的 128 位值中的最高有效 64 位。
     *
     * @return 此 UUID 的 128 位值中最高有效 64 位。
     */
    public long getMostSignificantBits()
    {
        return mostSigBits;
    }

    /**
     * 与此 {@code UUID} 相关联的版本号. 版本号描述此 {@code UUID} 是如何生成的。
     * <p>
     * 版本号具有以下含意:
     * <ul>
     * <li>1 基于时间的 UUID
     * <li>2 DCE 安全 UUID
     * <li>3 基于名称的 UUID
     * <li>4 随机生成的 UUID
     * </ul>
     *
     * @return 此 {@code UUID} 的版本号
     */
    public int version()
    {
        // Version is bits masked by 0x000000000000F000 in MS long
        return (int) ((mostSigBits >> 12) & 0x0f);
    }

    /**
     * 与此 {@code UUID} 相关联的变体号。变体号描述 {@code UUID} 的布局。
     * <p>
     * 变体号具有以下含意：
     * <ul>
     * <li>0 为 NCS 向后兼容保留
     * <li>2 <a href="http://www.ietf.org/rfc/rfc4122.txt">IETF&nbsp;RFC&nbsp;4122</a>(Leach-Salz), 用于此类
     * <li>6 保留，微软向后兼容
     * <li>7 保留供以后定义使用
     * </ul>
     *
     * @return 此 {@code UUID} 相关联的变体号
     */
    public int variant()
    {
        // This field is composed of a varying number of bits.
        // 0 - - Reserved for NCS backward compatibility
        // 1 0 - The IETF aka Leach-Salz variant (used by this class)
        // 1 1 0 Reserved, Microsoft backward compatibility
        // 1 1 1 Reserved for future definition.
        return (int) ((leastSigBits >>> (64 - (leastSigBits >>> 62))) & (leastSigBits >> 63));
    }

    /**
     * 与此 UUID 相关联的时间戳值。
     *
     * <p>
     * 60 位的时间戳值根据此 {@code UUID} 的 time_low、time_mid 和 time_hi 字段构造。<br>
     * 所得到的时间戳以 100 毫微秒为单位，从 UTC（通用协调时间） 1582 年 10 月 15 日零时开始。
     *
     * <p>
     * 时间戳值仅在在基于时间的 UUID（其 version 类型为 1）中才有意义。<br>
     * 如果此 {@code UUID} 不是基于时间的 UUID，则此方法抛出 UnsupportedOperationException。
     *
     * @throws UnsupportedOperationException 如果此 {@code UUID} 不是 version 为 1 的 UUID。
     */
    public long timestamp() throws UnsupportedOperationException
    {
        checkTimeBase();
        return (mostSigBits & 0x0FFFL) << 48//
                | ((mostSigBits >> 16) & 0x0FFFFL) << 32//
                | mostSigBits >>> 32;
    }

    /**
     * 与此 UUID 相关联的时钟序列值。
     *
     * <p>
     * 14 位的时钟序列值根据此 UUID 的 clock_seq 字段构造。clock_seq 字段用于保证在基于时间的 UUID 中的时间唯一性。
     * <p>
     * {@code clockSequence} 值仅在基于时间的 UUID（其 version 类型为 1）中才有意义。 如果此 UUID 不是基于时间的 UUID，则此方法抛出
     * UnsupportedOperationException。
     *
     * @return 此 {@code UUID} 的时钟序列
     *
     * @throws UnsupportedOperationException 如果此 UUID 的 version 不为 1
     */
    public int clockSequence() throws UnsupportedOperationException
    {
        checkTimeBase();
        return (int) ((leastSigBits & 0x3FFF000000000000L) >>> 48);
    }

    /**
     * 与此 UUID 相关的节点值。
     *
     * <p>
     * 48 位的节点值根据此 UUID 的 node 字段构造。此字段旨在用于保存机器的 IEEE 802 地址，该地址用于生成此 UUID 以保证空间唯一性。
     * <p>
     * 节点值仅在基于时间的 UUID（其 version 类型为 1）中才有意义。<br>
     * 如果此 UUID 不是基于时间的 UUID，则此方法抛出 UnsupportedOperationException。
     *
     * @return 此 {@code UUID} 的节点值
     *
     * @throws UnsupportedOperationException 如果此 UUID 的 version 不为 1
     */
    public long node() throws UnsupportedOperationException
    {
        checkTimeBase();
        return leastSigBits & 0x0000FFFFFFFFFFFFL;
    }

    /**
     * 返回此{@code UUID} 的字符串表现形式。
     *
     * <p>
     * UUID 的字符串表示形式由此 BNF 描述：
     * 
     * <pre>
     * {@code
     * UUID                   = <time_low>-<time_mid>-<time_high_and_version>-<variant_and_sequence>-<node>
     * time_low               = 4*<hexOctet>
     * time_mid               = 2*<hexOctet>
     * time_high_and_version  = 2*<hexOctet>
     * variant_and_sequence   = 2*<hexOctet>
     * node                   = 6*<hexOctet>
     * hexOctet               = <hexDigit><hexDigit>
     * hexDigit               = [0-9a-fA-F]
     * }
     * </pre>
     * 
     * </blockquote>
     *
     * @return 此{@code UUID} 的字符串表现形式
     * @see #toString(boolean)
     */
    @Override
    public String toString()
    {
        return toString(false);
    }

    /**
     * 返回此{@code UUID} 的字符串表现形式。
     *
     * <p>
     * UUID 的字符串表示形式由此 BNF 描述：
     * 
     * <pre>
     * {@code
     * UUID                   = <time_low>-<time_mid>-<time_high_and_version>-<variant_and_sequence>-<node>
     * time_low               = 4*<hexOctet>
     * time_mid               = 2*<hexOctet>
     * time_high_and_version  = 2*<hexOctet>
     * variant_and_sequence   = 2*<hexOctet>
     * node                   = 6*<hexOctet>
     * hexOctet               = <hexDigit><hexDigit>
     * hexDigit               = [0-9a-fA-F]
     * }
     * </pre>
     * 
     * </blockquote>
     *
     * @param isSimple 是否简单模式，简单模式为不带'-'的UUID字符串
     * @return 此{@code UUID} 的字符串表现形式
     */
    public String toString(boolean isSimple)
    {
        final StringBuilder builder = new StringBuilder(isSimple ? 32 : 36);
        // time_low
        builder.append(digits(mostSigBits >> 32, 8));
        if (false == isSimple)
        {
            builder.append('-');
        }
        // time_mid
        builder.append(digits(mostSigBits >> 16, 4));
        if (false == isSimple)
        {
            builder.append('-');
        }
        // time_high_and_version
        builder.append(digits(mostSigBits, 4));
        if (false == isSimple)
        {
            builder.append('-');
        }
        // variant_and_sequence
        builder.append(digits(leastSigBits >> 48, 4));
        if (false == isSimple)
        {
            builder.append('-');
        }
        // node
        builder.append(digits(leastSigBits, 12));

        return builder.toString();
    }

    /**
     * 返回此 UUID 的哈希码。
     *
     * @return UUID 的哈希码值。
     */
    @Override
    public int hashCode()
    {
        long hilo = mostSigBits ^ leastSigBits;
        return ((int) (hilo >> 32)) ^ (int) hilo;
    }

    /**
     * 将此对象与指定对象比较。
     * <p>
     * 当且仅当参数不为 {@code null}、而是一个 UUID 对象、具有与此 UUID 相同的 varriant、包含相同的值（每一位均相同）时，结果才为 {@code true}。
     *
     * @param obj 要与之比较的对象
     *
     * @return 如果对象相同，则返回 {@code true}；否则返回 {@code false}
     */
    @Override
    public boolean equals(Object obj)
    {
        if ((null == obj) || (obj.getClass() != UUID.class))
        {
            return false;
        }
        UUID id = (UUID) obj;
        return (mostSigBits == id.mostSigBits && leastSigBits == id.leastSigBits);
    }

    // Comparison Operations

    /**
     * 将此 UUID 与指定的 UUID 比较。
     *
     * <p>
     * 如果两个 UUID 不同，且第一个 UUID 的最高有效字段大于第二个 UUID 的对应字段，则第一个 UUID 大于第二个 UUID。
     *
     * @param val 与此 UUID 比较的 UUID
     *
     * @return 在此 UUID 小于、等于或大于 val 时，分别返回 -1、0 或 1。
     *
     */
    @Override
    public int compareTo(UUID val)
    {
        // The ordering is intentionally set up so that the UUIDs
        // can simply be numerically compared as two numbers
        return (this.mostSigBits < val.mostSigBits ? -1 : //
                (this.mostSigBits > val.mostSigBits ? 1 : //
                        (this.leastSigBits < val.leastSigBits ? -1 : //
                                (this.leastSigBits > val.leastSigBits ? 1 : //
                                        0))));
    }

    // -------------------------------------------------------------------------------------------------------------------
    // Private method start
    /**
     * 返回指定数字对应的hex值
     * 
     * @param val 值
     * @param digits 位
     * @return 值
     */
    private static String digits(long val, int digits)
    {
        long hi = 1L << (digits * 4);
        return Long.toHexString(hi | (val & (hi - 1))).substring(1);
    }

    /**
     * 检查是否为time-based版本UUID
     */
    private void checkTimeBase()
    {
        if (version() != 1)
        {
            throw new UnsupportedOperationException("Not a time-based UUID");
        }
    }

    /**
     * 获取{@link SecureRandom}，类提供加密的强随机数生成器 (RNG)
     * 
     * @return {@link SecureRandom}
     */
    public static SecureRandom getSecureRandom()
    {
        try
        {
            return SecureRandom.getInstance("SHA1PRNG");
        }
        catch (NoSuchAlgorithmException e)
        {
            throw new UtilException(e);
        }
    }

    /**
     * 获取随机数生成器对象<br>
     * ThreadLocalRandom是JDK 7之后提供并发产生随机数，能够解决多个线程发生的竞争争夺。
     * 
     * @return {@link ThreadLocalRandom}
     */
    public static ThreadLocalRandom getRandom()
    {
        return ThreadLocalRandom.current();
    }
}
```



### 获取随机UUID

```java
 public static String randomUUID()
    {
        return UUID.randomUUID().toString();
    }
```

###  简化的UUID，去掉了横线

```
public static String simpleUUID()
    {
        return UUID.randomUUID().toString(true);
    }
```

### 使用性能更好的ThreadLocalRandom生成UUID

```
 public static String fastUUID()
    {
        return UUID.fastUUID().toString();
    }
```

### 去掉了横线，使用性能更好的ThreadLocalRandom生成UUID

```
public static String fastSimpleUUID()
    {
        return UUID.fastUUID().toString(true);
    }
```

## MD5加密

```java
/**
 * Md5加密方法
 * 
 * @author ruoyi
 */
public class Md5Utils
{
    private static final Logger log = LoggerFactory.getLogger(Md5Utils.class);

    private static byte[] md5(String s)
    {
        MessageDigest algorithm;
        try
        {
            algorithm = MessageDigest.getInstance("MD5");
            algorithm.reset();
            algorithm.update(s.getBytes("UTF-8"));
            byte[] messageDigest = algorithm.digest();
            return messageDigest;
        }
        catch (Exception e)
        {
            log.error("MD5 Error...", e);
        }
        return null;
    }

    private static final String toHex(byte hash[])
    {
        if (hash == null)
        {
            return null;
        }
        StringBuffer buf = new StringBuffer(hash.length * 2);
        int i;

        for (i = 0; i < hash.length; i++)
        {
            if ((hash[i] & 0xff) < 0x10)
            {
                buf.append("0");
            }
            buf.append(Long.toString(hash[i] & 0xff, 16));
        }
        return buf.toString();
    }

    public static String hash(String s)
    {
        try
        {
            return new String(toHex(md5(s)).getBytes("UTF-8"), "UTF-8");
        }
        catch (Exception e)
        {
            log.error("not supported charset...{}", e);
            return s;
        }
    }
}
```

## HTTP

### 通用http工具封装

```java
/**
 * 通用http工具封装
 * 
 * @author ruoyi
 */
public class HttpHelper
{
    private static final Logger LOGGER = LoggerFactory.getLogger(HttpHelper.class);

    public static String getBodyString(ServletRequest request)
    {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = null;
        try (InputStream inputStream = request.getInputStream())
        {
            reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
            String line = "";
            while ((line = reader.readLine()) != null)
            {
                sb.append(line);
            }
        }
        catch (IOException e)
        {
            LOGGER.warn("getBodyString出现问题！");
        }
        finally
        {
            if (reader != null)
            {
                try
                {
                    reader.close();
                }
                catch (IOException e)
                {
                    LOGGER.error(ExceptionUtils.getMessage(e));
                }
            }
        }
        return sb.toString();
    }
}
```



### 通用http发送方法

```java
/**
 * 通用http发送方法
 * 
 * @author ruoyi
 */
public class HttpUtils
{
    private static final Logger log = LoggerFactory.getLogger(HttpUtils.class);

    /**
     * 向指定 URL 发送GET方法的请求
     *
     * @param url 发送请求的 URL
     * @param param 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    public static String sendGet(String url, String param)
    {
        return sendGet(url, param, Constants.UTF8);
    }

    /**
     * 向指定 URL 发送GET方法的请求
     *
     * @param url 发送请求的 URL
     * @param param 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @param contentType 编码类型
     * @return 所代表远程资源的响应结果
     */
    public static String sendGet(String url, String param, String contentType)
    {
        StringBuilder result = new StringBuilder();
        BufferedReader in = null;
        try
        {
            String urlNameString = url + "?" + param;
            log.info("sendGet - {}", urlNameString);
            URL realUrl = new URL(urlNameString);
            URLConnection connection = realUrl.openConnection();
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            connection.connect();
            in = new BufferedReader(new InputStreamReader(connection.getInputStream(), contentType));
            String line;
            while ((line = in.readLine()) != null)
            {
                result.append(line);
            }
            log.info("recv - {}", result);
        }
        catch (ConnectException e)
        {
            log.error("调用HttpUtils.sendGet ConnectException, url=" + url + ",param=" + param, e);
        }
        catch (SocketTimeoutException e)
        {
            log.error("调用HttpUtils.sendGet SocketTimeoutException, url=" + url + ",param=" + param, e);
        }
        catch (IOException e)
        {
            log.error("调用HttpUtils.sendGet IOException, url=" + url + ",param=" + param, e);
        }
        catch (Exception e)
        {
            log.error("调用HttpsUtil.sendGet Exception, url=" + url + ",param=" + param, e);
        }
        finally
        {
            try
            {
                if (in != null)
                {
                    in.close();
                }
            }
            catch (Exception ex)
            {
                log.error("调用in.close Exception, url=" + url + ",param=" + param, ex);
            }
        }
        return result.toString();
    }

    /**
     * 向指定 URL 发送POST方法的请求
     *
     * @param url 发送请求的 URL
     * @param param 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    public static String sendPost(String url, String param)
    {
        PrintWriter out = null;
        BufferedReader in = null;
        StringBuilder result = new StringBuilder();
        try
        {
            String urlNameString = url;
            log.info("sendPost - {}", urlNameString);
            URL realUrl = new URL(urlNameString);
            URLConnection conn = realUrl.openConnection();
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            conn.setRequestProperty("Accept-Charset", "utf-8");
            conn.setRequestProperty("contentType", "utf-8");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            out = new PrintWriter(conn.getOutputStream());
            out.print(param);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            String line;
            while ((line = in.readLine()) != null)
            {
                result.append(line);
            }
            log.info("recv - {}", result);
        }
        catch (ConnectException e)
        {
            log.error("调用HttpUtils.sendPost ConnectException, url=" + url + ",param=" + param, e);
        }
        catch (SocketTimeoutException e)
        {
            log.error("调用HttpUtils.sendPost SocketTimeoutException, url=" + url + ",param=" + param, e);
        }
        catch (IOException e)
        {
            log.error("调用HttpUtils.sendPost IOException, url=" + url + ",param=" + param, e);
        }
        catch (Exception e)
        {
            log.error("调用HttpsUtil.sendPost Exception, url=" + url + ",param=" + param, e);
        }
        finally
        {
            try
            {
                if (out != null)
                {
                    out.close();
                }
                if (in != null)
                {
                    in.close();
                }
            }
            catch (IOException ex)
            {
                log.error("调用in.close Exception, url=" + url + ",param=" + param, ex);
            }
        }
        return result.toString();
    }

    public static String sendSSLPost(String url, String param)
    {
        StringBuilder result = new StringBuilder();
        String urlNameString = url + "?" + param;
        try
        {
            log.info("sendSSLPost - {}", urlNameString);
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, new TrustManager[] { new TrustAnyTrustManager() }, new java.security.SecureRandom());
            URL console = new URL(urlNameString);
            HttpsURLConnection conn = (HttpsURLConnection) console.openConnection();
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            conn.setRequestProperty("Accept-Charset", "utf-8");
            conn.setRequestProperty("contentType", "utf-8");
            conn.setDoOutput(true);
            conn.setDoInput(true);

            conn.setSSLSocketFactory(sc.getSocketFactory());
            conn.setHostnameVerifier(new TrustAnyHostnameVerifier());
            conn.connect();
            InputStream is = conn.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            String ret = "";
            while ((ret = br.readLine()) != null)
            {
                if (ret != null && !"".equals(ret.trim()))
                {
                    result.append(new String(ret.getBytes("ISO-8859-1"), "utf-8"));
                }
            }
            log.info("recv - {}", result);
            conn.disconnect();
            br.close();
        }
        catch (ConnectException e)
        {
            log.error("调用HttpUtils.sendSSLPost ConnectException, url=" + url + ",param=" + param, e);
        }
        catch (SocketTimeoutException e)
        {
            log.error("调用HttpUtils.sendSSLPost SocketTimeoutException, url=" + url + ",param=" + param, e);
        }
        catch (IOException e)
        {
            log.error("调用HttpUtils.sendSSLPost IOException, url=" + url + ",param=" + param, e);
        }
        catch (Exception e)
        {
            log.error("调用HttpsUtil.sendSSLPost Exception, url=" + url + ",param=" + param, e);
        }
        return result.toString();
    }

    private static class TrustAnyTrustManager implements X509TrustManager
    {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType)
        {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType)
        {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers()
        {
            return new X509Certificate[] {};
        }
    }

    private static class TrustAnyHostnameVerifier implements HostnameVerifier
    {
        @Override
        public boolean verify(String hostname, SSLSession session)
        {
            return true;
        }
    }
}
```

## 文件

### 文件类型工具类

```java
/**
 * 文件类型工具类
 *
 * @author ruoyi
 */
public class FileTypeUtils
{
    /**
     * 获取文件类型
     * <p>
     * 例如: ruoyi.txt, 返回: txt
     * 
     * @param file 文件名
     * @return 后缀（不含".")
     */
    public static String getFileType(File file)
    {
        if (null == file)
        {
            return StringUtils.EMPTY;
        }
        return getFileType(file.getName());
    }

    /**
     * 获取文件类型
     * <p>
     * 例如: ruoyi.txt, 返回: txt
     *
     * @param fileName 文件名
     * @return 后缀（不含".")
     */
    public static String getFileType(String fileName)
    {
        int separatorIndex = fileName.lastIndexOf(".");
        if (separatorIndex < 0)
        {
            return "";
        }
        return fileName.substring(separatorIndex + 1).toLowerCase();
    }

    /**
     * 获取文件类型
     * 
     * @param photoByte 文件字节码
     * @return 后缀（不含".")
     */
    public static String getFileExtendName(byte[] photoByte)
    {
        String strFileExtendName = "JPG";
        if ((photoByte[0] == 71) && (photoByte[1] == 73) && (photoByte[2] == 70) && (photoByte[3] == 56)
                && ((photoByte[4] == 55) || (photoByte[4] == 57)) && (photoByte[5] == 97))
        {
            strFileExtendName = "GIF";
        }
        else if ((photoByte[6] == 74) && (photoByte[7] == 70) && (photoByte[8] == 73) && (photoByte[9] == 70))
        {
            strFileExtendName = "JPG";
        }
        else if ((photoByte[0] == 66) && (photoByte[1] == 77))
        {
            strFileExtendName = "BMP";
        }
        else if ((photoByte[1] == 80) && (photoByte[2] == 78) && (photoByte[3] == 71))
        {
            strFileExtendName = "PNG";
        }
        return strFileExtendName;
    }
```

### 文件处理工具类

```java
/**
 * 文件处理工具类
 * 
 * @author ruoyi
 */
public class FileUtils extends org.apache.commons.io.FileUtils
{
    public static String FILENAME_PATTERN = "[a-zA-Z0-9_\\-\\|\\.\\u4e00-\\u9fa5]+";

    /**
     * 输出指定文件的byte数组
     * 
     * @param filePath 文件路径
     * @param os 输出流
     * @return
     */
    public static void writeBytes(String filePath, OutputStream os) throws IOException
    {
        FileInputStream fis = null;
        try
        {
            File file = new File(filePath);
            if (!file.exists())
            {
                throw new FileNotFoundException(filePath);
            }
            fis = new FileInputStream(file);
            byte[] b = new byte[1024];
            int length;
            while ((length = fis.read(b)) > 0)
            {
                os.write(b, 0, length);
            }
        }
        catch (IOException e)
        {
            throw e;
        }
        finally
        {
            if (os != null)
            {
                try
                {
                    os.close();
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
            if (fis != null)
            {
                try
                {
                    fis.close();
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
        }
    }

    /**
     * 删除文件
     * 
     * @param filePath 文件
     * @return
     */
    public static boolean deleteFile(String filePath)
    {
        boolean flag = false;
        File file = new File(filePath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists())
        {
            file.delete();
            flag = true;
        }
        return flag;
    }

    /**
     * 文件名称验证
     * 
     * @param filename 文件名称
     * @return true 正常 false 非法
     */
    public static boolean isValidFilename(String filename)
    {
        return filename.matches(FILENAME_PATTERN);
    }

    /**
     * 检查文件是否可下载
     * 
     * @param resource 需要下载的文件
     * @return true 正常 false 非法
     */
    public static boolean checkAllowDownload(String resource)
    {
        // 禁止目录上跳级别
        if (StringUtils.contains(resource, ".."))
        {
            return false;
        }

        // 检查允许下载的文件规则
        if (ArrayUtils.contains(MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION, FileTypeUtils.getFileType(resource)))
        {
            return true;
        }

        // 不在允许下载的文件规则
        return false;
    }

    /**
     * 下载文件名重新编码
     * 
     * @param request 请求对象
     * @param fileName 文件名
     * @return 编码后的文件名
     */
    public static String setFileDownloadHeader(HttpServletRequest request, String fileName) throws UnsupportedEncodingException
    {
        final String agent = request.getHeader("USER-AGENT");
        String filename = fileName;
        if (agent.contains("MSIE"))
        {
            // IE浏览器
            filename = URLEncoder.encode(filename, "utf-8");
            filename = filename.replace("+", " ");
        }
        else if (agent.contains("Firefox"))
        {
            // 火狐浏览器
            filename = new String(fileName.getBytes(), "ISO8859-1");
        }
        else if (agent.contains("Chrome"))
        {
            // google浏览器
            filename = URLEncoder.encode(filename, "utf-8");
        }
        else
        {
            // 其它浏览器
            filename = URLEncoder.encode(filename, "utf-8");
        }
        return filename;
    }

    /**
     * 下载文件名重新编码
     *
     * @param response 响应对象
     * @param realFileName 真实文件名
     * @return
     */
    public static void setAttachmentResponseHeader(HttpServletResponse response, String realFileName) throws UnsupportedEncodingException
    {
        String percentEncodedFileName = percentEncode(realFileName);

        StringBuilder contentDispositionValue = new StringBuilder();
        contentDispositionValue.append("attachment; filename=")
                .append(percentEncodedFileName)
                .append(";")
                .append("filename*=")
                .append("utf-8''")
                .append(percentEncodedFileName);

        response.setHeader("Content-disposition", contentDispositionValue.toString());
    }

    /**
     * 百分号编码工具方法
     *
     * @param s 需要百分号编码的字符串
     * @return 百分号编码后的字符串
     */
    public static String percentEncode(String s) throws UnsupportedEncodingException
    {
        String encode = URLEncoder.encode(s, StandardCharsets.UTF_8.toString());
        return encode.replaceAll("\\+", "%20");
    }
    
      /**
     * InputStream转Image工具方法
     *
     * @param is 需要转码的文件
     * @return 完成的Image对象
     */
    public static Image percentEncode( InputStream is) 
    {
      
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			int len = 1024;
			byte tmp[] = new byte[len];
			int i;
			while ((i = is.read(tmp, 0, len)) > 0) {
				baos.write(tmp, 0, i);
			}
			byte imgs[] = baos.toByteArray();
			return new ImageIcon(imgs).getImage()

    }
    
    /**
	 * 判断是否在jar包中运行
	 *
	 * @return true 在jar包中  false 不是
	 */
	public static <T> boolean isStartupFromJar() {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		String protocol =  loader.getResource("").getProtocol();
		System.out.println(protocol);
		return Objects.equals(protocol, "jar");
	}
    
	/**
	 * 获取jar包文件流（resources目录下）
	 * @param name 文件名
	 * @return msyh InputStream文件流
	 */
	public static InputStream getFileResource(String name) throws IOException, BadLocationException {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		InputStream msyh = loader.getResourceAsStream(name);
		return msyh;
	}
    
    /**
	 * 获取resources的文件路径
	 * 开发模式获取项目根目录src/main/resources下
	 * jar包模式获取jar包当前目录下src\main\resources
	 * @return confdir 文件路径
	 */
	public static String getFilePath() throws IOException {
		String path = System.getProperty("user.dir");
		String classPath = System.getProperty("java.class.path");
		if (classPath.indexOf(File.pathSeparator) < 0) {
			File f = new File(classPath);
			classPath = f.getAbsolutePath();
			if (classPath.endsWith(".jar")) {
				path = classPath.substring(0, classPath.lastIndexOf(File.separator));
			}
		}
		String confdir = path + File.separator + "src\\main\\resources" + File.separator;

		return confdir;
	}
    
    
}
```



## 字符串处理

### 字符串工具类

```java
/**
 * 字符串工具类
 * 
 * @author ruoyi
 */
public class StringUtils extends org.apache.commons.lang3.StringUtils {
	/** 空字符串 */
	private static final String NULLSTR = "";

	/** 下划线 */
	private static final char SEPARATOR = '_';

	/**
	 * 获取参数不为空值
	 * 
	 * @param value defaultValue 要判断的value
	 * @return value 返回值
	 */
	public static <T> T nvl(T value, T defaultValue) {
		return value != null ? value : defaultValue;
	}

	/**
	 * * 判断一个Collection是否为空， 包含List，Set，Queue
	 * 
	 * @param coll 要判断的Collection
	 * @return true：为空 false：非空
	 */
	public static boolean isEmpty(Collection<?> coll) {
		return isNull(coll) || coll.isEmpty();
	}

	/**
	 * * 判断一个Collection是否非空，包含List，Set，Queue
	 * 
	 * @param coll 要判断的Collection
	 * @return true：非空 false：空
	 */
	public static boolean isNotEmpty(Collection<?> coll) {
		return !isEmpty(coll);
	}

	/**
	 * * 判断一个对象数组是否为空
	 * 
	 * @param objects 要判断的对象数组
	 ** @return true：为空 false：非空
	 */
	public static boolean isEmpty(Object[] objects) {
		return isNull(objects) || (objects.length == 0);
	}

	/**
	 * * 判断一个对象数组是否非空
	 * 
	 * @param objects 要判断的对象数组
	 * @return true：非空 false：空
	 */
	public static boolean isNotEmpty(Object[] objects) {
		return !isEmpty(objects);
	}

	/**
	 * * 判断一个Map是否为空
	 * 
	 * @param map 要判断的Map
	 * @return true：为空 false：非空
	 */
	public static boolean isEmpty(Map<?, ?> map) {
		return isNull(map) || map.isEmpty();
	}

	/**
	 * * 判断一个Map是否为空
	 * 
	 * @param map 要判断的Map
	 * @return true：非空 false：空
	 */
	public static boolean isNotEmpty(Map<?, ?> map) {
		return !isEmpty(map);
	}

	/**
	 * * 判断一个字符串是否为空串
	 * 
	 * @param str String
	 * @return true：为空 false：非空
	 */
	public static boolean isEmpty(String str) {
		return isNull(str) || NULLSTR.equals(str.trim());
	}

	/**
	 * * 判断一个字符串是否为非空串
	 * 
	 * @param str String
	 * @return true：非空串 false：空串
	 */
	public static boolean isNotEmpty(String str) {
		return !isEmpty(str);
	}

	/**
	 * * 判断一个对象是否为空
	 * 
	 * @param object Object
	 * @return true：为空 false：非空
	 */
	public static boolean isNull(Object object) {
		return object == null;
	}

	/**
	 * * 判断一个Map对象是否为空
	 * 
	 * @param object Object
	 * @return false：为空 ture：非空
	 */
	public static boolean isNullzzy(Object object) {
		return !(object == null || object == "" || "".equals(object));
	}

	/**
	 * * 判断一个对象是否非空
	 * 
	 * @param object Object
	 * @return true：非空 false：空
	 */
	public static boolean isNotNull(Object object) {
		return !isNull(object);
	}

	/**
	 * * 判断一个对象是否是数组类型（Java基本型别的数组）
	 * 
	 * @param object 对象
	 * @return true：是数组 false：不是数组
	 */
	public static boolean isArray(Object object) {
		return isNotNull(object) && object.getClass().isArray();
	}

	/**
	 * 去空格
	 */
	public static String trim(String str) {
		return (str == null ? "" : str.trim());
	}

	/**
	 * 截取字符串
	 * 
	 * @param str   字符串
	 * @param start 开始
	 * @return 结果
	 */
	public static String substring(final String str, int start) {
		if (str == null) {
			return NULLSTR;
		}

		if (start < 0) {
			start = str.length() + start;
		}

		if (start < 0) {
			start = 0;
		}
		if (start > str.length()) {
			return NULLSTR;
		}

		return str.substring(start);
	}

	/**
	 * 截取字符串
	 * 
	 * @param str   字符串
	 * @param start 开始
	 * @param end   结束
	 * @return 结果
	 */
	public static String substring(final String str, int start, int end) {
		if (str == null) {
			return NULLSTR;
		}

		if (end < 0) {
			end = str.length() + end;
		}
		if (start < 0) {
			start = str.length() + start;
		}

		if (end > str.length()) {
			end = str.length();
		}

		if (start > end) {
			return NULLSTR;
		}

		if (start < 0) {
			start = 0;
		}
		if (end < 0) {
			end = 0;
		}

		return str.substring(start, end);
	}

	/**
	 * 格式化文本, {} 表示占位符<br>
	 * 此方法只是简单将占位符 {} 按照顺序替换为参数<br>
	 * 如果想输出 {} 使用 \\转义 { 即可，如果想输出 {} 之前的 \ 使用双转义符 \\\\ 即可<br>
	 * 例：<br>
	 * 通常使用：format("this is {} for {}", "a", "b") -> this is a for b<br>
	 * 转义{}： format("this is \\{} for {}", "a", "b") -> this is \{} for a<br>
	 * 转义\： format("this is \\\\{} for {}", "a", "b") -> this is \a for b<br>
	 * 
	 * @param template 文本模板，被替换的部分用 {} 表示
	 * @param params   参数值
	 * @return 格式化后的文本
	 */
	public static String format(String template, Object... params) {
		if (isEmpty(params) || isEmpty(template)) {
			return template;
		}
		return StrFormatter.format(template, params);
	}

	/**
	 * 字符串转set
	 * 
	 * @param str 字符串
	 * @param sep 分隔符
	 * @return set集合
	 */
	public static final Set<String> str2Set(String str, String sep) {
		return new HashSet<String>(str2List(str, sep, true, false));
	}

	/**
	 * 字符串转list
	 * 
	 * @param str         字符串
	 * @param sep         分隔符
	 * @param filterBlank 过滤纯空白
	 * @param trim        去掉首尾空白
	 * @return list集合
	 */
	public static final List<String> str2List(String str, String sep, boolean filterBlank, boolean trim) {
		List<String> list = new ArrayList<String>();
		if (StringUtils.isEmpty(str)) {
			return list;
		}

		// 过滤空白字符串
		if (filterBlank && StringUtils.isBlank(str)) {
			return list;
		}
		String[] split = str.split(sep);
		for (String string : split) {
			if (filterBlank && StringUtils.isBlank(string)) {
				continue;
			}
			if (trim) {
				string = string.trim();
			}
			list.add(string);
		}

		return list;
	}

	/**
	 * 驼峰转下划线命名
	 */
	public static String toUnderScoreCase(String str) {
		if (str == null) {
			return null;
		}
		StringBuilder sb = new StringBuilder();
		// 前置字符是否大写
		boolean preCharIsUpperCase = true;
		// 当前字符是否大写
		boolean curreCharIsUpperCase = true;
		// 下一字符是否大写
		boolean nexteCharIsUpperCase = true;
		for (int i = 0; i < str.length(); i++) {
			char c = str.charAt(i);
			if (i > 0) {
				preCharIsUpperCase = Character.isUpperCase(str.charAt(i - 1));
			} else {
				preCharIsUpperCase = false;
			}

			curreCharIsUpperCase = Character.isUpperCase(c);

			if (i < (str.length() - 1)) {
				nexteCharIsUpperCase = Character.isUpperCase(str.charAt(i + 1));
			}

			if (preCharIsUpperCase && curreCharIsUpperCase && !nexteCharIsUpperCase) {
				sb.append(SEPARATOR);
			} else if ((i != 0 && !preCharIsUpperCase) && curreCharIsUpperCase) {
				sb.append(SEPARATOR);
			}
			sb.append(Character.toLowerCase(c));
		}

		return sb.toString();
	}

	/**
	 * 是否包含字符串
	 * 
	 * @param str  验证字符串
	 * @param strs 字符串组
	 * @return 包含返回true
	 */
	public static boolean inStringIgnoreCase(String str, String... strs) {
		if (str != null && strs != null) {
			for (String s : strs) {
				if (str.equalsIgnoreCase(trim(s))) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 将下划线大写方式命名的字符串转换为驼峰式。如果转换前的下划线大写方式命名的字符串为空，则返回空字符串。
	 * 例如：HELLO_WORLD->HelloWorld
	 * 
	 * @param name 转换前的下划线大写方式命名的字符串
	 * @return 转换后的驼峰式命名的字符串
	 */
	public static String convertToCamelCase(String name) {
		StringBuilder result = new StringBuilder();
		// 快速检查
		if (name == null || name.isEmpty()) {
			// 没必要转换
			return "";
		} else if (!name.contains("_")) {
			// 不含下划线，仅将首字母大写
			return name.substring(0, 1).toUpperCase() + name.substring(1);
		}
		// 用下划线将原始字符串分割
		String[] camels = name.split("_");
		for (String camel : camels) {
			// 跳过原始字符串中开头、结尾的下换线或双重下划线
			if (camel.isEmpty()) {
				continue;
			}
			// 首字母大写
			result.append(camel.substring(0, 1).toUpperCase());
			result.append(camel.substring(1).toLowerCase());
		}
		return result.toString();
	}

	/**
	 * 驼峰式命名法 例如：user_name->userName
	 */
	public static String toCamelCase(String s) {
		if (s == null) {
			return null;
		}
		s = s.toLowerCase();
		StringBuilder sb = new StringBuilder(s.length());
		boolean upperCase = false;
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);

			if (c == SEPARATOR) {
				upperCase = true;
			} else if (upperCase) {
				sb.append(Character.toUpperCase(c));
				upperCase = false;
			} else {
				sb.append(c);
			}
		}
		return sb.toString();
	}

	@SuppressWarnings("unchecked")
	public static <T> T cast(Object obj) {
		return (T) obj;
	}
}
```

### 字符串格式化

```java
/**
 * 字符串格式化
 * 
 * @author ruoyi
 */
public class StrFormatter
{
    public static final String EMPTY_JSON = "{}";
    public static final char C_BACKSLASH = '\\';
    public static final char C_DELIM_START = '{';
    public static final char C_DELIM_END = '}';

    /**
     * 格式化字符串<br>
     * 此方法只是简单将占位符 {} 按照顺序替换为参数<br>
     * 如果想输出 {} 使用 \\转义 { 即可，如果想输出 {} 之前的 \ 使用双转义符 \\\\ 即可<br>
     * 例：<br>
     * 通常使用：format("this is {} for {}", "a", "b") -> this is a for b<br>
     * 转义{}： format("this is \\{} for {}", "a", "b") -> this is \{} for a<br>
     * 转义\： format("this is \\\\{} for {}", "a", "b") -> this is \a for b<br>
     * 
     * @param strPattern 字符串模板
     * @param argArray 参数列表
     * @return 结果
     */
    public static String format(final String strPattern, final Object... argArray)
    {
        if (StringUtils.isEmpty(strPattern) || StringUtils.isEmpty(argArray))
        {
            return strPattern;
        }
        final int strPatternLength = strPattern.length();

        // 初始化定义好的长度以获得更好的性能
        StringBuilder sbuf = new StringBuilder(strPatternLength + 50);

        int handledPosition = 0;
        int delimIndex;// 占位符所在位置
        for (int argIndex = 0; argIndex < argArray.length; argIndex++)
        {
            delimIndex = strPattern.indexOf(EMPTY_JSON, handledPosition);
            if (delimIndex == -1)
            {
                if (handledPosition == 0)
                {
                    return strPattern;
                }
                else
                { // 字符串模板剩余部分不再包含占位符，加入剩余部分后返回结果
                    sbuf.append(strPattern, handledPosition, strPatternLength);
                    return sbuf.toString();
                }
            }
            else
            {
                if (delimIndex > 0 && strPattern.charAt(delimIndex - 1) == C_BACKSLASH)
                {
                    if (delimIndex > 1 && strPattern.charAt(delimIndex - 2) == C_BACKSLASH)
                    {
                        // 转义符之前还有一个转义符，占位符依旧有效
                        sbuf.append(strPattern, handledPosition, delimIndex - 1);
                        sbuf.append(Convert.utf8Str(argArray[argIndex]));
                        handledPosition = delimIndex + 2;
                    }
                    else
                    {
                        // 占位符被转义
                        argIndex--;
                        sbuf.append(strPattern, handledPosition, delimIndex - 1);
                        sbuf.append(C_DELIM_START);
                        handledPosition = delimIndex + 1;
                    }
                }
                else
                {
                    // 正常占位符
                    sbuf.append(strPattern, handledPosition, delimIndex);
                    sbuf.append(Convert.utf8Str(argArray[argIndex]));
                    handledPosition = delimIndex + 2;
                }
            }
        }
        // 加入最后一个占位符后所有的字符
        sbuf.append(strPattern, handledPosition, strPattern.length());

        return sbuf.toString();
    }
}
```

## 计算

### 精确的浮点数运算

```java
/**
 * 精确的浮点数运算
 * 
 * @author ruoyi
 */
public class Arith
{

    /** 默认除法运算精度 */
    private static final int DEF_DIV_SCALE = 10;

    /** 这个类不能实例化 */
    private Arith()
    {
    }

    /**
     * 提供精确的加法运算。
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
    public static double add(double v1, double v2)
    {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }

    /**
     * 提供精确的减法运算。
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static double sub(double v1, double v2)
    {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    /**
     * 提供精确的乘法运算。
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2)
    {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
     * 小数点以后10位，以后的数字四舍五入。
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */
    public static double div(double v1, double v2)
    {
        return div(v1, v2, DEF_DIV_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍五入。
     * @param v1 被除数
     * @param v2 除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double div(double v1, double v2, int scale)
    {
        if (scale < 0)
        {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        if (b1.compareTo(BigDecimal.ZERO) == 0)
        {
            return BigDecimal.ZERO.doubleValue();
        }
        return b1.divide(b2, scale, RoundingMode.HALF_UP).doubleValue();
    }

    /**
     * 提供精确的小数位四舍五入处理。
     * @param v 需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(double v, int scale)
    {
        if (scale < 0)
        {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        BigDecimal one = BigDecimal.ONE;
        return b.divide(one, scale, RoundingMode.HALF_UP).doubleValue();
    }
}
```

## 时间

### 时间工具类

```java
/**
 * 时间工具类
 * 
 * @author ruoyi
 */
public class DateUtils extends org.apache.commons.lang3.time.DateUtils
{
    public static String YYYY = "yyyy";

    public static String YYYY_MM = "yyyy-MM";

    public static String YYYY_MM_DD = "yyyy-MM-dd";

    public static String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";

    public static String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    
    private static String[] parsePatterns = {
            "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "yyyy-MM", 
            "yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm", "yyyy/MM",
            "yyyy.MM.dd", "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm", "yyyy.MM"};

    /**
     * 获取当前Date型日期
     * 
     * @return Date() 当前日期
     */
    public static Date getNowDate()
    {
        return new Date();
    }

    /**
     * 获取当前日期, 默认格式为yyyy-MM-dd
     * 
     * @return String
     */
    public static String getDate()
    {
        return dateTimeNow(YYYY_MM_DD);
    }

    public static final String getTime()
    {
        return dateTimeNow(YYYY_MM_DD_HH_MM_SS);
    }

    public static final String dateTimeNow()
    {
        return dateTimeNow(YYYYMMDDHHMMSS);
    }

    public static final String dateTimeNow(final String format)
    {
        return parseDateToStr(format, new Date());
    }

    public static final String dateTime(final Date date)
    {
        return parseDateToStr(YYYY_MM_DD, date);
    }

    public static final String parseDateToStr(final String format, final Date date)
    {
        return new SimpleDateFormat(format).format(date);
    }

    public static final Date dateTime(final String format, final String ts)
    {
        try
        {
            return new SimpleDateFormat(format).parse(ts);
        }
        catch (ParseException e)
        {
            throw new RuntimeException(e);
        }
    }

    /**
     * 日期路径 即年/月/日 如2018/08/08
     */
    public static final String datePath()
    {
        Date now = new Date();
        return DateFormatUtils.format(now, "yyyy/MM/dd");
    }

    /**
     * 日期路径 即年/月/日 如20180808
     */
    public static final String dateTime()
    {
        Date now = new Date();
        return DateFormatUtils.format(now, "yyyyMMdd");
    }

    /**
     * 日期型字符串转化为日期 格式
     */
    public static Date parseDate(Object str)
    {
        if (str == null)
        {
            return null;
        }
        try
        {
            return parseDate(str.toString(), parsePatterns);
        }
        catch (ParseException e)
        {
            return null;
        }
    }
    
    /**
     * 获取服务器启动时间
     */
    public static Date getServerStartDate()
    {
        long time = ManagementFactory.getRuntimeMXBean().getStartTime();
        return new Date(time);
    }

    /**
     * 计算两个时间差
     */
    public static String getDatePoor(Date endDate, Date nowDate)
    {
        long nd = 1000 * 24 * 60 * 60;
        long nh = 1000 * 60 * 60;
        long nm = 1000 * 60;
        // long ns = 1000;
        // 获得两个时间的毫秒时间差异
        long diff = endDate.getTime() - nowDate.getTime();
        // 计算差多少天
        long day = diff / nd;
        // 计算差多少小时
        long hour = diff % nd / nh;
        // 计算差多少分钟
        long min = diff % nd % nh / nm;
        // 计算差多少秒//输出结果
        // long sec = diff % nd % nh % nm / ns;
        return day + "天" + hour + "小时" + min + "分钟";
    }
}
```

## 异常错误信息处理

### 错误信息处理类

```java
/**
 * 错误信息处理类。
 *
 * @author ruoyi
 */
public class ExceptionUtil
{
    /**
     * 获取exception的详细错误信息。
     */
    public static String getExceptionMessage(Throwable e)
    {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw, true));
        String str = sw.toString();
        return str;
    }

    public static String getRootErrorMseeage(Exception e)
    {
        Throwable root = ExceptionUtils.getRootCause(e);
        root = (root == null ? e : root);
        if (root == null)
        {
            return "";
        }
        String msg = root.getMessage();
        if (msg == null)
        {
            return "null";
        }
        return StringUtils.defaultString(msg);
    }
}
```

## 线程

### 线程相关工具类

```java
/**
 * 线程相关工具类.
 * 
 * @author ruoyi
 */
public class Threads
{
    private static final Logger logger = LoggerFactory.getLogger(Threads.class);

    /**
     * sleep等待,单位为毫秒
     */
    public static void sleep(long milliseconds)
    {
        try
        {
            Thread.sleep(milliseconds);
        }
        catch (InterruptedException e)
        {
            return;
        }
    }

    /**
     * 停止线程池
     * 先使用shutdown, 停止接收新任务并尝试完成所有已存在任务.
     * 如果超时, 则调用shutdownNow, 取消在workQueue中Pending的任务,并中断所有阻塞函数.
     * 如果仍人超時，則強制退出.
     * 另对在shutdown时线程本身被调用中断做了处理.
     */
    public static void shutdownAndAwaitTermination(ExecutorService pool)
    {
        if (pool != null && !pool.isShutdown())
        {
            pool.shutdown();
            try
            {
                if (!pool.awaitTermination(120, TimeUnit.SECONDS))
                {
                    pool.shutdownNow();
                    if (!pool.awaitTermination(120, TimeUnit.SECONDS))
                    {
                        logger.info("Pool did not terminate");
                    }
                }
            }
            catch (InterruptedException ie)
            {
                pool.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    /**
     * 打印线程异常信息
     */
    public static void printException(Runnable r, Throwable t)
    {
        if (t == null && r instanceof Future<?>)
        {
            try
            {
                Future<?> future = (Future<?>) r;
                if (future.isDone())
                {
                    future.get();
                }
            }
            catch (CancellationException ce)
            {
                t = ce;
            }
            catch (ExecutionException ee)
            {
                t = ee.getCause();
            }
            catch (InterruptedException ie)
            {
                Thread.currentThread().interrupt();
            }
        }
        if (t != null)
        {
            logger.error(t.getMessage(), t);
        }
    }
}
```

## redis

### redis 工具类

```java
/**
 * spring redis 工具类
 *
 * @author ruoyi
 **/
@SuppressWarnings(value = { "unchecked", "rawtypes" })
@Component
public class RedisCache
{
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key 缓存的键值
     * @param value 缓存的值
     */
    public <T> void setCacheObject(final String key, final T value)
    {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key 缓存的键值
     * @param value 缓存的值
     * @param timeout 时间
     * @param timeUnit 时间颗粒度
     */
    public <T> void setCacheObject(final String key, final T value, final Integer timeout, final TimeUnit timeUnit)
    {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * 设置有效时间
     *
     * @param key Redis键
     * @param timeout 超时时间
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout)
    {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key Redis键
     * @param timeout 超时时间
     * @param unit 时间单位
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit)
    {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key 缓存键值
     * @return 缓存键值对应的数据
     */
    public <T> T getCacheObject(final String key)
    {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * 删除单个对象
     *
     * @param key
     */
    public boolean deleteObject(final String key)
    {
        return redisTemplate.delete(key);
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     * @return
     */
    public long deleteObject(final Collection collection)
    {
        return redisTemplate.delete(collection);
    }

    /**
     * 缓存List数据
     *
     * @param key 缓存的键值
     * @param dataList 待缓存的List数据
     * @return 缓存的对象
     */
    public <T> long setCacheList(final String key, final List<T> dataList)
    {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    public <T> List<T> getCacheList(final String key)
    {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 缓存Set
     *
     * @param key 缓存键值
     * @param dataSet 缓存的数据
     * @return 缓存数据的对象
     */
    public <T> BoundSetOperations<String, T> setCacheSet(final String key, final Set<T> dataSet)
    {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext())
        {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key
     * @return
     */
    public <T> Set<T> getCacheSet(final String key)
    {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 缓存Map
     *
     * @param key
     * @param dataMap
     */
    public <T> void setCacheMap(final String key, final Map<String, T> dataMap)
    {
        if (dataMap != null) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    /**
     * 获得缓存的Map
     *
     * @param key
     * @return
     */
    public <T> Map<String, T> getCacheMap(final String key)
    {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key Redis键
     * @param hKey Hash键
     * @param value 值
     */
    public <T> void setCacheMapValue(final String key, final String hKey, final T value)
    {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public <T> T getCacheMapValue(final String key, final String hKey)
    {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hKey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final Collection<Object> hKeys)
    {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 获得缓存的基本对象列表
     *
     * @param pattern 字符串前缀
     * @return 对象列表
     */
    public Collection<String> keys(final String pattern)
    {
        return redisTemplate.keys(pattern);
    }
}
```

