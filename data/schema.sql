-- =============================================================================
-- Re:Learn Cognitive Diagnostic System - Database Schema
-- Compatible with MySQL 8.0+ and SQLite 3
-- =============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'student',
    avatar VARCHAR(16) DEFAULT 'MC',
    enrolled_course VARCHAR(255) DEFAULT 'Python Foundations',
    completed_units INT DEFAULT 2,
    total_units INT DEFAULT 6,
    concepts_demonstrated INT DEFAULT 6,
    total_concepts INT DEFAULT 12,
    learning_minutes_this_week INT DEFAULT 42,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses and Units
CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(32) PRIMARY KEY,
    unit_number VARCHAR(8) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    status VARCHAR(32) DEFAULT 'Upcoming', -- 'Completed', 'In progress', 'Upcoming'
    order_index INT NOT NULL
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(32) PRIMARY KEY,
    unit_id VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT DEFAULT 8,
    status VARCHAR(32) DEFAULT 'Upcoming', -- 'Complete', 'Learning now', 'Up next'
    order_index INT NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 4. Misconception Taxonomy Table
CREATE TABLE IF NOT EXISTS misconception_taxonomy (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL
);

-- 5. Diagnostic Questions
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    unit_id VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(64) NOT NULL,
    code_snippet TEXT NOT NULL,
    expected_output VARCHAR(255) NOT NULL,
    explanation_prompt TEXT NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 6. Student Attempts & Reasonings
CREATE TABLE IF NOT EXISTS attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64),
    attempt_number INT DEFAULT 1,
    student_answer VARCHAR(255) NOT NULL,
    student_reasoning TEXT NOT NULL,
    scratchpad TEXT,
    predicted_misconception VARCHAR(64) NOT NULL,
    misconception_name VARCHAR(255) NOT NULL,
    confidence FLOAT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Competency Mastery / Learner Model Table
CREATE TABLE IF NOT EXISTS learner_model (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    concept VARCHAR(128) NOT NULL,
    status VARCHAR(64) NOT NULL, -- 'Demonstrated', 'Provisional transfer', 'Developing', 'Not yet checked'
    evidence TEXT,
    next_step VARCHAR(128),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Builder Space - Synthetic Evaluation Dataset
CREATE TABLE IF NOT EXISTS evaluation_dataset (
    id VARCHAR(32) PRIMARY KEY, -- e.g. RL-018
    prompt_code TEXT NOT NULL,
    expected_output VARCHAR(32) NOT NULL,
    student_output VARCHAR(32) NOT NULL,
    reasoning_evidence TEXT NOT NULL,
    human_label VARCHAR(128) NOT NULL,
    model_prediction VARCHAR(128),
    dataset_split VARCHAR(32) DEFAULT 'Train', -- 'Train', 'Validation', 'Unseen test'
    status VARCHAR(32) DEFAULT 'Reviewed'
);

-- =============================================================================
-- INITIAL SEED DATA
-- =============================================================================

-- Seed Demo Learner
INSERT INTO users (id, name, email, role, avatar, enrolled_course, completed_units, total_units, concepts_demonstrated, total_concepts, learning_minutes_this_week)
VALUES ('u_maya', 'Maya Chen', 'maya.chen@learn.edu', 'student', 'MC', 'Python Foundations', 2, 6, 6, 12, 42)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Units
INSERT INTO units (id, unit_number, title, subtitle, status, order_index) VALUES
('u01', '01', 'Variables & types', 'Names & values', 'Completed', 1),
('u02', '02', 'Conditionals', 'Making decisions', 'Completed', 2),
('u03', '03', 'Loops & iteration', 'Repeat with purpose', 'In progress', 3),
('u04', '04', 'Lists & indexing', 'Ordered collections', 'Upcoming', 4),
('u05', '05', 'Functions', 'Reusable procedures', 'Upcoming', 5),
('u06', '06', 'Your first project', 'Putting it together', 'Upcoming', 6)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Misconceptions
INSERT INTO misconception_taxonomy (id, code, name, category, description, recommended_action) VALUES
('misc_01', 'LOOP_ENDPOINT', 'Stop value treated as included', 'Loops', 'Student includes the upper boundary value in loop visits.', 'Visual boundary walkthrough: start <= n < stop.'),
('misc_02', 'ACCUM_INIT', 'Accumulator starts at wrong value', 'Accumulation', 'Student initializes total to stop value or 1 rather than 0.', 'Trace state variables before loop entry.'),
('misc_03', 'ARITHMETIC_SLIP', 'Arithmetic slip with right sequence', 'Math', 'Sequence is correct but summation calculation is flawed.', 'Re-check running additions.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Learner Model for Maya Chen
INSERT INTO learner_model (id, user_id, concept, status, evidence, next_step) VALUES
('lm_01', 'u_maya', 'Variable assignment', 'Demonstrated', 'Explained names and values · 1 Oct', 'Continue practicing'),
('lm_02', 'u_maya', 'Conditional logic', 'Demonstrated', 'Correct branch + explanation · 2 Oct', 'Use in future lessons'),
('lm_03', 'u_maya', 'Accumulation', 'Demonstrated', 'Consistent running totals · Attempts 02-03', 'Keep this strategy'),
('lm_04', 'u_maya', 'Range endpoints', 'Provisional transfer', '2 earlier errors → 1 explained transfer', 'Delayed check'),
('lm_05', 'u_maya', 'List indexing', 'Not yet checked', 'No assessment evidence collected', 'Upcoming unit 04')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Seed Builder Space Evaluation Responses
INSERT INTO evaluation_dataset (id, prompt_code, expected_output, student_output, reasoning_evidence, human_label, dataset_split, status) VALUES
('RL-018', 'for n in range(1, 4): total += n', '6', '10', '1, 2, 3 and 4 are included.', 'Range endpoint', 'Train', 'Reviewed'),
('RL-019', 'for n in range(1, 4): total += n', '6', '10', 'I start at 4, then add 1, 2, 3.', 'Accumulator initialization', 'Train', 'Reviewed'),
('RL-020', 'for n in range(1, 4): total += n', '6', '6', 'Stop is excluded: 1 + 2 + 3.', 'No misconception evidenced', 'Train', 'Reviewed'),
('RL-021', 'for n in range(1, 4): total += n', '6', '6', 'I guessed. I''m not sure why.', 'Insufficient evidence', 'Train', 'Needs review')
ON DUPLICATE KEY UPDATE human_label=VALUES(human_label);