/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.backofficpatch.setup;

import static de.hybris.backofficpatch.constants.BackofficepatchConstants.PLATFORM_LOGO_CODE;

import de.hybris.platform.core.initialization.SystemSetup;

import java.io.InputStream;

import de.hybris.backofficpatch.constants.BackofficepatchConstants;
import de.hybris.backofficpatch.service.BackofficepatchService;


@SystemSetup(extension = BackofficepatchConstants.EXTENSIONNAME)
public class BackofficepatchSystemSetup
{
	private final BackofficepatchService backofficepatchService;

	public BackofficepatchSystemSetup(final BackofficepatchService backofficepatchService)
	{
		this.backofficepatchService = backofficepatchService;
	}

	@SystemSetup(process = SystemSetup.Process.INIT, type = SystemSetup.Type.ESSENTIAL)
	public void createEssentialData()
	{
		backofficepatchService.createLogo(PLATFORM_LOGO_CODE);
	}

	private InputStream getImageStream()
	{
		return BackofficepatchSystemSetup.class.getResourceAsStream("/backofficepatch/sap-hybris-platform.png");
	}
}
