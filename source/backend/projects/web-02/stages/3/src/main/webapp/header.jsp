<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="root" value="${pageContext.servletContext.contextPath}" />
<nav>
    <a href="${root}/">홈으로</a> |
    <a href="${root}/book?action=list">목록 조회</a> |
    <%-- study-target:jsp-header:start --%>
    <%-- 로그인 상태에 따라 달라지는 메뉴를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다. --%>
    <%-- study-target:jsp-header:end --%>
</nav>
<c:if test="${not empty alertMsg}">
    <p role="alert"><c:out value="${alertMsg}" /></p>
</c:if>
<hr />
