package study.practice.notice.service;

import java.util.List;
import study.practice.notice.model.Notice;

public interface NoticeService {
    List<Notice> getAllNotices();
    Notice createNotice(Notice notice);
}
