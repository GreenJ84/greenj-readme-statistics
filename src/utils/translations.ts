/**
 *  Locales
 *  -------
 *  For a list of supported locale codes, see https://gist.github.com/DenverCoder1/f61147ba26bfcf7c3bf605af7d3382d5

 *  Date Format
 *  -----------
 *  If the default date format for the locale displays correctly, you should omit the date_format parameter.
 *  Supplying a date format is optional and will be used instead of the default locale date format.

 *  Right-to-Left Language Support
 *  ------------------------------
 *  To enable right-to-left language support, add `rtl: true` to the locale array (see "he" for an example).
 *
 *  Aliases
 *  -------
 *  To add an alias for a locale, add the alias as a key to the locale array with the locale it should redirect to as the value.
 *  For example, if "zh" is an alias for "zh_Hans", then `"zh" => "zh_Hans"` would be added to the locale array.
 */
export interface LANGUAGE_TYPE{
    totalContributions: string
    currentStreak: string
    longestStreak: string
    weekStreak: string
    longestWeekStreak: string
    present: string
    rtl?: boolean
    date_format?: string
}
export const LANGUAGES: Record<string, LANGUAGE_TYPE> = {
    // "en" is the default locale
    "en": {
        totalContributions: "Total Contributions",
        currentStreak: "Current Streak",
        longestStreak: "Longest Streak",
        weekStreak: "Week Streak",
        longestWeekStreak: "Longest Week Streak",
        present: "Present",
    },
    // Locales below are sorted alphabetically
    "ar": {
        rtl: true,
        totalContributions: "إجمالي المساهمات",
        currentStreak: "السلسلة المتتالية الحالية",
        longestStreak: "أُطول سلسلة متتالية",
        weekStreak: "السلسلة المتتالية الأُسبوعية",
        longestWeekStreak: "أُطول سلسلة متتالية أُسبوعية",
        present: "الحاضر",
    },
    "bg": {
        totalContributions: "Общ принос",
        currentStreak: "Дневна серия",
        longestStreak: "Най-дълга дневна серия",
        weekStreak: "Седмична серия",
        longestWeekStreak: "Най-дълга седмична серия",
        present: "Cera",
    },
    "bn": {
        totalContributions: "মোট অবদান",
        currentStreak: "কারেন্ট স্ট্রীক",
        longestStreak: "দীর্ঘতম স্ট্রিক",
        weekStreak: "সপ্তাহ স্ট্রীক",
        longestWeekStreak: "দীর্ঘতম সপ্তাহ স্ট্রিক",
        present: "বর্তমান",
    },
    "da": {
        totalContributions: "Totalt Antal Bidrag",
        currentStreak: "Nuværende i Træk",
        longestStreak: "Længst i Træk",
        weekStreak: "Uger i Træk",
        longestWeekStreak: "Mest Uger i Træk",
        present: "I Dag",
    },
    "de": {
        totalContributions: "Gesamte Beiträge",
        currentStreak: "Aktuelle Serie",
        longestStreak: "Längste Serie",
        weekStreak: "Wochenserie",
        longestWeekStreak: "Längste Wochenserie",
        present: "Heute",
    },
    "es": {
        totalContributions: "Contribuciones Totales",
        currentStreak: "Racha Actual",
        longestStreak: "Racha Más Larga",
        weekStreak: "Racha Semanal",
        longestWeekStreak: "Racha Semanal Más Larga",
        present: "Presente",
    },
    "fa": {
        rtl: true,
        totalContributions: "مجموع مشارکت ها",
        currentStreak: "پی‌رفت فعلی",
        longestStreak: "طولانی ترین پی‌رفت",
        weekStreak: "پی‌رفت هفته",
        longestWeekStreak: "طولانی ترین پی‌رفت هفته",
        present: "اکنون",
    },
    "fr": {
        totalContributions: "Contributions totales",
        currentStreak: "Séquence actuelle",
        longestStreak: "Plus longue séquence",
        weekStreak: "Séquence de la semaine",
        longestWeekStreak: "Plus longue séquence hebdomadaire",
        present: "Aujourd'hui",
    },
    "he": {
        rtl: true,
        totalContributions: "סכום התרומות",
        currentStreak: "רצף נוכחי",
        longestStreak: "רצף הכי ארוך",
        weekStreak: "רצף שבועי",
        longestWeekStreak: "רצף שבועי הכי ארוך",
        present: "היום",
    },
    "hi": {
        totalContributions: "कुल योगदान",
        currentStreak: "निरंतर दैनिक योगदान",
        longestStreak: "सबसे लंबा दैनिक योगदान",
        weekStreak: "सप्ताहिक योगदान",
        longestWeekStreak: "दीर्घ साप्ताहिक योगदान",
        present: "आज तक",
    },
    "ht": {
        totalContributions: "kontribisyon total",
        currentStreak: "tras aktyèl",
        longestStreak: "tras ki pi long",
        weekStreak: "tras semèn",
        longestWeekStreak: "pi long tras semèn",
        present: "Prezan",
    },
    "id": {
        totalContributions: "Total Kontribusi",
        currentStreak: "Aksi Saat Ini",
        longestStreak: "Aksi Terpanjang",
        weekStreak: "Aksi Mingguan",
        longestWeekStreak: "Aksi Mingguan Terpanjang",
        present: "Sekarang",
    },
    "it": {
        totalContributions: "Totale dei Contributi",
        currentStreak: "Serie Corrente",
        longestStreak: "Serie più Lunga",
        weekStreak: "Serie Settimanale",
        longestWeekStreak: "Serie Settimanale più Lunga",
        present: "Presente",
    },
    "ja": {
        "date_format" => "[Y.]n.j",
        totalContributions: "総ｺﾝﾄﾘﾋﾞｭｰｼｮﾝ数",
        currentStreak: "現在のストリーク",
        longestStreak: "最長のストリーク",
        weekStreak: "週間ストリーク",
        longestWeekStreak: "最長の週間ストリーク",
        present: "今",
    },
    "kn": {
        totalContributions: "ಒಟ್ಟು ಕೊಡುಗೆ",
        currentStreak: "ಪ್ರಸ್ತುತ ಸ್ಟ್ರೀಕ್",
        longestStreak: "ಅತ್ಯಧಿಕ ಸ್ಟ್ರೀಕ್",
        weekStreak: "ವಾರದ ಸ್ಟ್ರೀಕ್",
        longestWeekStreak: "ಅತ್ಯಧಿಕ ವಾರದ ಸ್ಟ್ರೀಕ್",
        present: "ಪ್ರಸ್ತುತ",
    },
    "ko": {
        totalContributions: "총 기여 수",
        currentStreak: "현재 연속 기여 수",
        longestStreak: "최대 연속 기여 수",
        weekStreak: "주간 기여 수",
        longestWeekStreak: "최대 주간 기여 수",
        present: "현재",
    },
    "mr": {
        totalContributions: "एकूण योगदान",
        currentStreak: "साध्यकालीन सातत्यता",
        longestStreak: "दीर्घकालीन सातत्यता",
        weekStreak: "साप्ताहिक सातत्यता",
        longestWeekStreak: "दीर्घकालीन साप्ताहिक सातत्यता",
        present: "आज पर्यंत",
    },
    "nl": {
        totalContributions: "Totale Bijdrage",
        currentStreak: "Huidige Serie",
        longestStreak: "Langste Serie",
        weekStreak: "Week Serie",
        longestWeekStreak: "Langste Week Serie",
        present: "Vandaag",
    },
    "pl": {
        totalContributions: "Suma Kontrybucji",
        currentStreak: "Aktualna Seria",
        longestStreak: "Najdłuższa Seria",
        weekStreak: "Seria Tygodni",
        longestWeekStreak: "Najdłuższa Seria Tygodni",
        present: "Dziś",
    },
    "ps": {
        totalContributions: "ټولې ونډې",
        currentStreak: "اوسنی پرمختګ",
        longestStreak: "تر ټولو اوږد پرمختګ",
        weekStreak: "د اونۍ پرمختګ",
        longestWeekStreak: "د اونۍ تر ټولو اوږد پرمختګ",
        present: "اوس",
    },
    "pt_BR": {
        totalContributions: "Total de Contribuições",
        currentStreak: "Sequência Atual",
        longestStreak: "Maior Sequência",
        weekStreak: "Sequência Semanal",
        longestWeekStreak: "Maior Sequência Semanal",
        present: "Presente",
    },
    "ru": {
        totalContributions: "Общий вклад",
        currentStreak: "Текущая серия",
        longestStreak: "Самая длинная серия",
        weekStreak: "Текущая серия недель",
        longestWeekStreak: "Самая длинная серия недель",
        present: "Сейчас",
    },
    "sa": {
        totalContributions: "कुल योगदानम्",
        currentStreak: "क्रमशः दिवसान् चालयन्तु",
        longestStreak: "दीर्घतमाः क्रमशः दिवसाः",
        weekStreak: "निरन्तरसप्ताहाः",
        longestWeekStreak: "दीर्घतमाः निरन्तरसप्ताहाः",
        present: "वर्तमान",
    },
    "ta": {
        totalContributions: "மொத்த\nபங்களிப்புகள்",
        currentStreak: "மிக சமீபத்திய பங்களிப்புகள்",
        longestStreak: "நீண்ட\nபங்களிப்புகள்",
        weekStreak: "வார\nபங்களிப்புகள்",
        longestWeekStreak: "நீண்ட வார\nபங்களிப்புகள்",
        present: "இன்றுவரை",
    },
    "tr": {
        totalContributions: "Toplam Katkı",
        currentStreak: "Güncel Seri",
        longestStreak: "En Uzun Seri",
        weekStreak: "Haftalık Seri",
        longestWeekStreak: "En Uzun Haftalık Seri",
        present: "Şu an",
    },
    "uk": {
        totalContributions: "Загальний вклад",
        currentStreak: "Поточна діяльність",
        longestStreak: "Найдовша діяльність",
        weekStreak: "Діяльність за тиждень",
        longestWeekStreak: "Найбільша к-сть тижнів",
        present: "Наразі",
    },
    "ur_PK": {
        rtl: true,
        totalContributions: "کل حصہ داری",
        currentStreak: "موجودہ تسلسل",
        longestStreak: "طویل ترین تسلسل",
        weekStreak: "ہفتہ وار تسلسل",
        longestWeekStreak: "طویل ترین ہفتہ وار تسلسل",
        present: "حاظر",
    },
    "vi": {
        totalContributions: "Tổng số đóng góp",
        currentStreak: "Chuỗi đóng góp\nhiện tại",
        longestStreak: "Chuỗi đóng góp lớn nhất",
        weekStreak: "Chuỗi tuần",
        longestWeekStreak: "Chuỗi tuần lớn nhất",
        present: "Hiện tại",
    },
    "yo": {
        totalContributions: "Lapapọ ilowosi",
        currentStreak: "ṣiṣan lọwọlọwọ",
        longestStreak: "ṣiṣan ti o gun julọ",
        weekStreak: "ṣiṣan ọsẹ",
        longestWeekStreak: "gunjulo ọsẹ ṣiṣan",
        present: "lọwọlọwọ",
    },
    "zh": {
        totalContributions: "合计贡献",
        currentStreak: "目前连续贡献",
        longestStreak: "最长连续贡献",
        weekStreak: "周连续贡献",
        longestWeekStreak: "最长周连续贡献",
        present: "至今",
    },
    "zh_Hans": {
        totalContributions: "合计贡献",
        currentStreak: "目前连续贡献",
        longestStreak: "最长连续贡献",
        weekStreak: "周连续贡献",
        longestWeekStreak: "最长周连续贡献",
        present: "至今",
    },
    "zh_Hant": {
        totalContributions: "合計貢獻",
        currentStreak: "目前連續貢獻",
        longestStreak: "最長連續貢獻",
        weekStreak: "周連續貢獻",
        longestWeekStreak: "最常周連續貢獻",
        present: "至今",
    }
}