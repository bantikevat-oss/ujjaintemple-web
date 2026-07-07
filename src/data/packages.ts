import { Bilingual } from '../lib/types';

export interface TourPackageData {
  slug: string;
  title: Bilingual;
  heroImage: string;
  description: Bilingual;
  itinerary: Array<{
    dayTitle: Bilingual;
    content: Bilingual;
    list?: Bilingual[];
    note?: Bilingual;
  }>;
}

export const packagesData: TourPackageData[] = [
  {
    slug: 'ujjain-darshan-package',
    title: {
      hi: 'उज्जैन दर्शन टैक्सी टूर पैकेज',
      en: 'Ujjain Darshan Taxi Tour Package'
    },
    heroImage: '/images/mandirs/mahakaleshwar.jpg', // Using existing mahakal image
    description: {
      hi: 'इस 1 दिवसीय पैकेज में उज्जैन शहर के प्रमुख और प्राचीन मंदिरों के दर्शन शामिल हैं। आप श्री महाकालेश्वर ज्योतिर्लिंग के दिव्य दर्शन के साथ काल भैरव (जहाँ मदिरा का प्रसाद चढ़ाया जाता है), माँ हरसिद्धि (51 शक्तिपीठों में से एक), चिंतामण गणेश, सांदीपनी आश्रम और मंगलनाथ मंदिर (मंगल ग्रह का जन्मस्थान) जैसे अत्यंत पवित्र स्थलों का भ्रमण करेंगे। एक ही दिन में उज्जैन की पूरी आध्यात्मिक ऊर्जा का अनुभव करें।',
      en: 'This comprehensive 1-day package covers the major ancient and sacred temples of Ujjain city. Along with the divine darshan of Shree Mahakaleshwar Jyotirlinga, you will visit highly revered sites like Kaal Bhairav (where liquor is offered as prasad), Maa Harsiddhi (one of the 51 Shaktipeeths), Chintaman Ganesh, Sandipani Ashram, and Mangalnath Temple (the birthplace of Mars). Experience the complete spiritual essence of Ujjain in a single day.'
    },
    itinerary: [
      {
        dayTitle: {
          hi: 'पहला दिन: उज्जैन आगमन',
          en: 'Day 1: Arrival in Ujjain'
        },
        content: {
          hi: 'सुबह उज्जैन पहुँचें। हमारे प्रतिनिधि आपको स्टेशन/बस स्टैंड से रिसीव करेंगे। होटल में चेक-इन करें, फ्रेश हों और दर्शन के लिए तैयार हो जाएं।',
          en: 'Morning: Arrive in Ujjain. You will be greeted by our representative at the station. Check-in to your hotel, freshen up and get ready for a fulfilling day ahead.'
        }
      },
      {
        dayTitle: {
          hi: 'उज्जैन दर्शन: आध्यात्मिक ऊर्जा का अनुभव करें',
          en: 'Ujjain Exploration: Dive into the Spiritual Vibe'
        },
        content: {
          hi: 'सुविधाजनक और आरामदायक टैक्सी द्वारा उज्जैन के प्रमुख मंदिरों के दर्शन करें।',
          en: 'As the sun climbs higher, our reliable and comfortable taxi service will take you on a memorable spiritual journey.'
        },
        list: [
          { hi: 'श्री महाकालेश्वर मंदिर: 12 ज्योतिर्लिंगों में से एक के दर्शन करें।', en: 'Shree Mahakaleshwar Temple: Start your day at the Shree Mahakaleshwar Temple, a place where you can connect with the divine.' },
          { hi: 'हरसिद्धि माता मंदिर: 51 शक्तिपीठों में से एक, माता के दर्शन करें।', en: 'Harsiddhi Temple: Next, visit the Harsiddhi Temple, one of the 51 Shaktipeeths in India.' },
          { hi: 'काल भैरव मंदिर: उज्जैन के रक्षक देवता के दर्शन।', en: 'Kaal Bhairav Temple: Explore the unique Kaal Bhairav Temple, dedicated to the guardian deity of Ujjain.' },
          { hi: 'संदीपनि आश्रम: भगवान कृष्ण की शिक्षा स्थली।', en: 'Sandipani Ashram: Discover peace at Sandipani Ashram, an inspiring place for seekers of wisdom.' },
          { hi: 'चौबीस खंबा माता मंदिर: ऐतिहासिक और शक्तिशाली मंदिर।', en: 'Chaubis Khamba Mata Temple: Feel the spiritual aura at Chaubis Khamba Mata Temple.' },
          { hi: 'राम घाट: पवित्र शिप्रा नदी के तट पर शांति का अनुभव।', en: 'Ram Ghat: Visit the peaceful Ram Ghat, where spirituality meets the holy river.' },
          { hi: 'मंगलनाथ मंदिर: भगवान मंगल की जन्मभूमि, पूजा अर्चना करें।', en: 'Mangalnath Temple: Experience the serenity at Mangalnath Temple, a place of peace in Ujjain.' },
          { hi: 'इस्कॉन मंदिर: भगवान कृष्ण के भजन और कीर्तन का आनंद लें।', en: 'ISKCON Temple: End your journey at ISKCON Temple, where faith and devotion will lift your spirit.' }
        ],
        note: {
          hi: 'नोट: महाकालेश्वर भस्म आरती की बुकिंग केवल मंदिर की आधिकारिक वेबसाइट पर एडवांस में होती है।',
          en: "Note: Mahakaleshwar Bhasma Aarti booking is done only in advance on the temple's official website."
        }
      }
    ]
  },
  {
    slug: 'ujjain-omkareshwar-package',
    title: {
      hi: 'उज्जैन - ओंकारेश्वर पैकेज',
      en: 'Ujjain - Omkareshwar Package'
    },
    heroImage: '/images/mandirs/omkareshwar.png',
    description: {
      hi: 'यह 2 दिवसीय विशेष यात्रा आपको भगवान शिव के दो सबसे प्रतिष्ठित ज्योतिर्लिंगों - उज्जैन में श्री महाकालेश्वर और ओंकारेश्वर ज्योतिर्लिंग के दर्शन कराती है। महाकालेश्वर (भस्म आरती के लिए प्रसिद्ध) और नर्मदा तट पर स्थित ओंकारेश्वर (ॐ के आकार का द्वीप) की यह यात्रा आध्यात्मिक शांति और मोक्ष की प्राप्ति के लिए अत्यंत महत्वपूर्ण मानी जाती है। इसके अतिरिक्त आप काल भैरव, हरसिद्धि माता और अन्य प्रमुख मंदिरों के दर्शन भी करेंगे।',
      en: 'This special 2-day spiritual journey takes you to two of the most revered Jyotirlingas of Lord Shiva - Shree Mahakaleshwar in Ujjain and Omkareshwar Jyotirlinga. Experience the divine aura of Mahakaleshwar (famous for its Bhasma Aarti) and Omkareshwar, uniquely situated on an Om-shaped island on the banks of the Narmada River. This sacred tour also includes visits to Kaal Bhairav, Harsiddhi Mata Temple, and other major historical shrines.'
    },
    itinerary: [
      {
        dayTitle: {
          hi: 'पहला दिन: उज्जैन दर्शन',
          en: 'Day 1: Ujjain Darshan'
        },
        content: {
          hi: 'उज्जैन आगमन, होटल चेक-इन। महाकालेश्वर ज्योतिर्लिंग, काल भैरव, हरसिद्धि मंदिर, और संदीपनि आश्रम के दर्शन। रात्रि विश्राम उज्जैन में।',
          en: 'Arrival in Ujjain, check-in to hotel. Visit Mahakaleshwar Jyotirlinga, Kaal Bhairav, Harsiddhi Temple, and Sandipani Ashram. Overnight stay in Ujjain.'
        }
      },
      {
        dayTitle: {
          hi: 'दूसरा दिन: ओंकारेश्वर प्रस्थान और दर्शन',
          en: 'Day 2: Departure to Omkareshwar & Darshan'
        },
        content: {
          hi: 'सुबह उज्जैन से ओंकारेश्वर के लिए प्रस्थान (लगभग 140 किमी)। ओंकारेश्वर ज्योतिर्लिंग दर्शन, ममलेश्वर दर्शन और नर्मदा नदी में स्नान/बोटिंग। शाम को इंदौर/उज्जैन वापसी।',
          en: 'Morning departure to Omkareshwar (approx 140km). Visit Omkareshwar Jyotirlinga, Mamleshwar and enjoy boating/holy dip in Narmada River. Evening return to Indore/Ujjain.'
        }
      }
    ]
  },
  {
    slug: 'ujjain-omkareshwar-maheshwar-mandu-4-days',
    title: {
      hi: 'उज्जैन-ओंकारेश्वर-महेश्वर-मांडू टूर पैकेज (4 दिन)',
      en: 'Ujjain-Omkareshwar-Maheshwar-Mandu Tour Package (4 Days)'
    },
    heroImage: '/images/mandirs/maheshwar.webp',
    description: {
      hi: 'मालवा निमाड़ के प्रमुख धार्मिक और ऐतिहासिक स्थलों की 4 दिवसीय विस्तृत यात्रा। इस पैकेज में आप महाकालेश्वर और ओंकारेश्वर ज्योतिर्लिंगों के दर्शन करेंगे। साथ ही, रानी अहिल्याबाई होल्कर की ऐतिहासिक नगरी महेश्वर (भव्य घाटों और महेश्वरी साड़ियों के लिए प्रसिद्ध) और मांडू के प्राचीन महलों (रानी रूपमती का महल, बाज बहादुर का महल और जामा मस्जिद) की वास्तुकला का अनुभव करेंगे। यह यात्रा अध्यात्म और इतिहास का एक अद्भुत संगम है।',
      en: 'A 4-day comprehensive journey covering the major religious and historical sites of the Malwa Nimar region. Experience the divine presence of two Jyotirlingas (Mahakaleshwar and Omkareshwar), along with the historical grandeur of Maheshwar (famous for Ahilya Ghats and Maheshwari sarees) and the ancient palaces of Mandu (including Rani Roopmati Pavilion, Baz Bahadur Palace, and Jama Masjid). This tour is a perfect blend of spirituality and rich history.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'पहला दिन: उज्जैन आगमन और दर्शन', en: 'Day 1: Arrival & Ujjain Darshan' },
        content: { 
          hi: 'सुबह उज्जैन पहुँचने पर हमारे प्रतिनिधि आपका स्वागत करेंगे। होटल में चेक-इन करने के बाद, उज्जैन के प्रमुख धार्मिक स्थलों के दर्शन के लिए निकलें।', 
          en: 'Upon morning arrival in Ujjain, our representative will welcome you. Check-in to the hotel and head out to explore the major spiritual landmarks of Ujjain.' 
        },
        list: [
          { hi: 'श्री महाकालेश्वर ज्योतिर्लिंग के दर्शन', en: 'Darshan at Shree Mahakaleshwar Jyotirlinga' },
          { hi: 'हरसिद्धि माता और काल भैरव मंदिर', en: 'Visit Harsiddhi Mata and Kaal Bhairav Temple' },
          { hi: 'राम घाट पर शिप्रा नदी आरती', en: 'Evening Shipra River Aarti at Ram Ghat' }
        ],
        note: { hi: 'रात्रि विश्राम उज्जैन में रहेगा।', en: 'Overnight stay will be in Ujjain.' }
      },
      {
        dayTitle: { hi: 'दूसरा दिन: ओंकारेश्वर ज्योतिर्लिंग दर्शन', en: 'Day 2: Omkareshwar Jyotirlinga Darshan' },
        content: { 
          hi: 'सुबह नाश्ते के बाद उज्जैन से ओंकारेश्वर के लिए प्रस्थान (लगभग 140 किमी)। ओंकारेश्वर नर्मदा नदी के तट पर स्थित है।', 
          en: 'After breakfast, depart for Omkareshwar (approx 140km), beautifully situated on the banks of the Narmada River.' 
        },
        list: [
          { hi: 'ओंकारेश्वर और ममलेश्वर ज्योतिर्लिंग के दर्शन', en: 'Darshan of Omkareshwar and Mamleshwar Jyotirlingas' },
          { hi: 'नर्मदा नदी में पवित्र स्नान और नौका विहार (बोटिंग)', en: 'Holy dip and boating in the Narmada River' }
        ],
        note: { hi: 'रात्रि विश्राम ओंकारेश्वर में रहेगा।', en: 'Overnight stay will be in Omkareshwar.' }
      },
      {
        dayTitle: { hi: 'तीसरा दिन: ऐतिहासिक महेश्वर', en: 'Day 3: Historical Maheshwar' },
        content: { 
          hi: 'सुबह महेश्वर के लिए प्रस्थान। महेश्वर अपनी भव्यता, अहिल्या घाट और महेश्वरी साड़ियों के लिए प्रसिद्ध है।', 
          en: 'Morning departure to Maheshwar. It is renowned for its grandeur, the Ahilya Ghat, and the exquisite Maheshwari sarees.' 
        },
        list: [
          { hi: 'अहिल्या बाई किला और राजवाड़ा का भ्रमण', en: 'Explore Ahilya Bai Fort and Rajwada' },
          { hi: 'नर्मदा घाट (अहिल्या घाट) पर समय व्यतीत करें', en: 'Spend peaceful time at Narmada Ghat (Ahilya Ghat)' },
          { hi: 'महेश्वरी साड़ियों की स्थानीय बाज़ार में खरीदारी', en: 'Shopping for Maheshwari sarees in the local market' }
        ],
        note: { hi: 'शाम को महेश्वर से मांडू के लिए प्रस्थान। रात्रि विश्राम मांडू में।', en: 'Evening departure to Mandu. Overnight stay in Mandu.' }
      },
      {
        dayTitle: { hi: 'चौथा दिन: मांडू दर्शन और प्रस्थान', en: 'Day 4: Mandu Exploration & Departure' },
        content: { 
          hi: 'मांडू (मांडवगढ़) अपनी खूबसूरत वास्तुकला और ऐतिहासिक प्रेम कहानियों के लिए जाना जाता है।', 
          en: 'Mandu (Mandavgarh) is known for its stunning architecture and historical love stories of Baz Bahadur and Rani Roopmati.' 
        },
        list: [
          { hi: 'जहाज महल और हिंडोला महल का भ्रमण', en: 'Visit Jahaz Mahal and Hindola Mahal' },
          { hi: 'रूपमती मंडप और बाज़ बहादुर पैलेस', en: 'Explore Roopmati Pavilion and Baz Bahadur Palace' },
          { hi: 'जामा मस्जिद और होशंग शाह का मकबरा', en: 'See Jama Masjid and Hoshang Shah\'s Tomb' }
        ],
        note: { hi: 'दोपहर बाद इंदौर/उज्जैन के लिए वापसी प्रस्थान।', en: 'Late afternoon return departure to Indore/Ujjain.' }
      }
    ]
  },
  {
    slug: 'panch-jyotirlinga-5-days',
    title: {
      hi: 'उज्जैन-त्र्यंबकेश्वर-पंच ज्योतिर्लिंग टूर पैकेज (5 दिन)',
      en: 'Ujjain-Trimbakeshwar-Panch Jyotirlinga Tour Package (5 Days)'
    },
    heroImage: '/images/mandirs/trimbakeshwar.webp',
    description: {
      hi: 'महाराष्ट्र और मध्य प्रदेश के 5 प्रमुख ज्योतिर्लिंगों की विशेष और पवित्र यात्रा। यह पैकेज आपको भगवान शिव के 5 सबसे शक्तिशाली और प्रतिष्ठित ज्योतिर्लिंगों - श्री महाकालेश्वर (उज्जैन), ओंकारेश्वर, घृष्णेश्वर (एलोरा), त्र्यंबकेश्वर (नासिक, गोदावरी का उद्गम) और भीमाशंकर ज्योतिर्लिंग के दर्शन का अवसर प्रदान करता है। यह 5 दिवसीय यात्रा आपको आत्मिक शांति और शिव कृपा की अनुभूति कराएगी।',
      en: 'A special and sacred journey covering 5 major Jyotirlingas across Maharashtra and Madhya Pradesh. This premium package offers the divine opportunity to visit the 5 most powerful and revered Jyotirlingas of Lord Shiva: Shree Mahakaleshwar (Ujjain), Omkareshwar, Grishneshwar (near Ellora), Trimbakeshwar (Nashik, origin of the Godavari river), and Bhimashankar Jyotirlinga. Experience immense spiritual peace and blessings on this 5-day divine pilgrimage.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'पहला दिन: उज्जैन - महाकालेश्वर', en: 'Day 1: Ujjain - Mahakaleshwar' },
        content: { hi: 'उज्जैन आगमन। विश्व प्रसिद्ध महाकालेश्वर ज्योतिर्लिंग (दक्षिणमुखी) के दर्शन और भस्म आरती में सम्मिलित होने का अवसर।', en: 'Arrival in Ujjain. Darshan of the world-famous Mahakaleshwar Jyotirlinga (South-facing) and opportunity to attend the Bhasma Aarti.' },
        list: [
          { hi: 'महाकालेश्वर ज्योतिर्लिंग दर्शन', en: 'Mahakaleshwar Jyotirlinga Darshan' },
          { hi: 'काल भैरव और हरसिद्धि माता मंदिर', en: 'Visit Kaal Bhairav and Harsiddhi Mata Temple' }
        ],
        note: { hi: 'रात्रि विश्राम उज्जैन।', en: 'Overnight stay in Ujjain.' }
      },
      {
        dayTitle: { hi: 'दूसरा दिन: ओंकारेश्वर ज्योतिर्लिंग', en: 'Day 2: Omkareshwar Jyotirlinga' },
        content: { hi: 'उज्जैन से ओंकारेश्वर की यात्रा। नर्मदा नदी के पवित्र द्वीप पर स्थित ज्योतिर्लिंग के दर्शन।', en: 'Travel from Ujjain to Omkareshwar. Darshan of the Jyotirlinga situated on the holy island of the Narmada River.' },
        list: [
          { hi: 'ओंकारेश्वर और ममलेश्वर दर्शन', en: 'Omkareshwar and Mamleshwar Darshan' },
          { hi: 'नर्मदा स्नान', en: 'Holy dip in Narmada' }
        ],
        note: { hi: 'रात्रि विश्राम जलगाँव या औरंगाबाद के लिए प्रस्थान।', en: 'Departure for overnight stay in Jalgaon or Aurangabad.' }
      },
      {
        dayTitle: { hi: 'तीसरा दिन: घृष्णेश्वर ज्योतिर्लिंग', en: 'Day 3: Grishneshwar Jyotirlinga' },
        content: { hi: 'एलोरा गुफाओं के पास स्थित घृष्णेश्वर ज्योतिर्लिंग के दर्शन। यह शिव पुराण में वर्णित 12 ज्योतिर्लिंगों में से एक है।', en: 'Darshan of Grishneshwar Jyotirlinga, located near the Ellora Caves. It is one of the 12 Jyotirlingas mentioned in the Shiva Purana.' },
        list: [
          { hi: 'घृष्णेश्वर मंदिर दर्शन', en: 'Grishneshwar Temple Darshan' },
          { hi: 'एलोरा की गुफाओं का भ्रमण (समय मिलने पर)', en: 'Visit to Ellora Caves (if time permits)' }
        ],
        note: { hi: 'रात्रि विश्राम नासिक की ओर।', en: 'Overnight stay heading towards Nashik.' }
      },
      {
        dayTitle: { hi: 'चौथा दिन: त्र्यंबकेश्वर ज्योतिर्लिंग', en: 'Day 4: Trimbakeshwar Jyotirlinga' },
        content: { hi: 'नासिक के पास स्थित त्र्यंबकेश्वर ज्योतिर्लिंग के दर्शन। यहाँ गोदावरी नदी का उद्गम स्थल भी है।', en: 'Darshan of Trimbakeshwar Jyotirlinga near Nashik. This is also the origin of the Godavari River.' },
        list: [
          { hi: 'त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन (ब्रह्मा, विष्णु, महेश के तीन मुख)', en: 'Trimbakeshwar Darshan (Three faces embodying Lord Brahma, Vishnu, and Shiva)' },
          { hi: 'कुशावर्त कुंड दर्शन', en: 'Visit Kushavart Kund' }
        ],
        note: { hi: 'रात्रि विश्राम नासिक।', en: 'Overnight stay in Nashik.' }
      },
      {
        dayTitle: { hi: 'पांचवा दिन: भीमाशंकर ज्योतिर्लिंग और प्रस्थान', en: 'Day 5: Bhimashankar Jyotirlinga & Departure' },
        content: { hi: 'सह्याद्रि पर्वत शृंखला में स्थित भीमाशंकर ज्योतिर्लिंग के दर्शन। यह ज्योतिर्लिंग प्रकृति की गोद में स्थित है।', en: 'Darshan of Bhimashankar Jyotirlinga, located in the Sahyadri mountains. This Jyotirlinga is nestled in the lap of nature.' },
        list: [
          { hi: 'भीमाशंकर ज्योतिर्लिंग दर्शन', en: 'Bhimashankar Jyotirlinga Darshan' },
          { hi: 'प्रकृति के नज़ारों का आनंद', en: 'Enjoying the scenic natural beauty' }
        ],
        note: { hi: 'दर्शन के पश्चात पुणे/मुंबई/इंदौर के लिए वापसी प्रस्थान।', en: 'Return departure to Pune/Mumbai/Indore after Darshan.' }
      }
    ]
  },
  {
    slug: 'ujjain-baglamukhi-2-days',
    title: {
      hi: 'उज्जैन और माँ बगलामुखी दर्शन पैकेज (2 दिन)',
      en: 'Ujjain and Maa Baglamukhi Darshan Package (2 Days)'
    },
    heroImage: '/images/mandirs/baglamukhi.jpg',
    description: {
      hi: 'उज्जैन के महाकालेश्वर ज्योतिर्लिंग के साथ-साथ नलखेड़ा स्थित विश्व प्रसिद्ध चमत्कारी शक्तिपीठ माँ बगलामुखी मंदिर के दर्शन का विशेष दो दिवसीय पैकेज। माँ बगलामुखी (दस महाविद्याओं में से एक) को शत्रुओं का नाश करने वाली और मुकदमों में विजय दिलाने वाली देवी माना जाता है। महाभारत काल से पूजित इस पवित्र मंदिर में दर्शन और अनुष्ठान से भक्तों की सभी मनोकामनाएं पूर्ण होती हैं।',
      en: 'A special 2-day package combining Mahakaleshwar darshan in Ujjain with a visit to the world-famous miraculous Shaktipeeth, Maa Baglamukhi Temple in Nalkheda. Maa Baglamukhi (one of the ten Mahavidyas) is revered as the goddess who destroys enemies and grants victory in legal battles and disputes. Worshipped since the Mahabharata era, a visit to this highly potent temple fulfills all the wishes of the devotees.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'पहला दिन: उज्जैन दर्शन और महाकाल पूजा', en: 'Day 1: Ujjain Darshan and Mahakal Puja' },
        content: { hi: 'उज्जैन आगमन पर होटल में चेक-इन करें। दिन भर उज्जैन के पवित्र मंदिरों के दर्शन करें।', en: 'Check-in to the hotel upon arrival in Ujjain. Spend the day visiting the holy temples of Ujjain.' },
        list: [
          { hi: 'श्री महाकालेश्वर ज्योतिर्लिंग के दर्शन', en: 'Darshan of Shree Mahakaleshwar Jyotirlinga' },
          { hi: 'काल भैरव, जहाँ मदिरा का भोग लगता है', en: 'Visit Kaal Bhairav, where liquor is offered as prasad' },
          { hi: 'हरसिद्धि माता मंदिर और राम घाट की आरती', en: 'Harsiddhi Mata Temple and Ram Ghat Aarti' }
        ],
        note: { hi: 'रात्रि विश्राम उज्जैन में।', en: 'Overnight stay in Ujjain.' }
      },
      {
        dayTitle: { hi: 'दूसरा दिन: माँ बगलामुखी (नलखेड़ा) दर्शन', en: 'Day 2: Maa Baglamukhi (Nalkheda) Darshan' },
        content: { hi: 'सुबह जल्दी नलखेड़ा के लिए प्रस्थान (उज्जैन से लगभग 100 किमी)। माँ बगलामुखी को तंत्र-मंत्र और शत्रुओं पर विजय की देवी माना जाता है।', en: 'Early morning departure to Nalkheda (approx 100km from Ujjain). Maa Baglamukhi is revered as the goddess of Tantra and victory over enemies.' },
        list: [
          { hi: 'माँ बगलामुखी मंदिर में विशेष दर्शन', en: 'Special Darshan at Maa Baglamukhi Temple' },
          { hi: 'विशेष अनुष्ठान, हवन या यज्ञ (यदि पूर्व निर्धारित हो)', en: 'Special rituals, Havan or Yagya (if pre-booked)' },
          { hi: 'आस-पास के अन्य प्राचीन मंदिरों के दर्शन', en: 'Visit to other ancient temples nearby' }
        ],
        note: { hi: 'दोपहर बाद नलखेड़ा से उज्जैन/इंदौर के लिए वापसी प्रस्थान।', en: 'Afternoon return departure from Nalkheda to Ujjain/Indore.' }
      }
    ]
  },
  {
    slug: 'ujjain-sightseeing-package',
    title: {
      hi: 'उज्जैन साइटसीइंग पैकेज — पूरे शहर का भ्रमण',
      en: 'Ujjain Sightseeing Package — Full City Tour'
    },
    heroImage: '/images/tours/ujjain-travel-package.webp',
    description: {
      hi: 'उज्जैन साइटसीइंग पैकेज में शहर के प्रमुख मंदिर, ऐतिहासिक व दर्शनीय स्थल एक ही दिन में आरामदायक AC कैब द्वारा कवर होते हैं। श्री महाकालेश्वर ज्योतिर्लिंग, काल भैरव, हरसिद्धि शक्तिपीठ, मंगलनाथ, संदीपनि आश्रम, राम घाट व वेध शाला (जंतर मंतर) — उज्जैन के सभी मुख्य आकर्षण अनुभवी चालक के साथ। फ़िक्स्ड पारदर्शी किराया, GST बिल, पिक-अप व ड्रॉप सहित। परिवार, दोस्तों या ग्रुप — सभी के लिए उपयुक्त उज्जैन साइटसीइंग टूर।',
      en: 'The Ujjain sightseeing package covers all major temples, historical and tourist spots of the city in a single day by comfortable AC cab. Shree Mahakaleshwar Jyotirlinga, Kaal Bhairav, Harsiddhi Shaktipeeth, Mangalnath, Sandipani Ashram, Ram Ghat and Vedh Shala (Jantar Mantar) — every key Ujjain attraction with an experienced driver. Fixed transparent fare, GST bill, pick-up and drop included. A perfect Ujjain sightseeing tour for families, friends or groups.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'सुबह: महाकाल दर्शन से शुरुआत', en: 'Morning: Start with Mahakal Darshan' },
        content: {
          hi: 'निर्धारित समय पर आपके होटल/स्टेशन से पिक-अप। सबसे पहले श्री महाकालेश्वर ज्योतिर्लिंग के दर्शन, फिर पास के प्रमुख स्थल।',
          en: 'Pick-up from your hotel/station at the scheduled time. Begin with darshan at Shree Mahakaleshwar Jyotirlinga, then the major nearby spots.'
        },
        list: [
          { hi: 'श्री महाकालेश्वर ज्योतिर्लिंग — 12 ज्योतिर्लिंगों में से एक', en: 'Shree Mahakaleshwar Jyotirlinga — one of the 12 Jyotirlingas' },
          { hi: 'महाकाल लोक कॉरिडोर — भव्य शिव गाथा', en: 'Mahakal Lok Corridor — grand Shiva narrative walk' },
          { hi: 'हरसिद्धि शक्तिपीठ — 51 शक्तिपीठों में से एक', en: 'Harsiddhi Shaktipeeth — one of the 51 Shaktipeeths' },
          { hi: 'काल भैरव मंदिर — उज्जैन के रक्षक देव', en: 'Kaal Bhairav Temple — guardian deity of Ujjain' }
        ]
      },
      {
        dayTitle: { hi: 'दोपहर: घाट, आश्रम व ऐतिहासिक स्थल', en: 'Afternoon: Ghats, Ashram & Historic Sites' },
        content: {
          hi: 'दोपहर में शिप्रा तट, ज्ञान-स्थली व खगोल विरासत का भ्रमण।',
          en: 'In the afternoon, explore the Shipra riverfront, seat of learning and astronomical heritage.'
        },
        list: [
          { hi: 'राम घाट — पवित्र शिप्रा नदी के तट पर', en: 'Ram Ghat — on the banks of the holy Shipra' },
          { hi: 'मंगलनाथ मंदिर — मंगल ग्रह की जन्मभूमि', en: 'Mangalnath Temple — birthplace of Mars (Mangal)' },
          { hi: 'संदीपनि आश्रम — भगवान कृष्ण की शिक्षा स्थली', en: 'Sandipani Ashram — where Lord Krishna studied' },
          { hi: 'वेध शाला (जंतर मंतर) — प्राचीन खगोलीय वेधशाला', en: 'Vedh Shala (Jantar Mantar) — ancient astronomical observatory' },
          { hi: 'चिंतामण गणेश व इस्कॉन मंदिर (समयानुसार)', en: 'Chintaman Ganesh & ISKCON Temple (as time permits)' }
        ],
        note: {
          hi: 'साइटसीइंग क्रम व स्थल संख्या समय व भीड़ अनुसार समायोजित की जा सकती है। बुकिंग: +91 74007 24456।',
          en: 'Sightseeing order and number of spots may be adjusted as per time and crowd. Booking: +91 74007 24456.'
        }
      }
    ]
  },
  {
    slug: 'ujjain-3-day-package',
    title: {
      hi: 'उज्जैन 3 दिवसीय टूर पैकेज — विस्तृत दर्शन यात्रा',
      en: 'Ujjain 3 Day Tour Package — Extended Darshan Trip'
    },
    heroImage: '/images/mandirs/char-dham-ujjain.jpg',
    description: {
      hi: 'उज्जैन 3 दिवसीय टूर पैकेज उन यात्रियों के लिए है जो शहर के मंदिरों के साथ-साथ आसपास के तीर्थ भी शांति से देखना चाहते हैं। दिन 1 — उज्जैन के प्रमुख मंदिर व महाकाल भस्म आरती (एडवांस बुकिंग अनुसार); दिन 2 — ओंकारेश्वर ज्योतिर्लिंग की यात्रा; दिन 3 — शेष स्थानीय दर्शन, बाजार व विश्राम। आरामदायक AC कैब, अनुभवी चालक, होटल व्यवस्था सहायता — सब एक ही जगह। बुकिंग: +91 74007 24456।',
      en: 'The Ujjain 3 day tour package is for travellers who want to cover the city temples plus nearby tirthas at a relaxed pace. Day 1 — major Ujjain temples and Mahakal Bhasma Aarti (as per advance booking); Day 2 — trip to Omkareshwar Jyotirlinga; Day 3 — remaining local darshan, markets and rest. Comfortable AC cab, experienced driver, hotel arrangement assistance — all in one place. Booking: +91 74007 24456.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'दिन 1: उज्जैन दर्शन', en: 'Day 1: Ujjain Darshan' },
        content: {
          hi: 'आगमन व होटल चेक-इन के बाद उज्जैन के प्रमुख मंदिरों के दर्शन।',
          en: 'After arrival and hotel check-in, darshan of the major temples of Ujjain.'
        },
        list: [
          { hi: 'श्री महाकालेश्वर ज्योतिर्लिंग व महाकाल लोक', en: 'Shree Mahakaleshwar Jyotirlinga & Mahakal Lok' },
          { hi: 'काल भैरव, हरसिद्धि शक्तिपीठ, मंगलनाथ', en: 'Kaal Bhairav, Harsiddhi Shaktipeeth, Mangalnath' },
          { hi: 'राम घाट संध्या आरती', en: 'Ram Ghat evening aarti' }
        ],
        note: {
          hi: 'नोट: महाकालेश्वर भस्म आरती की बुकिंग केवल मंदिर की आधिकारिक वेबसाइट पर एडवांस में होती है।',
          en: "Note: Mahakaleshwar Bhasma Aarti booking is done only in advance on the temple's official website."
        }
      },
      {
        dayTitle: { hi: 'दिन 2: ओंकारेश्वर ज्योतिर्लिंग', en: 'Day 2: Omkareshwar Jyotirlinga' },
        content: {
          hi: 'प्रातः कैब द्वारा ओंकारेश्वर प्रस्थान — नर्मदा तट पर स्थित ॐ आकार का पवित्र द्वीप। दर्शन के बाद उज्जैन वापसी।',
          en: 'Morning departure by cab to Omkareshwar — the sacred Om-shaped island on the Narmada. Return to Ujjain after darshan.'
        }
      },
      {
        dayTitle: { hi: 'दिन 3: स्थानीय दर्शन व विदाई', en: 'Day 3: Local Darshan & Departure' },
        content: {
          hi: 'शेष स्थानीय स्थल — संदीपनि आश्रम, चिंतामण गणेश, इस्कॉन, स्थानीय बाजार। समयानुसार स्टेशन/एयरपोर्ट ड्रॉप।',
          en: 'Remaining local spots — Sandipani Ashram, Chintaman Ganesh, ISKCON, local markets. Station/airport drop as per schedule.'
        }
      }
    ]
  },
  {
    slug: 'ujjain-budget-tour-package',
    title: {
      hi: 'उज्जैन बजट टूर पैकेज — किफ़ायती दर्शन यात्रा',
      en: 'Ujjain Budget Tour Package — Affordable Darshan Trip'
    },
    heroImage: '/images/tours/ujjain-travel-package.webp',
    description: {
      hi: 'उज्जैन बजट टूर पैकेज उन यात्रियों के लिए है जो कम खर्च में सम्पूर्ण दर्शन चाहते हैं। इसमें साझा या किफ़ायती कैब, मंदिर के निकट सादगीपूर्ण धर्मशाला/बजट होटल सुझाव, और उज्जैन के सभी प्रमुख मंदिरों के दर्शन शामिल हैं। कोई छिपा शुल्क नहीं — पारदर्शी किराया। परिवार व समूह हेतु उपयुक्त, किफ़ायती उज्जैन यात्रा। बुकिंग: +91 74007 24456।',
      en: 'The Ujjain budget tour package is for travellers who want complete darshan at a low cost. It includes a shared or economy cab, simple dharamshala/budget-hotel suggestions near the temple, and darshan of all major Ujjain temples. No hidden charges — transparent fare. An affordable Ujjain trip suited for families and groups. Booking: +91 74007 24456.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'किफ़ायती 1-दिन दर्शन', en: 'Economy 1-Day Darshan' },
        content: {
          hi: 'सुबह जल्दी शुरुआत — कम भीड़, कम खर्च। साझा/बजट कैब से सभी मुख्य दर्शन।',
          en: 'Early morning start — less crowd, less cost. All main darshan by shared/economy cab.'
        },
        list: [
          { hi: 'श्री महाकालेश्वर दर्शन (सामान्य लाइन)', en: 'Shree Mahakaleshwar darshan (general queue)' },
          { hi: 'काल भैरव, हरसिद्धि, मंगलनाथ', en: 'Kaal Bhairav, Harsiddhi, Mangalnath' },
          { hi: 'राम घाट व संदीपनि आश्रम', en: 'Ram Ghat and Sandipani Ashram' }
        ],
        note: {
          hi: 'बजट अनुमान: ₹1,500 – 2,500 प्रति व्यक्ति/दिन (धर्मशाला + साझा कैब + भोजन)। दरें मौसम अनुसार बदल सकती हैं।',
          en: 'Budget estimate: ₹1,500 – 2,500 per person/day (dharamshala + shared cab + meals). Rates may vary by season.'
        }
      }
    ]
  },
  {
    slug: 'ujjain-premium-tour-package',
    title: {
      hi: 'उज्जैन प्रीमियम टूर पैकेज — लक्ज़री दर्शन अनुभव',
      en: 'Ujjain Premium Tour Package — Luxury Darshan Experience'
    },
    heroImage: '/images/mandirs/mahakaleshwar.jpg',
    description: {
      hi: 'उज्जैन प्रीमियम टूर पैकेज एक आरामदायक, निजी व लक्ज़री दर्शन अनुभव प्रदान करता है। इसमें निजी AC SUV (इनोवा), मंदिर के निकट प्रीमियम होटल सुझाव, अनुभवी गाइड सहायता, व लचीला इटिनरेरी शामिल है। जोड़ों (couple), परिवार व VIP अतिथियों हेतु आदर्श — बिना भागदौड़ के शांत, गरिमामय यात्रा। बुकिंग: +91 74007 24456।',
      en: 'The Ujjain premium tour package offers a comfortable, private and luxury darshan experience. It includes a private AC SUV (Innova), premium-hotel suggestions near the temple, experienced guide assistance and a flexible itinerary. Ideal for couples, families and VIP guests — a calm, dignified trip without any rush. Booking: +91 74007 24456.'
    },
    itinerary: [
      {
        dayTitle: { hi: 'निजी लक्ज़री दर्शन', en: 'Private Luxury Darshan' },
        content: {
          hi: 'निजी SUV, लचीला समय, आरामदायक गति से सभी प्रमुख दर्शन व गाइड सहायता।',
          en: 'Private SUV, flexible timing, all major darshan at a comfortable pace with guide assistance.'
        },
        list: [
          { hi: 'श्री महाकालेश्वर व महाकाल लोक', en: 'Shree Mahakaleshwar & Mahakal Lok' },
          { hi: 'काल भैरव, हरसिद्धि शक्तिपीठ, मंगलनाथ', en: 'Kaal Bhairav, Harsiddhi Shaktipeeth, Mangalnath' },
          { hi: 'संदीपनि आश्रम, वेध शाला, राम घाट संध्या आरती', en: 'Sandipani Ashram, Vedh Shala, Ram Ghat evening aarti' }
        ],
        note: {
          hi: 'प्रीमियम अनुमान: ₹6,000+ प्रति व्यक्ति/दिन (लक्ज़री होटल + निजी SUV + गाइड)। पूर्णतः अनुकूलन योग्य।',
          en: 'Premium estimate: ₹6,000+ per person/day (luxury hotel + private SUV + guide). Fully customizable.'
        }
      }
    ]
  }
];

export const getPackageBySlug = (slug: string) => packagesData.find(p => p.slug === slug);
