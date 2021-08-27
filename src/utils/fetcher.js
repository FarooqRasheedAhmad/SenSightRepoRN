import { api } from "../api";
import { fetchApiData } from '../apicall';
import { AppConstants, StorageUtils } from "./";
import _ from "lodash";
// import { fieldsString } from './updater';
import { fieldsString } from './vars'


export const getDeviceList = async (seniorId, selectedTitle, selectedDeviceTag) => {
    console.log("getDeviceList()");

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)

    var fatelError = false;
    if (!selectedTitle) fatelError = "No selectedTitle";
    if (!seniorId) fatelError = "Missing seniorId";
    if (!token) fatelError = "Missing token";
    if (fatelError){
        console.log("ERROR: ", fatelError)
        alert(fatelError);
        return false;
    }

    let apiUrl = `${api.optionTabsApi}Connected/${seniorId}`;
    let serviceUrl = ''
    switch (selectedTitle) {
        case 'Heart Rate':
            serviceUrl = `${apiUrl}/HeartRate`
            break;
        case 'Step Count':
            serviceUrl = `${apiUrl}/StepCounts`
            break;
        case 'HR Variability':
            serviceUrl = `${apiUrl}/HRV`
            break;
        case 'Body Temperature':
            serviceUrl = `${apiUrl}/BodyTemprature`
            break;
        case 'Sleep':
            serviceUrl = `${apiUrl}/Sleep`
            break;
        case 'Falls':
            serviceUrl = `${apiUrl}/Fall`
            break;
        case 'Blood Pressure':
            serviceUrl = `${apiUrl}/BloodPressure`
            break;
        case 'Oxygen Saturation':
            serviceUrl = `${apiUrl}/Oxygen`
            break;
        case 'Blood Glucose':
            serviceUrl = `${apiUrl}/BloodGlucose`
            break;
        case 'Weight':
            serviceUrl = `${apiUrl}/Weight`
            break;
        default:
            serviceUrl = ``
    }
    const deviceApiPayload = { token, serviceUrl, method: 'get' };

    let deviceList = [];
    let defaultSelectedDevice = null;

    const deviceDataResult = await fetchApiData(deviceApiPayload);
    console.log("deviceDataResult: ", deviceDataResult);

    if (!deviceDataResult || deviceDataResult.error || !deviceDataResult.data || deviceDataResult.data.length < 1) {
        console.log("No Devices available: ", deviceDataResult);
    }
    else {
        console.log("Devices found: ", deviceDataResult);

        deviceList = _.orderBy(deviceDataResult.data.map((item, index) => {
            return { label: item.title, value: item.deviceTag }
        }), ['label'], ['asc'])
        deviceList = [{label: "All",value: " "},...deviceList]
        defaultSelectedDevice = _.find(deviceList, (o) => o.value == selectedDeviceTag);
    }
 
    let data = { deviceList, selectedDevice: (deviceList ? defaultSelectedDevice : deviceList[0]), defaultSelectedDevice };

    return data;

}

export const getProfile = async (props = {}) => {
    const { accessToken } = props;
    const token = accessToken ? accessToken : await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)
    const payload = { token, serviceUrl: api.profile, method: 'get' }
    const profileData = await fetchApiData(payload);
    console.log("profileData: ", profileData);
    

    if (!profileData || profileData.error) {
        return ({ error: "Unable to get profile!" });
    }
    else return profileData;
}


export const getLocalProfile = async() => {
    console.log("******************** getLocalProfile() ***************");
    // let promiseArray = [];
    let _str = String(`${fieldsString},userId,user_id,role`);
    for (var a in AppConstants.SP) _str += `,${AppConstants.SP[a]}`;

    // const fields = await StorageUtils.getMulti(String(`${fieldsString},userId,user_id`).split(","));
    const fields = await StorageUtils.getMulti(_str.split(","));
    // console.log(JSON.stringify(fields, 0, 2));

    let data = {};
    for (let a in fields){
        Object.assign(data, { [fields[a][0]]: fields[a][1] })
    }


    // for (var a in AppConstants.SP){
    //     promiseArray.push(
    //         new Promise((resolve, reject) => {
    //             let _a = a;
    //             StorageUtils.getValue(AppConstants.SP[a]).then(r=>{
    //                 // console.log(`${AppConstants.SP[a]} : ${r}`);
    //                 if(r) Object.assign(data, { [AppConstants.SP[_a]]:r });
    //                 resolve(r);
    //             });
    //         })
    //     )
    // }
    // const allResults = await Promise.all(promiseArray);

    // if (data.roleName && !data.role) Object.assign(data, { role: data.roleName });

    return data;
}