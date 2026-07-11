import { z } from 'zod';

export const CrmStatusSchema = z.enum([
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE',
]).or(z.literal('')).nullish();

export const DataSourceSchema = z.enum([
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots',
]).or(z.literal('')).nullish();

export const CrmRecordSchema = z.object({
  created_at: z.string().nullish(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  country_code: z.string().nullish(),
  mobile_without_country_code: z.string().nullish(),
  company: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  lead_owner: z.string().nullish(),
  crm_status: CrmStatusSchema,
  crm_note: z.string().nullish(),
  data_source: DataSourceSchema,
  possession_time: z.string().nullish(),
  description: z.string().nullish(),
}).catchall(z.any());

export type CrmRecord = z.infer<typeof CrmRecordSchema>;

export const BatchResultSchema = z.object({
  records: z.array(CrmRecordSchema).nullish().transform(val => val || []),
  skipped: z.array(
    z.object({
      row: z.any(),
      reason: z.string().nullish(),
    }).catchall(z.any())
  ).nullish().transform(val => val || []),
}).catchall(z.any());

export type BatchResult = z.infer<typeof BatchResultSchema>;

export interface JobProgress {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successfulRecords: CrmRecord[];
  skippedRecords: Array<{ row: any; reason: string }>;
  errors: string[];
  createdAt: number;
  updatedAt: number;
}
