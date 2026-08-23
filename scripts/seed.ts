import { config } from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import crypto from "crypto";

config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
});

function uid() {
  return crypto.randomUUID();
}

async function seed() {
  const now = new Date().toISOString();

  // 1. CLEAR PREVIOUS SEED RECORDS TO ENSURE CLEAN RETRY
  console.log("🧼 Cleaning database of previous seed data...");

  await pool.query("DELETE FROM shipping_methods_zone_fees CASCADE");
  await pool.query("DELETE FROM shipping_methods CASCADE");

  console.log("♻️ Database cleared. Starting seed process...");

  // 2. SEED DEFAULT TESTING USER (IF NOT EXISTS)
  const defaultUser = await pool.query("SELECT id FROM users WHERE email = $1", [
    "admin@sinages.ng",
  ]);
  if (defaultUser.rows.length === 0) {
    await pool.query(
      `INSERT INTO users (email, hash, role, name, status, updated_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)`,
      [
        "admin@sinages.ng",
        "$2b$10$Ukyi9yX3yXQZ.P7U.V3c.OXpGCO/O307mXoWp2K8I/j6eF3m57Hl.",
        "admin",
        "System Admin",
        "active",
        now,
      ]
    );
    console.log("  ✓ Created Default Testing Admin: admin@sinages.ng / password");
  } else {
    console.log("  • Admin user exists.");
  }

  // 3. SEED SHIPPING DETAILS FOR REALISTIC EUROPEAN LOGISTICS
  const shippingOptions = [
    { name: "Standard Delivery (Netherlands & UK)", desc: "Reliable 2-5 business day delivery across the Netherlands and UK.", fee: 9.95, est: "2-4 business days" },
    { name: "Express Delivery (Major Cities)", desc: "Priority next-business-day delivery to major cities in the Netherlands and UK.", fee: 14.95, est: "1-2 business days" },
    { name: "Expedited Doorstep Air-Cargo Delivery", desc: "Premium expedited air shipment and direct doorstep courier to key residential cities.", fee: 8500, est: "1 - 2 business days" }
  ];

  for (const s of shippingOptions) {
    const parentIdResult = await pool.query(
      `INSERT INTO shipping_methods (name, description, base_fee, estimated_delivery, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING id`,
      [s.name, s.desc, s.fee, s.est, true, now]
    );

    const parentId = parentIdResult.rows[0].id;

    // Add corresponding Zone values to match state routing settings
    const zones = ["london", "amsterdam", "manchester", "other-states"];
    for (let i = 0; i < zones.length; i++) {
      let zoneFee = s.fee;
      if ((zones[i] === "london" || zones[i] === "amsterdam") && s.fee > 2000)
        zoneFee = Math.max(2000, s.fee - 1500);
      if (zones[i] === "other-states" && s.fee < 8500) zoneFee = s.fee + 2500;

      await pool.query(
        `INSERT INTO shipping_methods_zone_fees (_order, _parent_id, id, zone, fee)
         VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, parentId, uid(), zones[i], zoneFee]
      );
    }
    console.log(`  ✓ Configured Shipping Service: ${s.name}`);
  }

  console.log(`\n🎉 Seed completed! Shipping & tracking platform is ready.`);
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Seed failed with critical error:", err);
  await pool.end();
  process.exit(1);
});