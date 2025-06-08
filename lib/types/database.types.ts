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
      moves: {
        Row: {
          fen: string;
          id: number;
          ply: number;
          san: string;
          variation_id: number;
        };
        Insert: {
          fen: string;
          id?: number;
          ply: number;
          san: string;
          variation_id: number;
        };
        Update: {
          fen?: string;
          id?: number;
          ply?: number;
          san?: string;
          variation_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "moves_variation_id_fkey";
            columns: ["variation_id"];
            isOneToOne: false;
            referencedRelation: "variations";
            referencedColumns: ["id"];
          }
        ];
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
          created_at: string;
          id: number;
          name: string;
          orientation: Database["public"]["Enums"]["Orientation"];
          sequence_id: number;
          start_fen: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          orientation?: Database["public"]["Enums"]["Orientation"];
          sequence_id: number;
          start_fen?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          orientation?: Database["public"]["Enums"]["Orientation"];
          sequence_id?: number;
          start_fen?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variations_sequence_id_fkey";
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
      [_ in never]: never;
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

export type Collection = Tables<"collections">;
export type Sequence = Tables<"sequences">;
export type Variation = Tables<"variations">;
export type Move = Tables<"moves">;
export type Orientation = Enums<"Orientation">;

export type CollectionWithSequences = Collection & {
  sequences: Sequence[];
};

export type SequenceWithVariations = Sequence & {
  variations: Variation[];
};

export type VariationWithMoves = Variation & {
  moves: Move[];
};
