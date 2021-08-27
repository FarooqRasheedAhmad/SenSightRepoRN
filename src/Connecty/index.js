import React, { Component } from 'react'
import { Text, View, Modal, TouchableHighlight, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import ConnectyCube from 'react-native-connectycube';
import { Icon } from "react-native-elements";
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import VideoScreen from "./components/VideoScreen";
import { users, USERS_URL, DEFAULT_PASSWORD } from './config'
import { AuthService, CallService } from './services';
// import AuthScreen from "./components/AuthScreen";
import RTCViewGrid from './components/VideoScreen/RTCViewGrid';
import ToolBar from './components/VideoScreen/ToolBar';
import { Row, Col } from './components/Grid'
import { AppConstants, StorageUtils,  } from "../utils";
import { getLocalProfile } from '../utils/fetcher';
import { sendRequest } from '../apicall';
import { CREATE_CONNECTY_USER, CALL_START, CALL_END,CALL_INITIATOR_ID } from '../api';
import { updateLocalProfile } from '../utils/updater';

function updateServerStatus (uri){
    sendRequest({ method: 'get', uri })
        .then(r => { return r; })
        .catch(error => {
            console.log("ERROR Unable to update server *******************");
            console.log(JSON.stringify(error, 0, 2));
            console.log("*******************");
        })
}


const Button = props => {
    return <TouchableHighlight {...props} style={{borderWidth:1, borderRadius:5, padding:10, backgroundColor:"#EEE", margin:5, ...props.style}}><>
        {props.children}
        {props.title && <Text style={{ fontSize: 18, textAlign:"center", ...props.textStyle}}>{props.title}</Text>}
    </></TouchableHighlight>
}

const modalProps = {
    animationType:"fade", transparent:false,
    presentationStyle: 'fullScreen',
    statusBarTranslucent: false,
}

export default class Connecty extends Component {
    state = {
        currentUser:null, targetUser:false,
        isIncomingCall: false, localStream: null, remoteStreams: [],
        isActiveCall: false, isLogging: false, loading: false, userData: null, callType: 'audio', timer: false, opponentsName: ''
    }
    // listener_onLoggedInToConnecty;
    listener_onLoggedOutFromConnecty;
    listener_onAppLogin;
    listener_onAppLogout;
    listener_onMakeConnectyVideoCall;
    listener_onMakeConnectyAudioCall;
    listener_onCallConnected;
    listener_onCallDisconnected;
    // listener_onIncommingCall;
    _session = null;
    userData = null;

    constructor(props) {
        super(props);
        this.initRemoteStreams = this.initRemoteStreams.bind(this);
        this.setLocalStream = this.setLocalStream.bind(this);
        this.updateRemoteStream = this.updateRemoteStream.bind(this);
        this.removeRemoteStream = this.removeRemoteStream.bind(this);
        this.stopCall = this.stopCall.bind(this);
        this.startCall = this.startCall.bind(this);
        this.logout = this.logout.bind(this);
        this._onPressAccept = this._onPressAccept.bind(this);
        this._onPressReject = this._onPressReject.bind(this);

        this.autoLoginToConnecty = this.autoLoginToConnecty.bind(this);
    }

    componentWillMount() {
        this.setupLocalListeners();
    }

    componentDidMount() {
        this.autoLoginToConnecty();
    }

    componentWillUnmount() {
        this._removeLocalListeners()
        // EventRegister.removeEventListener(this.listener_onAppLogin)
        // EventRegister.removeEventListener(this.listener_onAppLogout)
        // EventRegister.removeEventListener(this.listener_onMakeConnectyVideoCall)
        // // EventRegister.removeEventListener(this.listener_onLoggedInToConnecty)
        // EventRegister.removeEventListener(this.listener_onLoggedOutFromConnecty)
        // // EventRegister.removeEventListener(this.listener_onIncommingCall)
    }

    setupLocalListeners() {
        this.listener_onAppLogin = EventRegister.addEventListener('onAppLogin', (data) => {
            this.autoLoginToConnecty(data);
        })
        this.listener_onAppLogout = EventRegister.addEventListener('onAppLogout', (data) => {
            this.logout();
        })

        this.listener_onMakeConnectyVideoCall = EventRegister.addEventListener('onMakeConnectyVideoCall', (data) => {
            // alert(data.callerId)
            if (data.callerId) this.startCall({ ...data, id: data.callerId, callType: 'video' });
            else alert("This user is not registered for Video call!")
        })
        this.listener_onMakeConnectyAudioCall = EventRegister.addEventListener('onMakeConnectyAudioCall', (data) => {
            if (data.callerId) this.startCall({ ...data, id: data.callerId, callType: 'audio' });
            else alert("This user is not registered for Audio call!")
        })

        this.listener_onLoggedOutFromConnecty = EventRegister.addEventListener('onLoggedOutFromConnecty', (data) => {
            console.log("onLoggedOutFromConnecty: ", data);
            this.setState({ currentUser: null })
        })
        this.listener_onCallConnected = EventRegister.addEventListener('onCallConnected', async (data) => {
            // console.log(JSON.stringify(this.userData, 0, 2));
            console.log("========================== onCallConnected() Make api call to update call status on server ==========================")
            this.setState({ timer: true, callType: data.callTypeCheck })
            const uri = CALL_INITIATOR_ID(data.session.initiatorID)
            const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
            const res = await fetch(uri, {
                method: "get",
                headers: {
                    Accept: "application/json", Authorization: "Bearer " + token,
                },
            }).then((response) => { return response.json(); })
            if (this.userData.role == "caretaker") {
                if (res.roleName == "caretaker") {
                    const uri = CALL_START(this.state.targetUser.seniorId, data.callTypeCheck);
                    updateServerStatus(uri);
                } else {
                    const uri = CALL_START(res.id, data.callTypeCheck);
                    updateServerStatus(uri);
                }
            }
        })
        this.listener_onCallDisconnected = EventRegister.addEventListener('onCallDisconnected', async (data) => {
            // console.log(JSON.stringify(this.userData, 0, 2));
            console.log("========================== onCallDisconnected() Make api call to update call status on server ==========================")
            this.setState({ timer: false })
            const uri = CALL_INITIATOR_ID(data.session.initiatorID)
            const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
            const res = await fetch(uri, {
                method: "get",
                headers: {
                    Accept: "application/json", Authorization: "Bearer " + token,
                },
            }).then((response) => { return response.json(); })
            if (this.userData.role == "caretaker") {
                if (res.roleName == "caretaker") {
                    const uri = CALL_END(data.seniorId);
                    updateServerStatus(uri);
                } else {
                    const uri = CALL_END(res.id);
                    updateServerStatus(uri);
                }
            }
        })
    }
    _removeLocalListeners() {
        if (this.listener_onAppLogin) EventRegister.removeEventListener(this.listener_onAppLogin)
        if (this.listener_onAppLogout) EventRegister.removeEventListener(this.listener_onAppLogout)
        if (this.listener_onMakeConnectyVideoCall) EventRegister.removeEventListener(this.listener_onMakeConnectyVideoCall)
        if (this.listener_onMakeConnectyAudioCall) EventRegister.removeEventListener(this.listener_onMakeConnectyAudioCall)
        if (this.listener_onLoggedOutFromConnecty) EventRegister.removeEventListener(this.listener_onLoggedOutFromConnecty)
        if (this.listener_onCallConnected) EventRegister.removeEventListener(this.listener_onCallConnected)
        if (this.listener_onCallDisconnected) EventRegister.removeEventListener(this.listener_onCallDisconnected)
    }

    async autoLoginToConnecty(userData) {
        // console.log("*********************************** autoLoginToConnecty() ********************");

        var _userData = userData || {};
        // get usre profile if not exists
        if (!_userData || !_userData.userId) _userData = await getLocalProfile();
        this.userData = _userData;

        if (!_userData || !_userData.userId) {
            // alert("Not logged in")
            return;
        }

        // register user to Connecty if not registered
        if (!_userData.callerId || _userData.callerId == 'null') {

            if (!_userData.email) {
                Alert.alert("Unable to register Video user", "Email not available");
                return false;
            }
            if (!_userData.FULL_NAME) {
                if (_userData.firstName || _userData.lastName) Object.assign(_userData, { FULL_NAME: `${_userData.firstName} ${_userData.lastName}` })
                if (!_userData.FULL_NAME) {
                    Alert.alert("Unable to register Video user", "Full name not available");
                    return false;
                }
            }
            if (!_userData.userId) {
                Alert.alert("Unable to register Video user", "User ID not available");
                return false;
            }

            console.log("*************** Missing callerId, attempting to register at CC ***************");
            this.createNewUserSession(_userData)
            return false;
        }

        // if (!loginInfo.callerId || loginInfo.callerId == 'null') {
        //     console.log("*************** Missing callerId, attempting to register at CC ***************");
        //     console.log(JSON.stringify(loginInfo, 0, 2));
        //     this.setState({ systemUser: { ...this.state.systemUser, ..._userData } }, () => {
        //         this.createNewUserSession(loginInfo);
        //     })
        //     return;
        // }

        var loginInfo = {
            id: _userData.callerId,
            login: _userData.email,
            name: _userData.FULL_NAME
        }
        this.login({
            ...loginInfo,
            // id: loginInfo.callerId,
            // name: 'Totona',
            // login: loginInfo.login,
            // password: DEFAULT_PASSWORD,
            // color: '#34ad86',
        })

    }

    _removeListeners() {
        this._removeLocalListeners();

        if (!ConnectyCube.videochat) return;
        ConnectyCube.videochat.onCallListener = undefined;
        ConnectyCube.videochat.onAcceptCallListener = undefined;
        ConnectyCube.videochat.onRejectCallListener = undefined;
        ConnectyCube.videochat.onStopCallListener = undefined;
        ConnectyCube.videochat.onUserNotAnswerListener = undefined;
        ConnectyCube.videochat.onRemoteStreamListener = undefined;
    }

    _setUpListeners() {
        if (!ConnectyCube.videochat) {
            alert("ConnectyCube.videochat not found!");
            return;
        }
        ConnectyCube.videochat.onCallListener = this._onCallListener;
        ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
        ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
        ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
        ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
        ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
    }

    _onCallListener = async (session, extension) => {
        // console.log("********************** _onCallListener() ***********************");
        if (session.initiatorID === session.currentUserID) {
            return false;
        }
        if (this._session) {
            CallService.rejectCall(this._session, { busy: true });
            return false;
        }
        const callTypeCheck = session.callType == 1 ? 'video' : 'audio'
        const uri = CALL_INITIATOR_ID(session.initiatorID)
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        const res = await fetch(uri, {
            method: "get",
            headers: {
                Accept: "application/json", Authorization: "Bearer " + token,
            },
        }).then((response) => { return response.json(); })
        this.setState({ opponentsName: `${res.firstName} ${res.lastName}`, callType: callTypeCheck })
        CallService.processOnCallListener(session)
            .then(() => this.showInomingCallModal(session))
            .catch(this.hideInomingCallModal);
    };

    _onAcceptCallListener = async (session, userId, extension) => {
        // call accepted by other user
        // console.log("********************** _onAcceptCallListener() ***********************");       
        const callTypeCheck = session.callType == 1 ? 'video' : 'audio'

        CallService.processOnAcceptCallListener(session, userId, extension)
            .then(r => {
                this.setOnCall();
                EventRegister.emit('onCallConnected', { message: "Call accpted from other end", callTypeCheck, session })
            })
            .catch(this.hideInomingCallModal);
    };

    _onRejectCallListener = (session, userId, extension) => {
        // console.log("********************** _onRejectCallListener() ***********************");

        CallService.processOnRejectCallListener(session, userId, extension)
            .then(() => this.removeRemoteStream(userId))
            .catch(this.hideInomingCallModal);
    };

    _onStopCallListener = (session, userId, extension) => {
        // console.log("********************** _onStopCallListener() ***********************");

        const isStoppedByInitiator = session.initiatorID === userId;
        const seniorId = this.state.targetUser.seniorId
        this.setState({ timer: false })
        CallService.processOnStopCallListener(userId, isStoppedByInitiator)
            .then(() => {
                EventRegister.emit('onCallDisconnected', { session, seniorId })
                if (isStoppedByInitiator) {
                    CallService.stopCall();
                    this.resetState();
                } else {
                    this.removeRemoteStream(userId);
                }

            })
            .catch(this.hideInomingCallModal);
    };

    _onUserNotAnswerListener = (session, userId) => {
        // console.log("********************** _onUserNotAnswerListener() ***********************");

        CallService.processOnUserNotAnswerListener(userId)
            .then(() => this.removeRemoteStream(userId))
            .catch(this.hideInomingCallModal);
    };

    _onRemoteStreamListener = (session, userId, stream) => {
        // console.log("********************** _onRemoteStreamListener() ***********************");

        CallService.processOnRemoteStreamListener(userId)
            .then(() => {
                this.updateRemoteStream(userId, stream);
                this.setOnCall();
            })
            .catch(this.hideInomingCallModal);
    };


    showInomingCallModal = session => {
        this._session = session;
        this.setState({ isIncomingCall: true });
    };
    hideInomingCallModal = () => {
        this._session = null;
        this.setState({ isIncomingCall: false });
    };


    startCall = (targetUser) => {
        // console.log("startCall()", targetUser);
        if (!targetUser || !targetUser.id) {
            alert("No user Id found!");
            return;
        }

        this.setState({ targetUser: targetUser, callType: targetUser.callType, opponentsName: `${targetUser.firstName} ${targetUser.lastName}` }, () => {
            this.initRemoteStreams([targetUser.id]);
            CallService.startCall([targetUser.id], targetUser.callType).then(this.setLocalStream);
        })
    };
    stopCall = () => {
        CallService.stopCall();
        this.resetState();
    };

    _onPressAccept = () => {
        CallService.acceptCall(this._session).then(stream => {
            const { opponentsIDs, initiatorID, currentUserID, callType } = this._session;
            const session = this._session
            const opponentsIds = [initiatorID, ...opponentsIDs].filter(
                userId => currentUserID !== userId,
            );
            const callTypeCheck = callType == 1 ? 'video' : 'audio'

            EventRegister.emit('onCallConnected', { message: "Call accpted from you", callTypeCheck, session })

            this.initRemoteStreams(opponentsIds);
            this.setLocalStream(stream);
            this.hideInomingCallModal();
        });
    };
    _onPressReject = () => {
        if (this._session) CallService.rejectCall(this._session);
        this._session = null;
        this.hideInomingCallModal();
    };


    initRemoteStreams = opponentsIds => {
        // console.log("********************** initRemoteStreams() ***********************");

        const emptyStreams = opponentsIds.map(userId => ({
            userId,
            stream: null,
        }));
        this.setState({ remoteStreams: emptyStreams });
    };
    setLocalStream = stream => {
        this.setState({ localStream: stream });
    };
    updateRemoteStream = (userId, stream) => {
        // console.log("********************** updateRemoteStream() ***********************");

        this.setState(({ remoteStreams }) => {
            const updatedRemoteStreams = remoteStreams.map(item => {
                if (item.userId === userId) return { userId, stream };
                return { userId: item.userId, stream: item.stream };
            });

            return { remoteStreams: updatedRemoteStreams };
        });
    };
    removeRemoteStream = userId => {
        // console.log(`============== removeRemoteStream(${userId}) ==============`);

        const { remoteStreams } = this.state;
        const _remoteStreams = remoteStreams.filter(item => String(item.userId) !== String(userId));

        // console.log("============ _remoteStreams: ", JSON.stringify(_remoteStreams, 0, 2));

        if (!_remoteStreams || _remoteStreams.length < 1) {
            console.log("STREAM IS EMPTY");
            this.stopCall();
            return;
        }

        this.setState({ remoteStreams: _remoteStreams })

        // this.setState(({ remoteStreams }) => {
        //     const _remoteStreams = remoteStreams.filter(item => item.userId !== userId);

        //     this.setState({ remoteStreams: _remoteStreams }, ()=>{
        //         if (!_remoteStreams || _remoteStreams.length < 1){
        //             console.log("_remoteStreams: ", _remoteStreams);
        //             this.stopCall()
        //             // this.resetState();
        //         }
        //     })

        // });

        // this.setState(({ remoteStreams }) => ({
        //     remoteStreams: remoteStreams.filter(item => item.userId !== userId),
        // }), ()=>{
        //     if (!this.state.remoteStreams || this.state.remoteStreams.length<1)
        //     this.hideInomingCallModal();
        // });

        // this.setState(({ remoteStreams }) => ({
        //     remoteStreams: remoteStreams.filter(item => item.userId !== userId),
        // }), ()=>{
        //     if (!this.state.remoteStreams || this.state.remoteStreams.length<1)
        //     this.hideInomingCallModal();
        // });

    };


    resetState = () => {
        this.setState({
            // localStream, remoteStreams
            localStream: null,
            remoteStreams: [],
            isActiveSelect: true,
            isActiveCall: false,
            targetUser: false,
            timer: false
        });
    };


    logout = () => {
        this.stopCall()
        AuthService.logout();
    }
    login = currentUser => {
        if (!currentUser || !currentUser.id || !currentUser.login) {
            alert("Invalid login data")
            return;
        }

        Object.assign(currentUser, { login: String(currentUser.login).toLowerCase() })

        const _onSuccessLogin = (r) => {
            console.log("========= _onSuccessLogin() =======", r);
            // EventRegister.emit('onLoggedInToConnecty', { ...currentUser })
            this.setState({ currentUser });
            this._setUpListeners();
        };

        const _onFailLogin = (error = {}) => {
            console.log("========= _onFailLogin() =======", error);
            try {
                Alert.alert("Video Login Error!", error.info.errors.toString())
            } catch (err) {
                // alert(`Error.\n\n${JSON.stringify(error)}`);
            }
            this.setState({ userData: currentUser });
        };

        this.setState({ isLogging: true })

        AuthService.login({ ...currentUser, password: DEFAULT_PASSWORD })
            .then(_onSuccessLogin)
            .catch(_onFailLogin)
            .then((r) => {
                console.log("------", r);
                this.setState({ isLogging: false })
            });
    };


    /*************** Register user to Connecty Cube */
    createNewUserSession({ userId, email, FULL_NAME }) { // loginInfo
        // const { userId, email, FULL_NAME, id } = loginInfo
        // console.log("******************* createNewUserSession() *******************", JSON.stringify({ userId, email, FULL_NAME }));
        if (!userId) {
            alert("No user ID")
            return;
        }

        this.setState({ loading: 'Creating new user session...' });

        ConnectyCube.createSession()
            .then((session) => {
                console.log("=================== Session Created ================");
                // console.log(session);
                // console.log("===============");
                this.setState({ loading: false, connectySession: session }, () => this.createNewUserAtCC({ email, FULL_NAME }, session))
            })
            .catch((error) => {
                console.log("ERROR: ", error);
                this.setState({ loading: false })
                alert("Unable to establish New User Session!")
            });
    }

    async createNewUserAtCC({ email, FULL_NAME }, connectySession) {
        // console.log("******************* createNewUserAtCC() *******************");

        if (!email || email == 'null' || email == 'undefined') {
            alert("Missing user email");
            return;
        }
        this.setState({ loading: "Registering Calling user..." })

        /***************
         * Register user to conecty server
         * **/
        const method = 'post';

        let postData = {
            login: String(email).toLowerCase(),
            email: String(email).toLowerCase(),
            password: DEFAULT_PASSWORD,
            full_name: FULL_NAME,
            // token: connectySession.token,
        }

        const result = await ConnectyCube.users.signup(postData)
            .then(res => {
                // console.log("=========== res ==============");
                // console.log(res);
                return res;
            })
            .catch(error => {
                console.log("ERROR => ******** ConnectyCube.users.signup ********")
                console.log(JSON.stringify(error, 0, 2));
                console.log("======");
                console.log(error);
                console.log("END ********************");
                // alert("Unable to register Video user");
                return error.info
                // return false;
            })
    
        if (result.errors && result.errors.base[0] == "email must be unique") {
            const userCredentials = { email: email, password: DEFAULT_PASSWORD };
            ConnectyCube.login(userCredentials)
                .then((user) => {
                    console.log("...............", user)
                    this.registerConnectyToServer({ FULL_NAME, ...user, email: user.login })
                })
                .catch((error) => { });
                return false;
        }

        if (result.errors) {
            let errString = "";
            for (let a in result.errors) {
                errString += `${a} ` + "\n" + result.errors[a].toString() + "\n";
            }

            console.log(`=================== Video Account Registration Error! =================`);
            console.log(JSON.stringify(result, 0, 2));

            Alert.alert("Video Account Registration Error!", errString)

            return false;
        }

        this.registerConnectyToServer({ FULL_NAME, ...result.user, email: result.user.login })
        return;

    }

    async registerConnectyToServer({ id, FULL_NAME, email }) { //loginInfost
        const loginInfo = { id, FULL_NAME, email };
        // console.log("******************* registerConnectyToServer() *******************", JSON.stringify(loginInfo));

        this.setState({ loading: "Registering Calling user to system" })

        const registrationResult = await sendRequest({
            method: 'put',
            uri: CREATE_CONNECTY_USER + `?CallerId=${id}`
        })
            .then(r => { return r; })
            .catch(error => {
                console.log("ERROR *******************", JSON.stringify(loginInfo));
                console.log(JSON.stringify(error, 0, 2));
                console.log("*******************");
                return { error: "Unable to complete registration.." }
            })

        if (registrationResult.error) {
            this.setState({ loading: false, error: registrationResult.error });
            // this.setState({ loading: false, error: registrationResult.error, connectyUser: loginInfo });
            return;
        }

        this.uploadLocalCallerId(id);

        this.setState({ connectyUser: loginInfo, loading: false }, () => {
            this.login({
                id: id,
                // name: 'Totona',
                login: String(email).toLowerCase(),
                // password: DEFAULT_PASSWORD,
                // color: '#34ad86',
            })
        });

    }

    uploadLocalCallerId(callerId) {
        if (!callerId) {
            this.setState({ loading: false, errors: "Missing caller ID" });
            return;
        }

        updateLocalProfile({ callerId });
        // const { systemUser } = this.state;
        // this.setState({ loading: false, systemUser: { ...systemUser, callerId: callerId } })
        this.setState({ loading: false })

        this.autoLoginToConnecty();

        return;
    }

    setOnCall(args) {
        console.log("********************* setOnCall() *********************");
        // EventRegister.emit('onCallConnected', {})
    }





    render() {
        const { currentUser, targetUser, isIncomingCall, userData,
            localStream, remoteStreams, isActiveCall, isLogging, loading, callType, timer, opponentsName
        } = this.state;

        const localStreamItem = localStream ? [{ userId: 'localStream', stream: localStream }] : [];
        const streams = [...remoteStreams, ...localStreamItem];

        // console.log("localStream: ", localStream);
        // console.log("remoteStreams: ", remoteStreams);

        // this is for voice on loud speaker
        CallService.setSpeakerphoneOn(callType != 'audio' ? true : false);


        return (<>
            <View style={{ borderWidth: 0, height: 0, overflow: "hidden" }}>
                <ScrollView style={{ padding: 40, flex: 1 }}>
                    {/* <Button onPress={() => this.registerConnectyToServer("4189699")} title="Update Caller ID" /> */}
                    {userData && <Text>You are : {userData.id} - {userData.login}</Text>}
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", padding: 15 }}>Video Chat Demo</Text>
                    {currentUser && <View style={{ borderWidth: 1, padding: 10, margin: 10, flex: 1 }}>
                        <Text><Text style={{ fontWeight: "bold" }}>You are logged in as</Text> {currentUser.name} - {currentUser.login} - {currentUser.id}</Text>
                        <Button onPress={this.logout} title="Logout" style={{ backgroundColor: "red" }} textStyle={{ color: "white" }} />
                        {/* {users.map((u,i)=>{
                            // console.log("***************");
                            // console.log(`${String(u.id)} == ${String(currentUser.id)} : `, String(u.id) == String(currentUser.id));
                            // console.log("***************");
                            if (String(u.id) == String(currentUser.id)) return null;
                            return <Button onPress={() => this.startCall(u)} title={`Call ${u.name}`} key={i} />
                        })} */}
                    </View>}

                    {isLogging &&
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Connecting...</Text>
                            <ActivityIndicator size="small" color="#1198d4" />
                        </View>
                    }

                    {loading && <Text>{loading}</Text>}

                    {(!currentUser && !isLogging) && <Button onPress={() => this.autoLoginToConnecty()} title={`Logg In`} />}

                    {/* {isLogging && 
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{isLogging ? 'Connecting... ' : 'Video Chat'}</Text>
                            {isLogging && <ActivityIndicator size="small" color="#1198d4" />}
                        </View>
                    } */}

                    {/* {!currentUser && <AuthScreen />} */}

                </ScrollView>
            </View>

            <Modal {...modalProps} visible={(streams && streams.length > 0) ? true : false}>
                <View style={styles.modalContainer}>
                    {(streams && streams.length > 0) && <RTCViewGrid streams={streams} />}
                    <ToolBar
                        selectedUsersIds={(targetUser && targetUser.id) ? [targetUser.id] : undefined}
                        localStream={localStream}
                        isActiveCall={isActiveCall}
                        initRemoteStreams={this.initRemoteStreams}
                        setLocalStream={this.setLocalStream}
                        resetState={this.resetState}
                        stopCall={this.stopCall}
                        startCall={this.startCall}
                        callType={callType}
                        timer={timer}
                        opponentsName={opponentsName}
                    />
                </View>
            </Modal>

            {/* Incomming Message Screen */}
            <Modal animationType="slide" transparent={true} visible={isIncomingCall}>
                <View style={[styles.modalContainer, styles.center_middle, styles.semiTransparentBg]}>
                    <View style={{ width: '100%' }}>
                        <Text style={{ textAlign: "center", fontSize: 18, color: '#FFF' }}>{`Incoming ${callType} call from ${opponentsName}`}</Text>
                        <Row>
                            <Col flex="50%" style={{ padding: 10 }} align="center">
                                <Button onPress={this._onPressAccept} _title="Accept" style={{ backgroundColor: "green", borderRadius: 50, borderColor: "#FFF" }} textStyle={{ color: '#FFF' }}>
                                    {/* <MaterialIcon name={'call'} size={50} color="white" /> */}
                                    <Icon name="call" type="material" size={50} color={'#FFFFFF'} />
                                </Button>
                            </Col>
                            <Col flex="auto" style={{ padding: 10 }} align="center">
                                <Button onPress={this._onPressReject} _title="Accept" style={{ backgroundColor: "red", borderRadius: 50, borderColor: "#FFF" }} textStyle={{ color: '#FFF' }}>
                                    {/* <MaterialIcon name={'call-end'} size={50} color="white" /> */}
                                    <Icon name="call-end" type="material" size={50} color={'#FFFFFF'} />
                                </Button>
                                {/* <Button onPress={this._onPressReject} title="Reject" style={{ backgroundColor: "red" }} textStyle={{ color: '#FFF' }} /> */}
                            </Col>
                        </Row>
                    </View>
                </View>
            </Modal>


        </>)
    }
}


const styles = new StyleSheet.create({
    modalContainer: {
        backgroundColor: 'black',
        flex: 1,
    },
    center_middle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    semiTransparentBg: {
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

})