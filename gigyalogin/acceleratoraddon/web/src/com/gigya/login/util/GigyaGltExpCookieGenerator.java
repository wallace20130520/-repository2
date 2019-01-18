package com.gigya.login.util;

import com.gigya.common.enums.GigyaSessionType;
import com.gigya.common.model.GigyaConfigModel;
import com.gigya.common.service.GigyaService;
import com.gigya.socialize.Base64;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import org.apache.log4j.Logger;
import org.springframework.util.Assert;
import org.springframework.web.util.CookieGenerator;
import org.springframework.web.util.WebUtils;

import javax.annotation.Resource;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.FieldPosition;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Optional;
import java.util.TimeZone;

public class GigyaGltExpCookieGenerator extends CookieGenerator
{

    @Resource(name = "cmsSiteService")
    private CMSSiteService cmsSiteService;

    @Resource(name = "gigyaService")
    private GigyaService gigyaService;

    private static final String OLD_COOKIE_PATTERN = "EEE, dd-MMM-yyyy HH:mm:ss z";
    private static final ThreadLocal<DateFormat> OLD_COOKIE_FORMAT = ThreadLocal.withInitial(() ->
                                                                                             {
                                                                                                 final DateFormat df = new SimpleDateFormat(
                                                                                                     OLD_COOKIE_PATTERN,
                                                                                                     Locale.US);
                                                                                                 df.setTimeZone(TimeZone
                                                                                                                    .getTimeZone(
                                                                                                                        "GMT"));
                                                                                                 return df;
                                                                                             });

    private static final String HEADER_COOKIE = "Set-Cookie";

    private static final String ancientDate;

    static
    {
        ancientDate = OLD_COOKIE_FORMAT.get().format(new Date(10000));
    }

    private static final Logger LOG = Logger.getLogger(GigyaGltExpCookieGenerator.class);

    private static final String GLT_COOKIE_NAME_PREFIX = "glt_";
    private static final String GLTEXP_COOKIE_NAME_PREFIX = "gltexp_";
    private static final String ALGORITHM_NAME = "HmacSHA1";

    public void addCookie(HttpServletRequest req, HttpServletResponse res, GigyaConfigModel config)
    {
        Cookie gltCookie = WebUtils.getCookie(req, GLT_COOKIE_NAME_PREFIX + config.getGigyaApiKey());

        if (gltCookie != null)
        {
            setCookieName(GLTEXP_COOKIE_NAME_PREFIX + config.getGigyaApiKey());
            setCookieSecure(false);
            if (!GigyaSessionType.BROWSERCLOSED.equals(config.getSessionConfiguration().getSessionType()))
            {
                setCookieMaxAge(config.getSessionConfiguration().getDurationInSeconds());
            }
            else
            {
                setCookieMaxAge(-1);
            }
            setCookieHttpOnly(false);
            try
            {
                addCookie(res, generateGltExpCookieValue(gltCookie.getValue(), config));
            }
            catch (UnsupportedEncodingException | InvalidKeyException e)
            {
                LOG.error(e);
            }
        }
    }

    @Override
    public void removeCookie(HttpServletResponse response)
    {
        CMSSiteModel currentSite = cmsSiteService.getCurrentSite();
        if (currentSite != null)
        {
            Optional<GigyaConfigModel> configurationForSite = gigyaService.getConfigurationForSite(currentSite);
            configurationForSite.ifPresent(conf -> removeCookie(response, conf));
        }
        else
        {
            logger.debug("Could not remove cookie because there is no CMSSite in the session!");
        }
    }

    public void removeCookie(HttpServletResponse response, GigyaConfigModel configModel)
    {
        Assert.notNull(response, "HttpServletResponse must not be null");
        this.setCookieName(GLTEXP_COOKIE_NAME_PREFIX + configModel.getGigyaApiKey());
        Cookie cookie = this.createCookie("");
        cookie.setMaxAge(0);
        cookie.setSecure(false);
        cookie.setHttpOnly(false);
        response.addCookie(cookie);

        if (this.logger.isDebugEnabled())
        {
            this.logger.debug("Removed cookie with name [" + this.getCookieName() + "]");
        }
    }


    @Override
    public void addCookie(final HttpServletResponse response, final String cookieValue)
    {
        super.addCookie(new HttpServletResponseWrapper(response)
        {
            @Override
            public void addCookie(final Cookie cookie)
            {
                final StringBuffer headerBuffer = new StringBuffer(100);
                appendCookieValue(headerBuffer, cookie.getVersion(), cookie.getName(), cookie.getValue(),
                                  cookie.getPath(), cookie.getDomain(), cookie.getComment(), cookie.getMaxAge());
                response.addHeader(HEADER_COOKIE, headerBuffer.toString());
            }
        }, cookieValue);
    }

    private static String generateGltExpCookieValue(String glt, GigyaConfigModel config)
        throws UnsupportedEncodingException, InvalidKeyException
    {
        String loginToken = URLDecoder.decode(glt, "UTF-8").split("\\|")[0];
        String expTimeUnix = String
            .valueOf((new Date().getTime() / 1000L) + config.getSessionConfiguration().getDurationInSeconds());
        String unsignedExpString = loginToken + "_" + expTimeUnix + "_" + config.getGigyaUserKey();
        String signedExpString = calcSignature(ALGORITHM_NAME, unsignedExpString,
                                               Base64.decode(config.getGigyaUserSecret()));

        return expTimeUnix + "_" + config.getGigyaUserKey() + "_" + signedExpString;
    }

    private static String calcSignature(String algorithmName, String text, byte[] key) throws InvalidKeyException,
                                                                                              UnsupportedEncodingException
    {
        byte[] textData = text.getBytes("UTF-8");
        SecretKeySpec signingKey = new SecretKeySpec(key, algorithmName);

        Mac mac;
        try
        {
            mac = Mac.getInstance(algorithmName);
        }
        catch (NoSuchAlgorithmException e)
        {
            LOG.error(e);
            return null;
        }

        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(textData);

        return Base64.encodeToString(rawHmac, true);
    }

    private static void appendCookieValue(final StringBuffer headerBuf, final int version, final String name, final String value,
                                          final String path, final String domain, final String comment, final int maxAge)
    {
        final StringBuffer buf = new StringBuffer();
        buf.append(name);
        buf.append("=");

        int newVersion = getNewVersionBeforeCookieHeader(value, path, domain, comment, version);

        addVersionAndDomainInfo(value, domain, comment, buf, newVersion);

        addMaxAgeInfo(maxAge, buf, newVersion);

        if (path != null)
        {
            buf.append("; Path=");
            maybeQuote(buf, path);
        }
        headerBuf.append(buf);
    }

    private static int getNewVersionBeforeCookieHeader(final String value, final String path, final String domain,
                                                       final String comment, final int version)
    {
        int newVersion = getNewVersionFromTokenInValueOrComment(value, comment, version);
        if (newVersion == 0)
        {
            newVersion = getNewVersionFromTokenInPathOrDomain(path, domain, newVersion);
        }
        return newVersion;
    }

    private static int getNewVersionFromTokenInValueOrComment(final String value, final String comment, final int version)
    {
        int newVersion = version;

        if (newVersion == 0 && hasCookieSupport(value))
        {
            newVersion = 1;
        }

        if (newVersion == 0 && comment != null)
        {
            newVersion = 1;
        }
        return newVersion;
    }

    private static int getNewVersionFromTokenInPathOrDomain(final String path, final String domain, final int version)
    {
        int newVersion = version;

        if (hasCookieSupport(path))
        {
            newVersion = 1;
        }

        if (newVersion == 0 && hasCookieSupport(domain))
        {
            newVersion = 1;
        }
        return newVersion;
    }

    private static boolean hasCookieSupport(String value)
    {
        return !CookieSupport.ALLOW_HTTP_SEPARATORS_IN_V0 && CookieSupport
            .isHttpToken(value) || CookieSupport.ALLOW_HTTP_SEPARATORS_IN_V0
                                   && CookieSupport.isV0Token(value);
    }

    private static void addMaxAgeInfo(final int maxAge, final StringBuffer buf, final int newVersion)
    {
        if (maxAge >= 0)
        {
            if (newVersion > 0)
            {
                buf.append("; Max-Age=");
                buf.append(maxAge);
            }
            if (newVersion == 0 || CookieSupport.ALWAYS_ADD_EXPIRES)
            {
                buf.append("; Expires=");
                if (maxAge == 0)
                {
                    buf.append(ancientDate);
                }
                else
                {
                    OLD_COOKIE_FORMAT.get()
                        .format(new Date(System.currentTimeMillis() + maxAge * 1000L), buf, new FieldPosition(0));
                }
            }
        }
    }

    private static void addVersionAndDomainInfo(final String value, final String domain, final String comment,
                                                final StringBuffer buf, final int newVersion)
    {
        buf.append(value);
        if (newVersion == 1)
        {
            buf.append("; Version=1");

            if (comment != null)
            {
                buf.append("; Comment=");
                maybeQuote(buf, comment);
            }
        }

        if (domain != null)
        {
            buf.append("; Domain=");
            maybeQuote(buf, domain);
        }
    }

    private static void maybeQuote(final StringBuffer buf, final String value)
    {
        if (value == null || value.isEmpty())
        {
            buf.append("\"\"");
        }
        else if (CookieSupport.alreadyQuoted(value))
        {
            buf.append('"');
            buf.append(escapeDoubleQuotes(value, 1, value.length() - 1));
            buf.append('"');
        }
        else if (CookieSupport.isHttpToken(value) && !CookieSupport.ALLOW_HTTP_SEPARATORS_IN_V0 || CookieSupport
                                                                                                       .isV0Token(value)
                                                                                                   && CookieSupport.ALLOW_HTTP_SEPARATORS_IN_V0)
        {
            buf.append('"');
            buf.append(escapeDoubleQuotes(value, 0, value.length()));
            buf.append('"');
        }
        else
        {
            buf.append(value);
        }
    }

    private static String escapeDoubleQuotes(final String s, final int beginIndex, final int endIndex)
    {

        if (s == null || s.isEmpty() || s.indexOf('"') == -1)
        {
            return s;
        }

        final StringBuilder result = new StringBuilder();
        boolean ignoreChar = false;
        for (int i = beginIndex; i < endIndex; i++)
        {
            if (!ignoreChar)
            {
                final char c = s.charAt(i);
                ignoreChar = modifyDoubleQuotesChar(s, endIndex, result, i, c);
            }
            else
            {
                ignoreChar = false;
            }
        }

        return result.toString();
    }

    private static boolean modifyDoubleQuotesChar(final String processedString, final int endIndex, final StringBuilder result,
                                                  int stringIndex, final char charString)
    {
        if (charString == '\\')
        {
            result.append(charString);
            if (stringIndex >= endIndex - 1)
            {
                throw new IllegalArgumentException("Invalid escape character in cookie value.");
            }
            result.append(processedString.charAt(stringIndex + 1));
            return true;
        }
        else if (charString == '"')
        {
            result.append('\\').append('"');
        }
        else
        {
            result.append(charString);
        }
        return false;
    }


    private static final class CookieSupport
    {
        /**
         * If set to true, we parse cookies strictly according to the servlet, cookie and HTTP specs by default.
         */
        static final boolean STRICT_SERVLET_COMPLIANCE;

        /**
         * If true, cookie values are allowed to contain an equals character without being quoted.
         */
        static final boolean ALLOW_EQUALS_IN_VALUE;

        /**
         * If true, separators that are not explicitly dis-allowed by the v0 cookie spec but are disallowed by the HTTP
         * spec will be allowed in v0 cookie names and values. These characters are: \"()/:<=>?@[\\]{} Note that the
         * inclusion of / depends on the value of {@link #FWD_SLASH_IS_SEPARATOR}.
         */
        static final boolean ALLOW_HTTP_SEPARATORS_IN_V0;

        /**
         * If set to false, we don't use the IE6/7 Max-Age/Expires work around. Default is usually true. If
         * STRICT_SERVLET_COMPLIANCE==true then default is false. Explicitly setting always takes priority.
         */
        static final boolean ALWAYS_ADD_EXPIRES;

        /**
         * If set to true, the <code>/</code> character will be treated as a separator. Default is usually false. If
         * STRICT_SERVLET_COMPLIANCE==true then default is true. Explicitly setting always takes priority.
         */
        static final boolean FWD_SLASH_IS_SEPARATOR;

        /**
         * If true, name only cookies will be permitted.
         */
        static final boolean ALLOW_NAME_ONLY;

        /**
         * The list of separators that apply to version 0 cookies. To quote the spec, these are comma, semi-colon and
         * white-space. The HTTP spec definition of linear white space is [CRLF] 1*( SP | HT )
         */
        private static final char[] V0_SEPARATORS = {',', ';', ' ', '\t'};
        private static final boolean[] V0_SEPARATOR_FLAGS = new boolean[128];

        /**
         * The list of separators that apply to version 1 cookies. This may or may not include '/' depending on the
         * setting of {@link #FWD_SLASH_IS_SEPARATOR}.
         */
        private static final char[] HTTP_SEPARATORS;
        private static final boolean[] HTTP_SEPARATOR_FLAGS = new boolean[128];
        private static final String DEFAULT_FALSE_VALUE = "false";

        static
        {
            STRICT_SERVLET_COMPLIANCE = Boolean
                .parseBoolean(System.getProperty("org.apache.catalina.STRICT_SERVLET_COMPLIANCE", DEFAULT_FALSE_VALUE));

            ALLOW_EQUALS_IN_VALUE = Boolean.parseBoolean(
                System.getProperty("org.apache.tomcat.util.http.ServerCookie.ALLOW_EQUALS_IN_VALUE",
                                   DEFAULT_FALSE_VALUE));

            ALLOW_HTTP_SEPARATORS_IN_V0 = Boolean.parseBoolean(
                System.getProperty("org.apache.tomcat.util.http.ServerCookie.ALLOW_HTTP_SEPARATORS_IN_V0",
                                   DEFAULT_FALSE_VALUE));

            final String alwaysAddExpires = System
                .getProperty("org.apache.tomcat.util.http.ServerCookie.ALWAYS_ADD_EXPIRES");
            if (alwaysAddExpires == null)
            {
                ALWAYS_ADD_EXPIRES = !STRICT_SERVLET_COMPLIANCE;
            }
            else
            {
                ALWAYS_ADD_EXPIRES = Boolean.parseBoolean(alwaysAddExpires);
            }

            final String fwdSlashIsSeparator = System
                .getProperty("org.apache.tomcat.util.http.ServerCookie.FWD_SLASH_IS_SEPARATOR");
            if (fwdSlashIsSeparator == null)
            {
                FWD_SLASH_IS_SEPARATOR = STRICT_SERVLET_COMPLIANCE;
            }
            else
            {
                FWD_SLASH_IS_SEPARATOR = Boolean.parseBoolean(fwdSlashIsSeparator);
            }

            ALLOW_NAME_ONLY = Boolean.parseBoolean(
                System.getProperty("org.apache.tomcat.util.http.ServerCookie.ALLOW_NAME_ONLY", DEFAULT_FALSE_VALUE));


            /*
             * Excluding the '/' char by default violates the RFC, but it looks like a lot of people put '/' in unquoted
             * values: '/': ; //47 '\t':9 ' ':32 '\"':34 '(':40 ')':41 ',':44 ':':58 ';':59 '<':60 '=':61 '>':62 '?':63
             * '@':64 '[':91 '\\':92 ']':93 '{':123 '}':125
             */
            if (CookieSupport.FWD_SLASH_IS_SEPARATOR)
            {
                HTTP_SEPARATORS = new char[]{'\t', ' ', '\"', '(', ')', ',', '/', ':', ';', '<', '=', '>', '?', '@',
                                             '[', '\\',
                                             ']', '{', '}'};
            }
            else
            {
                HTTP_SEPARATORS = new char[]{'\t', ' ', '\"', '(', ')', ',', ':', ';', '<', '=', '>', '?', '@', '[',
                                             '\\', ']',
                                             '{', '}'};
            }
            for (int i = 0; i < 128; i++)
            {
                V0_SEPARATOR_FLAGS[i] = false;
                HTTP_SEPARATOR_FLAGS[i] = false;
            }
            for (final char V0_SEPARATOR : V0_SEPARATORS)
            {
                V0_SEPARATOR_FLAGS[V0_SEPARATOR] = true;
            }
            for (final char HTTP_SEPARATOR : HTTP_SEPARATORS)
            {
                HTTP_SEPARATOR_FLAGS[HTTP_SEPARATOR] = true;
            }

        }

        /**
         * Returns true if the byte is a separator as defined by V0 of the cookie spec.
         */
        private static boolean isV0Separator(final char c)
        {
            if ((c < 0x20 || c >= 0x7f) && c != 0x09)
            {
                throw new IllegalArgumentException("Control character in cookie value or attribute.");
            }

            return V0_SEPARATOR_FLAGS[c];
        }

        static boolean isV0Token(final String value)
        {
            if (value == null)
            {
                return false;
            }

            int i = 0;
            int len = value.length();

            if (alreadyQuoted(value))
            {
                i++;
                len--;
            }

            for (; i < len; i++)
            {
                final char c = value.charAt(i);

                if (isV0Separator(c))
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * Returns true if the byte is a separator as defined by V1 of the cookie spec, RFC2109.
         *
         * @throws IllegalArgumentException if a control character was supplied as input
         */
        private static boolean isHttpSeparator(final char c)
        {
            if ((c < 0x20 || c >= 0x7f) && c != 0x09)
            {
                throw new IllegalArgumentException("Control character in cookie value or attribute.");
            }

            return HTTP_SEPARATOR_FLAGS[c];
        }

        private static boolean isHttpToken(final String value)
        {
            if (value == null)
            {
                return false;
            }

            int i = 0;
            int len = value.length();

            if (alreadyQuoted(value))
            {
                i++;
                len--;
            }

            for (; i < len; i++)
            {
                final char c = value.charAt(i);

                if (isHttpSeparator(c))
                {
                    return true;
                }
            }
            return false;
        }

        private static boolean alreadyQuoted(final String value)
        {
            return value != null && value.length() >= 2 && value.charAt(0) == '\"' && value.charAt(
                value.length() - 1) == '\"';
        }
    }
}
