/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  Phone,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Send,
  Upload,
  Settings,
  X,
  Search,
  Building2,
  History,
  Delete,
  Check,
  Info,
  FileWarning,
  Contact2,
  AtSign,
  Smartphone,
  Tv,
  Lightbulb,
  FileText,
  Gift,
  Tag,
  Megaphone,
  UserRound,
} from 'lucide-react';
import {
  LanguageCode,
  ScreenName,
  MissionId,
  Contact,
  TransactionRecord,
  LANGUAGE_OPTIONS,
  INITIAL_CONTACTS,
  INITIAL_TRANSACTIONS,
  SCAM_SAMPLES,
  TRANSLATIONS,
  PRACTICE_MISSIONS,
  QR_TUTORIAL_STEPS,
  getMissionCoachText,
  getScreenQuickDoubts,
  getOfflineSahayakReply,
  evaluateTransactionAttempt,
  calculateRefundRecovery,
  analyzeScamInputOffline,
} from './utils/practicePayLogic';

// --- Web Audio API Synthesizer (No External MP3s) ---
function playSuccessChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77, now + 0.14);
    gain2.gain.setValueAtTime(0.22, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.65);
  } catch {
    // Ignore audio context restriction errors in headless environments
  }
}

function playAlertBuzz() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    for (let i = 0; i < 2; i++) {
      const start = now + i * 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(165, start);
      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.16);
    }
  } catch {
    // Ignore audio context restriction errors
  }
}

export default function App() {
  // --- Core App State ---
  const [lang, setLang] = useState<LanguageCode>('en-IN');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [balance, setBalance] = useState<number>(10000);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(
    INITIAL_TRANSACTIONS
  );
  const [selectedContactId, setSelectedContactId] = useState<string>('ramesh');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePromoSlide, setActivePromoSlide] = useState<number>(0);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showMissionsDrawer, setShowMissionsDrawer] = useState<boolean>(false);

  // --- Payment Flow State ---
  const [enteredAmount, setEnteredAmount] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [pinDigits, setPinDigits] = useState<string>('');
  const [npciDetailsExpanded, setNpciDetailsExpanded] = useState<boolean>(true);
  const [isScamFlow, setIsScamFlow] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(
    null
  );
  const [isBalanceCheckPin, setIsBalanceCheckPin] = useState<boolean>(false);
  const [balanceUnlocked, setBalanceUnlocked] = useState<boolean>(false);
  const [bufferingStepText, setBufferingStepText] = useState<string>('');

  // --- Guided Safe-to-Fail Missions State ---
  const [activeMission, setActiveMission] = useState<MissionId>(null);
  const [expandedMissionId, setExpandedMissionId] =
    useState<string>('qr_tutorial');
  const [qrTutorialStep, setQrTutorialStep] = useState<number>(0);
  const [showCoachStepsList, setShowCoachStepsList] = useState<boolean>(false);
  const [showIncomingScamBanner, setShowIncomingScamBanner] =
    useState<boolean>(false);
  const [showSafeFailureModal, setShowSafeFailureModal] =
    useState<boolean>(false);
  const [pendingSecondsLeft, setPendingSecondsLeft] = useState<number>(6);
  const [showPendingInterceptModal, setShowPendingInterceptModal] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Sahayak Voice AI Coach & Scam Shield Drawer State ---
  const [isSahayakOpen, setIsSahayakOpen] = useState<boolean>(false);
  const [sahayakTab, setSahayakTab] = useState<'coach' | 'scam'>('coach');
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [coachAnswer, setCoachAnswer] = useState<string>('');
  const [isCoachLoading, setIsCoachLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCoachSettings, setShowCoachSettings] = useState<boolean>(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);

  // --- Scam Shield State ---
  const [selectedScamSampleId, setSelectedScamSampleId] =
    useState<string>('kyc_sms');
  const [customScamText] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [scamAnalysisResult, setScamAnalysisResult] = useState<{
    verdict: 'DANGER_SCAM' | 'SAFE';
    verdictLabel: string;
    explanation: string;
    redFlags: string[];
  } | null>(null);
  const [isScamAnalyzing, setIsScamAnalyzing] = useState<boolean>(false);

  // --- Phone Number Direct Pay Modal ---
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const bufferTimeoutRef = useRef<number | null>(null);

  const t = TRANSLATIONS[lang];
  const selectedContact =
    contacts.find((c) => c.id === selectedContactId) || contacts[0];

  // --- Helper: Show temporary toast ---
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // --- Helper: Text-to-Speech (TTS) in active regional locale ---
  const speakText = useCallback(
    (textToSpeak: string, forceSpeak = false) => {
      if ((isMuted || !autoSpeakEnabled) && !forceSpeak) return;
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = lang;
          utterance.rate = 0.95;
          const voices = window.speechSynthesis.getVoices();
          const matchingVoice = voices.find(
            (v) =>
              v.lang.toLowerCase() === lang.toLowerCase() ||
              v.lang.toLowerCase().startsWith(lang.split('-')[0])
          );
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
          window.speechSynthesis.speak(utterance);
        }
      } catch {
        // Ignore TTS errors on unsupported browsers
      }
    },
    [lang, isMuted, autoSpeakEnabled]
  );

  // Update default coach greeting and scam analysis when language changes
  useEffect(() => {
    const initialReply = getOfflineSahayakReply({
      question: '',
      screen: currentScreen,
      activeMission,
      enteredAmount,
      isScamFlow,
      contactName: selectedContact?.name[lang],
      lang,
    });
    setCoachAnswer(initialReply);
    setScamAnalysisResult(analyzeScamInputOffline(selectedScamSampleId, lang));
  }, [
    lang,
    currentScreen,
    activeMission,
    enteredAmount,
    isScamFlow,
    selectedContact,
    selectedScamSampleId,
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) window.clearInterval(pendingTimerRef.current);
      if (bufferTimeoutRef.current) window.clearTimeout(bufferTimeoutRef.current);
    };
  }, []);

  // --- Pending Payment Countdown Effect (Mission 3) ---
  useEffect(() => {
    if (currentScreen !== 'processing') {
      if (pendingTimerRef.current) {
        window.clearInterval(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      return;
    }

    setPendingSecondsLeft(6);
    pendingTimerRef.current = window.setInterval(() => {
      setPendingSecondsLeft((prev) => {
        if (prev <= 1) {
          if (pendingTimerRef.current) {
            window.clearInterval(pendingTimerRef.current);
            pendingTimerRef.current = null;
          }
          completePaymentReceipt(Number(enteredAmount) || 640);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (pendingTimerRef.current) {
        window.clearInterval(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };
  }, [currentScreen]);

  // --- Complete Payment & Create Receipt ---
  const completePaymentReceipt = (finalAmount: number) => {
    playSuccessChime();
    const utr = String(Math.floor(100000000000 + Math.random() * 900000000000));
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      bankingName: selectedContact.bankingName,
      upiId: selectedContact.upiId,
      amount: finalAmount,
      note:
        paymentNote ||
        (selectedContact.id === 'electricity'
          ? 'Electricity Bill'
          : 'UPI Payment'),
      timestamp: 'Just now',
      status: 'success',
      utr,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              history: [
                ...c.history,
                {
                  id: newTx.id,
                  amount: finalAmount,
                  type: 'sent',
                  note: newTx.note,
                  timestamp: 'Just now',
                  status: 'success',
                },
              ],
            }
          : c
      )
    );
    setActiveReceipt(newTx);
    setShowPendingInterceptModal(false);
    setCurrentScreen('receipt');
  };

  // --- Reset Play Wallet to ₹10,000 ---
  const handleResetWallet = () => {
    setBalance(10000);
    setShowProfileMenu(false);
    playSuccessChime();
    triggerToast(t.resetToast);
  };

  // --- Launch a Safe-to-Fail Practice Mission ---
  const startMission = (missionId: MissionId) => {
    setActiveMission(missionId);
    setShowMissionsDrawer(false);
    setShowSafeFailureModal(false);
    setShowPendingInterceptModal(false);
    setShowCoachStepsList(false);

    if (missionId === 'qr_tutorial') {
      setQrTutorialStep(0);
      setSelectedContactId('ramesh');
      setEnteredAmount('180');
      setPaymentNote('QR Tutorial Payment');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('qr');
      speakText(QR_TUTORIAL_STEPS[0].sahayakNarration[lang], true);
    } else if (missionId === 'pay_phone') {
      setSelectedContactId('ramesh');
      setPhoneInput('9820144120');
      setEnteredAmount('250');
      setPaymentNote('Phone Number Payment');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('home');
      setShowPhoneModal(true);
      const coachText = getMissionCoachText('pay_phone', 'home', '250', lang);
      if (coachText) speakText(coachText);
    } else if (missionId === 'scan_qr') {
      setSelectedContactId('ramesh');
      setEnteredAmount('180');
      setPaymentNote('Shop QR Payment');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('qr');
      const coachText = getMissionCoachText('scan_qr', 'qr', '180', lang);
      if (coachText) speakText(coachText);
    } else if (missionId === 'pay_bill') {
      setSelectedContactId('electricity');
      setEnteredAmount('640');
      setPaymentNote('Electricity Bill #99201');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('amount');
      const coachText = getMissionCoachText('pay_bill', 'amount', '640', lang);
      if (coachText) speakText(coachText);
    } else if (missionId === 'network_drop') {
      setSelectedContactId('electricity');
      setEnteredAmount('640');
      setPaymentNote('Electricity Bill #99201');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('amount');
      const coachText = getMissionCoachText(
        'network_drop',
        'amount',
        '640',
        lang
      );
      if (coachText) speakText(coachText);
    } else if (missionId === 'extra_zero') {
      setSelectedContactId('ramesh');
      setEnteredAmount('500');
      setPaymentNote('Monthly Grocery / किराना राशन');
      setIsScamFlow(false);
      setShowIncomingScamBanner(false);
      setCurrentScreen('amount');
      const coachText = getMissionCoachText('extra_zero', 'amount', '500', lang);
      if (coachText) speakText(coachText);
    } else if (missionId === 'collect_scam') {
      setSelectedContactId('vikram');
      setEnteredAmount('2000');
      setPaymentNote('Sofa Advance Collect Request');
      setIsScamFlow(true);
      setShowIncomingScamBanner(true);
      setCurrentScreen('chat');
      const coachText = getMissionCoachText(
        'collect_scam',
        'chat',
        '2000',
        lang
      );
      if (coachText) speakText(coachText);
    }
  };

  // --- Handle PIN Keypad Input ---
  const handlePinKeyPress = (digit: string) => {
    if (pinDigits.length < 4) {
      setPinDigits((prev) => prev + digit);
    }
  };

  const handlePinBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
  };

  const handlePinCancel = () => {
    setPinDigits('');
    if (isBalanceCheckPin) {
      setIsBalanceCheckPin(false);
      setCurrentScreen('home');
      return;
    }
    const cancelMsg: Record<LanguageCode, string> = {
      'en-IN':
        'Cancelled safely! ₹0 deducted from your bank. Checking the PIN top bar saved your money!',
      'hi-IN':
        'सुरक्षित रूप से कैंसिल हुआ! आपके बैंक से ₹0 कटे। आपने सही समय पर रोक लिया!',
    };
    triggerToast(cancelMsg[lang]);
    speakText(cancelMsg[lang]);
    setCurrentScreen('amount');
  };

  // --- Handle PIN Submission with Authentic Buffering Effect ---
  const handlePinSubmit = () => {
    if (pinDigits.length < 4) {
      playAlertBuzz();
      return;
    }

    const submittedPinLength = pinDigits.length;
    setPinDigits('');

    // Transition to the Buffering screen first!
    setBufferingStepText(
      lang === 'hi-IN'
        ? 'एनपीसीआई (NPCI) बैंक सर्वर से सुरक्षित रूप से जुड़ रहा है...'
        : 'Connecting securely to NPCI & Bank servers...'
    );
    setCurrentScreen('buffering');

    window.setTimeout(() => {
      setBufferingStepText(
        lang === 'hi-IN'
          ? 'यूपीआई पिन (UPI PIN) की पुष्टि हो रही है...'
          : 'Verifying 4-digit UPI PIN...'
      );
    }, 850);

    if (bufferTimeoutRef.current) {
      window.clearTimeout(bufferTimeoutRef.current);
    }

    bufferTimeoutRef.current = window.setTimeout(() => {
      if (isBalanceCheckPin) {
        setIsBalanceCheckPin(false);
        setBalanceUnlocked(true);
        playSuccessChime();
        setCurrentScreen('balance');
        return;
      }

      const amountNum = Number(enteredAmount) || 0;
      const evaluation = evaluateTransactionAttempt({
        amount: amountNum,
        balance,
        pinLength: submittedPinLength,
        isScamRequest: isScamFlow || selectedContact.id === 'vikram',
        activeMission,
        contactId: selectedContact.id,
      });

      if (evaluation.outcome === 'SCAM_INTERCEPTED') {
        playAlertBuzz();
        setCurrentScreen('chat');
        setShowSafeFailureModal(true);
        speakText(`${t.safeFailureTitle}. ${t.safeFailureRule}`);
        return;
      }

      if (evaluation.outcome === 'INSUFFICIENT_BALANCE') {
        playAlertBuzz();
        setCurrentScreen('amount');
        triggerToast('Amount exceeds available balance! Tap Reset ₹10k.');
        return;
      }

      setBalance(evaluation.newBalance);

      if (evaluation.outcome === 'NETWORK_PENDING_SIMULATION') {
        setCurrentScreen('processing');
        return;
      }

      completePaymentReceipt(amountNum);
    }, 1800);
  };

  // --- Handle Mission 1 Refund / Dispute ---
  const handleRaiseDisputeRefund = (txId: string, originalAmount: number) => {
    const recovery = calculateRefundRecovery({
      currentBalance: balance,
      originalAmount,
      intendedAmount: 500,
    });
    setBalance(recovery.updatedBalance);
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId
          ? {
              ...tx,
              status: 'refunded',
              refundedAmount: recovery.refundedAmount,
            }
          : tx
      )
    );
    if (activeReceipt && activeReceipt.id === txId) {
      setActiveReceipt({
        ...activeReceipt,
        status: 'refunded',
        refundedAmount: recovery.refundedAmount,
      });
    }
    playSuccessChime();
    triggerToast(t.refundSuccessToast);
    speakText(t.refundSuccessToast);
  };

  // --- Handle Declining Vikram's Collect Scam ---
  const handleDeclineScamRequest = () => {
    setShowSafeFailureModal(false);
    setShowIncomingScamBanner(false);
    setIsScamFlow(false);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === 'vikram'
          ? {
              ...c,
              history: c.history.map((h) =>
                h.isScamRequest ? { ...h, status: 'scam_blocked' } : h
              ),
            }
          : c
      )
    );
    playSuccessChime();
    const msg: Record<LanguageCode, string> = {
      'en-IN':
        'Bravo! You declined Vikram’s Collect Request scam! Your ₹10,000 balance is 100% safe.',
      'hi-IN':
        'शाबाश! आपने विक्रम का धोखाधड़ी वाला कलेक्ट रिक्वेस्ट खारिज (Decline) कर दिया! आपके पैसे 100% सुरक्षित हैं।',
    };
    triggerToast(msg[lang]);
    speakText(msg[lang]);
    setCurrentScreen('chat');
  };

  // --- Ask Sahayak AI Coach Query (Server Gemini API + Offline Fallback) ---
  const askSahayakQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;
    setCoachQuestion(trimmed);
    setIsCoachLoading(true);

    const offlineFallback = getOfflineSahayakReply({
      question: trimmed,
      screen: currentScreen,
      activeMission,
      enteredAmount,
      isScamFlow,
      contactName: selectedContact?.name[lang],
      lang,
    });

    try {
      const response = await fetch('/api/sahayak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          currentScreen,
          activeMission,
          enteredAmount,
          isScamFlow,
          selectedContact: selectedContact?.name[lang],
          lang,
        }),
      });
      const data = await response.json();
      const finalReply =
        !data.fallback && data.reply ? data.reply : offlineFallback;
      setCoachAnswer(finalReply);
      speakText(finalReply);
    } catch {
      setCoachAnswer(offlineFallback);
      speakText(offlineFallback);
    } finally {
      setIsCoachLoading(false);
    }
  };

  // --- Web Speech API Voice Input (Speech-to-Text) ---
  const handleStartVoiceInput = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRec) {
      const fallbackQuestion = getScreenQuickDoubts(currentScreen, lang)[0];
      askSahayakQuestion(fallbackQuestion);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRec as any)();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setIsListening(false);
        if (transcript) {
          askSahayakQuestion(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        const fallbackQuestion = getScreenQuickDoubts(currentScreen, lang)[0];
        askSahayakQuestion(fallbackQuestion);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      const fallbackQuestion = getScreenQuickDoubts(currentScreen, lang)[0];
      askSahayakQuestion(fallbackQuestion);
    }
  };

  // --- Multimodal Scam Shield Analyzer (Sample SMS or Base64 Screenshot) ---
  const handleAnalyzeScamSample = async (sampleId: string) => {
    setSelectedScamSampleId(sampleId);
    setUploadedImagePreview(null);
    setIsScamAnalyzing(true);

    const sample =
      SCAM_SAMPLES.find((s) => s.id === sampleId) || SCAM_SAMPLES[0];
    const offlineAnalysis = analyzeScamInputOffline(sampleId, lang);

    try {
      const response = await fetch('/api/scam-shield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: sample.messageText,
          lang,
        }),
      });
      const data = await response.json();
      if (!data.fallback && data.result) {
        setScamAnalysisResult(data.result);
        speakText(`${data.result.verdictLabel}. ${data.result.explanation}`);
      } else {
        setScamAnalysisResult(offlineAnalysis);
        speakText(
          `${offlineAnalysis.verdictLabel}. ${offlineAnalysis.explanation}`
        );
      }
    } catch {
      setScamAnalysisResult(offlineAnalysis);
      speakText(
        `${offlineAnalysis.verdictLabel}. ${offlineAnalysis.explanation}`
      );
    } finally {
      setIsScamAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      setUploadedImagePreview(dataUrl);
      setIsScamAnalyzing(true);

      const base64Data = dataUrl.split(',')[1] || '';
      const mimeType = file.type || 'image/png';
      const offlineResult = analyzeScamInputOffline(
        customScamText || 'pin kyc lottery',
        lang
      );

      try {
        const response = await fetch('/api/scam-shield', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messageText:
              customScamText ||
              'Check this uploaded UPI / SMS screenshot for scam indicators.',
            imageBase64: base64Data,
            mimeType,
            lang,
          }),
        });
        const data = await response.json();
        if (!data.fallback && data.result) {
          setScamAnalysisResult(data.result);
          speakText(`${data.result.verdictLabel}. ${data.result.explanation}`);
        } else {
          setScamAnalysisResult(offlineResult);
          speakText(
            `${offlineResult.verdictLabel}. ${offlineResult.explanation}`
          );
        }
      } catch {
        setScamAnalysisResult(offlineResult);
        speakText(
          `${offlineResult.verdictLabel}. ${offlineResult.explanation}`
        );
      } finally {
        setIsScamAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const missionCoachBannerText = getMissionCoachText(
    activeMission,
    currentScreen,
    enteredAmount,
    lang
  );

  const peopleContacts = contacts.filter((c) => {
    if (c.category !== 'person') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name['en-IN'].toLowerCase().includes(q) ||
      c.name['hi-IN'].toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const businessContacts = contacts.filter((c) => {
    if (c.category !== 'business') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name['en-IN'].toLowerCase().includes(q) ||
      c.name['hi-IN'].toLowerCase().includes(q) ||
      c.upiId.toLowerCase().includes(q)
    );
  });

  // Render contact avatar (photo or pastel letter circle matching screenshot)
  const renderAvatar = (contact: Contact, sizeClass = 'w-13 h-13 text-lg') => {
    return (
      <div
        className={`relative rounded-full ${sizeClass} ${contact.avatarBg} ${
          contact.avatarText || 'text-white'
        } font-semibold flex items-center justify-center overflow-hidden shadow-2xs shrink-0`}
      >
        {contact.avatarUrl ? (
          <img
            src={contact.avatarUrl}
            alt={contact.name[lang]}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : contact.id === 'airtel' ? (
          <span className="text-[11px] font-extrabold tracking-tight lowercase">
            airtel
          </span>
        ) : (
          <span>{contact.initials}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-200/70 flex justify-center items-start sm:py-4">
      {/* STANDALONE MOBILE VIEWPORT CONTAINER (1:1 GOOGLE PAY INDIA AESTHETIC) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[860px] bg-white shadow-2xl sm:rounded-[32px] relative overflow-hidden flex flex-col border border-slate-200">
        {/* SUBTLE TOP BAR: Search / Language Pill (English & Hindi) / Discreet Profile Avatar */}
        {currentScreen === 'home' ? (
          <header className="bg-white px-4 pt-3 pb-2 flex items-center gap-2.5 sticky top-0 z-30">
            {/* Search Input Pill */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 bg-[#f1f3f4] hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-blue-500 rounded-full text-xs text-slate-800 placeholder:text-slate-500 transition-all focus:outline-none shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Compact 2-Language Segmented Toggle (English | हिन्दी) */}
            <nav
              aria-label="Language Selector"
              className="flex items-center bg-[#f1f3f4] p-0.5 rounded-full border border-slate-200/80 shrink-0"
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLang(opt.code)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#1a73e8] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </nav>

            {/* Discreet Profile Avatar (Toggles subtle Sandbox Balance / Reset popover) */}
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Account and Balance"
              className="w-8 h-8 rounded-full bg-[#1a73e8] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 cursor-pointer relative"
            >
              <UserRound className="w-4 h-4" />
            </button>
          </header>
        ) : (
          /* Minimal Language + Discreet Balance Bar on Secondary Screens */
          <header className="bg-white/95 backdrop-blur-xs px-4 py-2 border-b border-slate-100 flex items-center justify-between z-30 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {t.safetyBarText.replace(
                    '{balance}',
                    balance.toLocaleString('en-IN')
                  )}
                </span>
                <RotateCcw className="w-3 h-3 text-slate-400" />
              </button>
            </div>
            <nav
              aria-label="Language Selector"
              className="flex items-center bg-[#f1f3f4] p-0.5 rounded-full"
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLang(opt.code)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#1a73e8] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </nav>
          </header>
        )}

        {/* DISCREET PROFILE / WALLET POPOVER (Instead of loud top banner) */}
        {showProfileMenu && (
          <div className="absolute top-13 right-4 z-50 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 text-xs animate-screen-enter">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Sandbox Wallet</p>
                <p className="text-[11px] text-slate-500">
                  Safe environment · No real bank
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileMenu(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600">Available Balance:</span>
              <span className="font-bold text-slate-900 font-mono-tabular text-sm">
                ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetWallet}
                className="flex-1 py-2 px-3 rounded-xl bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#1a73e8] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowMissionsDrawer(true);
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Scenarios
              </button>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div
            role="status"
            className="bg-slate-900 text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between gap-2 z-30 animate-screen-enter"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* INCOMING COLLECT REQUEST SCAM NOTIFICATION BANNER (MISSION 2) */}
        {showIncomingScamBanner &&
          currentScreen !== 'pin' &&
          currentScreen !== 'buffering' && (
            <div className="bg-rose-950 text-white px-3.5 py-2.5 border-b border-rose-800 flex items-center justify-between gap-2 z-20 animate-screen-enter">
              <div className="min-w-0">
                <p className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{t.scamBannerTitle}</span>
                </p>
                <p className="text-[11px] text-rose-100 mt-0.5 line-clamp-2">
                  {t.scamBannerSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedContactId('vikram');
                  setIsScamFlow(true);
                  setCurrentScreen('chat');
                }}
                className="px-2.5 py-1.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.scamBannerCta}
              </button>
            </div>
          )}

        {/* GUIDED COACH BANNER FOR ACTIVE SCENARIOS (WITH TOGGLEABLE EXACT STEPS) */}
        {missionCoachBannerText && currentScreen !== 'buffering' && (
          <div className="bg-[#fef7e0] border-b border-amber-200 px-3.5 py-2.5 text-slate-900 z-20 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>
                  {PRACTICE_MISSIONS.find((m) => m.id === activeMission)
                    ?.badge[lang] || 'Guided Coach'}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowCoachStepsList(!showCoachStepsList)}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-950 text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{lang === 'hi-IN' ? 'सभी कदम' : 'All Steps'}</span>
                  {showCoachStepsList ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => speakText(missionCoachBannerText, true)}
                  className="px-2 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{t.listenStepBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMission(null);
                    setShowIncomingScamBanner(false);
                    setIsScamFlow(false);
                    setShowCoachStepsList(false);
                  }}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 text-slate-700 hover:bg-slate-100 text-[10px] font-medium cursor-pointer"
                >
                  {t.exitMissionBtn}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-800 leading-snug font-medium">
              {missionCoachBannerText}
            </p>
            {showCoachStepsList && activeMission && (
              <ol className="mt-2 pt-2 border-t border-amber-200/80 space-y-1.5 text-[11px] text-slate-700">
                {PRACTICE_MISSIONS.find((m) => m.id === activeMission)?.steps[
                  lang
                ].map((stepStr, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-snug">
                    <span className="w-4 h-4 rounded-full bg-amber-300/80 text-amber-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{stepStr}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* MAIN SCREEN CONTENT AREA WITH SMOOTH TRANSITIONS */}
        <main
          className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden ${
            currentScreen === 'pin' || currentScreen === 'buffering'
              ? 'pb-0'
              : 'pb-20'
          }`}
        >
          {/* =========================================================
              SCREEN 1: 1:1 GOOGLE PAY INDIA HOME DASHBOARD
             ========================================================= */}
          {currentScreen === 'home' && (
            <div className="flex flex-col bg-white animate-screen-enter">
              {/* 1. 8-ICON ACTION GRID (2 Rows × 4 Columns — Clean Google Pay Layout) */}
              <section
                aria-label="Quick Payment Actions"
                className="px-4 py-4 grid grid-cols-4 gap-y-5 gap-x-2"
              >
                {[
                  {
                    id: 'qr',
                    icon: QrCode,
                    label: t.scanQr,
                    onClick: () => setCurrentScreen('qr'),
                  },
                  {
                    id: 'contacts',
                    icon: Contact2,
                    label: t.payContacts,
                    onClick: () => {
                      setSelectedContactId('dipa');
                      setIsScamFlow(false);
                      setCurrentScreen('chat');
                    },
                  },
                  {
                    id: 'phone',
                    icon: Smartphone,
                    label: t.payPhone,
                    onClick: () => setShowPhoneModal(true),
                  },
                  {
                    id: 'bank',
                    icon: Building2,
                    label: t.bankTransfer,
                    onClick: () => {
                      setSelectedContactId('ramesh');
                      setEnteredAmount('500');
                      setPaymentNote('Bank Transfer');
                      setIsScamFlow(false);
                      setCurrentScreen('amount');
                    },
                  },
                  {
                    id: 'upi',
                    icon: AtSign,
                    label: t.payUpiId,
                    onClick: () => setShowPhoneModal(true),
                  },
                  {
                    id: 'self',
                    icon: UserRound,
                    label: t.selfTransfer,
                    onClick: () => {
                      setSelectedContactId('sweta');
                      setEnteredAmount('500');
                      setPaymentNote('Self Transfer');
                      setIsScamFlow(false);
                      setCurrentScreen('amount');
                    },
                  },
                  {
                    id: 'bills',
                    icon: Receipt,
                    label: t.payBills,
                    onClick: () => {
                      setSelectedContactId('electricity');
                      setEnteredAmount('640');
                      setPaymentNote('Electricity Bill');
                      setIsScamFlow(false);
                      setCurrentScreen('amount');
                    },
                  },
                  {
                    id: 'recharge',
                    icon: Phone,
                    label: t.mobileRecharge,
                    onClick: () => {
                      setSelectedContactId('airtel');
                      setEnteredAmount('299');
                      setPaymentNote('Prepaid Mobile Recharge');
                      setIsScamFlow(false);
                      setCurrentScreen('amount');
                    },
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform duration-150"
                    >
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#1a73e8] group-hover:bg-[#e8f0fe]/60 transition-colors">
                        <IconComp className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 text-center leading-tight whitespace-pre-line">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </section>

              {/* 3. PEOPLE & BUSINESSES SECTION (Soft Gray-Blue Container like Screenshot) */}
              <div className="bg-[#f8f9fa] rounded-t-3xl pt-5 pb-6 px-4 space-y-6 border-t border-slate-100">
                {/* People Section */}
                <section>
                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="text-[15px] font-semibold text-slate-900">
                      {t.peopleHeading}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowMissionsDrawer(true)}
                      className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.viewMore}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {peopleContacts.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setSelectedContactId(person.id);
                          setIsScamFlow(person.id === 'vikram');
                          setCurrentScreen('chat');
                        }}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform duration-150"
                      >
                        <div className="relative">
                          {renderAvatar(person, 'w-13 h-13 text-lg')}
                          {person.isSuspicious && (
                            <span
                              title="Collect Request"
                              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border border-white"
                            >
                              !
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-800 truncate w-full text-center">
                          {person.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Businesses Section */}
                <section>
                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="text-[15px] font-semibold text-slate-900">
                      {t.businessesHeading}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowMissionsDrawer(true)}
                      className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.viewMore}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {businessContacts.map((biz) => (
                      <button
                        key={biz.id}
                        type="button"
                        onClick={() => {
                          setSelectedContactId(biz.id);
                          setIsScamFlow(false);
                          setCurrentScreen('chat');
                        }}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform duration-150"
                      >
                        {renderAvatar(biz, 'w-13 h-13 text-lg')}
                        <span className="text-[11px] font-medium text-slate-800 truncate w-full text-center">
                          {biz.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* 4. BILLS & RECHARGES SECTION (Matches Screenshot Light-Blue Circles + "See all" Pill) */}
              <section className="px-4 py-5 bg-white">
                <h2 className="text-[15px] font-semibold text-slate-900">
                  {t.billsHeading}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.billsSub}</p>

                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    {
                      id: 'dth',
                      icon: Tv,
                      label: t.dthCable,
                      amount: '350',
                      contact: 'airtel',
                    },
                    {
                      id: 'elec',
                      icon: Lightbulb,
                      label: t.electricity,
                      amount: '640',
                      contact: 'electricity',
                    },
                    {
                      id: 'postpaid',
                      icon: Smartphone,
                      label: t.postpaidMobile,
                      amount: '499',
                      contact: 'airtel',
                    },
                    {
                      id: 'emi',
                      icon: FileText,
                      label: t.loanEmi,
                      amount: '1200',
                      contact: 'ramesh',
                    },
                  ].map((bill) => {
                    const BillIcon = bill.icon;
                    return (
                      <button
                        key={bill.id}
                        type="button"
                        onClick={() => {
                          setSelectedContactId(bill.contact);
                          setEnteredAmount(bill.amount);
                          setPaymentNote(bill.label.replace('\n', ' '));
                          setIsScamFlow(false);
                          setCurrentScreen('amount');
                        }}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform duration-150"
                      >
                        <div className="w-13 h-13 rounded-full bg-[#d3e3fd] text-slate-800 flex items-center justify-center">
                          <BillIcon className="w-5 h-5 stroke-[1.8]" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-700 text-center leading-tight whitespace-pre-line">
                          {bill.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContactId('electricity');
                      setEnteredAmount('640');
                      setCurrentScreen('amount');
                    }}
                    className="px-6 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-[#1a73e8] hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    {t.seeAll}
                  </button>
                </div>
              </section>

              {/* 4. INTERACTIVE PRACTICE MISSIONS WITH EXACT STEP-BY-STEP GUIDES */}
              <section className="px-4 py-5 bg-[#f8f9fa] border-t border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-900">
                      {t.missionsHeading}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lang === 'hi-IN'
                        ? 'हर फीचर के सटीक कदम (Steps) पढ़ें और खुद अभ्यास करें'
                        : 'Tap any mission to read exact steps & practice safely'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-semibold whitespace-nowrap shrink-0">
                    {lang === 'hi-IN'
                      ? `${PRACTICE_MISSIONS.length} मिशन`
                      : `${PRACTICE_MISSIONS.length} Missions`}
                  </span>
                </div>

                <div className="space-y-2.5 mt-3.5">
                  {PRACTICE_MISSIONS.map((mission) => {
                    const isExpanded = expandedMissionId === mission.id;
                    const MissionIcon =
                      mission.id === 'qr_tutorial'
                        ? Sparkles
                        : mission.id === 'pay_phone'
                        ? Smartphone
                        : mission.id === 'scan_qr'
                        ? QrCode
                        : mission.id === 'pay_bill'
                        ? Receipt
                        : mission.id === 'network_drop'
                        ? Clock
                        : mission.id === 'extra_zero'
                        ? AlertTriangle
                        : ShieldAlert;

                    return (
                      <div
                        key={mission.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                          isExpanded
                            ? 'border-[#1a73e8] shadow-sm'
                            : 'border-slate-200/90 shadow-2xs'
                        }`}
                      >
                        {/* Mission Header Row */}
                        <div
                          onClick={() =>
                            setExpandedMissionId(isExpanded ? '' : mission.id)
                          }
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                              <MissionIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider block">
                                {mission.badge[lang]}
                              </span>
                              <h3 className="text-xs font-bold text-slate-900 truncate">
                                {mission.title[lang]}
                              </h3>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {mission.subtitle[lang]}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startMission(mission.id);
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-semibold cursor-pointer active:scale-95 transition-transform"
                            >
                              {lang === 'hi-IN' ? 'शुरू करें ›' : 'Practice ›'}
                            </button>
                            <span className="p-1 text-slate-400">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Exact Step-by-Step Instructions */}
                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-2 bg-[#f8fafd] border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-slate-700">
                                {lang === 'hi-IN'
                                  ? 'करने के सटीक कदम (Exact Steps):'
                                  : 'Exact Steps to Follow:'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  speakText(
                                    `${mission.title[lang]}. ${mission.steps[
                                      lang
                                    ].join(' ')}`,
                                    true
                                  )
                                }
                                className="px-2 py-0.5 rounded-full bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#1a73e8] text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>
                                  {lang === 'hi-IN'
                                    ? 'कदम सुनें'
                                    : 'Listen Steps'}
                                </span>
                              </button>
                            </div>

                            <ol className="space-y-2">
                              {mission.steps[lang].map((stepText, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug"
                                >
                                  <span className="w-5 h-5 rounded-full bg-[#1a73e8] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{stepText}</span>
                                </li>
                              ))}
                            </ol>

                            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-amber-950 font-medium leading-snug">
                                {mission.safetyTip[lang]}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => startMission(mission.id)}
                              className="mt-3 w-full py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98 transition-transform"
                            >
                              <span>
                                {lang === 'hi-IN'
                                  ? `${mission.title[lang]} का अभ्यास शुरू करें`
                                  : `Start "${mission.title[lang]}" Practice`}
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 5. BOTTOM ACTION LINKS (See transaction history & Check bank balance) */}
              <section className="px-4 py-2 bg-white divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('history')}
                  className="w-full py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <History className="w-5 h-5 text-[#1a73e8]" />
                    <span className="text-sm font-medium text-slate-800">
                      {t.txHistory}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsBalanceCheckPin(true);
                    setPinDigits('');
                    setCurrentScreen('pin');
                  }}
                  className="w-full py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <Building2 className="w-5 h-5 text-[#1a73e8]" />
                    <span className="text-sm font-medium text-slate-800">
                      {t.checkBalance}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </section>
            </div>
          )}

          {/* =========================================================
              SCREEN 2: CHAT-STYLE PAYMENT THREAD
             ========================================================= */}
          {currentScreen === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-50 animate-screen-enter">
              <div className="bg-white px-3.5 py-3 border-b border-slate-200 flex items-center gap-3 sticky top-0 z-10">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  aria-label="Back to Home"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {renderAvatar(selectedContact, 'w-10 h-10 text-sm')}
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    {selectedContact.name[lang]}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedContact.phone} · {selectedContact.role[lang]}
                  </p>
                </div>
              </div>

              {/* Verified Banking Name Banner */}
              <div
                className={`px-4 py-2 text-xs flex items-center gap-2 border-b ${
                  selectedContact.isSuspicious
                    ? 'bg-rose-50 text-rose-900 border-rose-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                {selectedContact.isSuspicious ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="font-medium truncate">
                  {selectedContact.isSuspicious
                    ? `Unverified Caller: ${selectedContact.bankingName}`
                    : `✔ ${t.verifiedBankingName}: ${selectedContact.bankingName}`}
                </span>
              </div>

              {/* Chat Bubbles List */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                {selectedContact.history.map((bubble) => {
                  if (bubble.isScamRequest) {
                    return (
                      <div
                        key={bubble.id}
                        className="self-start max-w-[88%] bg-white rounded-2xl p-4 border-2 border-rose-300 shadow-xs animate-pop-in"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                            Incoming Collect Request
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {bubble.timestamp}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 font-mono-tabular">
                          ₹{bubble.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-700 mt-1 leading-snug">
                          {bubble.note}
                        </p>

                        {bubble.status === 'scam_blocked' ? (
                          <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Scam Collect Request Declined Safely!</span>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredAmount(String(bubble.amount));
                                setIsScamFlow(true);
                                setPinDigits('');
                                setCurrentScreen('pin');
                              }}
                              className="flex-1 py-2 px-3 rounded-full bg-[#1a73e8] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                            >
                              Pay ₹{bubble.amount.toLocaleString('en-IN')}
                            </button>
                            <button
                              type="button"
                              onClick={handleDeclineScamRequest}
                              className="flex-1 py-2 px-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold cursor-pointer"
                            >
                              Decline Scam
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isSent = bubble.type === 'sent';
                  return (
                    <div
                      key={bubble.id}
                      className={`max-w-[80%] rounded-2xl p-3.5 shadow-2xs border bg-white text-slate-900 border-slate-200 ${
                        isSent ? 'self-end' : 'self-start'
                      }`}
                    >
                      <p className="text-xl font-bold font-mono-tabular">
                        ₹{bubble.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs mt-0.5 text-slate-600">
                        {bubble.note}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isSent ? 'Paid' : 'Received'} · {bubble.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Chat Action Bar: [Pay] and [Request] */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEnteredAmount(
                      selectedContact.id === 'electricity'
                        ? '640'
                        : selectedContact.id === 'vikram'
                        ? '2000'
                        : '500'
                    );
                    setPaymentNote('');
                    setIsScamFlow(selectedContact.id === 'vikram');
                    setCurrentScreen('amount');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  {t.payBtn}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerToast(
                      'Note: "Request" asks a friend to pay you. They enter THEIR PIN, never you!'
                    )
                  }
                  className="py-2.5 px-5 rounded-full bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#1a73e8] font-semibold text-sm transition-colors cursor-pointer"
                >
                  {t.requestBtn}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 3: AMOUNT ENTRY SCREEN
             ========================================================= */}
          {currentScreen === 'amount' && (
            <div className="flex-1 flex flex-col bg-white p-4 justify-between animate-screen-enter">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('chat')}
                    aria-label="Back to chat"
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-8" />
                </div>

                {/* Recipient Avatar & Verified Banking Name Shield */}
                <div className="flex flex-col items-center text-center">
                  {renderAvatar(selectedContact, 'w-16 h-16 text-xl mb-2.5')}
                  <h2 className="text-base font-bold text-slate-900">
                    Paying {selectedContact.name[lang]}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedContact.upiId}
                  </p>

                  <div
                    className={`mt-2 px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${
                      selectedContact.isSuspicious
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {selectedContact.isSuspicious ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>
                      ✔ {t.verifiedBankingName}: {selectedContact.bankingName}
                    </span>
                  </div>
                </div>

                {/* Large ₹0 Input Display */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-800">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      aria-label="Payment Amount in Rupees"
                      value={enteredAmount}
                      onChange={(e) => setEnteredAmount(e.target.value)}
                      placeholder="0"
                      className="w-48 text-center text-5xl font-bold text-slate-900 font-mono-tabular focus:outline-none border-b border-slate-200 focus:border-[#1a73e8] pb-1 bg-transparent"
                    />
                  </div>

                  {/* Quick Amount Presets */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    {['100', '500', '640', '2000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEnteredAmount(preset)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                          enteredAmount === preset
                            ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ₹{Number(preset).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  {/* Scenario 1 Simulation Button: Slip and type ₹5,000 */}
                  {(activeMission === 'extra_zero' ||
                    selectedContact.id === 'ramesh') && (
                    <button
                      type="button"
                      onClick={() => {
                        setEnteredAmount('5000');
                        setActiveMission('extra_zero');
                        triggerToast(
                          'Oops! You slipped and typed ₹5,000 instead of ₹500!'
                        );
                      }}
                      className="mt-3 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{t.extraZeroSimBtn}</span>
                    </button>
                  )}

                  {/* Note Input Pill */}
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder={t.addNotePlaceholder}
                    aria-label={t.addNotePlaceholder}
                    className="mt-4 w-48 px-4 py-2 rounded-full bg-[#f1f3f4] text-center text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1a73e8]"
                  />
                </div>
              </div>

              {/* Proceed to Pay Primary CTA */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 px-1">
                  <span>State Bank of India •••• 4021</span>
                  <span className="font-mono-tabular font-semibold text-slate-700">
                    ₹{balance.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = Number(enteredAmount) || 0;
                    if (amt <= 0) {
                      playAlertBuzz();
                      triggerToast('Please enter an amount greater than ₹0');
                      return;
                    }
                    setPinDigits('');
                    setIsBalanceCheckPin(false);
                    setCurrentScreen('pin');
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {t.proceedToPay}{' '}
                    {enteredAmount
                      ? `₹${Number(enteredAmount).toLocaleString('en-IN')}`
                      : ''}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 4: THE STARK NPCI / UPI PIN SCREEN
             ========================================================= */}
          {currentScreen === 'pin' && (
            <div className="flex-1 flex flex-col bg-white justify-between select-none animate-screen-enter">
              <div>
                {/* Rigid Dark-Blue NPCI System Header */}
                <div className="bg-[#142d4c] text-white px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-sky-200">
                      {t.npciBankHeader}
                    </p>
                    <p className="text-xs text-slate-200 font-mono-tabular">
                      XXXX-4021
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold tracking-widest">
                    UPI
                  </div>
                </div>

                {/* Expandable Payee & Amount Bar */}
                {!isBalanceCheckPin && (
                  <div
                    className={`px-4 py-2.5 border-b transition-colors ${
                      Number(enteredAmount) === 5000 &&
                      activeMission === 'extra_zero'
                        ? 'bg-amber-100 border-amber-300'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setNpciDetailsExpanded(!npciDetailsExpanded)
                      }
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <div>
                        <p className="text-[10px] text-slate-600 font-semibold uppercase">
                          {t.npciSendingTo}:
                        </p>
                        <p className="text-xs font-bold text-slate-900">
                          {selectedContact.bankingName}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-1.5">
                        <div>
                          <p className="text-[10px] text-slate-600 font-semibold uppercase">
                            {t.npciAmount}:
                          </p>
                          <p
                            className={`text-base font-extrabold font-mono-tabular ${
                              Number(enteredAmount) === 5000
                                ? 'text-rose-700 underline decoration-2'
                                : 'text-slate-900'
                            }`}
                          >
                            ₹{Number(enteredAmount || 0).toLocaleString('en-IN')}
                            .00
                          </p>
                        </div>
                        {npciDetailsExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </button>

                    {npciDetailsExpanded && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-300/80 text-[11px] text-slate-700 flex justify-between">
                        <span>Ref ID: {selectedContact.upiId}</span>
                        <span className="font-bold text-rose-700">
                          DEBIT (Money Going OUT)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Extra Zero Alert Highlight on PIN Screen */}
                {!isBalanceCheckPin &&
                  Number(enteredAmount) === 5000 &&
                  selectedContact.id === 'ramesh' && (
                    <div className="mx-4 mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-400 text-amber-950 text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p>{t.extraZeroPinTip}</p>
                    </div>
                  )}

                {/* 4-Digit Masked PIN Entry Display */}
                <div className="py-4 px-4 flex flex-col items-center">
                  <p className="text-xs font-bold text-slate-700 tracking-wider uppercase text-center mb-3">
                    {t.npciEnterPin}
                  </p>

                  <div
                    aria-label="4 digit PIN indicator"
                    className="flex items-center justify-center gap-4 my-1"
                  >
                    {[0, 1, 2, 3].map((idx) => {
                      const filled = pinDigits.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-11 h-11 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                            filled
                              ? 'border-[#142d4c] bg-slate-100 text-[#142d4c] scale-105'
                              : 'border-slate-300 bg-white text-slate-300'
                          }`}
                        >
                          {filled ? '●' : ''}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 max-w-xs px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="leading-snug font-medium">
                      {t.npciCancelSafeTip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stark Numeric Keypad + Cancel / Submit Bar */}
              <div className="bg-slate-100 border-t border-slate-300">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-200/80 border-b border-slate-300 gap-2">
                  <button
                    type="button"
                    onClick={handlePinCancel}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    {t.npciCancelBtn} (₹0 Loss)
                  </button>
                  <span className="text-[11px] font-semibold text-slate-600 truncate">
                    Type any 4 digits
                  </span>
                </div>

                <div className="grid grid-cols-3 divide-x divide-y divide-slate-300 bg-white">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePinKeyPress(num)}
                      className="h-12 text-xl font-bold text-[#142d4c] hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer font-mono-tabular"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handlePinBackspace}
                    aria-label="Backspace"
                    className="h-12 flex items-center justify-center text-[#142d4c] hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePinKeyPress('0')}
                    className="h-12 text-xl font-bold text-[#142d4c] hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer font-mono-tabular"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handlePinSubmit}
                    aria-label={t.npciSubmitBtn}
                    className="h-12 flex items-center justify-center gap-1 bg-[#142d4c] hover:bg-[#1e426e] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.npciSubmitBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 4B: AUTHENTIC BUFFERING EFFECT AFTER PIN ENTRY
             ========================================================= */}
          {currentScreen === 'buffering' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white text-center select-none animate-screen-enter">
              {/* Google Pay Style Dual Rotating Ring around Avatar */}
              <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#1a73e8] border-r-[#1a73e8] animate-spin" />
                <div>
                  {isBalanceCheckPin ? (
                    <div className="w-16 h-16 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                      <Building2 className="w-8 h-8" />
                    </div>
                  ) : (
                    renderAvatar(selectedContact, 'w-16 h-16 text-xl')
                  )}
                </div>
              </div>

              {!isBalanceCheckPin && (
                <p className="text-3xl font-bold text-slate-900 font-mono-tabular mb-1">
                  ₹{Number(enteredAmount || 0).toLocaleString('en-IN')}
                </p>
              )}

              <h2 className="text-base font-bold text-slate-900 mt-1">
                {t.bufferingTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                {bufferingStepText || t.bufferingSub}
              </p>

              {/* Animated 3-dot pulse bar */}
              <div className="flex items-center gap-2 mt-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] animate-buffer-dot-1" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] animate-buffer-dot-2" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] animate-buffer-dot-3" />
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 5: SIMULATED QR SCANNER SCREEN + INTERACTIVE QR TUTORIAL
             ========================================================= */}
          {currentScreen === 'qr' && (
            <div className="flex-1 flex flex-col bg-slate-950 text-white p-4 justify-between animate-screen-enter overflow-y-auto">
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  aria-label="Close QR Scanner"
                  className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 cursor-pointer shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold truncate">
                  {t.scanQr.replace('\n', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (activeMission === 'qr_tutorial') {
                      setActiveMission(null);
                    } else {
                      setActiveMission('qr_tutorial');
                      setQrTutorialStep(0);
                      speakText(
                        QR_TUTORIAL_STEPS[0].sahayakNarration[lang],
                        true
                      );
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                    activeMission === 'qr_tutorial'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {lang === 'hi-IN' ? 'QR ट्यूटोरियल' : 'QR Tutorial'}
                  </span>
                </button>
              </div>

              {/* STEP 1 SPOTLIGHT: Camera Viewfinder Frame */}
              <div className="my-3 flex flex-col items-center">
                <div
                  className={`w-44 h-44 rounded-3xl relative overflow-hidden bg-slate-900/90 flex flex-col items-center justify-center transition-all duration-300 ${
                    activeMission === 'qr_tutorial' &&
                    QR_TUTORIAL_STEPS[qrTutorialStep]?.targetHighlight ===
                      'viewfinder'
                      ? 'border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.45)] scale-105'
                      : 'border-2 border-[#8ab4f8] shadow-lg'
                  }`}
                >
                  <div className="w-full h-1 bg-[#8ab4f8] shadow-[0_0_12px_#8ab4f8] absolute top-0 left-0 animate-scan-laser" />
                  <QrCode className="w-16 h-16 text-slate-500" />
                  <p className="text-[11px] text-slate-300 mt-2 px-3 text-center font-medium">
                    {lang === 'hi-IN'
                      ? 'कैमरा स्कैनर = केवल पैसे देने (Pay) के लिए'
                      : 'Camera Scanner = For Sending Money ONLY'}
                  </p>
                </div>
              </div>

              {/* STEP 2 SPOTLIGHT: "PAY" QR vs "RECEIVE" QR VISUAL COMPARISON CARD */}
              <div
                className={`rounded-2xl p-3 bg-slate-900/95 border transition-all duration-300 mb-3 ${
                  activeMission === 'qr_tutorial' &&
                  QR_TUTORIAL_STEPS[qrTutorialStep]?.targetHighlight ===
                    'pay_vs_receive'
                    ? 'border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]'
                    : 'border-slate-800'
                }`}
              >
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 text-center">
                  {lang === 'hi-IN'
                    ? 'असली अंतर: "Pay" क्यूआर बनाम "Receive" क्यूआर'
                    : 'Golden Rule: "Pay" QR vs "Receive" QR'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-700/60">
                    <p className="font-bold text-blue-300">
                      {lang === 'hi-IN'
                        ? '1. पैसे देने के लिए (Pay)'
                        : '1. To PAY a Shop'}
                    </p>
                    <p className="text-slate-300 mt-1 leading-snug">
                      {lang === 'hi-IN'
                        ? 'दुकान का QR स्कैन करें + 4-अंकों का पिन डालें (पैसे कटेंगे)।'
                        : 'Scan shop’s QR + Enter 4-digit PIN (Money goes OUT).'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-700/60">
                    <p className="font-bold text-emerald-300">
                      {lang === 'hi-IN'
                        ? '2. पैसे लेने के लिए (Receive)'
                        : '2. To RECEIVE Money'}
                    </p>
                    <p className="text-slate-300 mt-1 leading-snug">
                      {lang === 'hi-IN'
                        ? 'कुछ स्कैन न करें! केवल अपना QR दिखाएं + कोई पिन नहीं।'
                        : 'Scan NOTHING! Just show your QR card + ZERO PIN.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* SAHAYAK INTERACTIVE STEP-BY-STEP NARRATION CARD (WHEN QR TUTORIAL ACTIVE) */}
              {activeMission === 'qr_tutorial' && (
                <div className="mb-3 p-3.5 rounded-2xl bg-amber-400/15 border-2 border-amber-400 text-white animate-screen-enter">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {QR_TUTORIAL_STEPS[qrTutorialStep]?.title[lang]}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          QR_TUTORIAL_STEPS[qrTutorialStep]?.sahayakNarration[
                            lang
                          ] || '',
                          true
                        )
                      }
                      className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t.listenStepBtn}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-100 leading-relaxed mt-1">
                    {QR_TUTORIAL_STEPS[qrTutorialStep]?.sahayakNarration[lang]}
                  </p>

                  <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-amber-400/40 text-[11px] font-bold text-amber-200">
                    ★ {QR_TUTORIAL_STEPS[qrTutorialStep]?.keyTakeaway[lang]}
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={qrTutorialStep === 0}
                      onClick={() => {
                        const prev = Math.max(0, qrTutorialStep - 1);
                        setQrTutorialStep(prev);
                        speakText(
                          QR_TUTORIAL_STEPS[prev].sahayakNarration[lang],
                          true
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'hi-IN' ? '‹ पिछला' : '‹ Prev'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {QR_TUTORIAL_STEPS.map((st, idx) => (
                        <button
                          key={st.stepNumber}
                          type="button"
                          aria-label={`Tutorial Step ${st.stepNumber}`}
                          onClick={() => {
                            setQrTutorialStep(idx);
                            speakText(st.sahayakNarration[lang], true);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            qrTutorialStep === idx
                              ? 'w-5 bg-amber-400'
                              : 'w-2 bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    {qrTutorialStep < QR_TUTORIAL_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(
                            QR_TUTORIAL_STEPS.length - 1,
                            qrTutorialStep + 1
                          );
                          setQrTutorialStep(next);
                          speakText(
                            QR_TUTORIAL_STEPS[next].sahayakNarration[lang],
                            true
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        {lang === 'hi-IN' ? 'अगला कदम ›' : 'Next Step ›'}
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-300">
                        {lang === 'hi-IN'
                          ? 'नीचे हरा बटन दबाएं ↓'
                          : 'Tap Green Btn ↓'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 & STEP 4 SPOTLIGHT: SIMULATION ACTION BUTTONS */}
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContactId('ramesh');
                    setEnteredAmount(
                      activeMission === 'scan_qr' ||
                        activeMission === 'qr_tutorial'
                        ? '180'
                        : '250'
                    );
                    setPaymentNote('Scanned Shop QR');
                    setIsScamFlow(false);
                    playSuccessChime();
                    setCurrentScreen('amount');
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                    activeMission === 'qr_tutorial' &&
                    QR_TUTORIAL_STEPS[qrTutorialStep]?.targetHighlight ===
                      'valid_qr_btn'
                      ? 'ring-4 ring-amber-400 shadow-[0_0_24px_rgba(16,185,129,0.7)] scale-[1.02]'
                      : ''
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{t.scanValidShopBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedContactId('vikram');
                    setEnteredAmount('2000');
                    setPaymentNote('Cashback Lottery QR Claim');
                    setIsScamFlow(true);
                    playAlertBuzz();
                    setCurrentScreen('amount');
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                    activeMission === 'qr_tutorial' &&
                    QR_TUTORIAL_STEPS[qrTutorialStep]?.targetHighlight ===
                      'scam_qr_btn'
                      ? 'ring-4 ring-amber-400 shadow-[0_0_24px_rgba(244,63,94,0.7)] scale-[1.02]'
                      : ''
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{t.scanScamQrBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 6: PAYMENT PROCESSING / PENDING (MISSION 3)
             ========================================================= */}
          {currentScreen === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-between p-6 bg-amber-50/70 text-center animate-screen-enter">
              <div className="w-full flex justify-end">
                <span className="text-xs font-mono-tabular font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md">
                  Settling in {pendingSecondsLeft}s
                </span>
              </div>

              <div className="flex flex-col items-center max-w-xs">
                <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center mb-4 animate-spin">
                  <Clock className="w-9 h-9 text-amber-700" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {t.pendingTitle}
                </h2>
                <p className="text-3xl font-black text-slate-900 font-mono-tabular mt-2">
                  ₹{Number(enteredAmount || 640).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedContact.name[lang]} ({selectedContact.bankingName})
                </p>
                <p className="text-xs text-amber-900 bg-amber-100 border border-amber-300 rounded-xl p-3 mt-4 leading-relaxed">
                  {t.pendingSub}
                </p>
              </div>

              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playAlertBuzz();
                    setShowPendingInterceptModal(true);
                    speakText(
                      `${t.pendingInterceptTitle}. ${t.pendingInterceptBody}`
                    );
                  }}
                  className="w-full py-3.5 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  {t.temptingRetryBtn}
                </button>
                <p className="text-[11px] text-slate-500">
                  Wait patiently or tap above to see what happens if you retry
                  too soon
                </p>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 7: PAYMENT SUCCESS RECEIPT & REFUND RECOVERY
             ========================================================= */}
          {currentScreen === 'receipt' && activeReceipt && (
            <div className="flex-1 flex flex-col justify-between p-5 bg-white animate-screen-enter">
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-16 h-16 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-md mb-3 animate-pop-in">
                  <Check className="w-9 h-9 stroke-[3]" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1a73e8]">
                  {t.paymentSuccessTitle}
                </p>
                <h2 className="text-4xl font-extrabold text-slate-900 font-mono-tabular mt-1">
                  ₹{activeReceipt.amount.toLocaleString('en-IN')}
                </h2>
                <p className="text-sm font-bold text-slate-800 mt-2">
                  {activeReceipt.contactName[lang]}
                </p>
                <p className="text-xs text-slate-500">
                  ✔ {activeReceipt.bankingName}
                </p>

                {/* Receipt Card Details */}
                <div className="w-full mt-5 p-4 rounded-2xl bg-[#f8f9fa] border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      UPI Transaction ID (UTR):
                    </span>
                    <span className="font-mono-tabular font-bold text-slate-800">
                      {activeReceipt.utr}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid To UPI ID:</span>
                    <span className="font-mono-tabular font-semibold text-slate-800">
                      {activeReceipt.upiId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-700">
                      {activeReceipt.status === 'refunded'
                        ? `Refunded ₹${activeReceipt.refundedAmount?.toLocaleString('en-IN')}`
                        : 'Completed'}
                    </span>
                  </div>
                </div>

                {/* MISSION 1 RECOVERY B: Sent ₹5,000 Instead of ₹500 */}
                {activeReceipt.amount === 5000 &&
                  activeReceipt.contactId === 'ramesh' && (
                    <div className="w-full mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-left">
                      <p className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{t.extraZeroRecoveryTitle}</span>
                      </p>
                      <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                        {t.extraZeroRecoveryBody}
                      </p>

                      {activeReceipt.status === 'refunded' ? (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{t.refundSuccessToast}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleRaiseDisputeRefund(
                              activeReceipt.id,
                              activeReceipt.amount
                            )
                          }
                          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                        >
                          {t.raiseDisputeBtn}
                        </button>
                      )}
                    </div>
                  )}
              </div>

              <div className="pt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('history')}
                  className="flex-1 py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
                >
                  {t.txHistory}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  className="flex-1 py-3 px-4 rounded-full bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  {t.doneBtn}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 8: TRANSACTION HISTORY & DISPUTE CENTER
             ========================================================= */}
          {currentScreen === 'history' && (
            <div className="flex-1 flex flex-col bg-white p-4 animate-screen-enter">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-3">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  aria-label="Back to Home"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base font-bold text-slate-900">
                  {t.txHistory}
                </h2>
              </div>

              <div className="flex flex-col divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {tx.contactName[lang]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tx.timestamp} · UTR: {tx.utr}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{tx.note}</p>
                      {tx.amount === 5000 && tx.status !== 'refunded' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRaiseDisputeRefund(tx.id, tx.amount)
                          }
                          className="mt-2 px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold cursor-pointer"
                        >
                          {t.raiseDisputeBtn}
                        </button>
                      )}
                      {tx.status === 'refunded' && (
                        <p className="mt-1 text-xs font-bold text-emerald-700">
                          ✔ Refunded ₹{tx.refundedAmount?.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900 font-mono-tabular">
                        -₹{tx.amount.toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReceipt(tx);
                          setCurrentScreen('receipt');
                        }}
                        className="text-[11px] font-semibold text-[#1a73e8] hover:underline mt-1 cursor-pointer"
                      >
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              SCREEN 9: CHECK BANK BALANCE
             ========================================================= */}
          {currentScreen === 'balance' && (
            <div className="flex-1 flex flex-col justify-between p-5 bg-white animate-screen-enter">
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('home')}
                    aria-label="Back to Home"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-slate-900">
                    {t.checkBalance}
                  </h2>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-slate-200 text-slate-900 shadow-2xs">
                  <p className="text-xs text-slate-500 font-semibold">
                    State Bank of India · Savings A/C •••• 4021
                  </p>
                  <p className="text-xs text-slate-500 mt-4">
                    Available Balance
                  </p>
                  <p className="text-4xl font-extrabold font-mono-tabular mt-1 text-slate-900">
                    {balanceUnlocked
                      ? `₹${balance.toLocaleString('en-IN')}.00`
                      : '₹••,•••'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentScreen('home')}
                className="w-full py-3.5 rounded-full bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold text-sm cursor-pointer"
              >
                {t.doneBtn}
              </button>
            </div>
          )}
        </main>

        {/* =========================================================
            PERSISTENT FLOATING "ASK SAHAYAK" AI HELPER BUTTON
           ========================================================= */}
        <button
          type="button"
          onClick={() => setIsSahayakOpen(true)}
          className={`fixed sm:absolute z-30 px-3.5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs shadow-lg flex items-center gap-1.5 border border-white/90 cursor-pointer active:scale-95 transition-transform ${
            currentScreen === 'pin'
              ? 'bottom-[200px] right-3'
              : 'bottom-4 right-4'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{t.askSahayakBtn}</span>
        </button>

        {/* =========================================================
            DRAWER: 3 SAFE-TO-FAIL PRACTICE SCENARIOS SHEET
           ========================================================= */}
        {showMissionsDrawer && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.missionsHeading}
            className="absolute inset-0 z-40 bg-slate-950/50 backdrop-blur-2xs flex flex-col justify-end"
          >
            <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.missionsHeading}
                  </h3>
                  <p className="text-xs text-slate-500">{t.missionsSub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMissionsDrawer(false)}
                  aria-label="Close scenarios drawer"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 pt-1 max-h-[65vh] overflow-y-auto pr-1">
                {PRACTICE_MISSIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => startMission(m.id)}
                    className="w-full text-left p-3.5 rounded-2xl bg-[#f8f9fa] hover:bg-[#e8f0fe]/60 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider block">
                        {m.badge[lang]}
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        {m.title[lang]}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {m.subtitle[lang]}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#1a73e8] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MODAL A: SAFE FAILURE SHIELD (MISSION 2 SCAM INTERCEPT)
           ========================================================= */}
        {showSafeFailureModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.safeFailureTitle}
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border-2 border-rose-500 animate-pop-in">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {t.safeFailureTitle}
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                {t.safeFailureBody}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold leading-snug">
                {t.safeFailureRule}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleDeclineScamRequest}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {t.tryAgainDeclineBtn}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      `${t.safeFailureTitle}. ${t.safeFailureRule}`,
                      true
                    )
                  }
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t.replayAudioBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MODAL B: PENDING RETRY INTERCEPT MODAL (MISSION 3)
           ========================================================= */}
        {showPendingInterceptModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.pendingInterceptTitle}
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border-2 border-amber-500 animate-pop-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {t.pendingInterceptTitle}
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                {t.pendingInterceptBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPendingInterceptModal(false);
                  completePaymentReceipt(Number(enteredAmount) || 640);
                }}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-[#1a73e8] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Got It — Wait & View Confirmed Receipt
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            MODAL C: PAY PHONE NUMBER DIALOG
           ========================================================= */}
        {showPhoneModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.payPhone}
            className="absolute inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-xl animate-pop-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {t.payPhone.replace('\n', ' ')}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(false)}
                  aria-label="Close phone modal"
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Enter a mobile number or UPI ID (e.g. +91 98201 44120):
              </p>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="9820144120"
                aria-label="10 digit phone number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono-tabular mb-3"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPhoneModal(false);
                  setSelectedContactId('ramesh');
                  setEnteredAmount(
                    activeMission === 'pay_phone' ? '250' : '500'
                  );
                  setPaymentNote('Phone Number Payment');
                  setIsScamFlow(false);
                  setCurrentScreen('amount');
                }}
                className="w-full py-2.5 rounded-full bg-[#1a73e8] text-white font-semibold text-xs cursor-pointer"
              >
                Verify & Proceed to Pay
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            SLIDE-UP SAHAYAK VOICE AI COACH + SCAM SHIELD DRAWER
           ========================================================= */}
        {isSahayakOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.sahayakTitle}
            className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end"
          >
            <div className="bg-white rounded-t-3xl max-h-[86%] flex flex-col shadow-2xl border-t border-slate-200 overflow-hidden animate-slide-up">
              {/* Drawer Header */}
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">
                      {t.sahayakTitle}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      {t.sahayakSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCoachSettings(!showCoachSettings)}
                    aria-label="Sahayak Coach Settings"
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSahayakOpen(false)}
                    aria-label="Close Sahayak Drawer"
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Discreet Settings Panel */}
              {showCoachSettings && (
                <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">
                      Gemini 2.5 Flash + Offline Vernacular Engine
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Screen: {currentScreen.toUpperCase()} · Language: {lang}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSpeakEnabled}
                      onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                    />
                    <span>Auto-Voice</span>
                  </label>
                </div>
              )}

              {/* Mode Switch Tabs: Voice Coach vs Scam Shield */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setSahayakTab('coach')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    sahayakTab === 'coach'
                      ? 'bg-white text-[#1a73e8] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎙️ {t.tabCoach}
                </button>
                <button
                  type="button"
                  onClick={() => setSahayakTab('scam')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    sahayakTab === 'scam'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛡️ {t.tabScamShield}
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                {sahayakTab === 'coach' ? (
                  <>
                    {/* Screen-Aware Quick Doubt Chips */}
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Quick Doubts for This Screen ({currentScreen}):
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {getScreenQuickDoubts(currentScreen, lang).map(
                          (doubt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => askSahayakQuestion(doubt)}
                              className="text-left px-3 py-2 rounded-xl bg-[#e8f0fe]/70 hover:bg-[#d3e3fd] border border-blue-200 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              “{doubt}”
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Sahayak AI Explanation Card + Voice Output Controls */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                          Sahayak ({lang === 'hi-IN' ? 'हिन्दी' : 'English'})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => speakText(coachAnswer, true)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.replayAudioBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMuted(!isMuted);
                              if (
                                typeof window !== 'undefined' &&
                                'speechSynthesis' in window
                              ) {
                                window.speechSynthesis.cancel();
                              }
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>{isMuted ? 'Unmute' : t.muteAudioBtn}</span>
                          </button>
                        </div>
                      </div>

                      {coachQuestion && (
                        <p className="text-xs text-slate-400 italic">
                          Q: “{coachQuestion}”
                        </p>
                      )}

                      <p className="text-xs leading-relaxed text-slate-100 font-medium">
                        {isCoachLoading
                          ? 'Sahayak is thinking...'
                          : coachAnswer}
                      </p>
                    </div>

                    {/* Microphone Button + Text Input */}
                    <div className="space-y-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleStartVoiceInput}
                        className={`w-full py-3 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                          isListening
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span>{t.micListening}</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span>{t.micPrompt}</span>
                          </>
                        )}
                      </button>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          askSahayakQuestion(coachQuestion);
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={coachQuestion}
                          onChange={(e) => setCoachQuestion(e.target.value)}
                          placeholder={t.typeMessagePlaceholder}
                          aria-label={t.typeMessagePlaceholder}
                          className="flex-1 px-3.5 py-2.5 rounded-full border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1a73e8]"
                        />
                        <button
                          type="submit"
                          aria-label="Send question to Sahayak"
                          className="p-2.5 rounded-full bg-[#1a73e8] hover:bg-blue-700 text-white cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  /* TAB 2: MULTIMODAL SCAM SHIELD */
                  <div className="space-y-3.5">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Tap a Sample Suspicious SMS / WhatsApp to Inspect:
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {SCAM_SAMPLES.map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleAnalyzeScamSample(sample.id)}
                            className={`text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                              selectedScamSampleId === sample.id &&
                              !uploadedImagePreview
                                ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{sample.title[lang]}</span>
                              <span className="text-[10px] font-semibold text-rose-700">
                                {sample.channel}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t.uploadScreenshotBtn}</span>
                      </button>
                    </div>

                    {uploadedImagePreview && (
                      <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3">
                        <img
                          src={uploadedImagePreview}
                          alt="Uploaded screenshot preview"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          Screenshot analyzed by Multimodal Scam Shield
                        </span>
                      </div>
                    )}

                    {scamAnalysisResult && (
                      <div
                        className={`p-3.5 rounded-2xl border-2 space-y-2 ${
                          scamAnalysisResult.verdict === 'DANGER_SCAM'
                            ? 'bg-rose-50 border-rose-400 text-rose-950'
                            : 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-extrabold flex items-center gap-1.5">
                            <FileWarning className="w-4 h-4 shrink-0" />
                            <span>
                              {isScamAnalyzing
                                ? 'Analyzing message...'
                                : scamAnalysisResult.verdictLabel}
                            </span>
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              speakText(
                                `${scamAnalysisResult.verdictLabel}. ${scamAnalysisResult.explanation}`,
                                true
                              )
                            }
                            aria-label="Listen to scam explanation"
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs leading-relaxed">
                          {scamAnalysisResult.explanation}
                        </p>

                        <ul className="space-y-1 pt-1">
                          {scamAnalysisResult.redFlags.map((flag, i) => (
                            <li
                              key={i}
                              className="text-[11px] font-semibold flex items-start gap-1.5"
                            >
                              <span>•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
