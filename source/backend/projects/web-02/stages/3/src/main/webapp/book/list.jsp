<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>목록 조회 페이지</title>
<style>
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
</style>
</head>
<body>
    <%@ include file="/header.jsp"%>
    <h1>목록 조회 페이지</h1>
    <a href="${root}/book?action=regist">등록하기</a>
    <table>
        <thead>
            <tr>
                <th>코드</th>
                <th>도서명</th>
                <th>가격</th>
                <th>분류</th>
            </tr>
        </thead>
        <tbody>
            <%-- study-target:jsp-list:start --%>
            <%-- 목록 본문 행을 직접 작성하세요. 요구사항 R-LIST를 참고합니다. --%>
            <%-- study-target:jsp-list:end --%>
        </tbody>
    </table>
</body>
</html>
