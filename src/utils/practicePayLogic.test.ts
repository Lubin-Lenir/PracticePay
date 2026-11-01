import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSLATIONS,
  LANGUAGE_OPTIONS,
  PRACTICE_MISSIONS,
  QR_TUTORIAL_STEPS,
  evaluateTransactionAttempt,
  calculateRefundRecovery,
  getOfflineSahayakReply,
  getScreenQuickDoubts,
  analyzeScamInputOffline,
  getMissionCoachText,
} from './practicePayLogic';

test('supports English (en-IN) and Hindi (hi-IN) locales', () => {
  const codes = LANGUAGE_OPTIONS.map((l) => l.code);
  assert.deepEqual(codes, ['en-IN', 'hi-IN']);
  for (const code of codes) {
    assert.ok(TRANSLATIONS[code].safetyBarText.includes('{balance}'));
    assert.ok(TRANSLATIONS[code].npciBankHeader.length > 0);
  }
});

test('includes all 7 Practice Missions (qr_tutorial, pay_phone, scan_qr, pay_bill, network_drop, extra_zero, collect_scam) with 4 exact steps each', () => {
  const ids = PRACTICE_MISSIONS.map((m) => m.id);
  assert.deepEqual(ids, [
    'qr_tutorial',
    'pay_phone',
    'scan_qr',
    'pay_bill',
    'network_drop',
    'extra_zero',
    'collect_scam',
  ]);
  for (const m of PRACTICE_MISSIONS) {
    assert.equal(m.steps['en-IN'].length, 4);
    assert.equal(m.steps['hi-IN'].length, 4);
  }
  assert.equal(QR_TUTORIAL_STEPS.length, 4);
});

test('Mission (Extra Zero): detects ₹5,000 overpayment to Chandan/Ramesh and calculates ₹4,500 refund', () => {
  const res = evaluateTransactionAttempt({
    amount: 5000,
    balance: 10000,
    pinLength: 4,
    isScamRequest: false,
    activeMission: 'extra_zero',
    contactId: 'ramesh',
  });
  assert.equal(res.outcome, 'SUCCESS_EXTRA_ZERO');
  assert.equal(res.newBalance, 5000);
  assert.equal(res.overpaidAmount, 4500);

  const refund = calculateRefundRecovery({
    currentBalance: res.newBalance,
    originalAmount: 5000,
    intendedAmount: 500,
  });
  assert.equal(refund.refundedAmount, 4500);
  assert.equal(refund.updatedBalance, 9500);
});

test('Mission (Collect Request Scam): intercepts scam PIN entry without deducting balance', () => {
  const res = evaluateTransactionAttempt({
    amount: 2000,
    balance: 10000,
    pinLength: 4,
    isScamRequest: true,
    activeMission: 'collect_scam',
    contactId: 'vikram',
  });
  assert.equal(res.outcome, 'SCAM_INTERCEPTED');
  assert.equal(res.newBalance, 10000);
});

test('Mission (Pay Bill vs Network Drop): pay_bill completes directly while network_drop triggers pending simulation', () => {
  const billRes = evaluateTransactionAttempt({
    amount: 640,
    balance: 10000,
    pinLength: 4,
    isScamRequest: false,
    activeMission: 'pay_bill',
    contactId: 'electricity',
  });
  assert.equal(billRes.outcome, 'SUCCESS_NORMAL');
  assert.equal(billRes.newBalance, 9360);

  const dropRes = evaluateTransactionAttempt({
    amount: 640,
    balance: 10000,
    pinLength: 4,
    isScamRequest: false,
    activeMission: 'network_drop',
    contactId: 'electricity',
  });
  assert.equal(dropRes.outcome, 'NETWORK_PENDING_SIMULATION');
  assert.equal(dropRes.newBalance, 9360);
});

test('Sahayak offline coach returns screen-aware vernacular responses including buffering screen', () => {
  const hiReply = getOfflineSahayakReply({
    question: 'अगर मैं अभी Cancel (कैंसिल) दबाऊं तो क्या पैसे कटेंगे?',
    screen: 'pin',
    activeMission: 'extra_zero',
    enteredAmount: '5000',
    isScamFlow: false,
    lang: 'hi-IN',
  });
  assert.ok(hiReply.includes('₹0'));

  const bufferingDoubts = getScreenQuickDoubts('buffering', 'en-IN');
  assert.equal(bufferingDoubts.length, 3);
});

test('Scam Shield offline analyzer flags fake KYC and Collect scams in Hindi and English', () => {
  const hiResult = analyzeScamInputOffline('kyc_sms', 'hi-IN');
  assert.equal(hiResult.verdict, 'DANGER_SCAM');
  assert.ok(hiResult.redFlags.length >= 2);

  const coachBanner = getMissionCoachText('pay_phone', 'amount', '250', 'en-IN');
  assert.ok(coachBanner && coachBanner.includes('Step 2/4'));
});
