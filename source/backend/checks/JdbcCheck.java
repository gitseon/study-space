import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

// Runs the JDBC cases behind the backend questions and prints one "name=value" line per case.
// Connection details come from the MYSQL_* environment variables; nothing is read from the repository.
public class JdbcCheck {
    private static Connection open() throws SQLException {
        String url = "jdbc:mysql://" + System.getenv("MYSQL_HOST") + "/" + System.getenv("MYSQL_DATABASE")
                + "?useUnicode=true&characterEncoding=UTF-8";
        return DriverManager.getConnection(url, System.getenv("MYSQL_USER"), System.getenv("MYSQL_PASSWORD"));
    }

    private static void update(String sql) throws SQLException {
        try (Connection con = open(); Statement st = con.createStatement()) {
            st.executeUpdate(sql);
        }
    }

    private static int balance(int id) throws SQLException {
        try (Connection con = open();
                PreparedStatement ps = con.prepareStatement("SELECT balance FROM account WHERE id = ?")) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

    private static void change(Connection con, int id, int delta) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement("UPDATE account SET balance = balance + ? WHERE id = ?")) {
            ps.setInt(1, delta);
            ps.setInt(2, id);
            ps.executeUpdate();
        }
    }

    // Mirrors the DAO method of the question: the try-with-resources block closes the ResultSet before the caller reads it.
    private static ResultSet findAll() throws SQLException {
        try (Connection con = open();
                PreparedStatement ps = con.prepareStatement("SELECT * FROM book");
                ResultSet rs = ps.executeQuery()) {
            return rs;
        }
    }

    private static void reset() throws SQLException {
        update("DELETE FROM account");
        update("INSERT INTO account VALUES (1, 1000), (2, 1000)");
    }

    public static void main(String[] args) throws Exception {
        update("DROP TABLE IF EXISTS book");
        update("DROP TABLE IF EXISTS account");
        update("CREATE TABLE book (title VARCHAR(30))");
        update("INSERT INTO book VALUES ('java basics'), ('sql basics')");
        update("CREATE TABLE account (id INT PRIMARY KEY, balance INT) ENGINE=InnoDB");
        update("DROP TABLE IF EXISTS member");
        update("CREATE TABLE member (name VARCHAR(20))");
        update("INSERT INTO member VALUES ('가'), ('나'), ('다')");
        try {
            String stage = "prepare";
            try (Connection con = open();
                    PreparedStatement ps = con.prepareStatement("SELECT title FROM book WHERE title LIKE '%?%'")) {
                stage = "setString";
                ps.setString(1, "java");
                stage = "no_exception";
            } catch (SQLException e) {
                // stage names the call that failed
            }
            System.out.println("quoted_placeholder=" + stage);
            try (Connection con = open();
                    PreparedStatement ps = con.prepareStatement("SELECT title FROM book WHERE title LIKE ?")) {
                ps.setString(1, "%java%");
                int rows = 0;
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        rows++;
                    }
                }
                System.out.println("bound_placeholder_rows=" + rows);
            }
            try (Connection con = open();
                    PreparedStatement ps = con.prepareStatement("SELECT title FROM book WHERE title LIKE ?")) {
                ps.setString(0, "%java%");
                System.out.println("index_zero=no_exception");
            } catch (SQLException e) {
                System.out.println("index_zero=SQLException");
            }
            try (Connection con = open(); Statement st = con.createStatement();
                    ResultSet rs = st.executeQuery("SELECT title FROM book ORDER BY title")) {
                System.out.println("before_next_is_row=" + !rs.isBeforeFirst());
                int rows = 0;
                while (rs.next()) {
                    rows++;
                }
                System.out.println("next_rows=" + rows + " last_next_false=" + !rs.next());
            }

            // Separate connections: each call commits on its own (autocommit stays on).
            reset();
            try (Connection con = open()) {
                change(con, 1, -500);
            }
            try (Connection con = open()) {
                if (balance(2) >= 0) {
                    throw new IllegalStateException("deposit failed");
                }
            } catch (IllegalStateException e) {
                // The failure comes after the withdrawal was already committed.
            }
            System.out.println("separate_connections_balances=" + balance(1) + "," + balance(2));

            // One connection with a transaction boundary and rollback.
            reset();
            try (Connection con = open()) {
                con.setAutoCommit(false);
                try {
                    change(con, 1, -500);
                    throw new IllegalStateException("deposit failed");
                } catch (IllegalStateException e) {
                    con.rollback();
                }
            }
            System.out.println("one_connection_rollback_balances=" + balance(1) + "," + balance(2));

            // One connection that commits both steps keeps the whole change.
            reset();
            try (Connection con = open()) {
                con.setAutoCommit(false);
                change(con, 1, -500);
                change(con, 2, 500);
                con.commit();
            }
            System.out.println("one_connection_commit_balances=" + balance(1) + "," + balance(2));

            // A ResultSet returned out of a try-with-resources block is already closed.
            ResultSet returned = findAll();
            try {
                returned.next();
                System.out.println("returned_resultset=readable");
            } catch (SQLException e) {
                System.out.println("returned_resultset=SQLException");
            }

            // Concatenated input is parsed as SQL while a bound value stays a value.
            String name = "x' OR '1'='1";
            try (Connection con = open(); Statement st = con.createStatement();
                    ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM member WHERE name = '" + name + "'")) {
                rs.next();
                System.out.println("concat_count=" + rs.getInt(1));
            }
            try (Connection con = open();
                    PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM member WHERE name = ?")) {
                ps.setString(1, name);
                try (ResultSet rs = ps.executeQuery()) {
                    rs.next();
                    System.out.println("bound_count=" + rs.getInt(1));
                }
            }
            try (Connection con = open();
                    PreparedStatement ps = con.prepareStatement("INSERT INTO member VALUES (?)")) {
                ps.setString(1, "라");
                System.out.println("execute_update_rows=" + ps.executeUpdate());
            }

            // Closing a connection without commit keeps nothing of the change.
            reset();
            try (Connection con = open()) {
                con.setAutoCommit(false);
                change(con, 1, -500);
            }
            System.out.println("uncommitted_close_balance=" + balance(1));

            // getInt turns SQL NULL into 0 and wasNull tells the two apart.
            update("DROP TABLE IF EXISTS bonus_t");
            update("CREATE TABLE bonus_t (bonus INT)");
            update("INSERT INTO bonus_t VALUES (NULL)");
            try (Connection con = open(); Statement st = con.createStatement();
                    ResultSet rs = st.executeQuery("SELECT bonus FROM bonus_t")) {
                rs.next();
                int bonus = rs.getInt("bonus");
                System.out.println("getint_null=" + bonus + "," + rs.wasNull());
            }

            // The first next() call already consumes the first row.
            update("DROP TABLE IF EXISTS three");
            update("CREATE TABLE three (n INT)");
            update("INSERT INTO three VALUES (1), (2), (3)");
            try (Connection con = open(); Statement st = con.createStatement();
                    ResultSet rs = st.executeQuery("SELECT n FROM three")) {
                rs.next();
                int n = 0;
                while (rs.next()) {
                    n++;
                }
                System.out.println("skipped_first_row_count=" + n);
            }
        } finally {
            update("DROP TABLE IF EXISTS book");
            update("DROP TABLE IF EXISTS account");
            update("DROP TABLE IF EXISTS three");
            update("DROP TABLE IF EXISTS member");
            update("DROP TABLE IF EXISTS bonus_t");
        }
    }
}
