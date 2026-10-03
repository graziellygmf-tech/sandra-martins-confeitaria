export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_image: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_image?: string | null;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cover_image?: string | null;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      creations: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category_id: string;
          featured: boolean;
          is_published: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          category_id: string;
          featured?: boolean;
          is_published?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          category_id?: string;
          featured?: boolean;
          is_published?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creation_images: {
        Row: {
          id: string;
          creation_id: string;
          storage_path: string;
          alt_text: string | null;
          position: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          creation_id: string;
          storage_path: string;
          alt_text?: string | null;
          position?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          creation_id?: string;
          storage_path?: string;
          alt_text?: string | null;
          position?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      availability_days: {
        Row: {
          id: string;
          date: string;
          status: "AVAILABLE" | "LIMITED" | "BLOCKED";
          capacity: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          status: "AVAILABLE" | "LIMITED" | "BLOCKED";
          capacity?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          status?: "AVAILABLE" | "LIMITED" | "BLOCKED";
          capacity?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          requested_date: string;
          creation_id: string | null;
          customer_name: string;
          customer_phone: string;
          guest_count: number | null;
          message: string | null;
          source: string;
          status: "NEW" | "CONTACTED" | "QUOTED" | "CONFIRMED" | "CANCELLED";
          created_at: string;
        };
        Insert: {
          id?: string;
          requested_date: string;
          creation_id?: string | null;
          customer_name: string;
          customer_phone: string;
          guest_count?: number | null;
          message?: string | null;
          source?: string;
          status?: "NEW" | "CONTACTED" | "QUOTED" | "CONFIRMED" | "CANCELLED";
          created_at?: string;
        };
        Update: {
          id?: string;
          requested_date?: string;
          creation_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          guest_count?: number | null;
          message?: string | null;
          source?: string;
          status?: "NEW" | "CONTACTED" | "QUOTED" | "CONFIRMED" | "CANCELLED";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      availability_calendar: {
        Row: {
          date: string;
          status: "AVAILABLE" | "LIMITED" | "BLOCKED";
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

