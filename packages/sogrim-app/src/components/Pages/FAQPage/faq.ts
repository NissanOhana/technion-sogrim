export type FAQ = {
  title: string;
  content: string;
};

export const faqs: FAQ[] = [
  {
    title: "מה קורה פה?",
    content:
      '"סוגרים" הוא פרוייקט קוד פתוח של סטודנטים למדעי המחשב בטכניון, שמטרתו לענות על השאלה המטורללת: האם סיימתי את התואר? כאן תוכלו לראות את מצב הדרישות השונות בהתאם לקטלוג שבחרתם, לתכנן את הסמסטרים הבאים ולקבל תמונת מצב טובה על המצב האקדמאי שלכם.',
  },
  {
    title: "איך זה עובד?",
    content:
      "די פשוט. בוחרים קטלוג לימודים, מייבאים את הקורסים שלכם משירות student ומקליקים על סגור את התואר. אנחנו נעשה את שאר העבודה :)",
  },
  {
    title: "אני חייב להתחבר דרך גוגל?",
    content:
      "נכון לעכשיו, כן. זו הדרך הבטוחה כדי לאמת אתכם ולשמור את המידע שלכם.",
  },
  {
    title: "נשמע מגניב! זה רשמי מטעם הפקולטה?",
    content:
      "לא. דיסקליימר חביב - שום דבר לא יחליף שיחה עם רכזות ההסמכה מטעם הפקולטה. אבל אנחנו בשיתוף פעולה מלא איתן, כדי לשפר את החוויה שלכם.",
  },
  {
    title: "הקטלוג שלי לא מופיע, מה אני עושה?",
    content:
      "אנחנו עדיין בשלבי הרצה, והזנו למערכת מעט קטלוגים. עם הזמן, בשיתוף עם רכזות ההסמכה בפקולטה, נזין את כל הקטלוגים.",
  },
  {
    title: "איך מייבאים קורסים?",
    content: "ניתן לייבא קורסים רק דרך מערכת student. ",
  },
  {
    title: "איך מחליפים קטלוג?",
    content:
      "עדכון: אין צורך יותר לאפס משתמש כדי להחליף קטלוג! לחצו על שם הקטלוג המופיע מתחת לסטטוס התואר כדי להחליף קטלוג.",
  },
  {
    title: 'יש לי קורס שתוייג כ"בחירה חופשית" למרות שהוא לא, מה לעשות?',
    content:
      "יתכן כי קורס זה לא נמצא במסד הנתונים שלנו. האלגוריתם מתייג קורסים כאלה כבחירה חופשית. אם אתם יודעים לאיזה דרישה שייך הקורס, תוכלו לערוך את נתוני הקורס ידנית בלשונית הסמסטרים.",
  },
  {
    title:
      "יש לי קורס שתוייג בדרישה לא נכונה (לאו דווקא בחירה חופשית), מה לעשות?",
    content:
      'מסד הנתונים שלנו די גדול, אך יתכנו שינויים וכמובן אישורים פרטניים. למשל, סטודנט שעשה את הקורסים הישנים "מערכות ספרתיות" ו-"תכן לוגי" שהוחלפו ב-"מערכות ספרתיות ומבנה המחשב" החדש, יוכל לסמן זאת בצורה ידנית דרך הממשק שלנו ולהריץ פעם נוספת. אם לדעתכם מדובר על בעיה גורפת לכלל הסטודנטים אנחנו יותר מנשמח אם תוכלו לדווח על כך בטופס שבתחתית העמוד.',
  },
  {
    title: "יש שדות בטבלת הסמסטרים שאיני מצליח לערוך, מה עושים?",
    content:
      "השדות מס׳ קורס וסטטוס אינם ניתן לעריכה במכוון. אם תרצו מס׳ קורס אחר, עליכם להוסיף קורס חדש. באשר לסטטוס, הוא מתעדכן בהתאם לציון.",
  },
  {
    title: "מופיע לי קורס תחת הדרישה חובה שלא רלוונטי לגביי, מה לעשות?",
    content:
      'במיוחד לשם כך הוספנו את כפתור היד שמטרתו לסמן קורס כ"לא רלוונטי". לחצו עליו והריצו פעם נוספת.',
  },
  {
    title: "לא הבנתי כ״כ מה קורה בלשונית דרישות...",
    content:
      "כל קטלוג מורכב מרשימה של דרישות. לכל קבוצה כזו יש מאפיינים היחודיים לה - קורסי חובה, קורסי בחירה או שרשראות מסויימות. פישטנו את הנושא, שבחלק מהקטלוגים מורכב למדי, כדי שלכם תהיה תמונת מצב מאוד ברורה איך השרשרת המדעית נסגרת, לאן זלגו נקודות מקורסי הבחירה ואיפה מתחבאות הדרישות המוזרות ביותר.",
  },
  {
    title: "מה אתם עושים עם המידע שלנו?",
    content:
      "פרט לחישובים של המערכת, שום דבר, נשבעים לכם! המידע מאובטח וכמובן שלא עובר לשום גורם צד שלישי שצמא לדעת את הציון שלכם במבני נתונים.",
  },
  {
    title: "יש לי רעיון של מיליון דולר למערכת, אפשר לעזור לכם?",
    content: "כמובן! זהו קוד פתוח, נשמח לכל issue ו-PR. ",
  },
];
