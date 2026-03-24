export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      faceless_series: {
        Row: {
          character_description: string | null
          created_at: string
          id: string
          niche: string
          seed_image_url: string | null
          title: string
          total_parts: number
          user_id: string
        }
        Insert: {
          character_description?: string | null
          created_at?: string
          id?: string
          niche?: string
          seed_image_url?: string | null
          title?: string
          total_parts?: number
          user_id: string
        }
        Update: {
          character_description?: string | null
          created_at?: string
          id?: string
          niche?: string
          seed_image_url?: string | null
          title?: string
          total_parts?: number
          user_id?: string
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          created_at: string
          features_image_url: string | null
          hero_image_url: string | null
          howto_image_url: string | null
          html: string | null
          id: string
          pricing_image_url: string | null
          product_name: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          features_image_url?: string | null
          hero_image_url?: string | null
          howto_image_url?: string | null
          html?: string | null
          id?: string
          pricing_image_url?: string | null
          product_name: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          features_image_url?: string | null
          hero_image_url?: string | null
          howto_image_url?: string | null
          html?: string | null
          id?: string
          pricing_image_url?: string | null
          product_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          email: string | null
          id: string
          language: string
          name: string | null
          plan: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          id: string
          language?: string
          name?: string | null
          plan?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          id?: string
          language?: string
          name?: string | null
          plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      script_segments: {
        Row: {
          created_at: string
          id: string
          paragraph_text: string
          segment_number: number
          status: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paragraph_text: string
          segment_number: number
          status?: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paragraph_text?: string
          segment_number?: number
          status?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_segments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      subtitle_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          original_video_url: string
          replicate_prediction_id: string | null
          settings: Json | null
          status: string
          subtitled_video_url: string | null
          transcript_url: string | null
          updated_at: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          original_video_url: string
          replicate_prediction_id?: string | null
          settings?: Json | null
          status?: string
          subtitled_video_url?: string | null
          transcript_url?: string | null
          updated_at?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          original_video_url?: string
          replicate_prediction_id?: string | null
          settings?: Json | null
          status?: string
          subtitled_video_url?: string | null
          transcript_url?: string | null
          updated_at?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subtitle_jobs_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          credits: number
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          credits: number
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credits?: number
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          aspect_ratio: string
          character_description: string | null
          cliffhanger: string | null
          cloudinary_public_id: string | null
          context_for_continuation: string | null
          country: string
          created_at: string
          credits_used: number
          current_segment: number
          description: string | null
          duration: string
          id: string
          language: string
          model: string
          narration_script: string | null
          niche: string | null
          parent_video_id: string | null
          part_number: number
          product_image_url: string
          product_name: string
          seed_image_url: string | null
          series_id: string | null
          status: string
          story_summary: string | null
          task_id: string | null
          thumbnail_url: string | null
          total_segments: number | null
          updated_at: string
          user_id: string
          video_type: string
          video_url: string | null
        }
        Insert: {
          aspect_ratio?: string
          character_description?: string | null
          cliffhanger?: string | null
          cloudinary_public_id?: string | null
          context_for_continuation?: string | null
          country: string
          created_at?: string
          credits_used?: number
          current_segment?: number
          description?: string | null
          duration?: string
          id?: string
          language?: string
          model?: string
          narration_script?: string | null
          niche?: string | null
          parent_video_id?: string | null
          part_number?: number
          product_image_url: string
          product_name: string
          seed_image_url?: string | null
          series_id?: string | null
          status?: string
          story_summary?: string | null
          task_id?: string | null
          thumbnail_url?: string | null
          total_segments?: number | null
          updated_at?: string
          user_id: string
          video_type?: string
          video_url?: string | null
        }
        Update: {
          aspect_ratio?: string
          character_description?: string | null
          cliffhanger?: string | null
          cloudinary_public_id?: string | null
          context_for_continuation?: string | null
          country?: string
          created_at?: string
          credits_used?: number
          current_segment?: number
          description?: string | null
          duration?: string
          id?: string
          language?: string
          model?: string
          narration_script?: string | null
          niche?: string | null
          parent_video_id?: string | null
          part_number?: number
          product_image_url?: string
          product_name?: string
          seed_image_url?: string | null
          series_id?: string | null
          status?: string
          story_summary?: string | null
          task_id?: string | null
          thumbnail_url?: string | null
          total_segments?: number | null
          updated_at?: string
          user_id?: string
          video_type?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_parent_video_id_fkey"
            columns: ["parent_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
