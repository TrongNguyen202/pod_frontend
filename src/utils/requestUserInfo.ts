import { NextRequest } from 'next/server';

export function extractClientInfo(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const referrer = request.headers.get('referer') || 'Direct';
  const deviceId = request.cookies.get('device_id')?.value || request.headers.get('x-device-id') || 'Unknown';

  return { ip, userAgent, referrer, deviceId };
}
