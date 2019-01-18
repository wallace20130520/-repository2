<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<c:if test="${show}">
    <div id="${containerID}"></div>
    <script type="text/javascript">
        <!--
        //add gigya configuration
        window.gigyaHybris = window.gigyaHybris || {};
        window.gigyaHybris.addConnectionUI = ${gigyaAddconnection};
        //-->
    </script>
</c:if>
