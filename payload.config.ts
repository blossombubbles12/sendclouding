import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";
import { Posts } from "./collections/Posts";
import { Orders } from "./collections/Orders";
import { Customers } from "./collections/Customers";
import { ContactMessages } from "./collections/ContactMessages";
import { Media } from "./collections/Media";
import { ShippingMethods } from "./collections/ShippingMethods";
import { ProductTemplates } from "./collections/ProductTemplates";
import { Designs } from "./collections/Designs";
import { ProductionJobs } from "./collections/ProductionJobs";
import { SiteSettings } from "./globals/SiteSettings";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";
import { SEOSettings } from "./globals/SEOSettings";
import { PaymentSettings } from "./globals/PaymentSettings";
import { ShippingSettings } from "./globals/ShippingSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const smtpConfigured = Boolean(process.env.SMTP_HOST);

const email = smtpConfigured
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || "noreply@aquabestbrands.com",
      defaultFromName: process.env.SMTP_FROM_NAME || "AquaBest Brands",
      transportOptions: {
        host: process.env.SMTP_HOST || "",
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || "",
        },
      },
    })
  : undefined;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " - AquaBest Admin",
      description: "AquaBest Brands business management platform.",
    },
    components: {
      graphics: {
        Logo: "/components/graphics/Logo#Logo",
        Icon: "/components/graphics/Icon#Icon",
      },
      beforeNavLinks: ["/components/graphics/Nav#Nav"],
      beforeDashboard: ["/components/dashboard/BeforeDashboard#default"],
    },
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)/admin"),
    },
  },
  collections: [Users, Products, Categories, Orders, Customers, Media, ContactMessages, Posts, ShippingMethods, ProductTemplates, Designs, ProductionJobs],
  globals: [SiteSettings, Header, Footer, SEOSettings, PaymentSettings, ShippingSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  plugins: [
    vercelBlobStorage({
      // Only active when the Vercel Blob token is set (production). Falls back to
      // local file storage for environments without a token (e.g. local dev).
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      // Use server-side uploads to avoid the client-upload handler needing to be
      // registered in Payload's import map (which otherwise breaks SSR on deploy).
      clientUploads: false,
      collections: {
        // Applies to the `media` upload collection (logo, product, article images).
        // disablePayloadAccessControl stores the direct Vercel Blob CDN URL on the
        // doc instead of a relative `/api/media/file/...` proxy path — required since
        // Vercel's serverless functions are read-only and can't proxy-stream files.
        media: {
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  ...(email ? { email } : {}),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
});
