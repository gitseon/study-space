<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>예약할 수 없습니다</title>
</head>
<body>
<h1>예약할 수 없습니다</h1>
<p><c:out value="${message}" /></p>
<p><a href="${root}/reservations/new">다시 예약하기</a></p>
</body>
</html>
