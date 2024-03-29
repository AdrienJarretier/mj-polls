CREATE TABLE "grades" (
  "id" SERIAL PRIMARY KEY,
  "value" VARCHAR(255) UNIQUE NOT NULL,
  "order" INTEGER UNIQUE NOT NULL
);

CREATE TABLE "duplicate_vote_check_methods" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL
);

-- to generate dbml, remove AUTOINCREMENT
CREATE TABLE "polls" (
  "id" SERIAL PRIMARY KEY,
  "identifier" VARCHAR(8) UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "max_voters" INTEGER,
  "max_datetime" timestamp with time zone,
  "datetime_opened" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP),
  "datetime_closed" timestamp with time zone,
  "duplicate_vote_check_method_id" INTEGER,
  FOREIGN KEY("duplicate_vote_check_method_id") REFERENCES "duplicate_vote_check_methods" ("id"),
  CHECK("max_voters">0),
  -- CHECK("max_datetime" > CURRENT_TIMESTAMP),
  CHECK("title" <> '')
);

CREATE TABLE "polls_choices" (
  "id" SERIAL PRIMARY KEY,
  "poll_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  FOREIGN KEY("poll_id") REFERENCES "polls" ("id")
);

CREATE TABLE "polls_votes" (
  "poll_choice_id" INTEGER NOT NULL,
  "grade_id" INTEGER NOT NULL,
  "count" INTEGER DEFAULT 0,
  FOREIGN KEY("poll_choice_id") REFERENCES "polls_choices" ("id"),
  FOREIGN KEY("grade_id") REFERENCES "grades" ("id")
);

CREATE UNIQUE INDEX unique_choice_per_poll ON "polls_choices" ("poll_id", "name");

CREATE UNIQUE INDEX unique_vote_per_grade_per_choice ON "polls_votes" ("poll_choice_id", "grade_id");



CREATE VIEW "poll_with_choices" AS
  SELECT 
    polls.id AS poll_id,
    polls.identifier AS poll_identifier,
    polls.title,
    polls_choices.name AS choice_name,
    polls_choices.id AS choice_id,
    polls.max_voters,
    polls.max_datetime,
    polls.datetime_opened,
    polls.datetime_closed,
    polls.duplicate_vote_check_method_id
  FROM (polls JOIN polls_choices ON polls.id = polls_choices.poll_id);
