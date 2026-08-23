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

function randomTrackingNumber(used: Set<string>): string {
  const year = new Date().getFullYear();
  let tn = "";
  do {
    const suffix = Math.floor(100000000 + Math.random() * 900000000);
    tn = `SC-${year}-${suffix}`;
  } while (used.has(tn));
  used.add(tn);
  return tn;
}

async function seed() {
  const now = new Date().toISOString();

  // 1. CLEAR PREVIOUS SEED RECORDS TO ENSURE CLEAN RETRY
  console.log("🧼 Cleaning database of previous seed data...");

  await pool.query("DELETE FROM shipments_rels CASCADE");
  await pool.query("DELETE FROM tracking_events CASCADE");
  await pool.query("DELETE FROM shipments CASCADE");
  await pool.query("DELETE FROM locations CASCADE");
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

  // 4. SEED TRACKING DEMO DATA (Locations, Shipments, Tracking Events)
  const daysAgo = (days: number, hours = 0) =>
    new Date(Date.now() - days * 86400000 - hours * 3600000).toISOString();

  const locationData = [
    { name: "Amsterdam Central Hub", type: "hub", address: "Schiphol Logistics Park 12", city: "Amsterdam", country: "Netherlands" },
    { name: "Rotterdam Port Depot", type: "depot", address: "Waalhaven Pier 3", city: "Rotterdam", country: "Netherlands" },
    { name: "Frankfurt Cargo Hub", type: "hub", address: "Cargo City South, Gate 7", city: "Frankfurt", country: "Germany" },
    { name: "London Heathrow Depot", type: "depot", address: "Cargo Way, Hounslow", city: "London", country: "United Kingdom" },
    { name: "Dubai Transit Hub", type: "hub", address: "DXB Cargo Village, Gate 21", city: "Dubai", country: "United Arab Emirates" },
    { name: "Singapore Regional Hub", type: "hub", address: "Changi Airfreight Centre", city: "Singapore", country: "Singapore" },
    { name: "Shanghai Gateway", type: "sorting-facility", address: "Pudong Intl Cargo Terminal", city: "Shanghai", country: "China" },
    { name: "Hong Kong Depot", type: "depot", address: "Chek Lap Kok Cargo Area", city: "Hong Kong", country: "Hong Kong" },
    { name: "Tokyo Distribution Hub", type: "hub", address: "Narita Cargo Zone 4", city: "Tokyo", country: "Japan" },
    { name: "Mumbai Gateway Depot", type: "depot", address: "BOM Cargo Centre", city: "Mumbai", country: "India" },
    { name: "Bangkok Regional Hub", type: "hub", address: "Suvarnabhumi Cargo Area", city: "Bangkok", country: "Thailand" },
  ];

  const locIdMap: Record<string, number> = {};
  for (const l of locationData) {
    const result = await pool.query(
      `INSERT INTO locations (name, type, address, city, country, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id`,
      [l.name, l.type, l.address, l.city, l.country, true, now]
    );
    locIdMap[l.city] = result.rows[0].id;
    console.log(`  ✓ Seeded Location: ${l.name}`);
  }

  // Delivery service ids by name (created in step 3)
  const serviceRows = await pool.query("SELECT id, name FROM shipping_methods");
  const serviceIdMap: Record<string, number> = {};
  for (const r of serviceRows.rows) serviceIdMap[r.name] = r.id;

  interface SeedJourneyEvent {
    status: string;
    city: string;
    description: string;
    daysAgo: number;
    hoursAgo?: number;
  }

  interface SeedShipment {
    originCity: string;
    destinationCity: string;
    status: string;
    service: string;
    sender: { name: string; company: string; phone: string; email: string };
    recipient: { name: string; company: string; phone: string; email: string };
    estimatedDelivery: Date;
    pkg: {
      description: string;
      content: string;
      quantity: number;
      weight: number;
      weightUnit: string;
      length: number;
      width: number;
      height: number;
      declaredValue: number;
      referenceNumber: string;
      isFragile: boolean;
    };
    notes: string;
    journey: SeedJourneyEvent[];
  }

  const shipmentData: SeedShipment[] = [
    {

      originCity: "Amsterdam",
      destinationCity: "Singapore",
      status: "delivered",
      service: "Expedited Doorstep Air-Cargo Delivery",
      sender: { name: "Elena Rossi", company: "Velvet & Co B.V.", phone: "+31 20 555 0141", email: "elena@velvetco.nl" },
      recipient: { name: "Kenji Nakamura", company: "Summit Traders Pte Ltd", phone: "+65 6222 1840", email: "kenji@summittraders.sg" },
      estimatedDelivery: new Date(Date.now() - 1 * 86400000),
      pkg: {
        description: "Branded merchandise shipment",
        content: "2 cartons of premium apparel samples",
        quantity: 2, weight: 18.5, weightUnit: "kg", length: 60, width: 40, height: 40,
        declaredValue: 1250, referenceNumber: "INV-2026-00441", isFragile: false,
      },
      notes: "Customs cleared at Changi without inspection.",
      journey: [
        { status: "created", city: "Amsterdam", description: "Shipment created. Tracking number assigned.", daysAgo: 14 },
        { status: "pickup-scheduled", city: "Amsterdam", description: "Pickup scheduled with local courier.", daysAgo: 13 },
        { status: "picked-up", city: "Amsterdam", description: "Picked up at sender facility in Amsterdam.", daysAgo: 12 },
        { status: "in-transit", city: "Dubai", description: "Arrived at Dubai Transit Hub.", daysAgo: 10 },
        { status: "in-transit", city: "Dubai", description: "Departed from Dubai Transit Hub.", daysAgo: 9 },
        { status: "in-transit", city: "Singapore", description: "Arrived at Singapore Regional Hub. Customs clearance in progress.", daysAgo: 6 },
        { status: "out-for-delivery", city: "Singapore", description: "Out for delivery to recipient.", daysAgo: 1 },
        { status: "delivered", city: "Singapore", description: "Delivered to recipient. Signature obtained.", daysAgo: 0, hoursAgo: 4 },
      ],
    },
    {

      originCity: "Rotterdam",
      destinationCity: "Shanghai",
      status: "in-transit",
      service: "Expedited Doorstep Air-Cargo Delivery",
      sender: { name: "Jan van der Berg", company: "Portline Machinery BV", phone: "+31 10 555 0230", email: "jan@portline.nl" },
      recipient: { name: "Li Wei", company: "Huangpu Industrial Ltd", phone: "+86 21 6886 7700", email: "li.wei@huangpu.cn" },
      estimatedDelivery: new Date(Date.now() + 3 * 86400000),
      pkg: {
        description: "Industrial components",
        content: "3 crates of precision machine parts",
        quantity: 3, weight: 120, weightUnit: "kg", length: 100, width: 80, height: 60,
        declaredValue: 9800, referenceNumber: "PO-2026-1183", isFragile: true,
      },
      notes: "Fragile cargo — keep upright.",
      journey: [
        { status: "created", city: "Rotterdam", description: "Shipment created. Tracking number assigned.", daysAgo: 7 },
        { status: "picked-up", city: "Rotterdam", description: "Picked up at Rotterdam Port Depot.", daysAgo: 6 },
        { status: "in-transit", city: "Rotterdam", description: "Departed Rotterdam Port Depot.", daysAgo: 5 },
        { status: "in-transit", city: "Dubai", description: "Arrived at Dubai Transit Hub.", daysAgo: 3 },
        { status: "in-transit", city: "Dubai", description: "Departed Dubai Transit Hub.", daysAgo: 2 },
        { status: "in-transit", city: "Shanghai", description: "Arrived at Shanghai Gateway. Customs clearance in progress.", daysAgo: 0, hoursAgo: 6 },
      ],
    },
    {

      originCity: "Frankfurt",
      destinationCity: "Tokyo",
      status: "out-for-delivery",
      service: "Express Delivery (Major Cities)",
      sender: { name: "Greta Hoffman", company: "TechnicWerks GmbH", phone: "+49 69 555 0198", email: "greta@technicwerks.de" },
      recipient: { name: "Sakura Tanaka", company: "Koto Electronics KK", phone: "+81 3 3212 5566", email: "sakura@koto.co.jp" },
      estimatedDelivery: new Date(Date.now() + 1 * 86400000),
      pkg: {
        description: "Electronics prototype",
        content: "1 sealed anti-static case of circuit boards",
        quantity: 1, weight: 4.2, weightUnit: "kg", length: 45, width: 35, height: 15,
        declaredValue: 4200, referenceNumber: "RMA-2026-771", isFragile: true,
      },
      notes: "Receiver notified via SMS.",
      journey: [
        { status: "created", city: "Frankfurt", description: "Shipment created. Tracking number assigned.", daysAgo: 10 },
        { status: "pickup-scheduled", city: "Frankfurt", description: "Pickup scheduled with courier.", daysAgo: 9 },
        { status: "picked-up", city: "Frankfurt", description: "Picked up at Frankfurt Cargo Hub.", daysAgo: 9, hoursAgo: 12 },
        { status: "in-transit", city: "Frankfurt", description: "Departed Frankfurt Cargo Hub.", daysAgo: 8 },
        { status: "in-transit", city: "Dubai", description: "Arrived at Dubai Transit Hub.", daysAgo: 6 },
        { status: "in-transit", city: "Dubai", description: "Departed Dubai Transit Hub.", daysAgo: 5 },
        { status: "in-transit", city: "Tokyo", description: "Arrived at Tokyo Distribution Hub.", daysAgo: 2 },
        { status: "out-for-delivery", city: "Tokyo", description: "Out for delivery to recipient.", daysAgo: 0, hoursAgo: 3 },
      ],
    },
    {

      originCity: "London",
      destinationCity: "Mumbai",
      status: "delayed",
      service: "Expedited Doorstep Air-Cargo Delivery",
      sender: { name: "Oliver Bennett", company: "Albion Fashions UK", phone: "+44 20 7946 0812", email: "oliver@albionfashion.co.uk" },
      recipient: { name: "Priya Sharma", company: "Mumbai Retail Group", phone: "+91 22 2288 4400", email: "priya@mumbaigroup.in" },
      estimatedDelivery: new Date(Date.now() + 2 * 86400000),
      pkg: {
        description: "Fashion garments",
        content: "5 bales of knitwear samples",
        quantity: 5, weight: 42, weightUnit: "kg", length: 70, width: 55, height: 45,
        declaredValue: 3100, referenceNumber: "GB-2026-3391", isFragile: false,
      },
      notes: "Held at Dubai due to regional weather.",
      journey: [
        { status: "created", city: "London", description: "Shipment created. Tracking number assigned.", daysAgo: 5 },
        { status: "picked-up", city: "London", description: "Picked up at London Heathrow Depot.", daysAgo: 4 },
        { status: "in-transit", city: "London", description: "Departed London Heathrow Depot.", daysAgo: 3 },
        { status: "in-transit", city: "Dubai", description: "Arrived at Dubai Transit Hub.", daysAgo: 1 },
        { status: "delayed", city: "Dubai", description: "Weather delay at Dubai Transit Hub — shipment rescheduled.", daysAgo: 0, hoursAgo: 10 },
      ],
    },
  ];

  const usedTrackingNumbers = new Set<string>();
  const seededTrackingNumbers: string[] = [];

  for (const s of shipmentData) {
    const trackingNumber = randomTrackingNumber(usedTrackingNumbers);
    seededTrackingNumbers.push(trackingNumber);
    const originId = locIdMap[s.originCity];
    const destinationId = locIdMap[s.destinationCity];
    const lastEvent = s.journey[s.journey.length - 1];
    const currentLocationId = locIdMap[lastEvent.city];
    const serviceId = serviceIdMap[s.service];

    const shipmentResult = await pool.query(
      `INSERT INTO shipments (
        tracking_number, sender_name, sender_company, sender_phone, sender_email,
        recipient_name, recipient_company, recipient_phone, recipient_email,
        origin_id, destination_id, current_location_id, status, delivery_service_id,
        estimated_delivery,
        package_description, package_content, package_quantity, package_weight,
        package_weight_unit, package_length, package_width, package_height,
        package_declared_value, package_reference_number, package_is_fragile,
        notes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $28
      ) RETURNING id`,
      [
        trackingNumber,
        s.sender.name, s.sender.company, s.sender.phone, s.sender.email,
        s.recipient.name, s.recipient.company, s.recipient.phone, s.recipient.email,
        originId, destinationId, currentLocationId, s.status, serviceId,
        s.estimatedDelivery.toISOString(),
        s.pkg.description, s.pkg.content, s.pkg.quantity, s.pkg.weight,
        s.pkg.weightUnit, s.pkg.length, s.pkg.width, s.pkg.height,
        s.pkg.declaredValue, s.pkg.referenceNumber, s.pkg.isFragile,
        s.notes, daysAgo(s.journey[0].daysAgo),
      ]
    );

    const shipmentId = shipmentResult.rows[0].id;

    let order = 1;
    for (let i = 0; i < s.journey.length; i++) {
      const ev = s.journey[i];
      const description =
        i === 0 ? `Shipment created. Tracking number: ${trackingNumber}.` : ev.description;
      const eventResult = await pool.query(
        `INSERT INTO tracking_events (shipment_id, status, date_time, location_id, description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING id`,
        [
          shipmentId,
          ev.status,
          daysAgo(ev.daysAgo, ev.hoursAgo ?? 0),
          locIdMap[ev.city],
          description,
          now,
        ]
      );
      const eventId = eventResult.rows[0].id;

      await pool.query(
        `INSERT INTO shipments_rels ("order", parent_id, path, tracking_events_id)
         VALUES ($1, $2, $3, $4)`,
        [order, shipmentId, "trackingEvents", eventId]
      );
      order++;
    }

    console.log(`  ✓ Seeded Shipment: ${trackingNumber} (${s.originCity} → ${s.destinationCity}, ${s.status})`);
  }

  console.log(`\n🎉 Seed completed! Shipping & tracking platform is ready.`);
  console.log(`   Demo tracking numbers: ${seededTrackingNumbers.join(", ")}`);
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Seed failed with critical error:", err);
  await pool.end();
  process.exit(1);
});
