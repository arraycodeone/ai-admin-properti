import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { organizationA, properties, withDemoMedia } from "@/demo/properties";
import { searchProperties } from "@/modules/properties/service";

describe("katalog Nusa", () => {
  it("memetakan 10 listing publik ke cover dan empat foto yang tersedia", () => {
    const rows = searchProperties(properties, organizationA).map(withDemoMedia);
    expect(rows).toHaveLength(10);
    expect(new Set(properties.map(row => row.id)).size).toBe(properties.length);
    for (const row of rows) {
      expect(typeof row.price_rupiah).toBe("string");
      expect(row.media?.images).toHaveLength(4);
      const paths = [row.media!.cover, ...row.media!.images.flatMap(photo => [photo.src, photo.thumbnail])];
      for (const path of paths) {
        expect(path).toContain(row.slug);
        expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
      }
    }
    expect(rows.map(row => row.slug)).not.toContain("rumah-draft");
  });
});
