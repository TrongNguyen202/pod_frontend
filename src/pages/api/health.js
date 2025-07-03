export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    backend: {
      com: process.env.BASE_URL || 'Not configured',
      flashShip: process.env.NEXT_PUBLIC_API_FLASH_SHIP || 'Not configured',
      printCare: process.env.NEXT_PUBLIC_API_PRINT_CARE || 'Not configured',
    }
  });
}