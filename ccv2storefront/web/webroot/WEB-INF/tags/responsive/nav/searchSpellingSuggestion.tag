<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="spellingSuggestion" required="true" type="de.hybris.platform.commerceservices.search.facetdata.SpellingSuggestionData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty spellingSuggestion}">
	<div class="searchSpellingSuggestionPrompt">
		<spring:url value="{/queryUrl}" var="spellingSuggestionQueryUrl" htmlEscape="false">
			<spring:param name="queryUrl" value="${spellingSuggestion.query.url}" />
		</spring:url>
		<spring:theme code="search.spellingSuggestion.prompt" />&nbsp;<a href="${spellingSuggestionQueryUrl}">${fn:escapeXml(spellingSuggestion.suggestion)}</a>?
	</div>
</c:if>
