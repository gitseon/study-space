<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="root" value="${pageContext.servletContext.contextPath}" />
<nav>
    <a href="${root}/">홈으로</a> |
    <a href="${root}/book?action=list">목록 조회</a> |
    <%-- study-target:jsp-header:start --%>
    <c:choose>
        <c:when test="${____ sessionScope.user}">
            <a href="${root}/user?action=____">로그인</a>
        </c:when>
        <c:otherwise>
            <c:out value="${sessionScope.user.____}" /> 님 |
            <a href="${root}/user?action=logout">로그아웃</a>
        </c:otherwise>
    </c:choose>
    <%-- study-target:jsp-header:end --%>
</nav>
<c:if test="${not empty alertMsg}">
    <p role="alert"><c:out value="${alertMsg}" /></p>
</c:if>
<hr />
