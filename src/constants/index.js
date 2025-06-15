export const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: 'tk-tk',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_PRINT_CARE: 'print-care-tk',
  TOKEN_FLASH_SHIP: 'flash-ship-tk',
  USER_NAME: 'usernamecurrent',
  USER_ID: 'uid',
  USER_ROLE: 'role',
  USER_IP: 'ipAdrress',
  USER_AGENT: 'userAgent',
  DEVICE_ID: 'deviceId',
  USER_EMAIL: 'email',
};

export const ENVIRONMENT_URL = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_TIKTOK_SHOP: process.env.NEXT_PUBLIC_API_TIKTOK_SHOP,
  LINK_STORE_CODE: process.env.NEXT_PUBLIC_LINK_STORE_CODE,
  APP_SECRET: process.env.NEXT_PUBLIC_APP_SECRET,
  GRANT_TYPE: process.env.NEXT_PUBLIC_GRANT_TYPE,
  API_GOOGLE_KEY: process.env.NEXT_PUBLIC_API_GOOGLE_KEY,
  API_GOOGLE_SHEETS: process.env.NEXT_PUBLIC_API_GOOGLE_SHEETS,
  SHEET_ID: process.env.NEXT_PUBLIC_SHEET_ID,
  DESIGN_SKU_FILES_GOOGLE_SHEET: process.env.NEXT_PUBLIC_DESIGN_SKU_FILES_GOOGLE_SHEET,
  API_FLASH_SHIP: process.env.NEXT_PUBLIC_API_FLASH_SHIP,
  TOKEN_FLASH_SHIP_EXPIRATION: 2 * 60 * 60 * 1000,
  API_PRINT_CARE: process.env.NEXT_PUBLIC_API_PRINT_CARE,
};

export const statusIdentity = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
};

export const stepIdentityStatus = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
  INITIAL_VALUE: 3,
};

export const statusProduct = {
  PROGRESSING: 0,
  VIOLATION: 1,
  APPROVED: 2,
  UNAPPROVED: 3,
  DELETED: 4,
};

export const statusProductTikTokShop = [
  { color: 'default', title: 'All', backgroundColor: '#9e9e9e', index: 0 },
  { color: 'gray', title: 'Draft', backgroundColor: '#616161', index: 1 },
  {
    color: 'processing',
    title: 'Pending',
    backgroundColor: '#2196f3',
    index: 2,
  },
  { color: 'error', title: 'Failed', backgroundColor: '#f44336', index: 3 },
  { color: 'success', title: 'Live', backgroundColor: '#4caf50', index: 4 },
  {
    color: 'warning',
    title: 'Seller Deactivated',
    backgroundColor: '#ffb300',
    index: 5,
  },
  {
    color: 'orange',
    title: 'Platform Deactivated',
    backgroundColor: '#ff9800',
    index: 6,
  },
  { color: 'default', title: 'Freeze', backgroundColor: '#9e9e9e', index: 7 },
  { color: 'red', title: 'Delete', backgroundColor: '#b71c1c', index: 8 },
];

export const statusOrder = [
  { color: 'default', value: 100, title: 'UNPAID' },
  { color: 'magenta', value: 105, title: 'ON HOLD' },
  { color: 'orange', value: 111, title: 'AWAITING SHIPMENT' },
  { color: 'cyan', value: 112, title: 'AWAITING COLLECTION' },
  { color: 'blue', value: 114, title: 'PARTIALLY SHIPPING' },
  { color: 'purple', value: 121, title: 'IN TRANSIT' },
  { color: 'gold', value: 122, title: 'DELIVERED' },
  { color: 'green', value: 130, title: 'COMPLETED' },
  { color: 'red', value: 140, title: 'CANCELLED' },
];

export const statusOrderNew = [
  { color: 'error', value: 'UNPAID', title: 'UNPAID' },
  { color: 'default', value: 'ON_HOLD', title: 'ON HOLD' },
  {
    color: 'warning',
    value: 'AWAITING_SHIPMENT',
    title: 'AWAITING SHIPMENT',
  },
  { color: 'primary', value: 'AWAITING_COLLECTION', title: 'AWAITING COLLECTION' },
  { color: 'secondary', value: 'IN_TRANSIT', title: 'IN TRANSIT' },
  { color: 'info', value: 'DELIVERED', title: 'DELIVERED' },
  { color: 'success', value: 'COMPLETED', title: 'COMPLETED' },
  { color: 'error', value: 'CANCELLED', title: 'CANCELLED' },
];

export const variationsOption = [
  { value: '100000', label: 'Color' },
  // { value: '100007', label: 'Size' },
  { value: '7322572932260136746', label: 'Size' },
];

export const OrderPackageWeightSize = [
  {
    name: 'shirt',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.3', size: '9x9x2' },
      { name: 'L', weight: '0.3', size: '9x9x2' },
      { name: 'XL', weight: '0.3', size: '9x9x2' },
      { name: '2XL', weight: '0.3', size: '9x9x2' },
      { name: '3XL', weight: '0.3', size: '9x9x2' },
    ],
  },
  {
    name: 'Sweatshirt',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.3', size: '9x9x2' },
      { name: 'L', weight: '0.3', size: '9x9x2' },
      { name: 'XL', weight: '0.3', size: '10x10x3' },
      { name: '2XL', weight: '0.3', size: '10x10x3' },
      { name: '3XL', weight: '0.3', size: '10x10x3' },
    ],
  },
  {
    name: 'Hoodie',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.3', size: '9x9x2' },
      { name: 'L', weight: '0.3', size: '9x9x2' },
      { name: 'XL', weight: '0.3', size: '9x9x2' },
      { name: '2XL', weight: '0.3', size: '9x9x2' },
      { name: '3XL', weight: '0.3', size: '9x9x2' },
    ],
  },
  {
    name: 'loại 1',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.3', size: '9x9x2' },
      { name: 'L', weight: '0.3', size: '9x9x2' },
      { name: 'XL', weight: '0.3', size: '9x9x2' },
      { name: '2XL', weight: '0.3', size: '9x9x2' },
      { name: '3XL', weight: '0.3', size: '9x9x2' },
    ],
  },
];

export const permission = {
  ADMIN: 0, // Admin
  CUSTOMER: 1, // Customer
  DESIGNER: 2, // Designer
};

export const design_types = {
  CLONE: 'CLONE',
  RE_DESIGN: 'RE_DESIGN',
  NEW: 'NEW',
};

export const senPrintsData = [
  {
    product_sku: 'AMST',
    colors:
      'ash, black, charcoal, dark heather, forest green, heliconia, maroon, orange, purple, safety pink, white, light blue, red, yellow haze, dark chocolate, irish green, navy, royal, cardinal red, gravel, azalea, brown savana, carolina, indigo blue, kiwi, light pink, lime, sapphire, sky, violet, sport grey, daisy, tropical blue, gold, sand, military green',
    campaign_desc: `Preshrunk t-shirt in 100% cotton.
    Sport Grey:  90% US Cotton / 10% Polyester
    Dark Heather: 50% US Cotton / 50% Polyester
    Seamless twin needle 7/8" collar.
    Taped neck and shoulders. Rolled forward shoulders for better fit.
    Twin needle sleeve and bottom hems. Quarter-turned to eliminate centre crease.`,
    price: '32.84',
  },
  {
    product_sku: 'AUSH',
    colors:
      'white, black, sport grey, navy, red, royal, military green, light blue, charcoal, irish green, purple, forest green, ash, light pink, gold, orange, maroon, sand, dark heather',
    campaign_desc: `50% Cotton / 50% Polyester
    Preshrunk fleece knit
    Double-lined hood with colour-matched drawcord
    Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
    Pouch pocket
    1 x 1 rib with spandex
    Air jet yarns = softer feel and reduced pilling
    Tear away label`,
    price: '65.70',
  },
  {
    product_sku: 'AUSS',
    colors:
      'white, black, sport grey, navy, red, royal, irish green, forest green, light blue, purple, dark heather, orange, ash, light pink, sand, maroon, military green',
    campaign_desc: `1x1 rib with spandex
    Air jet yarn for softer feel and reduced pilling
    Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
    Fiber content varies by color, see color list for exceptions
    Preshrunk fleece knit
    Tear away label`,
    price: '57.13',
  },
  {
    product_sku: 'AMVT',
    colors:
      'white, black, sport grey, navy, red, royal, charcoal, irish green, heather irish green, purple, heather purple, dark heather',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring Spun Cotton
    In transition to 100% Combed Ring Spun Cotton
    Eurofit - sleeker fit in shoulder and sleeve
    Semi-fitted
    High stitch density for smoother printing surface
    1.6 cm mitered v-neck collar
    Taped neck and shoulders
    Tearaway label
    Rolled forward shoulder
    Twin needle sleeve and bottom hems
    Quarter-turned to eliminate center crease
    `,
    price: '41.41',
  },
  {
    product_sku: 'AWVT',
    colors: 'white, black, sport grey, navy, red, royal, irish green, purple, heather purple, azalea, dark heather',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring Spun Cotton
    In transition to 100% Combed Ring Spun Cotton
    Fitted silhouette with side seam
    High stitch density for smoother printing surface
    1/2"" mitered v-neck collar
    Taped neck and shoulders
    Tearaway label
    Twin needle sleeve and bottom hems
    `,
    price: '41.41',
  },
  {
    product_sku: 'AMLST',
    colors:
      'white, black, sport grey, red, royal, navy, carolina, light blue, light pink, irish green, forest green, purple, gold, dark heather, orange',
    campaign_desc: `Classic midweight fabric
    Double-needle bottom hem
    Fiber content varies by color, see color list for exceptions
    Rib cuffs
    Seamless double-needle 7/8"" collar
    Taped neck and shoulders
    Tear away label
    `,
    price: '47.13',
  },
  {
    product_sku: 'AWLST',
    colors: 'white, black, sport grey, navy, azalea',
    campaign_desc: `5 oz/yd² | 100% Polyester
    Performance, 100% spun polyester styles, are the ideal choice for sublimating.
    These styles offer moisture wicking, odor control and snag-resistance properties with a soft hand of cotton, making them an athleisure staple
    Single-needle topstitched, classic width collar
    Taped neck and shoulders for comfort and durability
    Modern classic fit, side seamed body
    High-performing tear-away label; transitioning to recycled material
    `,
    price: '47.13',
  },
  {
    product_sku: 'AMTT',
    colors: 'white, black, sport grey, red, royal, purple, forest green, orange',
    campaign_desc: `Preshrunk jersey knit
    Bound neck and armholes
    Sideseamed
    Double-needle bottom hem
    Classic midweight fabric
    Tear away label    
    `,
    price: '41.41',
  },
  {
    product_sku: 'AWTT',
    colors: 'white, black, sport grey, navy, red',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring-Spun Cotton
    Fitted silhouette with side seam
    High stitch density for smoother printing surface
    1 1/2"" straps for S - L // 1 3/4"" straps for XL & 2XL
    Rib knit trim applied to neckline and armholes
    Tearaway label
    Twin needle bottom hem
    `,
    price: '41.41',
  },
  {
    product_sku: 'AYST',
    colors:
      'white, black, sport grey, navy, royal, red, purple, light blue, light pink, irish green, forest green, dark chocolate',
    campaign_desc: `100% Cotton
    Seamless twin needle 3/4"" collar
    Taped neck and shoulders
    Tearaway label
    Twin needle sleeve and bottom hems
    Quarter-turned to eliminate center crease
    CPSIA Tracking Label Compliant
    `,
    price: '35.70',
  },
  {
    product_sku: 'AKSSW',
    colors: 'white, black, sport grey, royal, navy, red, dark heather, maroon, forest green, light blue',
    campaign_desc: `Spun yarn for softer feel and reduced pilling
    Classic fit tubular body 
    Double-needle stitching at shoulders, armholes, neck, waistband and cuffs
    Grey pearlized tear away label
    1x1 rib with spandex for enhanced stretch and recovery
    100% of our fabric cutting scraps are recycled into fiber and used in new products
    33% of the energy used to manufacture our products comes from renewable resources
    `,
    price: '51.41',
  },
  {
    product_sku: 'AYPH',
    colors:
      'white, black, sport grey, navy, royal, red, kelly green, gold, light blue, carolina, irish green, charcoal, purple, light pink, orange, forest green, dark heather',
    campaign_desc: `Preshrunk fleece knit
    Double-lined hood
    Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
    Pouch pocket
    1 x 1 rib with spandex
    Air jet yarns = softer feel and reduced pilling
    Tear away label
    CPSIA Tracking Label Compliant
    `,
    price: '58.56',
  },
  {
    product_sku: 'LAT3321',
    colors:
      'black, butter, kelly green, key lime, light blue, orange, pink, raspberry, red, white, royal, sport grey, navy',
    campaign_desc: `Rabbit Skins® Toddler 100% Combed Ringspun Cotton Fine Jersey Crew Neck Short Sleeve Tee

    Classic comfort meets color with these soft crew neck t-shirts for toddlers. Whether layered or alone, this t-shirt is soft, yet durable enough to stand up to your toddler's playtime demands.
    
    Fabrication: 4.5 oz. 100% combed ringspun cotton fine jersey • Ash is 99/1; CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • Ash and White are sewn with 100% cotton thread
    
    Features: Topstitched ribbed collar • Shoulder-to-shoulder self-fabric back neck tape • Double needle sleeves and bottom hem • Side seam construction • EasyTear™ label
    
    Safety: CPSIA compliant tracking label in side seam
    
    Care: Machine wash • Tumble dry low
    `,
    price: '38.56',
  },
  {
    product_sku: 'LAT4400',
    colors:
      'banana, black, charcoal, sport grey, kelly green, navy, pink, purple, red, royal, turquoise, white, yellow',
    campaign_desc: `Rabbit Skins® Infant 100% Combed Ringspun Cotton 1x1 Baby Rib Lap Shoulder Short Sleeve Bodysuit

    An ideal gift for any new parent who will want one in every color. These one-piece plain bodysuits feature lap shoulders to make it easier for the many times a day that parents have to change baby's outfit.
    
    Fabrication: 5.0 oz. 100% combed ringspun cotton 1x1 baby rib • CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • White is sewn with 100% cotton thread
    
    Features: Flatlock stitched seams • Double needle ribbed binding on lap shoulder neck, shoulders, sleeves and leg opening • Innovative three snap closure • Side seam construction • EasyTear™ label
    
    Safety: CPSIA compliant tracking label in side seam
    
    Care: Machine wash • Tumble dry low
    `,
    price: '41.41',
  },
];

export const senPrintsHawaiiData = {
  campaign_desc:
    'Men’s digital printed short-sleeved shirt, bright colors, digital printing, never fade, suitable for a variety of occasions, vacation, travel, family and so on. High quality, can be matched with a variety of clothes. Bring cool for you in this summer. Product can be hand washable and machine washable Water temperature does not exceed 40°C or 104°F CHOOSE YOUR SIZE CAREFULLY BEFORE YOU MADE AN ORDER CAUSE WE DO NOT ACCEPT CANCEL OR REFUND DUE TO WRONG SIZE ORDER. THANK YOU FOR UNDERSTANDING!!',
  product_sku: 'AOHWS2',
};

export const senPrintsData3D = [
  {
    product_sku: 'AOTEE2',
    campaign_desc: `– All Over Printed design is made with high-quality, 90% spun polyester, 5% spandex, 5% cotton that delivers the look and feels of organic cotton without ever cracking, peeling or flaking. Most of the back of each design is the same as the front, so passerby will be able to accurately double take your awesome product and confirm their jealousy of you. It stays wrinkle free and soft to the hand forever, able to withstand summer festivals, late nights and world domination with style and grace. Please kindly click "size chart" to view size charts for these designs.
    – Part-printed designs are made of high-quality cotton. Please check the size chart at the product photo show.`,
    price: '29.99',
  },
  {
    product_sku: 'AOPSSPO2',
    campaign_desc: `– All Over Printed design is made with high-quality, 90% spun polyester, 5% spandex, 5% cotton that delivers the look and feels of organic cotton without ever cracking, peeling or flaking. Most of the back of each design is the same as the front, so passerby will be able to accurately double take your awesome product and confirm their jealousy of you. It stays wrinkle free and soft to the hand forever, able to withstand summer festivals, late nights and world domination with style and grace. Please kindly click "size chart" to view size charts for these designs.
    – Part-printed designs are made of high-quality cotton. Please check the size chart at the product photo show.`,
    price: '39.99',
  },
  {
    product_sku: 'AOSHO2',
    campaign_desc: `– All Over Printed design is made with high-quality, 90% spun polyester, 5% spandex, 5% cotton that delivers the look and feels of organic cotton without ever cracking, peeling or flaking. Most of the back of each design is the same as the front, so passerby will be able to accurately double take your awesome product and confirm their jealousy of you. It stays wrinkle free and soft to the hand forever, able to withstand summer festivals, late nights and world domination with style and grace. Please kindly click "size chart" to view size charts for these designs.
    – Part-printed designs are made of high-quality cotton. Please check the size chart at the product photo show.`,
    price: '39.99',
  },
  {
    product_sku: 'AOZHOOD2',
    campaign_desc: `– All Over Printed design is made with high-quality, 90% spun polyester, 5% spandex, 5% cotton that delivers the look and feels of organic cotton without ever cracking, peeling or flaking. Most of the back of each design is the same as the front, so passerby will be able to accurately double take your awesome product and confirm their jealousy of you. It stays wrinkle free and soft to the hand forever, able to withstand summer festivals, late nights and world domination with style and grace. Please kindly click "size chart" to view size charts for these designs.
    – Part-printed designs are made of high-quality cotton. Please check the size chart at the product photo show.`,
    price: '53.99',
  },
  {
    product_sku: 'AOUSS2',
    campaign_desc: `– All Over Printed design is made with high-quality, 90% spun polyester, 5% spandex, 5% cotton that delivers the look and feels of organic cotton without ever cracking, peeling or flaking. Most of the back of each design is the same as the front, so passerby will be able to accurately double take your awesome product and confirm their jealousy of you. It stays wrinkle free and soft to the hand forever, able to withstand summer festivals, late nights and world domination with style and grace. Please kindly click "size chart" to view size charts for these designs.
    – Part-printed designs are made of high-quality cotton. Please check the size chart at the product photo show.`,
    price: '54.99',
  },
];

export const statusPayment = [
  { color: 'success', value: 'PAID', title: 'PAID' },
  {
    color: 'info',
    value: 'PROCESSING',
    title: 'PROCESSING',
  },
  { color: 'error', value: 'FAILED', title: 'FAILED' },
];

export const fullUserRole = [permission.ADMIN, permission.MANAGER];
