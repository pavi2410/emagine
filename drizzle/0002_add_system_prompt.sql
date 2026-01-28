ALTER TABLE "user_settings" ALTER COLUMN "selected_model" SET DEFAULT 'z-ai/glm-4.5-air:free';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "system_prompt" text;