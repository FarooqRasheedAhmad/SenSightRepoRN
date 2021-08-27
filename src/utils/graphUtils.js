export const deviceSettings = {
  heartRate: {
    id: 1,
    heading: "DAILY AVERAGE",
    unit: "bpm",
    bgGradient: ["#FC575E", "#F7B42C"],
    headerBgColor: "#FC575E",
    type: "heart-rate",
  },
  stepsCount: {
    id: 2,
    heading: "DAILY TOTAL",
    unit: "steps",
    bgGradient: ["#5F0A87", "#A4508B"],
    headerBgColor: "#5F0A87",
    type: "step-count",
  },
  temperature: {
    id: 3,
    heading: "DAILY AVERAGE",
    unit: "bpm",
    bgGradient: ["#E30E0E", "#994040"],
    headerBgColor: "#C42323",
    type: "heart-rate",
  },
  bloodPressure: {
    id: 4,
    heading: "DAILY AVERAGE",
    unit: "bpm",
    bgGradient: ["#007AFF", "#0151A8"],
    headerBgColor: "#0466cf",
    type: "heart-rate",
  },
  pulseOximeter: {
    id: 5,
    heading: "DAILY AVERAGE",
    unit: "bpm",
    bgGradient: ["#007AFF", "#0151A8"],
    headerBgColor: "#0466cf",
    type: "heart-rate",
  },
};

export const measurmentValues = {
  heartRate: [
    {
      name: "Heart Rate",
      value: "",
      bgGradient: ["#FC575E", "#F7B42C"],
      headerBgColor: "#FC575E",
      icon: "stats_heart_rate",
      unit: "bpm",
    },
  ],
  stepCount: [
    {
      name: "Step Count",
      value: "",
      bgGradient: ["#5F0A87", "#A4508B"],
      headerBgColor: "#5F0A87",
      icon: "stats_step_count",
      unit: "steps",
    },
  ],
  temp: [
    {
      name: "C",
      value: "temperatureInCelsius",
      bgGradient: ["#E30E0E", "#994040"],
      headerBgColor: "#C42323",
      icon: "stats_temp_icon",
      unit: "C˚",
    },
    {
      name: "F",
      value: "temperatureInFahrenheit",
      bgGradient: ["#E30E0E", "#994040"],
      headerBgColor: "#C42323",
      icon: "stats_temp_icon",
      unit: "F˚",
    },
  ],
  bpm: [
    {
      name: "Pulse Rate",
      value: "bmpPulseRate",
      bgGradient: ["#E702DD", "#DD61D8"],
      headerBgColor: "#E702DD",
      icon: "stats_bp_icon",
      unit: "per min",
    },
    {
      name: "Systolic",
      value: "systolic",
      bgGradient: ["#E702DD", "#DD61D8"],
      headerBgColor: "#E702DD",
      icon: "stats_bp_icon",
      unit: "mmHg",
    },
    {
      name: "Diastolic",
      value: "diastolic",
      bgGradient: ["#E702DD", "#DD61D8"],
      headerBgColor: "#E702DD",
      icon: "stats_bp_icon",
      unit: "mmHg",
    },
  ],
  oximeter: [
    /* {
      name: "Pulse Rate",
      value: "pulseRate",
      bgGradient: ["#47CA5D", "#1CA556"],
      headerBgColor: "#47CA5D",
      icon: "stats_pulse_rate",
      unit: "per min",
    }, */
    {
      name: "SPo2",
      value: "oxigenLevel",
      bgGradient: ["#47CA5D", "#1CA556"],
      headerBgColor: "#47CA5D",
      icon: "stats_oximeter_icon",
      unit: "%",
    },
    {
      name: "PI",
      value: "pi",
      bgGradient: ["#47CA5D", "#1CA556"],
      headerBgColor: "#47CA5D",
      icon: "stats_pi",
      unit: "%",
    },
  ],
  glucometer: [
    {
      name: "Blood Glucose",
      value: "glucoseValue",
      bgGradient: ["#FFBA53", "#FF9900"],
      headerBgColor: "#FF9900",
      icon: "stats_glucose_icon",
      unit: "XXmmol/L",
    },
  ],
};

/* export const mockData = [
  {
    avgHeartRate: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 01 2020",
    uploadDate: "2020-06-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24,
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 85,
    lastStatDate: "June 02 2020",
    uploadDate: "2020-06-02T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 87,
    lastStatDate: "June 03 2020",
    uploadDate: "2020-06-03T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "June 04 2020",
    uploadDate: "2020-06-04T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 92,
    lastStatDate: "June 05 2020",
    uploadDate: "2020-06-05T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 95,
    lastStatDate: "June 06 2020",
    uploadDate: "2020-06-06T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 98,
    lastStatDate: "June 07 2020",
    uploadDate: "2020-06-07T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 100,
    lastStatDate: "June 08 2020",
    uploadDate: "2020-06-08T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 102,
    lastStatDate: "June 09 2020",
    uploadDate: "2020-06-13T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 10 2020",
    uploadDate: "2020-06-10T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 11 2020",
    uploadDate: "2020-06-11T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "June 12 2020",
    uploadDate: "2020-06-12T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 70,
    lastStatDate: "June 13 2020",
    uploadDate: "2020-06-13T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 13 2020",
    uploadDate: "2020-06-13T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 14 2020",
    uploadDate: "2020-06-14T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "June 15 2020",
    uploadDate: "2020-06-15T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 97,
    lastStatDate: "June 16 2020",
    uploadDate: "2020-06-16T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 17 2020",
    uploadDate: "2020-06-17T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 102,
    lastStatDate: "June 18 2020",
    uploadDate: "2020-06-18T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 100,
    lastStatDate: "June 19 2020",
    uploadDate: "2020-06-19T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 20 2020",
    uploadDate: "2020-06-20T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 21 2020",
    uploadDate: "2020-06-21T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 22 2020",
    uploadDate: "2020-06-22T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 78,
    lastStatDate: "June 23 2020",
    uploadDate: "2020-06-23T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 80,
    lastStatDate: "June 24 2020",
    uploadDate: "2020-06-24T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 88,
    lastStatDate: "June 25 2020",
    uploadDate: "2020-06-25T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 86,
    lastStatDate: "June 26 2020",
    uploadDate: "2020-06-26T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 87,
    lastStatDate: "June 27 2020",
    uploadDate: "2020-06-27T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 95,
    lastStatDate: "June 28 2020",
    uploadDate: "2020-06-28T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 98,
    lastStatDate: "June 29 2020",
    uploadDate: "2020-06-29T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "June 30 2020",
    uploadDate: "2020-06-30T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 01 2020",
    uploadDate: "2020-07-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 01 2020",
    uploadDate: "2020-07-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 01 2020",
    uploadDate: "2020-07-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 01 2020",
    uploadDate: "2020-07-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 02 2020",
    uploadDate: "2020-07-02T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 03 2020",
    uploadDate: "2020-07-03T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 04 2020",
    uploadDate: "2020-07-04T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 05 2020",
    uploadDate: "2020-07-05T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 06 2020",
    uploadDate: "2020-07-06T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 07 2020",
    uploadDate: "2020-07-07T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 08 2020",
    uploadDate: "2020-07-08T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 09 2020",
    uploadDate: "2020-07-09T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 10 2020",
    uploadDate: "2020-07-10T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 11 2020",
    uploadDate: "2020-07-11T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 12 2020",
    uploadDate: "2020-07-12T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 13 2020",
    uploadDate: "2020-07-13T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 14 2020",
    uploadDate: "2020-07-14T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 15 2020",
    uploadDate: "2020-07-15T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 16 2020",
    uploadDate: "2020-07-16T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 17 2020",
    uploadDate: "2020-07-17T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 17 2020",
    uploadDate: "2020-07-17T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 18 2020",
    uploadDate: "2020-07-18T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 19 2020",
    uploadDate: "2020-07-19T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 20 2020",
    uploadDate: "2020-07-20T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 21 2020",
    uploadDate: "2020-07-21T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 22 2020",
    uploadDate: "2020-07-22T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 23 2020",
    uploadDate: "2020-07-23T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 24 2020",
    uploadDate: "2020-07-24T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 25 2020",
    uploadDate: "2020-07-25T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 26 2020",
    uploadDate: "2020-07-26T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 27 2020",
    uploadDate: "2020-07-27T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 28 2020",
    uploadDate: "2020-07-28T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 29 2020",
    uploadDate: "2020-07-29T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 30 2020",
    uploadDate: "2020-07-30T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "July 31 2020",
    uploadDate: "2020-07-31T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 01 2020",
    uploadDate: "2020-08-01T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 02 2020",
    uploadDate: "2020-08-02T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 03 2020",
    uploadDate: "2020-08-03T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 04 2020",
    uploadDate: "2020-08-04T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 05 2020",
    uploadDate: "2020-08-05T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 06 2020",
    uploadDate: "2020-08-06T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 07 2020",
    uploadDate: "2020-08-07T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 08 2020",
    uploadDate: "2020-08-08T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 09 2020",
    uploadDate: "2020-08-09T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 10 2020",
    uploadDate: "2020-08-10T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 11 2020",
    uploadDate: "2020-08-11T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 12 2020",
    uploadDate: "2020-08-12T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 13 2020",
    uploadDate: "2020-08-13T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 14 2020",
    uploadDate: "2020-08-14T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 15 2020",
    uploadDate: "2020-08-15T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 16 2020",
    uploadDate: "2020-08-16T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 17 2020",
    uploadDate: "2020-08-17T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 18 2020",
    uploadDate: "2020-08-18T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 19 2020",
    uploadDate: "2020-08-19T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 20 2020",
    uploadDate: "2020-08-20T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 21 2020",
    uploadDate: "2020-08-21T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 22 2020",
    uploadDate: "2020-08-22T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 23 2020",
    uploadDate: "2020-08-23T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 24 2020",
    uploadDate: "2020-08-24T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 25 2020",
    uploadDate: "2020-08-25T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 26 2020",
    uploadDate: "2020-08-26T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 27 2020",
    uploadDate: "2020-08-27T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 28 2020",
    uploadDate: "2020-08-28T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 29 2020",
    uploadDate: "2020-08-29T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 30 2020",
    uploadDate: "2020-08-30T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  },
  {
    avgtemperatureInCelsius: 0,
    dayOfWeek: "Saturday",
    temperatureInCelsius: 90,
    lastStatDate: "Auguest 31 2020",
    uploadDate: "2020-08-31T07:39:56.490564",
    stepCount: 1013,
    weekOfYear: 24
  }
] */
