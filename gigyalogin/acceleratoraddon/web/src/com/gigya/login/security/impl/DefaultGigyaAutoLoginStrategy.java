package com.gigya.login.security.impl;

import de.hybris.platform.acceleratorstorefrontcommons.security.GUIDCookieStrategy;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.commercefacades.customer.CustomerFacade;
import de.hybris.platform.core.Constants;
import de.hybris.platform.core.model.user.UserModel;
import de.hybris.platform.jalo.user.UserManager;
import de.hybris.platform.servicelayer.session.SessionService;
import de.hybris.platform.servicelayer.user.UserService;
import de.hybris.platform.util.Config;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.RememberMeServices;

import com.gigya.common.api.exception.GigyaApiException;
import com.gigya.common.dao.GigyaConfigDao;
import com.gigya.common.enums.GigyaSessionLead;
import com.gigya.common.enums.GigyaSessionType;
import com.gigya.common.enums.GigyaSyncDirection;
import com.gigya.common.model.GigyaConfigModel;
import com.gigya.login.model.GigyaUserModel;
import com.gigya.login.security.GigyaAutoLoginStrategy;
import com.gigya.login.synchronization.GigyaSynchronizationService;
import com.gigya.login.util.GigyaGltExpCookieGenerator;

public class DefaultGigyaAutoLoginStrategy implements GigyaAutoLoginStrategy {

    private CustomerFacade customerFacade;

    private GUIDCookieStrategy guidCookieStrategy;

    private RememberMeServices rememberMeServices;

    private UserService userService;

    private GigyaConfigDao gigyaConfigDao;

    private SessionService sessionService;

    private GigyaGltExpCookieGenerator generator;

    private GigyaSynchronizationService gigyaSynchronizationService;

    private static final Logger LOG = Logger.getLogger(DefaultGigyaAutoLoginStrategy.class);

    @Override
    public void login(CMSSiteModel cmsSite, final UserModel usr, final HttpServletRequest request, final HttpServletResponse response) {
        try {
            final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(usr
                .getUid(),
                usr.getPasswordEncoding());
            userService.setCurrentUser(usr);
            final ArrayList<GrantedAuthority> auth = new ArrayList<>();
            auth.add(new SimpleGrantedAuthority(
                "ROLE_" + Constants.USER.CUSTOMER_USERGROUP.toUpperCase()));
            final Authentication authentication = new GigyaAutentication(usr, auth, cmsSite);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            customerFacade.loginSuccess();
            guidCookieStrategy.setCookie(request, response);
            rememberMeServices.loginSuccess(request, response, token);
            Optional<GigyaConfigModel> gigyaConfigOptional = gigyaConfigDao
                .findGigyaConfig(cmsSite);
            if (usr instanceof GigyaUserModel && gigyaConfigOptional.isPresent()) {
                try {
                    gigyaSynchronizationService.synchronizeCustomer(gigyaConfigOptional
                        .get(), (GigyaUserModel) usr, gigyaConfigOptional.get()
                        .getLoginSynchronization(), GigyaSyncDirection.G2H);
                }
                catch (GigyaApiException e) {
                    LOG.error(e);
                }
            }
            if (gigyaConfigOptional.isPresent()) {
                GigyaConfigModel gigyaConfig = gigyaConfigOptional.get();
                sessionService
                    .setAttribute("gigyaConfiguration", gigyaConfig);
                if (gigyaConfig.getSessionConfiguration() != null && GigyaSessionLead.GIGYA
                    .equals(gigyaConfig.getSessionConfiguration().getSessionLead())) {
                    if (GigyaSessionType.SLIDING
                        .equals(gigyaConfig.getSessionConfiguration().getSessionType())) {
                        generator.addCookie(request, response, gigyaConfig);
                    }

                    if (GigyaSessionType.BROWSERCLOSED
                        .equals(gigyaConfig.getSessionConfiguration().getSessionType())) {
                        UserManager.getInstance()
                            .storeLoginTokenCookie(Config
                                    .getString("login.token.name", "GigyaSessionToken"), usr.getUid(),
                                usr.getSessionLanguage().getIsocode(), usr.getEncodedPassword(),
                                request.getContextPath(),
                                usr.getDomain(), true,
                                gigyaConfig.getSessionConfiguration()
                                    .getSessionDuration(), response);
                    }
                    else {
                        UserManager.getInstance()
                            .storeLoginTokenCookie(Config
                                    .getString("login.token.name", "GigyaSessionToken"), usr.getUid(),
                                usr.getSessionLanguage().getIsocode(), usr.getEncodedPassword(),
                                request.getContextPath(),
                                usr.getDomain(), true,
                                gigyaConfig.getSessionConfiguration()
                                    .getDurationInSeconds(), response);
                    }

                    if (GigyaSessionType.FIXED
                        .equals(gigyaConfig.getSessionConfiguration().getSessionType())) {
                        sessionService.getCurrentSession()
                            .setAttribute("sessionCreationTime", new Date());
                    }
                }
            }
        }
        catch (final Exception e) {
            SecurityContextHolder.getContext().setAuthentication(null);
            LOG.error("Failure during autoLogin", e);
        }
    }

    @Required
    public void setCustomerFacade(final CustomerFacade customerFacade) {
        this.customerFacade = customerFacade;
    }

    @Required
    public void setGuidCookieStrategy(final GUIDCookieStrategy guidCookieStrategy) {
        this.guidCookieStrategy = guidCookieStrategy;
    }

    @Required
    public void setRememberMeServices(final RememberMeServices rememberMeServices) {
        this.rememberMeServices = rememberMeServices;
    }

    @Required
    public void setUserService(final UserService userService) {
        this.userService = userService;
    }

    @Required
    public void setGigyaConfigDao(GigyaConfigDao gigyaConfigDao) {
        this.gigyaConfigDao = gigyaConfigDao;
    }

    @Required
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Required
    public void setGenerator(GigyaGltExpCookieGenerator generator) {
        this.generator = generator;
    }

    @Required
    public void setGigyaSynchronizationService(GigyaSynchronizationService gigyaSynchronizationService) {
        this.gigyaSynchronizationService = gigyaSynchronizationService;
    }
}
