package study.practice.notice.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import study.practice.notice.model.Notice;
import study.practice.notice.persistence.NoticeDao;
import study.practice.notice.web.InvalidNoticeException;

@Service
public class NoticeServiceImpl implements NoticeService {
    private final NoticeDao dao;

    public NoticeServiceImpl(NoticeDao dao) {
        this.dao = dao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notice> getAllNotices() {
        return dao.selectAll();
    }

    @Override
    @Transactional
    public Notice createNotice(Notice notice) {
        String title = notice.getTitle();
        if (title == null || title.isBlank()) {
            throw new InvalidNoticeException("제목을 입력하세요.");
        }
        dao.insert(notice);
        return notice;
    }
}
