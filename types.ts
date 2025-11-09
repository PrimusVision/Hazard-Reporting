
export enum HazardSeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum HazardType {
  UnsafeAct = 'Unsafe Act',
  UnsafeCondition = 'Unsafe Condition',
}

export interface Hazard {
  type: HazardType;
  description: string;
  severity: HazardSeverity;
}
