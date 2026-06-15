
import React, { useState, useMemo } from 'react';
import { AppStage, ScheduleItem, TreatmentSummary, ChecklistItem } from './types';

import StatusProgress from './components/StatusProgress';
import WidgetCard from './components/WidgetCard';
import { MOCK_CHECKLIST, MOCK_SCHEDULE, MOCK_FAQ } from './constants';

type Tab = 'home' | 'info' | 'personal' | 'notebook' | 'exercises' | 'checklist' | 'faq' | 'treatment-summary';
type InfoSubView = 'grid' | 'team' | 'ward' | 'who-to-contact' | 'public-enquiries' | 'constipation' | 'about-reut' | 'therapeutic-contract' | 'meeting-patients' | 'service-basket' | 'home-instructions' | 'home-release-info' | 'home-exercises' | 'home-prep-hub' | 'prep-video' | 'prep-tips' | 'prep-continuum' | 'prep-social' | 'prep-rights' | 'prep-sexuality' | 'prep-date-info' | 'sleep' | 'pain' | 'stress' | 'sexuality' | 'social-rights' | 'sb-physio-equip' | 'sb-yoga' | 'sb-comp-med' | 'sb-equip-rent' | 'sb-security' | 'sb-stay-permit' | 'sb-research' | 'sb-xray' | 'sb-tv';

interface OtherPatient {
  id: string;
  name: string;
  image?: string;
  about: string;
  department: string;
  interests: string[];
}

const INTERESTS_LIST = ['שחמט', 'קריאה', 'מוזיקה', 'ספורט', 'בישול', 'טבע', 'סרטים', 'פוליטיקה', 'נכדים', 'אקטואליה', 'טיולים', 'אמנות'];

const MOCK_OTHER_PATIENTS: OtherPatient[] = [
  {
    id: 'p1',
    name: 'משה כהן',
    image: 'https://i.pravatar.cc/150?u=p1',
    about: 'פנסיונר של משרד הביטחון, אוהב לשחק שחמט ולדבר על פוליטיקה.',
    department: 'מחלקה ג\'',
    interests: ['שחמט', 'פוליטיקה', 'אקטואליה']
  },
  {
    id: 'p2',
    name: 'רבקה אברהם',
    about: 'סבתא ל-12 נכדים, מורה לשעבר. אוהבת ספרי היסטוריה ובישול.',
    department: 'מחלקה ה\'',
    interests: ['נכדים', 'קריאה', 'בישול']
  },
  {
    id: 'p3',
    name: 'אבי לוי',
    image: 'https://i.pravatar.cc/150?u=p3',
    about: 'חובב ספורט מושבע, במיוחד כדורגל. תמיד שמח לשיחה טובה.',
    department: 'שיקום יום',
    interests: ['ספורט', 'סרטים', 'טיולים']
  },
  {
    id: 'p4',
    name: 'דליה שפירא',
    image: 'https://i.pravatar.cc/150?u=p4',
    about: 'אמנית בנשמה, עוסקת בציור ופיסול. מחפשת פרטנר להליכות בגינה.',
    department: 'מחלקה א\'',
    interests: ['אמנות', 'טבע', 'מוזיקה']
  }
];

const MOCK_TEAM_MEMBERS = [
  { 
    name: 'ד"ר רבקה לוי', 
    role: 'מנהלת מחלקה', 
    image: '👩‍⚕️',
    roleDescription: 'אני מנהלת את המחלקה ואחראית על התווית תוכנית השיקום הרפואית שלך. אני עוקבת אחר ההתקדמות שלך ומקבלת החלטות רפואיות יחד עם הצוות.',
    personalInfo: 'אני אמא ל-3 ילדים, אוהבת לטייל בטבע בשבתות ולקרוא ספרי מתח.'
  },
  { 
    name: 'יוסי כהן', 
    role: 'אח אחראי', 
    image: '👨‍⚕️',
    roleDescription: 'אני מנהל את צוות הסיעוד במחלקה. אנחנו כאן כדי לדאוג לצרכים הרפואיים והיומיומיים שלך, לחלק תרופות ולסייע בכל בקשה.',
    personalInfo: 'אני חובב בישול ואפייה, ובזמני הפנוי אני מתנדב בעמותה למען בעלי חיים.'
  },
  { 
    name: 'רוני גל', 
    role: 'פיזיותרפיסט', 
    image: '🤸',
    roleDescription: 'אני אעבוד איתך על שיפור הניידות, שיווי המשקל והכוח הפיזי שלך באמצעות תרגילים מותאמים אישית.',
    personalInfo: 'אני רץ מרתונים ואוהב לגלוש בים.'
  },
  { 
    name: 'מיכל דוד', 
    role: 'עובדת סוציאלית', 
    image: '📋',
    roleDescription: 'אני כאן כדי ללוות אותך ואת משפחתך בהתמודדות הרגשית והמעשית, ולסייע במיצוי זכויות לקראת השחרור.',
    personalInfo: 'אני מגדלת שני חתולים ואוהבת לצייר בשעות הפנאי.'
  }
];

const STAGE_INFO: Record<string, string[]> = {
  [AppStage.PRE_ADMISSION]: [
    'הכן את כל המסמכים הנדרשים: תעודת זהות, כרטיס קופת חולים וצילומי רנטגן.',
    'הבא בגדים נוחים, פיג\'מה, טואלטיקה ומטען לטלפון.',
    'מומלץ לא להביא חפצי ערך או כסף מזומן.',
    'הגעה מתוכננת בהתאם לשעה שנקבעה עם הצוות.',
  ],
  [AppStage.ADMISSION]: [
    'תעבור קבלה אדמיניסטרטיבית ושיחת אוריינטציה עם האחות.',
    'תוכר לך תוכנית השיקום האישית שלך.',
    'תפגוש את הצוות המטפל: רופא, אחות, פיזיותרפיסט ועו"ס.',
    'ניתן לשאול כל שאלה שעולה — הצוות כאן לעזור.',
  ],
  [AppStage.ACCLIMATIZATION]: [
    'הימים הראשונים נועדו להכרת הסביבה, הצוות והשגרה.',
    'שתף את הצוות בכל קושי פיזי או רגשי שאתה חווה.',
    'תקופת ההתאקלמות היא זמן ללמוד את הרוטינה — אין ציפייה לשלמות.',
    'מומלץ להכיר מטופלים אחרים — קשרים חברתיים מסייעים להחלמה.',
  ],
  [AppStage.REHAB_ROUTINE]: [
    'ההתמדה בטיפולים היא המפתח להחלמה מהירה.',
    'בצע את תרגילי הבית שמומלצים על ידי הצוות.',
    'דווח לצוות על כל שינוי בתחושתך או ברמת הכאב.',
    'אתה יכול לבקש מידע על ההתקדמות שלך בכל עת.',
  ],
  [AppStage.PRE_HOME]: [
    'וודא שהבית מותאם לצרכיך: הסרת מכשולים וידיות אחיזה במקומות הנדרשים.',
    'קבע תור לרופא המשפחה לאחר השחרור.',
    'ודא שיש לך את כל הציוד הנדרש מ"מיד שרה" או חנות ציוד.',
    'אל תהסס לשאול את הצוות על כל הוראה לפני עזיבה.',
  ],
  [AppStage.POST_HOME]: [
    'המשך לבצע את תרגילי הבית שנקבעו על ידי הצוות.',
    'הגע לתורים עם רופא המשפחה ומטפלים במרפאה.',
    'פנה לצוות השיקום אם מתעוררים קשיים בלתי צפויים.',
    'ניתן לפנות לעו"ס גם לאחר השחרור לסיוע בזכויות.',
  ],
};

const MOCK_TOMORROW_SCHEDULE = [
  { id: 't1', time: '08:00', title: 'ארוחת בוקר' },
  { id: 't2', time: '09:00', title: 'פיזיותרפיה' },
  { id: 't3', time: '11:00', title: 'ריפוי בעיסוק' },
  { id: 't4', time: '12:00', title: 'ארוחת צהריים' },
  { id: 't5', time: '14:00', title: 'קלינאות תקשורת' },
  { id: 't6', time: '16:00', title: 'מנוחה' },
];

const MOCK_WEEKLY_SCHEDULE = [
  { day: 'ראשון', items: ['פיזיותרפיה', 'ביקור רופאים', 'ריפוי בעיסוק'] },
  { day: 'שני', items: ['פיזיותרפיה', 'קלינאות תקשורת'] },
  { day: 'שלישי', items: ['פיזיותרפיה', 'ביקור רופאים', 'תרגול עצמאי'] },
  { day: 'רביעי', items: ['ריפוי בעיסוק', 'פיזיותרפיה'] },
  { day: 'חמישי', items: ['פיזיותרפיה', 'ביקור רופאים', 'שיחת עו"ס'] },
  { day: 'שישי', items: ['פיזיותרפיה'] },
  { day: 'שבת', items: ['מנוחה'] },
];

const TeamMemberCard: React.FC<{ member: any }> = ({ member }) => {
  const [expandedSection, setExpandedSection] = useState<'role' | 'personal' | null>(null);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 transition-all" dir="rtl">
      <div className="flex justify-between items-center">
        {/* Right side: Info (Avatar + Text) */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center text-3xl shrink-0">
            {member.image}
          </div>
          <div className="flex flex-col text-right">
            <span className="font-bold text-gray-900 text-base">{member.name}</span>
            <span className="text-sm text-gray-500 font-medium">{member.role}</span>
          </div>
        </div>

        {/* Left side: Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setExpandedSection(expandedSection === 'role' ? null : 'role')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${expandedSection === 'role' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}
          >
            מה התפקיד שלי?
          </button>
          <button
            onClick={() => setExpandedSection(expandedSection === 'personal' ? null : 'personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${expandedSection === 'personal' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
          >
            משהו עליי
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expandedSection && (
        <div className="pt-3 border-t border-gray-50 text-sm text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200 text-right">
          {expandedSection === 'role' ? member.roleDescription : member.personalInfo}
        </div>
      )}
    </div>
  );
};

type Sector = {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: string[];
};

const MOCK_SECTORS: Sector[] = [
  {
    id: 'nursing',
    name: 'סקטור סיעוד וכוח עזר',
    icon: '🏥',
    description: 'צוות הסיעוד מלווה אותך לאורך כל היממה. הם אחראים על מתן תרופות, חבישות, ניטור סימנים חיוניים וסיוע בפעולות יומיומיות.',
    topics: ['חוסר נוחות במיטה', 'סיוע בניידות לחיפוי', 'מתן תרופות בזמן', 'כאבים שגרתיים', 'החלפת חבישה']
  },
  {
    id: 'medicine',
    name: 'סקטור רפואה',
    icon: '🩺',
    description: 'הצוות הרפואי אחראי על האבחון, הטיפול הרפואי, קביעת מינוני תרופות ומעקב אחר מצבך הרפואי הכללי.',
    topics: ['שאלות על מצבי הרפואי', 'שינוי במינון תרופתי', 'כאבים חריגים', 'תוצאות בדיקות']
  },
  {
    id: 'physio',
    name: 'סקטור פיזיותרפיה',
    icon: '🏃',
    description: 'צוות הפיזיותרפיה מתמקד בשיפור הניידות, שיווי המשקל, הכוח והסיבולת שלך, כדי להחזיר אותך לתפקוד מרבי.',
    topics: ['קושי בהליכה', 'תרגילים לחיזוק השרירים', 'שימוש באביזרי הליכה', 'כאבי מפרקים בתנועה']
  },
  {
    id: 'social',
    name: 'סקטור עבודה סוציאלית',
    icon: '🤝',
    description: 'העובדים הסוציאליים מסייעים בהתמודדות הרגשית, מיצוי זכויות, תכנון השחרור הביתה וחיבור למסגרות בקהילה.',
    topics: ['שאלות על זכויות', 'הכנה לשחרור', 'סיוע נפשי', 'עזרה למשפחה']
  }
];

const MOCK_ISSUES = MOCK_SECTORS.flatMap(sector => 
  sector.topics.map(topic => ({ topic, sectorId: sector.id }))
);

const SectorDetails: React.FC<{ sector: Sector }> = ({ sector }) => (
  <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-right space-y-3 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
          <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 text-base">{sector.name}</h3>
              <p className="text-blue-600 font-medium text-xs">הסבר על הסקטור</p>
          </div>
          <div className="w-10 h-10 bg-blue-100/50 rounded-full flex items-center justify-center text-xl shrink-0">
              {sector.icon}
          </div>
      </div>

      <hr className="border-gray-200" />

      <p className="text-gray-700 leading-relaxed text-sm">
          {sector.description}
      </p>

      <div>
          <h4 className="font-semibold text-gray-500 text-xs mb-2">נושאים לפנייה לסקטור זה:</h4>
          <div className="flex flex-wrap gap-1.5">
              {sector.topics.map(topic => (
                  <span key={topic} className="bg-white text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 shadow-sm">
                      {topic}
                  </span>
              ))}
          </div>
      </div>
  </div>
);

const WhoToContactView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'issues' | 'sectors'>('issues');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-blue-600">למי עליי לפנות?</h2>

            <div className="flex bg-gray-100 p-1 rounded-full">
                <button
                    onClick={() => { setActiveTab('issues'); setExpandedId(null); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'issues' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                    סוגיות ושאלות
                </button>
                <button
                    onClick={() => { setActiveTab('sectors'); setExpandedId(null); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'sectors' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                    סקטורים
                </button>
            </div>
        </div>

        {activeTab === 'issues' ? (
            <div className="space-y-2">
                <p className="text-gray-600 text-sm mb-3">בחרו סוגיה או שאלה כדי לדעת למי לפנות:</p>
                {MOCK_ISSUES.map((issue, idx) => {
                    const isExpanded = expandedId === `issue-${idx}`;
                    const sector = MOCK_SECTORS.find(s => s.id === issue.sectorId);
                    return (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                            <button 
                                onClick={() => setExpandedId(isExpanded ? null : `issue-${idx}`)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-800 text-sm">{issue.topic}</span>
                                <svg className={`w-4 h-4 text-blue-400 transform transition-transform duration-200 ${isExpanded ? '-rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            {isExpanded && sector && <SectorDetails sector={sector} />}
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="space-y-2">
                <p className="text-gray-600 text-sm mb-3">בחרו סקטור כדי לראות באילו נושאים הוא מטפל:</p>
                {MOCK_SECTORS.map((sector) => {
                    const isExpanded = expandedId === `sector-${sector.id}`;
                    return (
                        <div key={sector.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                            <button 
                                onClick={() => setExpandedId(isExpanded ? null : `sector-${sector.id}`)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{sector.icon}</span>
                                    <span className="font-medium text-gray-800 text-sm">{sector.name}</span>
                                </div>
                                <svg className={`w-4 h-4 text-blue-400 transform transition-transform duration-200 ${isExpanded ? '-rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            {isExpanded && <SectorDetails sector={sector} />}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.ACCLIMATIZATION);
  const [activeTab, setActiveTab] = useState('home' as Tab);
  const [infoSubView, setInfoSubView] = useState('grid' as InfoSubView);

  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
  const [infoSearchTerm, setInfoSearchTerm] = useState('');
  
  const [userIntro, setUserIntro] = useState<{about: string, interests: string[], consent: boolean} | null>(null);
  const [showIntroForm, setShowIntroForm] = useState(false);
  const [showSocialActivityPopup, setShowSocialActivityPopup] = useState(false);
  const [joinedSocialActivity, setJoinedSocialActivity] = useState(false);
  const [showPhysioReminder, setShowPhysioReminder] = useState(false);
  const [showDaySummary, setShowDaySummary] = useState(false);
  const [scheduleView, setScheduleView] = useState<'today' | 'tomorrow' | 'weekly'>('today');
  const [personalSubTab, setPersonalSubTab] = useState<'medical' | 'goals'>('medical');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{id: number, sender: 'user'|'bot', text: string}[]>([]);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showStageProgress, setShowStageProgress] = useState(true);
  const [showStageInfo, setShowStageInfo] = useState(false);
  const [daySummaryMood, setDaySummaryMood] = useState<string | null>(null);
  const [viewingSessionSummary, setViewingSessionSummary] = useState<string | null>(null);

  const sessionSummaries: Record<string, TreatmentSummary> = useMemo(() => ({
    's2': {
      date: '26.1.2026',
      therapistName: 'מיכל לוין',
      therapistAvatar: '👩‍⚕️',
      sharedRecords: ['טווח תנועה בקרסול ימין השתפר ב-10 מעלות', 'דיווח על ירידה בכאב בזמן הליכה'],
      goals: ['מעבר עצמאי ממיטה לכיסא גלגלים', 'הליכה של 20 מטר עם הליכון'],
      selfPractice: ['חיזוק קרסוליים - 3 סטים של 10 חזרות', 'תרגילי שיווי משקל בישיבה - 5 דקות'],
      limitationChanges: ['איסור דריכה על רגל ימין'],
      helpfulResources: [
        { title: 'סרטון: תרגילי חיזוק קרסול', type: 'video' },
        { title: 'מדריך: הליכה בטוחה עם הליכון', type: 'info' },
      ],
      nextSessionDate: '24.05.2024',
      nextSessionTime: '09:30',
    },
  }), []);
  const [tempAbout, setTempAbout] = useState('');
  const [tempInterests, setTempInterests] = useState<string[]>([]);
  const [tempConsent, setTempConsent] = useState(false);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [notes, setNotes] = useState([
    { id: 1, date: '22.05.2024', title: 'שאלות לנעמה', content: 'לברר לגבי התרגילים של הערב והאם אפשר לקבל עוד כרית לשינה' },
    { id: 2, date: '21.05.2024', title: 'דברים לדבר עם רבקה', content: 'האם יש אפשרות להקדים את הטיפול מחר? אני מרגיש עייפות רבה בבקרים' }
  ]);
  const [activeNote, setActiveNote] = useState<{id?: number, date?: string, title: string, content: string, media?: {url: string, type: 'image' | 'video'} | null} | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [exerciseFilter, setExerciseFilter] = useState<'today' | 'all'>('today');
  const [exercisesList, setExercisesList] = useState([
    { id: 'ex1', category: 'פיזיותרפיה', title: 'פיזיותרפיה נשימתית', type: 'wisecare', icon: '🫁', completed: false },
    { id: 'ex2', category: 'פיזיותרפיה', title: 'חיזוק קרסוליים', type: 'page', icon: '🦶', completed: false },
    { id: 'ex3', category: 'ריפוי בעיסוק', title: 'לבישת חולצה - תרגול רצף', type: 'page', icon: '👕', completed: true }
  ]);

  const toggleExercise = (id: string) => {
    setExercisesList(prev => prev.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex));
  };

  const currentChecklist = useMemo(() => checklist[currentStage] || [], [checklist, currentStage]);
  const completedChecklistCount = useMemo(() => currentChecklist.filter(i => i.completed).length, [currentChecklist]);
  const totalChecklistCount = currentChecklist.length;
  const completionPercentage = useMemo(() => Math.round((completedChecklistCount / (totalChecklistCount || 1)) * 100), [completedChecklistCount, totalChecklistCount]);

  // Logic for release approval: Check if specific briefing items are completed
  const isReleaseApproved = useMemo(() => {
    const preHomeChecklist = checklist[AppStage.PRE_HOME] || [];
    const briefingIds = ['br_physio', 'br_ot', 'br_speech', 'br_nursing', 'br_social', 'br_doctor'];
    const briefingItems = preHomeChecklist.filter(i => briefingIds.includes(i.id));
    return briefingItems.length > 0 && briefingItems.every(i => i.completed);
  }, [checklist]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => {
      const newChecklist = { ...prev };
      for (const stage in newChecklist) {
        const stageKey = stage as AppStage;
        const itemIdx = newChecklist[stageKey].findIndex(i => i.id === id);
        if (itemIdx > -1) {
          const newItems = [...newChecklist[stageKey]];
          newItems[itemIdx] = { ...newItems[itemIdx], completed: !newItems[itemIdx].completed };
          newChecklist[stageKey] = newItems;
          break;
        }
      }
      return newChecklist;
    });
  };

  const toggleScheduleItem = (id: string) => {
    const item = schedule.find(i => i.id === id);
    if (!item) return;
    // If already completed and has a session summary, show it
    if (item.completed && sessionSummaries[id]) {
      setViewingSessionSummary(id);
      return;
    }
    if (!item.completed && id === 's2' && currentStage === AppStage.REHAB_ROUTINE) {
      setShowPhysioReminder(true);
    }
    setSchedule(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSaveIntro = () => {
    if (!tempAbout.trim()) return;
    setUserIntro({ about: tempAbout, interests: tempInterests, consent: tempConsent });
    setShowIntroForm(false);
  };

  const toggleTempInterest = (interest: string) => {
    setTempInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const infoTopics = useMemo(() => [
    { label: 'חזרה הביתה', icon: '🏡', view: 'home-prep-hub' as InfoSubView },
    { label: 'המחלקה שלי', icon: '🏥', view: 'ward' as InfoSubView },
    { label: 'למי עליי לפנות?', icon: '💬', view: 'who-to-contact' as InfoSubView },
    { label: 'עצירות', icon: '🚽', view: 'constipation' as InfoSubView },
    { label: 'שינה', icon: '😴', view: 'sleep' as InfoSubView },
    { label: 'כאבים', icon: '🤕', view: 'pain' as InfoSubView },
    { label: 'לחץ', icon: '🧘', view: 'stress' as InfoSubView },
    { label: 'זוגיות ומיניות', icon: '❤️', view: 'sexuality' as InfoSubView },
    { label: 'זכויות סוציאליות', icon: '⚖️', view: 'social-rights' as InfoSubView },
    { label: 'חוזה טיפולי', icon: '📜', view: 'therapeutic-contract' as InfoSubView },
    { label: 'פניות ציבור', icon: '📩', view: 'public-enquiries' as InfoSubView },
    { label: 'שאלות ותשובות', icon: '💡', view: 'faq' as Tab },
    { label: 'צוות המחלקה', icon: '🧑‍⚕️', view: 'team' as InfoSubView },
    { label: 'סל השירותים', icon: '🎁', view: 'service-basket' as InfoSubView },
    { label: 'היכרות עם מטופלים', icon: '👥', view: 'meeting-patients' as InfoSubView },
    { label: 'מפת בית החולים', icon: '📍', view: 'grid' as InfoSubView },
  ], []);

  const filteredInfoTopics = useMemo(() => {
    return infoTopics.filter(topic => 
      topic.label.toLowerCase().includes(infoSearchTerm.toLowerCase())
    );
  }, [infoTopics, infoSearchTerm]);

  const renderChecklistWidget = (items: ChecklistItem[], title: string, showBack: boolean = false) => {
    const completedCount = items.filter(i => i.completed).length;
    const totalCount = items.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3 text-right" dir="rtl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {showBack && (
            <button onClick={() => setActiveTab('home')} className="text-blue-600 font-semibold text-sm hover:underline">
              חזרה
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">הושלמו {completedCount} מתוך {totalCount} משימות</span>
            <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-colors text-xs font-semibold">
              <span>+</span>
              <span>הוספת משימה</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                item.completed 
                  ? 'bg-blue-50 border-blue-100' 
                  : 'bg-white border-gray-100 hover:border-blue-200'
              }`}
            >
               <span className={`font-bold text-xs flex-1 text-right ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                 {item.text}
               </span>
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                 item.completed ? 'bg-blue-600 text-white' : 'border-2 border-gray-200'
               }`}>
                 {item.completed && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBackButton = () => (
    <button 
      onClick={() => setActiveTab('home')} 
      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold text-sm mb-1 transition-colors self-start"
    >
      <span className="text-lg">🏠</span>
      <span>חזרה לבית</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        const isPreHomeStage = currentStage === AppStage.PRE_HOME;
        const isPreAdmissionStage = currentStage === AppStage.PRE_ADMISSION;
        const isAdmissionStage = currentStage === AppStage.ADMISSION;

        const homeIcons = isPreHomeStage ? [
          { label: 'הכנה לחזרה הביתה', icon: '🏡', view: 'home-prep-hub' as InfoSubView },
          { label: 'שאלות ותשובות', icon: '💡', view: 'faq' as any },
          { label: 'טיפים שימושיים', icon: '✨', view: 'prep-tips' as InfoSubView },
          { label: 'צ\'קליסט הכנה', icon: '✅', action: () => setActiveTab('checklist') },
        ] : isPreAdmissionStage ? [
          { label: 'היכרות עם רעות', icon: 'ℹ️', view: 'about-reut' as InfoSubView },
          { label: 'המחלקה שלי', icon: '🏥', view: 'ward' as InfoSubView },
          { label: 'צוות המחלקה', icon: '🧑‍⚕️', view: 'team' as InfoSubView },
          { label: 'שאלות ותשובות', icon: '💡', view: 'faq' as any },
        ] : isAdmissionStage ? [
          { label: 'המחלקה שלי', icon: '🏥', view: 'ward' as InfoSubView },
          { label: 'צוות המחלקה', icon: '🧑‍⚕️', view: 'team' as InfoSubView },
          { label: 'שאלות ותשובות', icon: '💡', view: 'faq' as any },
          { label: 'היכרות עם רעות', icon: 'ℹ️', view: 'about-reut' as InfoSubView },
          { label: 'מפת בי"ח', icon: '📍', view: 'grid' as InfoSubView },
        ] : [
          { label: 'היכרות עם מטופלים', icon: '👥', view: 'meeting-patients' as InfoSubView },
          { label: 'למי עליי לפנות?', icon: '💬', view: 'who-to-contact' as InfoSubView },
          { label: 'צוות המחלקה', icon: '🧑‍⚕️', view: 'team' as InfoSubView },
          { label: 'סל השירותים', icon: '🎁', view: 'service-basket' as InfoSubView },
          { label: 'מפת בי"ח', icon: '📍', view: 'grid' as InfoSubView },
        ];

        return (
          <div className="space-y-3 animate-in fade-in duration-300 text-right" dir="rtl">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                ערב טוב ישראל 🌙
              </h2>
              <p className="text-sm font-medium text-gray-600">
                שלב טיפול נוכחי: <span className="text-blue-600 font-semibold">{currentStage}</span>, מועד שחרור: <span className="text-blue-600 font-semibold">{isPreHomeStage ? '23.05.2024' : 'טרם נקבע'}</span>
              </p>
            </div>
            
            {showStageProgress && (
              <StatusProgress currentStage={currentStage} onStageChange={setCurrentStage} onClose={() => setShowStageProgress(false)} />
            )}

            {isPreHomeStage && (
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 shadow-sm animate-in slide-in-from-top-4 duration-500">
                <p className="text-sm font-semibold text-blue-800 leading-snug">
                  הצוות עדכן את תאריך החזרה הביתה שלך!
                </p>
                <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                  מוזמן לקרוא את המידע שיסייע לך בהכנה ולבצע את המשימות הנדרשות.
                </p>
              </div>
            )}

            {isPreAdmissionStage && (
              <div className="mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                 <div className="space-y-3">
                   <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border-4 border-white relative cursor-pointer group">
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                       <div className="text-white text-center relative z-10">
                           <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform">
                               <span className="text-2xl">▶️</span>
                           </div>
                           <p className="font-medium text-sm">היכרות עם בית החולים</p>
                       </div>
                   </div>
                 </div>
                 {renderChecklistWidget(currentChecklist, 'רשימת הכנות להגעה', false)}
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              {isPreHomeStage && (
                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">סטטוס אישור יציאה</span>
                  {isReleaseApproved ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-2xl border border-green-100 animate-in zoom-in duration-500">
                       <span className="text-base">✅</span>
                       <span className="font-semibold text-sm">התקבל אישור יציאה הביתה</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-2xl border border-red-100 animate-pulse">
                        <span className="text-base">⏳</span>
                        <span className="font-semibold text-sm">טרם התקבל אישור יציאה הביתה</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">האישור יתקבל לאחר סיום כל התדרוכים הנדרשים בצ'קליסט.</p>
                    </div>
                  )}
                </div>
              )}

              {!isPreAdmissionStage && isAdmissionStage && (
                <>{renderChecklistWidget(currentChecklist, 'צ\'קליסט תהליך קבלה', false)}</>
              )}

              {!isPreAdmissionStage && !isAdmissionStage && (
                <>
                  {currentStage !== AppStage.REHAB_ROUTINE && (
                    <WidgetCard
                      noHeaderBorder
                      title={
                        <div className="flex flex-col gap-1 w-full text-right py-1">
                          <span className="text-gray-800 text-sm font-semibold">המשימות שלי לביצוע בשלב זה</span>
                        </div>
                      }
                      icon={<span className="text-blue-500 font-semibold">✓</span>}
                    >
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
                      </div>
                      <button onClick={() => setActiveTab('checklist')} className="text-blue-600 text-xs font-semibold mt-2.5 block text-right">צפייה בכל המשימות ({completionPercentage}%)</button>
                    </WidgetCard>
                  )}

                  <WidgetCard
                    title="לו״ז יומי"
                    icon="📅"
                    action={
                      <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                        <button onClick={() => setScheduleView('today')} className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-all ${scheduleView === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>היום</button>
                        <button onClick={() => setScheduleView('tomorrow')} className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-all ${scheduleView === 'tomorrow' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>מחר</button>
                        <button onClick={() => setScheduleView('weekly')} className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-all ${scheduleView === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>שבועי</button>
                      </div>
                    }
                  >
                    {scheduleView === 'today' && (
                      <div className="space-y-1.5">
                        {schedule.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleScheduleItem(item.id)}
                            className={`flex gap-3 items-center text-sm py-2.5 px-2 rounded-xl cursor-pointer transition-all ${
                              item.completed ? 'bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                              item.completed ? 'bg-blue-600 text-white' : 'border-2 border-gray-200'
                            }`}>
                              {item.completed && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="font-semibold text-gray-400 w-10 text-xs">{item.time}</span>
                            <p className={`font-medium truncate flex-1 text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.title}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {scheduleView === 'tomorrow' && (
                      <div className="space-y-1.5">
                        {MOCK_TOMORROW_SCHEDULE.map((item) => (
                          <div key={item.id} className="flex gap-3 items-center text-sm py-2.5 px-2 rounded-xl">
                            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 shrink-0" />
                            <span className="font-semibold text-gray-400 w-10 text-xs">{item.time}</span>
                            <p className="font-medium text-gray-900 truncate flex-1 text-sm">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {scheduleView === 'weekly' && (
                      <div className="space-y-2">
                        {MOCK_WEEKLY_SCHEDULE.map((day) => (
                          <div key={day.day} className="flex items-start gap-3 py-1">
                            <span className="text-xs font-bold text-gray-500 w-10 shrink-0 pt-0.5 text-right">{day.day}</span>
                            <div className="flex flex-wrap gap-1 flex-1">
                              {day.items.map((item, i) => (
                                <span key={i} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg font-medium">{item}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </WidgetCard>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setShowStageInfo(v => !v)}
                      className="w-full px-4 py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-blue-500">💡</span>
                        <span className="font-semibold text-gray-800 text-sm">מידע שיכול לעזור לי בשלב זה</span>
                      </div>
                      <span className={`text-gray-400 text-xs transition-transform duration-200 ${showStageInfo ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {showStageInfo && (
                      <div className="border-t border-gray-50">
                        <div className={`grid ${homeIcons.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'} gap-1.5 px-4 pt-3 pb-3`}>
                          {homeIcons.map(topic => (
                            <button
                              key={topic.label}
                              onClick={() => {
                                if (topic.view === 'service-basket' && currentStage === AppStage.ACCLIMATIZATION && !joinedSocialActivity) {
                                  setShowSocialActivityPopup(true);
                                  return;
                                }
                                if ((topic as any).action) {
                                  (topic as any).action();
                                } else if (topic.view === 'faq') {
                                  setActiveTab('faq');
                                } else {
                                  setActiveTab('info');
                                  setInfoSubView(topic.view as InfoSubView);
                                }
                              }}
                              className="flex flex-col items-center gap-1.5 transition-all active:scale-90 group"
                            >
                              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-xl shadow-sm border border-blue-100/30 group-hover:bg-blue-100 transition-colors">
                                {topic.icon}
                              </div>
                              <span className="text-[10px] font-medium text-gray-600 text-center leading-tight h-5 flex items-center overflow-hidden px-1">
                                {topic.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {STAGE_INFO[currentStage] && (
                          <div className="px-4 pb-4 space-y-2.5 border-t border-gray-50 pt-3">
                            {STAGE_INFO[currentStage].map((item, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                <span className="text-blue-400 mt-0.5 shrink-0 font-bold">•</span>
                                <p className="leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'info':
        const sendChatMessage = (text: string) => {
          if (!text.trim()) return;
          setChatMessages(prev => [
            ...prev,
            { id: Date.now(), sender: 'user', text },
            { id: Date.now() + 1, sender: 'bot', text: 'מחפש עבורך מידע... 🔍 נסה לבחור אחד מהנושאים המוצעים למטה.' }
          ]);
          setChatInput('');
        };

        return (
          <div className="text-right" dir="rtl">
            {infoSubView !== 'grid' && (
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => {
                    if (infoSubView === 'home-prep-hub' || infoSubView === 'service-basket') {
                        setInfoSubView('grid');
                    } else if (['prep-video', 'prep-tips', 'prep-continuum', 'prep-social', 'prep-rights', 'prep-sexuality', 'prep-date-info'].includes(infoSubView)) {
                        setInfoSubView('home-prep-hub');
                    } else if (['sb-physio-equip', 'sb-yoga', 'sb-comp-med', 'sb-equip-rent', 'sb-security', 'sb-stay-permit', 'sb-research', 'sb-xray', 'sb-tv'].includes(infoSubView)) {
                        setInfoSubView('service-basket');
                    } else {
                        setInfoSubView('grid');
                    }
                }} className="text-blue-600 font-semibold text-sm">חזרה</button>
                <h2 className="text-base font-bold text-gray-900">העוזר האישי שלי</h2>
              </div>
            )}

            {infoSubView === 'grid' ? (
              <div className="flex flex-col gap-3 pb-2">

                {/* Chat header */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">העוזר האישי שלי</h2>
                </div>

                {/* Messages area */}
                <div className="space-y-3">
                  {/* Welcome bubble */}
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mb-0.5">
                      <span className="text-white text-xs">💬</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-sm text-gray-800 leading-relaxed">שלום! אני העוזר האישי שלך בבית החולים רעות.</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">תוכל לשאול אותי שאלות, לחפש מידע או לבחור נושא מהכפתורים למטה 👇</p>
                    </div>
                  </div>

                  {/* Dynamic chat messages */}
                  {chatMessages.map(msg => (
                    msg.sender === 'user' ? (
                      <div key={msg.id} className="flex justify-start">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] shadow-sm">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex items-end gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mb-0.5">
                          <span className="text-white text-xs">💬</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
                          <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Suggestion topics */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-2 px-1">הצעות לשאלות נפוצות</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'סל השירותים', icon: '🎁', view: 'service-basket' as InfoSubView },
                      { label: 'היכרות עם מטופלים', icon: '👥', view: 'meeting-patients' as InfoSubView },
                      { label: 'כאבים', icon: '🩹', view: 'pain' as InfoSubView },
                      { label: 'צוות המחלקה', icon: '🧑‍⚕️', view: 'team' as InfoSubView },
                      { label: 'מפת בית החולים', icon: '📍', view: 'about-reut' as InfoSubView },
                      { label: 'המחלקה שלי', icon: '🏥', view: 'ward' as InfoSubView },
                    ].map(s => (
                      <button
                        key={s.label}
                        onClick={() => setInfoSubView(s.view)}
                        className="bg-white border border-gray-100 rounded-2xl p-2.5 flex flex-col items-center gap-1.5 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
                      >
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className="mt-1.5 mx-auto block text-xs text-gray-400 hover:text-blue-500 transition-colors py-1 px-3"
                  >
                    להצעות נוספות ›
                  </button>
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                  <button
                    onClick={() => setIsVoiceRecording(v => !v)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${isVoiceRecording ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    🎙️
                  </button>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(chatInput); }}
                    placeholder={isVoiceRecording ? 'מקליט...' : 'הקלד או הקלט את השאלה שלך...'}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 text-right"
                    dir="rtl"
                  />
                  <button
                    onClick={() => sendChatMessage(chatInput)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${chatInput.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-gray-100 text-gray-300'}`}
                  >
                    <svg className="w-4 h-4 scale-x-[-1]" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                </div>

              </div>
            ) : infoSubView === 'home-prep-hub' ? (
                <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-gray-700 leading-relaxed">
                            לאחר תקופה מסוימת בבית החולים תחזור לביתך ותמשיך את תהליך השיקום בבית. המידע שבדף זה נועד לעזור לך להיערך בהתאם ולהבטיח מעבר חלק ובטוח.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { label: 'שאלות ותשובות שחרור', icon: '💡', action: () => setActiveTab('faq') },
                            { label: 'סרטון הכנה ליציאה', icon: '🎬', view: 'prep-video' },
                            { label: 'טיפים שימושיים', icon: '✨', view: 'prep-tips' },
                            { label: 'צ\'קליסט הכנה', icon: '✅', action: () => setActiveTab('checklist'), badge: true },
                            { label: 'מסגרות המשך', icon: '🔗', view: 'prep-continuum' },
                            { label: 'פנאי וחברה', icon: '🎭', view: 'prep-social' },
                            { label: 'זכויות ועבודה', icon: '⚖️', view: 'prep-rights' },
                            { label: 'מיניות וזוגיות', icon: '❤️', view: 'prep-sexuality' },
                            { label: 'איך נקבע תאריך?', icon: '📅', view: 'prep-date-info' },
                        ].map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => item.action ? item.action() : setInfoSubView(item.view as InfoSubView)}
                                className="relative p-2 h-28 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center hover:bg-blue-50 transition-all active:scale-95 group"
                            >
                                {item.badge && <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm" />}
                                <span className="text-xl mb-1">{item.icon}</span>
                                <span className="text-xs font-medium text-gray-700 text-center leading-tight px-1">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : infoSubView === 'prep-video' ? (
                <div className="space-y-3 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600 text-right">סרטון הכנה ליציאה הביתה</h3>
                    <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                        <div className="text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                                <span className="text-2xl">▶️</span>
                            </div>
                            <p className="font-medium text-sm">לחץ להפעלת הסרטון</p>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">בסרטון זה נציג לכם את השלבים המרכזיים ביום השחרור, נדגים כיצד להיערך לבית ונשתף מניסיונם של מטופלים אחרים.</p>
                </div>
            ) : infoSubView === 'prep-tips' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600">טיפים שימושיים ליום שאחרי</h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700">
                            ✨ סדרו את הבית מראש: הסירו שטיחים וחוטי חשמל שעלולים להכשיל.
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700">
                            ✨ הכינו מראש את התרופות לשבוע הראשון בבית.
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700">
                            ✨ שמרו על קשר עם הקהילה וקבעו תורים מראש לביקורת.
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'prep-date-info' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600">איך נקבע תאריך החזרה הביתה?</h3>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-gray-700 text-sm leading-relaxed">
                        <p>קביעת תאריך השחרור היא תהליך משותף של הצוות הרב-מקצועי (רופאים, פיזיותרפיסטים, עו"ס ועוד) יחד איתך ועם בני משפחתך.</p>
                        <p>ההחלטה מתבססת על:</p>
                        <ul className="list-disc list-inside space-y-2 pr-2">
                            <li>עמידה ביעדים השיקומיים שהוגדרו.</li>
                            <li>מוכנות פיזית ותפקודית לשהות בבית.</li>
                            <li>וידוא סביבת מגורים מותאמת ובטוחה.</li>
                        </ul>
                    </div>
                </div>
            ) : infoSubView === 'constipation' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">התמודדות עם עצירות</h2>
                    
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-gray-700 leading-relaxed text-center">
                            עצירות היא תופעה נפוצה בשיקום, והיא לרוב נובעת משינוי בפעילות הגופנית, תרופות או שינוי בתזונה. אל דאגה, יש לנו מגוון דרכים לסייע לך!
                        </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <span className="text-3xl opacity-80">🎬</span>
                            <div className="absolute inset-0 flex items-center justify-center mt-2">
                                <div className="bg-blue-500 text-white rounded-md p-1.5 shadow-md">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                                </div>
                            </div>
                        </div>
                        <p className="font-semibold text-gray-700 text-sm">סרטון: תרגול פיזיותרפיה לרצפת אגן</p>
                    </div>

                    <div className="pt-2">
                        <h3 className="font-semibold text-gray-500 text-sm mb-3">מה ניתן לעשות?</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                                    🦶
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">לבקש שרפרף לרגליים</h4>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">משפר את זווית הישיבה ומקל על היציאה</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-2xl shrink-0">
                                    📍
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">טיפול בדיקור סיני</h4>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">מעודד את פעילות המעיים (בתשלום נוסף)</p>
                                </div>
                                <button className="text-blue-600 font-semibold text-sm shrink-0">
                                    לפרטים
                                </button>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">
                                    💊
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">תרופת נורמלקס</h4>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">ריכוך היציאות - יש להתייעץ עם הרופא המטפל</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'service-basket' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">סל השירותים</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: 'אביזרי פיזיותרפיה', icon: '🏋️', view: 'sb-physio-equip' },
                            { label: 'טיפולי יוגה', icon: '🧘‍♀️', view: 'sb-yoga' },
                            { label: 'רפואה משלימה', icon: '🌿', view: 'sb-comp-med' },
                            { label: 'רכישת/השכרת ציוד', icon: '🦽', view: 'sb-equip-rent' },
                            { label: 'ביטחון ומקלטים', icon: '🛡️', view: 'sb-security' },
                            { label: 'אישור שהייה', icon: '📄', view: 'sb-stay-permit' },
                            { label: 'השתתפות במחקרים', icon: '🔬', view: 'sb-research' },
                            { label: 'דיסק רנטגן', icon: '💿', view: 'sb-xray' },
                            { label: 'שירותי טלוויזיה', icon: '📺', view: 'sb-tv' },
                        ].map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setInfoSubView(item.view as InfoSubView)}
                                className="p-1.5 h-24 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center hover:bg-blue-50 transition-all active:scale-95 group"
                            >
                                <span className="text-xl mb-0.5">{item.icon}</span>
                                <span className="text-xs font-medium text-gray-700 text-center leading-tight px-1">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : infoSubView === 'sb-physio-equip' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">רכישת אביזרי פיזיותרפיה</h2>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            <li className="p-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">גומיות התנגדות (טרה-בנד)</span>
                                <span className="text-blue-600 font-semibold">35 ₪</span>
                            </li>
                            <li className="p-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">כדור פיזיו (65 ס"מ)</span>
                                <span className="text-blue-600 font-semibold">60 ₪</span>
                            </li>
                            <li className="p-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">משקוליות יד (1 ק"ג)</span>
                                <span className="text-blue-600 font-semibold">45 ₪</span>
                            </li>
                            <li className="p-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">פדאלים לאימון בישיבה</span>
                                <span className="text-blue-600 font-semibold">120 ₪</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-xs text-gray-500 font-medium text-center mt-2">הרכישה מתבצעת במכון הפיזיותרפיה בשעות הפעילות.</p>
                </div>
            ) : infoSubView === 'sb-yoga' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">טיפולי יוגה</h2>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <p className="text-gray-700 font-medium text-sm">טיפולי יוגה מותאמים אישית מסייעים בשיפור הגמישות, הנשימה והרוגע הנפשי במהלך השיקום.</p>
                        
                        <div className="bg-blue-50 p-4 rounded-2xl space-y-3">
                            <h3 className="font-bold text-blue-800">תיאום תור ועלויות</h3>
                            <ul className="space-y-2 text-sm text-blue-900 font-medium">
                                <li className="flex items-center gap-2"><span>📞</span> <span>לתיאום ישיר מול המטפל: 050-1234567 (יעל)</span></li>
                                <li className="flex items-center gap-2"><span>💰</span> <span>עלות טיפול (45 דק'): 150 ₪</span></li>
                                <li className="flex items-center gap-2"><span>💳</span> <span>בירור ותשלום מתבצע מול משרד הקבלה.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'sb-xray' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">דיסק רנטגן</h2>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center">
                        <span className="text-3xl block mb-2">💿</span>
                        <p className="text-gray-700 font-medium text-sm">
                            ניתן לרכוש עותק דיגיטלי (דיסק) של צילומי הרנטגן שבוצעו במהלך האשפוז ברעות.
                        </p>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 inline-block">
                            <p className="font-bold text-gray-800">הרכישה מתבצעת במשרד הקבלה הראשי.</p>
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'sb-tv' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">שירותי טלוויזיה</h2>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><span className="text-lg">📺</span> חיבור וניתוק</h3>
                            <p className="text-sm text-gray-600 font-medium">ניתן לבקש חיבור או ניתוק של שירותי הטלוויזיה דרך משרד הקבלה או בעמדת האחיות.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><span className="text-lg">💳</span> עלויות ושיטת חיוב</h3>
                            <p className="text-sm text-gray-600 font-medium">החיוב מתבצע לפי ימי אשפוז בפועל (חישוב יחסי). התשלום יוסדר במעמד השחרור או בסוף חודש קלנדרי.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><span className="text-lg">📡</span> עדכון ערוצים ותקלות</h3>
                            <p className="text-sm text-gray-600 font-medium">במקרה של תקלה או צורך בעדכון ערוצים, יש לפנות למוקד התחזוקה (שלוחה 1234) או לעדכן את כוח העזר במחלקה.</p>
                        </div>
                    </div>
                </div>
            ) : ['sb-comp-med', 'sb-equip-rent', 'sb-security', 'sb-stay-permit', 'sb-research'].includes(infoSubView) ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">
                        {infoSubView === 'sb-comp-med' ? 'טיפולי רפואה משלימה' :
                         infoSubView === 'sb-equip-rent' ? 'רכישת והשכרת ציוד' :
                         infoSubView === 'sb-security' ? 'ביטחון אישי ומקלטים' :
                         infoSubView === 'sb-stay-permit' ? 'הנפקת אישור שהייה' :
                         'השתתפות במחקרים'}
                    </h2>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <span className="text-2xl mb-4 block">🚧</span>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">עמוד בבנייה</h3>
                        <p className="text-gray-500 font-medium text-sm">התוכן לעמוד זה יעודכן בקרוב.</p>
                    </div>
                </div>
            ) : ['sleep', 'pain', 'stress', 'sexuality', 'social-rights'].includes(infoSubView) ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <h2 className="text-lg font-bold text-blue-600 mb-4">
                        {infoTopics.find(t => t.view === infoSubView)?.label}
                    </h2>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <span className="text-2xl mb-4 block">🚧</span>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">עמוד בבנייה</h3>
                        <p className="text-gray-500 font-medium text-sm">התוכן לעמוד זה יעודכן בקרוב.</p>
                    </div>
                </div>
            ) : infoSubView === 'ward' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 text-right" dir="rtl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-blue-600">מחלקה ה'</h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors">
                                יצירת קשר
                            </button>
                            <button 
                                onClick={() => setInfoSubView('team')}
                                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors"
                            >
                                צוות המחלקה
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📍</span>
                            <h3 className="font-semibold text-gray-900 text-base">הוראות הגעה למחלקה</h3>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed text-center">
                            המחלקה ממוקמת בבניין הראשי, קומה 2.<br/>
                            יש לעלות במעליות הלובי הראשי ולפנות שמאלה ביציאה מהמעלית.
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📅</span>
                            <h3 className="font-semibold text-gray-900 text-base">סדר יום ושעות ביקור</h3>
                        </div>
                        
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center space-y-1">
                            <p className="text-blue-600 font-bold text-xs">שעות ביקור</p>
                            <p className="font-semibold text-gray-900 text-base">כל יום: 16:00 - 20:00</p>
                            <p className="text-gray-500 font-medium text-xs">בשבתות וחגים: 10:00 - 20:00</p>
                        </div>

                        <div className="space-y-2 pt-1">
                            <p className="text-gray-500 font-bold text-xs text-center">סדר יום כללי</p>
                            <ul className="space-y-1.5 text-xs text-gray-700 font-medium flex flex-col items-center">
                                <li className="flex items-center gap-1"><span>•</span><span>08:00 - ארוחת בוקר וטיפולים</span></li>
                                <li className="flex items-center gap-1"><span>•</span><span>12:30 - ארוחת צהריים ומנוחה</span></li>
                                <li className="flex items-center gap-1"><span>•</span><span>18:30 - ארוחת ערב</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🖼️</span>
                            <h3 className="font-semibold text-gray-900 text-base">תמונות מהמחלקה</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-[4/3] bg-gray-100 rounded-xl"></div>
                            <div className="aspect-[4/3] bg-gray-100 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'team' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600">צוות המחלקה</h3>
                    <div className="flex flex-col gap-3">
                        {MOCK_TEAM_MEMBERS.map((member, idx) => (
                            <TeamMemberCard key={idx} member={member} />
                        ))}
                    </div>
                </div>
            ) : infoSubView === 'who-to-contact' ? (
                <WhoToContactView />
            ) : infoSubView === 'about-reut' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600">היכרות עם רעות</h3>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-gray-700 text-sm leading-relaxed">
                        <p>מרכז רפואי שיקומי רעות תל אביב הוא בית חולים ציבורי, בבעלות עמותת "רעות" – שירות נשים סוציאלי, מהוותיקות בישראל.</p>
                        <p>בית החולים מסונף לפקולטה לרפואה באוניברסיטת תל אביב ומכשיר סטודנטים לרפואה ולמקצועות הבריאות.</p>
                        <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">🏥</span>
                        </div>
                    </div>
                </div>
            ) : infoSubView === 'meeting-patients' ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <h3 className="text-lg font-bold text-blue-600">היכרות עם מטופלים</h3>
                    <div className="text-xs font-bold text-gray-500 text-right leading-relaxed">אתה לא לבד! ליצירת קשרים בבית החולים יש תפקיד חשוב בתהליך השיקומי.</div>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-gray-600 flex-1 text-right">גם לך יש מקום כאן! שתף קצת על עצמך.</p>
                      <button
                        onClick={() => setShowIntroForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap active:scale-95 transition-all shadow-sm"
                      >
                        לשאלון היכרות
                      </button>
                    </div>
                    <p className="text-xs font-medium text-gray-400 text-right">מטופלים (לחץ לצפייה בפרטים)</p>
                    <div className="space-y-4">
                        {MOCK_OTHER_PATIENTS.map(patient => (
                            <div key={patient.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    {patient.image ? <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-2xl">👤</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{patient.department}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 font-bold line-clamp-2">{patient.about}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {patient.interests.map(interest => (
                                            <span key={interest} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center text-gray-400 font-bold">התוכן בבנייה...</div>
            )}
          </div>
        );

      case 'faq':
        const faqItems = MOCK_FAQ[currentStage] || [];
        return (
          <div className="space-y-3 pb-4 animate-in fade-in duration-300 text-right" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">שאלות ותשובות</h2>
              <button 
                onClick={() => setActiveTab('home')} 
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                חזרה
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-xs font-medium text-gray-500">
              שאלות נפוצות בנושא: <span className="text-blue-600 font-bold">{currentStage}</span>
            </p>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="חיפוש בשאלות השלב..."
                className="w-full p-3 pr-10 border border-gray-100 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 text-sm text-right"
              />
            </div>

            {/* FAQ List */}
            {faqItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">אין שאלות נפוצות לשלב זה.</p>
            ) : (
              <div className="space-y-3">
                {faqItems.map((faq, index) => (
                  <details key={faq.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                    <summary className="p-3 font-medium text-sm text-gray-800 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-right flex-1">{faq.question}</span>
                      <svg className="w-4 h-4 text-blue-500 transform group-open:rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="p-3 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            )}

            {/* Bottom Button */}
            <button className="w-full mt-6 bg-blue-600 text-white p-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all">
              <span>חיפוש בכל השאלות והתשובות</span>
              <span className="text-lg">🔍</span>
            </button>
          </div>
        );

      case 'checklist':
        if (currentStage === AppStage.REHAB_ROUTINE) {
          const scheduleCompleted = schedule.filter(i => i.completed).length;
          const scheduleTotal = schedule.length;
          const scheduleProgress = scheduleTotal > 0 ? Math.round((scheduleCompleted / scheduleTotal) * 100) : 0;
          return (
            <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
              {renderBackButton()}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">לו״ז יומי</h3>
                  <span className="text-xs font-bold text-gray-500">{scheduleCompleted} מתוך {scheduleTotal}</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${scheduleProgress}%` }} />
                </div>
                <div className="space-y-2">
                  {schedule.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleScheduleItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        item.completed ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        item.completed ? 'bg-blue-600 text-white' : 'border-2 border-gray-200'
                      }`}>
                        {item.completed && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-semibold text-gray-400 text-xs w-10">{item.time}</span>
                      <span className={`font-bold text-xs flex-1 text-right ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (currentStage === AppStage.PRE_HOME) {
          const preHomeChecklist = checklist[AppStage.PRE_HOME] || [];

          const briefingIds = ['br_physio', 'br_ot', 'br_speech', 'br_nursing', 'br_social', 'br_doctor'];
          const briefingItems = preHomeChecklist.filter(i => briefingIds.includes(i.id));
          const taskItems = preHomeChecklist.filter(i => !briefingIds.includes(i.id));
          const allBriefingsDone = briefingItems.length > 0 && briefingItems.every(i => i.completed);

          return (
            <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
              {renderBackButton()}

              <div className="space-y-2">
                <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                  allBriefingsDone
                    ? 'bg-green-50 border-green-100 text-green-700'
                    : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {allBriefingsDone
                    ? '✅ כל תדרוכי החובה הושלמו — ניתן לקבל אישור יציאה'
                    : '⚠️ ללא ביצוע תדרוכי החובה לא ניתן לקבל אישור יציאה מבית החולים'
                  }
                </div>
                {renderChecklistWidget(briefingItems, 'תדרוכי חובה', false)}
              </div>

              <div className="space-y-2">
                {renderChecklistWidget(taskItems, 'משימות למטופל ולמשפחה', false)}
              </div>
            </div>
          );
        }

        const checklistTitle = currentStage === AppStage.PRE_ADMISSION ? 'מה להביא לרעות?' : 'רשימת משימות';

        return (
          <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
            {renderBackButton()}
            {renderChecklistWidget(currentChecklist, checklistTitle, false)}
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
            {renderBackButton()}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">אזור שיקומי אישי</h2>
            </div>

            {/* Internal tab toggle */}
            <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
              <button
                onClick={() => setPersonalSubTab('medical')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${personalSubTab === 'medical' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >
                🩺 מידע רפואי
              </button>
              <button
                onClick={() => setPersonalSubTab('goals')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${personalSubTab === 'goals' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >
                🎯 יעדים אישיים
              </button>
            </div>

            {personalSubTab === 'medical' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Limitations Section */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h3 className="font-semibold text-base text-gray-800">הגבלות רפואיות ותפקודיות</h3>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2 self-start">
                        <span className="text-xl">⚠️</span>
                        <span className="font-semibold text-gray-900">איסור דריכה על רגל ימין</span>
                      </div>
                      <span className="text-xs font-semibold text-red-500 mt-1 self-start">תפקודי</span>
                    </div>
                  </div>
                </div>

                {/* Medications Section */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <h3 className="font-semibold text-base text-gray-800">רשימת התרופות שלי</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'אקמול', dose: '500 מ"ג • לפי הצורך', time: 'בוקר/צהריים/ערב' },
                      { name: 'אספירין', dose: '100 מ"ג • פעם ביום', time: 'בוקר' }
                    ].map((med, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="text-right">
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <span className="text-xs text-gray-500 font-bold">{med.dose}</span>
                        </div>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">{med.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment Summaries Section */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="font-semibold text-base text-gray-800">סיכומי טיפול</h3>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between active:scale-95 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-gray-900 text-sm">סיכום ביניים - פיזיותרפיה</h4>
                        <span className="text-xs text-gray-400 font-bold">18.05.2024 • ד"ר כהן</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </div>
                </div>
              </div>
            )}

            {personalSubTab === 'goals' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-2xl">👕</span>
                    <h3 className="font-semibold text-base">ריפוי בעיסוק</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'g1', text: 'לבישת חולצה באופן עצמאי', completed: false },
                      { id: 'g2', text: 'שימוש במקלדת למשך 15 דקות', completed: false }
                    ].map(goal => (
                      <div key={goal.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center shrink-0">
                          {goal.completed && <span className="text-blue-600 font-bold">✓</span>}
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{goal.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-700">
                    <span className="text-2xl">🗣️</span>
                    <h3 className="font-semibold text-base">קלינאות תקשורת</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'g3', text: 'בליעה בטוחה של נוזלים', completed: false },
                      { id: 'g4', text: 'דיבור ברור בשיחת טלפון', completed: false }
                    ].map(goal => (
                      <div key={goal.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center shrink-0">
                          {goal.completed && <span className="text-blue-600 font-bold">✓</span>}
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{goal.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white text-xs">✓</div>
                    <h3 className="font-semibold text-base text-blue-600">יעדים שהושגו</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 opacity-75">
                      <div className="w-6 h-6 rounded-md border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center shrink-0">✓</div>
                      <span className="font-bold text-gray-500 text-sm line-through">אכילה ללא עזרה</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notebook':
        return (
          <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
            {renderBackButton()}
            
            {/* Header */}
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-bold text-gray-900">המחברת שלי</h2>
               <button 
                 onClick={() => {
                   setActiveNote({ title: '', content: '' });
                   setIsEditingNote(true);
                 }}
                 className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
               >
                 <span>+ פתק חדש</span>
               </button>
            </div>
            
            <p className="text-gray-500 text-sm font-medium">נקודות שחשוב לי לזכור, מחשבות ושאלות לצוות</p>

            {/* Notes List */}
            <div className="space-y-3">
               {notes.map(note => (
                 <div 
                   key={note.id} 
                   onClick={() => {
                     setActiveNote(note);
                     setIsEditingNote(false);
                   }}
                   className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between gap-4 cursor-pointer active:scale-95 transition-transform"
                 >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                       <span className="text-2xl">{(note as any).media?.type === 'image' ? '🖼️' : (note as any).media?.type === 'video' ? '🎬' : '📝'}</span>
                    </div>
                    <div className="flex-1 text-right flex gap-3">
                       <div className="flex-1 overflow-hidden">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{note.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                             {note.content}
                          </p>
                       </div>
                       <div className="text-left text-xs text-gray-400 font-bold whitespace-nowrap mt-1">
                          {note.date}
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Note Modal */}
            {activeNote && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveNote(null)}>
                 <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-right" onClick={e => e.stopPropagation()}>
                    
                    <div className="flex justify-between items-center mb-2">
                      <button onClick={() => setActiveNote(null)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <h3 className="text-lg font-bold text-gray-900">
                        {isEditingNote ? (activeNote.id ? 'עריכת פתק' : 'פתק חדש') : 'צפייה בפתק'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">כותרת</label>
                        {isEditingNote ? (
                          <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                            value={activeNote.title}
                            onChange={e => setActiveNote({...activeNote, title: e.target.value})}
                            placeholder="נושא הפתק..."
                          />
                        ) : (
                          <div className="text-lg font-bold text-gray-900">{activeNote.title}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">תוכן</label>
                        {isEditingNote ? (
                          <textarea 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-right h-32 resize-none"
                            value={activeNote.content}
                            onChange={e => setActiveNote({...activeNote, content: e.target.value})}
                            placeholder="כתוב כאן..."
                          />
                        ) : (
                          <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{activeNote.content}</div>
                        )}
                      </div>

                      {/* Media preview — shown in edit and view modes */}
                      {activeNote?.media && (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          {activeNote.media.type === 'image' ? (
                            <img src={activeNote.media.url} alt="תמונה מצורפת" className="w-full h-44 object-cover" />
                          ) : (
                            <video src={activeNote.media.url} controls className="w-full h-44 rounded-xl" />
                          )}
                          {isEditingNote && (
                            <button
                              onClick={() => setActiveNote(prev => prev ? {...prev, media: null} : prev)}
                              className="absolute top-2 left-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
                            >✕</button>
                          )}
                        </div>
                      )}

                      {isEditingNote && (
                        <div className="flex gap-2">
                          <label className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer text-sm">
                            <span>📷</span><span>תמונה</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setActiveNote(prev => prev ? {...prev, media: {url, type: 'image' as const}} : prev);
                              }
                            }} />
                          </label>
                          <label className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer text-sm">
                            <span>🎬</span><span>סרטון</span>
                            <input type="file" accept="video/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setActiveNote(prev => prev ? {...prev, media: {url, type: 'video' as const}} : prev);
                              }
                            }} />
                          </label>
                          <button className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors text-sm">
                            <span>🎙️</span><span>הקלטה</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                      {isEditingNote ? (
                        <>
                          <button 
                            onClick={() => setActiveNote(null)}
                            className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            ביטול
                          </button>
                          <button 
                            onClick={() => {
                              if (activeNote.id) {
                                // Update existing
                                setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, title: activeNote.title, content: activeNote.content, media: activeNote.media ?? null } : n));
                              } else {
                                // Create new
                                const newNote = {
                                  id: Date.now(),
                                  date: new Date().toLocaleDateString('he-IL'),
                                  title: activeNote.title || 'ללא כותרת',
                                  content: activeNote.content,
                                  media: activeNote.media ?? null
                                };
                                setNotes(prev => [newNote, ...prev]);
                              }
                              setActiveNote(null);
                            }}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                          >
                            שמירה
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setNotes(prev => prev.filter(n => n.id !== activeNote.id));
                              setActiveNote(null);
                            }}
                            className="flex-1 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            <span>מחיקה</span>
                          </button>
                          <button 
                            onClick={() => setIsEditingNote(true)}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            <span>עריכה</span>
                          </button>
                        </>
                      )}
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case 'exercises':
        const physioExercises = exercisesList.filter(e => e.category === 'פיזיותרפיה');
        const otExercises = exercisesList.filter(e => e.category === 'ריפוי בעיסוק');

        return (
          <div className="space-y-3 pb-4 text-right animate-in fade-in duration-300">
            {renderBackButton()}
            
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-lg font-bold text-gray-900">התרגילים שלי</h2>
               <div className="bg-gray-100 p-1 rounded-xl flex text-xs font-bold">
                  <button 
                    onClick={() => setExerciseFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${exerciseFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    הכל
                  </button>
                  <button 
                    onClick={() => setExerciseFilter('today')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${exerciseFilter === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    להיום
                  </button>
               </div>
            </div>

            <div className="space-y-3">
                {/* Physiotherapy */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-400 text-sm px-1">פיזיותרפיה</h3>
                    {physioExercises.map(ex => (
                        <div key={ex.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleExercise(ex.id)}
                                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${ex.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-200 bg-white'}`}
                                >
                                    {ex.completed && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </button>
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                                    {ex.icon}
                                </div>
                                <div className="text-right">
                                    <h4 className={`font-semibold text-gray-900 ${ex.completed ? 'line-through text-gray-400' : ''}`}>{ex.title}</h4>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${ex.type === 'wisecare' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {ex.type === 'wisecare' ? 'קישור ל-WiseCare' : 'דף תרגול'}
                                    </span>
                                </div>
                            </div>
                            
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${ex.completed ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'}`}>
                                {ex.type === 'wisecare' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Occupational Therapy */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-400 text-sm px-1">ריפוי בעיסוק</h3>
                    {otExercises.map(ex => (
                        <div key={ex.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleExercise(ex.id)}
                                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${ex.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-200 bg-white'}`}
                                >
                                    {ex.completed && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </button>
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                                    {ex.icon}
                                </div>
                                <div className="text-right">
                                    <h4 className={`font-semibold text-gray-900 ${ex.completed ? 'line-through text-gray-400' : ''}`}>{ex.title}</h4>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                                        דף תרגול
                                    </span>
                                </div>
                            </div>
                            
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${ex.completed ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-20 text-center space-y-4">
            <span className="text-3xl">🚧</span>
            <p className="font-bold text-gray-400">המסך בבנייה...</p>
            <button onClick={() => setActiveTab('home')} className="text-blue-600 font-semibold underline">חזרה לבית</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center" dir="rtl">
    <div className="w-full max-w-lg bg-white flex flex-col h-screen overflow-hidden text-right relative">
      <main className="flex-1 px-5 pt-4 pb-24 overflow-y-auto w-full text-right">
        {renderContent()}
      </main>

      {showIntroForm && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowIntroForm(false)} />
          <div className="relative bg-white rounded-t-[2.5rem] p-5 w-full max-w-lg shadow-2xl space-y-3 text-right animate-in slide-in-from-bottom-full duration-500 border-t border-gray-100 pb-12 overflow-y-auto max-h-[95vh]">
            <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-2" onClick={() => setShowIntroForm(false)} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">שאלון היכרות</h3>
              <p className="text-gray-500 font-bold text-xs">המידע יעזור לאחרים להכיר אותך טוב יותר.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-blue-600 uppercase tracking-widest px-1 block">משפט קצר על עצמי</label>
                <textarea 
                  autoFocus
                  placeholder="ספר קצת על עצמך..."
                  value={tempAbout}
                  onChange={(e) => setTempAbout(e.target.value)}
                  className="w-full p-3.5 border border-gray-100 rounded-2xl bg-gray-50 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm text-right resize-none h-24 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-600 uppercase tracking-widest px-1 block">תחומי עניין</label>
                <div className="flex flex-wrap gap-1.5 px-0.5">
                  {INTERESTS_LIST.map(interest => {
                    const isSelected = tempInterests.includes(interest);
                    return (
                      <button 
                        key={interest}
                        onClick={() => toggleTempInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-gray-100 text-gray-500'}`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setTempConsent(!tempConsent)}
                  className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${tempConsent ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  {tempConsent && '✓'}
                </button>
                <span className="text-xs font-bold text-gray-700 leading-tight">
                  אני מאשר להציג את הפרופיל שלי (שם, מחלקה, משפט ותחומי עניין) למטופלים אחרים באפליקציה.
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleSaveIntro}
                disabled={!tempAbout.trim()}
                className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm shadow-lg active:scale-95 transition-all ${!tempAbout.trim() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
              >
                שמירה ופרסום
              </button>
              <button 
                onClick={() => setShowIntroForm(false)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-semibold text-sm active:scale-95 transition-all"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {showSocialActivityPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center animate-in fade-in duration-300 px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSocialActivityPopup(false)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-right animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-gray-100" dir="rtl">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                🎵
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-orange-500 uppercase tracking-widest">פעילות קרובה</p>
                <h3 className="text-base font-bold text-gray-900 leading-tight">פעילות חברתית מוזיקלית</h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🕐</span>
                <span className="text-sm font-semibold text-gray-800">היום בשעה 17:00</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌳</span>
                <span className="text-sm font-bold text-gray-700">בגינה של בית החולים</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">25 כבר אישרו הגעה</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex items-center -space-x-2 rtl:space-x-reverse" dir="ltr">
                {['👩‍🦳', '👨', '👩', '👴', '👩‍🦰', '👨‍🦱', '👵', '👨‍🦳'].map((avatar, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white flex items-center justify-center text-lg shadow-sm"
                  >
                    {avatar}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium text-gray-500">+17</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setJoinedSocialActivity(true);
                  setShowSocialActivityPopup(false);
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-sm shadow-lg active:scale-95 transition-all hover:shadow-xl"
              >
                אני מצטרף! 🎉
              </button>
              <button
                onClick={() => {
                  setShowSocialActivityPopup(false);
                  setActiveTab('info');
                  setInfoSubView('service-basket' as InfoSubView);
                }}
                className="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-2xl font-bold text-base active:scale-95 transition-all"
              >
                לא הפעם
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhysioReminder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center animate-in fade-in duration-300 px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPhysioReminder(false)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-right animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-gray-100" dir="rtl">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                🏋️
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-500 uppercase tracking-widest">תזכורת לקראת הטיפול</p>
                <h3 className="text-base font-bold text-gray-900 leading-tight">פיזיותרפיה</h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🧑‍⚕️</span>
                <div>
                  <p className="text-xs font-medium text-gray-400">מטפל/ת</p>
                  <p className="text-sm font-semibold text-gray-800">נעמה כהן - פיזיותרפיסטית</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="text-xs font-medium text-gray-400">שעה</p>
                  <p className="text-sm font-semibold text-gray-800">09:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs font-medium text-gray-400">מיקום</p>
                  <p className="text-sm font-semibold text-gray-800">חדר פיזיותרפיה 302, קומה 3</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="text-base">⚠️</span>
                בקשות מיוחדות לטיפול:
              </p>
              <ul className="space-y-1.5 text-xs font-bold text-amber-900 mr-5">
                <li className="flex items-center gap-2"><span>👟</span> נעלי ספורט וגרביים</li>
                <li className="flex items-center gap-2"><span>🩳</span> מכנסיים קצרים או נוחים</li>
                <li className="flex items-center gap-2"><span>🦾</span> להגיע עם הסד (אם יש)</li>
                <li className="flex items-center gap-2"><span>🍽️</span> לא לאכול שעה לפני הטיפול</li>
              </ul>
            </div>

            <button
              onClick={() => { setShowPhysioReminder(false); setShowDaySummary(true); }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-sm shadow-lg active:scale-95 transition-all hover:shadow-xl"
            >
              הבנתי, תודה ✓
            </button>
          </div>
        </div>
      )}

      {showDaySummary && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-b from-green-50 to-white flex flex-col animate-in fade-in duration-300" dir="rtl">
          <div className="w-full max-w-lg mx-auto p-4 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => { setShowDaySummary(false); setDaySummaryMood(null); }} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex items-center gap-1.5 text-center">
                <span className="text-lg">☀️</span>
                <h2 className="text-base font-semibold text-gray-900">סיכום יום 26.1.2026</h2>
              </div>
              <div className="w-8" />
            </div>

            {/* Content - compact sections */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {/* מפגשים טיפוליים */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-green-600">מפגשים טיפוליים</h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-800">פיזיותרפיה</span>
                  <span className="text-base">🏋️</span>
                </div>
              </div>

              {/* עדכוני הגבלות */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-green-600">עדכוני הגבלות</h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-800">איסור דריכה על רגל ימין</span>
                  <span className="text-base">⚠️</span>
                </div>
              </div>

              {/* תרגול עצמי */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-green-600">תרגול עצמי</h3>
                <div className="space-y-1.5">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800">חיזוק קרסוליים</span>
                    <span className="text-base">💪</span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800">תרגול בליעה - שלב א</span>
                    <span className="text-base">🗣️</span>
                  </div>
                </div>
              </div>

              {/* יעדים */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-green-600">יעדים</h3>
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-sm">✨</span>
                  <span className="text-xs font-bold text-gray-500">עד למחר: התמדה בתרגילי הבוקר</span>
                </div>
              </div>

              {/* רפלקציה אישית */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                <h3 className="text-base font-semibold text-gray-900 text-center">רפלקציה אישית</h3>
                <p className="text-xs font-bold text-gray-500 text-center">איך היה לך היום בהשוואה לאתמול?</p>
                <div className="flex justify-center gap-2.5">
                  {[
                    { id: 'great', emoji: '😊' },
                    { id: 'good', emoji: '🙂' },
                    { id: 'ok', emoji: '😐' },
                    { id: 'notgreat', emoji: '🤨' },
                    { id: 'bad', emoji: '😤' },
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setDaySummaryMood(mood.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        daySummaryMood === mood.id
                          ? 'bg-green-100 border-2 border-green-400 scale-110 shadow-md'
                          : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit button - fixed at bottom */}
            <div className="pt-3 pb-2">
              <button
                onClick={() => { setShowDaySummary(false); setDaySummaryMood(null); }}
                disabled={!daySummaryMood}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${
                  daySummaryMood
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                שליחת משוב
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingSessionSummary && sessionSummaries[viewingSessionSummary] && (() => {
        const summary = sessionSummaries[viewingSessionSummary];
        return (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in duration-300 overflow-y-auto" dir="rtl">
            <div className="w-full max-w-lg mx-auto p-4 pb-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button onClick={() => setViewingSessionSummary(null)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-base font-bold text-gray-900">סיכום מפגש טיפולי</h2>
                <div className="w-9" />
              </div>

              {/* Therapist & Date */}
              <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-4 border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-blue-100">
                  {summary.therapistAvatar}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-base">מטפלת: {summary.therapistName}</p>
                  <p className="text-sm font-bold text-gray-500">תאריך: {summary.date}</p>
                </div>
              </div>

              {/* Shared Records */}
              {summary.sharedRecords.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <span>📋</span> רשומה שיתופית
                  </h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                    {summary.sharedRecords.map((record, i) => (
                      <div key={i} className="p-4 flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span className="text-sm font-bold text-gray-700">{record}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {summary.goals.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <span>🎯</span> היעדים שהוגדרו
                  </h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                    {summary.goals.map((goal, i) => (
                      <div key={i} className="p-4 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm font-bold text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Self Practice */}
              {summary.selfPractice.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <span>💪</span> תרגול עצמי
                  </h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                    {summary.selfPractice.map((item, i) => (
                      <div key={i} className="p-4 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-sm font-bold text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitation Changes */}
              {summary.limitationChanges.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <span>⚠️</span> שינויים בהגבלות
                  </h3>
                  <div className="bg-red-50 rounded-2xl border border-red-100 divide-y divide-red-100">
                    {summary.limitationChanges.map((change, i) => (
                      <div key={i} className="p-4 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        <span className="text-sm font-semibold text-red-700">{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Resources */}
              {summary.helpfulResources.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <span>📚</span> סרטונים ומידע מסייע
                  </h3>
                  <div className="space-y-2">
                    {summary.helpfulResources.map((resource, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors">
                        <span className="text-sm font-bold text-gray-700">{resource.title}</span>
                        <span className="text-xl">{resource.type === 'video' ? '▶️' : 'ℹ️'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Session */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-center space-y-1 shadow-lg">
                <p className="text-sm font-bold text-blue-200">הטיפול הבא שלך</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📅</span>
                  <p className="text-lg font-bold text-white">{summary.nextSessionDate} בשעה {summary.nextSessionTime}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-3 z-40 flex justify-around items-end shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', label: 'בית', icon: '🏠' },
          { id: 'info', label: 'העוזר האישי שלי', icon: '💬' },
          { id: 'notebook', label: 'המחברת שלי', icon: '📝' },
          { id: 'exercises', label: 'התרגילים שלי', icon: '🏋️', badge: true },
          { id: 'personal', label: 'אזור שיקומי אישי', icon: '👤', badge: true }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); if (tab.id === 'info') setInfoSubView('grid'); }}
            className={`flex flex-col items-center gap-1 flex-1 transition-all relative ${activeTab === tab.id || (activeTab === 'faq' && tab.id === 'info') ? 'text-blue-600 scale-105 font-semibold' : 'text-gray-400'}`}
          >
            <div className="relative">
                <span className="text-xl">{tab.icon}</span>
                {tab.badge && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                )}
            </div>
            <span className={`text-[10px] leading-tight text-center h-5 flex items-center px-0.5 overflow-hidden ${activeTab === tab.id || (activeTab === 'faq' && tab.id === 'info') ? 'text-blue-600' : 'text-gray-400 font-medium'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
    </div>
  );
};

export default App;
