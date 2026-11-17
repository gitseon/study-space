package study.springcheck;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringBootVersion;
import org.springframework.core.SpringVersion;
import org.springframework.security.core.SpringSecurityCoreVersion;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/** Records the versions that actually ran. The verifier compares them with environment-spring.json. */
class EnvironmentTests {
    @Test
    void recordsResolvedVersions() throws Exception {
        String url = System.getenv("SPRING_VERIFY_DB_URL");
        assertNotNull(url, "SPRING_VERIFY_DB_URL is required. DB checks are never skipped.");
        String mysql;
        String driver;
        try (Connection con = DriverManager.getConnection(url, System.getenv("SPRING_VERIFY_DB_USER"),
                System.getenv("SPRING_VERIFY_DB_PASSWORD"));
                Statement st = con.createStatement();
                ResultSet rs = st.executeQuery("SELECT VERSION()")) {
            rs.next();
            mysql = rs.getString(1);
            driver = con.getMetaData().getDriverVersion();
        }
        String json = "{\n"
                + "  \"javaRuntime\": \"" + Runtime.version().feature() + "\",\n"
                + "  \"springBoot\": \"" + SpringBootVersion.getVersion() + "\",\n"
                + "  \"springFramework\": \"" + SpringVersion.getVersion() + "\",\n"
                + "  \"springSecurity\": \"" + SpringSecurityCoreVersion.getVersion() + "\",\n"
                + "  \"mybatis\": \"" + Configuration.class.getPackage().getImplementationVersion() + "\",\n"
                + "  \"mysqlServer\": \"" + mysql.replaceAll("^([0-9]+[.][0-9]+).*", "$1") + "\",\n"
                + "  \"mysqlDriver\": \"" + driver.replaceAll("^[^0-9]*([0-9]+[.][0-9]+[.][0-9]+).*", "$1") + "\"\n"
                + "}\n";
        Observations.record("environment", json);
    }
}
