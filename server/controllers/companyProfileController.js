import CompanyProfile from '../models/CompanyProfile.js';

export const getCompanyProfile = async (_req, res, next) => {
  try {
    let profile = await CompanyProfile.findOne();
    if (!profile) {
      // Default initial profile
      profile = await CompanyProfile.create({
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
        defaultGstRate: 3,
        terms: [
          '1. Goods once sold will not be taken back or exchanged.',
          '2. Interest @18% p.a. will be charged if payment is not cleared within agreed credit period.',
          '3. Subject to Jaipur jurisdiction only.',
          '4. Breakage during transit is at the buyer’s risk unless transit insurance is opted.'
        ]
      });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    let profile = await CompanyProfile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = await CompanyProfile.create(req.body);
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};
