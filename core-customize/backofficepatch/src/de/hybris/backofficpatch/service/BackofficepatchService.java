/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.backofficpatch.service;

public interface BackofficepatchService
{
	String getHybrisLogoUrl(String logoCode);

	void createLogo(String logoCode);
}
