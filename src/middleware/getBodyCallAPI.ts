import { NextRequest, NextResponse } from 'next/server';
import { extractClientInfo } from 'src/utils/requestUserInfo';

export function middleware(request: NextRequest) {
  const info = extractClientInfo(request);

  const response = NextResponse.next();

  // Add custom headers
  response.headers.set('x-user-ip', info.ip);
  response.headers.set('x-device-id', info.deviceId);
  response.headers.set('x-user-agent', info.userAgent);

  return response;
}
