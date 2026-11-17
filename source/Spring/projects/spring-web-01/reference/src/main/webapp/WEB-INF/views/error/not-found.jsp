<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="root" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>찾을 수 없습니다</title>
</head>
<body>
<h1>찾을 수 없습니다</h1>
<p><c:out value="${message}" /></p>
<p><a href="${root}/reservations">목록으로</a></p>
</body>
</html>
