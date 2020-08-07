-- run these commands to initialize the database after creating a database named efp_checkin

CREATE TABLE "account" (
	"id" serial NOT NULL,
	"name" varchar(60) NOT NULL,
	"email" varchar(320) NOT NULL UNIQUE,
	"password" varchar(320) NOT NULL,
	"access_level" integer NOT NULL DEFAULT '1',
	CONSTRAINT "account_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "profile" (
	"account_id" serial NOT NULL,
	"dietary_restrictions" TEXT,
	"last_pickup" TIMESTAMP,
	"household_id" varchar(12) NOT NULL,
	CONSTRAINT "profile_pk" PRIMARY KEY ("account_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "order" (
	"id" serial NOT NULL,
	"account_id" integer NOT NULL,
	"checkin_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"checkout_at" TIMESTAMP,
	"location_id" integer NOT NULL,
	"dietary_restrictions" TEXT,
	"walking_home" BOOLEAN NOT NULL DEFAULT 'false',
	"pregnant" BOOLEAN NOT NULL DEFAULT 'false',
	"child_birthday" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "order_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "location" (
	"id" INTEGER PRIMARY KEY,
	"description" varchar(100) NOT NULL UNIQUE
) WITH (
  OIDS=FALSE
);





ALTER TABLE "order" ADD CONSTRAINT "order_is_linked_to_account" FOREIGN KEY ("account_id") REFERENCES "account"("id");
ALTER TABLE "order" ADD CONSTRAINT "order_is_linked_to_location" FOREIGN KEY ("location_id") REFERENCES "location"("id");

-- insert a test account and location used for testing 
-- TODO Remove from production build
INSERT INTO account ("id", "name", "email", "password", "access_level") VALUES (1, 'test', 'aaaa@aaaa.com', 'test', '0');
INSERT INTO location ("id","description") VALUES (1, 'test location');