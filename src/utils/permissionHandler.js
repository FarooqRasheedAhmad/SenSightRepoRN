import React from "react";
import { Platform, Alert, PermissionsAndroid } from "react-native";
import { requestMultiple, request, checkMultiple, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import _ from 'lodash';

const permisionsList = {
    camera:{
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA
    },
    location:{
        android: [
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        ],
        ios: [
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ]
    },
    externalStorage:{
        android: [
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        ]
    },
    audio:{
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        ios: PERMISSIONS.IOS.MICROPHONE
    },
    bluetooth:{
        ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL
    },
    library:{
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY
        // ios: [PERMISSIONS.IOS.MEDIA_LIBRARY, PERMISSIONS.IOS.PHOTO_LIBRARY]
    }
}

/* results 
RESULTS.UNAVAILABLE // This feature is not available (on this device / in this context)
RESULTS.DENIED // The permission has not been requested / is denied but requestable
RESULTS.GRANTED // The permission is granted
RESULTS.BLOCKED // The permission is denied and not requestable anymore
*/

export const checkPermissions = () => {
    let arr = []
    for (let a in permisionsList){
        // const _android = permisionsList[a].android;
        // const _ios = permisionsList[a].ios;
        const _permission = (Platform.OS == 'ios') ? permisionsList[a].ios : permisionsList[a].android;

        if (_.isArray(_permission)){
            _permission.forEach(p => {
                arr.push(p)
            })
        } else if (_permission){
            arr.push(_permission)
        }
    }

    
    checkMultiple(arr).then(statuses => {
            console.log("\n\n statuses: ", JSON.stringify(statuses, 0, 2))
            // console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
            // console.log('FaceID', statuses[PERMISSIONS.IOS.FACE_ID]);
        },
    );

}

export const grantAllPermissions = async (permissionsRequired) => {
    let arr = []
    let allGranted = true;

    for (let a in permisionsList) {
        // const _android = permisionsList[a].android;
        // const _ios = permisionsList[a].ios;
        const _permission = (Platform.OS == 'ios') ? permisionsList[a].ios : permisionsList[a].android;

        if (_.isArray(_permission)) {
            _permission.forEach(p => {
                arr.push(p)
            })
        } else if (_permission) {
            arr.push(_permission)
        }
    }

    await requestMultiple(arr).then(statuses => {
            console.log("\n\n statuses: ", JSON.stringify(statuses, 0, 2))

            for (let a in statuses){
                const granted = (statuses[a]=='granted')
                if (!granted){
                    console.log(`Permissions denied for ${a}`);
                    allGranted = false;
                }
                if (granted) console.log(`Permissions granted for ${a}`)
            }

        },
    );

    return allGranted;

}

export const _getPermissions = async(permissionsRequired) => {
    var granted = false;
    var grantConfirmed = false;

    if (Platform.OS == 'ios') {

    }
    else {
        granted = await PermissionsAndroid.requestMultiple(
            [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
            {
                title: 'vEYEtals need Camera And Microphone Permission',
                message: 'vEYEtals needs access to your camera and microphone.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (!granted) { alert("Permissions not granted!"); return; }

        grantConfirmed = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED

        if (!grantConfirmed) { alert("Required permissions are not gained!"); return; }

        return true;

    }
}
