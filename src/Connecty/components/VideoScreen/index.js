import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableHighlight, Modal } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import RTCViewGrid from './RTCViewGrid';
import {CallService, AuthService} from '../../services';
import ToolBar from './ToolBar';
import UsersSelect from './UsersSelect';
import { users } from '../../config'

const Button = props => {
  return <TouchableHighlight {...props} style={{ borderWidth: 1, borderRadius: 5, padding: 5, backgroundColor: "#EEE", margin: 5, ...props.style }}>
    <Text style={{ fontSize: 18, textAlign: "center", ...props.textStyle }}>{props.title}</Text>
  </TouchableHighlight>
}


export default class VideoScreen extends React.Component {
  constructor(props) {
    super(props);

    this._session = null;
    // this.opponentsIds = props.navigation.getParam('opponentsIds');

    this.state = { localStream: null, remoteStreams: [], selectedUsersIds: [], 
      isActiveSelect: true, isActiveCall: false, isIncomingCall: false, showVideoCallScreen:false,
      targetUsers:null,
    };

    // this._setUpListeners();
  }

  componentWillUnmount() {
    CallService.stopCall();
    AuthService.logout();
  }

  componentDidUpdate(prevProps, prevState) {
    const currState = this.state;

    if (
      prevState.remoteStreams.length === 1 &&
      currState.remoteStreams.length === 0
    ) {
      CallService.stopCall();
      this.resetState();
    }
  }

  // showInomingCallModal = session => {
  //   this._session = session;
  //   this.setState({isIncomingCall: true});
  // };

  // hideInomingCallModal = () => {
  //   this._session = null;
  //   this.setState({isIncomingCall: false});
  // };

  selectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: [...prevState.selectedUsersIds, userId],
    }));
  };

  unselectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: prevState.selectedUsersIds.filter(id => userId !== id),
    }));
  };

  closeSelect = () => {
    this.setState({isActiveSelect: false});
  };

  setOnCall = () => {
    this.setState({isActiveCall: true});
  };

  // initRemoteStreams = opponentsIds => {
  //   const emptyStreams = opponentsIds.map(userId => ({
  //     userId,
  //     stream: null,
  //   }));

  //   this.setState({remoteStreams: emptyStreams});
  // };

  // updateRemoteStream = (userId, stream) => {
  //   this.setState(({remoteStreams}) => {
  //     const updatedRemoteStreams = remoteStreams.map(item => {
  //       if (item.userId === userId) {
  //         return {userId, stream};
  //       }

  //       return {userId: item.userId, stream: item.stream};
  //     });

  //     return {remoteStreams: updatedRemoteStreams};
  //   });
  // };

  // removeRemoteStream = userId => {
  //   this.setState(({remoteStreams}) => ({
  //     remoteStreams: remoteStreams.filter(item => item.userId !== userId),
  //   }));
  // };

  // setLocalStream = stream => {
  //   this.setState({localStream: stream});
  // };

  // resetState = () => {
  //   this.setState({
  //     localStream: null,
  //     remoteStreams: [],
  //     selectedUsersIds: [],
  //     isActiveSelect: true,
  //     isActiveCall: false,
  //   });
  // };

  // _setUpListeners() {
  //   // console.log("======================================");
  //   // console.log("ConnectyCube.videochat: ", ConnectyCube.videochat);
  //   // console.log("======================================");
  //   if (!ConnectyCube.videochat){
  //     alert("ConnectyCube.videochat not found!");
  //     return;
  //   }
  //   ConnectyCube.videochat.onCallListener = this._onCallListener;
  //   ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
  //   ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
  //   ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
  //   ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
  //   ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
  // }

  // _onCallListener = (session, extension) => {
  //   alert("_onCallListener()");

  //   // CallService.processOnCallListener(session)
  //   //   .then(() => this.showInomingCallModal(session))
  //   //   .catch(this.hideInomingCallModal);
  // };

  // _onAcceptCallListener = (session, userId, extension) => {
  //   CallService.processOnAcceptCallListener(session, userId, extension)
  //     .then(this.setOnCall)
  //     .catch(this.hideInomingCallModal);
  // };

  // _onRejectCallListener = (session, userId, extension) => {
  //   CallService.processOnRejectCallListener(session, userId, extension)
  //     .then(() => this.removeRemoteStream(userId))
  //     .catch(this.hideInomingCallModal);
  // };

  // _onStopCallListener = (session, userId, extension) => {
  //   const isStoppedByInitiator = session.initiatorID === userId;

  //   CallService.processOnStopCallListener(userId, isStoppedByInitiator)
  //     .then(() => {
  //       if (isStoppedByInitiator) {
  //         this.resetState();
  //       } else {
  //         this.removeRemoteStream(userId);
  //       }
  //     })
  //     .catch(this.hideInomingCallModal);
  // };

  // _onUserNotAnswerListener = (session, userId) => {
  //   CallService.processOnUserNotAnswerListener(userId)
  //     .then(() => this.removeRemoteStream(userId))
  //     .catch(this.hideInomingCallModal);
  // };

  // _onRemoteStreamListener = (session, userId, stream) => {
  //   CallService.processOnRemoteStreamListener(userId)
  //     .then(() => {
  //       this.updateRemoteStream(userId, stream);
  //       this.setOnCall();
  //     })
  //     .catch(this.hideInomingCallModal);
  // };


  _onPressAccept = () => {
    CallService.acceptCall(this._session).then(stream => {
      const { opponentsIDs, initiatorID, currentUserID } = this._session;
      const opponentsIds = [initiatorID, ...opponentsIDs].filter(
        userId => currentUserID !== userId,
      );

      this.initRemoteStreams(opponentsIds);
      this.setLocalStream(stream);
      this.closeSelect();
      this.hideInomingCallModal();
    });
  };

  _onPressReject = () => {
    CallService.rejectCall(this._session);
    this.hideInomingCallModal();
  };

  toggleVideoScreen() {
    this.setState({ showVideoCallScreen: !this.state.showVideoCallScreen });
  }

  selectUser = (user) => {
    this.setState({ targetUsers:[user] });
  }


  render() {
    const { localStream, remoteStreams, selectedUsersIds, isActiveSelect, isActiveCall, isIncomingCall, 
      showVideoCallScreen, targetUsers,
    } = this.state;
    const { currentUser } = this.props;

    // const initiatorName = isIncomingCall ? CallService.getUserById(this._session.initiatorID, 'name') : '';
    const localStreamItem = localStream ? [{userId: 'localStream', stream: localStream}] : [];
    const streams = [...remoteStreams, ...localStreamItem];

    // CallService.setSpeakerphoneOn(remoteStreams.length > 0);

    return(<>
      <View style={styles.container}>
        <Text>Video Screen</Text>
        <Button onPress={this.props.onClose} title="X" />

        <Text style={{padding:20}}>You are {currentUser.name}</Text>

        {/* {currentUser.map((u,i)=>{
          return <View key={i}><Text></Text></View>
        })} */}

        <ToolBar
          // selectedUsersIds={targetUsers.map(u=>u.id)}
          selectedUsersIds={[]}
          localStream={localStream}
          isActiveSelect={isActiveSelect}
          isActiveCall={isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
        />

      </View>
    </>)

    return(<>
      <View style={{ flex: 1, backgroundColor: '#EEE' }}>
        <Text>Video Screen</Text>

        {/* <RTCViewGrid streams={streams} /> */}

        {!targetUsers && users.map((u,i)=>{
          if (this.props.currentUser.id == u.id) return null;
          return (<Button key={i} onPress={() => this.selectUser(u)} title={`Call ${u.name}`} />)
        })}

        {targetUsers && <View>
          <Text>Target Users:</Text>
          {/* {targetUsers.map((u, i)=>{
            return <View key={i} style={{borderWidth:1, marginVertical:20}}><Text>{u.name}</Text></View>
          })} */}

          <ToolBar
            selectedUsersIds={targetUsers.map(u => u.id)}
            // selectedUsersIds={selectedUsersIds}
            localStream={localStream}
            isActiveSelect={isActiveSelect}
            isActiveCall={isActiveCall}
            closeSelect={this.closeSelect}
            initRemoteStreams={this.initRemoteStreams}
            setLocalStream={this.setLocalStream}
            resetState={this.resetState}
          />

        </View>}


        {/* <UsersSelect
          isActiveSelect={isActiveSelect}
          // opponentsIds={this.opponentsIds}
          opponentsIds={users}
          selectedUsersIds={selectedUsersIds}
          selectUser={this.selectUser}
          unselectUser={this.unselectUser}
        /> */}

        {/* <ToolBar
          selectedUsersIds={selectedUsersIds}
          localStream={localStream}
          isActiveSelect={isActiveSelect}
          isActiveCall={isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
        /> */}


        {/* Incomming Message Screen */}
        <Modal {...modalProps} visible={isIncomingCall} _onRequestClose={() => this.setState({ isIncomingCall: !isIncomingCall })}>
          <View style={styles.modalContainer}>
            <Text>Incomming Message</Text>
            <Button onPress={() => this.setState({ isIncomingCall: !isIncomingCall})} title="X" />
          </View>
        </Modal>

      </View>
    </>)


    return (<>
      <View style={{flex: 1, backgroundColor: '#EEE'}}>
        {/* <TouchableHighlight style={{borderWidth:5}} onPress={()=>{
          const _keys = Object.keys(ConnectyCube);
          console.log(JSON.stringify(_keys, 0, 2));
          for (let a in _keys){
            console.log(">>>>>>>>>>>>>>>>>>")
            console.log(`${_keys[a]} ) `, ConnectyCube[_keys[a]])
            console.log("<<<<<<")
          }
        }}><Text>videochat</Text></TouchableHighlight> */}
        <RTCViewGrid streams={streams} />
        <UsersSelect
          isActiveSelect={isActiveSelect}
          // opponentsIds={this.opponentsIds}
          opponentsIds={users}
          selectedUsersIds={selectedUsersIds}
          selectUser={this.selectUser}
          unselectUser={this.unselectUser}
        />
        <ToolBar
          selectedUsersIds={selectedUsersIds}
          localStream={localStream}
          isActiveSelect={isActiveSelect}
          isActiveCall={isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
        />
        <AwesomeAlert
          show={isIncomingCall}
          showProgress={false}
          title={`Incoming call from ${initiatorName}`}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Reject"
          confirmText="Accept"
          cancelButtonColor="red"
          confirmButtonColor="green"
          onCancelPressed={this._onPressReject}
          onConfirmPressed={this._onPressAccept}
          onDismiss={this.hideInomingCallModal}
          alertContainerStyle={{zIndex: 1}}
          titleStyle={{fontSize: 21}}
          cancelButtonTextStyle={{fontSize: 18}}
          confirmButtonTextStyle={{fontSize: 18}}
        />
      </View>

      {/* Incomming Message Screen */}
      {/* <Modal {...modalProps} visible={isIncomingCall} _onRequestClose={() => this.setState({ isIncomingCall: !isIncomingCall })}>
        <View style={styles.modalContainer}>
          <Text>Incomming Message</Text>
          <Button onPress={() => this.setState({ isIncomingCall: !isIncomingCall})} title="X" />
        </View>
      </Modal> */}

      {/* Video Screen Modal */}
      {/* <Modal {...modalProps} visible={showVideoCallScreen} onRequestClose={() => this.toggleVideoScreen()}>
        <View style={styles.modalContainer}>
          <Text>Video Call Screen</Text>
          <Button onPress={this.toggleVideoScreen} title="X" />
        </View>
      </Modal> */}


    </>);
  }
}

const modalProps = {
  animationType: "slide", transparent: false,
}


const styles = new StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#EEE",
    marginTop:30,
  },



  modalContainer: {
    flex: 1,
    padding: 40,
  },
})