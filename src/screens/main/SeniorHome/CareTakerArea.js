import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import { NavigationHeader, Row, Col } from "../../../components";
import { theme } from "../../../theme";
import { images, icons } from "../../../assets";
import { Icon, Button, Divider } from "react-native-elements";
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { AuthService } from '../../../Connecty/services';
import { sendRequest } from '../../../apicall';
import { NOTES_TIMER, CALL_END, } from '../../../api';
import Icons from 'react-native-vector-icons/FontAwesome';
// import { agoraRef } from '../../../../App'

// const Button = props => {
//     let _style = [styles.button, props.style || {}];
//     if (props.disabled) _style.push(styles.button_disabled)

//     return (<_Button {...props} buttonStyle={_style} __buttonStyle={{ backgroundColor: theme.colors.colorPrimary, borderRadius: 10 }} containerStyle={{ marginHorizontal: 10, borderRadius:10, }} />)

//     return (<_Button {...props} buttonStyle={_style} />)

//     return (<TouchableOpacity onPress={props.onPress} disabled={props.disabled} activeOpacity={0.8} style={_style} >
//         <Text style={[theme.palette.buttonText, { ...props.textStyle }]}>{props.title}</Text>
//     </TouchableOpacity>
//     )
// }

const CareTakerArea = (props) => {
    const { seniorImg, navigation, seniorName, removeSenior, seniorId, sendSMS, seniorPhone, makeCall, appType } = props;
    const profileData = navigation.getParam('profileData');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timerStart, setTimerStart] = useState(false);

    const makeVideoCall = args => {
        console.log("makeVideoCall()");
        if (!AuthService.isLoggedIn) {
            alert("You are not logged into VDO server")
            return;
        }
        // alert(AuthService.isLoggedIn ? "logged in" : "not logged in");
        EventRegister.emit('onMakeConnectyVideoCall', { ...profileData })
        // agoraRef.current.startCall();
    }

    const makeAudioCall = args => {
        console.log("makeAudioCall()");
        if (!AuthService.isLoggedIn) {
            alert("You are not logged into VDO server")
            return;
        }
        EventRegister.emit('onMakeConnectyAudioCall', { ...profileData })
    }

    const chatNavigation = args => {
        navigation.navigate('Chat')
    }


    useEffect(() => {
        const timerId = setInterval(() => {
            if (timerStart) {
                if (seconds >= 60) {
                    setMinutes(m => m + 1)
                    setSeconds(0)
                }
                else setSeconds(s => s + 1)
            }
        }, 1000)
        return () => clearInterval(timerId);
    }, [seconds, minutes, timerStart])


    const start = () => {
        setTimerStart(!timerStart)
        setMinutes(0)
        setSeconds(0)
        const uri = !timerStart ? NOTES_TIMER(seniorId) : CALL_END(seniorId)
        updateServerStatus(uri);
    }

    function updateServerStatus(uri) {
        sendRequest({ method: 'get', uri })
            .then(r => {
                return r;
            })
            .catch(error => {
                console.log("ERROR Unable to update server *******************");
                console.log(JSON.stringify(error, 0, 2));
                console.log("*******************");
            })
    }
    // const sendSMS = args => {
    //     console.log("sendSMS()", seniorPhone);
    // }

    return (
        <View>
            <NavigationHeader title={appType == 2 ? 'Staff Profile' : 'Individual’s Profile'} leftText={'Back'} navigation={navigation} />

            <View style={{ height: 15 }} />
            <View style={styles.headerLocStatsView}>
                <Image source={seniorImg != null ? { uri: seniorImg } : images.placeholder_user} style={styles.registeredSeniorIcon} />
                <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row', paddingRight: 20 }}>
                    <View>
                        <Text numberOfLines={1} style={[styles.locStatsItemTitle, { fontFamily: theme.fonts.SFProBold, fontSize: 22, marginRight: 20 },]}>{seniorName}</Text>
                        <TouchableOpacity onPress={removeSenior}>
                            <Text style={{ textAlign: 'left', marginTop: 10, color: theme.colors.red_shade_1 }}>Remove</Text>
                        </TouchableOpacity>
                    </View>

                    <Icon type="material-community" name="square-edit-outline" color={theme.colors.colorPrimary}
                        onPress={() => {
                            navigation.navigate("TaskForm", {
                                name: seniorName, seniorId: seniorId, profileImage: seniorImg,
                            });
                        }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "#f5f5f5", alignItems: 'center' }}>
                <Text style={styles.heading}>CALL / MESSAGE</Text>
                <Image source={icons.info} />
            </View>
            <Divider style={{ width: "100%" }} />

            <Row style={{ marginHorizontal: 20, justifyContent: 'space-around', marginVertical: 15, }}>
                <Button
                    title={"CALL"}
                    icon={{ name: "call", color: "white", size: 20 }}
                    disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                    buttonStyle={{
                        backgroundColor: '#25AE5F',
                        borderRadius: 10,
                    }}
                    raised
                    onPress={() => makeCall()}
                />
                <Button title="MESSAGE"
                    disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                    icon={{ name: "sms", color: theme.colors.white }}
                    buttonStyle={{ borderRadius: 10, backgroundColor: "#2550EA", }}
                    raised
                    onPress={() => sendSMS()}
                />

            </Row>

            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "#f5f5f5", alignItems: 'center' }}>
                <Text style={styles.heading}>VIRTUAL VISIT</Text>
                <Image source={icons.info} />
            </View>
            <Divider style={{ width: "100%" }} />

            <Row style={{ marginHorizontal: 10, justifyContent: 'space-between', marginVertical: 15, }}>

                <Button title="AUDIO VISIT"
                    buttonStyle={{ borderRadius: 10, backgroundColor: '#F29812'}} raised
                    disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                    icon={{ name: 'call', color: "white" ,size:20}}
                    onPress={() => makeAudioCall()}
                />
                 <Button title="CHAT"
                    buttonStyle={{ borderRadius: 10, backgroundColor: "#2550EA", }} raised
                    disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                    icon={{ name: 'chat', color: "white", size:20 }}
                    onPress={() => chatNavigation()}
                />
                <Button title="VIDEO VISIT"
                    buttonStyle={{ borderRadius: 10, backgroundColor: '#BA7001' }} raised
                    disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                    // icon={{ name: "fa-camera", color: "white" }}
                    icon={<Icons name="video-camera" size={15} color="white" style={{ marginRight: 5 }} />}
                    onPress={() => makeVideoCall()}
                />

            </Row>

            {appType == 1 && <Row style={{ marginHorizontal: 20, justifyContent: "space-between", marginTop: 10, }}>
                <View style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Timer :</Text>
                </View>
                <View style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 40 }}> {`${minutes.toString().padStart(2, 0)} : ${seconds.toString().padStart(2, 0)}`}</Text>
                </View>
                <Button title={timerStart ? "End" : "Start"}
                    buttonStyle={{
                        backgroundColor: timerStart ? '#EF4545' : '#25AE5F',
                        borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10
                    }}
                    raised
                    onPress={() => start()}
                />
            </Row>}

            {/* <Row style={{ marginHorizontal: 10}}>
                <Col flex="30%">
                    <Button 
                        onPress={() => sendSMS()} 
                        title="Message" 
                        // style={styles.smsButton} 
                        textStyle={{ color: theme.colors.colorPrimary }} 
                    />
                    </Col>
                <Col flex="auto">
                    <Button title="Call" buttonStyle={{ borderRadius: 10 }} raised
                        disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                        // icon={{ name: "fa-camera", color: "white" }}
                        icon={<FaIcon name="camera" size={15} color="white" style={{ marginRight: 5 }} />}
                        onPress={() => makeVideoCall()}
                    />

                    <Button disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn} onPress={() => makeVideoCall()} style={{ marginHorizontal: 10 }} title="Video Call" />
                </Col>
                <Col flex="30%"><Button disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn} onPress={() => makeAudioCall()} title="Voice Call" /></Col>
                <Col flex="30%"><Button onPress={() => makeCall()} disabled={true} title="Phone Call" /></Col>
            </Row> */}

            {/* <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.buttonsContainer} >
                    <TouchableOpacity onPress={sendSMS} activeOpacity={0.8} style={[theme.palette.nextButton, styles.smsButton]} >
                        <Text style={[theme.palette.buttonText, { color: theme.colors.colorPrimary }]}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.makeCall(seniorPhone)} activeOpacity={0.8} style={[theme.palette.nextButton, { flex: 1 }]} >
                        <Text style={theme.palette.buttonText}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View> */}

            <View style={{ height: 10 }} />
            {/* {this.renderChart()} */}
        </View>
    )
}

export default CareTakerArea;


const styles = StyleSheet.create({
    headerLocStatsView: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginHorizontal: 16,
        marginVertical: 10,
    },
    registeredSeniorIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    locStatsItemTitle: {
        color: theme.colors.black,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 15,
        flexGrow: 1,
    },
    // buttonsContainer: {
    //     flex: 1,
    //     width: '100%',
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: 'space-between',
    //     marginTop: 15
    // },
    // smsButton: {
    //     // flex: 1,
    //     backgroundColor: 'white',
    //     // backgroundColor: 'transparent',
    //     // borderWidth: 1,
    //     // borderColor: theme.colors.colorPrimary
    // },
    button: {
        borderRadius: 10, paddingHorizontal: 10,
        borderWidth: 1,
        height: 47,
        // alignItems: "center",
        // backgroundColor: theme.colors.colorPrimary,
        // borderRadius: 10,
        // height: 45,
        // justifyContent: "center",
        // padding: 10
    },
    button_disabled: {
        backgroundColor: "#CCC"
    },
    heading: {
        color: "grey",
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "flex-start",
        paddingLeft: 16,
        paddingVertical: 8,
        backgroundColor: "#f5f5f5",
        paddingRight: 4
    },



})
