-- Run these commands to initialize the database after creating a database.

CREATE TABLE "account" (
	"id" serial NOT NULL,
	"name" varchar(60) NOT NULL,
	"email" varchar(320) NOT NULL UNIQUE,
	"password" varchar(320) NOT NULL,
	"access_level" integer NOT NULL DEFAULT '1',
	"active" BOOLEAN NOT NULL DEFAULT 'true',
	CONSTRAINT "account_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "profile" (
	"account_id" integer,
	"household_id" varchar(12) NOT NULL,
	"latest_order" integer
) WITH (
  OIDS=FALSE
);



CREATE TABLE "order" (
	"id" serial NOT NULL,
	"account_id" integer NOT NULL,
	"checkin_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"checkout_at" TIMESTAMP,
	"location_id" integer NOT NULL,
	"dietary_restrictions" varchar(1000),
	"walking_home" BOOLEAN NOT NULL DEFAULT 'false',
	"pregnant" BOOLEAN NOT NULL DEFAULT 'false',
	"child_birthday" BOOLEAN NOT NULL DEFAULT 'false',
	"snap" BOOLEAN NOT NULL DEFAULT 'false',
	"pickup_name" VARCHAR(100),
	"other" varchar(1000),
	"wait_time_minutes" integer,
	CONSTRAINT "order_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "location" (
	"id" INTEGER PRIMARY KEY UNIQUE,
	"description" varchar(100) NOT NULL
) WITH (
  OIDS=FALSE
);

INSERT INTO "location" ("id", "description") VALUES (1, 'Spot 1');
INSERT INTO "location" ("id", "description") VALUES (2, 'Spot 2');
INSERT INTO "location" ("id", "description") VALUES (3, 'Spot 3');
INSERT INTO "location" ("id", "description") VALUES (4, 'Spot 4');
INSERT INTO "location" ("id", "description") VALUES (5, 'Spot 5');
INSERT INTO "location" ("id", "description") VALUES (6, 'Spot 6');
INSERT INTO "location" ("id", "description") VALUES (7, 'Spot 7');
INSERT INTO "location" ("id", "description") VALUES (8, 'Spot 8');
INSERT INTO "location" ("id", "description") VALUES (9, 'Spot 9');
INSERT INTO "location" ("id", "description") VALUES (10, 'Spot 10');
INSERT INTO "location" ("id", "description") VALUES (11, 'Spot 11');
INSERT INTO "location" ("id", "description") VALUES (12, 'Spot 12');
INSERT INTO "location" ("id", "description") VALUES (13, 'Spot 13');
INSERT INTO "location" ("id", "description") VALUES (14, 'Spot 14');
INSERT INTO "location" ("id", "description") VALUES (15, 'I''m parked on the street');
INSERT INTO "location" ("id", "description") VALUES (16, 'I walked here today');



ALTER TABLE "order" ADD CONSTRAINT "order_is_linked_to_account" FOREIGN KEY ("account_id") REFERENCES "account"("id");
ALTER TABLE "order" ADD CONSTRAINT "order_is_linked_to_location" FOREIGN KEY ("location_id") REFERENCES "location"("id");
ALTER TABLE "profile" ADD CONSTRAINT "account_is_linked_to_most_recent_order" FOREIGN KEY ("latest_order") REFERENCES "order"("id");
ALTER TABLE "profile" ADD CONSTRAINT "account_id_is_linked_to_account" FOREIGN KEY ("account_id") REFERENCES "account"("id");