import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Icon } from "react-native-elements";
import { theme } from "../../../../theme";
// import { RadioButton } from '../components/Radio';
// import { Col, Row } from '../components/Grid'
import { Col, Row, RadioButton } from '../../../../components'
import { AppConstants, StorageUtils } from "../../../../utils";
import { api } from "../../../../api";
// import Spinner from "react-native-loading-spinner-overlay";
import Snackbar from "react-native-snackbar"



export default class DailyActivityScreen extends Component {
    state = { selected:null, loading:false }
    constructor(props){
        super(props);
        this.handelApiResponse = this.handelApiResponse.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onRadioChanged = val => {
        console.log("val: ", val);
        this.setState({ selected:val });
    }

    onSubmit = async args => {
        const { selected } = this.state;

        if (!selected || selected==null){
            return;
        }
        this.setState({ loading:true });
        const handelApiResponse = this.handelApiResponse;
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

        let body = {
            userId,
            deviceTag:"MobileApp",
            dailyMoodScore: selected,  // / weeklySocialScore
        }
        
        fetch(api.addBMIScale, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(body),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("response.ERROR: ", response);
                return { error: {message:"Something went wrong! Try again"} };
            }
        })
        .then((json) => {
            handelApiResponse(json)
        })
        .catch((error) => {
            handelApiResponse({ error })
        })

    }

    handelApiResponse(args){
        this.setState({ loading: false });
        console.log("handelApiResponse()", args);       

        if(args.error){
            Snackbar.show({
                text: args.error.message || "Oops, Something went wrong!",
                duration: Snackbar.LENGTH_LONG,
            })
        }

        if (args.userDeviceReadingId && args.userDeviceReadingId>0){
            this.props.onSuccess();
            // this.props.onClose();
        }
    }



    render() {
        const { selected, loading } = this.state;

        return (<View style={{ borderWidth: 0, flex: 1, margin: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
            
            <View style={{borderWidth:0}}>
                {/* <Text style={{ color: theme.colors.colorPrimary, fontSize: 30, fontWeight: "bold", textAlign: "center", lineHeight: 26, paddingVertical: 20 }}>Activity Score Questionnaire (Daily)</Text> */}
                <Text style={{ fontSize: 30, textAlign: "center" }}>How are you feeling today?</Text>
            </View>
            
            <View style={{ borderWidth: 0, marginVertical: 70 }}>
                <TouchableOpacity style={{ width: "100%" }} onPress={() => this.setState({ selected: "3" })}>
                    <Row style={{ borderTopWidth: 0.5, borderBottomWidth: 0.5, paddingVertical: 5, borderColor: "rgba(0, 0, 0, 0.2)" }}>
                        <Col flex={30}></Col>
                        <Col flex="auto" align="center"><Image source={require('../../../../assets/icons/clarity_happy-face-line.png')} /></Col>
                        <Col flex={30} valign="center"><RadioButton selected={selected} value="3" /></Col>
                    </Row>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: "100%" }} onPress={() => this.setState({ selected: "2" })}>
                    <Row style={{ borderBottomWidth: 0.5, paddingVertical: 5, borderColor: "rgba(0, 0, 0, 0.2)" }}>
                        <Col flex={30}></Col>
                        <Col flex="auto" align="center"><Image source={require('../../../../assets/icons/clarity_neutral-face-line.png')} /></Col>
                        <Col flex={30} valign="center"><RadioButton selected={selected} value="2" /></Col>
                    </Row>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: "100%" }} onPress={() => this.setState({ selected: "1" })}>
                    <Row style={{ borderBottomWidth: 0.5, paddingVertical: 5, borderColor: "rgba(0, 0, 0, 0.2)" }}>
                        <Col flex={30}></Col>
                        <Col flex="auto" align="center"><Image source={require('../../../../assets/icons/clarity_sad-face-line.png')} /></Col>
                        <Col flex={30} valign="center"><RadioButton selected={selected} value="1" /></Col>
                    </Row>
                </TouchableOpacity>
            </View>

            <View style={{ borderWidth: 0, alignItems: "center"}}>
                <Button title="Submit" // raised
                    disabled={selected==null}
                    titleStyle={{ fontWeight: "400", fontSize:24 }}
                    // buttonStyle={{ backgroundColor: theme.colors.colorPrimary, borderRadius: 8 }}
                    containerStyle={{ width: 200,  }}
                    onPress={()=>this.onSubmit()}
                    loading={loading}
                />
                {/* <Button title="Close" onPress={this.props.onClose} /> */}
            </View>
        </View>)

    }
}


const styles = StyleSheet.create({
    container:{
        alignContent: "center",
        alignItems: "center",
        margin: 10,
    },
})
