let _fieldsString = "firstName,lastName,jobTitle,shiftStartTime,shiftEndTime,email";
_fieldsString += ",profileDescription,address,phone,height,weight,heightInFeet,heightInInches,dateOfBirth"; //imagePath
_fieldsString += ",heightUnit,weightUnit,temperatureUnit,agentEmail,state,gender,country,bloodSugarUnit"; //roleName, clockUnit
_fieldsString += ",isFamilyDetailShared,isAllergyShared,isDailyIterationShared,isGeofenceShared,isMedicationShared,isAssessmentShared,careHomeOffice";
_fieldsString += ",ProfileImagePath,ProfileImage";
_fieldsString += ",companyId,branchId,agentId";
_fieldsString += ",getPackageModuleResponse,dataRefreshRate";
_fieldsString += ",patientId,medicareNumber,medicaidNumber";
_fieldsString += ",callerId";

export const fieldsString = _fieldsString;

export const skipUpdateFields = "getPackageModuleResponse,callerId";

export const isSkipable = (fieldName) => {
    const _skip_fieldsArray = skipUpdateFields.indexOf(",") > -1 ? skipUpdateFields.split(",") : [skipUpdateFields];
    return _skip_fieldsArray.find(o => o == fieldName);
}
