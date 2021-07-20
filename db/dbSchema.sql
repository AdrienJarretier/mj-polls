CREATE TABLE "grades" (
  "id" INTEGER PRIMARY KEY,
  "value" VARCHAR(255) UNIQUE NOT NULL,
  "order" INTEGER UNIQUE NOT NULL
);

CREATE TABLE "polls" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "max_voters" INTEGER,
  "max_datetime" DATETIME,
  "datetime_opened" DATETIME DEFAULT (CURRENT_TIMESTAMP),
  "datetime_closed" DATETIME
);

CREATE TABLE "duplicate_vote_check_methods" (
  "id" INTEGER PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE "polls_choices" (
  "id" INTEGER PRIMARY KEY,
  "poll_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "polls_votes" (
  "poll_choice_id" INTEGER NOT NULL,
  "grade_id" INTEGER NOT NULL,
  "count" INTEGER DEFAULT 0
);

ALTER TABLE "polls_choices" ADD FOREIGN KEY ("poll_id") REFERENCES "polls" ("id");

ALTER TABLE "polls_votes" ADD FOREIGN KEY ("poll_choice_id") REFERENCES "polls_choices" ("id");

ALTER TABLE "polls_votes" ADD FOREIGN KEY ("grade_id") REFERENCES "grades" ("id");

CREATE UNIQUE INDEX ON "polls_choices" ("poll_id", "name");

CREATE UNIQUE INDEX ON "polls_votes" ("poll_choice_id", "grade_id");
