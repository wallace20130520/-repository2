package com.gigya.login.controllers.cms;

import de.hybris.platform.addonsupport.controllers.AbstractAddOnController;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.core.model.user.UserModel;
import de.hybris.platform.servicelayer.user.UserService;

import java.io.IOException;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.gigya.common.api.exception.GigyaApiException;
import com.gigya.common.enums.GigyaSyncDirection;
import com.gigya.common.model.GigyaConfigModel;
import com.gigya.common.service.GigyaService;
import com.gigya.login.constants.GigyaAjaxResponce;
import com.gigya.login.constants.GigyaJsOnLoginInfo;
import com.gigya.login.model.GigyaUserModel;
import com.gigya.login.security.GigyaAutoLoginStrategy;
import com.gigya.login.service.GigyaLoginService;
import com.gigya.login.synchronization.GigyaSynchronizationService;

@Controller
@RequestMapping("/gigyaraas")
public class GigyaRaasController extends AbstractAddOnController {

    private static final Logger LOGGER = Logger.getLogger(GigyaRaasController.class);
    private static final ObjectMapper mapper;

    @Resource(name = "gigyaLoginService")
    private GigyaLoginService gigyaLoginService;

    @Resource(name = "gigyaAutoLoginStrategy")
    private GigyaAutoLoginStrategy gigyaAutoLoginStrategy;

    @Resource(name = "userService")
    private UserService userService;

    @Resource(name = "cmsSiteService")
    private CMSSiteService cmsSiteService;

    @Resource(name = "gigyaService")
    private GigyaService gigyaService;

    @Resource(name = "gigyaSynchronizationService")
    private GigyaSynchronizationService gigyaSynchronizationService;

    static {
        mapper = new ObjectMapper();
        mapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
    }

    @ResponseBody
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public GigyaAjaxResponce raasLogin(@RequestBody final MultiValueMap<String, String> bodyParameterMap,
                                       final HttpServletRequest request, final HttpServletResponse response) {
        final GigyaAjaxResponce res = new GigyaAjaxResponce();
        CMSSiteModel currentSite = cmsSiteService.getCurrentSite();
        Optional<GigyaConfigModel> configurationForSite = gigyaService
            .getConfigurationForSite(currentSite);
        if (!configurationForSite.isPresent()) {
            res.setCode(405);
            res.setMessage("No Gigya configuration created for the storefront!");
            res.setResult("error");
            return res;
        }
        try {
            final GigyaJsOnLoginInfo jsInfo = mapper
                .readValue(bodyParameterMap.getFirst("gigyaData"), GigyaJsOnLoginInfo.class);
            try {
                if (gigyaLoginService
                    .verifyGigyaCall(currentSite, jsInfo.getUID(), jsInfo.getUIDSignature(), jsInfo
                        .getSignatureTimestamp())) {
                    Optional<GigyaUserModel> optionalUserModel = gigyaLoginService
                        .findCustomerByGigyaUid(jsInfo.getUID());
                    if (optionalUserModel.isPresent()) {
                        GigyaUserModel user = optionalUserModel.get();
                        gigyaAutoLoginStrategy.login(currentSite, user, request, response);
                        res.setCode(0);
                        res.setResult("success");
                        res.setMessage("user logged in");
                        return res;
                    }
                    else {
                        if (userService.isUserExisting(jsInfo.getUID())) {
                            res.setCode(500);
                            res.setMessage("This email is already taken, please use other email.");
                            res.setResult("error");
                            return res;
                        }
                        else {
                            GigyaUserModel newCustmer = gigyaLoginService
                                .createNewCustomer(currentSite, jsInfo.getUID());
                            gigyaAutoLoginStrategy
                                .login(currentSite, newCustmer, request, response);
                            res.setCode(0);
                            res.setResult("success");
                            res.setMessage("user logged in");
                            return res;
                        }
                    }
                }
                res.setCode(403);
                res.setMessage("Invalid gigya uid");
                res.setResult("error");
                return res;
            }
            catch (Exception e) {
                LOGGER.error(e);
                res.setCode(500);
                res.setMessage("An error occurred: " + e.getMessage());
                res.setResult("error");
                try {
                    gigyaLoginService.notifyGigyaOfLogout(currentSite, jsInfo.getUID());
                }
                catch (GigyaApiException e1) {
                    LOGGER.error("Error: " + e1.getMessage(), e1);
                }
            }
        }
        catch (IOException e1) {
            LOGGER.error("Error: " + e1.getMessage(), e1);
            res.setCode(500);
            res.setMessage("An error occurred: " + e1.getMessage());
            res.setResult("error");
        }
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "/profile", method = RequestMethod.POST)
    public GigyaAjaxResponce raasProfile(@RequestBody final MultiValueMap<String, String> bodyParameterMap) {
        final GigyaAjaxResponce res = new GigyaAjaxResponce();
        final GigyaJsOnLoginInfo jsInfo;
        CMSSiteModel currentSite = cmsSiteService.getCurrentSite();
        try {
            jsInfo = mapper
                .readValue(bodyParameterMap.getFirst("gigyaData"), GigyaJsOnLoginInfo.class);
            if (gigyaLoginService
                .verifyGigyaCall(currentSite, jsInfo.getUID(), jsInfo.getUIDSignature(), jsInfo
                    .getSignatureTimestamp())) {
                Optional<GigyaConfigModel> configurationForSite = gigyaService
                    .getConfigurationForSite(currentSite);
                UserModel currentUser = userService.getCurrentUser();
                if (configurationForSite.isPresent() && currentUser instanceof GigyaUserModel) {
                    gigyaSynchronizationService
                        .synchronizeCustomer(currentSite, (GigyaUserModel) currentUser, configurationForSite
                            .get().getProfileUpdateSynchronization(), GigyaSyncDirection.G2H);
                }
            }
        }
        catch (final IOException | GigyaApiException e) {
            LOGGER.error(e.getMessage(), e);
        }
        return res;
    }

    //    @ResponseBody
    //    @RequestMapping(value = "/updateUser", method = RequestMethod.POST)
    //    public GigyaAjaxResponce updateUser(@RequestBody final MultiValueMap<String, String> bodyParameterMap) {
    //        final GigyaAjaxResponce responce = new GigyaAjaxResponce();
    //        if (!bodyParameterMap.containsKey("APIKey") || !bodyParameterMap.containsKey("uid")) {
    //            responce.setCode(400);
    //            responce.setMessage("Some of the required parameters are missing!");
    //            return responce;
    //        }
    //        Optional<GigyaConfigModel> apiKey = gigyaConfigDao
    //            .findGigyaConfigWithApikey(bodyParameterMap.getFirst("APIKey"));
    //        if (!apiKey.isPresent()) {
    //            responce.setCode(400);
    //            responce.setMessage("The Api Key does not match any configuration in Hybris!");
    //            return responce;
    //        }
    //        Optional<GigyaUserModel> uid = gigyaLoginService
    //            .findCustomerByGigyaUid(bodyParameterMap.getFirst("uid"));
    //        CronJobModel cj = cronJobService.getCronJob("gigyaToHybrisSyncCronJob");
    //        if (cj instanceof GigyaUpdateCronjobModel && uid.isPresent()) {
    //            GigyaUpdateCronjobModel gigyaUpdateCronjobModel = (GigyaUpdateCronjobModel) cj;
    //            Set<String> uidsToUpdate = new HashSet<>(gigyaUpdateCronjobModel.getGigyaUIDList());
    //            uidsToUpdate.add(uid.get().getGigyaUID());
    //            gigyaUpdateCronjobModel.setGigyaUIDList(uidsToUpdate);
    //            modelService.save(gigyaUpdateCronjobModel);
    //        }
    //        return responce;
    //    }
}
