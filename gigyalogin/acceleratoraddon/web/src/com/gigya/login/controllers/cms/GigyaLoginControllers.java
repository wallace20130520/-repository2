package com.gigya.login.controllers.cms;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.gigya.common.api.exception.GigyaApiException;
import com.gigya.login.constants.GigyaAjaxResponce;
import com.gigya.login.constants.GigyaJsOnLoginInfo;
import com.gigya.login.constants.GigyaUserObject;
import com.gigya.login.model.GigyaSocialLoginComponentModel;
import com.gigya.login.model.GigyaUserModel;
import com.gigya.login.security.GigyaAutoLoginStrategy;
import com.gigya.login.service.GigyaLoginService;
import de.hybris.platform.addonsupport.controllers.cms.AbstractCMSAddOnComponentController;
import de.hybris.platform.cms2.model.contents.components.AbstractCMSComponentModel;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.commerceservices.customer.DuplicateUidException;
import de.hybris.platform.core.model.user.UserModel;
import de.hybris.platform.servicelayer.session.SessionService;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Optional;

@Controller
@RequestMapping("/gigya")
public class GigyaLoginControllers extends AbstractCMSAddOnComponentController
{
	@Resource
	private SessionService sessionService;

	@Resource(name = "cmsSiteService")
	private CMSSiteService cmsSiteService;

	private final ObjectMapper mapper = new ObjectMapper();

	@Resource
	private GigyaLoginService gigyaLoginService;

	@Resource(name = "gigyaAutoLoginStrategy")
	private GigyaAutoLoginStrategy gigyaAutoLoginStrategy;

	static final Logger log = Logger.getLogger(GigyaLoginControllers.class);

	@ResponseBody
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public GigyaAjaxResponce login(@RequestBody final MultiValueMap<String, String> bodyParameterMap,
			final HttpServletRequest request, final HttpServletResponse response)
	{
		final GigyaJsOnLoginInfo pars;
		final GigyaAjaxResponce res = new GigyaAjaxResponce();
		CMSSiteModel currentSite = cmsSiteService.getCurrentSite();
		try
		{
			mapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			mapper.configure(Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			pars = mapper.readValue(bodyParameterMap.getFirst("gigyaData"), GigyaJsOnLoginInfo.class);
			if (gigyaLoginService.verifyGigyaCall(currentSite, pars.getUID(), pars.getUIDSignature(), pars.getSignatureTimestamp()))
			{
				try
				{
					final GigyaUserObject gUser = gigyaLoginService.fetchGigyaInfo(currentSite, pars.getUID());
					if (gUser.isSiteUID())
					{
						final Optional<GigyaUserModel> user = gigyaLoginService.findCustomerByUid(gUser.getUID());
						gigyaAutoLoginStrategy.login(currentSite, user.orElseThrow(GigyaApiException::new), request, response);
						sessionService.getCurrentSession().setAttribute("gigyaLogin", new Boolean(true));
						res.setCode(0);
						res.setResult("success");
						res.setMessage("user logged in");
						return res;
					}
					else
					{

						try
						{
							if (StringUtils.isBlank(gUser.getEmail()))
							{
								gUser.setEmail(pars.getUser().getEmail());
							}
							final GigyaUserModel user = gigyaLoginService.createNewCustomer(currentSite, pars.getUID());
							gigyaAutoLoginStrategy.login(currentSite, user, request, response);
							sessionService.getCurrentSession().setAttribute("gigyaLogin", new Boolean(true));
							res.setCode(0);
							res.setResult("success");
							res.setMessage("new user registered");
							return res;
						}
						catch (final DuplicateUidException e)
						{
							log.info("user exist in database sending to link accounts");
							sessionService.getCurrentSession().setAttribute("gigyaLogin", new Boolean(true));
							sessionService.getCurrentSession().setAttribute("linkAccount", gUser.getUID());
							res.setCode(300);
							res.setResult("needAction");
							res.setMessage("duplicate email address");
							return res;
						}
					}

				}
				catch (final GigyaApiException e)
				{
					log.error("Gigya api exception", e);
					res.setCode(400);
					res.setResult("error");
					res.setMessage("error calling gigya");
					return res;
				}
				catch (final Exception e)
				{
					log.error("Error " + e.getMessage(), e);
					res.setCode(400);
					res.setResult("error");
					res.setMessage("error calling gigya");
					return res;

				}
			}
			log.error("Error invalid signature");
			res.setCode(600);
			res.setResult("error");
			res.setMessage("error invalid signature");
			return res;


		}
		catch (final IOException e)
		{
			log.error("JSON Error ", e);
			res.setCode(210);
			res.setResult("error");
			res.setMessage("json error");
			return res;

		}
	}

	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final AbstractCMSComponentModel component)
	{
		final HashMap<String, Object> loginConfig = new HashMap<>();

		final GigyaSocialLoginComponentModel comp = (GigyaSocialLoginComponentModel) component;
		loginConfig.put("height", comp.getHeight());
		loginConfig.put("width", comp.getWidth());
		loginConfig.put("containerID", comp.getContainerID());
		loginConfig.put("buttonsStyle", comp.getButtonsStyle().toString());
		loginConfig.put("showTermsLink", comp.getShowTermsLink());
		if (StringUtils.isNotBlank(comp.getAdvancedConfig()))
		{
			HashMap<String, Object> advConfig = new HashMap<>();
			final ObjectMapper mapper = new ObjectMapper();
			try
			{
				advConfig = mapper.readValue(comp.getAdvancedConfig(), HashMap.class);
				loginConfig.putAll(advConfig);
			}
			catch (final IOException e)
			{
				log.error(e);
			}

		}
		model.addAttribute("gigyaLoginConfig", loginConfig);

	}
}
