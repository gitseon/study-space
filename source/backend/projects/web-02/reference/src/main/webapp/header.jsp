<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="root" value="${pageContext.servletContext.contextPath}" />
<nav>
    <a href="${root}/">홈으로</a> |
    <a href="${root}/book?action=list">목록 조회</a> |
    <c:choose>
        <c:when test="${empty sessionScope.user}">
            <a href="${root}/user?action=login">로그인</a>
        </c:when>
        <c:otherwise>
            <c:out value="${sessionScope.user.name}" /> 님 |
            <a href="${root}/user?action=logout">로그아웃</a>
        </c:otherwise>
    </c:choose>
</nav>
<c:if test="${not empty alertMsg}">
    <p role="alert"><c:out value="${alertMsg}" /></p>
</c:if>
<hr />
