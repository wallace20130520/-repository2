/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.backofficpatch.controller;

import static de.hybris.backofficpatch.constants.BackofficepatchConstants.PLATFORM_LOGO_CODE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.hybris.backofficpatch.service.BackofficepatchService;


@Controller
public class BackofficepatchHelloController
{
	@Autowired
	private BackofficepatchService backofficepatchService;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String printWelcome(final ModelMap model)
	{
		model.addAttribute("logoUrl", backofficepatchService.getHybrisLogoUrl(PLATFORM_LOGO_CODE));
		return "welcome";
	}
}
