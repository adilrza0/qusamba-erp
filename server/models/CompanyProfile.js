import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tradeName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Jaipur' },
    state: { type: String, default: 'Rajasthan' },
    stateCode: { type: String, default: '08' },
    pincode: { type: String, default: '302003' },
    gstin: { type: String, default: '' },
    pan: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    bankName: { type: String, default: '' },
    bankBranch: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    upiId: { type: String, default: '' },
    defaultGstRate: { type: Number, default: 3 },
    terms: [{ type: String }],
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
export default CompanyProfile;
