import React from 'react'
import { Text, View, TouchableOpacity, Linking } from 'react-native'
import { styles } from './styles'
import { AppConstants, StorageUtils, showMessage } from "../../../utils";
import { api } from "../../../api";
import { fetchApiData } from '../../../apicall'


const WebViewComp = props => {
    const [webSource, setWebSource] = React.useState({ html:'<h1>loading...</h1>'})
    const [status, setStatus] = React.useState("loading...")

    const getProfileData = async () => {
        setStatus("Collecting user info...")
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)
        const payload = {
            token,
            serviceUrl: api.profile,
            method: 'get'
        }
        const profileData = await fetchApiData(payload)
        if (!profileData || profileData.error) {
            // this.setState({ error: true, loading: false })
            showMessage("Error in getting profile data");
            setStatus("Error in getting profile data");
            return false;
        }
        else {
            // this.setState({ data: profileData.data, loading: false })
        }

        return profileData;
    }


    const fetchWebViewData = async () => {
        // const email = await StorageUtils.getValue(AppConstants.SP.EMAIL);
        const name = await StorageUtils.getValue(AppConstants.SP.FULL_NAME)

        const userData = await getProfileData();
        
        if (!userData) return false;
        setStatus("Connecting to online doctor...")

        const res = await fetch("https://api.yourdoctors.online/generateDynamicLink", {
            method: 'post',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // Authorization: "Bearer " + token,
            },
            // body: { ...props.userData },
            body:JSON.stringify({
                partnerName: "sensights",
                authorizationKey: "b5114fd0-8fe7-41c1-9b82-43a888a9fadb",
                // paymentInfo: { "referral": "sensights" },
                paymentInfo: { "subscription": "2021-12-14" },
                email: userData.data.email, //"hassan.hashmi@markitech.ca",
                name: name, //"Hassan Hashmi",
                gender: userData.data.gender, //"male"
            })
            // ...options,
        }).then(response=> response.json()).then(r=>{
            if (r.code==200 && r.dynamiclink){
                Linking.openURL(r.dynamiclink).then(r=>{
                    // setWebSource({ html: '<h1>Webpage opened in external browser!</h1>' });
                }).catch((err) => {
                    console.error('An error occurred', err)
                    showMessage("An error occurred");
                    setStatus("An error occurred");
                });
                props.onClose();
            }
            else{
                showMessage("Unable to load contents!");
                setStatus("Unable to load contents!");
                props.onClose();
            }
        }).catch(err=>{
            console.log("FETCH ERROR: ", err);
            showMessage("Unable to fetch contents!");
            setStatus("Unable to fetch contents!");
            props.onClose();
        });


    }

    React.useEffect(() => {
        fetchWebViewData();

        return () => {
            // cleanup
        }
    }, [])


   return (<View style={styles.container}>
        <Text style={{ textAlign: "center" }}>{status}</Text>
    </View>)

}

export default WebViewComp;