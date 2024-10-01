import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'openapi.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return new NextResponse(fileContents, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
