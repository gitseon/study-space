<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>정보 상세 페이지</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>상세 페이지</h1>
    <%-- study-target:jsp-detail:start --%>
    <%-- TODO: request 속성 gear의 코드, 용품명, 가격, 브랜드, 색상을 c:out으로 한 줄씩 출력하세요. --%>
    <%-- study-target:jsp-detail:end --%>
    <a href="${root}/gear?action=list">목록으로</a>
</body>
</html>
