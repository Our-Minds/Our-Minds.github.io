export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_content: {
        Row: {
          content: string
          created_at: string
          id: string
          section: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          section: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          section?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_msgs_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_msgs_thread"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          consultant_id: string
          created_at: string
          id: string
          last_message_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          id?: string
          last_message_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          id?: string
          last_message_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_threads_consultant"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_threads_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_availability: {
        Row: {
          consultant_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_availability_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          available: boolean
          bio: string
          created_at: string
          hourly_rate: number
          id: string
          languages: string[]
          location: string
          paypal_email: string
          rating: number
          review_count: number
          specialization: string[]
          updated_at: string
        }
        Insert: {
          available?: boolean
          bio?: string
          created_at?: string
          hourly_rate?: number
          id: string
          languages?: string[]
          location?: string
          paypal_email: string
          rating?: number
          review_count?: number
          specialization?: string[]
          updated_at?: string
        }
        Update: {
          available?: boolean
          bio?: string
          created_at?: string
          hourly_rate?: number
          id?: string
          languages?: string[]
          location?: string
          paypal_email?: string
          rating?: number
          review_count?: number
          specialization?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          id: string
          mission: string
          paypal_client_id: string | null
          paypal_client_secret: string | null
          platform_fee_percentage: number
          updated_at: string | null
          values: string
          vision: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission?: string
          paypal_client_id?: string | null
          paypal_client_secret?: string | null
          platform_fee_percentage?: number
          updated_at?: string | null
          values?: string
          vision?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission?: string
          paypal_client_id?: string | null
          paypal_client_secret?: string | null
          platform_fee_percentage?: number
          updated_at?: string | null
          values?: string
          vision?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          consultant_id: string
          created_at: string
          id: string
          rating: number
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          consultant_id: string
          created_at?: string
          id?: string
          rating: number
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          consultant_id?: string
          created_at?: string
          id?: string
          rating?: number
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          consultant_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string | null
          content: string
          cover_image: string
          created_at: string
          id: string
          is_featured: boolean
          published_at: string
          snippet: string
          status: string | null
          tag_type: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image: string
          created_at?: string
          id?: string
          is_featured?: boolean
          published_at?: string
          snippet: string
          status?: string | null
          tag_type: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          published_at?: string
          snippet?: string
          status?: string | null
          tag_type?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          id: string
          is_active: boolean
          linkedin_url: string | null
          name: string
          position: string
          profile_image: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          position: string
          profile_image?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          position?: string
          profile_image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          consultant_id: string
          created_at: string
          currency: string
          description: string
          id: string
          payment_id: string | null
          payment_method: string
          session_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          consultant_id: string
          created_at?: string
          currency?: string
          description: string
          id?: string
          payment_id?: string | null
          payment_method: string
          session_id?: string | null
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          consultant_id?: string
          created_at?: string
          currency?: string
          description?: string
          id?: string
          payment_id?: string | null
          payment_method?: string
          session_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_image: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          profile_image?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      stories_with_authors: {
        Row: {
          author_id: string | null
          author_image: string | null
          author_name: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          id: string | null
          is_featured: boolean | null
          published_at: string | null
          snippet: string | null
          tag_type: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      mark_messages_as_read: {
        Args: { p_thread_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
