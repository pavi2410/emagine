ALTER TABLE "user_settings" ADD COLUMN "has_completed_oobe" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "wallpaper" text DEFAULT 'gradient-purple' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "accent_color" text DEFAULT 'purple' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "avatar" text DEFAULT 'gradient-1' NOT NULL;