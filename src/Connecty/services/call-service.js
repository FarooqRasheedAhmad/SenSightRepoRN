import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';
import Snackbar from "react-native-snackbar";
import ConnectyCube from 'react-native-connectycube';
import InCallManager from 'react-native-incall-manager';
import Sound from 'react-native-sound';
import { users } from '../config';

export default class CallService {
  static MEDIA_OPTIONS = { audio: true, video: { facingMode: 'user' } };

  _session = null;
  mediaDevices = [];

  outgoingCall = new Sound(require('../assets/sounds/dialing.mp3'));
  incomingCall = new Sound(require('../assets/sounds/calling.mp3'));
  endCall = new Sound(require('../assets/sounds/end_call.mp3'));

  showToast = text => {
    const options = { 
      duration: Snackbar.LENGTH_LONG,
    }
    Snackbar.show({ text: text, ...options });
    // const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;
    // commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  // getUserById = (userId, key) => {
  //   // const user = users.find(user => user.id == userId);

  //   user = {
  //     id: 1111111,
  //     name: '1111111',
  //     login: '1111111@getnada.com',
  //     password: "1111111",
  //     color: '#077988',
  //   }

  //   if (typeof key === 'string') {
  //     return user[key];
  //   }

  //   return user;
  // };

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then(mediaDevices => {
      this.mediaDevices = mediaDevices;
    });
  }

  acceptCall = session => {
    console.log("**************** acceptCall() *************");
    console.log(session);
    console.log("****************");

    this.stopSounds();
    this._session = session;
    this.setMediaDevices();
    const media_option = {...CallService.MEDIA_OPTIONS, video: session.callType == 1? CallService.MEDIA_OPTIONS.video : false  }
    return this._session
      .getUserMedia(media_option)
      .then(stream => {
        this._session.accept({});
        return stream;
      });
  };

  startCall = (ids, _type='video') => {
    console.log("**************** startCall() *************");
    console.log({ ids, _type });

    const options = { some:"hello world" };
    // const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
    const type = _type == 'video' ? ConnectyCube.videochat.CallType.VIDEO : ConnectyCube.videochat.CallType.AUDIO; // AUDIO is also possible

    this._session = ConnectyCube.videochat.createNewSession(ids, type, options);
    this.setMediaDevices(_type);
    this.playSound('outgoing');

    return this._session
      .getUserMedia({ ...CallService.MEDIA_OPTIONS, video: (_type == 'video') ? CallService.MEDIA_OPTIONS.video : false})
      .then(stream => {
        this._session.call({});
        return stream;
      });
  };

  stopCall = () => {
    this.stopSounds();

    if (this._session) {
      this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
  };

  rejectCall = (session, extension) => {
    this.stopSounds();
    session.reject(extension);
  };

  setAudioMuteState = mute => {
    if (mute) {
      this._session.mute('audio');
    } else {
      this._session.unmute('audio');
    }
  };

  setCameraMuteState = mute => {
    if (mute) {
      this._session.mute('video');
    } else {
      this._session.unmute('video');
    }
  };

  switchCamera = localStream => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  muteCamera = mute => {
    if (mute) this._session.mute('video');
    else this._session.unmute('video');
  }

  setSpeakerphoneOn = flag => InCallManager.setSpeakerphoneOn(flag);

  processOnUserNotAnswerListener(userId) {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} did not answer`;

        this.showToast("Call not answered");

        resolve();
      }
    });
  }

  processOnCallListener(session) {
    return new Promise((resolve, reject) => {
      if (session.initiatorID === session.currentUserID) {
        console.log("ERROR: your cant call your own ID");
        reject();
      }

      if (this._session) {
        this.rejectCall(session, { busy: true });
        reject();
      }

      this.playSound('incoming');

      resolve();
    });
  }

  processOnAcceptCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        this.showToast('You have accepted the call on other side');
        this.stopSounds();
        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} has accepted the call`;
        
        this.showToast("Call accepted");
        
        this.stopSounds();

        resolve();
      }
    });
  }

  processOnRejectCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        this.showToast('You have rejected the call on other side');

        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = extension.busy
        //   ? `${userName} is busy`
        //   : `${userName} rejected the call request`;

        const message = extension.busy ? `User is busy` : `Call rejected`;

        this.showToast(message);

        resolve();
      }
    });
  }

  processOnStopCallListener(userId, isInitiator) {
    return new Promise((resolve, reject) => {
      this.stopSounds();

      if (!this._session) {
        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} has ${
        //   isInitiator ? 'stopped' : 'left'
        //   } the call`;

        const message = `User has ${isInitiator ? 'stopped' : 'left'} the call`;

        this.showToast(message);

        resolve();
      }
    });
  }

  processOnRemoteStreamListener = () => {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        resolve();
      }
    });
  };

  playSound = type => {
    switch (type) {
      case 'outgoing':
        this.outgoingCall.setNumberOfLoops(-1);
        this.outgoingCall.play();
        break;
      case 'incoming':
        this.incomingCall.setNumberOfLoops(-1);
        InCallManager.startRingtone('_DEFAULT_');
        // this.incomingCall.play();
        break;
      case 'end':
        this.endCall.play();
        InCallManager.stopRingtone();
        break;

      default:
        break;
    }
  };

  stopSounds = () => {
    if (this.incomingCall.isPlaying()) {
      this.incomingCall.pause();
    }else{
      InCallManager.stopRingtone();
    }
    if (this.outgoingCall.isPlaying()) {
      this.outgoingCall.pause();
    }
  };
}
