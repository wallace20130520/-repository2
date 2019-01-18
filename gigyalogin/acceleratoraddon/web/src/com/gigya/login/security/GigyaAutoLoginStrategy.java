package com.gigya.login.security;

import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.core.model.user.UserModel;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface GigyaAutoLoginStrategy
{
	/**
	 * @param usr
	 * @param request
	 * @param response
	 */
	void login(CMSSiteModel site, UserModel usr, HttpServletRequest request, HttpServletResponse response) throws Exception;

}
