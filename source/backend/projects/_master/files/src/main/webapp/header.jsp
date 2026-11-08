<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="root" value="${pageContext.servletContext.contextPath}" />
<nav>
    <a href="${root}/">홈으로</a> |
    <a href="${root}/gear?action=list">목록 조회</a> |
    <%--@@target jsp-header--%>
    <c:choose>
        <c:when test="${empty sessionScope.user}">
            <a href="${root}/gear?action=login">로그인</a>
        </c:when>
        <c:otherwise>
            <c:out value="${sessionScope.user.name}" /> 님 |
            <a href="${root}/gear?action=logout">로그아웃</a>
        </c:otherwise>
    </c:choose>
    <%--@@stage 1--%>
    <c:choose>
        <c:when test="${____ sessionScope.user}">
            <a href="${root}/gear?action=____">로그인</a>
        </c:when>
        <c:otherwise>
            <c:out value="${sessionScope.user.____}" /> 님 |
            <a href="${root}/gear?action=logout">로그아웃</a>
        </c:otherwise>
    </c:choose>
    <%--@@stage 2--%>
    <%-- TODO: 세션 속성 user가 없으면 로그인 링크(/gear?action=login)를, 있으면 사용자 이름과 로그아웃 링크(/gear?action=logout)를 보여주세요. --%>
    <%--@@stage 3--%>
    <%-- 로그인 상태에 따라 달라지는 메뉴를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다. --%>
    <%--@@end--%>
</nav>
<c:if test="${not empty alertMsg}">
    <p role="alert"><c:out value="${alertMsg}" /></p>
</c:if>
<hr />
