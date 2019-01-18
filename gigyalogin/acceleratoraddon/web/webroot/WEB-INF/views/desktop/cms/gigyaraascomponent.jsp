<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/desktop/common" %>

<script type="text/javascript">
    window.gigyaHybris = window.gigyaHybris || {};
    window.gigyaHybris.authenticated = ${authenticated};
</script>

<c:if test="${show}">
    <script type="text/javascript">
        <!--
        window.gigyaHybris = window.gigyaHybris || {};
        window.gigyaHybris.raas = window.gigyaHybris.raas || {};
        window.gigyaHybris.raas['${id}'] = ${gigyaRaas};
        //-->
    </script>
    <c:choose>
        <c:when test="${embed}">
            <div id="${continerID}"></div>
        </c:when>
        <c:otherwise>
            <div class="gigya-raas"><a class="gigya-raas-link" data-gigya-id="${id}" data-profile-edit="${profileEdit}"
                                       href="#">${linkText}</a></div>
        </c:otherwise>
    </c:choose>
</c:if>
