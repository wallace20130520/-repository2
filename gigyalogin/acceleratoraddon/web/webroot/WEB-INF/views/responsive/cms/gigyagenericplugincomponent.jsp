<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/desktop/common" %>

<c:if test="${not empty divId }">
    <div id="${divId}"></div>
</c:if>
<script type="text/javascript">
    <!--

    window.gigyaHybris = window.gigyaHybris || {};
    window.gigyaHybris.logoutUrl = '<c:url value="/logout"/>'
    window.gigyaHybris.genericPlugins = window.gigyaHybris.genericPlugins || [];
    var plugin = {"func": "${function}", "parmeters": ${parmeters}};
    window.gigyaHybris.genericPlugins.push(plugin)
    //-->
</script>
