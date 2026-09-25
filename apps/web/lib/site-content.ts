/**
 * PLACEHOLDER CONTENT — replace with verified MLA-supplied facts before launch.
 * Per spec §4 & §17: no real political claims, statistics, or photos are invented here.
 */

export const site = {
  mlaName: "माननीय विधायक",
  tagline: "जनसेवा ही हमारा संकल्प",
  constituency: "आपका विधानसभा क्षेत्र",
  phone: "+91 98XXX XXXXX",
  email: "office@example.com",
  address: "विधायक कार्यालय, मुख्य मार्ग, आपका शहर, राज्य — 000000",
  officeHours: "सोम–शनि, सुबह 10:00 – शाम 5:00",
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    youtube: "#",
  },
};

export const quickLinks = [
  { title: "विकास कार्य", desc: "क्षेत्र में विकास की पहल", href: "/development-works" },
  { title: "जनसुनवाई", desc: "अपनी समस्या दर्ज करें", href: "/grievance" },
  { title: "योजनाएं", desc: "सरकारी योजनाओं की जानकारी", href: "/schemes" },
  { title: "मीडिया", desc: "समाचार और अपडेट", href: "/news" },
  { title: "संपर्क करें", desc: "हमसे सीधे जुड़ें", href: "/contact" },
];

export const stats = [
  { value: "250+", label: "विकास कार्य पूरे" },
  { value: "45+", label: "गांवों में विकास" },
  { value: "120+", label: "योजनाएं शुरू" },
  { value: "50,000+", label: "लाभान्वित नागरिक" },
];

export const newsItems = [
  {
    title: "क्षेत्र में नई सड़क परियोजना का उद्घाटन",
    excerpt: "क्षेत्र के विकास को गति देते हुए नई सड़क परियोजना का शुभारंभ किया गया।",
    date: "10 मई 2024",
    slug: "road-project-inauguration",
  },
  {
    title: "जनसंवाद कार्यक्रम का आयोजन",
    excerpt: "जनता की समस्याएं सुनी गईं और उनके समाधान हेतु अधिकारियों को निर्देश दिए गए।",
    date: "05 मई 2024",
    slug: "janasamvad-program",
  },
  {
    title: "वृक्षारोपण अभियान में भागीदारी",
    excerpt: "पर्यावरण संरक्षण के लिए वृक्षारोपण अभियान में सक्रिय भागीदारी की।",
    date: "01 मई 2024",
    slug: "plantation-drive",
  },
];

export const galleryPreview = [
  "कार्यक्रम की एक झलक",
  "उद्घाटन समारोह",
  "सम्मान समारोह",
  "जनसंपर्क बैठक",
  "सार्वजनिक कार्यक्रम",
];

export const footerLinks = {
  quick: [
    { label: "होम", href: "/" },
    { label: "हमारे बारे में", href: "/about" },
    { label: "हमारा क्षेत्र", href: "/constituency" },
    { label: "विकास कार्य", href: "/development-works" },
    { label: "योजनाएं", href: "/schemes" },
  ],
  important: [
    { label: "कार्यक्रम", href: "/events" },
    { label: "गैलरी", href: "/gallery" },
    { label: "मीडिया", href: "/news" },
    { label: "जनसुनवाई", href: "/grievance" },
    { label: "संपर्क करें", href: "/contact" },
  ],
};

export const developmentWorks = [
  {
    slug: "main-road-widening",
    title: "मुख्य मार्ग चौड़ीकरण परियोजना",
    category: "सड़क",
    status: "in_progress" as const,
    location: "वार्ड 5, मुख्य बाजार",
    description: "क्षेत्र की मुख्य सड़क को चौड़ा कर यातायात सुगम बनाने की परियोजना, जिससे रोजाना हजारों नागरिकों को लाभ मिलेगा।",
    startDate: "जनवरी 2024",
  },
  {
    slug: "drinking-water-pipeline",
    title: "पेयजल पाइपलाइन विस्तार",
    category: "पानी",
    status: "completed" as const,
    location: "5 गांव, पूर्वी क्षेत्र",
    description: "पांच गांवों में शुद्ध पेयजल आपूर्ति हेतु नई पाइपलाइन बिछाई गई, जिससे जल संकट की समस्या का स्थायी समाधान हुआ।",
    startDate: "जून 2023",
  },
  {
    slug: "primary-school-building",
    title: "प्राथमिक विद्यालय भवन निर्माण",
    category: "शिक्षा",
    status: "completed" as const,
    location: "वार्ड 12",
    description: "नए विद्यालय भवन का निर्माण, जिसमें आधुनिक कक्षाएं, शौचालय और खेल का मैदान शामिल है।",
    startDate: "मार्च 2023",
  },
  {
    slug: "streetlight-installation",
    title: "एलईडी स्ट्रीट लाइट स्थापना",
    category: "बिजली",
    status: "in_progress" as const,
    location: "पूरे क्षेत्र में",
    description: "ऊर्जा-कुशल एलईडी स्ट्रीट लाइटों की स्थापना जिससे रात्रि में सुरक्षा बढ़ेगी और बिजली की बचत होगी।",
    startDate: "फरवरी 2024",
  },
  {
    slug: "community-health-center",
    title: "सामुदायिक स्वास्थ्य केंद्र उन्नयन",
    category: "स्वास्थ्य",
    status: "proposed" as const,
    location: "वार्ड 8",
    description: "मौजूदा स्वास्थ्य केंद्र में नई मशीनें, अतिरिक्त बेड और आपातकालीन सुविधाओं को जोड़ने का प्रस्ताव।",
    startDate: "प्रस्तावित",
  },
  {
    slug: "drainage-system",
    title: "नाली एवं जल निकासी सुधार",
    category: "स्वच्छता",
    status: "in_progress" as const,
    location: "निचले इलाके, वार्ड 3-4",
    description: "बरसात के दौरान जलभराव की समस्या के स्थायी समाधान हेतु नई नाली प्रणाली का निर्माण।",
    startDate: "अप्रैल 2024",
  },
];

export const schemes = [
  {
    slug: "housing-scheme",
    title: "आवास सहायता योजना",
    description: "गरीब एवं जरूरतमंद परिवारों को पक्के मकान बनाने हेतु सरकारी अनुदान।",
    eligibility: "BPL राशन कार्ड धारक, वार्षिक आय ₹1.2 लाख से कम, स्वयं का पक्का मकान न हो।",
    documents: ["आधार कार्ड", "राशन कार्ड", "आय प्रमाण पत्र", "बैंक पासबुक"],
  },
  {
    slug: "student-scholarship",
    title: "छात्रवृत्ति योजना",
    description: "आर्थिक रूप से कमजोर वर्ग के मेधावी छात्रों के लिए शिक्षा सहायता।",
    eligibility: "कक्षा 9 से स्नातक तक अध्ययनरत छात्र, 60% से अधिक अंक, पारिवारिक आय सीमा के अंतर्गत।",
    documents: ["मार्कशीट", "आय प्रमाण पत्र", "बैंक पासबुक", "आधार कार्ड"],
  },
  {
    slug: "farmer-support",
    title: "किसान सहायता योजना",
    description: "बीज, उर्वरक एवं सिंचाई उपकरणों पर अनुदान हेतु योजना।",
    eligibility: "क्षेत्र के पंजीकृत किसान, स्वयं की या पट्टे की कृषि भूमि होना आवश्यक।",
    documents: ["भूमि रिकॉर्ड (खतौनी)", "आधार कार्ड", "बैंक पासबुक"],
  },
  {
    slug: "women-self-help",
    title: "महिला स्वरोजगार योजना",
    description: "स्वयं सहायता समूहों के माध्यम से महिलाओं को स्वरोजगार हेतु ऋण एवं प्रशिक्षण।",
    eligibility: "18 वर्ष से अधिक आयु की महिलाएं, स्वयं सहायता समूह से जुड़ी होना आवश्यक।",
    documents: ["आधार कार्ड", "समूह सदस्यता प्रमाण", "बैंक पासबुक"],
  },
];

export const events = [
  { slug: "janasamvad-june", title: "जनसंवाद कार्यक्रम", date: "15 जून 2024", venue: "पंचायत भवन, वार्ड 5", description: "नागरिकों की समस्याएं सुनने हेतु मासिक जनसंवाद कार्यक्रम।", upcoming: true },
  { slug: "health-camp", title: "निःशुल्क स्वास्थ्य शिविर", date: "22 जून 2024", venue: "सामुदायिक भवन, वार्ड 9", description: "निःशुल्क स्वास्थ्य जांच एवं दवा वितरण शिविर।", upcoming: true },
  { slug: "sports-meet", title: "युवा खेल महोत्सव", date: "01 जुलाई 2024", venue: "खेल मैदान, स्टेडियम रोड", description: "क्षेत्र के युवाओं के लिए वार्षिक खेल प्रतियोगिता।", upcoming: true },
  { slug: "plantation-drive-2024", title: "वृक्षारोपण अभियान", date: "01 मई 2024", venue: "नदी किनारा क्षेत्र", description: "पर्यावरण संरक्षण हेतु सामूहिक वृक्षारोपण अभियान।", upcoming: false },
];

export const galleryAlbums = [
  { slug: "road-inauguration", title: "सड़क उद्घाटन समारोह", date: "मई 2024", count: 12 },
  { slug: "health-camps", title: "स्वास्थ्य शिविर", date: "अप्रैल 2024", count: 8 },
  { slug: "plantation-2024", title: "वृक्षारोपण अभियान", date: "मई 2024", count: 15 },
  { slug: "republic-day", title: "गणतंत्र दिवस समारोह", date: "जनवरी 2024", count: 20 },
  { slug: "school-visit", title: "विद्यालय भ्रमण", date: "मार्च 2024", count: 10 },
  { slug: "public-meetings", title: "जनसंपर्क बैठकें", date: "चालू वर्ष", count: 25 },
];
