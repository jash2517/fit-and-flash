import { Product } from '@/types';

// Pre-loaded dataset with prices upwards of 2-3k Indian Rupees and verified working images
export const INITIAL_PRODUCTS: Product[] = [
  // 1. T-Shirts (All ₹2,199 - ₹2,399)
  {
    id: 'ff-prod-01',
    title: 'Acid Wash Oversized Tee',
    brand: 'Fit&Flash Core',
    category: 't-shirts',
    price: 2299,
    originalPrice: 2899,
    stockCount: 3,
    initialStock: 25,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 9912,
    dropEndTime: Date.now() + 9912 * 1000,
    description: '300 GSM premium combed cotton with comfortable relaxed drop shoulders and acid wash finish.',
    details: [
      '300 GSM Heavyweight cotton',
      'Comfortable drop-shoulder fit',
      'Pre-shrunk fabric',
      'Soft silicone wash'
    ],
    modelType: 'apparel',
    availableSizes: ['S', 'M', 'L', 'XL'],
    fabricSpec: '100% Combed Cotton (300 GSM)',
    batchCode: 'DROP-01-BLR'
  },
  {
    id: 'ff-prod-02',
    title: 'Heavyweight Boxy Tee',
    brand: 'Fit&Flash Core',
    category: 't-shirts',
    price: 2199,
    originalPrice: 2699,
    stockCount: 4,
    initialStock: 30,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 8400,
    dropEndTime: Date.now() + 8400 * 1000,
    description: 'Minimalist clean streetwear tee with structured ribbed collar and breathable all-day weave.',
    details: [
      '280 GSM Ring-spun cotton',
      'Double-stitched ribbed neck',
      'True boxy streetwear fit'
    ],
    modelType: 'apparel',
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    fabricSpec: 'Ring-spun cotton (280 GSM)',
    batchCode: 'DROP-02-MUM'
  },
  {
    id: 'ff-prod-03',
    title: 'Monochrome Graphic Tee',
    brand: 'Fit&Flash Studio',
    category: 't-shirts',
    price: 2399,
    originalPrice: 2999,
    stockCount: 2,
    initialStock: 20,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 5200,
    dropEndTime: Date.now() + 5200 * 1000,
    description: 'High-density screen print with subtle streetwear graphics on charcoal washed cotton.',
    details: [
      'High-density rubber screen print',
      'Bio-washed fabric for zero shrinkage',
      'Relaxed comfort cut'
    ],
    modelType: 'apparel',
    availableSizes: ['S', 'M', 'L', 'XL'],
    fabricSpec: '100% Bio-polished cotton',
    batchCode: 'DROP-03-DEL'
  },

  // 2. Hoodies (₹3,499 - ₹3,999)
  {
    id: 'ff-prod-04',
    title: 'Plum Armor Hoodie',
    brand: 'Fit&Flash Signature',
    category: 'hoodies',
    price: 3999,
    originalPrice: 4999,
    stockCount: 5,
    initialStock: 40,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 11200,
    dropEndTime: Date.now() + 11200 * 1000,
    description: '500 GSM luxury fleece hoodie in deep plum berry tone. Double-layered hood that stays structured.',
    details: [
      '500 GSM loopback cotton fleece',
      'Clean no-drawstring aesthetic',
      'Hidden kangaroo pocket',
      'Ribbed cuffs and hem'
    ],
    modelType: 'hoodie',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabricSpec: '500 GSM Heavy Fleece',
    batchCode: 'DROP-04-BERRY'
  },
  {
    id: 'ff-prod-05',
    title: 'Classic Black Zip Hoodie',
    brand: 'Fit&Flash Core',
    category: 'hoodies',
    price: 3699,
    originalPrice: 4499,
    stockCount: 3,
    initialStock: 22,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 7800,
    dropEndTime: Date.now() + 7800 * 1000,
    description: 'Smooth dual-metal zipper hoodie with subtle contrast stitching and plush warm inner fleece.',
    details: [
      'Smooth matte metal zipper',
      'Plush brushed cotton fleece',
      'Reinforced elbow seams'
    ],
    modelType: 'hoodie',
    availableSizes: ['M', 'L', 'XL'],
    fabricSpec: '450 GSM Brushed Fleece',
    batchCode: 'DROP-05-ZIP'
  },
  {
    id: 'ff-prod-06',
    title: 'Vintage Cropped Hoodie',
    brand: 'Fit&Flash Studio',
    category: 'hoodies',
    price: 3499,
    originalPrice: 4299,
    stockCount: 2,
    initialStock: 18,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 4300,
    dropEndTime: Date.now() + 4300 * 1000,
    description: 'Modern relaxed crop with wide sleeves and soft-washed charcoal aesthetic.',
    details: [
      'Wide sleeve streetwear drape',
      'Garment washed soft vintage feel',
      'Raw edge hem detail'
    ],
    modelType: 'hoodie',
    availableSizes: ['S', 'M', 'L'],
    fabricSpec: '400 GSM Loopback Terry',
    batchCode: 'DROP-06-CROP'
  },

  // 3. Shirts (₹2,899 - ₹3,199)
  {
    id: 'ff-prod-07',
    title: 'Silk Blend Cuban Shirt',
    brand: 'Fit&Flash Atelier',
    category: 'shirts',
    price: 2899,
    originalPrice: 3599,
    stockCount: 4,
    initialStock: 25,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 6100,
    dropEndTime: Date.now() + 6100 * 1000,
    description: 'Lightweight breathable camp-collar shirt with silk-cotton blend drape for warm evenings.',
    details: [
      'Silk and cotton hybrid weave',
      'Cuban notch collar',
      'Mother-of-pearl buttons'
    ],
    modelType: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL'],
    fabricSpec: 'Silk & Cotton Hybrid',
    batchCode: 'DROP-07-CUBAN'
  },
  {
    id: 'ff-prod-08',
    title: 'Cargo Utility Overshirt',
    brand: 'Fit&Flash Core',
    category: 'shirts',
    price: 3199,
    originalPrice: 3899,
    stockCount: 3,
    initialStock: 20,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 8900,
    dropEndTime: Date.now() + 8900 * 1000,
    description: 'Durable cotton twill overshirt with dual utility chest pockets. Perfect for layering.',
    details: [
      'Durable 100% cotton twill',
      'Snap button front closure',
      'Dual deep chest pockets'
    ],
    modelType: 'shirt',
    availableSizes: ['M', 'L', 'XL'],
    fabricSpec: 'Heavy Cotton Twill',
    batchCode: 'DROP-08-OVR'
  },
  {
    id: 'ff-prod-09',
    title: 'Minimal Drape Shirt',
    brand: 'Fit&Flash Studio',
    category: 'shirts',
    price: 2999,
    originalPrice: 3699,
    stockCount: 0,
    initialStock: 30,
    status: 'sold-out',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 0,
    dropEndTime: Date.now() - 3600000,
    description: 'Clean front placket with fluid drape fabric. Completely sold out in the first flash drop.',
    details: [
      'Premium fluid drape cupro blend',
      'Concealed buttons',
      'Batch 01 Sold Out'
    ],
    modelType: 'shirt',
    availableSizes: ['S', 'M', 'L'],
    waitlistCount: 215,
    fabricSpec: 'Fluid Cupro Blend',
    batchCode: 'DROP-09-MIN'
  },

  // 4. Denim Jeans (Fixed image for Okayama Selvedge!)
  {
    id: 'ff-prod-10',
    title: 'Okayama 18oz Selvedge Jeans',
    brand: 'Fit&Flash Atelier',
    category: 'denim',
    price: 4499,
    originalPrice: 5499,
    stockCount: 4,
    initialStock: 25,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 9400,
    dropEndTime: Date.now() + 9400 * 1000,
    description: '18oz rigid raw indigo selvedge denim woven on shuttle looms. Clean straight stack over high-top sneakers.',
    details: [
      '18oz Raw indigo selvedge denim',
      'Pink line selvedge ID on cuff flip',
      'Reinforced copper rivets',
      'Clean stacking straight fit'
    ],
    modelType: 'denim',
    availableSizes: ['30', '32', '34', '36'],
    fabricSpec: '100% Selvedge Cotton (18oz)',
    batchCode: 'DROP-10-OKAYAMA'
  },
  {
    id: 'ff-prod-11',
    title: 'Baggy Carpenter Jeans',
    brand: 'Fit&Flash Core',
    category: 'denim',
    price: 3899,
    originalPrice: 4699,
    stockCount: 3,
    initialStock: 20,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 6800,
    dropEndTime: Date.now() + 6800 * 1000,
    description: 'Relaxed wide-leg carpenter jeans with utility hammer loop and washed vintage blue tone.',
    details: [
      'Wide baggy fit',
      'Double knee panels',
      'Hammer loop detail'
    ],
    modelType: 'denim',
    availableSizes: ['30', '32', '34', '36'],
    fabricSpec: 'Heavyweight Washed Denim',
    batchCode: 'DROP-11-CARP'
  },
  {
    id: 'ff-prod-12',
    title: 'Off-White Relaxed Jeans',
    brand: 'Fit&Flash Studio',
    category: 'denim',
    price: 3999,
    originalPrice: 4899,
    stockCount: 0,
    initialStock: 15,
    status: 'sold-out',
    image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 0,
    dropEndTime: Date.now() - 7200000,
    description: 'Natural ecru unbleached cotton denim with clean straight drape. Sold out in flash drop.',
    details: [
      'Natural unbleached ecru denim',
      'Embossed leather back patch',
      'Sold out'
    ],
    modelType: 'denim',
    availableSizes: ['32', '34'],
    waitlistCount: 184,
    fabricSpec: '100% Ecru Cotton',
    batchCode: 'DROP-12-ECRU'
  },

  // 5. Sneakers (₹4,299 - ₹4,799)
  {
    id: 'ff-prod-13',
    title: 'Aero Runner Sneakers',
    brand: 'Fit&Flash Footwear',
    category: 'sneakers',
    price: 4799,
    originalPrice: 5999,
    stockCount: 2,
    initialStock: 30,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 7400,
    dropEndTime: Date.now() + 7400 * 1000,
    description: 'Lightweight 3D cushioned midsole sneakers with breathable mesh upper and responsive stride.',
    details: [
      '3D-cushioned responsive sole',
      'Breathable ripstop mesh',
      'Padded collar for ankle comfort'
    ],
    modelType: 'sneaker',
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    fabricSpec: 'Technical Mesh & EVA Foam',
    batchCode: 'DROP-13-AERO'
  },
  {
    id: 'ff-prod-14',
    title: 'Street Low Retro Sneakers',
    brand: 'Fit&Flash Footwear',
    category: 'sneakers',
    price: 4299,
    originalPrice: 5299,
    stockCount: 3,
    initialStock: 25,
    status: 'live',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 8300,
    dropEndTime: Date.now() + 8300 * 1000,
    description: 'Classic skate silhouette elevated with premium vegan leather and gripped rubber outsole.',
    details: [
      'Supple vegan leather upper',
      'Non-slip rubber cupsole',
      'Reinforced toe box'
    ],
    modelType: 'sneaker',
    availableSizes: ['UK 8', 'UK 9', 'UK 10'],
    fabricSpec: 'Vegan Leather & Rubber',
    batchCode: 'DROP-14-RETRO'
  },

  // 6. Local Vault / Verified Local Returns (Pre-populated items with 10% discount & Hubs)
  {
    id: 'ff-prod-15',
    title: 'Weatherproof Rain Parka [Local Return]',
    brand: 'Fit&Flash Studio',
    category: 'hoodies',
    price: 3419, // 10% off ₹3799
    originalPrice: 3799,
    stockCount: 1,
    initialStock: 1,
    status: 'local-vault',
    discount: 10,
    hubLocation: 'Bengaluru Hub - Indiranagar',
    expressDelivery: true,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 86400,
    dropEndTime: Date.now() + 86400 * 1000,
    description: 'Customer exchanged for a different size. Inspected, sanitized, and stored at Bengaluru Indiranagar Hub. 10% instant discount with same-day express delivery.',
    details: [
      'At Local Store Near You • 24hr Express Delivery',
      '10% Local Hub Discount applied',
      'Condition: 10/10 Mint unworn with tags',
      'Inspected & sanitized'
    ],
    modelType: 'hoodie',
    availableSizes: ['L'],
    fabricSpec: 'Waterproof Membrane',
    batchCode: 'VAULT-BLR-01'
  },
  {
    id: 'ff-prod-16',
    title: 'Oversized Check Flannel [Local Return]',
    brand: 'Fit&Flash Core',
    category: 'shirts',
    price: 2699, // 10% off ₹2999
    originalPrice: 2999,
    stockCount: 1,
    initialStock: 1,
    status: 'local-vault',
    discount: 10,
    hubLocation: 'Mumbai Hub - Bandra West',
    expressDelivery: true,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
    ],
    countdownSeconds: 86400,
    dropEndTime: Date.now() + 86400 * 1000,
    description: 'Verified return at Bandra West Hub. Size was slightly large for customer. Unworn with tag attached. 10% discount pass-through.',
    details: [
      'At Local Store Near You • 24hr Express Delivery',
      '10% Local Hub Discount applied',
      'Verified tag attached',
      'Express courier ready'
    ],
    modelType: 'shirt',
    availableSizes: ['M'],
    fabricSpec: 'Brushed Cotton Flannel',
    batchCode: 'VAULT-MUM-02'
  }
];

export const DEMO_USERS = {
  'shopper-a': {
    role: 'shopper-a' as const,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@fitandflash.in',
    phone: '+91 98201 44810',
    avatar: '',
    location: 'Indiranagar, Bengaluru',
    hub: 'Bengaluru Hub - Indiranagar',
  },
  'shopper-b': {
    role: 'shopper-b' as const,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@fitandflash.in',
    phone: '+91 98450 72199',
    avatar: '',
    location: 'Bandra West, Mumbai',
    hub: 'Mumbai Hub - Bandra West',
  },
  'merchant': {
    role: 'merchant' as const,
    name: 'Store Manager',
    email: 'ops@fitandflash.in',
    phone: '+91 80000 55555',
    avatar: '',
    location: 'Central Distribution Operations',
    hub: 'All Hubs',
  }
};
