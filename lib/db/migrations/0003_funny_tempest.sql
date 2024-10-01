ALTER TABLE "fields" DROP CONSTRAINT "fields_post_type_id_post_types_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "field_slug_idx";--> statement-breakpoint
ALTER TABLE "fields" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fields" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fields" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fields" ALTER COLUMN "options" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "fields" DROP COLUMN IF EXISTS "default_value";