import { getLocalDate, AppConstants, StorageUtils, Utils, showMessage } from "./";
import { api } from "../api";
import { fetchApiData, sendRequest } from '../apicall'
import { getProfile } from './fetcher';
import _ from 'lodash'
import { skipUpdateFields, isSkipable, fieldsString } from './vars'

// let _fieldsString = "firstName,lastName,jobTitle,shiftStartTime,shiftEndTime,email";
// _fieldsString += ",profileDescription,address,phone,height,weight,heightInFeet,heightInInches,dateOfBirth"; //imagePath
// _fieldsString += ",heightUnit,weightUnit,temperatureUnit,agentEmail,state,gender,country,bloodSugarUnit"; //roleName, clockUnit
// _fieldsString += ",isFamilyDetailShared,isAllergyShared,isDailyIterationShared,isGeofenceShared,isMedicationShared,isAssessmentShared,careHomeOffice";
// _fieldsString += ",ProfileImagePath,ProfileImage";
// _fieldsString += ",companyId,branchId,agentId";
// _fieldsString += ",getPackageModuleResponse,dataRefreshRate";
// _fieldsString += ",patientId,medicareNumber,medicaidNumber";
// const skipUpdateFields = "getPackageModuleResponse";

// skip_fieldsArray = skipUpdateFields.indexOf(",") > -1 ? skipUpdateFields.split(",") : [skipUpdateFields];
// const isSkipable = (fieldName) => {
//     const _skip_fieldsArray = skipUpdateFields.indexOf(",") > -1 ? skipUpdateFields.split(",") : [skipUpdateFields];
//     return _skip_fieldsArray.find(o => o == fieldName);
// }

// export const fieldsString = _fieldsString;

class Updater {

    updateProfile = async (props) => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)

        let fatelError = null;
        if (!token) fatelError = "Missing token";
        if (!props || !props.input) fatelError = "Missing profile update fields";
        if (fatelError) {
            showMessage(fatelError, 'long');
            return false;
        }

        let __profile = await getProfile();// this.getProfileData();
        console.log("__profile: ", __profile);
        if (!__profile || __profile.error) {
            showMessage(__profile.error || "Unable to update!!", "long")
            return { error: __profile.error || "Unable to update!" };
        }

        const _profile = __profile.data;
        const input = props.input;

        // console.log("input: ", input);


        const formData = new FormData();
        let fieldsArray = fieldsString.split(",");

        for (let a = 0; a < fieldsArray.length; a++) {
            if (!isSkipable(fieldsArray[a])) {
                if (input[fieldsArray[a]] !== undefined && input[fieldsArray[a]] != null) formData.append(fieldsArray[a], input[fieldsArray[a]]);
                else if (_profile[fieldsArray[a]] !== undefined && _profile[fieldsArray[a]] != null) formData.append(fieldsArray[a], _profile[fieldsArray[a]]);
            }
        }

        // console.log("formData: ", formData);


        var isSuccess = false;
        var error = false;

        await sendRequest({
            uri: api.profile,
            method: "put",
            multipart: true,
            body: formData,
            debug: true
        })
            .then((json) => {
                if (!json) return { error: "Invalid response" };

                if (json && json.errors) {
                    console.log("json.errors: ", json.errors);
                    isSuccess = false;
                    error = "Error in updating profile!!! ";
                    error += json.errors.AgentEmail
                        ? `: ${json.errors.AgentEmail}`
                        : (json.errors[0] ? ` : ${json.errors[0].description}` : "");

                    return;
                }
                if (json) {
                    console.log("json: ", json);
                    isSuccess = true;
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                isSuccess = false;
                error = error;
            })


        if (isSuccess && props.updateLocal) await this.refetchLocalProfile();

        if (error) {
            showMessage(_.isString(error) ? error : "Request error", 'long');
            return _.isString(error) ? { error } : { error: "Request Error" };
        }

        return isSuccess;

    }

    __updateProfile = async (props) => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)

        let fatelError = null;
        if (!token) fatelError = "Missing token";
        if (!props || !props.input) fatelError = "Missing profile update fields";
        if (fatelError) {
            showMessage(fatelError, 'long');
            return false;
        }

        let __profile = await getProfile();// this.getProfileData();
        console.log("__profile: ", __profile);
        if (!__profile || __profile.error) {
            showMessage(__profile.error || "Unable to update!!", "long")
            return { error: __profile.error || "Unable to update!" };
        }

        const _profile = __profile.data;
        const input = props.input;

        const formData = new FormData();
        let fieldsArray = fieldsString.split(",");
        for (let a = 0; a < fieldsArray.length; a++) {
            // if (props[fieldsArray[a]]!==undefined || _profile[fieldsArray[a]]) formData.append(fieldsArray[a], props[fieldsArray[a]] || _profile[fieldsArray[a]]);
            // if (props[fieldsArray[a]]!==undefined || _profile[fieldsArray[a]]) formData.append(fieldsArray[a], props[fieldsArray[a]] || _profile[fieldsArray[a]]);
            if (input[fieldsArray[a]] !== undefined && input[fieldsArray[a]] != null) formData.append(fieldsArray[a], input[fieldsArray[a]]);
            else if (_profile[fieldsArray[a]] !== undefined && _profile[fieldsArray[a]] != null) formData.append(fieldsArray[a], _profile[fieldsArray[a]]);
        }
        // console.log("_profile: ", _profile);
        // console.log("formData: ", formData);
        // console.log("api.profile: ", api.profile);
        // console.log("token: ", token);

        var isSuccess = false;
        var error = false;

        await fetch(api.profile, {
            method: "put",
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token
            },
            body: formData
        })
            .then((response) => {
                console.log('Profile update response: ', response)
                if (!response.ok && response.status === 413) {
                    isSuccess = false;
                    throw Error("File size too large!");
                } else if (!response.ok && response.status > 400 && response.status <= 500) {
                    throw Error(`Unexpected Error : ${response.status}!`);
                }
                else {
                    isSuccess = true;
                    return response.json();
                }
            })
            .then((json) => {
                // this.setState({ spinner: false })
                if (json.errors) {
                    console.log("json.errors: ", json.errors);
                    isSuccess = false;
                    error = "Error in updating profile!!! ";
                    error += json.errors.AgentEmail
                        ? `: ${json.errors.AgentEmail}`
                        : (json.errors[0] ? ` : ${json.errors[0].description}` : "");

                    return;
                }
                if (json) {
                    console.log("json: ", json);
                    isSuccess = true;
                    // if (props.updateLocal) updateLocalProfile(json);
                    // StorageUtils.storeInStorage(AppConstants.SP.FIRST_NAME, json.firstName);
                    // StorageUtils.storeInStorage(AppConstants.SP.LAST_NAME, json.lastName);
                    // StorageUtils.storeInStorage(AppConstants.SP.PHONE, json.phone);
                }
                // this.goBackToProfileScreen()
            })
            .catch((error) => {
                console.log("error: ", error);
                isSuccess = false;
                // this.setState({ spinner: false });
                error = error;
                // setTimeout(
                //     function () {
                //         error
                //         // Snackbar.show({ text: "" + error, duration: Snackbar.LENGTH_LONG, });
                //     }.bind(this),
                //     200
                // )
            })


        if (isSuccess && props.updateLocal) await this.refetchLocalProfile();

        if (error) showMessage(error, 'long')
        return error ? { error } : isSuccess;

    }

    refetchLocalProfile = async (args) => {
        console.log("refetchLocalProfile()", args)

        let profileData = await getProfile(args);// this.getProfileData(args);
        await updateLocalProfile({ ...args, ...profileData.data });
        return { ...args, ...profileData.data, role: profileData.data.roleName };
    }

    fetchProfileLogin = async (args) => {
        console.log("refetchLocalProfile()", args)
        var pushy_token = await StorageUtils.getValue('pushy_token');
        var loginBody = JSON.stringify({ loginName: args.email, password: args.password, deviceToken: pushy_token, });
        let profile = await getProfile(args);
        let profileData;
        await fetch(api.login, { method: "post", headers: { Accept: "application/json", "Content-Type": "application/json", }, body: loginBody, })
            .then((response) => { return response.json(); })
            .catch((error) => { this.showError(); })
            .then(async (data) => {
                profileData = data
                await updateLocalProfile({ ...args, ...profileData,...profile.data });

            })
        return { ...args, ...profileData,...profile.data, role: profileData.role };
    }

}
export default new Updater();

export const clearLocalProfile = async () => {
    // console.log("clearLocalProfile()");

    await StorageUtils.removeAll()

    // let promiseArray = [];

    // for (let a in AppConstants.SP){
    //     promiseArray.push(new Promise((resolve, reject) => {
    //         StorageUtils.remove(AppConstants.SP[a])
    //             .then(r => { resolve('yes'); })
    //             .catch(err => { reject('no'); });
    //     }))
    // }
    // promiseArray.push(new Promise((resolve, reject) => {
    //     StorageUtils.remove('user_modules')
    //         .then(r => { resolve('yes'); })
    //         .catch(err => { reject('no'); });
    // }))

    // await Promise.all(promiseArray).then(r => {
    //     // console.log("result: ", r);
    // });
    return;
}

export const updateLocalProfile = (json) => {
    console.log("updateLocalProfile(): ", json)
    for (let a in json) {
        StorageUtils.storeInStorage(a, `${json[a]}`);
    }

    if (json.getPackageModuleResponse && json.getPackageModuleResponse.getModuleDetail) {
        let modules = json.getPackageModuleResponse.getModuleDetail.map(itm => (itm.moduleTag));
        StorageUtils.storeInStorage('user_modules', `${modules.toString()}`);
    }


    if (json.getPackageModuleResponse) StorageUtils.storeInStorage('getPackageModuleResponse', `${JSON.stringify(json.getPackageModuleResponse)}`);

    if (json.userId) StorageUtils.storeInStorage(AppConstants.SP.USER_ID, `${json.userId}`);
    if (json.dateOfBirth) StorageUtils.storeInStorage(AppConstants.SP.DATE_OF_BIRTH, `${json.dateOfBirth}`);
    if (json.firstName) StorageUtils.storeInStorage(AppConstants.SP.FIRST_NAME, `${json.firstName}`);
    if (json.lastName) StorageUtils.storeInStorage(AppConstants.SP.LAST_NAME, `${json.lastName}`);
    if (json.firstName || json.lastName) StorageUtils.storeInStorage(AppConstants.SP.FULL_NAME, `${json.firstName} ${json.lastName}`);
    if (json.country) StorageUtils.storeInStorage(AppConstants.SP.COUNTRY, `${json.country}`);
    if (json.email) StorageUtils.storeInStorage(AppConstants.SP.EMAIL, `${json.email}`);
    if (json.phone) StorageUtils.storeInStorage(AppConstants.SP.PHONE, `${json.phone}`);
    if (json.applicationType) StorageUtils.storeInStorage(AppConstants.SP.APP_TYPE, `${json.applicationType}`);
    // if (json.ProfileImagePath) StorageUtils.storeInStorage(AppConstants.SP.PROFILE_IMAGE, json.ProfileImagePath);
    if (json.ProfileImage) StorageUtils.storeInStorage(AppConstants.SP.PROFILE_IMAGE, `${json.ProfileImage}`);
    if (json.accessToken) StorageUtils.storeInStorage(AppConstants.SP.ACCESS_TOKEN, `${json.accessToken}`);
    if (json.refreshToken) StorageUtils.storeInStorage(AppConstants.SP.REFRESH_TOKEN, `${json.refreshToken}`);
    if (json.expiresIn) StorageUtils.storeInStorage(AppConstants.SP.EXPIRES_IN, `${json.expiresIn}`);
    if (json.dataRefreshRate) StorageUtils.storeInStorage(AppConstants.SP.DATA_REFRESH_RATE, `${json.dataRefreshRate}`);
    if (json.roleName || json.role) {
        let role = null;
        if (!role && json.roleName && json.roleName != undefined && json.roleName != 'undefined') role = json.roleName;
        if (!role && json.role && json.role != undefined && json.role != 'undefined') role = json.role;

        if (role) StorageUtils.storeInStorage(AppConstants.SP.ROLE, role);
    }
    // if (json.roleName || json.role) StorageUtils.storeInStorage(AppConstants.SP.ROLE, ((json.roleName && json.roleName != undefined) ? json.roleName : (json.role || null)));
    // if (json.role || json.roleName) StorageUtils.storeInStorage(AppConstants.SP.ROLE, json.role || json.roleName);
    if (json.caregiverName) StorageUtils.storeInStorage(AppConstants.SP.CAREGIVER_NAME, `${json.caregiverName || ""}`);
    if (json.caregiverPhone) StorageUtils.storeInStorage(AppConstants.SP.CAREGIVER_PHONE, `${json.caregiverPhone || ""}`);

    if (json.isLoggedIn) StorageUtils.storeInStorage(AppConstants.SP.IS_LOGGED_IN, "1");
    if (json.isLoggedIn === false) StorageUtils.storeInStorage(AppConstants.SP.IS_LOGGED_IN, "0");

    if (json.showCart) StorageUtils.storeInStorage(AppConstants.SP.SHOW_CHART, "1");
    if (json.showCart === false) StorageUtils.storeInStorage(AppConstants.SP.SHOW_CHART, "");

    // CompanyId, BranchId, AgentId
    if (json.companyId) StorageUtils.storeInStorage(AppConstants.SP.COMPANY_ID, `${json.companyId}`);
    if (json.branchId) StorageUtils.storeInStorage(AppConstants.SP.BRANCH_ID, `${json.branchId}`);
    if (json.agentId) StorageUtils.storeInStorage(AppConstants.SP.AGENT_ID, `${json.agentId}`);
}


export const getModules = async () => {
    const user_modules = await StorageUtils.getValue('user_modules');
    return user_modules;
}

export const checkModule = async (moduleName, _user_modules) => {
    const user_modules = _user_modules || await getModules();
    if (!user_modules) return false;

    return user_modules.indexOf(moduleName) < 0 ? false : true;
}


