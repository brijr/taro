CREATE TABLE IF NOT EXISTS "fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_type_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"default_value" jsonb,
	"options" jsonb,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fields" ADD CONSTRAINT "fields_post_type_id_post_types_id_fk" FOREIGN KEY ("post_type_id") REFERENCES "public"."post_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "field_slug_idx" ON "fields" USING btree ("post_type_id","slug");