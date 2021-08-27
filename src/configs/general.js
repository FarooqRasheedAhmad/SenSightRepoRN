import _ from "lodash";
import { images } from "../assets";
import { theme } from "../theme";

const WEIGHT = 'weight';
const OXYGEN = 'oxygen';
const BLOOD_SUGAR = 'blood-sugar';
const BP_DIS = 'blood-pressure-dis';
const BP_SYS = 'blood-pressure-sys';
const FALLS = 'falls';
const SLEEP = 'sleep';
const BODY_TEMP = 'body-temp';
const HEART_RATE = 'heart-rate';
const HEART_RV = 'heart-rate-variation';
const STEP_COUNT = 'stepe-count';

export const countryArray = [
    { label: 'Canada', value: 'Canada' },
    { label: 'USA', value: 'USA' },
    { label: 'Other', value: 'Other'}
]

export const heightFeetsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => ({ label: `${item} feet`, value: item }))
export const heightInchesArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(item => ({ label: `${item} inches`, value: item }))

export const outgoingDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[z]'; // new Date.toJSON() => ISO-8601 = YYYY-MM-DDTHH:mm:ss.sssZ


export const priorityArray = [
    { label: "Low", value: "1" },
    { label: "Medium", value: "2" },
    { label: "High", value: "3" },
];

export const genderArray = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
]

export const careHomeOfficeAray = [
    {
        label: "Branch 1",
        value: "1",
        color: theme.colors.grey_shade_1,
    },
    {
        label: "Branch 2",
        value: "2",
        color: theme.colors.grey_shade_1,
    },
    {
        label: "Branch 3",
        value: "3",
        color: theme.colors.grey_shade_1,
    },
]

export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


export const unitListProps = (key) => {
    if (!key) {
        alert('Missing Unit Key!')
        return false;
    }

    const _props = {
        weight:{
            db_unit_field: "weightUnit",
            db_value_field: "weight"
        },
        body_temperature:{
            db_unit_field: "temperatureUnit",
        },
        blood_glucose:{
            db_unit_field: "bloodSugarUnit",
        },
        height:{
            db_unit_field: "heightUnit",
            db_value_field: "height"
        },
    }

    return _props[key];
}

export const unitList = {
    weight: [
        { 
            value: 1, name: 'kg', formula: (val, unit=false) => {
                // console.log(`${val}, ${unit}`);
                if (unit && unit == 'lbs') return _.round(val / 2.205, 2)
                return val;
            }
        },
        {
            value: 2, name: 'lbs', formula: (kg_val) => {
                if (kg_val < 1) return kg_val;
                return _.round(kg_val * 2.205, 2);
            }
        },
    ],
    body_temperature: [
        { value: 1, name: 'C', formula: (c_val) => (c_val) },
        {
            value: 2, name: 'F', formula: (c_val) => {
                if (c_val < 1) return c_val;
                return _.round(((c_val * 1.8) + 32), 1);
            }
        },
    ],
    blood_glucose: [
        { value: 1, name: 'mmol/L', formula: (mmol_val) => (mmol_val) },
        {
            value: 2, name: 'mg/dL', formula: (mmol_val) => {
               // if (mmol_val < 1) return mmol_val;
                return _.round((mmol_val * 18), 1);
            }
        },
    ],
    height: [
        { value: 1, name: 'cm', formula: (feet_val) => (feet_val) },
        { value: 2, name: 'feet', formula: (feet_val) => (feet_val) },
    ]
}

export const alertList = [
    {
        infoType: HEART_RATE,
        title: 'Heart Rate',
        icon: 'stats_heart_rate',
        id: 'heartRate',
        activityName: "HeartRate"
    },
    {
        infoType: STEP_COUNT,
        title: 'Step Count',
        icon: 'stats_step_count',
        id: 'stepCount',
        activityName: "StepCount"
    },
    {
        infoType: HEART_RV,
        title: 'HR Variability',
        icon: 'stats_hrv',
        id: 'hrv',
        activityName: "HRV"
    },
    {
        infoType: BODY_TEMP,
        title: 'Body Temperature',
        icon: 'stats_temp_icon',
        id: 'bodyTemp',
        activityName: "BodyTemperature"
    },
    {
        infoType: SLEEP,
        title: 'Sleep',
        icon: 'stats_last_night',
        id: 'sleep',
        activityName: "Sleep"
    },
    {
        infoType: FALLS,
        title: 'Fall Detection',
        icon: 'stats_temp_icon',
        id: 'fall',
        activityName: "Falls"
    },
    {
        infoType: BP_SYS,
        title: 'Blood Pressure Systolic',
        icon: 'stats_bp_icon',
        id: 'bpSystolic',
        activityName: "BPSystolic"
    },
    {
        infoType: BP_DIS,
        title: 'Blood Pressure Diastolic',
        icon: 'stats_bp_icon',
        id: 'bpDaistolic',
        activityName: "BPDiastolic"
    },
    {
        infoType: BLOOD_SUGAR,
        title: 'Blood Glucose',
        icon: 'stats_glucose_icon',
        id: 'bloodGlucose',
        activityName: "BloodGlucose"
    },
    {
        infoType: OXYGEN,
        title: 'Oxygen Saturation',
        icon: 'stats_oximeter_icon',
        id: 'bloodSaturation',
        activityName: "SpO2"
    },
    {
        infoType: WEIGHT,
        title: 'Weight',
        icon: 'stats_weight',
        id: 'weight',
        activityName: "BMIWeight"
    }
]



export const demoDeviceData = {
    id: "0C:AE:7D:A5:AC:C9",
    isConnectable: null,
    localName: "BPM_01",
    manufacturerData: "QkjJrKV9rgw=",
    mtu: 23,
    name: "BPM_01",
    overflowServiceUUIDs: null,
    rssi: -61,
    serviceData: null,
    serviceUUIDs: ["0000180a-0000-1000-8000-00805f9b34fb"],
    solicitedServiceUUIDs: null,
    txPowerLevel: 0,
    // _manager
}

/**** name works as KEY **********/
export const _deviceList = [
    {
        name: "Apple Watch",
        deviceModel: "All Models",
        image: images.apple_watch,
        localName: null,

        connectionType: "manual",
    },
    {
        name: "Samsung Gear",
        deviceModel: "All Models",
        image: images.samsung_gear,
        localName: null,

        connectionType: "manual",
    },
    {
        name: "Polar",
        deviceModel: "Polar H10",
        image: images.polar,
        localName: null,

        connectionType: "manual",
    },
    {
        name: "Fitbit",
        deviceModel: "All Models",
        image: images.fitbit,
        localName: null,
    },
    {
        name: "Home Monitoring",
        deviceModel: "Vayyar Walabot Home",
        image: images.vayyar,
        localName: null,
    },
    // {
    //     name: "SCALES",
    //     deviceModel: "ADF-B883/825",
    //     image: images.biostrap,
    //     localName: null,

    //     connectionType: "manual",
    // },

    {
        name: 'Samico GL',
        UDID: null,
        characteristicsUDID: 'FFF4',
        notifyCharacteristicsUDID: 'FFF4',
        serviceUDID: 'FFF0',
        writeCharacteristicsUDID: 'FFF1',
        localName: 'Blood Glucose',
        deviceModel: 'ADF-B28',
        image: images.blood_glucose,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The Blood Glucose Monitor provides measurements for Blood Glucose Level. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",// 'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    {
        name: 'BPM',
        UDID: null,
        characteristicsUDID: 'FFF4',
        notifyCharacteristicsUDID: null,
        serviceUDID: 'FFF0',
        writeCharacteristicsUDID: null,
        localName: 'Blood Pressure',
        deviceModel: 'ADF-B19',
        image: images.blood_presure,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The Blood Pressure Monitor provides measurements for Blood Pressure (Systolic/Diastolic) and Pulse Rate. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",// 'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    {
        name: 'BPM_01',
        UDID: null,
        characteristicsUDID: 'FFF4',
        notifyCharacteristicsUDID: null,
        serviceUDID: 'FFF0',
        writeCharacteristicsUDID: null,
        localName: 'Blood Pressure',
        deviceModel: 'ADF-B19',
        image: images.blood_presure,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The Blood Pressure Monitor provides measurements for Blood Pressure (Systolic/Diastolic) and Pulse Rate. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",// 'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    {
        name: 'Medical',
        UDID: null,
        characteristicsUDID: 'CDEACB81-5235-4C07-8846-93A37EE6B86D',
        notifyCharacteristicsUDID: 'CDEACB81-5235-4C07-8846-93A37EE6B86D',
        serviceUDID: 'CDEACB80-5235-4C07-8846-93A37EE6B86D',
        writeCharacteristicsUDID: null,
        localName: 'Pulse Oximeter',
        deviceModel: 'ADF-B06',
        image: images.oximeter,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The Pulse Oximeter provides measurements for Blood Oxygen Saturation (SpO2) and Pulse Rate. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",//'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    {
        name: 'TEMP',
        UDID: null,
        characteristicsUDID: '2A1C',
        notifyCharacteristicsUDID: null,
        serviceUDID: '1809',
        writeCharacteristicsUDID: null,
        localName: 'Body Temperature',
        deviceModel: 'ADF-B38A',
        image: images.temperaure,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The non-contact Thermometer provides measurements for Body/Surface Temperature. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",//'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    // {
    //     name: 'SCALES',
    //     UDID: null,
    //     characteristicsUDID: 'FFF4',
    //     notifyCharacteristicsUDID: null,
    //     serviceUDID: 'FFF0',
    //     writeCharacteristicsUDID: null,
    //     localName: 'BMI Scale',
    //     deviceModel: 'ADF-B883/825',
    //     image: images.weight_scale,

    //     connectionType: "bluetooth",
    //     fdaApproved: true,

    //     about: {
    //         deviceDetails: 'The BMI Weighing Scale provides measurements for Body Weight. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
    //         bluetoothEnableMsg: "",//'You must turn bluetooth on to enable connection.',
    //         status: 'Status',
    //     },
    // },
    {
        name: 'Samico Scales',
        UDID: null,
        characteristicsUDID: 'FFF4',
        notifyCharacteristicsUDID: null,
        serviceUDID: 'FFF0',
        writeCharacteristicsUDID: null,
        localName: 'BMI Scale',
        deviceModel: 'ADF-B883/825',
        image: images.weight_scale,

        connectionType: "bluetooth",
        fdaApproved: true,

        about: {
            deviceDetails: 'The BMI Weighing Scale provides measurements for Body Weight. On your mobile phone, please turn Bluetooth connectivity ON to enable the data connection. Once the measurements are recorded on the screen below, please click the SAVE button.',
            bluetoothEnableMsg: "",//'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
    {
        name: "BioStrap",
        UDID: null,
        characteristicsUDID: null,
        notifyCharacteristicsUDID: null,
        serviceUDID: null,
        writeCharacteristicsUDID: null,
        localName: "BioStrap",
        deviceModel: "All Models",
        image: images.biostrap,

        connectionType: "manual",

        about: {
            deviceDetails: 'TBiostrap EVO is a personal health monitor that measures, analyzes and provides personalized actionable insights on Sleep quality, Nocturnal biometrics like heart rate, heart rate variability, oxygen saturation and respiratory rate.',
            bluetoothEnableMsg: "",//'You must turn bluetooth on to enable connection.',
            status: 'Status',
        },
    },
]


export const verifyDevice = (device) => {
    if (!device.id) return false;

    let error = false;
    let fieldString = "id,localName,manufacturerData"
    let fieldArray = fieldString.split(",");

    for (let a in fieldArray) {
        if (!device[fieldArray[a]]) { error = `Missing (${fieldArray[a]}) field : ${device[fieldArray[a]]}`}
    }
    if (error) return { error }

    const fdaInfo = getDevice(device);

    return fdaInfo ? device : false;

}

export const getDevice = (device) =>{
    let fdaInfo = device.name ? _deviceList.find(i => i.name == device.name) : null;
    return fdaInfo;
}

