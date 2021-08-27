import { API_URL } from "./apiURL";

const baseURL = `${API_URL}/api/`;

export const api = {
  login: baseURL + "Accounts/Login",
  confirmPasswordForRegistration: baseURL + "Accounts/ConfirmEmail",
  geofence: baseURL + "Seniors/GeoFence",
  seniors: baseURL + "Seniors/My",
  seniorLocations: baseURL + "Locations/",
  profile: baseURL + "Accounts/Profile/Profile",
  alerts: baseURL + "Alerts",
  marksAsReadAlert: baseURL + "Alerts/Acknowledge/All/UnRead/{userId}",
  baseURL: baseURL,
  logout: baseURL + "Accounts/Logout",
  signUp: baseURL + "Accounts/Account",
  addSenior: baseURL + "Seniors/Add",
  removeSeniorUrl: baseURL + "CareGivers/",
  addTask: baseURL + "SeniorCaregiverTask",
  getTasks: baseURL + "SeniorCaregiverTask/My",
  updateTaskStatus: baseURL + "SeniorCaregiverTask/Status",
  assignTasks: baseURL + "SeniorCaregiverTask/Assigned/Tasks?userTypeEnum={2}",
  forgotPassword: `${baseURL}Accounts/ForgotPassword`,
  resetPassword: `${baseURL}Accounts/ResetPassword`,
  ChangePassword: baseURL + "Accounts/ChangePassword",
  activityScore: baseURL + "Seniors/Stats/ActivityScore/LastWeek",
  riskScore: baseURL + "Seniors/Stats/Covid/RiskScore/LastWeek",
  riskScoreAverage: baseURL + "Seniors/Stats/Covid/RiskScore/LastDayAverage",
  healthStats: baseURL + "Seniors/Stats/HealthStats",
  invites: baseURL + "Invites",
  deletePatient: baseURL + "CareGivers/",
  noGoAreas: baseURL + "Seniors/NoGoArea/",
  geofenceNew: baseURL + "Seniors/Geofence",
  caregivers: baseURL + "CareGivers/My",
  invitesCaregiver: baseURL + "Invites/Caregiver/Invite",
  invitesSenior: baseURL + "Invites/Senior/Invite",
  caregiverDetail: baseURL + "CareGivers/Detail",
  caregiverPriority: baseURL + "CareGivers/Priority",
  isWatchPaired: baseURL + "Locations/IsWatchPaired",
  lastLocation: baseURL + "Locations/Senior/LastLocation",
  version: baseURL + "ApplicationSettings/Version",
  covidStats: baseURL + "Seniors/Stats/CovidStats",
  addBodyTemperature: baseURL + "Seniors/BodyTemperature/Add",
  addPulseOximeter: baseURL + "Seniors/PulseOximeter/Add",
  addBloodPressure: baseURL + "Seniors/BloodPressure/Add",
  addGlucoseMeter: baseURL + "Seniors/GlucoseMeter/Add",
  addBMIScale: baseURL + "UserDeviceReading/DeviceReadings",
  healthStats: baseURL + "Seniors/Stats/HealthStats",
  fdaStatsTemperatureToday: baseURL + "SeniorFDAStats/BodyTemperature/Today/",
  fdaStatesBloodPressure: baseURL + "SeniorFDAStats/BloodPressure/Today/",
  fdaTemperatureNumberOfDays:
    baseURL + "SeniorFDAStats/BodyTemperature/LastDays/",
  statsBloodPressureNumberOfDays:
    baseURL + "SeniorFDAStats/BloodPressure/LastDays/",
  statsOximeterNumberOfDays: baseURL + "SeniorFDAStats/PulseOximeter/LastDays/",
  statsOximeterToday: baseURL + "SeniorFDAStats/PulseOximeter/Today/",
  statsGlucometerToday: baseURL + "SeniorFDAStats/GlucoseMeter/Today/",
  statsGlucometerNumberOfDays:
    baseURL + "SeniorFDAStats/GlucoseMeter/LastDays/",
  statScoreBodyTemperature: baseURL + "Stats/dayAvg/temprature",
  statScoreBloodPressure: baseURL + "Stats/dayAvg/BMPPulseRate",
  statScorePulseOximeter: baseURL + "Stats/dayAvg/oxygen",
  statScoreGlucoseMeter: baseURL + "Stats/dayAvg/BloodSugar",
  lastRiskScore: baseURL + "Seniors/Stats/Covid/RiskScore/Last",
  lastHeartRate: baseURL + "Seniors/HeartRate/LastScore",
  patientDiary: baseURL + "Notes",
  addScreeningScore: baseURL + "Seniors/SeniorHRv",
  healthStatsLastCaptured: baseURL + 'Stats/lastCaptured/',
  setPatientActivity: baseURL + 'PatientActivityLimits/UserLimits',
  healthStatsDayAvg: baseURL + "Stats/dayAvg/",
  healthStatsLastCaptured: baseURL + 'Stats/lastCaptured/',
  healthStatsDayValues: baseURL + "Stats/day/",
  privacyPolicy: baseURL + "PrivacyPolicies/Check/{userId}",
  accecptPrivacyPolicy: baseURL + "PrivacyPolicies",
  pairedDevices: baseURL + "Devices/Connected/BySenior/{userId}",
  allDevices: baseURL + "Devices/{type}",
  callSchedule: baseURL + "MeetingRoom/Add",
  getCallScheduleList: baseURL + 'MeetingRoom/Get/ByAll',
  optionTabsApi: baseURL + 'Devices/',
  getRegistertedSeniors: baseURL + 'MeetingRoom/Get/Registered/Seniors',
  deleteScheduleCall : baseURL + 'MeetingRoom/Remove',
  updateScheduleCall : baseURL + 'MeetingRoom/Update',
 
};

export const GET_MEDICATION = `${baseURL}SeniorMedicalDetails/Medication/{seniorId}`;
export const UPDATE_MEDICATION = `${baseURL}SeniorMedicalDetails/Senior/MedicationInformation/{Id}`;
export const ADD_MEDICATION = `${baseURL}SeniorMedicalDetails/Senior/Medication/Add`;

export const GET_ALLERGIES = `${baseURL}SeniorMedicalDetails/Allergy/{seniorId}`;
export const UPDATE_ALLERGIES = `${baseURL}SeniorMedicalDetails/Senior/AllergyInformation/{Id}`;
export const ADD_ALLERGIES = `${baseURL}SeniorMedicalDetails/Senior/Allergy/Add`;

export const GET_CARE_CIRCLE = `${baseURL}SeniorMedicalDetails/FamilyDetail/{seniorId}`;
export const UPDATE_CARE_CIRCLE = `${baseURL}SeniorMedicalDetails/Senior/FamilyDetail/{Id}`;
export const ADD_CARE_CIRCLE = `${baseURL}SeniorMedicalDetails/Senior/FamilyDetail/Add`;

export const GET_ASSESMENT = `${baseURL}SeniorMedicalDetails/Assessment/{seniorId}`;
export const UPDATE_ASSESMENT = `${baseURL}SeniorMedicalDetails/Senior/Assessment/{Id}`;
export const ADD_ASSESMENT = `${baseURL}SeniorMedicalDetails/Senior/Assessment/Add`;

export const ADD_RISK_ASSESMENT = `${baseURL}Seniors/RiskAssessment/add`;

export const GET_COMPANIES = `${baseURL}Company/ByAll`;

export const GET_BRANCHES_AND_AGENTS = (companyId, appType) => (`${baseURL}Company/Branches/Agents/${companyId}/${appType}`);

export const GET_PATIENT_OVERVIEW = (caregiverId) => (`${baseURL}PatientActivityLimits/GetPatientOverview/${caregiverId}`);

export const GET_RISK_ASSESSMENT_LASTDATE = (seniorId) => (`${baseURL}Seniors/RiskAssessment/LastTest/${seniorId}`);

export const CREATE_CONNECTY_USER = `${baseURL}Accounts/Update/Caller_Id`;

export const CALL_START = (seniorId, callType) => (`${baseURL}PatientSession/Start/${seniorId}/${callType=='video' ? 'VCall' : 'ACall'}`);
export const CALL_END = (seniorId) => (`${baseURL}PatientSession/Stop/${seniorId}`);
export const NOTES_TIMER = (seniorId) => (`${baseURL}PatientSession/Start/${seniorId}/Notes`);
export const CALL_INITIATOR_ID = (CallerID) => (`${baseURL}Accounts/Profile/ByCallerId/${CallerID}`);

