<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:choose>
    <c:when test="${!authenticated}">
        <script type="text/javascript">
            window.gigyaHybris = window.gigyaHybris || {};
            window.gigyaHybris.raas = window.gigyaHybris.raas || {};
            window.gigyaHybris.raas['${id}'] = ${gigyaRaas};
        </script>
        <c:if test="${embed}">
            <div id="${continerID}"></div>
        </c:if>
        <c:if test="${!embed}">
            <div class="gigya-raas">
                <a class="gigya-raas-link" data-gigya-id="${id}" href="#">${loginText}</a>
            </div>
        </c:if>
    </c:when>
    <c:otherwise>
        <div class="gigya-raas">
            <a data-gigya-id="${id}" href="javascript:gigya.accounts.logout({})">${logoutText}</a>
        </div>
    </c:otherwise>
</c:choose>
