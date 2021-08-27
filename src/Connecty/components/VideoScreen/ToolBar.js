import React, {Component} from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text } from 'react-native';
import {CallService} from '../../services';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Icon,Avatar } from "react-native-elements";


export default class ToolBar extends Component {
  state = {  isAudioMuted: false,  isFrontCamera: true, isCameraMuted: false, seconds: 0, minutes:0 };

  constructor(props){
    super(props);
    // this.muteUnmuteAudio = this.muteUnmuteAudio.bind(this);
    this.RenderMuteButton = this.RenderMuteButton.bind(this);
    this.RenderCallStartStopButton = this.RenderCallStartStopButton.bind(this);
    this.RenderSwitchVideoSourceButton = this.RenderSwitchVideoSourceButton.bind(this);
    this.RenderMuteCamerButton = this.RenderMuteCamerButton.bind(this);
  }

  RenderMuteCamerButton(){
    const { isCameraMuted } = this.state;
    const type = isCameraMuted ? 'videocam-off' : 'video-call';

    const muteUnmuteCamera = () => {
      this.setState(prevState => {
        const mute = !prevState.isCameraMuted;
        CallService.setCameraMuteState(mute);
        return { isCameraMuted: mute };
      });
    };

    return (<View style={styles.toolBarItem}>
      <TouchableOpacity style={[styles.buttonContainer, styles.buttonMute]} onPress={muteUnmuteCamera}>
        <Icon name={type} type="material" size={32} color={'#FFFFFF'} />
      </TouchableOpacity>
    </View>);
  }

  RenderMuteButton(){
    // const { isActiveCall } = this.props;
    const { isAudioMuted } = this.state;
    const type = isAudioMuted ? 'mic-off' : 'mic';

    const muteUnmuteAudio = () => {
      this.setState(prevState => {
        const mute = !prevState.isAudioMuted;
        CallService.setAudioMuteState(mute);
        return { isAudioMuted: mute };
      });
    };

    return (<View style={styles.toolBarItem}>
      <TouchableOpacity style={[styles.buttonContainer, styles.buttonMute]} onPress={muteUnmuteAudio}>
        {/* <MaterialIcon name={type} size={32} color="white" /> */}
        <Icon name={type} type="material" size={32} color={'#FFFFFF'} />
      </TouchableOpacity>
    </View>);
  }

  RenderCallStartStopButton(isCallInProgress){
    // const startCall = () => {
    //   const { selectedUsersIds, initRemoteStreams, setLocalStream, } = this.props;

    //   if (selectedUsersIds.length === 0) {
    //     CallService.showToast('Select at less one user to start Videocall');
    //   } else {
    //     initRemoteStreams(selectedUsersIds);
    //     CallService.startCall(selectedUsersIds).then(setLocalStream);
    //   }
    // };

    // const stopCall = () => {
    //   const { resetState } = this.props;

    //   CallService.stopCall();
    //   resetState();
    // };

    const { startCall, stopCall } = this.props;
    const style = isCallInProgress ? styles.buttonCallEnd : styles.buttonCall;
    const onPress = isCallInProgress ? stopCall : startCall;
    const type = isCallInProgress ? 'call-end' : 'call';

    return (<View style={styles.toolBarItem}>
      <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
        {/* <MaterialIcon name={type} size={32} color="white" /> */}
        <Icon name={type} type="material" size={32} color={'#FFFFFF'} />
      </TouchableOpacity>
    </View>);
  }

  RenderSwitchVideoSourceButton(){
    const { isFrontCamera } = this.state;
    const { localStream } = this.props;
    const type = isFrontCamera ? 'camera-rear' : 'camera-front';

    const switchCamera = () => {
      CallService.switchCamera(localStream);
      this.setState(prevState => ({ isFrontCamera: !prevState.isFrontCamera }));
    };

    return (<View style={styles.toolBarItem}>
      <TouchableOpacity style={[styles.buttonContainer, styles.buttonSwitch]} onPress={()=>switchCamera()}>
        {/* <MaterialIcon name={type} size={32} color="white" /> */}
        <Icon name={type} type="material" size={32} color={'#FFFFFF'} />
      </TouchableOpacity>
    </View>);

  }
  componentDidMount() {
    this.myInterval = setInterval(() => {
        const { seconds, minutes } = this.state

        if (seconds < 60) {
          if(this.props.timer){
            this.setState(({ seconds }) => ({
                seconds: seconds + 1
            }))
          }
        }
        if (seconds === 60) {
                this.setState(({ minutes }) => ({
                    minutes: minutes + 1,
                    seconds: 0
                }))
        } 
    }, 1000)
}


  render() {
    const { selectedUsersIds,callType ,isActiveCall, timer,opponentsName} = this.props;
    const {seconds,minutes}= this.state

    return (
      <View style={[styles.container, {height: callType == 'video'? 140:'70%' }]}>
        {/* {selectedUsersIds.map((u, i) => {
          return <View key={i} style={{ borderWidth: 1, marginVertical: 20 }}><Text>{u}</Text></View>
        })} */}
        {callType != 'video' &&  <View style={{alignItems: 'center'}}>
      <Avatar
          rounded
          icon={{ type: 'font-awesome'}}
          size={170}/>

          <Text style={{color: 'white',textAlign: "center", fontSize:18,marginTop: 20}}>{opponentsName}</Text>
       </View>
       }
       <View style={{justifyContent: 'center',}} >
        <View style={{height: 70,justifyContent: 'center',alignItems: 'center'}}>
        <Text style={{color: 'white',fontSize:40}}> {`${minutes.toString().padStart(2, 0)} : ${seconds.toString().padStart(2, 0)}` }</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <this.RenderMuteButton />
        <this.RenderCallStartStopButton />
       { callType == 'video' && <this.RenderSwitchVideoSourceButton />}
       { callType == 'video' && <this.RenderMuteCamerButton/>}
       </View>
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    // top:100,
    left: 0,
    right: 0,
    height: 140,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 100,
  },
  toolBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCall: {
    backgroundColor: 'green',
  },
  buttonCallEnd: {
    backgroundColor: 'red',
  },
  buttonMute: {
    backgroundColor: 'blue',
  },
  buttonSwitch: {
    backgroundColor: 'orange',
  },
});
