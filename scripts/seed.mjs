import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local") && process.loadEnvFile) process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.");

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const demoDir = path.join(process.cwd(), "public", "demo");
const files = (await readdir(demoDir)).filter((file) => file.endsWith(".webp"));
const urlMap = new Map();

for (const file of files) {
  const objectPath = `seed/${file}`;
  const body = await readFile(path.join(demoDir, file));
  const { error } = await supabase.storage.from("catalog-images").upload(objectPath, body, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw error;
  urlMap.set(`/demo/${file}`, supabase.storage.from("catalog-images").getPublicUrl(objectPath).data.publicUrl);
}

const logoFile = path.join(process.cwd(), "public", "brand", "touch-logo.png");
if (existsSync(logoFile)) {
  const { error } = await supabase.storage.from("catalog-images").upload("brand/touch-logo.png", await readFile(logoFile), {
    contentType: "image/png",
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw error;
  const logoUrl = supabase.storage.from("catalog-images").getPublicUrl("brand/touch-logo.png").data.publicUrl;
  const result = await supabase.from("activities").update({ logo_url: logoUrl }).eq("slug", "touch-furniture");
  if (result.error) throw result.error;
}

const collections = await supabase.from("collections").select("id, cover_url");
if (collections.error) throw collections.error;
for (const collection of collections.data ?? []) {
  const coverUrl = urlMap.get(collection.cover_url);
  if (coverUrl) {
    const result = await supabase.from("collections").update({ cover_url: coverUrl }).eq("id", collection.id);
    if (result.error) throw result.error;
  }
}

const rooms = await supabase.from("rooms").select("id, cover_url, gallery_urls");
if (rooms.error) throw rooms.error;
for (const room of rooms.data ?? []) {
  const coverUrl = urlMap.get(room.cover_url) ?? room.cover_url;
  const galleryUrls = (room.gallery_urls ?? []).map((item) => urlMap.get(item) ?? item);
  const result = await supabase.from("rooms").update({ cover_url: coverUrl, gallery_urls: galleryUrls }).eq("id", room.id);
  if (result.error) throw result.error;
}

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
if (adminEmail) {
  const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) throw listed.error;
  let user = listed.data.users.find((candidate) => candidate.email?.toLowerCase() === adminEmail);
  if (!user) {
    const invited = await supabase.auth.admin.inviteUserByEmail(adminEmail);
    if (invited.error) throw invited.error;
    user = invited.data.user;
  }
  const updated = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: "admin" },
  });
  if (updated.error) throw updated.error;
}

console.log(`Seeded ${files.length} demo images${adminEmail ? ` and provisioned ${adminEmail}` : ""}.`);

