package study.practice.notice.persistence;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import study.practice.notice.model.Notice;

@Mapper
public interface NoticeDao {
    List<Notice> selectAll();
    int insert(Notice notice);
}
