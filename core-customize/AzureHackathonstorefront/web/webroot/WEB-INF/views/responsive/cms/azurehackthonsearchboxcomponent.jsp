<%@ page trimDirectiveWhitespaces="true"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="/search/" var="searchUrl" />
<spring:url value="/search/autocomplete/{/componentuid}" var="autocompleteUrl" htmlEscape="false">
     <spring:param name="componentuid"  value="${component.uid}"/>
</spring:url>
<script type="text/javascript">
	var languages = new Map();
	languages.set("ja","ja-JP");
	languages.set("en","en-US");
	languages.set("de","de-DE");
	languages.set("zh","zh-CN");
	
	function changeIcon() {
		if($("#azurevr").hasClass( "glyphicon-volume-up" )){
			$("#azurevr").removeClass('glyphicon-volume-up').addClass('glyphicon-volume-down');
		}else{
			$("#azurevr").removeClass('glyphicon-volume-down').addClass('glyphicon-volume-up');
		}		
	}
	function recognizeOnceAsync() {
		console.log($("#lang-selector").val());
		console.log(languages.get($("#lang-selector").val()));
		var timer = setInterval(changeIcon, 200);
		var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
		//console.log(${fn:escapeXml(component.apikey)});
		var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("${fn:escapeXml(component.apikey)}", "${fn:escapeXml(component.region)}");
		speechConfig.speechRecognitionLanguage = languages.get($("#lang-selector").val());
		console.log(speechConfig);
		console.log(audioConfig);
		var reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
		reco.recognizing = function (s, e) {
            window.console.log(e);
            $("#js-site-search-input").val(e.result.text);
    		
        };
        reco.recognized = function (s, e) {
            window.console.log(e);

            // Indicates that recognizable speech was not detected, and that recognition is done.
            if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
            	$("#js-site-search-input").val("");
                var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
                console.log("(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason] + "\r\n"); 
            } else {
            	console.log("(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " Text: " + e.result.text + "\r\n");
            	//$("#js-site-search-input").val(e.result.text);
            	$("#js-site-search-input").keydown();
        		$("#js-site-search-input").keyup();
            }
            clearInterval(timer);
            $("#azurevr").removeClass('glyphicon-volume-down').addClass('glyphicon-volume-up');        
            reco.close();
            reco = undefined;
            if( $("#js-site-search-input").val()=="check out"){
            	console.log("checkout");
            	window.location = "/AzureHackathonstorefront/electronics/en/cart";
            }
        };
        
        reco.recognizeOnceAsync();
		
	}
</script>
<div class="ui-front">
	<form name="search_form_${fn:escapeXml(component.uid)}" method="get"
		action="${fn:escapeXml(searchUrl)}">
		<div class="input-group">
			<spring:theme code="search.placeholder" var="searchPlaceholderHtml" />

			<ycommerce:testId code="header_search_input">
				<c:set var="optionsJson">
					{
						"autocompleteUrl" : "${ycommerce:encodeJSON(autocompleteUrl)}",
						"minCharactersBeforeRequest" : "${ycommerce:encodeJSON(component.minCharactersBeforeRequest)}",
						"waitTimeBeforeRequest" : "${ycommerce:encodeJSON(component.waitTimeBeforeRequest)}",
						"displayProductImages" : "${ycommerce:encodeJSON(component.displayProductImages)}"
					}
				</c:set>
				<input type="text" id="js-site-search-input"
					class="form-control js-site-search-input" name="text" value=""
                    maxlength="100" placeholder="${searchPlaceholderHtml}"
					data-options="${fn:escapeXml(optionsJson)}">
			</ycommerce:testId>

			<span class="input-group-btn"> <ycommerce:testId code="header_search_button">
					<button class="btn btn-link js_search_button" type="submit" disabled="true">
						<span class="glyphicon glyphicon-search"></span>
					</button>
				</ycommerce:testId>
				<ycommerce:testId code="header_search_vr_button">
<!-- 				<p>${fn:escapeXml(component.apikey)}</p> -->
					<button class="btn btn-link" type="button" onclick="recognizeOnceAsync()">
						<span id="azurevr" class="glyphicon glyphicon-volume-up"></span>
					</button>
				</ycommerce:testId>
			</span>
		</div>
	</form>

</div>
