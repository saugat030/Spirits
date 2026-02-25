-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "categories" (
	"type_id" serial PRIMARY KEY NOT NULL,
	"type_name" varchar(100) NOT NULL,
	CONSTRAINT "categories_type_name_key" UNIQUE("type_name")
);
--> statement-breakpoint
CREATE TABLE "liquors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type_id" integer,
	"image_link" text,
	"description" text,
	"quantity" integer,
	"price" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(10) DEFAULT 'user' NOT NULL,
	"verifyotp" varchar(50),
	"verifyotpexpireat" integer,
	"isverified" boolean DEFAULT false,
	"resetotp" varchar(100),
	"resetotpexpireat" integer,
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_role_check" CHECK ((role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text]))
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "liquors" ADD CONSTRAINT "liquors_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."categories"("type_id") ON DELETE no action ON UPDATE no action;
*/