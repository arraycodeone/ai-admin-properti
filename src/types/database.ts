import type { Database as GeneratedDatabase } from "./database.generated";

type PublicSchema = GeneratedDatabase["public"];
type Catalog = PublicSchema["Functions"]["search_public_properties"];

// PostgREST accepts bigint input as decimal text. Number would lose precision.
// RETURNS TABLE does not expose the nullable area casts to the generator.
export type Database = Omit<GeneratedDatabase, "public"> & {
  public: Omit<PublicSchema, "Functions"> & {
    Functions: Omit<PublicSchema["Functions"], "search_public_properties"> & {
      search_public_properties: Omit<Catalog, "Args" | "Returns"> & {
        Args: Omit<Catalog["Args"], "p_budget"> & { p_budget?: string };
        Returns: (Omit<Catalog["Returns"][number], "land_area_m2" | "building_area_m2"> & {
          land_area_m2: string | null;
          building_area_m2: string | null;
        })[];
      };
    };
  };
};
