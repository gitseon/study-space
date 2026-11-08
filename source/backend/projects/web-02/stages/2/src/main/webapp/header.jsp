<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="root" value="${pageContext.servletContext.contextPath}" />
<nav>
    <a href="${root}/">홈으로</a> |
    <a href="${root}/book?action=list">목록 조회</a> |
    <%-- study-target:jsp-header:start --%>
    <%-- TODO: 세션 속성 user가 없으면 로그인 링크(/book?action=login)를, 있으면 사용자 이름과 로그아웃 링크(/book?action=logout)를 보여주세요. --%>
    <%-- study-target:jsp-header:end --%>
</nav>
<c:if test="${not empty alertMsg}">
    <p role="alert"><c:out value="${alertMsg}" /></p>
</c:if>
<hr />
