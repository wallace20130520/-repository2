/**
 * 
 */
$(document).ready(function() {
if (window.gigyaHybris.genericPlugins) {
	$.each(window.gigyaHybris.genericPlugins, function(idx, plugin) {
		var parts = plugin.func.split("\.");
		var func = gigya[parts[0]][parts[1]];
		if (typeof func === "function") {
          if (plugin.parmeters.userAction) {
            plugin.parmeters.userAction =  window.gigyaHybris.gigyaFunctions.createUserAction();
          }
          func(plugin.parmeters);
		}
	})
}
}
);
window.gigyaHybris = window.gigyaHybris || {};
window.gigyaHybris.gigyaFunctions = window.gigyaHybris.gigyaFunctions || {};
window.gigyaHybris.gigyaFunctions.createUserAction = function() {
	var act = new gigya.socialize.UserAction();
	act.setLinkBack(window.location.href);
	act.setTitle($('title').text().trim());
	act.addMediaItem(window.gigyaHybris.gigyaFunctions.createMediaObj());
	return act;
}

window.gigyaHybris.gigyaFunctions.createMediaObj = function() {
	var mObj = {};
	var imgSrc; 
	if ($('meta[property="og:image"]').length > 0) {
        imgSrc = $('meta[property="og:image"]').attr('content');
    } else {
    	var images = $('img');
   		var maxWidth = 0;
    	$.each(images, function(idx, image) {
    		if ($(image).width() > maxWidth) {
    			maxWidth = $(image).width();
    			imgSrc = $(image).attr("src");
    		}
		})
    }
	mObj.type = "image";
	mObj.src = imgSrc;
	mObj.href = window.location.href;
	return mObj;
}

