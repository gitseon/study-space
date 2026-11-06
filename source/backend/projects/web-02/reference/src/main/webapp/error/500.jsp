<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>서버 오류</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <div>
        <p>요청을 처리하는 중 서버 오류가 발생했습니다. 잠시 뒤 다시 시도하세요.</p>
        <a href="${root}/">메인으로</a>
    </div>
</body>
</html>
