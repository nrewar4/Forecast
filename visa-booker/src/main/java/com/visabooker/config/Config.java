package com.visabooker.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.Properties;

/**
 * Loads configuration from (in priority order):
 *   1. Environment variables (UPPER_SNAKE_CASE, e.g. PORTAL_EMAIL)
 *   2. A properties file (default: ./config.properties, override with CONFIG_FILE env var)
 *
 * Secrets should live in config.properties (git-ignored) or the environment,
 * never in source.
 */
public final class Config {

    private final Properties props = new Properties();

    private Config() {}

    public static Config load() {
        Config c = new Config();
        String file = System.getenv().getOrDefault("CONFIG_FILE", "config.properties");
        Path path = Path.of(file);
        if (Files.exists(path)) {
            try (InputStream in = Files.newInputStream(path)) {
                c.props.load(in);
            } catch (IOException e) {
                throw new IllegalStateException("Failed to read config file: " + path, e);
            }
        }
        return c;
    }

    /** Env var wins over file. Key "portal.email" maps to env "PORTAL_EMAIL". */
    public String get(String key) {
        String env = System.getenv(key.toUpperCase().replace('.', '_'));
        if (env != null && !env.isBlank()) return env;
        return props.getProperty(key);
    }

    public String require(String key) {
        String v = get(key);
        if (v == null || v.isBlank()) {
            throw new IllegalStateException("Missing required config: " + key
                    + " (set it in config.properties or as env " + key.toUpperCase().replace('.', '_') + ")");
        }
        return v;
    }

    public String get(String key, String def) {
        String v = get(key);
        return (v == null || v.isBlank()) ? def : v;
    }

    public int getInt(String key, int def) {
        String v = get(key);
        return (v == null || v.isBlank()) ? def : Integer.parseInt(v.trim());
    }

    public boolean getBool(String key, boolean def) {
        String v = get(key);
        return (v == null || v.isBlank()) ? def : Boolean.parseBoolean(v.trim());
    }

    public LocalDate getDate(String key) {
        String v = get(key);
        return (v == null || v.isBlank()) ? null : LocalDate.parse(v.trim());
    }
}
