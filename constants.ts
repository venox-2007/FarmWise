import { MarketItem, Scheme, WeatherData, Language, InputProduct } from "./types";

export const SYSTEM_PROMPT = `You are FarmWise, a smart agricultural AI advisor for farmers in India.
Your goal is to help them "Grow Smarter, Not Harder".

**STRICT RESPONSE GUIDELINES:**
1. **Language**: Respond ONLY in the requested language (English, Hindi, Marathi, Punjabi, Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, or Odia).
2. **Brevity**: Keep answers SHORT and direct (maximum 3-4 sentences or bullet points).
3. **Format**: ALWAYS use bullet points (•) for lists.
4. **Tone**: Respectful, encouraging, simple terms (avoid complex jargon).
5. **Disclaimer**: End with a short disclaimer about consulting local experts.`;

export const LOCATIONS = [
  "Detect My Location",
  "Pune, Maharashtra",
  "Nashik, Maharashtra",
  "Bhatinda, Punjab",
  "Ludhiana, Punjab",
  "Karnal, Haryana",
  "Indore, Madhya Pradesh",
  "Lucknow, Uttar Pradesh",
  "Ahmedabad, Gujarat",
  "Guntur, Andhra Pradesh",
  "Coimbatore, Tamil Nadu",
  "Hubli, Karnataka"
];

export const LOCATION_COORDS: Record<string, { lat: number; lon: number }> = {
  "Pune, Maharashtra": { lat: 18.5204, lon: 73.8567 },
  "Nashik, Maharashtra": { lat: 19.9975, lon: 73.7898 },
  "Bhatinda, Punjab": { lat: 30.2104, lon: 74.9485 },
  "Ludhiana, Punjab": { lat: 30.9010, lon: 75.8573 },
  "Karnal, Haryana": { lat: 29.6857, lon: 76.9905 },
  "Indore, Madhya Pradesh": { lat: 22.7196, lon: 75.8577 },
  "Lucknow, Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
  "Ahmedabad, Gujarat": { lat: 23.0225, lon: 72.5714 },
  "Guntur, Andhra Pradesh": { lat: 16.3067, lon: 80.4365 },
  "Coimbatore, Tamil Nadu": { lat: 11.0168, lon: 76.9558 },
  "Hubli, Karnataka": { lat: 15.3647, lon: 75.1240 },
};

// --- TRANSLATION DATA ---

const CROP_TRANSLATIONS: Record<string, Record<string, string>> = {
    'Wheat': { hi: 'गेहूं', mr: 'गहू', pa: 'ਕਣਕ', gu: 'ઘઉં', bn: 'গম', ta: 'கோதுமை', te: 'గోధుమ', kn: 'ಗೋಧಿ', ml: 'ಗೋതമ്പ്', or: 'ଗହମ' },
    'Paddy (Basmati)': { hi: 'धान (बासमती)', mr: 'भात (बासमती)', pa: 'ਝੋਨਾ (ਬਾਸਮਤੀ)', gu: 'ડાંગર', bn: 'ধান', ta: 'நெல்', te: 'వరి', kn: 'ಭತ್ತ', ml: 'നെല്ല്', or: 'ଧାନ' },
    'Rice': { hi: 'चावल', mr: 'तांदूळ', pa: 'ਚੌਲ', gu: 'ચોખા', bn: 'চাল', ta: 'அரிசி', te: 'బియ్యం', kn: 'ಅಕ್ಕಿ', ml: 'ಅರಿ', or: 'ଚାଉଳ' },
    'Cotton': { hi: 'कपास', mr: 'कापूस', pa: 'ਨਰਮਾ', gu: 'કપાસ', bn: 'তুला', ta: 'பருத்தி', te: 'పత్తి', kn: 'ಹತ್ತಿ', ml: 'പരുത്തി', or: 'କପା' },
    'Maize': { hi: 'मक्का', mr: 'मका', pa: 'ਮੱਕੀ', gu: 'મકાઈ', bn: 'ভুট্টা', ta: 'மக்காச்சோளம்', te: 'మొక్కజొన్న', kn: 'ಜೋಳ', ml: 'ചോളം', or: 'ମକା' },
    'Potato': { hi: 'आलू', mr: 'बटाटा', pa: 'ਆਲੂ', gu: 'બટાકા', bn: 'আলু', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', kn: 'ಆಲೂಗಡ್ಡೆ', ml: 'ഉരുളക്കിഴങ്ങ്', or: 'ଆଳୁ' },
    'Kinnow': { hi: 'किन्नू', mr: 'किन्नू', pa: 'ਕਿੰਨੂ', gu: 'કિન્નો' },
    'Mustard': { hi: 'सरसों', mr: 'मोहरी', pa: 'ਸਰੋਂ', gu: 'રાઈ', bn: 'সরিষা', ta: 'கடுகு', te: 'ఆవాలు', kn: 'ಸಾಸಿವೆ', ml: 'കടുക്', or: 'ସୋରିଷ' },
    'Sugarcane': { hi: 'गन्ना', mr: 'ऊस', pa: 'ਗੰਨਾ', gu: 'શેરડી', bn: 'আখ', ta: 'கரும்பு', te: 'చెరకు', kn: 'ಕಬ್ಬು', ml: 'കരിമ്പ്', or: 'ଆଖୁ' },
    'Bajra': { hi: 'बाजरा', mr: 'बाजरी', pa: 'ਬਾਜਰਾ', gu: 'બાજરી', bn: 'বাজরা', ta: 'கம்பு', te: 'సజ్జలు', kn: 'ಸಜ್ಜೆ', ml: 'ബജ്റ', or: 'ବାଜରା' },
    'Sunflower': { hi: 'सूरजमुखी', mr: 'सूर्यफूल', pa: 'ਸੂਰਜਮੁਖੀ', gu: 'સૂર્યમુખી', bn: 'সূর্যমুখী', ta: 'சூரியகாந்தி', te: 'పొద్దుতিరుగుడు', kn: 'ಸೂರ್ಯಕಾಂತಿ', ml: 'ಸೂರ್ಯಕಾಂತಿ', or: 'ସୂର୍ଯ୍ୟମୁଖୀ' },
    'Onion (Red)': { hi: 'लाल प्याज', mr: 'लाल कांदा', pa: 'ਲਾਲ ਪਿਆਜ਼', gu: 'લાલ ડુંગળી' },
    'Onion': { hi: 'प्याज', mr: 'कांदा', pa: 'ਪਿਆਜ਼', gu: 'ડુંગળી', bn: 'পেঁয়াজ', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', kn: 'ಈರುಳ್ಳಿ', ml: 'ഉള്ളി', or: 'ପିଆଜ' },
    'Jowar': { hi: 'ज्वार', mr: 'ज्वारी', pa: 'ਜਵਾਰ', gu: 'જુવાર', bn: 'জোয়ার', ta: 'சோளம்', te: 'జొన్న', kn: 'ಜೋಳ', ml: 'ಜୋവർ', or: 'ଜୁଆର' },
    'Tomato': { hi: 'टमाटर', mr: 'टोमॅटो', pa: 'ਟਮାਟਰ', gu: 'ટામેટા', bn: 'টমেটো', ta: 'தக்காளி', te: 'టమాటో', kn: 'ಟೊಮ್ಯಾಟೊ', ml: 'തக்காളി', or: 'ଟମାଟୋ' },
    'Marigold': { hi: 'गेंदा', mr: 'झेंडू', pa: 'ਗੇਂਦਾ', gu: 'ଗલગોટા' },
    'Pomegranate': { hi: 'अनार', mr: 'डाळिंब', pa: 'ଅନାର', gu: 'દાଡମ', bn: 'ডালিম', ta: 'மாதுளை', te: 'దానిమ్మ', kn: 'ದಾಳಿಂಬೆ', ml: 'മാതളനാരങ്ങ', or: 'ଡାଳିମ୍ବ' },
    'Grapes': { hi: 'अंगूर', mr: 'द्राक्षे', pa: 'ਅੰਗੂਰ', gu: 'દ્રાક્ષ', bn: 'আঙ্গুর', ta: 'திராட்சை', te: 'ద్రాక్ష', kn: 'ದ್ರಾಕ್ಷಿ', ml: 'ಮುಂತಿರಿ', or: 'ଅଙ୍ଗୁର' },
    'Soybean': { hi: 'सोयाबीन', mr: 'सोयाबीन', pa: 'ਸੋਇਆਬੀਨ', gu: 'સોયાબીન' },
    'Garlic': { hi: 'लहसुन', mr: 'लसूण', pa: 'ਲਸਣ', gu: 'ਲસણ', bn: 'রসুন', ta: 'பூண்டு', te: 'వెల్లుల్లి', kn: 'ಬೆಳ್ಳುಳ್ಳಿ', ml: 'വെളുത്തുള്ളി', or: 'ରସୁଣ' },
    'Chickpea (Chana)': { hi: 'चना', mr: 'हरभरा', pa: 'ਛੋਲੇ', gu: 'ચણા' },
    'Mango (Dasheri)': { hi: 'आम (दशहरी)', mr: 'आंबा (दशहरी)', pa: 'ਅੰਬ', gu: 'કેરી' },
    'Peas (Green)': { hi: 'हरी मटर', mr: 'हिरवा वाटाणा', pa: 'ਹਰੇ ਮਟਰ', gu: 'વટાણા' },
    'Groundnut': { hi: 'मूंगफली', mr: 'भुईमूग', pa: 'ਮੂੰਗଫਲੀ', gu: 'મગફળી', bn: 'চিনা বাদাম', ta: 'வேர்க்கடலை', te: 'వేరుశెనగ', kn: 'ಕಡಲೆಕಾಯಿ', ml: 'നിലക്കടല', or: 'ଚିନାବାଦାମ' },
    'Cumin (Jeera)': { hi: 'जीरा', mr: 'जिरे', pa: 'ਜੀਰਾ', gu: 'જીરું' },
    'Castor Seed': { hi: 'अरंडी', mr: 'एरंडेल', gu: 'દિવેલા' },
    'Sesame': { hi: 'तिल', mr: 'तीळ', pa: 'ਤਿਲ', gu: 'તલ', bn: 'তিল', ta: 'எள்', te: 'నువ్వులు', kn: 'ಎಳ್ಳು', ml: 'എള്ള്', or: 'ରାଶି' },
    'Chilli': { hi: 'मिर्च', mr: 'मिरची', pa: 'ਮਿਰਚ', gu: 'ਮરચું', bn: 'লঙ্কা', ta: 'மிளகாய்', te: 'మిరప', kn: 'ಮೆಣಸಿನಕಾಯಿ', ml: 'മുളക്', or: 'ଲଙ୍କା' },
    'Turmeric': { hi: 'हल्दी', mr: 'हळद', pa: 'हਲਦੀ', gu: 'हળદર', bn: 'হলুদ', ta: 'மஞ்சள்', te: 'పసుపు', kn: 'ಅರಿಶಿನ', ml: 'മഞ്ഞൾ', or: 'ହଳଦୀ' },
    'Black Gram': { hi: 'उड़द', mr: 'उडीद', pa: 'ਮਾਂਹ', gu: 'અડଦ' },
    'Tobacco': { hi: 'तंबाकू', mr: 'तंबाखू', pa: 'ਤੰਬਾਕੂ', gu: 'તમાકુ' },
    'Coconut': { hi: 'नारियल', mr: 'नारळ', gu: 'નાળિયેર', ta: 'தேங்காய்', te: 'కొబ్బరి', kn: 'ತೆಂಗಿನಕಾಯಿ', ml: 'തേങ്ങ', or: 'ନଡ଼ିଆ' },
    'Banana': { hi: 'केला', mr: 'केळी', pa: 'ਕੇਲਾ', gu: 'કેળાં', bn: 'কলা', ta: 'வாழைப்பழம்', te: 'అరటి', kn: 'ಬಾಳೆಹಣ್ಣು', ml: 'വാഴപ്പഴം', or: 'କଦଳୀ' },
    'Tapioca': { hi: 'साबूदाना', mr: 'साबूदाणा', ta: 'மரவள்ளி' },
    'Tea (Green Leaf)': { hi: 'चाय', mr: 'चहा', ta: 'தேயிலை' },
    'Arecanut': { hi: 'सुपारी', mr: 'सुपारी', kn: 'ಅಡಿಕೆ', ml: 'അടയ്ക്ക' },
    'Coffee': { hi: 'कॉफी', mr: 'कॉफी', kn: 'ಕಾಫಿ' },
    'Ragi': { hi: 'रागी', mr: 'नाचणी', kn: 'ರಾಗಿ' },
    'Pepper': { hi: 'काली मिर्च', mr: 'मिरी', kn: 'ಮೆಣಸು', ml: 'കുരുമുളക്' }
};

// Simplified translation logic for Schemes (Focusing on Hi/Mr)
const SCHEME_TRANSLATIONS: Record<string, Record<string, Partial<Scheme>>> = {
    'hi': {
        'PM-KISAN': { benefits: '₹6,000/वर्ष की सहायता 3 किस्तों में।', eligibility: 'सभी भूमिधारी किसान परिवार।' },
        'PMFBY': { benefits: 'प्राकृतिक जोखिमों के खिलाफ फसल बीमा।', eligibility: 'बटाईदारों सहित सभी किसान।' },
        'PMKSY': { benefits: 'सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) पर सब्सिडी।', eligibility: 'खेती योग्य भूमि वाले किसान।' },
        'e-NAM': { benefits: 'बेहतर मूल्य खोज के लिए ऑनलाइन ट्रेडिंग।', eligibility: 'APMC में पंजीकृत किसान।' },
        'Soil Health Card': { benefits: 'मृदा पोषक तत्व की स्थिति और उर्वरक सिफारिशें।', eligibility: 'सभी किसान।' },
        'KCC': { benefits: 'खेती और घरेलू जरूरतों के लिए सस्ता ऋण।', eligibility: 'किसान, बटाईदार, एसएचजी।' }
    },
    'mr': {
        'PM-KISAN': { benefits: '₹6,000/वर्ष 3 हप्त्यांमध्ये मदत.', eligibility: 'सर्व जमीनधारक शेतकरी कुटुंब.' },
        'PMFBY': { benefits: 'नैसर्गिक संकटांपासून पीक विमा संरक्षण.', eligibility: 'सर्व शेतकरी (बटाईदारांसह).' },
        'PMKSY': { benefits: 'ठिबक/तुषार सिंचनावर अनुदान.', eligibility: 'लागवडीयोग्य जमीन असलेले शेतकरी.' },
        'e-NAM': { benefits: 'चांगल्या भावासाठी ऑनलाइन व्यापार.', eligibility: 'APMC मध्ये नोंदणीकृत शेतकरी.' },
        'Soil Health Card': { benefits: 'माती परीक्षण आणि खत शिफारसी.', eligibility: 'सर्व शेतकरी.' },
        'KCC': { benefits: 'शेती आणि घरगुती गरजांसाठी कर्ज.', eligibility: 'शेतकरी, बटाईदार, SHG.' }
    },
    'gu': {
        'PM-KISAN': { benefits: '₹6,000/વર્ષ 3 હપ્તામાં સહાય.', eligibility: 'બધા જમીનધારક ખેડૂત પરિવારો.' },
        'PMFBY': { benefits: 'કુદરતી જોખમો સામે પાક વીમો.', eligibility: 'ભાગીદારો સહિત તમામ ખેડૂતો.' }
    }
};

const INPUT_PRODUCT_TRANSLATIONS: Record<string, Record<string, Partial<InputProduct>>> = {
    'Neem Oil': { 
        hi: { name: 'नीम का तेल', description: 'जैविक कीट विकर्षक (1 लीटर)' },
        mr: { name: 'कडुनिंबाचे तेल', description: 'सेंद्रिय कीटकनाशक (1 लिटर)' },
        gu: { name: 'લીમડાનું તેલ', description: 'કાર્બનિક જંતુનાશક (1 લિટર)' }
    },
    'Urea Fertilizer': {
        hi: { name: 'यूरिया खाद', description: 'नाइट्रोजन युक्त (45 किग्रा बैग)' },
        mr: { name: 'युरिया खत', description: 'नायट्रोजन युक्त (45 किलो बॅग)' },
        gu: { name: 'યુરિયા ખાતર', description: 'નાઇટ્રોજન સમૃદ્ધ (45 કિલો)' }
    },
    'DAP 18:46:0': {
        hi: { name: 'डीएपी 18:46:0', description: 'फॉस्फोरस उर्वरक (50 किग्रा)' },
        mr: { name: 'डीएपी 18:46:0', description: 'फॉस्फरस खत (50 किलो)' },
        gu: { name: 'ડીએપી 18:46:0', description: 'ફોસ્ફરસ ખાતર (50 કિલો)' }
    },
    'Hybrid Tomato Seeds': {
        hi: { name: 'हाइब्रिड टमाटर के बीज', description: 'उच्च उपज किस्म (10 ग्राम)' },
        mr: { name: 'संकरित टोमॅटो बियाणे', description: 'जास्त उत्पन्न देणारे वाण (10 ग्रॅम)' },
        gu: { name: 'હાઇબ્રિડ ટામેટાંના બીજ', description: 'ઉચ્ચ ઉપજની વિવિધતા (10 ગ્રામ)' }
    },
    'Knapsack Sprayer': {
        hi: { name: 'नैपसैक स्प्रेयर', description: '16 लीटर मैनुअल पंप' },
        mr: { name: 'फवारणी पंप', description: '16 लिटर मॅन्युअल पंप' },
        gu: { name: 'નેપસેક સ્પ્રેયર', description: '16 લિટર મેન્યુઅલ પંપ' }
    }
};

const FARMER_MARKET_TRANSLATIONS: Record<string, Record<string, Partial<InputProduct>>> = {
    'Fresh Red Onions': {
        hi: { name: 'ताजी लाल प्याज', description: 'सीधे नासिक खेतों से' },
        mr: { name: 'ताजा लाल कांदा', description: 'थेट नाशिकच्या शेतातून' },
        gu: { name: 'તાજી લાલ ડુંગળી', description: 'સીધા નાસિક ફાર્મમાંથી' },
        pa: { name: 'ਤਾਜ਼ੇ ਲਾਲ ਪਿਆਜ਼', description: 'ਸਿੱਧੇ ਖੇਤਾਂ ਤੋਂ' },
        bn: { name: 'তাজা লাল পেঁয়াজ', description: 'সরাসরি খামার থেকে' },
        ta: { name: 'புதிய சிவப்பு வெங்காயம்', description: 'நேரடியாக பண்ணைகளிலிருந்து' },
        te: { name: 'తాజా ఎర్ర ఉల్లిపాయలు', description: 'నేరుగా పొలాల నుండి' },
        kn: { name: 'ತಾಜಾ ಕೆಂಪು ఈరుಳ್ಳಿ', description: 'ನೇರವಾಗಿ ತೋಟಗಳಿಂದ' },
        ml: { name: 'പുതിയ ചുവന്ന ഉള്ളി', description: 'നേരിട്ട് പാടങ്ങളിൽ നിന്ന്' },
        or: { name: 'ତତକା ନାଲି ପିଆଜ', description: 'ସିଧାସଳଖ ଚାଷଜମିରୁ' }
    },
    'Indrayani Rice': {
        hi: { name: 'इंद्रायणी चावल', description: 'सुगंधित नई फसल' },
        mr: { name: 'इंद्रायणी तांदूळ', description: 'सुगंधी नवीन पीक' },
        gu: { name: 'ઇન્દ્રાયણી ચોખા', description: 'સુગંધિત નવો પાક' },
        pa: { name: 'ਇੰਦਰਾਇਣੀ ਚੌਲ', description: 'ਖੁਸ਼ਬੂਦਾਰ ਨਵੀਂ ਫਸਲ' },
        bn: { name: 'ইন্দ্রায়ণী চাল', description: 'সুগন্ধি নতুন ফসল' },
        ta: { name: 'இந்திராயணி அரிసి', description: 'வாசனை புதிய பயிர்' },
        te: { name: 'ఇంద్రాయణి బియ్యం', description: 'సుగంధ కొత్త పంట' },
        kn: { name: 'ಇಂದ್ರಯಾಣಿ ಅಕ್ಕಿ', description: 'ಸುವಾಸಿತ ಹೊಸ ಬೆಳೆ' },
        ml: { name: 'ഇന്ദ്രായണി അരി', description: 'സുഗന്ധമുള്ള പുതിയ വിള' },
        or: { name: 'ଇନ୍ଦ୍ରାୟଣୀ ଚାଉଳ', description: 'ସୁଗନ୍ଧିତ ନୂତନ ଫସଲ' }
    },
    'Alphanso Mangoes': {
        hi: { name: 'अल्फांसो आम', description: 'रत्नागिरी जैविक (दर्जन)' },
        mr: { name: 'हापूस आंबा', description: 'रत्नागिरी सेंद्रिय (डझन)' },
        gu: { name: 'હાફૂસ કેરી', description: 'રત્નાગીરી ઓર્ગેનિક (ડઝન)' },
        pa: { name: 'ਅਲਫਾਨਸੋ ਅੰਬ', description: 'ਰਤਨਾਗਿਰੀ ਜੈਵିକ (ਦਰਜਨ)' },
        bn: { name: 'আলফোনসো আম', description: 'রত্নগিরি অর্গানিক (ডজন)' },
        ta: { name: 'அல்போன்சா மாம்பழம்', description: 'ரத்னகிரி ஆர்கானிக் (டஜன்)' },
        te: { name: 'అల్ఫోన్సో మామిడి', description: 'రత్నగిరి ఆర్గానిక్ (డజను)' },
        kn: { name: 'ಅಲ್ಫೋನ್ಸೋ ಮಾವಿನಹಣ್ಣು', description: 'ರತ್ನಗಿರಿ ಸಾವಯವ (ಡಜನ್)' },
        ml: { name: 'അൽഫോൻസോ മാമ്പഴം', description: 'രത്നഗിരി ഓർഗാനിക് (ഡസൻ)' },
        or: { name: 'ଅଲଫାନସୋ ଆମ୍ବ', description: 'ରତ୍ନଗିରି ଜୈବିକ (ଡଜନ)' }
    },
    'Desi Wheat': {
        hi: { name: 'देसी गेहूं', description: 'साबुत अनाज, चक्की पिसा' },
        mr: { name: 'देशी गहू', description: 'अक्खा धान्य, जात्यावर दळलेले' },
        gu: { name: 'દેશી ઘઉં', description: 'આખા અનાજ' },
        pa: { name: 'ਦੇਸੀ ਕਣਕ', description: 'ਸਾਬਤ ਅਨਾਜ' },
        bn: { name: 'দেশি গম', description: 'গোটা শস্য' },
        ta: { name: 'நாட்டு கோதுமை', description: 'முழு தானியம்' },
        te: { name: 'దేశీ గోధుమలు', description: 'ము full ధాన్యం' },
        kn: { name: 'ದೇಶಿ ಗೋಧಿ', description: 'ಸಂಪೂರ್ಣ ಧಾನ್ಯ' },
        ml: { name: 'നാടൻ గోతമ്പ്', description: 'മുഴുവൻ ധാന്യം' },
        or: { name: 'ଦେଶୀ ଗହମ', description: 'ପୁରା ଶସ୍ୟ' }
    },
    'Organic Spinach': {
        hi: { name: 'जैविक पालक', description: 'ताजी सुबह की कटाई' },
        mr: { name: 'सेंद्रिय पालक', description: 'सकाळची ताजी काढणी' },
        gu: { name: 'ઓર્ગેનિક પાલક', description: 'તાજી સવારની લણણી' },
        pa: { name: 'ਜੈਵਿਕ ਪਾਲਕ', description: 'ਤਾਜ਼ੀ ਸਵੇਰ ਦੀ ਕਟਾਈ' },
        bn: { name: 'জৈব পালং শাক', description: 'তাজা সকালের ফসল' },
        ta: { name: 'கீரைகள்', description: 'புதிய காலை அறுவடை' },
        te: { name: 'సేంద్రీయ పాలకూర', description: 'తాజా ఉదయం కోత' },
        kn: { name: 'ಸಾವಯವ ಪಾಲಕ್', description: 'ತಾಜಾ ಬೆಳಗಿನ ಕೊಯ್ಲು' },
        ml: { name: 'ജൈവ ചീര', description: 'രാവിലത്തെ വിളവെടുപ്പ്' },
        or: { name: 'ଜୈବିକ ପାଳଙ୍ଗ', description: 'ସତେଜ ସକାଳ ଅମଳ' }
    },
};

const COMMON_TRANSLATIONS = {
    en: {
        weather_sunny: "Sunny", weather_cloudy: "Cloudy", weather_rainy: "Rainy", weather_stormy: "Stormy", weather_foggy: "Foggy",
        ai_fast: "Fast (Search)", ai_think: "Deep Think", ai_store: "Find Stores",
        cam_title: "Instant Disease Check", cam_tips: "FOR BEST RESULTS:", cam_steady: "Hold camera steady", cam_light: "Ensure good lighting", cam_focus: "Focus on affected leaf", tap_scan: "Tap to Scan",
        est_delivery: "Est. Delivery", days: "days", process_img: "Process Image",
        live_ai: "Live Expert", live_connecting: "Connecting to FarmWise Live...", live_ready: "FarmWise Live is ready", live_hint: "Ask me anything about your farm.", live_listening: "Listening...", live_speaking: "Speaking..."
    },
    hi: {
        weather_sunny: "धूप", weather_cloudy: "बादल", weather_rainy: "बारिश", weather_stormy: "तूफानी", weather_foggy: "कोहरा",
        ai_fast: "तेज़ (खोज)", ai_think: "गहरा विचार", ai_store: "दुकानें खोजें",
        cam_title: "तुरंत रोग जांच", cam_tips: "अच्छे परिणामों के लिए:", cam_steady: "कैमरा स्थिर रखें", cam_light: "अच्छी रोशनी रखें", cam_focus: "पत्ते पर फोकस करें", tap_scan: "स्कैन करें",
        est_delivery: "अनुमानित डिलीवरी", days: "दिन", process_img: "प्रक्रिया करें",
        live_ai: "लाइव विशेषज्ञ", live_connecting: "फार्मवाइज लाइव से जुड़ रहा है...", live_ready: "फार्मवाइज लाइव तैयार है", live_hint: "अपने खेत के बारे में कुछ भी पूछें।", live_listening: "सुन रहा हूँ...", live_speaking: "बोल रहा हूँ..."
    },
    mr: {
        weather_sunny: "स्वच्छ", weather_cloudy: "ढगाळ", weather_rainy: "पाऊस", weather_stormy: "वादळी", weather_foggy: "धुके",
        ai_fast: "जलद (शोध)", ai_think: "सखोल विचार", ai_store: "दुकाने शोधा",
        cam_title: "त्वरित रोग तपासणी", cam_tips: "चांगल्या निकालासाठी:", cam_steady: "कॅमेरा स्थिर ठेवा", cam_light: "चांगला प्रकाश ठेवा", cam_focus: "पानावर फोकस करा", tap_scan: "स्कॅन करण्यासाठी टॅप करा",
        est_delivery: "अंदाजे वितरण", days: "दिवस", process_img: "प्रक्रिया करा",
        live_ai: "थेट तज्ञ", live_connecting: "फार्मवाइज लाइव्हशी कनेक्ट होत आहे...", live_ready: "फार्मवाइज लाइव्ह तयार आहे", live_hint: "तुमच्या शेतीबद्दल काहीही विचारा.", live_listening: "ऐकत आहे...", live_speaking: "बोलत आहे..."
    },
    pa: {
        weather_sunny: "ਧੁੱਪ", weather_cloudy: "ਬੱਦਲਵਾਈ", weather_rainy: "ਮੀਂਹ", weather_stormy: "ਤੂਫਾਨੀ", weather_foggy: "ਧੁੰਦ",
        ai_fast: "ਤੇਜ਼ (ਖੋਜ)", ai_think: "ਡੂੰਘੀ ਸੋਚ", ai_store: "ਦੁਕਾਨਾਂ ਲੱਭੋ",
        cam_title: "ਤੁਰੰਤ ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ", cam_tips: "ਵਧੀਆ ਨਤੀਜਿਆਂ ਲਈ:", cam_steady: "ਕੈਮਰਾ ਸਥਿਰ ਰੱਖੋ", cam_light: "ਚੰਗੀ ਰੋਸ਼ਨੀ ਰੱਖੋ", cam_focus: "ਪੱਤੇ 'ਤੇ ਫੋਕਸ ਕਰੋ", tap_scan: "ਸਕੈਨ ਕਰੋ",
        est_delivery: "ਅਨੁਮਾਨਤ ਡਿਲਿਵਰੀ", days: "ਦਿਨ", process_img: "ਪ੍ਰਕਿਰਿਆ ਕਰੋ",
        live_ai: "ਲਾਈਵ ਮਾਹਰ", live_connecting: "ਫਾਰਮਵਾਈਜ਼ ਲਾਈਵ ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ...", live_ready: "ਫਾਰਮਵਾਈਜ਼ ਲਾਈਵ ਤਿਆਰ ਹੈ", live_hint: "ਆਪਣੇ ਖੇਤ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।", live_listening: "ਸੁਣ ਰਿਹਾ ਹੈ...", live_speaking: "ਬੋਲ ਰਿਹਾ ਹੈ..."
    },
    gu: {
        weather_sunny: "તડકો", weather_cloudy: "વાદળછાયું", weather_rainy: "વરસાદ", weather_stormy: "તોફાની", weather_foggy: "ધુમ્મસ",
        ai_fast: "ઝડપી (શ્રેણી)", ai_think: "ઊંડો વિચાર", ai_store: "દુકાનો શોધો",
        cam_title: "ત્વરિત રોગ તપાસ", cam_tips: "શ્રેષ્ઠ પરિણામો માટે:", cam_steady: "કેમેરા સ્થિર રાખો", cam_light: "સારો પ્રકાશ રાખો", cam_focus: "પાંદડા પર ફોકસ કરો", tap_scan: "સ્કેન કરો",
        est_delivery: "અંદાજિત ડિલિવરી", days: "દિવસ", process_img: "પ્રક્રિયા કરો",
        live_ai: "લાઈવ નિષ્ણાત", live_connecting: "ફાર્મવાઇઝ લાઇવ સાથે કનેક્ટ થઈ રહ્યું છે...", live_ready: "ફાર્મવાઇઝ લાઇવ તૈયાર છે", live_hint: "તમારા ખેતર વિશે કંઈપણ પૂછો.", live_listening: "સાંભળી રહ્યા છીએ...", live_speaking: "બોલી રહ્યા છીએ..."
    },
    bn: { weather_sunny: "রৌদ্রোজ্জ্বল", weather_cloudy: "মেঘলা", weather_rainy: "বৃষ্টি", weather_stormy: "ঝড়", weather_foggy: "কুয়াশা", ai_fast: "দ্রুত (অনুসন্ধান)", ai_think: "গভীর চিন্তা", ai_store: "দোকান খুঁজুন", cam_title: "তাত্ক্ষণিক রোগ পরীক্ষা", cam_tips: "সেরা ফলাফলের জন্য:", cam_steady: "ক্যামেরা স্থির রাখুন", cam_light: "ভালো আলো নিশ্চিত করুন", cam_focus: "পাতার উপর ফোকাস করুন", tap_scan: "স্ক্যান করতে ট্যাপ করুন", est_delivery: "আনুমানিক ডেলিভারি", days: "দিন", process_img: "প্রক্রিয়া করুন", live_ai: "লাইভ বিশেষজ্ঞ", live_connecting: "ফার্মওয়াইজ লাইভের সাথে সংযুক্ত হচ্ছে...", live_ready: "ফার্মওয়াইজ লাইভ প্রস্তুত", live_hint: "আপনার খামার সম্পর্কে কিছু জিজ্ঞাসা করুন।", live_listening: "শুনছি...", live_speaking: "বলছি..." },
    ta: { weather_sunny: "வெயில்", weather_cloudy: "மேகமூட்டம்", weather_rainy: "மழை", weather_stormy: "புயல்", weather_foggy: "மூடுபனி", ai_fast: "வேகமான (தேடல்)", ai_think: "ஆழ்ந்த சிந்தனை", ai_store: "கடைகளைத் தேடு", cam_title: "உடனடி நோய் ஆய்வு", cam_tips: "சிறந்த முடிவுகளுக்கு:", cam_steady: "கேமராவை நிலையாகப் பிடி", cam_light: "நல்ல வெளிச்சம்", cam_focus: "இலையில் கவனம் செலுத்து", tap_scan: "ஸ்கேன் செய்ய தட்டவும்", est_delivery: "மதிப்பிடப்பட்ட விநியோகம்", days: "நாட்கள்", process_img: "செயலாக்கு", live_ai: "நேரடி நிபுணர்", live_connecting: "ஃபார்ம்வைஸ் லைவ் உடன் இணைகிறது...", live_ready: "ஃபார்ம்வைஸ் லைவ் தயார்", live_hint: "உங்கள் பண்ணையைப் பற்றி எதையும் கேளுங்கள்.", live_listening: "கேட்கிறது...", live_speaking: "பேசுகிறது..." },
    te: { weather_sunny: "ఎండ", weather_cloudy: "మబ్బులు", weather_rainy: "వర్షం", weather_stormy: "తుఫాను", weather_foggy: "మంచు", ai_fast: "వేగవంతమైన (శోధన)", ai_think: "లోతైన ఆలోచన", ai_store: "దుకాణాలను కనుగొనండి", cam_title: "తక్షణ వ్యాధి తనిఖీ", cam_tips: "మంచి ఫలితాల కోసం:", cam_steady: "కెమెరాను స్థిరంగా ఉంచండి", cam_light: "మంచి వెలుతురు", cam_focus: "ఆకుపై ఫోకస్ చేయండి", tap_scan: "స్కాన్ చేయడానికి నొక్కండి", est_delivery: "అంచనా డెలివరీ", days: "రోజులు", process_img: "ప్రాసెస్ చేయండి", live_ai: "లైవ్ నిపుణుడు", live_connecting: "ఫామ్ వైజ్ లైవ్ కు కనెక్ట్ అవుతోంది...", live_ready: "ఫామ్ వైజ్ లైవ్ సిద్ధంగా ఉంది", live_hint: "మీ పొలం గురించి ఏదైనా అడగండి.", live_listening: "వింటున్నాను...", live_speaking: "మాట్లాడుతున్నాను..." },
    kn: { weather_sunny: "ಬಿಸಿಲು", weather_cloudy: "ಮೋಡ", weather_rainy: "ಮಳೆ", weather_stormy: "ಬಿರುಗಾಳಿ", weather_foggy: "ಮಂಜು", ai_fast: "ವೇಗ (ಹುಡುಕಾಟ)", ai_think: "ಆಳವಾದ ಚಿಂತನೆ", ai_store: "ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಿ", cam_title: "ತಕ್ಷಣದ ರೋಗ ತಪಾಸಣೆ", cam_tips: "ಉತ್ತಮ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ:", cam_steady: "ಕ್ಯಾಮೆರಾ ಸ್ಥಿರವಾಗಿಡಿ", cam_light: "ಉತ್ತಮ ಬೆಳಕು", cam_focus: "ಎಲೆಯ ಮೇಲೆ ಗಮನವಿರಲಿ", tap_scan: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", est_delivery: "ಅಂದಾಜು ವಿತರಣೆ", days: "ದಿನಗಳು", process_img: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ", live_ai: "ಲೈವ್ ತಜ್ಞ", live_connecting: "ಫಾರ್ಮ್‌ವೈಸ್ ಲೈವ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...", live_ready: "ಫಾರ್ಮ್‌ವೈಸ್ ಲೈವ್ ಸಿದ್ಧವಾಗಿದೆ", live_hint: "ನಿಮ್ಮ ಫಾರ್ಮ್ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ.", live_listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ...", live_speaking: "ಮಾತನಾಡುತ್ತಿದ್ದೆ..." },
    ml: { weather_sunny: "വെയിൽ", weather_cloudy: "മേഘാവൃതം", weather_rainy: "മഴ", weather_stormy: "കൊടുങ്കാറ്റ്", weather_foggy: "മൂടൽമഞ്ഞ്", ai_fast: "വേഗത (തിരയൽ)", ai_think: "ആഴത്തിലുള്ള ചിന്ത", ai_store: "കടകൾ കണ്ടെത്തുക", cam_title: "രോഗ പരിശോധന", cam_tips: "മികച്ച ഫലങ്ങൾക്ക്:", cam_steady: "ക്യാമറ സ്ഥിരമായി പിടിക്കുക", cam_light: "നല്ല വെളിച്ചം ഉറപ്പാക്കുക", cam_focus: "ഇലയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക", tap_scan: "സ്കാൻ ചെയ്യാൻ ടാപ്പുചെയ്യുക", est_delivery: "കണക്കാക്കിയ ഡെലിവറി", days: "ദിവസങ്ങൾ", process_img: "പ്രോസസ്സ് ചെയ്യുക", live_ai: "ലൈവ് വിദഗ്ധൻ", live_connecting: "ഫാംവൈസ് ലൈവിലേക്ക് ബന്ധിപ്പിക്കുന്നു...", live_ready: "ഫാംവൈസ് ലൈവ് തയ്യാറാണ്", live_hint: "നിങ്ങളുടെ ഫാമിനെക്കുറിച്ച് എന്തും ചോദിക്കുക.", live_listening: "കേൾക്കുന്നു...", live_speaking: "സംസാരിക്കുന്നു..." },
    or: { weather_sunny: "ଖରା", weather_cloudy: "ମେଘୁଆ", weather_rainy: "ବର୍ଷା", weather_stormy: "ଝଡ଼", weather_foggy: "କୁହୁଡି", ai_fast: "ଦ୍ରୁତ (ସନ୍ଧାନ)", ai_think: "ଗଭୀର ଚିନ୍ତା", ai_store: "ଦୋକାନ ଖୋଜନ୍ତୁ", cam_title: "ତୁରନ୍ତ ରୋଗ ଯାଞ୍ଚ", cam_tips: "ଭଲ ଫଳାଫଳ ପାଇଁ:", cam_steady: "କ୍ୟାମେରା ସ୍ଥିର ରଖନ୍ତୁ", cam_light: "ଭଲ ଆଲୋକ ନିଶ୍ଚିତ କରନ୍ତୁ", cam_focus: "ପତ୍ର ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ", tap_scan: "ସ୍କାନ୍ ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ", est_delivery: "ଆନୁମାନିକ ବିତରଣ", days: "ଦିନ", process_img: "ପ୍ରକ୍ରିୟା କରନ୍ତୁ", live_ai: "ଲାଇଭ୍ ବିଶେଷଜ୍ଞ", live_connecting: "ଫାର୍ମୱାଇଜ୍ ଲାଇଭ୍ ସହିତ ସଂଯୋଗ ହେଉଛି...", live_ready: "ଫାର୍ମୱାଇଜ୍ ଲାଇଭ୍ ପ୍ରସ୍ତୁତ ଅଛି", live_hint: "ଆପଣଙ୍କ ଫାର୍ମ ବିଷୟରେ କିଛି ବି ପଚାରନ୍ତୁ |", live_listening: "ଶୁଣୁଛି...", live_speaking: "କହୁଛି..." }
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "Welcome to FarmWise",
    subtitle: "Grow Smarter, Not Harder",
    login_btn: "Login",
    phone_placeholder: "Enter Phone Number",
    name_placeholder: "Enter Your Name",
    location_label: "Location",
    detect_loc: "Detect Location",
    home: "Home",
    scan: "Scan",
    mandi: "Mandi",
    shop: "Shop",
    cart: "Cart",
    schemes: "Schemes",
    weather: "Weather",
    ask_ai: "Ask FarmWise AI",
    ask_placeholder: "Ask about crop, fertilizer...",
    crop_diagnosis: "Crop Diagnosis",
    instant_check: "Instant Disease Check",
    market_pulse: "Market Pulse",
    live: "LIVE",
    analysis: "Analysis",
    treatment: "Treatment",
    fertilizer: "Fertilizer",
    retake: "Retake Photo",
    consult_disclaimer: "Disclaimer: Consult local agriculture experts.",
    analyzing: "Analyzing Crop...",
    analyzing_desc: "Checking for diseases...",
    tab_rates: "Rates",
    tab_sell: "Sell Crops",
    tab_buy: "Buy Inputs",
    sell_title: "Sell to Consumers",
    buy_title: "Agri Store",
    consumer_buy_title: "Fresh From Farm",
    create_listing: "Create Listing",
    your_listings: "Your Listings",
    buy_btn: "Add to Cart",
    listing_success: "Listing Posted Successfully!",
    checkout: "Checkout",
    total: "Total",
    place_order: "Place Order",
    empty_cart: "Your cart is empty",
    order_success: "Order Placed Successfully!",
    role_farmer: "I am a Farmer",
    role_consumer: "I am a Consumer",
    ...COMMON_TRANSLATIONS.en
  },
  hi: {
    welcome: "फार्मवाइज में आपका स्वागत है",
    subtitle: "समझदारी से खेती करें",
    login_btn: "लॉग इन करें",
    phone_placeholder: "फ़ोन नंबर दर्ज करें",
    name_placeholder: "अपना नाम दर्ज करें",
    location_label: "स्थान",
    detect_loc: "स्थान का पता लगाएं",
    home: "होम",
    scan: "स्कैन",
    mandi: "मंडी",
    shop: "दुकान",
    cart: "कार्ट",
    schemes: "योजनाएं",
    weather: "मौसम",
    ask_ai: "फार्मवाइज एआई से पूछें",
    ask_placeholder: "फसल, खाद के बारे में पूछें...",
    crop_diagnosis: "फसल निदान",
    instant_check: "तुरंत रोग जांच",
    market_pulse: "बाजार",
    live: "लाइव",
    analysis: "विश्लेषण",
    treatment: "उपचार",
    fertilizer: "खाद सुझाव",
    retake: "फिर से फोटो लें",
    consult_disclaimer: "अस्वीकरण: स्थानीय कृषि विशेषज्ञ से सलाह लें।",
    analyzing: "फसल का विश्लेषण हो रहा है...",
    analyzing_desc: "रोगांची तपासणी करत आहे...",
    tab_rates: "भाव",
    tab_sell: "फसल बेचें",
    tab_buy: "सामान खरीदें",
    sell_title: "सीधे ग्राहकों को बेचें",
    buy_title: "कृषि दुकान",
    consumer_buy_title: "खेत से ताज़ा",
    create_listing: "लिस्टिंग बनाएं",
    your_listings: "आपकी लिस्टिंग",
    buy_btn: "कार्ट में डालें",
    listing_success: "लिस्टिंग सफल रही!",
    checkout: "चेकआउट",
    total: "कुल",
    place_order: "ऑर्डर करें",
    empty_cart: "आपकी कार्ट खाली है",
    order_success: "ऑर्डर सफल रहा!",
    role_farmer: "मैं किसान हूँ",
    role_consumer: "मैं ग्राहक हूँ",
    ...COMMON_TRANSLATIONS.hi
  },
  mr: {
    welcome: "फार्मवाइज मध्ये आपले स्वागत आहे",
    subtitle: "शहाणपणाने शेती करा",
    login_btn: "लॉग इन करा",
    phone_placeholder: "फोन नंबर प्रविष्ट करा",
    name_placeholder: "आपले नाव प्रविष्ट करा",
    location_label: "स्थान",
    detect_loc: "स्थान शोधा",
    home: "होम",
    scan: "स्कॅन",
    mandi: "बाजार",
    shop: "खरेदी",
    cart: "कार्ट",
    schemes: "योजना",
    weather: "हवामान",
    ask_ai: "फार्मवाइज एआय ला विचारा",
    ask_placeholder: "पीक, खताबद्दल विचारा...",
    crop_diagnosis: "पीक निदान",
    instant_check: "त्वरित रोग तपासणी",
    market_pulse: "बाजार पेठ",
    live: "थेट",
    analysis: "विश्लेषण",
    treatment: "उपचार",
    fertilizer: "खत सल्ला",
    retake: "पुन्हा फोटो घ्या",
    consult_disclaimer: "अस्वीकरण: स्थानिक कृषी तज्ञांचा सल्ला घ्या.",
    analyzing: "पिकाचे विश्लेषण करत आहे...",
    analyzing_desc: "रोगांची तपासणी करत आहे...",
    tab_rates: "दर",
    tab_sell: "विक्री करा",
    tab_buy: "खरेदी करा",
    sell_title: "थेट विक्री",
    buy_title: "कृषी दुकान",
    consumer_buy_title: "शेतकऱ्यांकडून थेट",
    create_listing: "नवीन विक्री",
    your_listings: "तुमच्या जाहिराती",
    buy_btn: "कार्टमध्ये टाका",
    listing_success: "यशस्वीरित्या जोडले!",
    checkout: "चेकआउट",
    total: "एकूण",
    place_order: "ऑर्डर करा",
    empty_cart: "तुमची कार्ट रिकामी आहे",
    order_success: "ऑर्डर यशस्वी झाली!",
    role_farmer: "मी शेतकरी आहे",
    role_consumer: "मी ग्राहक आहे",
    ...COMMON_TRANSLATIONS.mr
  },
  pa: {
    welcome: "ਫਾਰਮਵਾਈਜ਼ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    subtitle: "ਸਮਝਦਾਰੀ ਨਾਲ ਖੇਤੀ ਕਰੋ",
    login_btn: "ਲਾਗ ਇਨ ਕਰੋ",
    phone_placeholder: "ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    name_placeholder: "ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ",
    location_label: "ਟਿਕਾਣਾ",
    detect_loc: "ਟਿਕਾਣਾ ਲੱਭੋ",
    home: "ਘਰ",
    scan: "ਸਕੈਨ",
    mandi: "ਮੰਡੀ",
    shop: "ਦੁਕਾਨ",
    cart: "ਕਾਰਟ",
    schemes: "ਸਕੀਮਾਂ",
    weather: "ਮੌਸਮ",
    ask_ai: "ਫਾਰਮਵਾਈਜ਼ ਏਆਈ ਨੂੰ ਪੁੱਛੋ",
    ask_placeholder: "ਫਸਲ, ਖਾਦ ਬਾਰੇ ਪੁੱਛੋ...",
    crop_diagnosis: "ਫਸਲ ਦੀ ਜਾਂਚ",
    instant_check: "ਤੁਰੰਤ ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ",
    market_pulse: "ਬਾਜ਼ਾਰ",
    live: "ਲਾਈਵ",
    analysis: "ਵਿਸ਼ਲੇਸ਼ਣ",
    treatment: "ਇਲਾਜ",
    fertilizer: "ਖਾਦ ਸਲਾਹ",
    retake: "ਦੁਬਾਰਾ ਫੋਟੋ ਲਵੋ",
    consult_disclaimer: "ਬੇਦਾਅਵਾ: ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਿਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
    analyzing: "ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
    analyzing_desc: "ਬਿਮਾਰੀਆਂ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    tab_rates: "ਰੇਟ",
    tab_sell: "ਵੇਚੋ",
    tab_buy: "ਖਰੀਦੋ",
    sell_title: "ਗਾਹਕਾਂ ਨੂੰ ਵੇਚੋ",
    buy_title: "ਖੇਤੀ ਸਟੋਰ",
    consumer_buy_title: "ਖੇਤ ਤੋਂ ਤਾਜ਼ਾ",
    create_listing: "ਲਿਸਟਿੰਗ ਬਣਾਓ",
    your_listings: "ਤੁਹਾਡੀ ਲਿਸਟਿੰਗ",
    buy_btn: "ਕਾਰਟ ਵਿੱਚ ਪਾਓ",
    listing_success: "ਸਫਲਤਾਪੂਰਵਕ ਜੋੜਿਆ ਗਿਆ!",
    checkout: "ਚੈੱਕਆਉਟ",
    total: "ਕੁੱਲ",
    place_order: "ਆਰਡਰ ਕਰੋ",
    empty_cart: "ਤੁਹਾਡੀ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    order_success: "ਆਰਡਰ ਸਫਲ ਰਿਹਾ!",
    role_farmer: "ਮੈਂ ਕਿਸਾਨ ਹਾਂ",
    role_consumer: "ਮੈਂ ਗਾਹਕ ਹਾਂ",
    ...COMMON_TRANSLATIONS.pa
  },
  bn: {
    welcome: "FarmWise-এ স্বাগতম",
    subtitle: "বুদ্ধিমত্তার সাথে চাষ করুন",
    login_btn: "লগ ইন",
    phone_placeholder: "ফোন নম্বর লিখুন",
    name_placeholder: "আপনার নাম লিখুন",
    location_label: "অবস্থান",
    detect_loc: "অবস্থান শনাক্ত করুন",
    home: "হোম",
    scan: "স্ক্যান",
    mandi: "মন্ডি",
    shop: "দোকান",
    cart: "কার্ট",
    schemes: "স্কিম",
    weather: "আবহাওয়া",
    ask_ai: "FarmWise AI কে জিজ্ঞাসা করুন",
    ask_placeholder: "ফসল, সার সম্পর্কে জিজ্ঞাসা করুন...",
    crop_diagnosis: "ফসল রোগ নির্ণয়",
    instant_check: "তাত্ক্ষণিক রোগ পরীক্ষা",
    market_pulse: "বাজার",
    live: "লাইভ",
    analysis: "বিশ্লেষণ",
    treatment: "চিকিৎসা",
    fertilizer: "সার পরামর্শ",
    retake: "আবার ছবি তুলুন",
    consult_disclaimer: "দাবিত্যাগ: স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
    analyzing: "ফसल বিশ্লেষণ করা হচ্ছে...",
    analyzing_desc: "রোগ পরীক্ষা করা হচ্ছে...",
    tab_rates: "দর",
    tab_sell: "বিক্রয়",
    tab_buy: "ক্রয়",
    sell_title: "সরাসরি বিক্রয়",
    buy_title: "কৃষি দোকান",
    consumer_buy_title: "খামার থেকে তাজা",
    create_listing: "লিস্টিং তৈরি করুন",
    your_listings: "আপনার লিস্টিং",
    buy_btn: "কার্টে যোগ করুন",
    listing_success: "সফলভাবে পোস্ট করা হয়েছে!",
    checkout: "চেকআউট",
    total: "মোট",
    place_order: "অর্ডার করুন",
    empty_cart: "আপনার কার্ট খালি",
    order_success: "অর্ডার সফল হয়েছে!",
    role_farmer: "আমি কৃষক",
    role_consumer: "আমি ক্রেতা",
    ...COMMON_TRANSLATIONS.bn
  },
  gu: {
    welcome: "FarmWise માં સ્વાગત છે",
    subtitle: "સ્માર્ટ ખેતી કરો",
    login_btn: "લોગ ઇન કરો",
    phone_placeholder: "ફોન નંબર લખો",
    name_placeholder: "તમારું નામ લખો",
    location_label: "સ્થળ",
    detect_loc: "સ્થળ શોધો",
    home: "હોમ",
    scan: "સ્કેન",
    mandi: "મંડી",
    shop: "દુકાન",
    cart: "કાર્ટ",
    schemes: "યોજનાઓ",
    weather: "હવામાન",
    ask_ai: "FarmWise AI ને પૂછો",
    ask_placeholder: "પાક, ખાતર વિશે પૂછો...",
    crop_diagnosis: "પાક નિદાન",
    instant_check: "ત્વરિત રોગ તપાસ",
    market_pulse: "બજાર",
    live: "લાઇવ",
    analysis: "વિશ્લેષણ",
    treatment: "સારવાર",
    fertilizer: "ખાતર સલાહ",
    retake: "ફરીથી ફોટો લો",
    consult_disclaimer: "અસ્વીકરણ: સ્થાનિક કૃષિ નિષ્ણાતની સલાહ લો.",
    analyzing: "પાકનું વિશ્લેષણ થઈ રહ્યું છે...",
    analyzing_desc: "રોગોની તપાસ થઈ રહી છે...",
    tab_rates: "ભાવ",
    tab_sell: "વેચો",
    tab_buy: "ખરીદો",
    sell_title: "ગ્રાહકોને વેચો",
    buy_title: "કૃષિ સ્ટોર",
    consumer_buy_title: "ખેતરમાંથી તાજા",
    create_listing: "નવી લિસ્ટિંગ",
    your_listings: "તમારી લિસ્ટિંગ",
    buy_btn: "કાર્ટમાં ઉમેરો",
    listing_success: "સફળતાપૂર્વક ઉમેર્યું!",
    checkout: "ચેકઆઉટ",
    total: "કુલ",
    place_order: "ઓર્ડર કરો",
    empty_cart: "તમારી કાર્ટ ખાલી છે",
    order_success: "ઓર્ડર સફળ!",
    role_farmer: "હું ખેડૂત છું",
    role_consumer: "હું ગ્રાહક છું",
    ...COMMON_TRANSLATIONS.gu
  },
  ta: {
    welcome: "FarmWise-க்கு வரவேற்கிறோம்",
    subtitle: "புத்திசாலித்தனமாக பயிரிடுங்கள்",
    login_btn: "உள்நுழைய",
    phone_placeholder: "தொலைபேசி எண்",
    name_placeholder: "உங்கள் பெயர்",
    location_label: "இடம்",
    detect_loc: "இடத்தைக் கண்டுபிடி",
    home: "முகப்பு",
    scan: "ஸ்கேன்",
    mandi: "சந்தை",
    shop: "கடை",
    cart: "வண்டி",
    schemes: "திட்டங்கள்",
    weather: "வானிலை",
    ask_ai: "FarmWise AI-இடம் கேளுங்கள்",
    ask_placeholder: "பயிர், உரம் பற்றி கேட்க...",
    crop_diagnosis: "பயிர் நோய் கண்டறிதல்",
    instant_check: "உடனடி நோய் ஆய்வு",
    market_pulse: "சந்தை",
    live: "நேரலை",
    analysis: "பகுப்பாய்வு",
    treatment: "சிகிச்சை",
    fertilizer: "உர ஆலோசனை",
    retake: "மீண்டும் புகைப்படம் எடுக்கவும்",
    consult_disclaimer: "பொறுப்புத்துறப்பு: உள்ளூர் வேளாண் நிபுணரை அணுகவும்.",
    analyzing: "பயிர் பகுப்பாய்வு...",
    analyzing_desc: "நோய்களை சரிபார்க்கிறது...",
    tab_rates: "விலை",
    tab_sell: "விற்க",
    tab_buy: "வாங்க",
    sell_title: "நேரடி விற்பனை",
    buy_title: "வேளாண் கடை",
    consumer_buy_title: "பண்ணையிலிருந்து புதியது",
    create_listing: "பட்டியலை உருவாக்கு",
    your_listings: "உங்கள் பட்டியல்கள்",
    buy_btn: "வண்டியில் சேர்",
    listing_success: "வெற்றிகரமாகச் சேர்க்கப்பட்டது!",
    checkout: "செக்அவுட்",
    total: "மொத்தம்",
    place_order: "ஆர்டர் செய்யவும்",
    empty_cart: "உங்கள் வண்டி காலியாக உள்ளது",
    order_success: "ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!",
    role_farmer: "நான் விவசாயி",
    role_consumer: "நான் நுகர்வோர்",
    ...COMMON_TRANSLATIONS.ta
  },
  te: {
    welcome: "FarmWise కి స్వాగతం",
    subtitle: "తెలివిగా సాగు చేయండి",
    login_btn: "లాగిన్",
    phone_placeholder: "ఫోన్ నంబర్",
    name_placeholder: "మీ పేరు",
    location_label: "ప్రాంతం",
    detect_loc: "ప్రాంతాన్ని గుర్తించు",
    home: "హోమ్",
    scan: "స్కాన్",
    mandi: "మండి",
    shop: "దుకాణం",
    cart: "బండి",
    schemes: "పథకాలు",
    weather: "వాతావరణం",
    ask_ai: "FarmWise AI ని అడగండి",
    ask_placeholder: "పంట, ఎరువుల గురించి అడగండి...",
    crop_diagnosis: "పంట నిర్ధారణ",
    instant_check: "తక్షణ వ్యాధి తనిఖీ",
    market_pulse: "మార్కెట్",
    live: "లైవ్",
    analysis: "విశ్లేషణ",
    treatment: "చికిత్సా",
    fertilizer: "ఎరువుల సలహా",
    retake: "మళ్ళీ ఫోటో తీయండి",
    consult_disclaimer: "నిరాకరణ: స్థానిక వ్యవసాయ నిపుణుడిని సంప్రదించండి.",
    analyzing: "పంట విశ్లేషణ జరుగుతోంది...",
    analyzing_desc: "వ్యాధుల కోసం తనిఖీ చేస్తోంది...",
    tab_rates: "ధరలు",
    tab_sell: "అమ్మకం",
    tab_buy: "కొనుగోలు",
    sell_title: "వినియోగదారులకు అమ్మండి",
    buy_title: "వ్యవసాయ దుకాణం",
    consumer_buy_title: "పొలం నుండి తాజాగా",
    create_listing: "లిస్టింగ్ సృష్టించు",
    your_listings: "మీ లిస్టింగ్స్",
    buy_btn: "బండికి జోడించు",
    listing_success: "విజయవంతంగా పోస్ట్ చేయబడింది!",
    checkout: "చెక్వుట్",
    total: "మొత్తం",
    place_order: "ఆర్డర్ చేయండి",
    empty_cart: "మీ బండి ఖాళీగా ఉంది",
    order_success: "ఆర్డర్ విజయవంతమైంది!",
    role_farmer: "నేను రైతుని",
    role_consumer: "నేను వినియోగదారుని",
    ...COMMON_TRANSLATIONS.te
  },
  kn: {
    welcome: "FarmWise ಗೆ ಸ್ವಾಗತ",
    subtitle: "ಜಾಣತನದಿಂದ ಕೃಷಿ ಮಾಡಿ",
    login_btn: "ಲಾಗಿನ್",
    phone_placeholder: "ಫೋನ್ ಸಂಖ್ಯೆ",
    name_placeholder: "ನಿಮ್ಮ ಹೆಸರು",
    location_label: "ಸ್ಥಳ",
    detect_loc: "ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಿ",
    home: "ಮುಖಪುಟ",
    scan: "ಸ್ಕ್ಯಾನ್",
    mandi: "ಮಾರುಕಟ್ಟೆ",
    shop: "ಅಂಗಡಿ",
    cart: "ಕಾರ್ಟ್",
    schemes: "ಯೋಜನೆಗಳು",
    weather: "ಹವಾಮಾನ",
    ask_ai: "FarmWise AI ಕೇಳಿ",
    ask_placeholder: "ಬೆಳೆ, ರಸಗೊಬ್ಬರ ಬಗ್ಗೆ ಕೇಳಿ...",
    crop_diagnosis: "ಬೆಳೆ ರೋಗನಿರ್ಣಯ",
    instant_check: "ತಕ್ಷಣದ ರೋಗ ತಪಾಸಣೆ",
    market_pulse: "ಮಾರುಕಟ್ಟೆ",
    live: "ಲೈವ್",
    analysis: "ವಿಶ್ಲೇಷಣೆ",
    treatment: "ಚಿಕಿತ್ಸೆ",
    fertilizer: "ಗೊಬ್ಬರ ಸಲಹೆ",
    retake: "ಮತ್ತೆ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
    consult_disclaimer: "ಹಕ್ಕು ನಿರಾಕರಣೆ: ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    analyzing: "ಬೆಳೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    analyzing_desc: "ರೋಗಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    tab_rates: "ದರಗಳು",
    tab_sell: "ಮಾರಾಟ",
    tab_buy: "ಖರೀದಿ",
    sell_title: "ನೇರ ಮಾರಾಟ",
    buy_title: "ಕೃಷಿ ಅಂಗಡಿ",
    consumer_buy_title: "ಹೊಲದಿಂದ ತಾಜಾ",
    create_listing: "ಪಟ್ಟಿ ಮಾಡಿ",
    your_listings: "ನಿಮ್ಮ ಪಟ್ಟಿಗಳು",
    buy_btn: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    listing_success: "ಯಶಸ್ವಿಯಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ!",
    checkout: "ಚೆಕ್ಔಟ್",
    total: "ಒಟ್ಟು",
    place_order: "ಆರ್ಡರ್ ಮಾಡಿ",
    empty_cart: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    order_success: "ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
    role_farmer: "ನಾನು ರೈತ",
    role_consumer: "ನಾನು ಗ್ರಾಹಕ",
    ...COMMON_TRANSLATIONS.kn
  },
  ml: {
    welcome: "FarmWise-ലേക്ക് സ്വാഗതം",
    subtitle: "ബുദ്ധിപൂർവ്വം കൃഷി ചെയ്യൂ",
    login_btn: "ലോഗിൻ",
    phone_placeholder: "ഫോൺ നമ്പർ",
    name_placeholder: "നിങ്ങളുടെ പേര്",
    location_label: "സ്ഥലം",
    detect_loc: "സ്ഥലം കണ്ടെത്തുക",
    home: "ഹോം",
    scan: "സ്കാൻ",
    mandi: "ചന്ത",
    shop: "കട",
    cart: "കാർട്ട്",
    schemes: "പദ്ധതികൾ",
    weather: "കാലാവസ്ഥ",
    ask_ai: "FarmWise AI-യോട് ചോദിക്കൂ",
    ask_placeholder: "വിള, വളം എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    crop_diagnosis: "വിള രോഗനിർണ്ണയം",
    instant_check: "രോഗ പരിശോധന",
    market_pulse: "വിപണി",
    live: "ലൈവ്",
    analysis: "വിശകലനം",
    treatment: "ചികിത്സ",
    fertilizer: "വളപ്രയോഗം",
    retake: "വീണ്ടും ഫോട്ടോ എടുക്കുക",
    consult_disclaimer: "നിരാകരണം: പ്രാദേശിക കാർഷിക വിദഗ്ദ്ധനെ സമീപിക്കുക.",
    analyzing: "വിള വിശകലനം ചെയ്യുന്നു...",
    analyzing_desc: "രോഗങ്ങൾ പരിശോധിക്കുന്നു...",
    tab_rates: "നിരക്കുകൾ",
    tab_sell: "വിൽക്കുക",
    tab_buy: "വാങ്ങുക",
    sell_title: "നേരിട്ടുള്ള വിൽപ്പന",
    buy_title: "അഗ്രി സ്റ്റോർ",
    consumer_buy_title: "പുതിയ വിളകൾ",
    create_listing: "ലിസ്റ്റിംഗ് ചേർക്കുക",
    your_listings: "നിങ്ങളുടെ ലിസ്റ്റിംഗുകൾ",
    buy_btn: "കാർട്ടിലേക്ക് ചേർക്കുക",
    listing_success: "വിജയകരമായി ചേർത്തു!",
    checkout: "ചെക്ക്ഔട്ട്",
    total: "ആകെ",
    place_order: "ഓർഡർ ചെയ്യുക",
    empty_cart: "നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്",
    order_success: "ഓർഡർ വിജയകരം!",
    role_farmer: "ഞാൻ കർഷകൻ",
    role_consumer: "ഞാൻ ഉപഭോക്താവ്",
    ...COMMON_TRANSLATIONS.ml
  },
  or: {
    welcome: "FarmWise କୁ ସ୍ୱାଗତ",
    subtitle: "ବୁଦ୍ଧିମାନ ଭାବରେ ଚାଷ କରନ୍ତୁ",
    login_btn: "ଲଗ୍ ଇନ୍",
    phone_placeholder: "ଫୋନ୍ ନମ୍ବର",
    name_placeholder: "ଆପଣଙ୍କ ନାମ",
    location_label: "ସ୍ଥାନ",
    detect_loc: "ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",
    home: "ମୂଳ ପୃଷ୍ଠା",
    scan: "ସ୍କାନ୍",
    mandi: "ମଣ୍ଡି",
    shop: "ଦୋକାନ",
    cart: "କାର୍ଟ",
    schemes: "ଯୋଜନା",
    weather: "ପାଣିପାଗ",
    ask_ai: "FarmWise AI କୁ ପଚାରନ୍ତୁ",
    ask_placeholder: "ଫସଲ, ସାର ବିଷୟରେ ପଚାରନ୍ତୁ...",
    crop_diagnosis: "ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ",
    instant_check: "ତୁରନ୍ତ ରୋଗ ଯାଞ୍ଚ",
    market_pulse: "ବଜାର",
    live: "ଲାଇଭ୍",
    analysis: "ବିଶ୍ଳେଷଣ",
    treatment: "ଚିକିତ୍ସା",
    fertilizer: "ସାର ପରାମର୍ଶ",
    retake: "ପୁନର୍ବାର ଫଟୋ ନିଅନ୍ତୁ",
    consult_disclaimer: "ଦାବିତ୍ୟାଗ: ସ୍ଥାନୀୟ କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ସହିତ ପରାମର୍ଶ କରନ୍ତୁ |",
    analyzing: "ଫସଲ ବିଶ୍ଳେଷଣ କରାଯାଉଛି...",
    analyzing_desc: "ରୋଗ ଯାଞ୍ચ କରାଯାଉଛି...",
    tab_rates: "ଦର",
    tab_sell: "ବିକ୍ରୟ",
    tab_buy: "କ୍ରୟ",
    sell_title: "ସିଧାସଳଖ ବିକ୍ରୟ",
    buy_title: "କୃଷି ଦୋକାନ",
    consumer_buy_title: "ସତେଜ ପରିବା",
    create_listing: "ଲିଷ୍ଟିଙ୍ଗ୍ କରନ୍ତୁ",
    your_listings: "ଆପଣଙ୍କ ତାଲିକା",
    buy_btn: "କାର୍ଟରେ ଯୋଡନ୍ତୁ",
    listing_success: "ସଫଳତାର ସହ ପୋଷ୍ଟ କରାଯାଇଛି!",
    checkout: "ଚେକ୍ ଆଉଟ୍",
    total: "ମୋଟ",
    place_order: "ଅର୍ଡର କରନ୍ତୁ",
    empty_cart: "ଆପଣଙ୍କ କାର୍ଟ ଖାଲି ଅଛି",
    order_success: "ଅର୍ଡର ସଫଳ ହେଲା!",
    role_farmer: "ମୁଁ କୃଷକ",
    role_consumer: "ମୁଁ ଗ୍ରାହକ",
    ...COMMON_TRANSLATIONS.or
  }
};

export const MOCK_INPUT_PRODUCTS: InputProduct[] = [
  { id: '1', name: 'Neem Oil', category: 'Pesticide', price: 450, description: 'Organic Pest Repellent (1L)', image: '🌿', unit: 'bottle' },
  { id: '2', name: 'Urea Fertilizer', category: 'Fertilizer', price: 266, description: 'Nitrogen Rich (45kg Bag)', image: '⚪', unit: 'bag' },
  { id: '3', name: 'DAP 18:46:0', category: 'Fertilizer', price: 1350, description: 'Phosphorus Fertilizer (50kg)', image: '🟤', unit: 'bag' },
  { id: '4', name: 'Hybrid Tomato Seeds', category: 'Seeds', price: 850, description: 'High Yield Variety (10g)', image: '🍅', unit: 'packet' },
  { id: '5', name: 'Knapsack Sprayer', category: 'Tools', price: 2200, description: '16L Manual Pump', image: '🚿', unit: 'piece' },
];

export const getInputProducts = (lang: Language): InputProduct[] => {
    return MOCK_INPUT_PRODUCTS.map(product => {
        const trans = INPUT_PRODUCT_TRANSLATIONS[product.name]?.[lang];
        if (trans) {
            return { ...product, ...trans };
        }
        return product;
    });
};

export const FARMER_MARKET_LISTINGS: InputProduct[] = [
  { id: '101', name: 'Fresh Red Onions', category: 'Vegetables', price: 30, description: 'Direct from Nashik Farms', image: '🧅', unit: 'kg' },
  { id: '102', name: 'Indrayani Rice', category: 'Grains', price: 65, description: 'Aromatic New Crop', image: '🍚', unit: 'kg' },
  { id: '103', name: 'Alphanso Mangoes', category: 'Fruits', price: 800, description: 'Ratnagiri Organic (Dozen)', image: '🥭', unit: 'dozen' },
  { id: '104', name: 'Desi Wheat', category: 'Grains', price: 45, description: 'Whole grain, stone ground quality', image: '🌾', unit: 'kg' },
  { id: '105', name: 'Organic Spinach', category: 'Vegetables', price: 20, description: 'Fresh morning harvest', image: '🥬', unit: 'bunch' },
];

export const getFarmerMarketListings = (lang: Language): InputProduct[] => {
    return FARMER_MARKET_LISTINGS.map(product => {
        const trans = FARMER_MARKET_TRANSLATIONS[product.name]?.[lang];
        if (trans) {
            return { ...product, ...trans };
        }
        return product;
    });
};

// Base schemes list (English)
export const MOCK_SCHEMES: Scheme[] = [
  {
    name: 'PM-KISAN',
    localName: 'PM Kisan Samman Nidhi',
    benefits: '₹6,000/year income support in 3 installments.',
    eligibility: 'All landholding farmer families.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    name: 'PMFBY',
    localName: 'Pradhan Mantri Fasal Bima Yojana',
    benefits: 'Crop insurance against non-preventable natural risks.',
    eligibility: 'Farmers including sharecroppers & tenant farmers.',
    link: 'https://pmfby.gov.in/'
  },
  {
    name: 'PMKSY',
    localName: 'Pradhan Mantri Krishi Sinchayee Yojana',
    benefits: 'Subsidy on micro-irrigation (drip/sprinkler).',
    eligibility: 'Farmers with cultivable land.',
    link: 'https://pmksy.gov.in/'
  },
  {
    name: 'e-NAM',
    localName: 'National Agriculture Market',
    benefits: 'Online trading platform for better price discovery.',
    eligibility: 'Farmers registered with APMC.',
    link: 'https://enam.gov.in/web/'
  },
  {
    name: 'Soil Health Card',
    localName: 'Mridaparikshak',
    benefits: 'Soil nutrient status & fertilizer recommendations.',
    eligibility: 'All farmers.',
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    name: 'PKVY',
    localName: 'Paramparagat Krishi Vikas Yojana',
    benefits: '₹50,000/ha for organic farming inputs & marketing.',
    eligibility: 'Farmers forming clusters for organic farming.',
    link: 'https://dms.jaivikkheti.in/'
  },
  {
    name: 'PM-KMY',
    localName: 'Pradhan Mantri Kisan Maan-Dhan Yojana',
    benefits: 'Minimum pension of ₹3000/month after age 60.',
    eligibility: 'Small/Marginal farmers (18-40 yrs, <2ha land).',
    link: 'https://maandhan.in/'
  },
  {
    name: 'KCC',
    localName: 'Kisan Credit Card',
    benefits: 'Credit for cultivation, harvest, and household needs.',
    eligibility: 'Farmers, tenant farmers, sharecroppers, SHGs.',
    link: 'https://myscheme.gov.in/schemes/kcc'
  },
  {
    name: 'RKVY',
    localName: 'Rashtriya Krishi Vikas Yojana',
    benefits: 'Support for infrastructure & assets creation.',
    eligibility: 'States/Farmers based on project approval.',
    link: 'https://rkvy.nic.in/'
  },
  {
    name: 'MIDH',
    localName: 'Mission for Integrated Development of Horticulture',
    benefits: 'Subsidy for greenhouses, planting material, cold storage.',
    eligibility: 'Farmers, FPOs, SHGs in horticulture.',
    link: 'https://midh.gov.in/'
  },
  {
    name: 'SMAM',
    localName: 'Sub-Mission on Agricultural Mechanization',
    benefits: 'Subsidy on tractors and farm machinery (up to 50-80%).',
    eligibility: 'All farmers (higher subsidy for SC/ST/Women).',
    link: 'https://agrimachinery.nic.in/'
  },
  {
    name: 'AIF',
    localName: 'Agriculture Infrastructure Fund',
    benefits: 'Interest subvention of 3% on loans for post-harvest infra.',
    eligibility: 'Farmers, FPOs, PACS, Startups.',
    link: 'https://agriinfra.dac.gov.in/'
  },
  {
    name: 'ISAC',
    localName: 'Integrated Scheme for Agricultural Cooperation',
    benefits: 'Financial assistance to cooperatives for processing/storage.',
    eligibility: 'Cooperative societies.',
    link: 'https://ncdc.in/'
  },
  {
    name: 'FPO Scheme',
    localName: 'Formation of 10,000 FPOs',
    benefits: 'Financial support up to ₹18 lakh per FPO for 3 years.',
    eligibility: 'Cluster of farmers forming a company.',
    link: 'https://enam.gov.in/web/fpo_resources'
  },
  {
    name: 'Rainfed Area Development',
    localName: 'NMSA - RAD',
    benefits: 'Support for Integrated Farming Systems (IFS).',
    eligibility: 'Farmers in rainfed districts.',
    link: 'https://nmsa.dac.gov.in/'
  }
];

// Helper to get schemes with translations
export const getSchemes = (lang: Language = 'en'): Scheme[] => {
    return MOCK_SCHEMES.map(scheme => {
        const trans = SCHEME_TRANSLATIONS[lang]?.[scheme.name];
        if (trans) {
            return { ...scheme, ...trans };
        }
        return scheme;
    });
};

const formatCropName = (name: string, lang: Language): string => {
    if (lang === 'en') return name;
    
    // Strip text in brackets for lookup if needed, though our keys mostly don't have brackets except specific ones
    const translation = CROP_TRANSLATIONS[name]?.[lang];
    if (translation) {
        return `${translation} (${name})`;
    }
    return name;
};

export const getMarketPricesForLocation = (location: string, lang: Language = 'en'): MarketItem[] => {
  let items: MarketItem[] = [];

  // Enhanced mapping
  if (location.includes("Punjab")) {
      items = [
        { crop: 'Wheat', price: 2350, unit: '₹/Q', trend: 'up', mandi: 'Khanna, PB' },
        { crop: 'Paddy (Basmati)', price: 3950, unit: '₹/Q', trend: 'stable', mandi: 'Rajpura, PB' },
        { crop: 'Cotton', price: 7100, unit: '₹/Q', trend: 'down', mandi: 'Bhatinda, PB' },
        { crop: 'Maize', price: 2100, unit: '₹/Q', trend: 'up', mandi: 'Hoshiarpur, PB' },
        { crop: 'Potato', price: 1200, unit: '₹/Q', trend: 'stable', mandi: 'Jalandhar, PB' },
        { crop: 'Kinnow', price: 2500, unit: '₹/Q', trend: 'up', mandi: 'Abohar, PB' },
      ];
  } else if (location.includes("Haryana")) {
      items = [
        { crop: 'Paddy (Basmati)', price: 3900, unit: '₹/Q', trend: 'stable', mandi: 'Karnal, HR' },
        { crop: 'Mustard', price: 5400, unit: '₹/Q', trend: 'down', mandi: 'Hisar, HR' },
        { crop: 'Sugarcane', price: 370, unit: '₹/Q', trend: 'up', mandi: 'Yamunanagar, HR' },
        { crop: 'Wheat', price: 2325, unit: '₹/Q', trend: 'stable', mandi: 'Rohtak, HR' },
        { crop: 'Bajra', price: 2200, unit: '₹/Q', trend: 'up', mandi: 'Bhiwani, HR' },
        { crop: 'Sunflower', price: 5800, unit: '₹/Q', trend: 'down', mandi: 'Shahabad, HR' },
      ];
  } else if (location.includes("Pune")) {
      items = [
        { crop: 'Onion (Red)', price: 2100, unit: '₹/Q', trend: 'up', mandi: 'Pune Market Yard' },
        { crop: 'Jowar', price: 3200, unit: '₹/Q', trend: 'stable', mandi: 'Pune Market Yard' },
        { crop: 'Potato', price: 1500, unit: '₹/Q', trend: 'down', mandi: 'Manchar, MH' },
        { crop: 'Tomato', price: 1800, unit: '₹/Q', trend: 'up', mandi: 'Narayangaon, MH' },
        { crop: 'Marigold', price: 60, unit: '₹/kg', trend: 'up', mandi: 'Pune Flower Mkt' },
        { crop: 'Pomegranate', price: 7500, unit: '₹/Q', trend: 'down', mandi: 'Indapur, MH' },
      ];
  } else if (location.includes("Nashik")) {
      items = [
        { crop: 'Onion', price: 1950, unit: '₹/Q', trend: 'up', mandi: 'Lasalgaon, MH' },
        { crop: 'Grapes', price: 5500, unit: '₹/Q', trend: 'down', mandi: 'Pimpalgaon, MH' },
        { crop: 'Tomato', price: 1100, unit: '₹/Q', trend: 'stable', mandi: 'Nashik, MH' },
        { crop: 'Maize', price: 2050, unit: '₹/Q', trend: 'up', mandi: 'Malegaon, MH' },
        { crop: 'Soybean', price: 4600, unit: '₹/Q', trend: 'stable', mandi: 'Yeola, MH' },
        { crop: 'Pomegranate', price: 8200, unit: '₹/Q', trend: 'up', mandi: 'Satana, MH' },
      ];
  } else if (location.includes("Madhya Pradesh")) {
      items = [
        { crop: 'Soybean', price: 4750, unit: '₹/Q', trend: 'up', mandi: 'Indore, MP' },
        { crop: 'Wheat', price: 2400, unit: '₹/Q', trend: 'stable', mandi: 'Ujjain, MP' },
        { crop: 'Garlic', price: 9000, unit: '₹/Q', trend: 'down', mandi: 'Mandsaur, MP' },
        { crop: 'Chickpea (Chana)', price: 5200, unit: '₹/Q', trend: 'up', mandi: 'Dewas, MP' },
        { crop: 'Potato', price: 1100, unit: '₹/Q', trend: 'stable', mandi: 'Indore, MP' },
        { crop: 'Onion', price: 1600, unit: '₹/Q', trend: 'down', mandi: 'Ratlam, MP' },
      ];
  } else if (location.includes("Uttar Pradesh")) {
      items = [
        { crop: 'Potato', price: 950, unit: '₹/Q', trend: 'down', mandi: 'Lucknow, UP' },
        { crop: 'Mango (Dasheri)', price: 4500, unit: '₹/Q', trend: 'up', mandi: 'Malihabad, UP' },
        { crop: 'Rice', price: 2900, unit: '₹/Q', trend: 'stable', mandi: 'Barabanki, UP' },
        { crop: 'Wheat', price: 2300, unit: '₹/Q', trend: 'stable', mandi: 'Kanpur, UP' },
        { crop: 'Mustard', price: 5100, unit: '₹/Q', trend: 'up', mandi: 'Agra, UP' },
        { crop: 'Peas (Green)', price: 3500, unit: '₹/Q', trend: 'down', mandi: 'Varanasi, UP' },
      ];
  } else if (location.includes("Gujarat")) {
      items = [
        { crop: 'Cotton', price: 7250, unit: '₹/Q', trend: 'up', mandi: 'Rajkot, GJ' },
        { crop: 'Groundnut', price: 6100, unit: '₹/Q', trend: 'up', mandi: 'Gondal, GJ' },
        { crop: 'Cumin (Jeera)', price: 28500, unit: '₹/Q', trend: 'down', mandi: 'Unjha, GJ' },
        { crop: 'Castor Seed', price: 5900, unit: '₹/Q', trend: 'stable', mandi: 'Patan, GJ' },
        { crop: 'Wheat', price: 2500, unit: '₹/Q', trend: 'up', mandi: 'Ahmedabad, GJ' },
        { crop: 'Sesame', price: 12000, unit: '₹/Q', trend: 'down', mandi: 'Amreli, GJ' },
      ];
  } else if (location.includes("Andhra Pradesh")) {
       items = [
        { crop: 'Chilli', price: 19500, unit: '₹/Q', trend: 'down', mandi: 'Guntur, AP' },
        { crop: 'Turmeric', price: 6900, unit: '₹/Q', trend: 'stable', mandi: 'Duggirala, AP' },
        { crop: 'Maize', price: 2100, unit: '₹/Q', trend: 'up', mandi: 'Vijayawada, AP' },
        { crop: 'Cotton', price: 7000, unit: '₹/Q', trend: 'up', mandi: 'Adoni, AP' },
        { crop: 'Black Gram', price: 6500, unit: '₹/Q', trend: 'stable', mandi: 'Ongole, AP' },
        { crop: 'Tobacco', price: 22000, unit: '₹/Q', trend: 'up', mandi: 'Guntur, AP' },
      ];
  } else if (location.includes("Tamil Nadu")) {
       items = [
        { crop: 'Turmeric', price: 6800, unit: '₹/Q', trend: 'up', mandi: 'Erode, TN' },
        { crop: 'Coconut', price: 2600, unit: '₹/100', trend: 'stable', mandi: 'Pollachi, TN' },
        { crop: 'Banana', price: 1500, unit: '₹/Bunch', trend: 'down', mandi: 'Trichy, TN' },
        { crop: 'Tapioca', price: 3200, unit: '₹/Q', trend: 'up', mandi: 'Salem, TN' },
        { crop: 'Tea (Green Leaf)', price: 25, unit: '₹/kg', trend: 'stable', mandi: 'Coonoor, TN' },
        { crop: 'Tomato', price: 1400, unit: '₹/Q', trend: 'down', mandi: 'Dindigul, TN' },
      ];
  } else if (location.includes("Karnataka")) {
       items = [
        { crop: 'Arecanut', price: 48000, unit: '₹/Q', trend: 'up', mandi: 'Shimoga, KA' },
        { crop: 'Coffee', price: 18000, unit: '₹/50kg', trend: 'stable', mandi: 'Chikmagalur, KA' },
        { crop: 'Ragi', price: 2800, unit: '₹/Q', trend: 'down', mandi: 'Hassan, KA' },
        { crop: 'Pepper', price: 49000, unit: '₹/Q', trend: 'up', mandi: 'Madikeri, KA' },
        { crop: 'Maize', price: 2000, unit: '₹/Q', trend: 'stable', mandi: 'Haveri, KA' },
        { crop: 'Onion', price: 1800, unit: '₹/Q', trend: 'down', mandi: 'Hubli, KA' },
      ];
  } else {
      items = [
        { crop: 'Wheat', price: 2275, unit: '₹/Q', trend: 'stable', mandi: 'Local Mandi' },
        { crop: 'Rice', price: 3100, unit: '₹/Q', trend: 'up', mandi: 'Local Mandi' },
        { crop: 'Tomato', price: 1200, unit: '₹/Q', trend: 'down', mandi: 'Local Mandi' },
        { crop: 'Potato', price: 1400, unit: '₹/Q', trend: 'stable', mandi: 'Local Mandi' },
        { crop: 'Onion', price: 1900, unit: '₹/Q', trend: 'up', mandi: 'Local Mandi' },
      ];
  }

  // Apply translations
  return items.map(item => ({
      ...item,
      crop: formatCropName(item.crop, lang)
  }));
};

// Default constants for fallback
export const MOCK_MARKET_DATA = getMarketPricesForLocation("Pune, Maharashtra");