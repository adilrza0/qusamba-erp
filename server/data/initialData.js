/**
 * Qusamba ERP — Server Initial & Seed Data
 * Contains both DEMO data (for development/training) and CLEAN PRODUCTION data (fresh slate)
 */

export const INITIAL_COMPANY_PROFILE = {
  name: 'Qusamba Creations Pvt. Ltd.',
  tradeName: 'Qusamba Heritage Bangles & Crafts',
  gstin: '07KSZPK1875A1Z6',
  pan: 'KSZPK1875A',
  state: 'Rajasthan',
  stateCode: '08',
  address: 'Plot 42, Sitapura Industrial Area, Phase III',
  city: 'Jaipur',
  pincode: '302022',
  phone: '+91 98290 12345',
  email: 'wholesale@qusambacreations.com',
  bankName: 'HDFC Bank Ltd.',
  bankBranch: 'MI Road, Jaipur',
  accountNumber: '50200084930211',
  ifsc: 'HDFC0000054',
  upiId: 'qusamba.erp@hdfcbank',
  defaultGstRate: 3, // 3% for bangles/imitation jewellery (HSN 71179090)
  compositionScheme: false,
};

export const INITIAL_FINISHED_GOODS = [
  {
    id: 'FG-001',
    sku: 'QS-LAC-BRD-01',
    name: 'Royal Bridal Kundan Chuda Set',
    material: 'Lac (Handcrafted)',
    hsn: '71179090',
    dzPerBox: 4,
    wholesaleRatePerDz: 320,
    mrpPerDz: 550,
    minStockAlertDz: 40,
    sizesStockDz: {
      '2-2': 15,
      '2-4': 45,
      '2-6': 90,
      '2-8': 80,
      '2-10': 30,
      '2-12': 10
    }
  },
  {
    id: 'FG-002',
    sku: 'QS-GLS-GLD-02',
    name: 'Jaipur Gold Lustre Glass Bangles',
    material: 'Glass (Plain & Tinted)',
    hsn: '70181020',
    dzPerBox: 12,
    wholesaleRatePerDz: 85,
    mrpPerDz: 150,
    minStockAlertDz: 100,
    sizesStockDz: {
      '2-2': 40,
      '2-4': 120,
      '2-6': 210,
      '2-8': 190,
      '2-10': 60,
      '2-12': 25
    }
  },
  {
    id: 'FG-003',
    sku: 'QS-VLV-EMR-03',
    name: 'Emerald Green Velvet Bridal Set',
    material: 'Velvet / Silk Thread',
    hsn: '71179090',
    dzPerBox: 6,
    wholesaleRatePerDz: 240,
    mrpPerDz: 420,
    minStockAlertDz: 50,
    sizesStockDz: {
      '2-2': 10,
      '2-4': 35,
      '2-6': 75,
      '2-8': 65,
      '2-10': 20,
      '2-12': 5
    }
  },
  {
    id: 'FG-004',
    sku: 'QS-BRS-FLR-04',
    name: 'Floral Filigree Antique Brass Kada',
    material: 'Brass / Metal Alloy',
    hsn: '71171990',
    dzPerBox: 2,
    wholesaleRatePerDz: 480,
    mrpPerDz: 850,
    minStockAlertDz: 30,
    sizesStockDz: {
      '2-4': 25,
      '2-6': 50,
      '2-8': 45,
      '2-10': 15
    }
  },
  {
    id: 'FG-005',
    sku: 'QS-LAC-MTC-05',
    name: 'Multicolor Meenakari Hand Painted Lac Set',
    material: 'Lac (Handcrafted)',
    hsn: '71179090',
    dzPerBox: 4,
    wholesaleRatePerDz: 360,
    mrpPerDz: 620,
    minStockAlertDz: 35,
    sizesStockDz: {
      '2-2': 12,
      '2-4': 40,
      '2-6': 85,
      '2-8': 70,
      '2-10': 22,
      '2-12': 8
    }
  },
  {
    id: 'FG-006',
    sku: 'QS-GLS-RB-06',
    name: 'Ruby Red Velvet Coated Bangles',
    material: 'Velvet / Silk Thread',
    hsn: '71179090',
    dzPerBox: 6,
    wholesaleRatePerDz: 195,
    mrpPerDz: 350,
    minStockAlertDz: 60,
    sizesStockDz: {
      '2-2': 20,
      '2-4': 60,
      '2-6': 110,
      '2-8': 95,
      '2-10': 30,
      '2-12': 15
    }
  },
  {
    id: 'FG-007',
    sku: 'QS-KDN-CZ-07',
    name: 'Kundan Polki CZ Studded Wedding Kada',
    material: 'Kundan / Stone Studded',
    hsn: '71179090',
    dzPerBox: 2,
    wholesaleRatePerDz: 650,
    mrpPerDz: 1200,
    minStockAlertDz: 20,
    sizesStockDz: {
      '2-4': 18,
      '2-6': 36,
      '2-8': 32,
      '2-10': 12
    }
  }
];

export const INITIAL_RAW_MATERIALS = [
  {
    id: 'RM-001',
    name: 'Raw Natural Lac Resin',
    category: 'Resin & Wax',
    stockQty: 450,
    unit: 'Kg',
    minStockAlert: 100,
    ratePerUnit: 280,
    supplier: 'Jharkhand Forest Minor Produce Co-op'
  },
  {
    id: 'RM-002',
    name: 'Glass Spiral Coils (Raw Base)',
    category: 'Glass Base',
    stockQty: 1200,
    unit: 'Dz Spiral',
    minStockAlert: 300,
    ratePerUnit: 18,
    supplier: 'Firozabad Glass Syndicate'
  },
  {
    id: 'RM-003',
    name: 'Brass Core Round Ring Frames',
    category: 'Metal Core',
    stockQty: 800,
    unit: 'Pcs',
    minStockAlert: 200,
    ratePerUnit: 12,
    supplier: 'Moradabad Metal Crafts'
  },
  {
    id: 'RM-004',
    name: 'Swarovski / Preciosa CZ Crystals (Assorted)',
    category: 'Stones & Crystals',
    stockQty: 180,
    unit: 'Packets (1440 pcs)',
    minStockAlert: 50,
    ratePerUnit: 420,
    supplier: 'Jaipur Gems & Crystals Emporium'
  },
  {
    id: 'RM-005',
    name: 'Imported Micro Velvet Flocking Powder',
    category: 'Velvet & Dyes',
    stockQty: 85,
    unit: 'Kg',
    minStockAlert: 25,
    ratePerUnit: 680,
    supplier: 'Surat Textile Pigments'
  },
  {
    id: 'RM-006',
    name: 'Hardboard Packaging Inner Box (4 Dz Capacity)',
    category: 'Packaging Material',
    stockQty: 2500,
    unit: 'Boxes',
    minStockAlert: 800,
    ratePerUnit: 8.5,
    supplier: 'Jaipur Printpack Ltd.'
  }
];

export const INITIAL_BUYERS = [
  {
    id: 'BY-001',
    name: 'Kundan Jewellers Wholesale',
    city: 'Jaipur',
    state: 'Rajasthan',
    stateCode: '08',
    contactPerson: 'Rameshwar Sharma',
    phone: '+91 98291 44556',
    email: 'kundan.jaipur@gmail.com',
    gstin: '08AABCK1234D1Z5',
    address: 'Shop 14-16, Johari Bazaar',
    creditLimit: 300000,
    paymentTermsDays: 30,
    totalPurchases: 485000,
    totalPaid: 390000,
    outstandingBalance: 95000,
    overdueDays: 14
  },
  {
    id: 'BY-002',
    name: 'Chandni Chowk Bangles Hub',
    city: 'Delhi',
    state: 'Delhi',
    stateCode: '07',
    contactPerson: 'Mohit Agarwal',
    phone: '+91 98112 77889',
    email: 'delhibangles@yahoo.com',
    gstin: '07AAECM5567F1Z2',
    address: '452, Kinari Bazaar, Chandni Chowk',
    creditLimit: 500000,
    paymentTermsDays: 45,
    totalPurchases: 820000,
    totalPaid: 675000,
    outstandingBalance: 145000,
    overdueDays: 0
  },
  {
    id: 'BY-003',
    name: 'Surat Bangle House',
    city: 'Surat',
    state: 'Gujarat',
    stateCode: '24',
    contactPerson: 'Kishorebhai Patel',
    phone: '+91 98251 33442',
    email: 'suratbangles@rediffmail.com',
    gstin: '24AACFS9988H1Z8',
    address: 'G-12, Textile Market, Ring Road',
    creditLimit: 250000,
    paymentTermsDays: 30,
    totalPurchases: 310000,
    totalPaid: 210000,
    outstandingBalance: 100000,
    overdueDays: 42
  },
  {
    id: 'BY-004',
    name: 'Hyderabad Pearls & Bangles Emporium',
    city: 'Hyderabad',
    state: 'Telangana',
    stateCode: '36',
    contactPerson: 'Syed Mansoor',
    phone: '+91 98490 66778',
    email: 'laad.bazaar.sales@gmail.com',
    gstin: '36AAGPH4432K1ZP',
    address: 'Shop 8, Laad Bazaar, Charminar',
    creditLimit: 400000,
    paymentTermsDays: 30,
    totalPurchases: 540000,
    totalPaid: 540000,
    outstandingBalance: 0,
    overdueDays: 0
  }
];

export const INITIAL_KARIGARS = [
  {
    id: 'KRG-001',
    name: 'Ustad Abdul Hameed',
    craft: 'Lac Jointing & Shaping',
    village: 'Maniharon Ka Rasta, Jaipur',
    phone: '+91 98284 11223',
    ratePerDz: 22,
    totalDozensProduced: 1450,
    totalEarned: 31900,
    totalAdvances: 22000,
    netPayable: 9900
  },
  {
    id: 'KRG-002',
    name: 'Radheshyam Kumawat',
    craft: 'Kundan & Stone Studding',
    village: 'Sanganer, Jaipur',
    phone: '+91 98293 88990',
    ratePerDz: 45,
    totalDozensProduced: 850,
    totalEarned: 38250,
    totalAdvances: 30000,
    netPayable: 8250
  },
  {
    id: 'KRG-003',
    name: 'Shakeel Ahmed',
    craft: 'Velvet Flocking & Winding',
    village: 'Chomu, Rajasthan',
    phone: '+91 94142 55667',
    ratePerDz: 18,
    totalDozensProduced: 2100,
    totalEarned: 37800,
    totalAdvances: 32000,
    netPayable: 5800
  },
  {
    id: 'KRG-004',
    name: 'Madanlal Verma',
    craft: 'Brass Core Soldering & Embossing',
    village: 'Bagru, Rajasthan',
    phone: '+91 98299 33441',
    ratePerDz: 30,
    totalDozensProduced: 950,
    totalEarned: 28500,
    totalAdvances: 25000,
    netPayable: 3500
  },
  {
    id: 'KRG-005',
    name: 'Salim Khan',
    craft: 'Meenakari Enamelling',
    village: 'Ramganj, Jaipur',
    phone: '+91 98295 77665',
    ratePerDz: 35,
    totalDozensProduced: 600,
    totalEarned: 21000,
    totalAdvances: 21000,
    netPayable: 0
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'QS/26-27/001',
    date: '2026-10-02',
    dueDate: '2026-11-01',
    buyerId: 'BY-001',
    buyerName: 'Kundan Jewellers Wholesale',
    buyerGstin: '08AABCK1234D1Z5',
    buyerAddress: 'Shop 14-16, Johari Bazaar, Jaipur, Rajasthan',
    buyerState: 'Rajasthan',
    buyerStateCode: '08',
    isInterstate: false,
    gstRate: 3,
    items: [
      {
        itemId: 'FG-001',
        itemName: 'Royal Bridal Kundan Chuda Set',
        hsn: '71179090',
        dzPerBox: 4,
        ratePerDz: 320,
        sizes: { '2-4': 20, '2-6': 40, '2-8': 30 },
        totalDozens: 90,
        boxes: 22.5,
        amount: 28800
      },
      {
        itemId: 'FG-005',
        itemName: 'Multicolor Meenakari Hand Painted Lac Set',
        hsn: '71179090',
        dzPerBox: 4,
        ratePerDz: 360,
        sizes: { '2-6': 25, '2-8': 25 },
        totalDozens: 50,
        boxes: 12.5,
        amount: 18000
      }
    ],
    subtotal: 46800,
    discountPercent: 2,
    discountAmount: 936,
    taxableAmount: 45864,
    cgstAmount: 688,
    sgstAmount: 688,
    igstAmount: 0,
    totalTax: 1376,
    grandTotal: 47240,
    amountPaid: 47240,
    balanceDue: 0,
    status: 'Paid',
    paymentTerms: 'Immediate RTGS'
  },
  {
    id: 'INV-2026-002',
    invoiceNumber: 'QS/26-27/002',
    date: '2026-10-08',
    dueDate: '2026-11-22',
    buyerId: 'BY-002',
    buyerName: 'Chandni Chowk Bangles Hub',
    buyerGstin: '07AAECM5567F1Z2',
    buyerAddress: '452, Kinari Bazaar, Chandni Chowk, Delhi',
    buyerState: 'Delhi',
    buyerStateCode: '07',
    isInterstate: true,
    gstRate: 3,
    items: [
      {
        itemId: 'FG-002',
        itemName: 'Jaipur Gold Lustre Glass Bangles',
        hsn: '70181020',
        dzPerBox: 12,
        ratePerDz: 85,
        sizes: { '2-4': 50, '2-6': 100, '2-8': 100 },
        totalDozens: 250,
        boxes: 20.8,
        amount: 21250
      },
      {
        itemId: 'FG-003',
        itemName: 'Emerald Green Velvet Bridal Set',
        hsn: '71179090',
        dzPerBox: 6,
        ratePerDz: 240,
        sizes: { '2-6': 40, '2-8': 40 },
        totalDozens: 80,
        boxes: 13.3,
        amount: 19200
      }
    ],
    subtotal: 40450,
    discountPercent: 0,
    discountAmount: 0,
    taxableAmount: 40450,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 1214,
    totalTax: 1214,
    grandTotal: 41664,
    amountPaid: 20000,
    balanceDue: 21664,
    status: 'Partial',
    paymentTerms: 'Credit 45 Days'
  },
  {
    id: 'INV-2026-003',
    invoiceNumber: 'QS/26-27/003',
    date: '2026-10-12',
    dueDate: '2026-11-11',
    buyerId: 'BY-003',
    buyerName: 'Surat Bangle House',
    buyerGstin: '24AACFS9988H1Z8',
    buyerAddress: 'G-12, Textile Market, Ring Road, Surat, Gujarat',
    buyerState: 'Gujarat',
    buyerStateCode: '24',
    isInterstate: true,
    gstRate: 3,
    items: [
      {
        itemId: 'FG-007',
        itemName: 'Kundan Polki CZ Studded Wedding Kada',
        hsn: '71179090',
        dzPerBox: 2,
        ratePerDz: 650,
        sizes: { '2-4': 15, '2-6': 25, '2-8': 20 },
        totalDozens: 60,
        boxes: 30,
        amount: 39000
      }
    ],
    subtotal: 39000,
    discountPercent: 0,
    discountAmount: 0,
    taxableAmount: 39000,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 1170,
    totalTax: 1170,
    grandTotal: 40170,
    amountPaid: 0,
    balanceDue: 40170,
    status: 'Unpaid',
    paymentTerms: 'Credit 30 Days'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-001',
    receiptNumber: 'REC-26/101',
    date: '2026-10-03',
    buyerId: 'BY-001',
    buyerName: 'Kundan Jewellers Wholesale',
    amount: 47240,
    mode: 'NEFT / RTGS',
    refNumber: 'HDFCR5202610034910',
    invoiceNumber: 'QS/26-27/001',
    notes: 'Full payment received against invoice 001'
  },
  {
    id: 'PAY-002',
    receiptNumber: 'REC-26/102',
    date: '2026-10-09',
    buyerId: 'BY-002',
    buyerName: 'Chandni Chowk Bangles Hub',
    amount: 20000,
    mode: 'UPI',
    refNumber: 'UPI/628291039481/HDFC',
    invoiceNumber: 'QS/26-27/002',
    notes: 'Advance part payment via UPI'
  }
];

export const INITIAL_KARIGAR_LOGS = [
  {
    id: 'KGL-001',
    date: '2026-10-15',
    karigarId: 'KRG-001',
    karigarName: 'Ustad Abdul Hameed',
    craft: 'Lac Jointing & Shaping',
    itemId: 'FG-001',
    itemName: 'Royal Bridal Kundan Chuda Set',
    dozens: 60,
    ratePerDz: 22,
    grossAmount: 1320,
    notes: 'Jointing seamless, ready for setting'
  },
  {
    id: 'KGL-002',
    date: '2026-10-16',
    karigarId: 'KRG-002',
    karigarName: 'Radheshyam Kumawat',
    craft: 'Kundan & Stone Studding',
    itemId: 'FG-001',
    itemName: 'Royal Bridal Kundan Chuda Set',
    dozens: 40,
    ratePerDz: 45,
    grossAmount: 1800,
    notes: 'Preciosa CZ stones fixed tightly'
  }
];

export const INITIAL_KARIGAR_ADVANCES = [
  {
    id: 'KGA-001',
    date: '2026-10-10',
    karigarId: 'KRG-001',
    karigarName: 'Ustad Abdul Hameed',
    amount: 2000,
    mode: 'Cash',
    reason: 'Diwali raw material procurement & household advance'
  },
  {
    id: 'KGA-002',
    date: '2026-10-14',
    karigarId: 'KRG-002',
    karigarName: 'Radheshyam Kumawat',
    amount: 1500,
    mode: 'UPI',
    reason: 'Weekly workshop groceries'
  }
];

/**
 * CLEAN PRODUCTION DATA (Pristine state for live manufacturing)
 * 0 dummy invoices, 0 fake buyers, 0 fake transactions.
 */
export const CLEAN_PRODUCTION_PROFILE = {
  ...INITIAL_COMPANY_PROFILE,
  name: 'Your Bangle Manufacturing Co.',
  tradeName: 'Registered Trade Name',
  gstin: '07XXXXX0000X0Z0',
  pan: 'XXXXX0000X',
};

export const CLEAN_PRODUCTION_FINISHED_GOODS = INITIAL_FINISHED_GOODS.map((item) => ({
  ...item,
  sizesStockDz: {
    '2-2': 0,
    '2-4': 0,
    '2-6': 0,
    '2-8': 0,
    '2-10': 0,
    '2-12': 0,
  }
}));

export const CLEAN_PRODUCTION_RAW_MATERIALS = INITIAL_RAW_MATERIALS.map((rm) => ({
  ...rm,
  stockQty: 0
}));
