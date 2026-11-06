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
    <%-- TODO: request 속성 book의 코드, 도서명, 가격, 저자, 분류를 c:out으로 출력하세요.
         삭제 버튼은 /book로 POST 전송하는 form으로 만들고 hidden action=delete와 hidden code를 둡니다. --%>
    <%-- study-target:jsp-detail:end --%>
    <a href="${root}/book?action=list">목록으로</a>
</body>
</html>
