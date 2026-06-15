
import { AppStage, ChecklistItem, ScheduleItem, Notification, FAQItem } from './types';

export const STAGES = [
  AppStage.PRE_ADMISSION,
  AppStage.ADMISSION,
  AppStage.ACCLIMATIZATION,
  AppStage.REHAB_ROUTINE,
  AppStage.PRE_HOME,
  AppStage.POST_HOME
];

export const MOCK_CHECKLIST: Record<AppStage, ChecklistItem[]> = {
  [AppStage.PRE_ADMISSION]: [
    { id: 'pa0', text: 'כניסה לאפליקציה', completed: true },
    { id: 'pa1', text: 'בגדים נוחים (כולל מכנסיים, נעלי ספורט וגרביים)', completed: false },
    { id: 'pa2', text: 'פיג\'מה', completed: false },
    { id: 'pa3', text: 'תעודת זהות/רישיון', completed: false },
    { id: 'pa4', text: 'כרטיס קופת חולים', completed: false },
    { id: 'pa5', text: 'צילומי רנטגן', completed: false },
    { id: 'pa6', text: 'דברים שיסייעו לו להעביר את הזמן - ספר, חוברת תשבצים', completed: false },
    { id: 'pa7', text: 'אמצעי עזר / סד שהוא משתמש בו', completed: false },
    { id: 'pa8', text: 'משקפי קריאה', completed: false },
    { id: 'pa9', text: 'טואלטיקה - סבון, שמפו, מברשת שיניים, משחת שיניים וכו\'', completed: false },
    { id: 'pa10', text: 'מטען לטלפון', completed: false },
    { id: 'pa11', text: 'אוזניות', completed: false },
    { id: 'pa12', text: 'כוסות חד פעמיות', completed: false },
    { id: 'pa13', text: 'המלצה לא להביא כסף ודברי ערך', completed: false },
  ],
  [AppStage.ADMISSION]: [
    { id: 'ad0', text: 'הגעה לבית החולים', completed: true },
    { id: 'ad0b', text: 'התקנת אפליקציה', completed: true },
    { id: 'ad1', text: 'קבלה אדמיניסטרטיבית', completed: false },
    { id: 'ad2', text: 'שיחת אוריינטציה עם האחות', completed: false },
    { id: 'ad3', text: 'כניסה לחדר', completed: false },
    { id: 'ad4', text: 'מפגש ראשון בפיזיותרפיה', completed: false },
    { id: 'ad5', text: 'מפגש ראשון בסיעוד', completed: false },
    { id: 'ad6', text: 'מפגש ראשון ברפואה', completed: false },
    { id: 'ad7', text: 'מפגש ראשון בקלינאות תקשורת', completed: false },
    { id: 'ad8', text: 'מפגש ראשון בריפוי בעיסוק', completed: false },
  ],
  [AppStage.ACCLIMATIZATION]: [
    { id: '7', text: 'היכרות עם הצוות המטפל', completed: true },
    { id: '8', text: 'סיור במחלקה ובשטחים הציבוריים', completed: true },
    { id: '9', text: 'קביעת יעדים ראשוניים עם העו"ס', completed: false },
  ],
  [AppStage.REHAB_ROUTINE]: [],
  [AppStage.PRE_HOME]: [
    // תדרוכי חובה
    { id: 'br_physio', text: 'מפגש סיכום - פיזיותרפיה', completed: false },
    { id: 'br_ot', text: 'מפגש סיכום - ריפוי בעיסוק', completed: false },
    { id: 'br_speech', text: 'מפגש סיכום - קלינאות תקשורת', completed: false },
    { id: 'br_nursing', text: 'מפגש סיכום - סיעוד', completed: false },
    { id: 'br_social', text: 'מפגש סיכום - עבודה סוציאלית', completed: false },
    { id: 'br_doctor', text: 'שיחת שחרור עם רופא', completed: false },
    // משימות למטופל ולמשפחה
    { id: 'task_equip', text: 'השאלת/קניית ציוד מיד שרה', completed: false },
    { id: 'task_return', text: 'החזרת ציוד בי"ח', completed: false },
    { id: 'task_doctor', text: 'קביעת תור לרופא משפחה', completed: false },
    { id: 'task_home', text: 'התאמת הבית', completed: false },
    { id: 'task_framework', text: 'קביעת מסגרת המשך', completed: false },
    { id: 'task_transport', text: 'ארגון הסעה הביתה', completed: false },
    { id: 'task_car', text: 'תרגול כניסה לרכב', completed: false },
    { id: 'task_visit', text: 'ביקור הכנה בבית', completed: false },
    { id: 'task_survey', text: 'מילוי שאלון סיכום', completed: false },
  ],
  [AppStage.POST_HOME]: [
    { id: '14', text: 'קביעת תור לביקורת ראשונה', completed: false },
  ],
};

const admissionFaqs: FAQItem[] = [
  {
    id: 'faq_1',
    question: 'במה תהליך השיקום שונה ממה שעברתי עד עכשיו?',
    answer: 'תהליך השיקום מתמקד בחזרה לתפקוד מיטבי ועצמאות, בניגוד לאשפוז אקוטי שמתמקד בייצוב רפואי. כאן תהיה שותף פעיל בטיפולים השונים ותעבוד עם צוות רב-מקצועי.'
  },
  {
    id: 'faq_2',
    question: 'מי אחראי על מימון האשפוז? האם עלי לדאוג בעצמי לטופס 17 לאשפוז?',
    answer: 'מימון האשפוז מכוסה לרוב על ידי קופת החולים או גורם מממן אחר (כמו משרד הביטחון). צוות קבלת חולים שלנו מסייע בהסדרת טופס 17 מול הקופה, אך חשוב לוודא מולנו את סטטוס האישור טרם ההגעה.'
  },
  {
    id: 'faq_3',
    question: 'האם המשפחה צריכה להיות צמודה אליי במהלך השיקום?',
    answer: 'נוכחות המשפחה חשובה ותומכת, אך אין חובה שיהיו צמודים אליך 24/7. הצוות שלנו זמין עבורך בכל עת. אנו מעודדים מעורבות משפחתית בתהליך השיקום ובהדרכות לקראת שחרור.'
  },
  {
    id: 'faq_4',
    question: 'מה זה תהליך שיקום ואיך הוא נראה?',
    answer: 'תהליך השיקום הוא תוכנית מותאמת אישית הכוללת טיפולי פיזיותרפיה, ריפוי בעיסוק, קלינאות תקשורת, תמיכה רגשית ועוד. סדר היום כולל טיפולים פרטניים וקבוצתיים, מנוחה וארוחות, במטרה לשפר את התפקוד היומיומי.'
  },
  {
    id: 'faq_5',
    question: 'מה מיוחד בבית החולים רעות?',
    answer: 'רעות תל אביב הוא מבית החולים השיקומיים הגדולים והמובילים בישראל. אנו דוגלים בגישה הוליסטית, צוות רב-מקצועי מיומן, טכנולוגיות שיקום מתקדמות ויחס אישי וחם לכל מטופל ומשפחתו.'
  }
];

export const MOCK_FAQ: Record<AppStage, FAQItem[]> = {
  [AppStage.PRE_ADMISSION]: admissionFaqs,
  [AppStage.ADMISSION]: admissionFaqs,
  [AppStage.ACCLIMATIZATION]: [],
  [AppStage.REHAB_ROUTINE]: [],
  [AppStage.PRE_HOME]: [
    { 
      id: 'f1', 
      question: 'איך מקבלים סיכום מחלה לקראת השחרור?', 
      answer: 'סיכום המחלה יימסר לך ע״י הצוות הרפואי ביום השחרור. הוא כולל פירוט על מהלך האשפוז, הטיפולים שעברת והמלצות להמשך מעקב בקהילה.' 
    },
    { 
      id: 'f2', 
      question: 'מי דואג להשכרת ציוד עזר לבית?', 
      answer: 'המרפאה בעיסוק או הפיזיותרפיסט יתנו לך המלצות מדויקות לציוד הנדרש. ניתן להשכיר ציוד דרך יד שרה, עזר מציון או רכישה פרטית. העובדת הסוציאלית תוכל לסייע בתהליך הבירוקרטי מול קופת החולים.' 
    }
  ],
  [AppStage.POST_HOME]: []
};

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '08:00', title: 'ארוחת בוקר', type: 'meal', completed: true },
  { id: 's2', time: '09:00', title: 'פיזיותרפיה', type: 'exercise', completed: false },
  { id: 's3', time: '10:30', title: 'ביקור רופאים', type: 'treatment', completed: false },
  { id: 's4', time: '12:00', title: 'ארוחת צהריים', type: 'meal', completed: false },
  { id: 's5', time: '14:00', title: 'ריפוי בעיסוק - תרגול תפקודי', type: 'treatment', completed: false },
  { id: 's6', time: '16:00', title: 'מנוחה', type: 'break', completed: false },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'תזכורת: טיפול פיזיותרפיה', content: 'הטיפול הבא שלך יתחיל בעוד 15 דקות בחדר 302.', date: '2024-05-22' },
  { id: 'n2', title: 'עדכון צוות', content: 'ד"ר שפירא יחליף את ד"ר לוי בביקור הבוקר.', date: '2024-05-22' },
];
