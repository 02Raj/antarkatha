export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "user" | "editor" | "admin";
export type EditorialStatus = "draft" | "scheduled" | "published" | "archived";
export type ReviewStatus = "pending" | "in_review" | "approved" | "rejected";
export type ContentType = "lesson" | "primer" | "commentary" | "story";
export type DifficultyLevel = "introductory" | "familiar" | "deep";
export type AccessTier = "free" | "premium";
export type LanguageCode = "en" | "hi";
export type BillingInterval = "month" | "year";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "cancelled" | "expired";
export type EntitlementSource = "order" | "subscription" | "grant" | "daily";
export type CouponType = "percent" | "amount";
export type WebhookStatus = "received" | "processed" | "failed" | "ignored";
export type FeedbackStatus = "new" | "in_progress" | "resolved" | "archived";
export type FeedbackCategory = "general" | "content" | "technical" | "billing";
export type ReaderTheme = "light" | "sepia" | "dark";
export type ReaderFont = "serif" | "sans";

type Row<T> = {
  Row: T;
  Insert: Partial<T> & Pick<T, never>;
  Update: Partial<T>;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_language: LanguageCode;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferred_language?: LanguageCode;
          role?: UserRole;
        };
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          email_daily: boolean;
          audio_speed: number;
          reader_theme: ReaderTheme;
          font_family: ReaderFont;
          font_scale: number;
        };
        Insert: {
          user_id: string;
          email_daily?: boolean;
          audio_speed?: number;
          reader_theme?: ReaderTheme;
          font_family?: ReaderFont;
          font_scale?: number;
        };
        Update: {
          email_daily?: boolean;
          audio_speed?: number;
          reader_theme?: ReaderTheme;
          font_family?: ReaderFont;
          font_scale?: number;
        };
        Relationships: [];
      };
      collections: Row<{
        id: string;
        slug: string;
        title: string;
        short_title: string;
        description: string;
        introduction: string;
        language: LanguageCode;
        status: EditorialStatus;
        cover_config: Json;
        sort_order: number;
        seo_title: string | null;
        seo_description: string | null;
        created_at: string;
        updated_at: string;
      }>;
      topics: Row<{
        id: string;
        slug: string;
        title: string;
        description: string;
        icon_key: string;
        sort_order: number;
        archived: boolean;
        created_at: string;
        updated_at: string;
      }>;
      content_items: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          summary: string;
          collection_id: string;
          language: LanguageCode;
          type: ContentType;
          difficulty: DifficultyLevel;
          access_tier: AccessTier;
          reading_minutes: number;
          body: Json;
          preview_blocks: Json;
          cover_config: Json;
          source_title: string | null;
          source_locator: string | null;
          adaptation_note: string | null;
          review_status: ReviewStatus;
          status: EditorialStatus;
          published_at: string | null;
          scheduled_at: string | null;
          sort_order: number;
          audio_path: string | null;
          audio_duration_seconds: number | null;
          seo_title: string | null;
          seo_description: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      bookmarks: Row<{
        user_id: string;
        content_id: string;
        created_at: string;
      }>;
      reading_progress: Row<{
        user_id: string;
        content_id: string;
        progress_percent: number;
        last_position: Json;
        completed_at: string | null;
        updated_at: string;
      }>;
      listening_progress: Row<{
        user_id: string;
        content_id: string;
        position_seconds: number;
        completed_at: string | null;
        updated_at: string;
      }>;
      user_streaks: Row<{
        user_id: string;
        current_streak: number;
        longest_streak: number;
        last_activity_date: string | null;
        updated_at: string;
      }>;
      entitlements: Row<{
        id: string;
        user_id: string;
        source_type: EntitlementSource;
        source_id: string | null;
        starts_at: string;
        ends_at: string | null;
        active: boolean;
        created_at: string;
      }>;
      plans: Row<{
        id: string;
        code: string;
        name: string;
        description: string;
        billing_interval: BillingInterval | null;
        price_paise: number;
        currency: string;
        active: boolean;
        features: Json;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }>;
      orders: Row<{
        id: string;
        user_id: string;
        plan_id: string;
        provider: string;
        provider_order_id: string | null;
        provider_payment_id: string | null;
        amount_paise: number;
        currency: string;
        status: OrderStatus;
        coupon_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      site_settings: Row<{
        key: string;
        value: Json;
        updated_by: string | null;
        updated_at: string;
      }>;
      webhook_events: Row<{
        id: string;
        provider: string;
        provider_event_id: string;
        payload: Json;
        status: WebhookStatus;
        processed_at: string | null;
        created_at: string;
      }>;
      analytics_events: Row<{
        id: string;
        user_id: string | null;
        anonymous_id: string | null;
        event_name: string;
        content_id: string | null;
        properties: Json;
        created_at: string;
      }>;
      content_topics: Row<{
        content_id: string;
        topic_id: string;
      }>;
      daily_features: Row<{
        id: string;
        feature_date: string;
        content_id: string;
        timezone: string;
        active: boolean;
        created_at: string;
      }>;
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          email: string | null;
          category: FeedbackCategory;
          message: string;
          status: FeedbackStatus;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string | null;
          email?: string | null;
          category: FeedbackCategory;
          message: string;
        };
        Update: {
          status?: FeedbackStatus;
          internal_notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      content_catalog: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          summary: string;
          collection_id: string;
          language: LanguageCode;
          type: ContentType;
          difficulty: DifficultyLevel;
          access_tier: AccessTier;
          reading_minutes: number;
          preview_blocks: Json;
          cover_config: Json;
          source_title: string | null;
          source_locator: string | null;
          adaptation_note: string | null;
          review_status: ReviewStatus;
          status: EditorialStatus;
          published_at: string | null;
          sort_order: number;
          audio_duration_seconds: number | null;
          has_audio: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      has_library_access: { Args: { _uid?: string }; Returns: boolean };
      is_daily_content: { Args: { _content_id: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      editorial_status: EditorialStatus;
      review_status: ReviewStatus;
      content_type: ContentType;
      difficulty_level: DifficultyLevel;
      access_tier: AccessTier;
      language_code: LanguageCode;
    };
  };
};
