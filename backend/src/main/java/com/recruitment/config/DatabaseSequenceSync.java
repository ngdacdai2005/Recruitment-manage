package com.recruitment.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSequenceSync {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void syncSequences() {
        String[] tables = {
            "candidates", "users", "jobs", "departments", "applications",
            "interviews", "saved_jobs", "roles", "positions", "employees",
            "candidate_skills", "candidate_experiences", "candidate_educations",
            "application_history", "interview_evaluations", "notifications", "audit_logs"
        };

        for (String table : tables) {
            try {
                String sql = String.format(
                    "SELECT setval(pg_get_serial_sequence('%s', 'id'), COALESCE(MAX(id), 1)) FROM %s",
                    table, table
                );
                jdbcTemplate.queryForObject(sql, Long.class);
                log.info("Synchronized PostgreSQL sequence for table [{}]", table);
            } catch (Exception e) {
                log.warn("Could not sync sequence for table [{}]: {}", table, e.getMessage());
            }
        }
    }
}
