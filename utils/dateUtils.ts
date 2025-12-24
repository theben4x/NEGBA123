
// Helper to convert day number to Hebrew letters (Gematria) for days 1-30
const getGematriaDay = (day: number): string => {
  const days = [
    '', "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", // 1-9
    "י'", "י\"א", "י\"ב", "י\"ג", "י\"ד", "ט\"ו", "ט\"ז", "י\"ז", "י\"ח", "י\"ט", // 10-19
    "כ'", "כ\"א", "כ\"ב", "כ\"ג", "כ\"ד", "כ\"ה", "כ\"ו", "כ\"ז", "כ\"ח", "כ\"ט", // 20-29
    "ל'" // 30
  ];
  return days[day] || day.toString();
};

export const formatDate = (dateInput: Date | string = new Date()) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // 1. Day of the week (יום ראשון...)
  const dayName = new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(date);

  // 2. Gregorian Date (18/12/2025)
  const gregorianDate = new Intl.DateTimeFormat('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);

  // 3. Hebrew Date - Custom formatting for Gematria
  let hebrewDate = "";
  try {
    const formatter = new Intl.DateTimeFormat('he-u-ca-hebrew', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    const dayPart = parts.find(p => p.type === 'day');
    const monthPart = parts.find(p => p.type === 'month');
    const yearPart = parts.find(p => p.type === 'year');

    if (dayPart && monthPart) {
      const dayNum = parseInt(dayPart.value, 10);
      const yearStr = yearPart ? yearPart.value : '';
      
      if (!isNaN(dayNum)) {
        // Convert number to letters (e.g., 18 -> י"ח) and add 'ב' before month
        hebrewDate = `${getGematriaDay(dayNum)} ב${monthPart.value} ${yearStr}`;
      } else {
        // Fallback if browser already converted it or something failed
        hebrewDate = `${dayPart.value} ב${monthPart.value} ${yearStr}`;
      }
    } else {
       hebrewDate = "תאריך עברי";
    }
  } catch (e) {
    hebrewDate = "";
  }

  return { dayName, gregorianDate, hebrewDate };
};

// Backwards compatibility wrapper
export const getDateDisplay = () => formatDate(new Date());
