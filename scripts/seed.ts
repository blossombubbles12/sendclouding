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

// Simple design JSON for canvas templates that complies with the schema structures
function createDesignJSON(title: string, width: number, height: number, type: "mug" | "wall_art" | "sticker" | "bag" | "apparel") {
  const elements: Record<string, unknown>[] = [];

  // Solid background layer
  elements.push({
    id: "bg-layer-1",
    name: "Background",
    type: "background",
    x: 0,
    y: 0,
    width,
    height,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: true,
    freelyMovable: false,
    groupId: "",
    zIndex: 1,
    kind: "solid",
    fill: type === "mug" ? "#ffffff" : type === "sticker" ? "#fbfbfe" : "#f4f4f5",
    src: null,
    mediaId: null,
  });

  if (type === "mug") {
    // Left Branding / Logo placeholder
    elements.push({
      id: "mug-text-heading",
      name: "Header Text",
      type: "text",
      x: 50,
      y: 150,
      width: 700,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 2,
      text: "MY FAVORITE COFFEE CUP",
      fontFamily: "Inter",
      fontSize: 48,
      fontWeight: "bold",
      fontStyle: "normal",
      fill: "#1e293b",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 1.2,
      lineHeight: 1.2,
      rules: {
        editable: true,
        role: "editable_text",
        required: true,
        placeholder: "Enter header text here...",
        maxLength: 40,
        minLength: 1,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "contain",
        aspectRatioLocked: false,
      },
    });

    // Sub-text placeholder
    elements.push({
      id: "mug-text-sub",
      name: "Sub Message",
      type: "text",
      x: 100,
      y: 280,
      width: 600,
      height: 80,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 3,
      text: "Every day starts with coffee & design.",
      fontFamily: "Inter",
      fontSize: 28,
      fontWeight: "normal",
      fontStyle: "italic",
      fill: "#64748b",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 0.5,
      lineHeight: 1.4,
      rules: {
        editable: true,
        role: "editable_text",
        required: false,
        placeholder: "Enter secondary quote here...",
        maxLength: 60,
        minLength: 0,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "contain",
        aspectRatioLocked: false,
      },
    });

    // Custom Photo Placeholder
    elements.push({
      id: "mug-image-photo",
      name: "Personal Photo",
      type: "image",
      x: 250,
      y: 400,
      width: 300,
      height: 300,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 4,
      src: "https://images.unsplash.com/photo-1517256064527-09c53b2d0ca6?w=600&auto=format&fit=crop&q=60",
      mediaId: null,
      imageWidth: 600,
      imageHeight: 600,
      cornerRadius: 150, // Perfect circle photo frame
      crop: { x: 0, y: 0, width: 600, height: 600 },
      rules: {
        editable: true,
        role: "image_placeholder",
        required: true,
        placeholder: "Upload custom layout snapshot",
        maxLength: 0,
        minLength: 0,
        allowedFormats: ["png", "jpg", "jpeg"],
        maxFileSizeMB: 10,
        minResolution: { width: 600, height: 600 },
        cropMode: "cover",
        aspectRatioLocked: true,
      },
    });
  } else if (type === "wall_art") {
    // Custom landscape or wall canvas
    elements.push({
      id: "art-main-image",
      name: "Artistic Canvas Upload",
      type: "image",
      x: 50,
      y: 50,
      width: 700,
      height: 550,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 2,
      src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
      mediaId: null,
      imageWidth: 800,
      imageHeight: 600,
      cornerRadius: 0,
      crop: { x: 0, y: 0, width: 800, height: 600 },
      rules: {
        editable: true,
        role: "image_placeholder",
        required: true,
        placeholder: "Choose artwork image File",
        maxLength: 255,
        minLength: 1,
        allowedFormats: ["png", "jpg", "jpeg", "svg"],
        maxFileSizeMB: 25,
        minResolution: { width: 1200, height: 900 },
        cropMode: "cover",
        aspectRatioLocked: false,
      },
    });

    elements.push({
      id: "art-title",
      name: "Caption Label",
      type: "text",
      x: 100,
      y: 630,
      width: 600,
      height: 60,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 3,
      text: "NATURE ABSTRACT SERIES",
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: "bold",
      fontStyle: "normal",
      fill: "#0f172a",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 3,
      lineHeight: 1,
      rules: {
        editable: true,
        role: "editable_text",
        required: false,
        placeholder: "Type collection or year description...",
        maxLength: 50,
        minLength: 0,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "contain",
        aspectRatioLocked: false,
      },
    });
  } else if (type === "apparel") {
    // Custom T-Shirt / Hoodie Printable Section
    elements.push({
      id: "shirt-design-graphic",
      name: "Graphic Asset",
      type: "image",
      x: 200,
      y: 100,
      width: 400,
      height: 400,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 2,
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      mediaId: null,
      imageWidth: 600,
      imageHeight: 600,
      cornerRadius: 0,
      crop: { x: 0, y: 0, width: 600, height: 600 },
      rules: {
        editable: true,
        role: "image_placeholder",
        required: true,
        placeholder: "Insert graphic/logo here",
        maxLength: 0,
        minLength: 0,
        allowedFormats: ["png", "eps", "svg"],
        maxFileSizeMB: 15,
        minResolution: { width: 1000, height: 1000 },
        cropMode: "contain",
        aspectRatioLocked: true,
      },
    });

    elements.push({
      id: "shirt-text",
      name: "Squad Name",
      type: "text",
      x: 100,
      y: 530,
      width: 600,
      height: 80,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 3,
      text: "CREATIVE TEAM 2026",
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "bold",
      fontStyle: "normal",
      fill: "#ff4d4d",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 1.5,
      lineHeight: 1,
      rules: {
        editable: true,
        role: "editable_text",
        required: true,
        placeholder: "Type custom text here...",
        maxLength: 30,
        minLength: 1,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "contain",
        aspectRatioLocked: false,
      },
    });
  } else {
    // Bags, stickers, static labels
    elements.push({
      id: "label-badge",
      name: "Sticker Emblem Text",
      type: "text",
      x: 50,
      y: 350,
      width: 700,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      freelyMovable: true,
      groupId: "",
      zIndex: 2,
      text: "EXPLORE OUTDOORS",
      fontFamily: "Inter",
      fontSize: 48,
      fontWeight: "bold",
      fontStyle: "normal",
      fill: "#15803d",
      textAlign: "center",
      textDecoration: "none",
      letterSpacing: 2,
      lineHeight: 1,
      rules: {
        editable: true,
        role: "editable_text",
        required: true,
        placeholder: "Punchy sticker text label",
        maxLength: 25,
        minLength: 1,
        allowedFormats: [],
        maxFileSizeMB: 0,
        minResolution: { width: 0, height: 0 },
        cropMode: "contain",
        aspectRatioLocked: false,
      },
    });
  }

  return {
    app: "signages-templates",
    version: 1,
    title,
    width,
    height,
    unit: "px",
    dpi: 300,
    canvasColor: type === "mug" ? "#ffffff" : "#eeeeee",
    layers: elements,
  };
}

async function seed() {
  const now = new Date().toISOString();

  // 1. CLEAR PREVIOUS SEED RECORDS TO ENSURE CLEAN RETRY
  console.log("🧼 Cleaning database of previous seed data...");
  
  // Safely clean dynamically named allowed formats tables/views
  const tableCheck = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_name IN ('products_customization_upload_rules_allowed_image_formats', 'allowedImgFormats')
  `);
  for (const row of tableCheck.rows) {
    await pool.query(`DELETE FROM "${row.table_name}" CASCADE`);
  }

  await pool.query("DELETE FROM products_rels CASCADE");
  await pool.query("DELETE FROM products_tags CASCADE");
  await pool.query("DELETE FROM products_specifications CASCADE");
  await pool.query("DELETE FROM product_templates CASCADE");
  await pool.query("DELETE FROM products_images CASCADE");
  await pool.query("DELETE FROM products CASCADE");
  await pool.query("DELETE FROM categories CASCADE");
  await pool.query("DELETE FROM shipping_methods_zone_fees CASCADE");
  await pool.query("DELETE FROM shipping_methods CASCADE");
  await pool.query("DELETE FROM media CASCADE");

  console.log("♻️ Database cleared. Starting seed process...");

  // 2. SEED DEFAULT TESTING USER (IF NOT EXISTS)
  const defaultUser = await pool.query("SELECT id FROM users WHERE email = $1", ["admin@sinages.ng"]);
  let userId: number;
  if (defaultUser.rows.length === 0) {
    const userResult = await pool.query(
      `INSERT INTO users (email, hash, role, name, status, updated_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING id`,
      ["admin@sinages.ng", "$2b$10$Ukyi9yX3yXQZ.P7U.V3c.OXpGCO/O307mXoWp2K8I/j6eF3m57Hl.", "admin", "System Admin", "active", now] // bcrypt hash for 'password'
    );
    userId = userResult.rows[0].id;
    console.log("  ✓ Created Default Testing Admin: admin@sinages.ng / password");
  } else {
    userId = defaultUser.rows[0].id;
    console.log("  • Admin user exists.");
  }

  // 3. SEED CATEGORIES FOR POD DESIGN PLATFORM
  const cats = [
    { name: "Custom Mugs", slug: "custom-mugs", description: "Bespoke ceramic and sublimation mugs for personal or corporate branding.", featured: true, status: "active", sortOrder: 1 },
    { name: "Wall Canvas & Art", slug: "wall-art", description: "Premium printed wall posters, stretched canvases, and interior frames.", featured: true, status: "active", sortOrder: 2 },
    { name: "Custom Stickers", slug: "stickers-labels", description: "Precision-cut vinyl decals, labels, and water-resistant laptop stickers.", featured: true, status: "active", sortOrder: 3 },
    { name: "Custom Bags & Totes", slug: "bags-totes", description: "Eco-friendly customizable canvas tote bags and utility drawstrings.", featured: false, status: "active", sortOrder: 4 },
    { name: "Apparel & Tees", slug: "custom-apparel", description: "Comfy ringspun cotton tees, hoodies, and sweatshirts optimized for POD print.", featured: true, status: "active", sortOrder: 5 },
  ];

  const catIdMap: Record<string, number> = {};

  for (const c of cats) {
    const result = await pool.query(
      `INSERT INTO categories (name, slug, description, featured, status, sort_order, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $7) RETURNING id`,
      [c.name, c.slug, richText(c.description), c.featured, c.status, c.sortOrder, now]
    );
    catIdMap[c.slug] = result.rows[0].id;
    console.log(`  ✓ Seeded Category: ${c.name}`);
  }

  // 4. SEED STATIC IMAGES IN THE MEDIA TABLE FOR FRONTEND PREVIEWS
  const mediaData = [
    { filename: "classic-mug.png", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", alt: "Classic White Coffee Mug Mockup" },
    { filename: "wall-canvas.png", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80", alt: "Wall Art Stretched Canvas Mockup" },
    { filename: "die-cut-stickers.png", url: "https://images.unsplash.com/photo-1572375995501-4b0894dbe7d1?w=600&auto=format&fit=crop&q=80", alt: "Bespoke Vinyl Decal Stickers" },
    { filename: "canvas-tote.png", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80", alt: "Eco Tote Bag Mockup" },
    { filename: "classic-tee.png", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80", alt: "Premium Soft Cotton T-Shirt" },
  ];

  const mediaIdMap: Record<string, number> = {};

  for (const m of mediaData) {
    const result = await pool.query(
      `INSERT INTO media (filename, url, alt, created_at, updated_at, mime_type, filesize, width, height)
       VALUES ($1, $2, $3, $4, $4, 'image/png', 1048576, 800, 800) RETURNING id`,
      [m.filename, m.url, m.alt, now]
    );
    mediaIdMap[m.filename] = result.rows[0].id;
    console.log(`  ✓ Seeded Media Mockup: ${m.filename}`);
  }

  // 5. SEED PRODUCTS WITH POD CUSTOMIZATION SETTINGS
  interface ProductSeed {
    name: string;
    slug: string;
    description: string;
    price: number;
    compare_at_price: number | null;
    sku: string;
    categorySlug: string;
    filename: string;
    weight: number;
    isCustomizable: boolean;
    // Cust settings (only if isCustomizable is true)
    customType?: string;
    productionTime?: number;
    printProvider?: string;
    pWidth?: number;
    pHeight?: number;
    pUnit?: string;
    additionalPrice?: number;
    specs: { name: string; value: string }[];
    tags: string[];
  }

  const productsToSeed: ProductSeed[] = [
    {
      name: "Classic Ceramic Sublimation Mug (11oz)",
      slug: "ceramic-sublimation-mug-11oz",
      description: "Our core 11oz high-gloss ceramic mug. Engineered with premium sublimation coating (Orca Coatings) for dishwasher and microwave safe designs that last.",
      price: 2500,
      compare_at_price: 3500,
      sku: "POD-MUG-11OZ",
      categorySlug: "custom-mugs",
      filename: "classic-mug.png",
      weight: 0.35,
      isCustomizable: true,
      customType: "full_designer",
      productionTime: 2,
      printProvider: "in_house",
      pWidth: 800,
      pHeight: 800,
      pUnit: "px",
      additionalPrice: 500,
      tags: ["Ceramic", "Best Seller", "Office Gear", "Custom Mug"],
      specs: [
        { name: "Material", value: "Class-A Ceramic" },
        { name: "Coating", value: "Orca Polymer Sublimation" },
        { name: "Capacity", value: "11oz (approx. 325ml)" },
        { name: "Print Method", value: "Full-color wrap sublimation" }
      ]
    },
    {
      name: "Stretched Canvas Wall Art (40 x 40 cm)",
      slug: "stretched-canvas-wall-art-40x40",
      description: "Archival-grade cotton-blend canvas hand-wrapped around a sustained wooden gallery frame. Ready to hang, complete with satin protective varnish.",
      price: 18500,
      compare_at_price: null,
      sku: "POD-CNVS-4040",
      categorySlug: "wall-art",
      filename: "wall-canvas.png",
      weight: 1.2,
      isCustomizable: true,
      customType: "image",
      productionTime: 4,
      printProvider: "partner_a",
      pWidth: 1200,
      pHeight: 1200,
      pUnit: "px",
      additionalPrice: 1500,
      tags: ["Home Decor", "Gallery Canvas", "Framed Art"],
      specs: [
        { name: "Fabric", value: "350gsm 100% Cotton Canvas" },
        { name: "Chassis", value: "38mm kiln-dried Pine Stretcher Bars" },
        { name: "Ink Set", value: "Epson UltraChrome Pro eco-solvent colors" },
        { name: "Finish", value: "UV protection satin varnish sealer" }
      ]
    },
    {
      name: "Die-Cut Waterproof Vinyl Stickers (Pack of 20)",
      slug: "die-cut-waterproof-vinyl-stickers",
      description: "Thick, durable die-cut vinyl stickers designed to survive scratching, elements, and extreme tropical sunshine. Perfect for laptops, bottles, cars, and branding handouts.",
      price: 4500,
      compare_at_price: 6000,
      sku: "POD-STK-DIECUT",
      categorySlug: "stickers-labels",
      filename: "die-cut-stickers.png",
      weight: 0.05,
      isCustomizable: true,
      customType: "image_text",
      productionTime: 1,
      printProvider: "in_house",
      pWidth: 500,
      pHeight: 500,
      pUnit: "px",
      additionalPrice: 0,
      tags: ["Laptop Decor", "Bespoke Branding", "Weatherproof Stickers"],
      specs: [
        { name: "Material", value: "6mil Calendered High-Gloss Vinyl" },
        { name: "Adhesive", value: "Permanent room-temp pressure acrylic" },
        { name: "Waterproof", value: "Yes (submersible certified)" },
        { name: "Laminating", value: "Heavy-duty UV matte laminate overlay" }
      ]
    },
    {
      name: "100% Organic Cotton Canvas Tote Bag",
      slug: "organic-cotton-tote-bag",
      description: "Durable eco-conscious carryall tote. Stitched from sturdy heavy-duty cotton canvas, equipped with reinforced handles designed for effortless styling and durability.",
      price: 5200,
      compare_at_price: 6500,
      sku: "POD-BAG-TOTE",
      categorySlug: "bags-totes",
      filename: "canvas-tote.png",
      weight: 0.18,
      isCustomizable: true,
      customType: "full_designer",
      productionTime: 3,
      printProvider: "partner_b",
      pWidth: 800,
      pHeight: 800,
      pUnit: "px",
      additionalPrice: 400,
      tags: ["Eco-friendly", "Everyday Bags", "Tote Sublimation"],
      specs: [
        { name: "Material", value: "280gsm 100% Organic Canvas Cotton" },
        { name: "Capacity", value: "Estimated 15 liters" },
        { name: "Handle Length", value: "65cm reinforced cross-stitched" },
        { name: "Printer Process", value: "Direct-to-Garment (DTG) print tech" }
      ]
    },
    {
      name: "Premium Oversized Ringspun Tee",
      slug: "premium-oversized-ringspun-tee",
      description: "Exquisite heavy-weight oversized street tee. Formulated from premium combed ringspun cotton that creates a velvety base layer for vivid, fade-resistant printed colors.",
      price: 12000,
      compare_at_price: 15000,
      sku: "POD-TEE-RINGSPUN",
      categorySlug: "custom-apparel",
      filename: "classic-tee.png",
      weight: 0.28,
      isCustomizable: true,
      customType: "full_designer",
      productionTime: 3,
      printProvider: "in_house",
      pWidth: 1000,
      pHeight: 1000,
      pUnit: "px",
      additionalPrice: 1000,
      tags: ["Streetwear", "Comfort", "Heavy Cotton", "Teeprint"],
      specs: [
        { name: "Composition", value: "240gsm 100% Ringspun Combed Cotton" },
        { name: "Collar Stitch", value: "1.2-inch rib collar with twin needle weld" },
        { name: "Sizing Frame", value: "True Modern Boxy / Oversized fit" },
        { name: "Preshrunk", value: "Enzyme washed silicone pre-wash preset" }
      ]
    }
  ];

  const productIdMap: Record<string, number> = {};

  for (const p of productsToSeed) {
    const catId = catIdMap[p.categorySlug];
    const imageId = mediaIdMap[p.filename];

    // Insert Product
    const result = await pool.query(
      `INSERT INTO products (
        name, slug, description, price, compare_at_price, sku, featured, status, category_id,
        inventory_quantity, inventory_low_stock_threshold, inventory_track_inventory,
        weight, is_customizable,
        customization_general_settings_customization_type,
        customization_production_settings_production_time,
        customization_production_settings_design_approval_required,
        customization_production_settings_print_provider,
        customization_print_specifications_printable_area_width,
        customization_print_specifications_printable_area_height,
        customization_print_specifications_printable_area_unit,
        customization_print_specifications_minimum_image_resolution,
        customization_print_specifications_bleed_area,
        customization_print_specifications_safe_area,
        customization_upload_rules_maximum_upload_size,
        customization_upload_rules_allow_transparent_p_n_g,
        additional_customization_price,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9,
        $10, $11, $12,
        $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
        $28, $28
      ) RETURNING id`,
      [
        p.name,
        p.slug,
        richText(p.description),
        p.price,
        p.compare_at_price,
        p.sku,
        true, // featured
        "active", // status
        catId,
        1000, // inventory qty
        10, // low stock threshold
        true, // track inventory
        p.weight,
        p.isCustomizable,
        p.customType || null,
        p.productionTime || null,
        true, // designApprovalRequired
        p.printProvider || null,
        p.pWidth || null,
        p.pHeight || null,
        p.pUnit || null,
        300, // min resolution
        3, // bleed area
        5, // safe area
        25, // max upload size
        true, // allow transparent png
        p.additionalPrice || 0,
        now
      ]
    );

    const prodId = result.rows[0].id;
    productIdMap[p.slug] = prodId;

    // Connect image to product image array join-table
    await pool.query(
      `INSERT INTO products_images (_order, _parent_id, id, image_id, alt)
       VALUES ($1, $2, $3, $4, $5)`,
      [1, prodId, uid(), imageId, p.name]
    );

    // Insert Tags
    for (let i = 0; i < p.tags.length; i++) {
      await pool.query(
        `INSERT INTO products_tags (_order, _parent_id, id, tag) VALUES ($1, $2, $3, $4)`,
        [i + 1, prodId, uid(), p.tags[i]]
      );
    }

    // Insert Specifications
    for (let i = 0; i < p.specs.length; i++) {
      await pool.query(
        `INSERT INTO products_specifications (_order, _parent_id, id, name, value) VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, prodId, uid(), p.specs[i].name, p.specs[i].value]
      );
    }

    // Insert Upload Rules Allowed image formats
    const allowedFormats = ["png", "jpg", "jpeg", "svg"];
    for (let i = 0; i < allowedFormats.length; i++) {
      // Direct insertion based on whichever table payload's adapter finalized
      const activeFormatTable = tableCheck.rows.some(r => r.table_name === 'allowedImgFormats') 
        ? 'allowedImgFormats' 
        : 'products_customization_upload_rules_allowed_image_formats';

      if (activeFormatTable === 'allowedImgFormats') {
        await pool.query(
          `INSERT INTO "allowedImgFormats" ("order", parent_id, value) VALUES ($1, $2, $3)`,
          [i + 1, prodId, allowedFormats[i]]
        );
      } else {
        await pool.query(
          `INSERT INTO products_customization_upload_rules_allowed_image_formats ("order", parent_id, value)
           VALUES ($1, $2, $3)`,
          [i + 1, prodId, allowedFormats[i]]
        );
      }
    }

    console.log(`  ✓ Configured Customizable Product: ${p.name}`);
  }

  // 6. SEED BEAUTIFUL TEMPLATES FOR THESE PRODUCTS FOR QUICK CUSTOMIZATION START
  const templatesToSeed = [
    {
      title: "Elegant Monogram Template",
      slug: "elegant-monogram-mug",
      productSlug: "ceramic-sublimation-mug-11oz",
      type: "mug" as const,
      canvasW: 800,
      canvasH: 800,
    },
    {
      title: "Nature Abstract Landscape Display",
      slug: "nature-abstract-landscape",
      productSlug: "stretched-canvas-wall-art-40x40",
      type: "wall_art" as const,
      canvasW: 1200,
      canvasH: 1200,
    },
    {
      title: "Premium Tech Squad Tee Layout",
      slug: "tech-squad-tee-layout",
      productSlug: "premium-oversized-ringspun-tee",
      type: "apparel" as const,
      canvasW: 1000,
      canvasH: 1000,
    },
    {
      title: "Minimalist Coffee Tote Emblem",
      slug: "organic-coffee-tote",
      productSlug: "organic-cotton-tote-bag",
      type: "bag" as const,
      canvasW: 800,
      canvasH: 800,
    },
    {
      title: "Die-Cut Sticker Pack Layout",
      slug: "die-cut-sticker-layout",
      productSlug: "die-cut-waterproof-vinyl-stickers",
      type: "sticker" as const,
      canvasW: 600,
      canvasH: 600,
    }
  ];

  for (const t of templatesToSeed) {
    const prodId = productIdMap[t.productSlug];
    const catId = catIdMap["custom-mugs"]; // Fallback or template category
    const mockupImageId = mediaIdMap["classic-mug.png"]; // Preview placeholder

    const designJSON = createDesignJSON(t.title, t.canvasW, t.canvasH, t.type);

    // Insert template
    const templateResult = await pool.query(
      `INSERT INTO product_templates (
        title, slug, description, status, preview_image_id, thumbnail_id, linked_product_id, category_id,
        created_by_id, updated_by_id, canvas_width, canvas_height, canvas_unit, canvas_dpi,
        print_areas_printable_area_x, print_areas_printable_area_y,
        print_areas_printable_area_width, print_areas_printable_area_height,
        print_areas_bleed_area, print_areas_safe_area,
        template_data_template_version, template_data_template_j_s_o_n,
        template_data_layer_count, template_data_editable_layer_count,
        is_default, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21::jsonb, $22, $23, $24, $25, $25
      ) RETURNING id`,
      [
        t.title,
        t.slug,
        `Sample template layout designed for quick custom designs on model ${t.productSlug}`,
        "published", // status
        mockupImageId,
        mockupImageId,
        prodId,
        catId,
        userId, // created BY
        t.canvasW,
        t.canvasH,
        "px", // unit
        300,  // dpi
        0,    // x offset
        0,    // y offset
        t.canvasW, // width
        t.canvasH, // height
        3,    // bleed
        5,    // safe area
        "1.0.0",
        JSON.stringify(designJSON),
        designJSON.layers.length,
        designJSON.layers.filter((l: Record<string, unknown>) => (l.rules as Record<string, unknown>)?.editable).length,
        true, // isDefault
        now
      ]
    );

    const templateId = templateResult.rows[0].id;

    // Link template reference into products_rels so it is attached back correctly on the Product schema query
    await pool.query(
      `INSERT INTO products_rels ("order", parent_id, path, product_templates_id)
       VALUES ($1, $2, $3, $4)`,
      [1, prodId, "templates", templateId]
    );

    console.log(`  ✓ Instantiated Template: ${t.title}`);
  }

  // 7. SEED SHIPPING DETAILS FOR REALISTIC EUROPEAN LOGISTICS
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
    const zones = ["lagos", "abuja", "port-harcourt", "other-states"];
    for (let i = 0; i < zones.length; i++) {
      let zoneFee = s.fee;
      if (zones[i] === "lagos" && s.fee > 2000) zoneFee = Math.max(2000, s.fee - 1500);
      if (zones[i] === "other-states" && s.fee < 8500) zoneFee = s.fee + 2500;

      await pool.query(
        `INSERT INTO shipping_methods_zone_fees (_order, _parent_id, id, zone, fee)
         VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, parentId, uid(), zones[i], zoneFee]
      );
    }
    console.log(`  ✓ Configured Shipping Service: ${s.name}`);
  }

  console.log(`\n🎉 Seed completed! Fully populated customizable platform catalog. Ready for complete end-to-end user-flow testing!`);
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Seed failed with critical error:", err);
  await pool.end();
  process.exit(1);
});