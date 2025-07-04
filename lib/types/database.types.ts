export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      collection_shares: {
        Row: {
          collection_id: number;
          target_user_id: string;
        };
        Insert: {
          collection_id: number;
          target_user_id: string;
        };
        Update: {
          collection_id?: number;
          target_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_shares_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_shares_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      collections: {
        Row: {
          created_at: string;
          id: number;
          image: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image?: string;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          image?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      friend_requests: {
        Row: {
          id: string;
          receiver_id: string;
          sender_id: string;
          sent_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          receiver_id: string;
          sender_id: string;
          sent_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          receiver_id?: string;
          sender_id?: string;
          sent_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          since: string | null;
          user_a: string;
          user_b: string;
        };
        Insert: {
          since?: string | null;
          user_a: string;
          user_b: string;
        };
        Update: {
          since?: string | null;
          user_a?: string;
          user_b?: string;
        };
        Relationships: [];
      };
      lines: {
        Row: {
          id: number;
          name: string;
          variation_id: number;
        };
        Insert: {
          id?: number;
          name: string;
          variation_id?: number;
        };
        Update: {
          id?: number;
          name?: string;
          variation_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lines_variation_id_fkey";
            columns: ["variation_id"];
            isOneToOne: false;
            referencedRelation: "variations";
            referencedColumns: ["id"];
          }
        ];
      };
      moves: {
        Row: {
          fen: string;
          id: number;
          line_id: number;
          ply: number;
          san: string;
        };
        Insert: {
          fen: string;
          id?: number;
          line_id: number;
          ply: number;
          san: string;
        };
        Update: {
          fen?: string;
          id?: number;
          line_id?: number;
          ply?: number;
          san?: string;
        };
        Relationships: [
          {
            foreignKeyName: "moves_line_id_fkey";
            columns: ["line_id"];
            isOneToOne: false;
            referencedRelation: "lines";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          first_name: string;
          id: string;
          last_name: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string;
          first_name?: string;
          id: string;
          last_name?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
        };
        Relationships: [];
      };
      sequences: {
        Row: {
          collection_id: number;
          created_at: string;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          collection_id: number;
          created_at?: string;
          id?: number;
          name: string;
          user_id?: string;
        };
        Update: {
          collection_id?: number;
          created_at?: string;
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sequences_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          }
        ];
      };
      variations: {
        Row: {
          id: number;
          name: string;
          orientation: Database["public"]["Enums"]["Orientation"];
          sequence_id: number;
          start_fen: string;
        };
        Insert: {
          id?: number;
          name?: string;
          orientation?: Database["public"]["Enums"]["Orientation"];
          sequence_id: number;
          start_fen?: string;
        };
        Update: {
          id?: number;
          name?: string;
          orientation?: Database["public"]["Enums"]["Orientation"];
          sequence_id?: number;
          start_fen?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variations_sequence_id_fkey1";
            columns: ["sequence_id"];
            isOneToOne: false;
            referencedRelation: "sequences";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_friend_request: {
        Args: { p_request_id: string };
        Returns: undefined;
      };
      decline_friend_request: {
        Args: { p_request_id: string };
        Returns: undefined;
      };
      get_my_friends: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
          display_name: string;
          created_at: string;
        }[];
      };
      get_pending_friend_requests: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          sender_id: string;
          receiver_id: string;
          first_name: string;
          last_name: string;
          display_name: string;
          sent_at: string;
          status: string;
        }[];
      };
      get_pending_sent_friend_requests: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          sender_id: string;
          receiver_id: string;
          first_name: string;
          last_name: string;
          display_name: string;
          sent_at: string;
          status: string;
        }[];
      };
      remove_friend: {
        Args: { p_friend_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      Orientation: "white" | "black";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      Orientation: ["white", "black"],
    },
  },
} as const;

export type Profile = Tables<"profiles">;
export type Collection = Tables<"collections">;
export type Sequence = Tables<"sequences">;
export type Variation = Tables<"variations">;
export type Line = Tables<"lines">;
export type Move = Tables<"moves">;
export type Orientation = Enums<"Orientation">;
export type CollectionShare = Tables<"collection_shares">;

export type CollectionWithSequences = Collection & {
  sequences: Sequence[];
};

export type SequenceWithVariations = Sequence & {
  variations: Variation[];
};

export type VariationWithLines = Variation & {
  lines: Line[];
};

export type VariationWithFullLines = Variation & {
  lines: LineWithMoves[];
};

export type LineWithMoves = Line & {
  moves: Move[];
};

export type FriendRequestCore = Tables<"friend_requests">;
export type FriendsCore = Tables<"friendships">;

export type FriendRequest = FriendRequestCore &
  Omit<Profile, "id" | "created_at">;
