/*
 * [y] hybris Platform
 *
 * Copyright (c) 2018 SAP SE or an SAP affiliate company.  All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
package de.hybris.azurehackathon.core.jalo;

import de.hybris.platform.jalo.JaloSession;
import de.hybris.platform.jalo.extension.ExtensionManager;
import de.hybris.azurehackathon.core.constants.AzureHackathonCoreConstants;
import de.hybris.azurehackathon.core.setup.CoreSystemSetup;


/**
 * Do not use, please use {@link CoreSystemSetup} instead.
 * 
 */
public class AzureHackathonCoreManager extends GeneratedAzureHackathonCoreManager
{
	public static final AzureHackathonCoreManager getInstance()
	{
		final ExtensionManager em = JaloSession.getCurrentSession().getExtensionManager();
		return (AzureHackathonCoreManager) em.getExtension(AzureHackathonCoreConstants.EXTENSIONNAME);
	}
}
