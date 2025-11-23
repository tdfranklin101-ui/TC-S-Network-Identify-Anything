import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Generate object ID
    const objectId = crypto.randomUUID();

    // 2. Hash asset data if included
    let hashed = null;
    if (body.asset_base64) {
      hashed = crypto
        .createHash('sha256')
        .update(body.asset_base64)
        .digest('hex');
    }

    // 3. Build IA record
    const record = {
      object_id: objectId,
      title: body.title || "Untitled Artifact",
      description: body.description || "",
      asset_type: body.asset_type || "unknown",
      hash: hashed,
      source: body.source || "upload",
      location: body.location || null,
      tags: body.tags || [],
      power_profile: body.power_profile || 0.0,
      provenance_chain: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 4. Save to /data/identify-anything/
    const saveDir = path.join(process.cwd(), '../../data/identify-anything');
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

    const filePath = path.join(saveDir, `${objectId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2));

    // 5. Return object ID back to client
    return NextResponse.json({ success: true, object_id: objectId });

  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
