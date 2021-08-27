export const heartRate = {
    heartRate: [
        {
            minValue: 40,
            maxValue: 70,
            bgColor: '#FCAF8F',
            thumbColor: '#000000',
            title: 'Lower Boundary',
            unit: 'bpm',
            isDecimalUnit: false,
            sliderStep: 1
        },
        {
            minValue: 70,
            maxValue: 150,
            bgColor: '#FCAF8F',
            thumbColor: '#000000',
            title: 'Upper Boundary',
            unit: 'bpm',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    hrv: [
        {
            minValue: 0,
            maxValue: 100,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Lower Boundary',
            unit: 'ms',
            isDecimalUnit: false,
            sliderStep: 1
        },
        {
            minValue: 100,
            maxValue: 300,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Upper Boundary',
            unit: 'ms',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    bodyTemp: [
        {
            minValue: 34,
            maxValue: 37,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Lower Boundary',
            unit: '°C',
            isDecimalUnit: true,
            sliderStep: 0.5
        },
        {
            minValue: 37,
            maxValue: 41,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Upper Boundary',
            unit: '°C',
            isDecimalUnit: true,
            sliderStep: 0.5
        }
    ],
    bloodSaturation: [
        {
            minValue: 85,
            maxValue: 98,
            bgColor: '#D2D4FF',
            thumbColor: '#D2D4FF',
            title: 'Lower Boundary', // 'Minimum O2 Saturation Level:',
            unit: '%',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    bpSystolic: [
        {
            minValue: 70,
            maxValue: 120,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Lower Boundary',
            unit: 'mmHg',
            isDecimalUnit: false,
            sliderStep: 1
        },
        {
            minValue: 120,
            maxValue: 180,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Upper Boundary',
            unit: 'mmHg',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    bpDaistolic: [
        {
            minValue: 40,
            maxValue: 70,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Lower Boundary',
            unit: 'mmHg',
            isDecimalUnit: false,
            sliderStep: 1
        },
        {
            minValue: 70,
            maxValue: 110,
            bgColor: '#EB5757',
            thumbColor: '#EB5757',
            title: 'Upper Boundary',
            unit: 'mmHg',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    bloodGlucose: [
        {
            minValue: 3,
            maxValue: 5,
            bgColor: '#EDF12A',
            thumbColor: '#EDF12A',
            title: 'Lower Boundary',
            unit: 'mmol/L',
            isDecimalUnit: true,
            sliderStep: 0.1
        },
        {
            minValue: 6,
            maxValue: 9,
            bgColor: '#EDF12A',
            thumbColor: '#EDF12A',
            title: 'Upper Boundary',
            unit: 'mmol/L',
            isDecimalUnit: true,
            sliderStep: 0.1
        }
    ],
    sleep: [
        {
            minValue: 0,
            maxValue: 8,
            bgColor: '#131555',
            thumbColor: '#131555',
            title: 'Lower Boundary',
            unit: 'hours',
            isDecimalUnit: false,
            sliderStep: 1
        },
        {
            minValue: 8,
            maxValue: 12,
            bgColor: '#131555',
            thumbColor: '#131555',
            title: 'Upper Boundary',
            unit: 'hours',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    weight: [
        {
            minValue: 0,
            maxValue: 200,
            bgColor: '#4478FF',
            thumbColor: '#4478FF',
            title: 'Lower Boundary',
            unit: 'kg',
            isDecimalUnit: true,
            sliderStep: 0.5
        },
        {
            minValue: 0,
            maxValue: 200,
            bgColor: '#4478FF',
            thumbColor: '#4478FF',
            title: 'Upper Boundary',
            unit: 'kg',
            isDecimalUnit: true,
            sliderStep: 0.5
        }
    ],    
    stepCount: [
        {
            minValue: 0,
            maxValue: 8000,
            bgColor: '#7444C0',
            thumbColor: '#7444C0',
            title: 'Lower Boundary', // 'Minimum Daily Steps',
            unit: 'steps',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
    fall: [
        {
            minValue: 0,
            maxValue: 1,
            bgColor: '#D2D4FF',
            thumbColor: '#D2D4FF',
            title: 'Boundary', //'Minimum number of Falls',
            unit: 'Fall',//'falls',
            isDecimalUnit: false,
            sliderStep: 1
        }
    ],
  }