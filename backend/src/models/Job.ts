import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  skippedRecords: Array<{ row: any; reason: string }>;
  jobErrors: string[];
  createdAt: number;
  updatedAt: number;
}

const JobSchema: Schema = new Schema({
  jobId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  totalRows: { type: Number, default: 0 },
  processedRows: { type: Number, default: 0 },
  skippedRecords: { type: Array, default: [] },
  jobErrors: { type: Array, default: [] },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() }
}, {
  suppressReservedKeysWarning: true
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
