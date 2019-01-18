<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
