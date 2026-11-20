package study.practice.notice.web;

public class InvalidNoticeException extends RuntimeException {
    public InvalidNoticeException(String detail) {
        super(detail);
    }
}
