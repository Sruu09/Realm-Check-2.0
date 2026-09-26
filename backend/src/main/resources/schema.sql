CREATE TABLE users (
    user_id              BIGSERIAL PRIMARY KEY,
    name                 VARCHAR(100),
    email                VARCHAR(255) UNIQUE NOT NULL,
    password_hash        TEXT,
    avatar_url           TEXT,
    date_of_birth        DATE,
    education_level      VARCHAR(100),
    preferred_career     VARCHAR(150),
    budget               NUMERIC,
    level                INTEGER DEFAULT 1,
    xp                   INTEGER DEFAULT 0,
    streak               INTEGER DEFAULT 0,
    wellness_score       INTEGER DEFAULT 0,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE onboarding_profiles (
    profile_id           BIGSERIAL PRIMARY KEY,
    user_id              BIGINT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    current_stage        VARCHAR(100),
    interests            JSONB,
    goals                JSONB,
    daily_time           VARCHAR(50),
    completed_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Placeholder schemas for remaining tables to avoid errors (we can populate full structure later)
CREATE TABLE skills (
    skill_id             BIGSERIAL PRIMARY KEY,
    skill_name           VARCHAR(100) UNIQUE,
    category             VARCHAR(100)
);

CREATE TABLE user_skills (
    user_id              BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id             BIGINT REFERENCES skills(skill_id) ON DELETE CASCADE,
    skill_level          INTEGER DEFAULT 0,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, skill_id)
);
