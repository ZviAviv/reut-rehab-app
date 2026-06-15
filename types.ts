
export enum AppStage {
  PRE_ADMISSION = 'לפני הגעה',
  ADMISSION = 'קבלה',
  ACCLIMATIZATION = 'התאקלמות',
  REHAB_ROUTINE = 'שגרת שיקום',
  PRE_HOME = 'לקראת חזרה הביתה',
  POST_HOME = 'אחרי החזרה הביתה'
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'treatment' | 'meal' | 'break' | 'exercise';
  completed: boolean;
}

export interface TreatmentSummary {
  date: string;
  therapistName: string;
  therapistAvatar: string;
  sharedRecords: string[];
  goals: string[];
  selfPractice: string[];
  limitationChanges: string[];
  helpfulResources: { title: string; type: 'video' | 'info' }[];
  nextSessionDate: string;
  nextSessionTime: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
