package study.springcheck.db;

import java.io.IOException;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** A small Boot application over the verification schema: MyBatis mappers and transactional services. */
@SpringBootApplication
public class DbApp {
    public static class Reservation {
        private Integer reservationId;
        private Integer roomId;
        private String memberName;
        private Integer people;

        public Integer getReservationId() {
            return reservationId;
        }

        public void setReservationId(Integer reservationId) {
            this.reservationId = reservationId;
        }

        public Integer getRoomId() {
            return roomId;
        }

        public void setRoomId(Integer roomId) {
            this.roomId = roomId;
        }

        public String getMemberName() {
            return memberName;
        }

        public void setMemberName(String memberName) {
            this.memberName = memberName;
        }

        public Integer getPeople() {
            return people;
        }

        public void setPeople(Integer people) {
            this.people = people;
        }
    }

    public static class Room {
        private Integer roomId;
        private String roomName;
        private List<Reservation> reservations;

        public Integer getRoomId() {
            return roomId;
        }

        public void setRoomId(Integer roomId) {
            this.roomId = roomId;
        }

        public String getRoomName() {
            return roomName;
        }

        public void setRoomName(String roomName) {
            this.roomName = roomName;
        }

        public List<Reservation> getReservations() {
            return reservations;
        }

        public void setReservations(List<Reservation> reservations) {
            this.reservations = reservations;
        }
    }

    @Mapper
    public interface ReservationMapper {
        List<Reservation> search(@Param("roomId") Integer roomId, @Param("keyword") String keyword);

        List<Reservation> byNameUnsafe(@Param("name") String name);

        List<Reservation> byNameSafe(@Param("name") String name);

        Reservation findRaw(int reservationId);

        Reservation findAliased(int reservationId);

        List<Reservation> findByIds(@Param("ids") List<Integer> ids);

        List<Reservation> twoParams(Integer roomId, Integer people);

        int insert(Reservation reservation);

        int updateDynamic(@Param("id") int id, @Param("memberName") String memberName, @Param("people") Integer people);

        Room roomWithReservations(int roomId);

        List<Room> roomsFlat(int roomId);

        int insertLog(String message);

        int count();

        int countLogs();
    }

    @Service
    public static class LogService {
        private final ReservationMapper mapper;

        public LogService(ReservationMapper mapper) {
            this.mapper = mapper;
        }

        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public void logRequiresNew(String message) {
            mapper.insertLog(message);
        }

        @Transactional
        public void failRequired() {
            mapper.insertLog("inner");
            throw new IllegalStateException("inner failed");
        }

        @Transactional(propagation = Propagation.MANDATORY)
        public void mandatory() {
            mapper.insertLog("mandatory");
        }
    }

    @Service
    public static class TxService {
        private final ReservationMapper mapper;
        private final LogService logs;

        public TxService(ReservationMapper mapper, LogService logs) {
            this.mapper = mapper;
            this.logs = logs;
        }

        private void add(String name) {
            Reservation r = new Reservation();
            r.setRoomId(1);
            r.setMemberName(name);
            r.setPeople(1);
            mapper.insert(r);
        }

        @Transactional
        public void runtime() {
            add("runtime");
            throw new IllegalStateException("runtime");
        }

        @Transactional
        public void checked() throws IOException {
            add("checked");
            throw new IOException("checked");
        }

        @Transactional(rollbackFor = Exception.class)
        public void checkedRollbackFor() throws IOException {
            add("checkedRollbackFor");
            throw new IOException("checked");
        }

        @Transactional
        public void caught() {
            add("caught");
            try {
                throw new IllegalStateException("caught");
            } catch (IllegalStateException ignored) {
                // swallowed on purpose: the proxy never sees it
            }
        }

        public void outerSelf() {
            innerTx();
        }

        @Transactional
        public void innerTx() {
            add("self");
            throw new IllegalStateException("self");
        }

        @Transactional
        public void outerWithLog() {
            add("outer");
            logs.logRequiresNew("attempt");
            throw new IllegalStateException("outer failed");
        }

        @Transactional
        public void outerCatchesInner() {
            add("outer");
            try {
                logs.failRequired();
            } catch (IllegalStateException ignored) {
                // the shared transaction is already marked rollback-only
            }
        }

        @Transactional(readOnly = true)
        public void readOnlyInsert() {
            add("readonly");
        }
    }
}
