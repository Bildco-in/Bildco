export type Line = { who: "customer" | "agent"; text: string };

export type LanguageSample = {
  id: "telugu" | "hindi" | "english" | "hinglish";
  label: string;
  nativeLabel: string;
  script: "telugu" | "deva" | "latin";
  scenario: string;
  // File name inside public/audio/. Shown only if the file exists.
  audioFile: string;
  lines: Line[];
};

// Written samples in our own words. Illustrative, not real customer calls.
export const languageSamples: LanguageSample[] = [
  {
    id: "telugu",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    script: "telugu",
    scenario: "Clinic appointment",
    audioFile: "telugu.mp3",
    lines: [
      { who: "customer", text: "హలో, రేపు డాక్టర్ గారి appointment దొరుకుతుందా?" },
      { who: "agent", text: "తప్పకుండా! రేపు ఉదయం 10:30 కి లేదా సాయంత్రం 5 గంటలకి ఖాళీ ఉంది. ఏది మీకు సరిపోతుంది?" },
      { who: "customer", text: "ఉదయం 10:30 ఓకే." },
      { who: "agent", text: "బుక్ చేశాను. వివరాలు WhatsApp లో పంపిస్తాను." },
    ],
  },
  {
    id: "hindi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    script: "deva",
    scenario: "Restaurant table booking",
    audioFile: "hindi.mp3",
    lines: [
      { who: "customer", text: "नमस्ते, आज रात चार लोगों के लिए टेबल मिलेगी?" },
      { who: "agent", text: "जी हाँ, मिल जाएगी! आप कितने बजे आना चाहेंगे?" },
      { who: "customer", text: "साढ़े आठ बजे।" },
      { who: "agent", text: "हो गया। आपकी टेबल साढ़े आठ बजे के लिए बुक है। कन्फ़र्मेशन WhatsApp पर भेज रही हूँ।" },
    ],
  },
  {
    id: "english",
    label: "English",
    nativeLabel: "English",
    script: "latin",
    scenario: "Coaching admissions",
    audioFile: "english.mp3",
    lines: [
      { who: "customer", text: "Hi, are admissions still open for the weekend batch?" },
      { who: "agent", text: "Yes, they are. Is this for you or for your child, and which class?" },
      { who: "customer", text: "My son, class 10." },
      { who: "agent", text: "Great. I'll send the fee details on WhatsApp and book a free demo class. Does Saturday work?" },
    ],
  },
  {
    id: "hinglish",
    label: "Hinglish",
    nativeLabel: "Hinglish",
    script: "latin",
    scenario: "Real estate enquiry",
    audioFile: "hinglish.mp3",
    lines: [
      { who: "customer", text: "Hi, 2BHK flats available hain kya? Budget thoda tight hai." },
      { who: "agent", text: "Haan ji, options hain. Aapka budget roughly kitna hai, aur kaunsa area prefer karenge?" },
      { who: "customer", text: "Around 60 lakh, Kondapur side." },
      { who: "agent", text: "Perfect. Is Saturday ko site visit book kar doon? Location WhatsApp pe bhej deti hoon." },
    ],
  },
];
