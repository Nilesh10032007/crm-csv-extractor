import mongoose, { Schema, Document } from 'mongoose';
import { CrmRecord } from '../types';

export interface ILead extends CrmRecord, Document {
  jobId: string;
}

const LeadSchema: Schema = new Schema({
  jobId: { type: String, required: true, index: true },
  created_at: { type: String },
  name: { type: String },
  email: { type: String },
  country_code: { type: String },
  mobile_without_country_code: { type: String },
  company: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  lead_owner: { type: String },
  crm_status: { type: String },
  crm_note: { type: String },
  data_source: { type: String },
  possession_time: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
