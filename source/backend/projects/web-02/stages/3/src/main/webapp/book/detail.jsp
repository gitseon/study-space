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
    <%-- 상세 정보와 삭제 form을 직접 작성하세요. 요구사항 R-DETAIL과 R-DELETE를 참고합니다. --%>
    <%-- study-target:jsp-detail:end --%>
    <a href="${root}/book?action=list">목록으로</a>
</body>
</html>
