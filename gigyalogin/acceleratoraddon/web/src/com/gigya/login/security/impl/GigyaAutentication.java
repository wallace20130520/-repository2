/**
 *
 */
package com.gigya.login.security.impl;

import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.core.model.user.UserModel;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;


/**
 * @author yaniv
 *
 */
public class GigyaAutentication extends AbstractAuthenticationToken
{
	private String principal;
	private CMSSiteModel cmsSiteModel;

	public GigyaAutentication(final UserModel user, final Collection<? extends GrantedAuthority> auth, CMSSiteModel cmsSiteModel)
	{
		super(auth);
		this.cmsSiteModel = cmsSiteModel;
		this.principal = user.getUid();
		super.setAuthenticated(true);
	}

	/**
	 * @param arg0
	 */
	public GigyaAutentication(final Collection<? extends GrantedAuthority> arg0)
	{
		super(arg0);
		// YTODO Auto-generated constructor stub
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.springframework.security.authentication.AbstractAuthenticationToken#isAuthenticated()
	 */
	@Override
	public boolean isAuthenticated()
	{
		// YTODO Auto-generated method stub
		return true;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.security.core.Authentication#getCredentials()
	 */
	@Override
	public Object getCredentials()
	{
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.security.core.Authentication#getPrincipal()
	 */
	@Override
	public Object getPrincipal()
	{
		return this.principal;
	}

	public CMSSiteModel getCmsSiteModel()
	{
		return cmsSiteModel;
	}
}
