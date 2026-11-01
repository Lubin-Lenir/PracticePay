export type LanguageCode = 'en-IN' | 'hi-IN';

export type ScreenName =
  | 'home'
  | 'chat'
  | 'amount'
  | 'pin'
  | 'buffering'
  | 'qr'
  | 'processing'
  | 'receipt'
  | 'history'
  | 'balance';

export type MissionId =
  | 'qr_tutorial'
  | 'pay_phone'
  | 'scan_qr'
  | 'pay_bill'
  | 'network_drop'
  | 'extra_zero'
  | 'collect_scam'
  | null;

export interface QrTutorialStepDef {
  stepNumber: number;
  targetHighlight: 'viewfinder' | 'pay_vs_receive' | 'scam_qr_btn' | 'valid_qr_btn';
  title: Record<LanguageCode, string>;
  sahayakNarration: Record<LanguageCode, string>;
  keyTakeaway: Record<LanguageCode, string>;
}

export const QR_TUTORIAL_STEPS: QrTutorialStepDef[] = [
  {
    stepNumber: 1,
    targetHighlight: 'viewfinder',
    title: {
      'en-IN': 'Step 1/4: The Camera Scanner Frame',
      'hi-IN': 'कदम 1/4: कैमरा स्कैनर फ्रेम',
    },
    sahayakNarration: {
      'en-IN':
        'Namaste! I am Sahayak. Look at the glowing camera frame above. When you visit a store, point this square at the shopkeeper’s QR standee. Remember rule #1: You ONLY use this camera scanner when YOU want to SEND money out!',
      'hi-IN':
        'नमस्ते! मैं सहायक हूँ। ऊपर चमक रहे चौकोर कैमरा फ्रेम को देखें। दुकान पर पेमेंट करते समय इसे दुकानदार के क्यूआर कोड पर रखें। नियम 1 याद रखें: कैमरा स्कैनर का इस्तेमाल हमेशा पैसे भेजने (Pay) के लिए होता है!',
    },
    keyTakeaway: {
      'en-IN': 'Camera Scanner = Outgoing Payment ONLY',
      'hi-IN': 'कैमरा स्कैनर = केवल पैसे भेजने (Pay) के लिए',
    },
  },
  {
    stepNumber: 2,
    targetHighlight: 'pay_vs_receive',
    title: {
      'en-IN': 'Step 2/4: "Pay" QR vs "Receive" QR',
      'hi-IN': 'कदम 2/4: "Pay" बनाम "Receive" क्यूआर में अंतर',
    },
    sahayakNarration: {
      'en-IN':
        'Look at the highlighted comparison card! To PAY a shop, you scan their QR code and enter your UPI PIN. To RECEIVE money from someone, you NEVER scan anything—you simply show them YOUR personal QR card and enter ZERO PIN!',
      'hi-IN':
        'हाइलाइट किए गए कार्ड को ध्यान से देखें! दुकानदार को पैसे देने (Pay) के लिए आप उनका क्यूआर स्कैन करके पिन डालते हैं। लेकिन पैसे लेने (Receive) के लिए आप कभी कुछ स्कैन नहीं करते—बस अपना खुद का क्यूआर दिखाते हैं और कोई पिन नहीं डालते!',
    },
    keyTakeaway: {
      'en-IN': 'Scan QR = Pay Money Out | Show My QR = Receive Money In (No PIN)',
      'hi-IN': 'स्कैन करें = पैसे जाएंगे | अपना क्यूआर दिखाएं = पैसे आएंगे (बिना पिन)',
    },
  },
  {
    stepNumber: 3,
    targetHighlight: 'scam_qr_btn',
    title: {
      'en-IN': 'Step 3/4: Spotting Fake "Receive" QR Traps',
      'hi-IN': 'कदम 3/4: नकली "पैसे पाने वाले" क्यूआर स्कैम की पहचान',
    },
    sahayakNarration: {
      'en-IN':
        'See the red button below? Scammers on WhatsApp send fake QR images claiming: "Scan this QR to receive ₹2,000 cashback or prize." That is a lie! Scanning any QR code opens a payment deduction screen. Never scan a QR to receive money.',
      'hi-IN':
        'नीचे लाल बटन को देखें! ठग व्हाट्सएप पर फोटो भेजकर कहते हैं—"₹2,000 कैशबैक या इनाम पाने के लिए यह क्यूआर स्कैन करें।" यह धोखा है! कोई भी क्यूआर स्कैन करने से पैसे कटते हैं, मिलते नहीं।',
    },
    keyTakeaway: {
      'en-IN': 'There is NO such thing as a "Scan to Receive Money" QR code!',
      'hi-IN': '"स्कैन करके पैसे पाएं" जैसा कोई क्यूआर कोड नहीं होता!',
    },
  },
  {
    stepNumber: 4,
    targetHighlight: 'valid_qr_btn',
    title: {
      'en-IN': 'Step 4/4: Scan Valid Shop QR & Verify Name',
      'hi-IN': 'कदम 4/4: असली दुकान का क्यूआर स्कैन करें',
    },
    sahayakNarration: {
      'en-IN':
        'Now you know the difference! Tap the glowing green "Scan Valid Shop QR (Chandan Kirana)" button below to scan a real merchant QR, verify the banking name shield, and complete a safe ₹180 payment.',
      'hi-IN':
        'अब आप अंतर समझ गए हैं! नीचे चमक रहे हरे बटन "असली दुकान का क्यूआर स्कैन करें (चंदन किराना)" को दबाएं, दुकानदार का बैंक नाम जांचें और ₹180 का सुरक्षित अभ्यास पेमेंट करें।',
    },
    keyTakeaway: {
      'en-IN': 'Tap the highlighted green button below to test a valid Shop QR!',
      'hi-IN': 'अभ्यास पूरा करने के लिए नीचे चमक रहा हरा बटन दबाएं!',
    },
  },
];

export interface PracticeMissionDef {
  id: Exclude<MissionId, null>;
  badge: Record<LanguageCode, string>;
  title: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  steps: Record<LanguageCode, string[]>;
  safetyTip: Record<LanguageCode, string>;
}

export const PRACTICE_MISSIONS: PracticeMissionDef[] = [
  {
    id: 'qr_tutorial',
    badge: {
      'en-IN': 'Interactive Tutorial • Sahayak Narrated',
      'hi-IN': 'इंटरैक्टिव ट्यूटोरियल • सहायक की आवाज़ में',
    },
    title: {
      'en-IN': 'Scan QR Tutorial: "Pay" vs "Receive" QR',
      'hi-IN': 'क्यूआर (QR) ट्यूटोरियल: "Pay" और "Receive" में अंतर',
    },
    subtitle: {
      'en-IN': 'Step-by-step UI tour narrated by Sahayak explaining Pay vs Receive QR codes.',
      'hi-IN': 'सहायक कोच की आवाज़ में क्यूआर स्कैनर के हर हिस्से और Pay बनाम Receive को समझें।',
    },
    steps: {
      'en-IN': [
        'Step 1 (Camera Frame): Sahayak highlights the scanner viewfinder and explains why scanning is only for outgoing payments.',
        'Step 2 (Pay vs Receive QR): Compare scanning a Shop "Pay" QR against showing your own "Receive" QR card (which needs zero PIN).',
        'Step 3 (Fake QR Scam Alert): Sahayak highlights how scammers disguise payment QRs as "Scan to Receive ₹2,000" traps.',
        'Step 4 (Try Valid Shop QR): Tap the highlighted green button to scan Chandan Kirana’s QR and verify their banking name.',
      ],
      'hi-IN': [
        'कदम 1 (कैमरा फ्रेम): सहायक कोच स्कैनर फ्रेम को हाइलाइट करके बताता है कि स्कैनर केवल पैसे भेजने के लिए होता है।',
        'कदम 2 (Pay बनाम Receive क्यूआर): दुकान का क्यूआर स्कैन करने और पैसे पाने के लिए अपना खुद का क्यूआर दिखाने का अंतर समझें।',
        'कदम 3 (नकली क्यूआर जाल): जानें कि ठग कैसे "स्कैन करके ₹2,000 पाएं" का झांसा देकर पैसे काट लेते हैं।',
        'कदम 4 (असली क्यूआर स्कैन): हरा बटन दबाकर चंदन किराना का असली क्यूआर स्कैन करें और बैंक नाम जांचें।',
      ],
    },
    safetyTip: {
      'en-IN': 'To PAY money: Scan their QR + Enter PIN. To RECEIVE money: Just show your own QR card + NEVER enter a PIN!',
      'hi-IN': 'पैसे देने (Pay) के लिए: उनका क्यूआर स्कैन करें। पैसे लेने (Receive) के लिए: बस अपना क्यूआर दिखाएं और कभी पिन न डालें!',
    },
  },
  {
    id: 'pay_phone',
    badge: {
      'en-IN': 'Mission 1 • Phone Payment',
      'hi-IN': 'मिशन 1 • फोन नंबर पेमेंट',
    },
    title: {
      'en-IN': 'How to Pay a Phone Number',
      'hi-IN': 'फोन नंबर पर पैसे कैसे भेजें',
    },
    subtitle: {
      'en-IN': 'Enter a 10-digit mobile number, verify the banking name & pay safely.',
      'hi-IN': '10-अंकों का मोबाइल नंबर डालें, बैंक का नाम जांचें और सुरक्षित पेमेंट करें।',
    },
    steps: {
      'en-IN': [
        'Tap "Pay phone number" on the Home screen and enter a 10-digit mobile number (e.g., 9820144120).',
        'Verify the green "✔ Banking Name: RAMESH & CHANDAN KIRANA STORE" shield to confirm the right recipient.',
        'Enter the amount (₹250), add an optional note, and tap the blue "Proceed to Pay" button.',
        'On the dark-blue NPCI Bank screen, check the amount at the top, enter your 4-digit UPI PIN, and tap SUBMIT.',
      ],
      'hi-IN': [
        'होम स्क्रीन पर "फोन नंबर पर भेजें" दबाएं और 10-अंकों का मोबाइल नंबर (जैसे 9820144120) लिखें।',
        'सही व्यक्ति की पुष्टि के लिए हरा "✔ बैंक में दर्ज नाम: RAMESH & CHANDAN KIRANA STORE" ज़रूर पढ़ें।',
        'रकम (₹250) भरें, नोट लिखें और नीला "आगे बढ़ें (Proceed to Pay)" बटन दबाएं।',
        'नीली एनपीसीआई (NPCI) बैंक स्क्रीन पर ऊपर रकम जांचें, 4-अंकों का यूपीआई पिन डालें और SUBMIT दबाएं।',
      ],
    },
    safetyTip: {
      'en-IN': 'Always match the Verified Banking Name before entering your PIN—even if a phone number is 1 digit off, the banking name will reveal it.',
      'hi-IN': 'पिन डालने से पहले हमेशा "बैंक में दर्ज नाम" (Banking Name) पढ़कर मिलान करें—इससे गलत नंबर पर पैसे कभी नहीं जाएंगे।',
    },
  },
  {
    id: 'scan_qr',
    badge: {
      'en-IN': 'Mission 2 • QR Scanner',
      'hi-IN': 'मिशन 2 • क्यूआर स्कैन',
    },
    title: {
      'en-IN': 'How to Scan a QR Code',
      'hi-IN': 'दुकान का क्यूआर कोड (QR) कैसे स्कैन करें',
    },
    subtitle: {
      'en-IN': 'Scan a shop QR code, verify the merchant name, and spot fake QR scams.',
      'hi-IN': 'दुकान का क्यूआर कोड स्कैन करें, दुकानदार का नाम जांचें और नकली क्यूआर से बचें।',
    },
    steps: {
      'en-IN': [
        'Tap "Scan any QR code" on the Home screen to open the camera viewfinder.',
        'Point the camera frame at the shop QR and tap "Scan Valid Shop QR (Chandan Kirana)".',
        'Check the verified merchant name ("✔ RAMESH & CHANDAN KIRANA STORE"), enter ₹180, and tap "Proceed to Pay".',
        'Confirm the shop name & ₹180 on the NPCI PIN screen, enter your 4-digit UPI PIN, and tap SUBMIT.',
      ],
      'hi-IN': [
        'कैमरा स्कैनर खोलने के लिए होम स्क्रीन पर "कोई भी क्यूआर स्कैन करें" बटन दबाएं।',
        'कैमरा फ्रेम के नीचे "असली दुकान का क्यूआर स्कैन करें (चंदन किराना)" बटन दबाएं।',
        'हरे रंग में दुकानदार का असली बैंक नाम ("✔ RAMESH & CHANDAN KIRANA STORE") जांचें, ₹180 लिखें और "आगे बढ़ें" दबाएं।',
        'पिन स्क्रीन पर ऊपर ₹180 की जांच करें, अपना 4-अंकों का यूपीआई पिन डालें और SUBMIT दबाएं।',
      ],
    },
    safetyTip: {
      'en-IN': 'Golden Rule: You ONLY scan a QR code to SEND money, never to receive cashback, lottery prizes, or refunds.',
      'hi-IN': 'सुनहरा नियम: क्यूआर कोड (QR Code) केवल पैसे देने के लिए स्कैन किया जाता है—इनाम या पैसे पाने के लिए कभी नहीं!',
    },
  },
  {
    id: 'pay_bill',
    badge: {
      'en-IN': 'Mission 3 • Bill Payment',
      'hi-IN': 'मिशन 3 • बिल पेमेंट',
    },
    title: {
      'en-IN': 'How to Pay a Bill (Electricity / Utility)',
      'hi-IN': 'बिजली या घर का बिल कैसे भरें',
    },
    subtitle: {
      'en-IN': 'Select an official utility biller, review the bill amount, and get a UTR receipt.',
      'hi-IN': 'बिजली बोर्ड चुनें, बिल की रकम (₹640) जांचें और पक्की डिजिटल रसीद पाएं।',
    },
    steps: {
      'en-IN': [
        'Tap "Pay bills" in the top grid or "Electricity" under Bills & Recharges on the Home screen.',
        'Check the official biller shield ("✔ STATE ELECTRICITY BOARD LTD") and review the ₹640 bill amount.',
        'Tap the blue "Proceed to Pay" button to open the NPCI Bank PIN screen.',
        'Enter your 4-digit UPI PIN and tap SUBMIT—then check your 12-digit UTR reference number on the receipt.',
      ],
      'hi-IN': [
        'होम स्क्रीन पर "बिल भरें" या बिल सेक्शन में "बिजली बिल" आइकन पर टैप करें।',
        'सरकारी बिलर का नाम ("✔ STATE ELECTRICITY BOARD LTD") और ₹640 के बिल की रकम चेक करें।',
        'बैंक पिन स्क्रीन खोलने के लिए नीला "आगे बढ़ें (Proceed to Pay)" बटन दबाएं।',
        '4-अंकों का यूपीआई पिन डालकर SUBMIT दबाएं और रसीद पर अपना 12-अंकों का UTR नंबर देखें।',
      ],
    },
    safetyTip: {
      'en-IN': 'Always pay bills through the official in-app Bills & Recharges icon—never call unknown phone numbers sent via SMS claiming power disconnection.',
      'hi-IN': 'बिजली कटने के नकली SMS में लिखे नंबरों पर कभी कॉल न करें—हमेशा ऐप के अंदर "बिल और रिचार्ज" सेक्शन से ही बिल भरें।',
    },
  },
  {
    id: 'network_drop',
    badge: {
      'en-IN': 'Mission 4 • Stuck in Processing',
      'hi-IN': 'मिशन 4 • पेंडिंग पेमेंट बचाव',
    },
    title: {
      'en-IN': 'The "Stuck in Processing" Network Drop',
      'hi-IN': 'जब पेमेंट "Processing / Pending" में अटक जाए',
    },
    subtitle: {
      'en-IN': 'Learn what to do when a payment freezes on Pending so you never pay twice.',
      'hi-IN': 'जब नेटवर्क धीमा होने पर पेमेंट Pending में अटक जाए, तो दो बार पैसे कटने से कैसे बचें।',
    },
    steps: {
      'en-IN': [
        'Start the ₹640 Electricity Bill payment and tap "Proceed to Pay".',
        'Enter your 4-digit UPI PIN and tap SUBMIT—after buffering, the screen will get stuck on "Payment Processing / Pending" for 6 seconds.',
        'Look at the tempting "Send ₹640 Again" button—tap it to see why paying a second time is dangerous, or wait patiently.',
        'Let the 6-second bank timer complete to see your payment settle automatically without double deduction!',
      ],
      'hi-IN': [
        '₹640 के बिजली बिल पेमेंट पर "आगे बढ़ें (Proceed to Pay)" दबाएं।',
        '4-अंकों का यूपीआई पिन डालकर SUBMIT करें—कनेक्ट होने के बाद स्क्रीन 6 सेकंड के लिए "Payment Processing / Pending" पर अटक जाएगी।',
        'वहाँ दिख रहे "दोबारा ₹640 भेजें" बटन को दबाकर देखें कि तुरंत दोबारा पेमेंट क्यों नहीं करना चाहिए।',
        '6 सेकंड का बैंक टाइमर पूरा होने दें—आपका पेमेंट बिना दो बार पैसे कटे अपने आप सफल हो जाएगा!',
      ],
    },
    safetyTip: {
      'en-IN': 'Never send money a second time while a UPI payment says "Pending." Wait for the bank to confirm or auto-refund it first.',
      'hi-IN': 'जब भी पेमेंट "Pending" (पेंडिंग) दिखे, घबराकर तुरंत दोबारा पैसे न भेजें। पहले बैंक से पक्का स्टेटस आने का इंतजार करें।',
    },
  },
  {
    id: 'extra_zero',
    badge: {
      'en-IN': 'Mission 5 • Wrong Amount Recovery',
      'hi-IN': 'मिशन 5 • गलत रकम से बचाव',
    },
    title: {
      'en-IN': 'The "Extra Zero" Mistake (₹5,000 vs ₹500)',
      'hi-IN': 'गलती से एक जीरो ज्यादा (₹5,000) टाइप होना',
    },
    subtitle: {
      'en-IN': 'Catch a ₹5,000 typo on the PIN screen for ₹0 loss, or raise a refund dispute.',
      'hi-IN': 'पिन स्क्रीन पर ₹5,000 की गलती पकड़कर ₹0 नुकसान करें, या रसीद से ₹4,500 रिफंड पाएं।',
    },
    steps: {
      'en-IN': [
        'Open Chandan Kirana and tap the orange "Simulate Slip: Type ₹5,000 instead of ₹500" button.',
        'Tap "Proceed to Pay" to open the dark-blue NPCI UPI PIN screen.',
        'Recovery A (Before PIN): Check the top bar showing ₹5,000 and tap CANCEL right now to lose ₹0.',
        'Recovery B (After PIN): Or enter your 4-digit PIN & SUBMIT, then tap "Raise Dispute / Request ₹4,500 Refund" on the receipt!',
      ],
      'hi-IN': [
        'चंदन किराना खोलें और नारंगी बटन "गलती का अभ्यास: ₹500 की जगह ₹5,000 टाइप करें" दबाएं।',
        'नीला "आगे बढ़ें (Proceed to Pay)" बटन दबाकर पिन स्क्रीन पर जाएं।',
        'बचाव A (पिन से पहले): ऊपर पट्टी में ₹5,000 देखकर तुरंत CANCEL दबाएं—आपका ₹0 कटेगा।',
        'बचाव B (पिन के बाद): या पिन डालकर सबमिट करें, और रसीद पर "डिस्प्यूट दर्ज करें / ₹4,500 रिफंड लें" दबाकर पैसे वापस पाएं!',
      ],
    },
    safetyTip: {
      'en-IN': 'Pressing CANCEL on the UPI PIN screen always deducts ₹0. Always read the amount on the dark-blue top bar before typing your last PIN digit.',
      'hi-IN': 'यूपीआई पिन स्क्रीन पर CANCEL दबाने से ₹0 कटता है। आखिरी पिन अंक दबाने से पहले ऊपर लिखी रकम ज़रूर पढ़ें।',
    },
  },
  {
    id: 'collect_scam',
    badge: {
      'en-IN': 'Mission 6 • Fraud Prevention',
      'hi-IN': 'मिशन 6 • धोखाधड़ी से बचाव',
    },
    title: {
      'en-IN': 'The Fake "Collect Request" Scam',
      'hi-IN': 'नकली "Collect Request" स्कैम से बचाव',
    },
    subtitle: {
      'en-IN': 'Vikram claims he sent ₹2,000—learn why you NEVER enter a PIN to receive money.',
      'hi-IN': 'विक्रम कहता है उसने ₹2,000 भेजे हैं—जानें पैसे लेने के लिए पिन क्यों नहीं डालते।',
    },
    steps: {
      'en-IN': [
        'Open Vikram’s chat where a fake incoming card says: "Vikram sent ₹2,000! Tap Pay to receive money."',
        'Notice the red scam warning: receiving money into your bank NEVER requires tapping Pay or entering a PIN.',
        'Option A: Tap "Block / Decline Scam" to reject the request safely.',
        'Option B: Or tap "Pay ₹2,000" and enter your 4-digit PIN to see the Safe Failure Shield catch the scam!',
      ],
      'hi-IN': [
        'विक्रम की चैट खोलें जहाँ नकली मैसेज लिखा है: "विक्रम ने ₹2,000 भेजे हैं! पैसे पाने के लिए Pay दबाएं।"',
        'लाल चेतावनी देखें: अपने बैंक में पैसे लेने (प्राप्त करने) के लिए कभी भी Pay या यूपीआई पिन नहीं डालना पड़ता।',
        'विकल्प A: सुरक्षित रहने के लिए "स्कैम ब्लॉक / खारिज करें" बटन दबाएं।',
        'विकल्प B: या "Pay ₹2,000" दबाकर पिन डालें और देखें कि सुरक्षा कवच (Safe Failure Shield) आपके पैसे कैसे बचाता है!',
      ],
    },
    safetyTip: {
      'en-IN': 'Golden Rule: Entering your UPI PIN ONLY deducts money from your bank account. Never enter your PIN to receive money.',
      'hi-IN': 'सुनहरा नियम: यूपीआई पिन (UPI PIN) डालने से हमेशा आपके खाते से पैसे कटते हैं। पैसे पाने के लिए कभी पिन न डालें।',
    },
  },
];

export interface ChatBubble {
  id: string;
  amount: number;
  type: 'sent' | 'received' | 'request_incoming';
  note: string;
  timestamp: string;
  status: 'success' | 'disputed' | 'refunded' | 'scam_blocked';
  isScamRequest?: boolean;
}

export interface Contact {
  id: string;
  name: Record<LanguageCode, string>;
  bankingName: string;
  upiId: string;
  phone: string;
  role: Record<LanguageCode, string>;
  avatarBg: string;
  avatarText?: string;
  avatarUrl?: string;
  initials: string;
  category: 'person' | 'business';
  isMerchant?: boolean;
  isBiller?: boolean;
  isSuspicious?: boolean;
  history: ChatBubble[];
}

export interface TransactionRecord {
  id: string;
  contactId: string;
  contactName: Record<LanguageCode, string>;
  bankingName: string;
  upiId: string;
  amount: number;
  note: string;
  timestamp: string;
  status: 'success' | 'refunded';
  refundedAmount?: number;
  utr: string;
}

export interface ScamSample {
  id: string;
  title: Record<LanguageCode, string>;
  sender: string;
  channel: 'SMS' | 'WhatsApp' | 'UPI Collect';
  messageText: string;
  verdict: 'DANGER_SCAM' | 'SAFE';
  verdictLabel: Record<LanguageCode, string>;
  explanation: Record<LanguageCode, string>;
  redFlags: Record<LanguageCode, string[]>;
}

export const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  nativeName: string;
  voiceLang: string;
}[] = [
  {
    code: 'en-IN',
    label: 'English',
    shortLabel: 'EN',
    nativeName: 'English',
    voiceLang: 'en-IN',
  },
  {
    code: 'hi-IN',
    label: 'हिन्दी',
    shortLabel: 'हिं',
    nativeName: 'Hindi',
    voiceLang: 'hi-IN',
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  // --- PEOPLE ROW (Matches screenshot: Dipa, Kinjan, Sweta, Bapi Das, Chotu + Ramesh & Vikram) ---
  {
    id: 'dipa',
    name: {
      'en-IN': 'Dipa',
      'hi-IN': 'दीपा',
    },
    bankingName: 'DIPA CHATTERJEE',
    upiId: 'dipa.c@okaxis',
    phone: '+91 98301 11204',
    role: {
      'en-IN': 'Friend',
      'hi-IN': 'दोस्त',
    },
    avatarBg: 'bg-amber-700',
    avatarText: 'text-white',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Dipa&backgroundColor=f59e0b',
    initials: 'D',
    category: 'person',
    history: [
      {
        id: 'tx-d1',
        amount: 250,
        type: 'sent',
        note: 'Evening tea & snacks',
        timestamp: '2 days ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'kinjan',
    name: {
      'en-IN': 'Kinjan',
      'hi-IN': 'किंजन',
    },
    bankingName: 'KINJAN PATEL',
    upiId: 'kinjan@okicici',
    phone: '+91 98204 55190',
    role: {
      'en-IN': 'Colleague',
      'hi-IN': 'सहकर्मी',
    },
    avatarBg: 'bg-[#fde293]',
    avatarText: 'text-slate-800',
    initials: 'K',
    category: 'person',
    history: [
      {
        id: 'tx-k1',
        amount: 400,
        type: 'received',
        note: 'Lunch split',
        timestamp: '4 days ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'sweta',
    name: {
      'en-IN': 'Sweta',
      'hi-IN': 'श्वेता',
    },
    bankingName: 'SWETA SHARMA',
    upiId: 'sweta.sharma@oksbi',
    phone: '+91 98114 77890',
    role: {
      'en-IN': 'Family',
      'hi-IN': 'परिवार',
    },
    avatarBg: 'bg-teal-700',
    avatarText: 'text-white',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Sweta&backgroundColor=b6e3f4',
    initials: 'S',
    category: 'person',
    history: [
      {
        id: 'tx-201',
        amount: 1000,
        type: 'received',
        note: 'Home groceries',
        timestamp: '5 days ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'bapi',
    name: {
      'en-IN': 'Bapi Das',
      'hi-IN': 'बापी दास',
    },
    bankingName: 'BAPI KUMAR DAS',
    upiId: 'bapidas@okhdfcbank',
    phone: '+91 98312 88310',
    role: {
      'en-IN': 'Neighbor',
      'hi-IN': 'पड़ोसी',
    },
    avatarBg: 'bg-[#a8dab5]',
    avatarText: 'text-slate-800',
    initials: 'B',
    category: 'person',
    history: [
      {
        id: 'tx-b1',
        amount: 150,
        type: 'sent',
        note: 'Cab share',
        timestamp: 'Last week',
        status: 'success',
      },
    ],
  },
  {
    id: 'vikram',
    name: {
      'en-IN': 'Vikram',
      'hi-IN': 'विक्रम',
    },
    bankingName: 'UNKNOWN COLLECT MERCHANT',
    upiId: 'vikram.cashback99@ybl',
    phone: '+91 70441 00912',
    role: {
      'en-IN': 'Marketplace Buyer',
      'hi-IN': 'मार्केटप्लेस कॉलर',
    },
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-800',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram&backgroundColor=ffd5dc',
    initials: 'V',
    category: 'person',
    isSuspicious: true,
    history: [
      {
        id: 'tx-401',
        amount: 2000,
        type: 'request_incoming',
        note: 'Vikram sent ₹2,000! Tap Pay/Accept to receive money in your bank.',
        timestamp: 'Just now',
        status: 'success',
        isScamRequest: true,
      },
    ],
  },

  // --- BUSINESSES ROW (Matches screenshot: Airtel, Chandan.., Ramesh Kirana, Swiggy, Electricity) ---
  {
    id: 'airtel',
    name: {
      'en-IN': 'Airtel..',
      'hi-IN': 'एयरटेल',
    },
    bankingName: 'BHARTI AIRTEL LIMITED',
    upiId: 'airtel.prepaid@axis',
    phone: '121 (Prepaid)',
    role: {
      'en-IN': 'Mobile Recharge',
      'hi-IN': 'मोबाइल रिचार्ज',
    },
    avatarBg: 'bg-[#e40000]',
    avatarText: 'text-white',
    initials: 'airtel',
    category: 'business',
    isMerchant: true,
    history: [
      {
        id: 'tx-a1',
        amount: 299,
        type: 'sent',
        note: '28 Days Unlimited Pack',
        timestamp: '2 weeks ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'ramesh',
    name: {
      'en-IN': 'Chandan..',
      'hi-IN': 'चंदन किराना',
    },
    bankingName: 'RAMESH & CHANDAN KIRANA STORE',
    upiId: 'rameshkirana@okaxis',
    phone: '+91 98201 44120',
    role: {
      'en-IN': 'Neighborhood Grocery Store',
      'hi-IN': 'पड़ोस की किराना दुकान',
    },
    avatarBg: 'bg-[#a8dab5]',
    avatarText: 'text-slate-900',
    initials: 'C',
    category: 'business',
    isMerchant: true,
    history: [
      {
        id: 'tx-101',
        amount: 120,
        type: 'sent',
        note: 'Milk & Bread / दूध और ब्रेड',
        timestamp: 'Yesterday, 8:15 AM',
        status: 'success',
      },
      {
        id: 'tx-102',
        amount: 350,
        type: 'sent',
        note: 'Atta 5kg & Sugar',
        timestamp: '3 days ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'soumitra',
    name: {
      'en-IN': 'Soumitra..',
      'hi-IN': 'सौमित्र मेडिकल',
    },
    bankingName: 'SOUMITRA PHARMACY & STORES',
    upiId: 'soumitramed@okhdfc',
    phone: '+91 98309 22100',
    role: {
      'en-IN': 'Medical Store',
      'hi-IN': 'दवा की दुकान',
    },
    avatarBg: 'bg-slate-700',
    avatarText: 'text-white',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Soumitra&backgroundColor=c0aede',
    initials: 'SM',
    category: 'business',
    isMerchant: true,
    history: [
      {
        id: 'tx-sm1',
        amount: 185,
        type: 'sent',
        note: 'Vitamins',
        timestamp: 'Last week',
        status: 'success',
      },
    ],
  },
  {
    id: 'swiggy',
    name: {
      'en-IN': 'Swiggy',
      'hi-IN': 'स्विगी',
    },
    bankingName: 'BUNDL TECHNOLOGIES PVT LTD',
    upiId: 'swiggy@icici',
    phone: 'Food Delivery',
    role: {
      'en-IN': 'Food & Instamart',
      'hi-IN': 'फूड डिलीवरी',
    },
    avatarBg: 'bg-[#fc8019]',
    avatarText: 'text-white',
    initials: 'S',
    category: 'business',
    isMerchant: true,
    history: [
      {
        id: 'tx-sw1',
        amount: 340,
        type: 'sent',
        note: 'Dinner Order',
        timestamp: '6 days ago',
        status: 'success',
      },
    ],
  },
  {
    id: 'electricity',
    name: {
      'en-IN': 'Electricity',
      'hi-IN': 'बिजली बोर्ड',
    },
    bankingName: 'STATE ELECTRICITY DISCOM LTD',
    upiId: 'ebill.official@sbi',
    phone: '1912 (Utility Biller)',
    role: {
      'en-IN': 'Monthly Utility Bill • ₹640 Due',
      'hi-IN': 'मासिक बिजली बिल • ₹640 बाकी',
    },
    avatarBg: 'bg-[#d93025]',
    avatarText: 'text-white',
    initials: 'EB',
    category: 'business',
    isBiller: true,
    history: [
      {
        id: 'tx-301',
        amount: 590,
        type: 'sent',
        note: 'Last Month Bill #88412',
        timestamp: 'Last Month',
        status: 'success',
      },
    ],
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    contactId: 'ramesh',
    contactName: {
      'en-IN': 'Chandan / Ramesh Kirana',
      'hi-IN': 'चंदन / रमेश किराना स्टोर',
    },
    bankingName: 'RAMESH & CHANDAN KIRANA STORE',
    upiId: 'rameshkirana@okaxis',
    amount: 120,
    note: 'Milk & Bread',
    timestamp: 'Yesterday, 8:15 AM',
    status: 'success',
    utr: '430918227510',
  },
  {
    id: 'tx-301',
    contactId: 'electricity',
    contactName: {
      'en-IN': 'Electricity Board',
      'hi-IN': 'बिजली बोर्ड बिल',
    },
    bankingName: 'STATE ELECTRICITY DISCOM LTD',
    upiId: 'ebill.official@sbi',
    amount: 590,
    note: 'Electricity Bill',
    timestamp: 'Last Month',
    status: 'success',
    utr: '428810943118',
  },
];

export const SCAM_SAMPLES: ScamSample[] = [
  {
    id: 'kyc_sms',
    title: {
      'en-IN': 'Fake Electricity / Bank KYC Block SMS',
      'hi-IN': 'नकली बिजली / बैंक केवाईसी (KYC) ब्लॉक मैसेज',
    },
    sender: 'VM-SBINOT (+91 8890123456)',
    channel: 'SMS',
    messageText:
      'URGENT: Dear Customer, your Bank Account & Electricity power will be disconnected tonight at 9:30 PM because KYC is pending. Immediately call Officer Sharma at 8890123456 or click http://bit.ly/kyc-fast-update to enter UPI PIN.',
    verdict: 'DANGER_SCAM',
    verdictLabel: {
      'en-IN': '100% SCAM — Do Not Call or Click!',
      'hi-IN': '100% धोखाधड़ी (स्कैम) — कॉल या क्लिक न करें!',
    },
    explanation: {
      'en-IN':
        'Real banks and electricity boards never cut power at night via personal mobile numbers or short links. They are trying to scare you into sharing your UPI PIN or installing a screen-sharing app.',
      'hi-IN':
        'असली बैंक या बिजली बोर्ड कभी भी रात में लाइन काटने की धमकी किसी निजी मोबाइल नंबर से नहीं देते। यह आपको डराकर आपका यूपीआई पिन (UPI PIN) पूछने का जाल है।',
    },
    redFlags: {
      'en-IN': [
        'Creates fake tonight 9:30 PM panic deadline',
        'Uses a personal 10-digit mobile number for "Officer"',
        'Asks you to click a suspicious bit.ly link or enter UPI PIN',
      ],
      'hi-IN': [
        'रात 9:30 बजे कनेक्शन काटने का झूठा डर दिखाया गया है',
        'अधिकारी के नाम पर निजी 10-अंकों का मोबाइल नंबर दिया है',
        'अनजान लिंक पर क्लिक करने और यूपीआई पिन डालने को कहा है',
      ],
    },
  },
  {
    id: 'collect_whatsapp',
    title: {
      'en-IN': 'Fake "Enter PIN to Receive ₹2,000" Request',
      'hi-IN': 'नकली "₹2,000 पाने के लिए पिन डालें" मैसेज',
    },
    sender: 'Vikram (OLX / Marketplace Buyer)',
    channel: 'WhatsApp',
    messageText:
      'Bhaiya, I have sent ₹2,000 advance for the sofa on Google Pay. Just tap the "Pay ₹2,000" notification on your screen and enter your 4-digit UPI PIN so the money comes into your bank account immediately!',
    verdict: 'DANGER_SCAM',
    verdictLabel: {
      'en-IN': 'DANGER — Collect Request Trap!',
      'hi-IN': 'खतरा — यह पैसे निकालने वाला कलेक्ट रिक्वेस्ट जाल है!',
    },
    explanation: {
      'en-IN':
        'Golden Rule of UPI: You NEVER need to tap "Pay" or enter your UPI PIN to receive money! Vikram sent a "Collect Request"—if you enter your PIN, ₹2,000 will be deducted from YOUR bank.',
      'hi-IN':
        'यूपीआई का सबसे बड़ा नियम: पैसे प्राप्त करने (लेने) के लिए कभी भी यूपीआई पिन (UPI PIN) नहीं डालना पड़ता! पिन डालने से हमेशा आपके अपने बैंक से पैसे कटते हैं।',
    },
    redFlags: {
      'en-IN': [
        'Button says "Pay ₹2,000" instead of auto-crediting',
        'Stranger on call insists you enter your secret UPI PIN',
        'Money incoming never requires any action or PIN',
      ],
      'hi-IN': [
        'बटन पर "Pay ₹2,000" लिखा है जिसका मतलब पैसे देना होता है',
        'अनजान व्यक्ति फोन पर पिन डालने की जल्दी मचा रहा है',
        'पैसे आने के लिए कभी कोई बटन या पिन नहीं दबाना होता',
      ],
    },
  },
  {
    id: 'lottery_qr',
    title: {
      'en-IN': 'Cashback / Lottery QR Code Image',
      'hi-IN': 'कैशबैक / लॉटरी वाला क्यूआर कोड (QR Code)',
    },
    sender: 'Lucky Draw Official Prize',
    channel: 'WhatsApp',
    messageText:
      'CONGRATULATIONS! You won ₹5,000 Festival Cashback Reward. Scan this QR code in your UPI app and enter your UPI PIN to claim ₹5,000 directly into your bank!',
    verdict: 'DANGER_SCAM',
    verdictLabel: {
      'en-IN': 'SCAM — QR Codes Are Only For Paying!',
      'hi-IN': 'धोखाधड़ी — क्यूआर कोड सिर्फ पैसे देने के लिए होता है!',
    },
    explanation: {
      'en-IN':
        'Scanning a QR code in UPI is ONLY for sending money out of your account, never for receiving prizes or cashback. If you scan this and enter your PIN, you will lose ₹5,000.',
      'hi-IN':
        'क्यूआर कोड (QR Code) स्कैन करना हमेशा पैसे भेजने के लिए होता है, इनाम या कैशबैक पाने के लिए नहीं। इसे स्कैन करके पिन डालने से आपके ₹5,000 कट जाएंगे।',
    },
    redFlags: {
      'en-IN': [
        'Asks you to scan a QR code to "receive" a prize',
        'Promises free ₹5,000 cashback out of nowhere',
        'Requires UPI PIN entry after scanning',
      ],
      'hi-IN': [
        'इनाम "पाने" के लिए क्यूआर कोड स्कैन करने को कह रहा है',
        'बिना वजह मुफ्त ₹5,000 कैशबैक का लालच दे रहा है',
        'स्कैन करने के बाद यूपीआई पिन मांग रहा है',
      ],
    },
  },
];

export const TRANSLATIONS: Record<
  LanguageCode,
  {
    safetyBarText: string;
    resetBtn: string;
    resetToast: string;
    searchPlaceholder: string;
    promoHeadline: string;
    promoCta: string;
    scanQr: string;
    payContacts: string;
    payPhone: string;
    bankTransfer: string;
    payUpiId: string;
    selfTransfer: string;
    payBills: string;
    mobileRecharge: string;
    peopleHeading: string;
    businessesHeading: string;
    viewMore: string;
    billsHeading: string;
    billsSub: string;
    dthCable: string;
    electricity: string;
    postpaidMobile: string;
    loanEmi: string;
    seeAll: string;
    offersHeading: string;
    rewardsLabel: string;
    offersLabel: string;
    referralsLabel: string;
    missionsHeading: string;
    missionsSub: string;
    checkBalance: string;
    txHistory: string;
    inviteTitle: string;
    inviteSub: string;
    payBtn: string;
    requestBtn: string;
    proceedToPay: string;
    verifiedBankingName: string;
    addNotePlaceholder: string;
    npciBankHeader: string;
    npciSendingTo: string;
    npciAmount: string;
    npciEnterPin: string;
    npciCancelSafeTip: string;
    npciCancelBtn: string;
    npciSubmitBtn: string;
    bufferingTitle: string;
    bufferingSub: string;
    askSahayakBtn: string;
    sahayakTitle: string;
    sahayakSubtitle: string;
    tabCoach: string;
    tabScamShield: string;
    micPrompt: string;
    micListening: string;
    listenStepBtn: string;
    exitMissionBtn: string;
    mission1Title: string;
    mission1Desc: string;
    mission2Title: string;
    mission2Desc: string;
    mission3Title: string;
    mission3Desc: string;
    extraZeroSimBtn: string;
    extraZeroPinTip: string;
    extraZeroRecoveryTitle: string;
    extraZeroRecoveryBody: string;
    raiseDisputeBtn: string;
    refundSuccessToast: string;
    scamBannerTitle: string;
    scamBannerSub: string;
    scamBannerCta: string;
    safeFailureTitle: string;
    safeFailureBody: string;
    safeFailureRule: string;
    tryAgainDeclineBtn: string;
    pendingTitle: string;
    pendingSub: string;
    temptingRetryBtn: string;
    pendingInterceptTitle: string;
    pendingInterceptBody: string;
    paymentSuccessTitle: string;
    doneBtn: string;
    scanValidShopBtn: string;
    scanScamQrBtn: string;
    uploadScreenshotBtn: string;
    typeMessagePlaceholder: string;
    replayAudioBtn: string;
    muteAudioBtn: string;
  }
> = {
  'en-IN': {
    safetyBarText: 'Balance: ₹{balance}',
    resetBtn: 'Reset ₹10k',
    resetToast: 'Balance refilled to ₹10,000!',
    searchPlaceholder: 'Pay friends and merchants',
    promoHeadline: 'Instant loans\nup to ₹8 lakhs',
    promoCta: 'Apply now',
    scanQr: 'Scan any\nQR code',
    payContacts: 'Pay\ncontacts',
    payPhone: 'Pay phone\nnumber',
    bankTransfer: 'Bank\ntransfer',
    payUpiId: 'Pay UPI ID\nor number',
    selfTransfer: 'Self\ntransfer',
    payBills: 'Pay\nbills',
    mobileRecharge: 'Mobile\nrecharge',
    peopleHeading: 'People',
    businessesHeading: 'Businesses',
    viewMore: 'view more',
    billsHeading: 'Bills & Recharges',
    billsSub: 'No bills due. Try adding these!',
    dthCable: 'DTH / Cable\nTV',
    electricity: 'Electricity',
    postpaidMobile: 'Postpaid\nmobile',
    loanEmi: 'Loan\nEMI',
    seeAll: 'See all',
    offersHeading: 'Offers & Rewards',
    rewardsLabel: 'Rewards',
    offersLabel: 'Offers',
    referralsLabel: 'Referrals',
    missionsHeading: 'Interactive UPI Safety Scenarios',
    missionsSub: 'Try real-world payment situations safely',
    checkBalance: 'Check bank balance',
    txHistory: 'See transaction history',
    inviteTitle: 'Invite friends to get ₹201',
    inviteSub:
      'Invite friends to Google Pay and get ₹201 when your friend sends their first payment. They get ₹21!',
    payBtn: 'Pay',
    requestBtn: 'Request',
    proceedToPay: 'Proceed to Pay',
    verifiedBankingName: 'Banking Name',
    addNotePlaceholder: 'Add a note',
    npciBankHeader: 'STATE BANK / NPCI UPI',
    npciSendingTo: 'Sending to',
    npciAmount: 'Amount',
    npciEnterPin: 'ENTER 4-DIGIT UPI PIN',
    npciCancelSafeTip: 'Tip: Pressing CANCEL right now deducts ₹0 from your bank.',
    npciCancelBtn: 'CANCEL',
    npciSubmitBtn: 'SUBMIT',
    bufferingTitle: 'Connecting securely to bank...',
    bufferingSub: 'Verifying UPI PIN with NPCI servers. Please do not press back.',
    askSahayakBtn: 'Ask Sahayak',
    sahayakTitle: 'Sahayak Voice AI Coach',
    sahayakSubtitle: 'Speak or tap a question in English or Hindi',
    tabCoach: 'Voice Coach',
    tabScamShield: 'Scam Shield (SMS / Image)',
    micPrompt: 'Tap & Speak Your Doubt',
    micListening: 'Listening... Speak now',
    listenStepBtn: 'Listen',
    exitMissionBtn: 'Close',
    mission1Title: 'Scenario 1: The "Extra Zero" Typo',
    mission1Desc: 'Send ₹500 to Chandan Kirana — catch or refund a ₹5,000 slip!',
    mission2Title: 'Scenario 2: "Collect Request" Trap',
    mission2Desc: 'Vikram claims he sent ₹2,000. See why entering PIN deducts money.',
    mission3Title: 'Scenario 3: "Stuck in Processing"',
    mission3Desc: 'Pay ₹640 Electricity Bill when network drops without double-paying.',
    extraZeroSimBtn: 'Simulate Slip: Type ₹5,000 instead of ₹500',
    extraZeroPinTip: 'WAIT! Look at the top bar: it says ₹5,000 instead of ₹500! Tap CANCEL now to lose ₹0, or submit to practice getting a refund.',
    extraZeroRecoveryTitle: 'You sent ₹5,000 instead of ₹500 (₹4,500 extra)!',
    extraZeroRecoveryBody: 'Do not panic! Immediately talk to the shopkeeper or tap "Raise Dispute / Request Refund" below to recover the extra ₹4,500.',
    raiseDisputeBtn: 'Raise Dispute / Request ₹4,500 Refund',
    refundSuccessToast: '₹4,500 refunded back to your account!',
    scamBannerTitle: 'Incoming Collect Request from Vikram',
    scamBannerSub: '"Vikram sent ₹2,000! Tap Pay / Accept to receive money in your bank."',
    scamBannerCta: 'View',
    safeFailureTitle: 'Safe Failure Shield — Scam Caught!',
    safeFailureBody: 'You just got caught in a collect request scam! If this were real, ₹2,000 would have left your account.',
    safeFailureRule: 'Golden Rule: You NEVER enter your UPI PIN to receive money. Entering a PIN ONLY deducts money from your bank.',
    tryAgainDeclineBtn: 'Try Again & Decline Scam',
    pendingTitle: 'Payment Processing / Pending...',
    pendingSub: 'Bank server is slow. Waiting for confirmation...',
    temptingRetryBtn: 'Send ₹640 Again',
    pendingInterceptTitle: 'STOP! Never pay twice while Pending!',
    pendingInterceptBody: 'Never pay a second time when a transaction is "Pending." Wait for the bank to auto-reverse or confirm it first, otherwise ₹640 will be deducted twice!',
    paymentSuccessTitle: 'Paid Successfully',
    doneBtn: 'Done',
    scanValidShopBtn: 'Scan Valid Shop QR (Chandan Kirana)',
    scanScamQrBtn: 'Scan Scam Collect QR (₹2,000 Prize Trap)',
    uploadScreenshotBtn: 'Upload Scam Screenshot / Image',
    typeMessagePlaceholder: 'Ask Sahayak anything about this screen...',
    replayAudioBtn: 'Replay Voice',
    muteAudioBtn: 'Mute Voice',
  },
  'hi-IN': {
    safetyBarText: 'बैलेंस: ₹{balance}',
    resetBtn: 'रीसेट ₹10k',
    resetToast: 'बैलेंस फिर से ₹10,000 हो गया!',
    searchPlaceholder: 'दोस्त, दुकान या फोन नंबर पर पैसे भेजें',
    promoHeadline: '₹8 लाख तक का\nतुरंत लोन पाएं',
    promoCta: 'अभी आवेदन करें',
    scanQr: 'कोई भी क्यूआर\nस्कैन करें',
    payContacts: 'कॉन्टैक्ट्स\nको भेजें',
    payPhone: 'फोन नंबर\nपर भेजें',
    bankTransfer: 'बैंक\nट्रांसफर',
    payUpiId: 'यूपीआई आईडी\nया नंबर',
    selfTransfer: 'खुद को\nट्रांसफर',
    payBills: 'बिल\nभरें',
    mobileRecharge: 'मोबाइल\nरिचार्ज',
    peopleHeading: 'लोग (People)',
    businessesHeading: 'दुकानें और व्यापार',
    viewMore: 'और देखें',
    billsHeading: 'बिल और रिचार्ज',
    billsSub: 'कोई बिल बाकी नहीं है। इन्हें जोड़कर देखें!',
    dthCable: 'डीटीएच /\nकेबल टीवी',
    electricity: 'बिजली\nबिल',
    postpaidMobile: 'पोस्टपेड\nमोबाइल',
    loanEmi: 'लोन\nईएमआई',
    seeAll: 'सभी देखें',
    offersHeading: 'ऑफर और इनाम',
    rewardsLabel: 'इनाम',
    offersLabel: 'ऑफर',
    referralsLabel: 'रेफरल',
    missionsHeading: 'यूपीआई (UPI) सुरक्षा अभ्यास मिशन',
    missionsSub: 'आम गलतियों और धोखाधड़ी से बचना सीखें',
    checkBalance: 'बैंक बैलेंस चेक करें',
    txHistory: 'पुराने लेन-देन (हिस्ट्री) देखें',
    inviteTitle: 'दोस्तों को बुलाएं और ₹201 पाएं',
    inviteSub:
      'दोस्तों को आमंत्रित करें और उनके पहले पेमेंट पर ₹201 का कैशबैक पाएं। उन्हें ₹21 मिलेंगे!',
    payBtn: 'पैसे भेजें (Pay)',
    requestBtn: 'पैसे मांगें',
    proceedToPay: 'आगे बढ़ें (Proceed to Pay)',
    verifiedBankingName: 'बैंक में दर्ज नाम',
    addNotePlaceholder: 'नोट लिखें (जैसे: राशन, बिजली बिल)',
    npciBankHeader: 'स्टेट बैंक / एनपीसीआई (NPCI UPI)',
    npciSendingTo: 'किसको भेज रहे हैं',
    npciAmount: 'रकम (Amount)',
    npciEnterPin: '4-अंकों का यूपीआई पिन (UPI PIN) डालें',
    npciCancelSafeTip: 'टिप: अभी CANCEL (कैंसिल) दबाने से ₹0 कटेंगे, एक रुपया भी नहीं जाएगा।',
    npciCancelBtn: 'कैंसिल (CANCEL)',
    npciSubmitBtn: 'सबमिट (SUBMIT)',
    bufferingTitle: 'बैंक सर्वर से जुड़ रहा है...',
    bufferingSub: 'यूपीआई पिन (UPI PIN) की जांच हो रही है। कृपया बैक बटन न दबाएं।',
    askSahayakBtn: 'सहायक से पूछें',
    sahayakTitle: 'सहायक बोलने वाला एआई कोच',
    sahayakSubtitle: 'हिन्दी या अंग्रेजी में बोलकर सवाल पूछें',
    tabCoach: 'आवाज़ कोच (Sahayak)',
    tabScamShield: 'स्कैम सुरक्षा जांच (SMS / फोटो)',
    micPrompt: 'माइक दबाएं और अपना सवाल बोलें',
    micListening: 'सुन रहे हैं... अब बोलिए',
    listenStepBtn: 'सुनें',
    exitMissionBtn: 'बंद करें',
    mission1Title: 'मिशन 1: "गलती से एक जीरो ज्यादा" (₹500 की जगह ₹5,000)',
    mission1Desc: 'चंदन किराना को ₹500 भेजते समय ₹5,000 टाइप होने पर पैसे बचाना सीखें!',
    mission2Title: 'मिशन 2: "पैसे लेने के लिए पिन डालें" स्कैम',
    mission2Desc: 'विक्रम कहता है उसने ₹2,000 भेजे हैं। जानें पिन डालने से क्या होता है।',
    mission3Title: 'मिशन 3: "पेमेंट पेंडिंग (Pending)" नेटवर्क अटकना',
    mission3Desc: '₹640 बिजली बिल पेंडिंग होने पर दोबारा पैसे कटने से कैसे बचें।',
    extraZeroSimBtn: 'गलती का अभ्यास: ₹500 की जगह ₹5,000 टाइप करें',
    extraZeroPinTip: 'रुकिए! ऊपर रकम देखिए: ₹500 की जगह ₹5,000 लिखा है! अभी CANCEL दबाएंगे तो ₹0 कटेंगे, या रिफंड सीखने के लिए सबमिट करें।',
    extraZeroRecoveryTitle: 'आपने ₹500 की जगह ₹5,000 भेज दिए (₹4,500 ज्यादा)!',
    extraZeroRecoveryBody: 'घबराएं नहीं! तुरंत दुकानदार को रसीद दिखाएं या नीचे "डिस्प्यूट / ₹4,500 रिफंड मांगें" बटन दबाकर अपने अतिरिक्त पैसे वापस पाएं।',
    raiseDisputeBtn: 'डिस्प्यूट दर्ज करें / ₹4,500 रिफंड लें',
    refundSuccessToast: 'अतिरिक्त ₹4,500 आपके खाते में वापस आ गए!',
    scamBannerTitle: 'विक्रम का यूपीआई कलेक्ट मैसेज आया है',
    scamBannerSub: '"विक्रम ने ₹2,000 भेजे हैं! अपने बैंक में पैसे पाने के लिए Pay दबाएं।"',
    scamBannerCta: 'देखें',
    safeFailureTitle: 'सुरक्षा कवच — आप स्कैम से बच गए!',
    safeFailureBody: 'आप कलेक्ट रिक्वेस्ट जाल में फंस गए! अगर यह असली होता तो आपके खाते से ₹2,000 कट जाते।',
    safeFailureRule: 'सुनहरा नियम: पैसे लेने (प्राप्त करने) के लिए कभी भी यूपीआई पिन (UPI PIN) नहीं डालते। पिन डालने से हमेशा पैसे कटते हैं।',
    tryAgainDeclineBtn: 'दोबारा कोशिश करें और स्कैम खारिज (Decline) करें',
    pendingTitle: 'पेमेंट प्रोसेसिंग / पेंडिंग (Pending) है...',
    pendingSub: 'नेटवर्क धीमा है। बैंक से पुष्टि का इंतजार हो रहा है...',
    temptingRetryBtn: 'दोबारा ₹640 भेजें',
    pendingInterceptTitle: 'रुकिए! कभी दोबारा पेमेंट न करें!',
    pendingInterceptBody: 'जब पेमेंट "Pending" (पेंडिंग) हो, तो तुरंत दोबारा पैसे कभी न भेजें! पहले बैंक का मैसेज आने दें, वरना ₹640 दो बार कट जाएंगे।',
    paymentSuccessTitle: 'पेमेंट सफल रहा',
    doneBtn: 'हो गया (Done)',
    scanValidShopBtn: 'असली दुकान का क्यूआर स्कैन करें (चंदन किराना)',
    scanScamQrBtn: 'नकली लॉटरी क्यूआर स्कैन करें (₹2,000 स्कैम)',
    uploadScreenshotBtn: 'स्क्रीनशॉट फोटो अपलोड करें',
    typeMessagePlaceholder: 'सहायक से इस स्क्रीन के बारे में कुछ भी पूछें...',
    replayAudioBtn: 'फिर से सुनें',
    muteAudioBtn: 'आवाज़ बंद करें',
  },
};

export function getMissionCoachText(
  mission: MissionId,
  screen: ScreenName,
  enteredAmount: string,
  lang: LanguageCode
): string | null {
  if (!mission) return null;

  if (mission === 'qr_tutorial') {
    if (screen === 'qr') {
      return lang === 'hi-IN'
        ? 'क्यूआर ट्यूटोरियल सक्रिय: नीचे सहायक कोच के कदम 1 से 4 तक पढ़ें और सुनें—जानें "Pay" और "Receive" क्यूआर में क्या अंतर है!'
        : 'Scan QR Tutorial Active: Follow Sahayak’s highlighted UI tour below (Steps 1–4) to master "Pay" vs "Receive" QR codes!';
    }
    if (screen === 'amount') {
      return lang === 'hi-IN'
        ? 'ट्यूटोरियल (अंतिम जांच): आपने असली दुकान का क्यूआर स्कैन किया! अब हरा "✔ बैंक में दर्ज नाम: RAMESH & CHANDAN KIRANA STORE" पढ़ें और आगे बढ़ें।'
        : 'Tutorial (Final Check): You scanned a valid Shop QR! Verify the green "✔ Banking Name: RAMESH & CHANDAN KIRANA STORE" shield and tap Proceed to Pay.';
    }
    if (screen === 'pin') {
      return lang === 'hi-IN'
        ? 'ट्यूटोरियल (पिन स्क्रीन): चूंकि आप दुकानदार को पैसे भेज (Pay) रहे हैं, इसलिए यहाँ 4-अंकों का यूपीआई पिन डालें और SUBMIT दबाएं।'
        : 'Tutorial (PIN Screen): Because you are PAYING the shopkeeper, enter your 4-digit UPI PIN here and tap SUBMIT.';
    }
    if (screen === 'receipt') {
      return lang === 'hi-IN'
        ? 'ट्यूटोरियल पूरा हुआ! अब आप हमेशा याद रखेंगे: पैसे देने के लिए क्यूआर स्कैन करते हैं, और पैसे लेने के लिए केवल अपना क्यूआर दिखाते हैं!'
        : 'Scan QR Tutorial Complete! You now know the golden difference between scanning a Pay QR and showing your Receive QR!';
    }
  }

  if (mission === 'pay_phone') {
    if (screen === 'home') {
      return lang === 'hi-IN'
        ? 'कदम 1/4 (फोन नंबर पेमेंट): पॉपअप में 10-अंकों का मोबाइल नंबर (9820144120) चेक करें और "सत्यापित करें और आगे बढ़ें" दबाएं।'
        : 'Step 1/4 (Pay Phone Number): Check the 10-digit mobile number (9820144120) in the popup and tap "Verify & Proceed".';
    }
    if (screen === 'amount') {
      return lang === 'hi-IN'
        ? 'कदम 2/4 (फोन नंबर पेमेंट): हरे रंग में "✔ बैंक में दर्ज नाम: RAMESH & CHANDAN KIRANA STORE" पढ़ें, ₹250 रकम जांचें और "आगे बढ़ें (Proceed to Pay)" दबाएं।'
        : 'Step 2/4 (Pay Phone Number): Verify the green "✔ Banking Name: RAMESH & CHANDAN KIRANA STORE" shield, check ₹250, and tap "Proceed to Pay".';
    }
    if (screen === 'pin') {
      return lang === 'hi-IN'
        ? 'कदम 3/4 (फोन नंबर पेमेंट): ऊपर पट्टी में नाम और ₹250 रकम जांचें, फिर अपना 4-अंकों का यूपीआई पिन (जैसे 1234) डालकर SUBMIT दबाएं।'
        : 'Step 3/4 (Pay Phone Number): Check the payee & ₹250 on the top bar, enter any 4-digit UPI PIN (e.g., 1234), and tap SUBMIT.';
    }
    if (screen === 'receipt') {
      return lang === 'hi-IN'
        ? 'कदम 4/4 (मिशन पूरा!): शाबाश! आपने फोन नंबर की बैंक पहचान जांचकर सुरक्षित रूप से ₹250 भेज दिए!'
        : 'Step 4/4 (Mission Complete!): Well done! You verified the recipient’s banking name and safely completed a phone number payment!';
    }
  }

  if (mission === 'scan_qr') {
    if (screen === 'qr') {
      return lang === 'hi-IN'
        ? 'कदम 1/4 (क्यूआर स्कैन): दुकान के क्यूआर कोड को फ्रेम के बीच में रखें और नीचे हरा बटन "असली दुकान का क्यूआर स्कैन करें (चंदन किराना)" दबाएं।'
        : 'Step 1/4 (Scan QR Code): Center the shop QR inside the frame and tap the green "Scan Valid Shop QR (Chandan Kirana)" button below.';
    }
    if (screen === 'amount') {
      return lang === 'hi-IN'
        ? 'कदम 2/4 (क्यूआर स्कैन): स्कैन के बाद हमेशा हरा "✔ बैंक में दर्ज नाम: RAMESH & CHANDAN KIRANA STORE" पढ़ें, ₹180 रकम भरें और "आगे बढ़ें" दबाएं।'
        : 'Step 2/4 (Scan QR Code): Always read the green "✔ Banking Name: RAMESH & CHANDAN KIRANA STORE" shield after scanning, check ₹180, and tap "Proceed to Pay".';
    }
    if (screen === 'pin') {
      return lang === 'hi-IN'
        ? 'कदम 3/4 (क्यूआर स्कैन): ऊपर पट्टी में दुकान का नाम और ₹180 जांचें, फिर अपना 4-अंकों का यूपीआई पिन डालकर SUBMIT दबाएं।'
        : 'Step 3/4 (Scan QR Code): Verify the shop name & ₹180 at the top, enter your 4-digit UPI PIN, and tap SUBMIT.';
    }
    if (screen === 'receipt') {
      return lang === 'hi-IN'
        ? 'कदम 4/4 (मिशन पूरा!): बहुत बढ़िया! आपने क्यूआर कोड स्कैन करके दुकानदार का नाम जांचा और सुरक्षित पेमेंट पूरा किया!'
        : 'Step 4/4 (Mission Complete!): Awesome! You scanned the shop QR, verified the merchant banking name, and completed the payment safely!';
    }
    return lang === 'hi-IN'
      ? 'कदम 1/4 (क्यूआर स्कैन): होम स्क्रीन पर "कोई भी क्यूआर स्कैन करें" दबाएं।'
      : 'Step 1/4 (Scan QR Code): Tap "Scan any QR code" on the Home screen.';
  }

  if (mission === 'pay_bill') {
    if (screen === 'amount') {
      return lang === 'hi-IN'
        ? 'कदम 2/4 (बिल पेमेंट): सरकारी बिलर का नाम ("✔ STATE ELECTRICITY BOARD LTD") और ₹640 बिजली बिल की रकम चेक करें, फिर "आगे बढ़ें (Proceed to Pay)" दबाएं।'
        : 'Step 2/4 (Pay a Bill): Verify the official biller shield ("✔ STATE ELECTRICITY BOARD LTD") and ₹640 bill amount, then tap "Proceed to Pay".';
    }
    if (screen === 'pin') {
      return lang === 'hi-IN'
        ? 'कदम 3/4 (बिल पेमेंट): ऊपर बिजली बोर्ड और ₹640 की पुष्टि करें, अपना 4-अंकों का यूपीआई पिन डालें और SUBMIT दबाएं।'
        : 'Step 3/4 (Pay a Bill): Confirm Electricity Board & ₹640 at the top, enter your 4-digit UPI PIN, and tap SUBMIT.';
    }
    if (screen === 'receipt') {
      return lang === 'hi-IN'
        ? 'कदम 4/4 (मिशन पूरा!): बधाई हो! आपका ₹640 का बिजली बिल जमा हो गया है। रसीद में अपना 12-अंकों का UTR नंबर देखें।'
        : 'Step 4/4 (Mission Complete!): Congratulations! Your ₹640 Electricity Bill is paid. Notice the 12-digit UTR reference number on your receipt.';
    }
    return lang === 'hi-IN'
      ? 'कदम 1/4 (बिल पेमेंट): होम स्क्रीन पर "बिल भरें" या "बिजली बिल" आइकन दबाएं।'
      : 'Step 1/4 (Pay a Bill): Tap "Pay bills" or "Electricity" on the Home screen.';
  }

  if (mission === 'extra_zero') {
    if (screen === 'receipt') {
      const receiptMessages: Record<LanguageCode, string> = {
        'en-IN':
          'Step 3/3: You sent ₹5,000 by mistake! Tap the orange "Raise Dispute / Request ₹4,500 Refund" button on the receipt below to recover your extra ₹4,500.',
        'hi-IN':
          'कदम 3/3: गलती से ₹5,000 चले गए! अपने अतिरिक्त ₹4,500 तुरंत वापस पाने के लिए नीचे नारंगी बटन "डिस्प्यूट दर्ज करें / ₹4,500 रिफंड लें" दबाएं।',
      };
      return receiptMessages[lang];
    }
    if (screen === 'pin') {
      const amt = Number(enteredAmount) || 0;
      const messages: Record<LanguageCode, string> = {
        'en-IN':
          amt === 5000
            ? 'Step 2/3: Look closely at the top bar! It says ₹5,000 instead of ₹500. Tap CANCEL right now to lose ₹0, OR tap SUBMIT to practice how to recover ₹4,500 after sending by mistake.'
            : 'Step 2/3: You are on the NPCI UPI PIN screen. Notice how you can always check the amount at the top and press CANCEL safely.',
        'hi-IN':
          amt === 5000
            ? 'कदम 2/3: ऊपर पट्टी में रकम ध्यान से देखें! ₹500 की जगह ₹5,000 लिखा है। ₹0 नुकसान के लिए अभी CANCEL दबाएं, या गलती के बाद ₹4,500 रिफंड लेना सीखने के लिए पिन डालकर SUBMIT करें।'
            : 'कदम 2/3: आप यूपीआई पिन स्क्रीन पर हैं। यहाँ ऊपर हमेशा रकम चेक करें—CANCEL दबाने पर एक रुपया भी नहीं कटता।',
      };
      return messages[lang];
    }
    const step1: Record<LanguageCode, string> = {
      'en-IN':
        'Scenario 1 (Extra Zero Typo): You want to pay ₹500 to Chandan Kirana. Tap the orange "Simulate Slip: ₹5,000" button below, then tap Proceed to Pay!',
      'hi-IN':
        'मिशन 1 (एक जीरो ज्यादा): आपको चंदन किराना को ₹500 भेजने हैं। नीचे नारंगी बटन "₹500 की जगह ₹5,000 टाइप करें" दबाएं और आगे बढ़ें!',
    };
    return step1[lang];
  }

  if (mission === 'collect_scam') {
    const msg: Record<LanguageCode, string> = {
      'en-IN':
        'Scenario 2 (Collect Scam): Vikram says he sent you ₹2,000 and wants you to tap "Pay" and enter your UPI PIN to receive it. Try tapping Decline to stay safe, OR tap Pay & enter PIN to see the Safe Failure Shield!',
      'hi-IN':
        'मिशन 2 (कलेक्ट रिक्वेस्ट स्कैम): विक्रम कहता है कि उसने ₹2,000 भेजे हैं और पैसे पाने के लिए आपको "Pay" दबाकर यूपीआई पिन डालना होगा। सुरक्षित रहने के लिए Decline दबाएं, या पिन डालकर देखें कि सुरक्षा कवच कैसे बचाता है!',
    };
    return msg[lang];
  }

  if (mission === 'network_drop') {
    if (screen === 'processing') {
      return lang === 'hi-IN'
        ? 'कदम 3/4 (पेंडिंग स्क्रीन): पेमेंट अटक गया है! "दोबारा ₹640 भेजें" बटन दबाकर देखें कि क्या होता है, या 6 सेकंड टाइमर पूरा होने का इंतजार करें।'
        : 'Step 3/4 (Stuck in Processing): Payment is Pending! Tap "Send ₹640 Again" to see the safety warning, or wait 6 seconds for the bank to settle it automatically.';
    }
    if (screen === 'receipt') {
      return lang === 'hi-IN'
        ? 'कदम 4/4 (मिशन पूरा!): आपने देखा—बिना दोबारा पैसे भेजे बैंक ने खुद पेमेंट सफल कर दिया और आपके ₹640 दो बार कटने से बच गए!'
        : 'Step 4/4 (Mission Complete!): As you saw, waiting patiently allowed the bank to confirm your ₹640 payment without deducting your money twice!';
    }
    const msg: Record<LanguageCode, string> = {
      'en-IN':
        'Scenario 3 (Network Drop): Pay the ₹640 Electricity Bill. After you enter your PIN, the screen will get stuck on "Pending." See what happens if you tap "Send ₹640 Again"!',
      'hi-IN':
        'मिशन 3 (नेटवर्क अटकना): ₹640 का बिजली बिल भरें। पिन डालने के बाद स्क्रीन "Pending" (पेंडिंग) पर अटक जाएगी। देखें कि अगर आप घबराकर "दोबारा ₹640 भेजें" दबाते हैं तो क्या होता है!',
    };
    return msg[lang];
  }

  return null;
}

export function getScreenQuickDoubts(
  screen: ScreenName,
  lang: LanguageCode
): string[] {
  const byScreen: Record<ScreenName, Record<LanguageCode, string[]>> = {
    pin: {
      'en-IN': [
        'Will I lose money if I press Cancel now?',
        'Why did the screen design suddenly turn dark blue?',
        'Am I sending money or receiving money right now?',
      ],
      'hi-IN': [
        'अगर मैं अभी Cancel (कैंसिल) दबाऊं तो क्या पैसे कटेंगे?',
        'यह स्क्रीन अचानक गहरे नीले रंग की क्यों हो गई?',
        'अभी मेरे खाते से पैसे जा रहे हैं या आ रहे हैं?',
      ],
    },
    buffering: {
      'en-IN': [
        'Should I press back while the payment is buffering?',
        'What is happening during this connecting screen?',
        'Will my money be deducted twice if internet drops?',
      ],
      'hi-IN': [
        'जब पेमेंट गोल-गोल घूम रहा हो तो क्या बैक बटन दबाना चाहिए?',
        'इस कनेक्टिंग स्क्रीन के दौरान बैंक क्या जांच करता है?',
        'अगर इंटरनेट कट जाए तो क्या पैसे दो बार कटेंगे?',
      ],
    },
    amount: {
      'en-IN': [
        'How do I check if this is the real shopkeeper?',
        'What if I accidentally type an extra zero?',
        'Is money deducted when I tap Proceed to Pay?',
      ],
      'hi-IN': [
        'कैसे पता चलेगा कि यह असली दुकानदार का खाता है?',
        'अगर गलती से एक जीरो ज्यादा दब जाए तो क्या करें?',
        'क्या Proceed to Pay दबाते ही पैसे कट जाते हैं?',
      ],
    },
    processing: {
      'en-IN': [
        'Payment is stuck on Pending! Should I pay again?',
        'How long does a Pending payment take to settle?',
        'What if the shopkeeper says he did not get the SMS?',
      ],
      'hi-IN': [
        'पेमेंट पेंडिंग (Pending) में अटक गया! क्या दोबारा पैसे भेजूं?',
        'पेंडिंग पेमेंट ठीक होने में कितना समय लगता है?',
        'अगर दुकानदार कहे कि उसे मैसेज नहीं मिला तो क्या करें?',
      ],
    },
    qr: {
      'en-IN': [
        'Can I scan a QR code to receive cashback or lottery?',
        'How to verify a shop QR code before paying?',
        'What is a Collect Request QR scam?',
      ],
      'hi-IN': [
        'क्या इनाम या कैशबैक पाने के लिए क्यूआर कोड स्कैन करते हैं?',
        'दुकान पर क्यूआर (QR) स्कैन करते समय क्या चेक करें?',
        'नकली क्यूआर कोड स्कैम से कैसे बचें?',
      ],
    },
    chat: {
      'en-IN': [
        'Someone sent a Pay/Accept button—will I get money?',
        'Do I ever need a UPI PIN to receive money?',
        'What is the difference between Pay and Request?',
      ],
      'hi-IN': [
        'किसी ने Pay वाला बटन भेजा है—क्या इसे दबाने से पैसे मिलेंगे?',
        'क्या पैसे अपने बैंक में लेने के लिए यूपीआई पिन डालना पड़ता है?',
        'Pay और Request बटन में क्या अंतर है?',
      ],
    },
    receipt: {
      'en-IN': [
        'I sent ₹5,000 instead of ₹500! How do I get a refund?',
        'What is the 12-digit UTR number on this receipt?',
        'How to prove to the shopkeeper that payment succeeded?',
      ],
      'hi-IN': [
        'मैंने ₹500 की जगह ₹5,000 भेज दिए! पैसे वापस कैसे मिलेंगे?',
        'रसीद पर लिखा 12-अंकों का UTR नंबर क्या होता है?',
        'दुकानदार को कैसे दिखाएं कि पेमेंट सफल हो गया है?',
      ],
    },
    home: {
      'en-IN': [
        'What is the #1 Golden Rule of UPI safety?',
        'How do I check my bank balance safely?',
        'Which safety scenario should I try first?',
      ],
      'hi-IN': [
        'यूपीआई (UPI) सुरक्षा का सबसे बड़ा नियम क्या है?',
        'मैं अपना बैंक बैलेंस सुरक्षित तरीके से कैसे चेक करूं?',
        'मुझे सबसे पहले कौन सा अभ्यास मिशन ट्राई करना चाहिए?',
      ],
    },
    history: {
      'en-IN': [
        'How do I raise a dispute on a wrong transaction?',
        'Where can I see refunded money?',
        'What does the UTR reference number mean?',
      ],
      'hi-IN': [
        'गलत लेन-देन पर रिफंड या शिकायत कैसे करें?',
        'रिफंड हुए पैसे कहाँ दिखते हैं?',
        'UTR रेफरेंस नंबर का क्या काम होता है?',
      ],
    },
    balance: {
      'en-IN': [
        'Why do I need a UPI PIN to check my bank balance?',
        'Does checking bank balance deduct any money?',
        'How often can I check my balance?',
      ],
      'hi-IN': [
        'बैंक बैलेंस चेक करने के लिए यूपीआई पिन क्यों लगता है?',
        'क्या बैलेंस चेक करने से कोई पैसा कटता है?',
        'मैं अपना बैलेंस कितनी बार चेक कर सकता हूँ?',
      ],
    },
  };

  return byScreen[screen]?.[lang] || byScreen.home[lang];
}

export interface OfflineCoachContext {
  question: string;
  screen: ScreenName;
  activeMission: MissionId;
  enteredAmount: string;
  isScamFlow: boolean;
  contactName?: string;
  lang: LanguageCode;
}

export function getOfflineSahayakReply(ctx: OfflineCoachContext): string {
  const q = ctx.question.toLowerCase();
  const { screen, activeMission, enteredAmount, isScamFlow, lang } = ctx;

  // 1. Check for Cancel / Lose Money on PIN screen
  if (
    q.includes('cancel') ||
    q.includes('कैंसिल') ||
    q.includes('lose money')
  ) {
    const replies: Record<LanguageCode, string> = {
      'en-IN':
        'No, you will lose ₹0 if you press Cancel right now! Until you enter all 4 digits of your UPI PIN and press the checkmark, not a single rupee leaves your bank account. Always check the amount at the top and press Cancel if anything looks wrong.',
      'hi-IN':
        'बिल्कुल नहीं! अभी Cancel (कैंसिल) दबाने से आपका ₹0 कटेगा, यानी एक रुपया भी नहीं जाएगा। जब तक आप 4-अंकों का यूपीआई पिन डालकर सबमिट नहीं करते, पैसे पूरी तरह सुरक्षित रहते हैं।',
    };
    return replies[lang];
  }

  // 2. Check for Dark blue / NPCI screen change
  if (
    q.includes('dark blue') ||
    q.includes('screen design') ||
    q.includes('नीले') ||
    q.includes('change')
  ) {
    const replies: Record<LanguageCode, string> = {
      'en-IN':
        'This stark dark-blue and white screen is the official NPCI Bank security screen built into every UPI app in India. It looks serious so you know you are entering your secret UPI PIN directly with your bank—and it shows the exact Payee and Amount at the top.',
      'hi-IN':
        'यह गहरे नीले और सफेद रंग की स्क्रीन भारत के हर यूपीआई ऐप की असली बैंक सुरक्षा (NPCI) स्क्रीन होती है। इसका डिजाइन इसलिए अलग होता है ताकि आपको पता चले कि अब आप सीधे अपने बैंक में गुप्त यूपीआई पिन डाल रहे हैं।',
    };
    return replies[lang];
  }

  // 3. Sending vs Receiving / Collect Scam / Golden Rule
  if (
    isScamFlow ||
    activeMission === 'collect_scam' ||
    q.includes('receive') ||
    q.includes('sending or receiving') ||
    q.includes('लेने') ||
    q.includes('जा रहे') ||
    q.includes('golden rule') ||
    q.includes('नियम')
  ) {
    const replies: Record<LanguageCode, string> = {
      'en-IN':
        'Careful! Whenever the UPI PIN screen opens, money is ALWAYS going OUT of your bank account. Remember the #1 Golden Rule: You NEVER need to tap Pay or enter your UPI PIN to receive money from anyone!',
      'hi-IN':
        'सावधान! जब भी यूपीआई पिन (UPI PIN) वाली स्क्रीन खुलती है, तो आपके खाते से पैसे हमेशा बाहर जा रहे होते हैं। सबसे बड़ा नियम याद रखें: पैसे लेने (प्राप्त करने) के लिए कभी भी पिन नहीं डालना पड़ता!',
    };
    return replies[lang];
  }

  // 4. Pending / Stuck in Processing / Buffering
  if (
    screen === 'processing' ||
    screen === 'buffering' ||
    activeMission === 'network_drop' ||
    q.includes('pending') ||
    q.includes('पेंडिंग') ||
    q.includes('again') ||
    q.includes('दोबारा') ||
    q.includes('buffering')
  ) {
    const replies: Record<LanguageCode, string> = {
      'en-IN':
        'When a payment is buffering or says "Pending," STOP and do NOT press back or pay a second time! Banks confirm or refund pending money automatically within a few minutes. Paying again right away can deduct your money twice.',
      'hi-IN':
        'जब पेमेंट कनेक्ट हो रहा हो या "Pending" (पेंडिंग) दिखाए, तो रुक जाएं और तुरंत दोबारा पैसे बिल्कुल न भेजें! बैंक कुछ ही मिनटों में खुद पेमेंट पूरा कर देता है या पैसे वापस कर देता है।',
    };
    return replies[lang];
  }

  // 5. Extra zero / Refund / Dispute
  if (
    activeMission === 'extra_zero' ||
    q.includes('extra zero') ||
    q.includes('5,000') ||
    q.includes('5000') ||
    q.includes('refund') ||
    q.includes('जीरो') ||
    q.includes('रिफंड')
  ) {
    const replies: Record<LanguageCode, string> = {
      'en-IN': `Right now the amount entered is ₹${enteredAmount || '500'}. If you notice an extra zero before entering your PIN, just press Cancel for ₹0 loss! If you already sent ₹5,000 by mistake, open the receipt and tap "Raise Dispute / Request Refund" immediately.`,
      'hi-IN': `अभी दर्ज रकम ₹${enteredAmount || '500'} है। अगर पिन डालने से पहले गलती दिख जाए, तो तुरंत Cancel दबा दें—एक रुपया नहीं कटेगा! और अगर गलती से पैसे चले गए हैं, तो रसीद खोलकर "डिस्प्यूट / रिफंड मांगें" बटन दबाएं।`,
    };
    return replies[lang];
  }

  // 6. QR Code questions
  if (q.includes('qr') || q.includes('क्यूआर')) {
    const replies: Record<LanguageCode, string> = {
      'en-IN':
        'Remember: Scanning any QR code is ONLY for paying money out, never for receiving prizes or cashback! After scanning a shop QR, always check the green "Verified Banking Name" shield before tapping Proceed to Pay.',
      'hi-IN':
        'ध्यान रखें: क्यूआर कोड (QR Code) स्कैन करना हमेशा पैसे देने के लिए होता है, इनाम या कैशबैक पाने के लिए कभी नहीं! दुकान पर स्कैन करने के बाद हमेशा हरा "बैंक में दर्ज नाम" (Banking Name) पढ़कर ही आगे बढ़ें।',
    };
    return replies[lang];
  }

  // Default warm contextual response
  const defaultReplies: Record<LanguageCode, string> = {
    'en-IN':
      'Welcome! I am Sahayak, your UPI voice coach. Take your time exploring—remember to always verify the Banking Name and never share or enter your UPI PIN to receive money!',
    'hi-IN':
      'नमस्ते! मैं सहायक हूँ, आपका यूपीआई कोच। बेझिझक हर बटन दबाकर सीखें—बस याद रखें कि पैसे लेने के लिए कभी भी यूपीआई पिन (UPI PIN) नहीं डालते!',
  };
  return defaultReplies[lang];
}

export function evaluateTransactionAttempt(params: {
  amount: number;
  balance: number;
  pinLength: number;
  isScamRequest: boolean;
  activeMission: MissionId;
  contactId: string;
}): {
  outcome:
    | 'INVALID_PIN'
    | 'INSUFFICIENT_BALANCE'
    | 'SCAM_INTERCEPTED'
    | 'NETWORK_PENDING_SIMULATION'
    | 'SUCCESS_EXTRA_ZERO'
    | 'SUCCESS_NORMAL';
  newBalance: number;
  overpaidAmount: number;
} {
  const { amount, balance, pinLength, isScamRequest, activeMission, contactId } =
    params;

  if (pinLength !== 4) {
    return { outcome: 'INVALID_PIN', newBalance: balance, overpaidAmount: 0 };
  }

  if (isScamRequest || contactId === 'vikram') {
    return {
      outcome: 'SCAM_INTERCEPTED',
      newBalance: balance,
      overpaidAmount: 0,
    };
  }

  if (amount <= 0 || amount > balance) {
    return {
      outcome: 'INSUFFICIENT_BALANCE',
      newBalance: balance,
      overpaidAmount: 0,
    };
  }

  if (
    activeMission === 'network_drop' ||
    (activeMission === null && contactId === 'electricity')
  ) {
    return {
      outcome: 'NETWORK_PENDING_SIMULATION',
      newBalance: balance - amount,
      overpaidAmount: 0,
    };
  }

  if (activeMission === 'extra_zero' && amount === 5000 && contactId === 'ramesh') {
    return {
      outcome: 'SUCCESS_EXTRA_ZERO',
      newBalance: balance - amount,
      overpaidAmount: 4500,
    };
  }

  return {
    outcome: 'SUCCESS_NORMAL',
    newBalance: balance - amount,
    overpaidAmount: 0,
  };
}

export function calculateRefundRecovery(params: {
  currentBalance: number;
  originalAmount: number;
  intendedAmount: number;
}): {
  refundedAmount: number;
  updatedBalance: number;
} {
  const refund = Math.max(0, params.originalAmount - params.intendedAmount);
  return {
    refundedAmount: refund,
    updatedBalance: params.currentBalance + refund,
  };
}

export function analyzeScamInputOffline(
  textOrSampleId: string,
  lang: LanguageCode
): {
  verdict: 'DANGER_SCAM' | 'SAFE';
  verdictLabel: string;
  explanation: string;
  redFlags: string[];
} {
  const matchedSample = SCAM_SAMPLES.find((s) => s.id === textOrSampleId);
  if (matchedSample) {
    return {
      verdict: matchedSample.verdict,
      verdictLabel: matchedSample.verdictLabel[lang],
      explanation: matchedSample.explanation[lang],
      redFlags: matchedSample.redFlags[lang],
    };
  }

  const lower = textOrSampleId.toLowerCase();
  const isSuspicious =
    lower.includes('pin') ||
    lower.includes('kyc') ||
    lower.includes('lottery') ||
    lower.includes('prize') ||
    lower.includes('cashback') ||
    lower.includes('block') ||
    lower.includes('disconnect') ||
    lower.includes('bit.ly') ||
    lower.includes('receive') ||
    lower.includes('पिन') ||
    lower.includes('लॉटरी');

  if (isSuspicious) {
    return {
      verdict: 'DANGER_SCAM',
      verdictLabel: SCAM_SAMPLES[0].verdictLabel[lang],
      explanation: SCAM_SAMPLES[0].explanation[lang],
      redFlags: SCAM_SAMPLES[0].redFlags[lang],
    };
  }

  const safeText: Record<
    LanguageCode,
    { label: string; exp: string; flags: string[] }
  > = {
    'en-IN': {
      label: 'LOOKS SAFE — Standard Info Message',
      exp: 'This message does not ask for your secret UPI PIN, OTP, or urgent link clicks. Still, never share your PIN with anyone on a phone call.',
      flags: [
        'No request for UPI PIN or OTP detected',
        'No fake panic deadline found',
      ],
    },
    'hi-IN': {
      label: 'सुरक्षित लगता है — सामान्य जानकारी',
      exp: 'इस मैसेज में आपसे गुप्त यूपीआई पिन (UPI PIN), ओटीपी या किसी अनजान लिंक पर क्लिक करने को नहीं कहा गया है। फिर भी फोन पर किसी को पिन न बताएं।',
      flags: [
        'यूपीआई पिन या ओटीपी नहीं मांगा गया है',
        'कोई डराने वाली धमकी नहीं है',
      ],
    },
  };

  return {
    verdict: 'SAFE',
    verdictLabel: safeText[lang].label,
    explanation: safeText[lang].exp,
    redFlags: safeText[lang].flags,
  };
}
