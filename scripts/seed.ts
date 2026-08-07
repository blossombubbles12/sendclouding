import { config } from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import crypto from "crypto";

config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
});

function uid() { return crypto.randomUUID(); }

function richText(text: string) {
  return JSON.stringify({
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [{
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ mode: "normal", text, type: "text", style: "", detail: 0, format: 0, version: 1 }],
        direction: "ltr", textStyle: "", textFormat: 0,
      }],
      direction: "ltr",
    },
  });
}

async function seed() {
  const now = new Date().toISOString();

  // ── Categories ──
  const cats: { name: string; slug: string; description: string; featured: boolean; status: string; sort_order: number; id?: number }[] = [
    { name: "Bottled Water", slug: "bottled-water", description: richText("Premium bottled water in various sizes for homes, offices, and events."), featured: true, status: "active", sort_order: 1 },
    { name: "Sachet Water", slug: "sachet-water", description: richText("Affordable purified sachet water, perfect for everyday hydration."), featured: true, status: "active", sort_order: 2 },
    { name: "Dispenser Water", slug: "dispenser-water", description: richText("Large-format dispenser bottles for water coolers in offices and homes."), featured: true, status: "active", sort_order: 3 },
    { name: "Bread & Pastries", slug: "bread-pastries", description: richText("Freshly baked artisan breads, croissants, and pastries made daily."), featured: true, status: "active", sort_order: 4 },
    { name: "Cakes & Desserts", slug: "cakes-desserts", description: richText("Delicious cakes, muffins, and desserts for every occasion."), featured: true, status: "active", sort_order: 5 },
    { name: "Snacks & Meat Pies", slug: "snacks-meat-pies", description: richText("Savoury meat pies, sausage rolls, and snacks baked fresh."), featured: false, status: "active", sort_order: 6 },
  ];

  for (const c of cats) {
    const existing = await pool.query("SELECT id FROM categories WHERE slug = $1", [c.slug]);
    if (existing.rows.length === 0) {
      const result = await pool.query(
        `INSERT INTO categories (name, slug, description, featured, status, sort_order, created_at, updated_at)
         VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7,$7) RETURNING id`,
        [c.name, c.slug, c.description, c.featured, c.status, c.sort_order, now]
      );
      c.id = result.rows[0].id;
      console.log(`  ✓ Category: ${c.name}`);
    } else {
      c.id = existing.rows[0].id;
      console.log(`  • Category exists: ${c.name}`);
    }
  }

  // ── Products ──
  interface Prod {
    name: string; slug: string; description: string; price: number; compare_at_price: number | null;
    cat: string; featured: boolean; status: string; sku: string;
    inv_qty: number; inv_low: number; inv_track: boolean;
    tags: string[]; specs: { name: string; value: string }[];
  }

  const products: Prod[] = [
    { name: "AquaBest Pure Water 75cl", slug: "aquabest-pure-water-75cl", description: richText("AquaBest Pure Water 75cl — crisp, clean, and refreshing bottled water perfect for on-the-go hydration. Sourced from natural springs and purified through a 7-stage filtration process to ensure the highest quality."), price: 250, compare_at_price: null, cat: "bottled-water", featured: true, status: "active", sku: "AB-PW-075", inv_qty: 5000, inv_low: 50, inv_track: true, tags: ["Bestseller", "Pure Water"], specs: [{ name: "Size", value: "75cl" }, { name: "Pack Size", value: "12 per pack" }, { name: "Source", value: "Natural Spring" }, { name: "Certification", value: "NAFDAC Approved" }] },
    { name: "AquaBest Table Water 1.5L", slug: "aquabest-table-water-1-5l", description: richText("The perfect family-sized water bottle — 1.5 litres of pure, great-tasting AquaBest water. Great for family dinners, picnics, and keeping on your desk throughout the workday."), price: 600, compare_at_price: 750, cat: "bottled-water", featured: true, status: "active", sku: "AB-TW-150", inv_qty: 3000, inv_low: 30, inv_track: true, tags: ["Family Size"], specs: [{ name: "Size", value: "1.5 Litres" }, { name: "Pack Size", value: "6 per pack" }, { name: "Bottle Type", value: "PET Recyclable" }] },
    { name: "AquaBest Sachet Water (20-Pack)", slug: "aquabest-sachet-water-20", description: richText("Affordable, purified sachet water — 20 sachets per pack. Produced under strict hygienic conditions and sealed for freshness."), price: 200, compare_at_price: null, cat: "sachet-water", featured: false, status: "active", sku: "AB-SW-020", inv_qty: 10000, inv_low: 100, inv_track: true, tags: ["Economy", "Everyday"], specs: [{ name: "Quantity", value: "20 sachets" }, { name: "Volume", value: "500ml each" }] },
    { name: "AquaBest Sachet Water (50-Pack)", slug: "aquabest-sachet-water-50", description: richText("Our best-value sachet water pack — 50 sachets of pure, clean drinking water. Great for large families, events, and stocking up."), price: 450, compare_at_price: 500, cat: "sachet-water", featured: false, status: "active", sku: "AB-SW-050", inv_qty: 8000, inv_low: 80, inv_track: true, tags: ["Value Pack", "Bulk"], specs: [{ name: "Quantity", value: "50 sachets" }, { name: "Volume", value: "500ml each" }] },
    { name: "AquaBest Dispenser Bottle 18.9L", slug: "aquabest-dispenser-bottle-18-9l", description: richText("Large 18.9-litre dispenser bottle for water coolers in offices, homes, and commercial spaces. Refillable and sanitised between uses."), price: 1800, compare_at_price: 2000, cat: "dispenser-water", featured: true, status: "active", sku: "AB-DW-189", inv_qty: 500, inv_low: 20, inv_track: true, tags: ["Office", "Dispenser"], specs: [{ name: "Volume", value: "18.9 Litres" }, { name: "Bottle Type", value: "Polycarbonate" }, { name: "Ideal For", value: "Water Dispensers" }] },
    { name: "Golden Crust Butter Bread", slug: "golden-crust-butter-bread", description: richText("Our signature Golden Crust Butter Bread — baked fresh every morning with premium butter and flour. Soft on the inside, perfectly golden on the outside."), price: 1500, compare_at_price: null, cat: "bread-pastries", featured: true, status: "active", sku: "AB-BR-001", inv_qty: 200, inv_low: 10, inv_track: true, tags: ["Fresh", "Daily"], specs: [{ name: "Weight", value: "800g loaf" }, { name: "Ingredients", value: "Flour, Butter, Yeast" }, { name: "Shelf Life", value: "3 days" }] },
    { name: "Classic Nigerian Meat Pie (Box of 6)", slug: "classic-meat-pie-box-6", description: richText("Nigeria's favourite snack — our classic meat pies baked to golden perfection. Filled with seasoned minced beef, potatoes, and carrots in a flaky, buttery pastry."), price: 3000, compare_at_price: 3600, cat: "snacks-meat-pies", featured: true, status: "active", sku: "AB-MP-006", inv_qty: 150, inv_low: 10, inv_track: true, tags: ["Bestseller", "Snacks"], specs: [{ name: "Quantity", value: "6 per box" }, { name: "Filling", value: "Beef, potatoes, carrots" }, { name: "Baked", value: "Fresh daily" }] },
    { name: "Chocolate Chip Muffins (4-Pack)", slug: "chocolate-chip-muffins-4", description: richText("Soft, moist chocolate chip muffins loaded with premium chocolate chips. Baked fresh daily in our Lagos bakery."), price: 2200, compare_at_price: null, cat: "cakes-desserts", featured: false, status: "active", sku: "AB-MU-004", inv_qty: 100, inv_low: 5, inv_track: true, tags: ["Dessert", "Chocolate"], specs: [{ name: "Quantity", value: "4 muffins" }, { name: "Weight", value: "~120g each" }] },
    { name: "Vanilla Celebration Cake", slug: "vanilla-celebration-cake", description: richText("Our beautiful vanilla celebration cake — three layers of moist vanilla sponge filled and frosted with silky buttercream. Perfect for birthdays, anniversaries, and special occasions."), price: 8500, compare_at_price: null, cat: "cakes-desserts", featured: true, status: "active", sku: "AB-CK-001", inv_qty: 20, inv_low: 3, inv_track: true, tags: ["Celebration", "Custom"], specs: [{ name: "Size", value: "8-inch round" }, { name: "Servings", value: "8–12 people" }, { name: "Flavour", value: "Vanilla buttercream" }, { name: "Order Notice", value: "24 hours" }] },
    { name: "Sausage Rolls (Box of 12)", slug: "sausage-rolls-box-12", description: richText("Twelve golden, flaky sausage rolls filled with seasoned sausage meat. A crowd favourite for parties, office events, and family gatherings."), price: 2800, compare_at_price: 3200, cat: "snacks-meat-pies", featured: true, status: "active", sku: "AB-SR-012", inv_qty: 120, inv_low: 10, inv_track: true, tags: ["Party", "Snacks"], specs: [{ name: "Quantity", value: "12 rolls" }, { name: "Pastry", value: "Flaky puff pastry" }] },
  ];

  for (const p of products) {
    const cat = cats.find(c => c.slug === p.cat)!;
    const existing = await pool.query("SELECT id FROM products WHERE slug = $1", [p.slug]);
    if (existing.rows.length === 0) {
      // Insert product
      const result = await pool.query(
        `INSERT INTO products (name, slug, description, price, compare_at_price, sku, featured, status, category_id, inventory_quantity, inventory_low_stock_threshold, inventory_track_inventory, created_at, updated_at)
         VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13) RETURNING id`,
        [p.name, p.slug, p.description, p.price, p.compare_at_price, p.sku, p.featured, p.status, cat.id, p.inv_qty, p.inv_low, p.inv_track, now]
      );
      const prodId = result.rows[0].id;

      // Insert tags
      for (let i = 0; i < p.tags.length; i++) {
        await pool.query(
          `INSERT INTO products_tags (_order, _parent_id, id, tag) VALUES ($1, $2, $3, $4)`,
          [i + 1, prodId, uid(), p.tags[i]]
        );
      }

      // Insert specs
      for (let i = 0; i < p.specs.length; i++) {
        await pool.query(
          `INSERT INTO products_specifications (_order, _parent_id, id, name, value) VALUES ($1, $2, $3, $4, $5)`,
          [i + 1, prodId, uid(), p.specs[i].name, p.specs[i].value]
        );
      }

      console.log(`  ✓ Product: ${p.name} (${p.sku})`);
    } else {
      console.log(`  • Product exists: ${p.name}`);
    }
  }

  console.log(`\n✅ Seeded ${products.length} products across ${cats.length} categories!`);
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await pool.end();
  process.exit(1);
});
