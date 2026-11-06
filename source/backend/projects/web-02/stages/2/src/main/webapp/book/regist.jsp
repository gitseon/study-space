<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>정보 등록 페이지</title>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>등록 페이지</h1>
    <%-- study-target:jsp-regist:start --%>
    <%-- TODO: /book로 POST 전송하는 등록 form을 작성하세요.
         hidden action=regist와 code, name, price, author, category 입력을 둡니다.
         입력 name은 컨트롤러가 읽는 파라미터 이름과 같아야 합니다. 분류는 select로 고릅니다. --%>
    <%-- study-target:jsp-regist:end --%>
    <a href="${root}/book?action=list">목록으로</a>
</body>
</html>
