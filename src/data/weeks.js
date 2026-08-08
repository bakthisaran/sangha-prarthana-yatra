export const WEEKS = [
  {
    id: "week1",
    number: 1,
    stanzaRange: "1 – 2",
    title: "Invocation to Bhoomi Mata & the Supreme",
    unlocked: true,
    questions: [
      {
        type: "mcq",
        prompt: 'Fill in the blank: "Sarvamangala mangalyam devim sarvartha ___"',
        options: ["sadhikam", "prakashakam", "paripurtaye", "samanvitah"],
        correct: 0,
      },
      {
        type: "mcq",
        prompt: 'Who is addressed as "Bhoomi Mataram" in the first stanza?',
        options: ["The Sun deity", "Mother Earth", "The Supreme Being", "A river goddess"],
        correct: 1,
      },
      {
        type: "mcq",
        prompt: 'Fill in the blank: "Saranyam sarva-bhutanam ___ bhoomi mataram"',
        options: ["namami", "namamo", "namostu", "dehi"],
        correct: 1,
      },
      {
        type: "mcq",
        prompt: '"Saccidananda rupaya" describes the Paramatma as having the nature of:',
        options: [
          "Wealth, power and fame",
          "Existence, Consciousness and Bliss",
          "Fire, water and air",
          "Knowledge, wisdom and courage",
        ],
        correct: 1,
      },
      {
        type: "mcq",
        prompt: 'Fill in the blank: "Vishvadharmaika mulaya namostu ___"',
        options: ["bhoomi mataram", "paramatmane", "loka pujitam", "suvira vratam"],
        correct: 1,
      },
    ],
    matchPairs: [
      { id: "bhoomi", emoji: "🌍", word: "Bhoomi Mataram", hint: "Mother Earth" },
      { id: "sat", emoji: "🌅", word: "Saccidananda", hint: "Existence · Consciousness · Bliss" },
      { id: "param", emoji: "ॐ", word: "Paramatmane", hint: "The Supreme Self" },
      { id: "vishva", emoji: "🪷", word: "Vishvamangala", hint: "Universal auspiciousness" },
    ],
  },
  { id: "week2", number: 2, stanzaRange: "3 – 4", title: "Our Vow to Build Universal Dharma", unlocked: false },
  { id: "week3", number: 3, stanzaRange: "5 – 6", title: "Steadfast in the Work of the Sangh", unlocked: false },
  { id: "week4", number: 4, stanzaRange: "7 – 8", title: "Sacrifice, Service and Ultimate Glory", unlocked: false },
];
