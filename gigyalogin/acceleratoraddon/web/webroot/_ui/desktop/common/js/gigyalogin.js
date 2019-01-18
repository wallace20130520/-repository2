gigyaHybris = window.gigyaHybris || {};
gigyaHybris.gigyaFunctions = gigyaHybris.gigyaFunctions || {};
gigyaHybris.gigyaCache = gigyaHybris.gigyaCache || {};
gigyaHybris.gigyaFunctions.sendLogin = function(response) {
	jQuery
			.ajax(ACC.config.contextPath + "/gigya/login", {
				data : {
					gigyaData : JSON.stringify(response)
				},
				dataType : "json",
				type : "post"
			})
			.done(
					function(data, textStatus, jqXHR) {
						if (data.code != 0) {
							if (data.code == 300) {
								alert("A user with the same email was found on the system, please login and use the add conction widget to add the social network")
								window.location.href = ACC.config.contextPath
										+ "/login"
							}
							alert(data.message);
							gigya.socialize.logout();
						} else {
							window.location.reload(false);
						}
					});
};

gigyaHybris.gigyaFunctions.login = function(response) {
	if (!response.user.email && !response.isSiteUID) {
		gigyaHybris.gigyaCache.response = response;
		$("#missing-info").dialog("open");
	} else {
		gigyaHybris.gigyaFunctions.sendLogin(response);
	}
};

gigyaHybris.gigyaFunctions.logout = function(response) {
		window.location.href = ACC.config.contextPath + "/logout";
};

gigyaHybris.gigyaFunctions.raasLogin = function(response) {
	jQuery.ajax(ACC.config.contextPath + "/gigyaraas/login", {
		data : {
			gigyaData : JSON.stringify(response)
		},
		dataType : "json",
		type : "post"
	}).done(function(data, textStatus, jqXHR) {
		if (data.code != 0) {
			alert(data.message);
			gigya.accounts.logout();
		} else {
			window.location.reload(false);
		}
	});
};

gigyaHybris.gigyaFunctions.raasEditProfile = function(response) {
	var res = response;
	$.ajax(ACC.config.contextPath + "/gigyaraas/profile", {
		data : {
			gigyaData : JSON.stringify(response.response)
		},
		dataType : "json",
		type : "post"
	});

};

gigyaHybris.gigyaFunctions.raasClick = function() {
	$(".gigya-raas-link")
			.click(
					function(event) {
						event.preventDefault();
						var id = $(this).attr("data-gigya-id");
						var profileEdit = $(this).attr("data-profile-edit");
						if (profileEdit) {
							window.gigyaHybris.raas[id].onAfterSubmit = gigyaHybris.gigyaFunctions.raasEditProfile;
						}
						gigya.accounts.showScreenSet(window.gigyaHybris.raas[id]);
					});
};


gigyaHybris.gigyaFunctions.raasEmbed = function() {
	if (gigyaHybris.raas) {
      $.each(gigyaHybris.raas, function(name, parms) {
        if (parms.containerID) {
          gigya.accounts.showScreenSet(parms);
        }
      });
	}
}
/*
 * register events
 */
function gigyaRegister() {
	if (ACC.gigyaUserMode == "social") {
		gigya.socialize.addEventHandlers({
			onLogin : gigyaHybris.gigyaFunctions.login,
			onLogout: gigyaHybris.gigyaFunctions.logout
		});
	} else if (ACC.gigyaUserMode == "raas") {
		gigya.accounts.addEventHandlers({
			onLogin : gigyaHybris.gigyaFunctions.raasLogin,
			onLogout: gigyaHybris.gigyaFunctions.logout
		});

	}
}
$(document)
		.ready(
				function() {
					gigyaRegister();
					if (gigyaHybris.socialLoginConfig) {
						gigya.socialize
								.showLoginUI(gigyaHybris.socialLoginConfig);
						$("#missing-info")
								.dialog(
										{
											autoOpen : false,
											dialogClass : "no-close",
											closeOnEscape : false,
											appendTo : "#"
													+ gigyaHybris.socialLoginConfig.containerID,
											buttons : [{
												text : "OK",
												click : function() {
													var mail = $(
															"#missing-info")
															.find(".email")
															.val();
													if (!mail) {
														alert("Email is required");
													} else {
														gigyaHybris.gigyaCache.response.user.email = mail;
														$("#missing-info")
																.dialog("close");
														gigyaHybris.gigyaFunctions
																.sendLogin(gigyaHybris.gigyaCache.response);
													}
												}
											}]
										});
					}
					gigyaHybris.gigyaFunctions.raasClick();
					gigyaHybris.gigyaFunctions.raasEmbed();
					// Show add connection UI if it is there
					if (gigyaHybris.addConnectionUI) {
						gigya.socialize
								.showAddConnectionsUI(gigyaHybris.addConnectionUI);
					}
				});