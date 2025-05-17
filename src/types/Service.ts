export type DurationType = 'hour' | 'day' | 'week' | 'month';

export interface Service {
  name: string;
  durationType: DurationType;
  durationValue: number;
}