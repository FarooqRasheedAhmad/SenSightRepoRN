export const assesmentJson = [
    {
      question:
        "How are you feeling today?",
    answers: [
      {
        value: "Great, I feel in pretty good health",
        isSelected: false
      },
      {
        value: "Not Great, I could feel better",
        isSelected: false
      }
    ],
    },
    {
      question:
        "Are you experiencing any of the following symptoms? (Click all that apply)",
      answers: [
        {
          value: "Typical flu or cold symptoms (Chils, Fever, Vomiting, Sore Throat, Nasal Congestion, Cough, Headache, Fatigue, Loss of Appetite, Muscle Aches)",
          isSelected: false
        },
        { value: "Unusual shortness of breath", isSelected: false },
        { value: "Pain while swallowing", isSelected: false },
        { value: "Muscle or joint ache", isSelected: false },
        { value: "Loss of sense of smell or taste", isSelected: false },
        { value: "Conjunctivitis (pink eye)", isSelected: false },
        {
          value: "None of the above",
          isSelected: false,
        }
      ],
    },
    {
      question:
        "Within the past 14 days have you",
      answers: [
        { value: "Had close contact* with someone who is confirmed as having COVID-19", isSelected: false },
        { value: "Travelled outside Canada", isSelected: false },
        {
          value: "None of the above",
          isSelected: false,
        }
      ],
    }
]
