CREATE TABLE IF NOT EXISTS "grades" (
        "id" INTEGER PRIMARY KEY,
        "value" VARCHAR(255) NOT NULL UNIQUE,
        "order" INTEGER NOT NULL UNIQUE
        );

INSERT INTO grades("value", "order") VALUES('Excellent', 0);
INSERT INTO grades("value", "order") VALUES('Passable', 500);
INSERT INTO grades("value", "order") VALUES('Bad', 1000);


    -- // Polls will close when either voters_count > max_voters
    -- // or max_date has been exceeded
CREATE TABLE IF NOT EXISTS "polls" (
        "id" INTEGER PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "voters_count" INTEGER DEFAULT 0,
        "max_voters" INTEGER,
        "max_datetime" DATETIME,
        "datetime_opened" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "datetime_closed" DATETIME
        );

CREATE TABLE IF NOT EXISTS "polls_choices" (
        "id" INTEGER PRIMARY KEY,
        "poll_id" INTEGER NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        FOREIGN KEY(poll_id) REFERENCES polls(id),
        UNIQUE(poll_id,name)
        );

CREATE TABLE IF NOT EXISTS "polls_votes" (
        "poll_id" INTEGER NOT NULL,
        "grade_id" INTEGER NOT NULL,
        "count" INTEGER DEFAULT 0,
        FOREIGN KEY(poll_id) REFERENCES polls(id),
        FOREIGN KEY(grade_id) REFERENCES grades(id),
        UNIQUE(poll_id,grade_id)
        );