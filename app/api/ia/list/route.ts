import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { pgTable, text, numeric, timestamp, serial, varchar, jsonb } from "drizzle-orm/pg-core";
import ws from "ws";
import { randomUUID } from "crypto";

// Specify Node.js runtime for Vercel (required for ws package)
export const runtime = 'nodejs';

neonConfig.webSocketConstructor = ws;

const iaObjects = pgTable("ia_objects", {
  id: serial("id").primaryKey(),
  objectId: text("object_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  assetType: text("asset_type"),
  powerProfile: numeric("power_profile", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at").notNull(),
});

const marketListings = pgTable("market_listings", {
  id: serial("id").primaryKey(),
  listingId: varchar("listing_id").notNull().unique(),
  objectId: text("object_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  ownerWalletId: text("owner_wallet_id"),
  raysValue: numeric("rays_value", { precision: 20, scale: 2 }).notNull(),
  solarValue: numeric("solar_value", { precision: 20, scale: 4 }),
  powerProfile: numeric("power_profile", { precision: 10, scale: 4 }),
  assetType: text("asset_type"),
  status: text("status"),
  marketType: text("market_type"),
  priceHistory: jsonb("price_history"),
  createdAt: timestamp("created_at").notNull(),
  listedAt: timestamp("listed_at").notNull(),
});

const RAYS_PER_SOLAR = 10000;

export async function POST(req: Request) {
  const body = await req.json();
  const { objectId, title, description, power_profile, ownerWalletId } = body;

  if (!objectId || !title) {
    return new Response(JSON.stringify({ error: "objectId and title required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    const basePower = typeof power_profile === "number" ? power_profile : 0.1;
    const rays = Math.round(basePower * 1000);
    const solar = rays / RAYS_PER_SOLAR;

    const listing = {
      listingId: randomUUID(),
      objectId,
      title,
      description: description || "",
      ownerWalletId: ownerWalletId || null,
      raysValue: rays.toString(),
      solarValue: solar.toString(),
      powerProfile: basePower.toString(),
      assetType: null,
      status: "active",
      marketType: "primary",
      priceHistory: null,
      createdAt: new Date(),
      listedAt: new Date(),
    };

    const [savedListing] = await db.insert(marketListings).values(listing).returning();

    return new Response(JSON.stringify({ success: true, listing: savedListing }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await pool.end();
  }
}
