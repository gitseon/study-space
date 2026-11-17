<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>예약 상세</title>
</head>
<body>
<jsp:include page="/WEB-INF/views/common/header.jsp" />
<h1>예약 상세</h1>
<c:if test="${not empty message}">
    <p class="notice"><c:out value="${message}" /></p>
</c:if>
<%-- study-target:jsp-detail:start --%>
<%-- TODO: 예약 한 건의 값을 출력하고 취소 form을 만든다 --%>
<%-- study-target:jsp-detail:end --%>
<p><a href="${root}/reservations">목록으로</a></p>
</body>
</html>
