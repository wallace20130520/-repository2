<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<c:if test="${show}">
    <div id="${divId}"></div>
    <script type="text/javascript">
        <!--
        //add gigya configuration
        window.gigyaHybris = window.gigyaHybris || {};
        window.gigyaHybris.socialLoginConfig = ${gigyaLoginConfig};
        //-->
    </script>
    <div id="missing-info" style="display: none;">
        <h5>Please provide the missing required info</h5>
        <label>Email address</label>
        <input class="email" type="email" name="email">
    </div>
</c:if>
