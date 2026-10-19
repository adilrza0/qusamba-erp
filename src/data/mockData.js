// Standard Indian Bangle Sizing constants
export const BANGLE_SIZES = ['2-2', '2-4', '2-6', '2-8', '2-10', '2-12'];

export const BANGLE_MATERIALS = ['Glass', 'Velvet', 'Silk Thread', 'Lac', 'Metal / Brass'];

export const RAW_MATERIAL_UNITS = ['Kg', 'Gross (144 pcs)', 'Boxes', 'Spools', 'Packets', 'Meters'];

export const INITIAL_COMPANY_PROFILE = {
  name: 'Qusamba Creations',
  tradeName: 'Qusamba Bangles & Ornaments Mfg.',
  tagline: 'Artisanal Handcrafted Bangle Manufacturing & Wholesale',
  address: 'Plot No. 42-45, Karigar Industrial Area, Near Johari Market',
  city: 'Jaipur',
  state: 'Rajasthan',
  stateCode: '08',
  pincode: '302003',
  gstin: '08AAACQ9876K1Z3',
  pan: 'AAACQ9876K',
  phone: '+91 98290 12345',
  email: 'wholesale@qusambacreations.com',
  website: 'www.qusambacreations.com',
  bankName: 'HDFC Bank Ltd',
  bankBranch: 'Johari Bazaar Branch, Jaipur',
  accountNumber: '50200088991122',
  ifsc: 'HDFC0001234',
  upiId: 'qusamba@hdfcbank',
  defaultGstRate: 3, // 3% standard for imitation jewellery / bangles
  terms: [
    '1. Goods once sold will not be taken back or exchanged.',
    '2. Interest @18% p.a. will be charged if payment is not cleared within agreed credit period.',
    '3. Subject to Jaipur jurisdiction only.',
    '4. Breakage during transit is at the buyer’s risk unless transit insurance is opted.'
  ]
};

export const INITIAL_FINISHED_GOODS = [
  {
    id: 'FG-101',
    sku: 'QS-KUN-01',
    name: 'Royal Kundan Glass Kada Set',
    material: 'Glass',
    category: 'Bridal Kada',
    hsn: '70181010',
    dzPerBox: 4, // 4 dozens per wholesale box
    costPerDz: 210,
    wholesaleRatePerDz: 340,
    minStockAlertDz: 40,
    sizesStockDz: {
      '2-2': 12,
      '2-4': 45,
      '2-6': 80,
      '2-8': 75,
      '2-10': 30,
      '2-12': 8
    },
    description: 'Firozabad gold foil cut-glass with hand-studded kundan stones and velvet lining.'
  },
  {
    id: 'FG-102',
    sku: 'QS-VEL-02',
    name: 'Burgundy Velvet Matte Chuda Bangles',
    material: 'Velvet',
    category: 'Daily / Bridal',
    hsn: '71179090',
    dzPerBox: 6,
    costPerDz: 110,
    wholesaleRatePerDz: 185,
    minStockAlertDz: 50,
    sizesStockDz: {
      '2-2': 18,
      '2-4': 60,
      '2-6': 110,
      '2-8': 95,
      '2-10': 35,
      '2-12': 14
    },
    description: 'Plush velvet wrapped on metal core with micro-gold dust borders.'
  },
  {
    id: 'FG-103',
    sku: 'QS-SLK-03',
    name: 'Mulberry Silk Thread Designer Bangles',
    material: 'Silk Thread',
    category: 'Festive / Wedding',
    hsn: '71179090',
    dzPerBox: 4,
    costPerDz: 160,
    wholesaleRatePerDz: 275,
    minStockAlertDz: 30,
    sizesStockDz: {
      '2-2': 8,
      '2-4': 25,
      '2-6': 55,
      '2-8': 48,
      '2-10': 18,
      '2-12': 5
    },
    description: 'Hand-wound pure mulberry silk thread with pearl ball chain & rhinestone rims.'
  },
  {
    id: 'FG-104',
    sku: 'QS-LAC-04',
    name: 'Jaipuri Handcrafted Lac Studded Kada',
    material: 'Lac',
    category: 'Traditional',
    hsn: '96020000',
    dzPerBox: 2,
    costPerDz: 280,
    wholesaleRatePerDz: 460,
    minStockAlertDz: 25,
    sizesStockDz: {
      '2-2': 5,
      '2-4': 18,
      '2-6': 38,
      '2-8': 32,
      '2-10': 12,
      '2-12': 4
    },
    description: 'Authentic Rajasthani purified lac resin with mirror glass chips & brass studs.'
  },
  {
    id: 'FG-105',
    sku: 'QS-BRS-05',
    name: 'Brass Micro-Gold Matte Openable Kada',
    material: 'Metal / Brass',
    category: 'Heavy Kada',
    hsn: '71179090',
    dzPerBox: 2,
    costPerDz: 390,
    wholesaleRatePerDz: 620,
    minStockAlertDz: 20,
    sizesStockDz: {
      '2-2': 4,
      '2-4': 14,
      '2-6': 30,
      '2-8': 26,
      '2-10': 10,
      '2-12': 2
    },
    description: 'Solid brass base with 1-micron matte gold electroplating and screw clasp.'
  },
  {
    id: 'FG-106',
    sku: 'QS-GLS-06',
    name: 'Firozabad Metallic Mirror Plain Glass Bangles',
    material: 'Glass',
    category: 'Daily Wear',
    hsn: '70181010',
    dzPerBox: 12,
    costPerDz: 38,
    wholesaleRatePerDz: 68,
    minStockAlertDz: 120,
    sizesStockDz: {
      '2-2': 25,
      '2-4': 140,
      '2-6': 220,
      '2-8': 195,
      '2-10': 85,
      '2-12': 30
    },
    description: 'High-clarity oven-baked metallic luster glass bangles in ruby, emerald & sapphire.'
  },
  {
    id: 'FG-107',
    sku: 'QS-VEL-07',
    name: 'Emerald Green Velvet Bridal Set',
    material: 'Velvet',
    category: 'Bridal Set',
    hsn: '71179090',
    dzPerBox: 4,
    costPerDz: 145,
    wholesaleRatePerDz: 240,
    minStockAlertDz: 35,
    sizesStockDz: {
      '2-2': 6,
      '2-4': 12,
      '2-6': 15, // Low stock on 2-6
      '2-8': 10,
      '2-10': 5,
      '2-12': 0 // Depleted
    },
    description: 'Deep royal emerald velvet wrapped with gold lace stringing and latkan loops.'
  }
];

export const INITIAL_RAW_MATERIALS = [
  {
    id: 'RM-201',
    name: 'Firozabad High-Grade Glass Shells (Cullet)',
    category: 'Glass Base',
    stockQty: 850,
    unit: 'Kg',
    unitCost: 65,
    minStockAlert: 300,
    supplier: 'Firozabad Silica Furnaces Ltd'
  },
  {
    id: 'RM-202',
    name: 'Brass Core Rings (Stamping Blanks)',
    category: 'Metal Core',
    stockQty: 48,
    unit: 'Gross (144 pcs)',
    unitCost: 320,
    minStockAlert: 20,
    supplier: 'Moradabad Metal Crafts'
  },
  {
    id: 'RM-203',
    name: 'Mulberry Silk Thread Spools (Multicolor)',
    category: 'Thread',
    stockQty: 420,
    unit: 'Spools',
    unitCost: 45,
    minStockAlert: 100,
    supplier: 'Surat Silk Syndicate'
  },
  {
    id: 'RM-204',
    name: 'Pure Rajasthani Lac Resin Slabs',
    category: 'Resin',
    stockQty: 65, // Below alert
    unit: 'Kg',
    unitCost: 280,
    minStockAlert: 90,
    supplier: 'Jaipur Lac Suppliers Co.'
  },
  {
    id: 'RM-205',
    name: 'Premium Velvet Wholesale Inner Boxes (4-Dz)',
    category: 'Packaging',
    stockQty: 320,
    unit: 'Boxes',
    unitCost: 18,
    minStockAlert: 150,
    supplier: 'Agra Box & Packaging'
  },
  {
    id: 'RM-206',
    name: 'Zircon Kundan Stones & Foil Leaves',
    category: 'Stones',
    stockQty: 24, // Low stock
    unit: 'Packets',
    unitCost: 450,
    minStockAlert: 30,
    supplier: 'Gems & Stones India'
  },
  {
    id: 'RM-207',
    name: 'Heavy Corrugated Master Dispatch Cartons',
    category: 'Packaging',
    stockQty: 180,
    unit: 'Boxes',
    unitCost: 38,
    minStockAlert: 50,
    supplier: 'Agra Box & Packaging'
  }
];

export const INITIAL_BUYERS = [
  {
    id: 'BY-301',
    name: 'Surat Bangle House',
    contactPerson: 'Kiritbhai Shah',
    phone: '+91 98251 44556',
    email: 'suratbanglehouse@gmail.com',
    city: 'Surat',
    state: 'Gujarat',
    stateCode: '24',
    address: 'Shop 104, Bangle Market, Bhagal Road',
    gstin: '24AAACS1122D1Z9',
    creditLimit: 500000,
    paymentTermsDays: 45,
    totalPurchases: 642000,
    totalPaid: 480000,
    outstandingBalance: 162000,
    overdueDays: 12
  },
  {
    id: 'BY-302',
    name: 'Chandni Chowk Ornaments',
    contactPerson: 'Manoj Kumar Gupta',
    phone: '+91 98112 33445',
    email: 'manoj.gupta@ccornaments.com',
    city: 'Delhi',
    state: 'Delhi',
    stateCode: '07',
    address: '245, Dariba Kalan, Chandni Chowk',
    gstin: '07AABCC3344E1Z2',
    creditLimit: 600000,
    paymentTermsDays: 30,
    totalPurchases: 890000,
    totalPaid: 760000,
    outstandingBalance: 130000,
    overdueDays: 0
  },
  {
    id: 'BY-303',
    name: 'Lad Bazaar Bridal Hub',
    contactPerson: 'Mirza Baig',
    phone: '+91 98490 88776',
    email: 'bridalhub.hyd@gmail.com',
    city: 'Hyderabad',
    state: 'Telangana',
    stateCode: '36',
    address: 'Near Charminar, Lad Bazaar',
    gstin: '36AADCL5566F1Z5',
    creditLimit: 750000,
    paymentTermsDays: 60,
    totalPurchases: 1120000,
    totalPaid: 870000,
    outstandingBalance: 250000,
    overdueDays: 24
  },
  {
    id: 'BY-304',
    name: 'Jaipur Bridal Ornaments',
    contactPerson: 'Sanjay Soni',
    phone: '+91 94140 22334',
    email: 'jaipurbridal@gmail.com',
    city: 'Jaipur',
    state: 'Rajasthan',
    stateCode: '08', // Intra-state (CGST + SGST)
    address: 'Ghee Walo Ka Rasta, Johari Bazaar',
    gstin: '08AAACJ7788G1Z8',
    creditLimit: 400000,
    paymentTermsDays: 30,
    totalPurchases: 450000,
    totalPaid: 450000,
    outstandingBalance: 0,
    overdueDays: 0
  },
  {
    id: 'BY-305',
    name: 'Burrabazar Craft Traders',
    contactPerson: 'Subhashish Dey',
    phone: '+91 98300 77889',
    email: 'burrabazar.traders@yahoo.co.in',
    city: 'Kolkata',
    state: 'West Bengal',
    stateCode: '19',
    address: '14, Canning Street, Burrabazar',
    gstin: '19AAEFB9900H1Z1',
    creditLimit: 350000,
    paymentTermsDays: 45,
    totalPurchases: 380000,
    totalPaid: 290000,
    outstandingBalance: 90000,
    overdueDays: 5
  }
];

export const INITIAL_KARIGARS = [
  {
    id: 'KG-401',
    name: 'Ramji Lal',
    craft: 'Velvet Winding & Base Bonding',
    phone: '+91 97820 11223',
    village: 'Sanganer Workshop',
    ratePerDz: 18, // ₹18 per dozen
    totalDozensProduced: 1900,
    totalEarned: 34200,
    totalAdvances: 12000,
    netPayable: 22200,
    activeOrder: 'Velvet Matte Bangles 4-Dz batch'
  },
  {
    id: 'KG-402',
    name: 'Irfan Bhai',
    craft: 'Glass Jointing & Annealing',
    phone: '+91 94560 33445',
    village: 'Firozabad Unit-2',
    ratePerDz: 14,
    totalDozensProduced: 2000,
    totalEarned: 28000,
    totalAdvances: 8500,
    netPayable: 19500,
    activeOrder: 'Firozabad Metallic Mirror Glass'
  },
  {
    id: 'KG-403',
    name: 'Meena Devi & Group',
    craft: 'Kundan & Zircon Stone Setting',
    phone: '+91 96100 44556',
    village: 'Amer Craft Cluster',
    ratePerDz: 40,
    totalDozensProduced: 1200,
    totalEarned: 48000,
    totalAdvances: 15000,
    netPayable: 33000,
    activeOrder: 'Royal Kundan Glass Kada'
  },
  {
    id: 'KG-404',
    name: 'Salim Khan',
    craft: 'Silk Thread Weaving & Pearl Stringing',
    phone: '+91 98288 55667',
    village: 'Bapu Nagar Artisan Hub',
    ratePerDz: 32,
    totalDozensProduced: 1230,
    totalEarned: 39360,
    totalAdvances: 9000,
    netPayable: 30360,
    activeOrder: 'Mulberry Silk Thread Designer'
  },
  {
    id: 'KG-405',
    name: 'Brijesh Verma',
    craft: 'Rajasthani Lac Engraving & Molding',
    phone: '+91 94142 66778',
    village: 'Tripolia Bazaar Guild',
    ratePerDz: 28,
    totalDozensProduced: 1500,
    totalEarned: 42000,
    totalAdvances: 14000,
    netPayable: 28000,
    activeOrder: 'Jaipuri Handcrafted Lac Kada'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'QS/26-27/001',
    date: '2026-09-28',
    dueDate: '2026-10-28',
    buyerId: 'BY-301',
    buyerName: 'Surat Bangle House',
    buyerGstin: '24AAACS1122D1Z9',
    buyerAddress: 'Shop 104, Bangle Market, Bhagal Road, Surat, Gujarat',
    buyerState: 'Gujarat',
    buyerStateCode: '24',
    isInterstate: true, // Rajasthan (08) -> Gujarat (24) => IGST
    gstRate: 3,
    items: [
      {
        itemId: 'FG-101',
        itemName: 'Royal Kundan Glass Kada Set',
        hsn: '70181010',
        sizes: { '2-4': 20, '2-6': 30, '2-8': 30, '2-10': 10 },
        totalDozens: 90,
        boxes: 22.5,
        ratePerDz: 340,
        amount: 30600
      },
      {
        itemId: 'FG-102',
        itemName: 'Burgundy Velvet Matte Chuda Bangles',
        hsn: '71179090',
        sizes: { '2-4': 40, '2-6': 60, '2-8': 60, '2-10': 20 },
        totalDozens: 180,
        boxes: 30,
        ratePerDz: 185,
        amount: 33300
      }
    ],
    subtotal: 63900,
    discountPercent: 2,
    discountAmount: 1278,
    taxableAmount: 62622,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 1878.66,
    totalTax: 1878.66,
    grandTotal: 64501,
    status: 'Partial',
    amountPaid: 35000,
    balanceDue: 29501,
    paymentTerms: 'Credit 30 Days'
  },
  {
    id: 'INV-2026-002',
    invoiceNumber: 'QS/26-27/002',
    date: '2026-10-02',
    dueDate: '2026-11-02',
    buyerId: 'BY-304',
    buyerName: 'Jaipur Bridal Ornaments',
    buyerGstin: '08AAACJ7788G1Z8',
    buyerAddress: 'Ghee Walo Ka Rasta, Johari Bazaar, Jaipur, Rajasthan',
    buyerState: 'Rajasthan',
    buyerStateCode: '08',
    isInterstate: false, // Intra-state => CGST 1.5% + SGST 1.5%
    gstRate: 3,
    items: [
      {
        itemId: 'FG-104',
        itemName: 'Jaipuri Handcrafted Lac Studded Kada',
        hsn: '96020000',
        sizes: { '2-4': 10, '2-6': 20, '2-8': 20 },
        totalDozens: 50,
        boxes: 25,
        ratePerDz: 460,
        amount: 23000
      },
      {
        itemId: 'FG-105',
        itemName: 'Brass Micro-Gold Matte Openable Kada',
        hsn: '71179090',
        sizes: { '2-4': 10, '2-6': 15, '2-8': 15 },
        totalDozens: 40,
        boxes: 20,
        ratePerDz: 620,
        amount: 24800
      }
    ],
    subtotal: 47800,
    discountPercent: 0,
    discountAmount: 0,
    taxableAmount: 47800,
    cgstAmount: 717,
    sgstAmount: 717,
    igstAmount: 0,
    totalTax: 1434,
    grandTotal: 49234,
    status: 'Paid',
    amountPaid: 49234,
    balanceDue: 0,
    paymentTerms: 'Immediate UPI'
  },
  {
    id: 'INV-2026-003',
    invoiceNumber: 'QS/26-27/003',
    date: '2026-10-08',
    dueDate: '2026-12-08',
    buyerId: 'BY-303',
    buyerName: 'Lad Bazaar Bridal Hub',
    buyerGstin: '36AADCL5566F1Z5',
    buyerAddress: 'Near Charminar, Lad Bazaar, Hyderabad, Telangana',
    buyerState: 'Telangana',
    buyerStateCode: '36',
    isInterstate: true,
    gstRate: 3,
    items: [
      {
        itemId: 'FG-101',
        itemName: 'Royal Kundan Glass Kada Set',
        hsn: '70181010',
        sizes: { '2-2': 10, '2-4': 30, '2-6': 50, '2-8': 50, '2-10': 20 },
        totalDozens: 160,
        boxes: 40,
        ratePerDz: 340,
        amount: 54400
      },
      {
        itemId: 'FG-103',
        itemName: 'Mulberry Silk Thread Designer Bangles',
        hsn: '71179090',
        sizes: { '2-4': 20, '2-6': 40, '2-8': 40 },
        totalDozens: 100,
        boxes: 25,
        ratePerDz: 275,
        amount: 27500
      }
    ],
    subtotal: 81900,
    discountPercent: 3,
    discountAmount: 2457,
    taxableAmount: 79443,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 2383.29,
    totalTax: 2383.29,
    grandTotal: 81826,
    status: 'Unpaid',
    amountPaid: 0,
    balanceDue: 81826,
    paymentTerms: 'Credit 60 Days'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-501',
    receiptNumber: 'REC-26/101',
    date: '2026-10-01',
    buyerId: 'BY-301',
    buyerName: 'Surat Bangle House',
    amount: 35000,
    mode: 'NEFT / RTGS',
    refNumber: 'HDFCR52026100109923',
    invoiceNumber: 'QS/26-27/001',
    notes: 'Part payment against dispatch consignment 001'
  },
  {
    id: 'PAY-502',
    receiptNumber: 'REC-26/102',
    date: '2026-10-03',
    buyerId: 'BY-304',
    buyerName: 'Jaipur Bridal Ornaments',
    amount: 49234,
    mode: 'UPI',
    refNumber: 'UPI/261003449911',
    invoiceNumber: 'QS/26-27/002',
    notes: 'Full payment cleared via HDFC QR'
  },
  {
    id: 'PAY-503',
    receiptNumber: 'REC-26/103',
    date: '2026-10-10',
    buyerId: 'BY-302',
    buyerName: 'Chandni Chowk Ornaments',
    amount: 80000,
    mode: 'Cheque',
    refNumber: 'CHQ-882910 PNB',
    invoiceNumber: 'On Account',
    notes: 'On account clearing for Diwali festival stock'
  }
];

export const INITIAL_KARIGAR_LOGS = [
  {
    id: 'KGL-601',
    karigarId: 'KG-401',
    karigarName: 'Ramji Lal',
    craft: 'Velvet Winding & Base Bonding',
    date: '2026-10-10',
    itemId: 'FG-102',
    itemName: 'Burgundy Velvet Matte Chuda Bangles',
    dozens: 140,
    ratePerDz: 18,
    grossAmount: 2520,
    notes: 'Batch inspected and packed into inner boxes'
  },
  {
    id: 'KGL-602',
    karigarId: 'KG-403',
    karigarName: 'Meena Devi & Group',
    craft: 'Kundan & Zircon Stone Setting',
    date: '2026-10-11',
    itemId: 'FG-101',
    itemName: 'Royal Kundan Glass Kada Set',
    dozens: 65,
    ratePerDz: 40,
    grossAmount: 2600,
    notes: 'Fine stone studding on gold foil'
  },
  {
    id: 'KGL-603',
    karigarId: 'KG-404',
    karigarName: 'Salim Khan',
    craft: 'Silk Thread Weaving',
    date: '2026-10-12',
    itemId: 'FG-103',
    itemName: 'Mulberry Silk Thread Designer Bangles',
    dozens: 80,
    ratePerDz: 32,
    grossAmount: 2560,
    notes: 'Pastel colors thread winding'
  }
];

export const INITIAL_KARIGAR_ADVANCES = [
  {
    id: 'KGA-701',
    karigarId: 'KG-401',
    karigarName: 'Ramji Lal',
    date: '2026-10-02',
    amount: 3000,
    mode: 'Cash',
    reason: 'Festival advance for Karva Chauth preparation'
  },
  {
    id: 'KGA-702',
    karigarId: 'KG-403',
    karigarName: 'Meena Devi & Group',
    date: '2026-10-05',
    amount: 5000,
    mode: 'Cash',
    reason: 'Advance for extra helpers hiring'
  }
];
