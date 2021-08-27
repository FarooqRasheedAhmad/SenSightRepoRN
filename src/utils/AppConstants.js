export const AppConstants = {
  SP: {
    USER_ID: "user_id",
    FIRST_NAME: "FIRST_NAME",
    LAST_NAME: "LAST_NAME",
    FULL_NAME: "FULL_NAME",
    EMAIL: "EMAIL",
    PHONE: "PHONE",
    DATE_OF_BIRTH: "DATE_OF_BIRTH",
    PROFILE_IMAGE: "PROFILE_IMAGE",
    ACCESS_TOKEN: "ACCESS_TOKEN",
    REFRESH_TOKEN: "refresh_token",
    EXPIRES_IN: "expires_in",
    ROLE: "role",
    IS_LOGGED_IN: "is_logged_in",
    DEVICE_TOKEN: "fcmToken",
    CAREGIVER_NAME: "CAREGIVER_NAME",
    CAREGIVER_PHONE: "CAREGIVER_PHONE",
    APP_TYPE: "app_type",
    SHOW_CHART: "show_chart",
    DEFAULT_TEMP_UNIT: "temp_default_unit",
    DEFAULT_GLUCOSE_UNIT: "bp_default_unit",
    DEFAULT_WEIGHT_UNIT: 'weight_unit',
    COUNTRY: 'country',
    COMPANY_ID: 'companyId',
    BRANCH_ID: 'branchId',
    AGENT_ID: 'agentId',
    DATA_REFRESH_RATE: 'DATA_REFRESH_RATE'
  },
}

export const AppWidgets = {
  ACTIVITY_SCORE: 'activity_score',
  ACTIVITY_SCORE_CAREGIVER: 'activity_score_caregiver',
  RISK_SCORE: 'risk_score',
  RISK_SCORE_CAREGIVER: 'risk_score_caregiver',
  INFECTION_RISK: 'infection_risk',
  STATICS: 'statistics',
  LOCATION: 'location',
  LOCATION_CAREGIVER: 'location_caregiver',
  PATIENT_DIARY: 'patient_diary',
  PATIENT_DIARY_CAREGIVER: 'patient_diary_caregiver',
  CHAT: 'chat',
  TASKS: 'tasks',
  SOCIAL: 'social',
  CARE_CIRCLE: 'care_circle',
  MEDIACATION: 'medication',
  ALLERGIES: 'allergies',
  ASSESSMENT_RESULT: 'assessment_aesult',
  RIDE_REQUEST: 'ride_request',
  RIDE_REQUEST_CAREGIVER: 'ride_request_caregiver',
  CAREGIVER_STATICS: 'caregiver_statistics',
  VEYETALS: 'Veyetals',
}



export const HEALTHDATA_WIDGETS = [
  {
    title: 'Heart Rate',
    widgetName: 'hdw-heart-rate', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my heart rate',
  },
  {
    title: 'HR Variability',
    widgetName: 'hdw-hr-variability', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my HR Variability',
  },
  {
    title: 'Blood Pressure',
    widgetName: 'hdw-blood-pressure', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Blood Pressure',
  },
  {
    title: 'Blood Glucose',
    widgetName: 'hdw-blood-glucose', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Blood Glucose',
  },
  {
    title: 'Body Temperature',
    widgetName: 'hdw-body-temperature', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Body Temperature',
  },
  {
    title: 'Oxygen Satuartion',
    widgetName: 'hdw-oxygen-satuartion', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Oxygen Satuartion',
  },
  {
    title: 'Step Count',
    widgetName: 'hdw-step-count', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Step Count',
  },
  {
    title: 'Sleep',
    widgetName: 'hdw-sleep', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Sleep',
  },
  {
    title: 'Weight',
    widgetName: 'hdw-weight', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Weight',
  },
  {
    title: 'Fall',
    widgetName: 'hdw-fall', //AppWidgets.ACTIVITY_SCORE,
    description: 'Monitor my Fall',
  },
].map(o => ({ ...o, category: "Health Data" }))
