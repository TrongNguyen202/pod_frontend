import axios from 'axios';

const BACKEND_ENDPOINTS = {
  com: process.env.NEXT_PUBLIC_BASE_URL || 'https://api.sundesign.io/api/v1',
  flashShip: process.env.NEXT_PUBLIC_API_FLASH_SHIP || 'your-flashship-url',
  printCare: process.env.NEXT_PUBLIC_API_PRINT_CARE || 'your-printcare-url',
};

const createProxyRequest = async (endpoint, path, method = 'GET', data = null, headers = {}) => {
  const baseURL = BACKEND_ENDPOINTS[endpoint];
  if (!baseURL) {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

  const fullUrl = `${baseURL}${path}`;

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: fullUrl,
      data,
      headers: {
        ...headers,
      },
      timeout: 10000,
    });
    // Trả về cả data và headers (chứa set-cookie)
    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error) {
    console.error('Proxy request failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: fullUrl,
    });
    throw error;
  }
};

export default async function handler(req, res) {
  const { slug, ...queryParams } = req.query;
  const { method } = req;

  try {
    if (!slug || slug.length === 0) {
      return res.status(400).json({ error: 'Missing endpoint and path' });
    }

    const [endpoint, ...pathParts] = slug;
    let path = '/' + pathParts.join('/');

    // Xử lý query parameters
    delete queryParams.slug;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;

    // Kiểm tra endpoint hợp lệ
    if (!BACKEND_ENDPOINTS[endpoint]) {
      console.error('Invalid endpoint:', endpoint);
      return res.status(400).json({
        error: 'Invalid endpoint',
        available: Object.keys(BACKEND_ENDPOINTS),
      });
    }

    // Forward headers từ client - THÊM COOKIE VÀO ĐÂY
    const forwardHeaders = {};
    const headersToForward = [
      'authorization',
      'x-device-id',
      'x-forwarded-for',
      'user-agent',
      'content-type',
      'cookie', // ← THÊM DÒNG NÀY
    ];

    headersToForward.forEach((headerName) => {
      const value = req.headers[headerName];
      if (value) {
        forwardHeaders[headerName] = value;
      }
    });

    console.log('📋 Forwarded headers:', forwardHeaders);

    // Gọi backend
    const result = await createProxyRequest(endpoint, fullPath, method, req.body, forwardHeaders);

    // Forward Set-Cookie headers từ backend về client
    if (result.headers && result.headers['set-cookie']) {
      res.setHeader('Set-Cookie', result.headers['set-cookie']);
    }

    res.status(result.status || 200).json(result.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Proxy request failed',
      message: error.message,
      details: error.response?.data || null,
    });
  }
}
