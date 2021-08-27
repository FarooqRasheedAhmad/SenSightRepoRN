import ConnectyCube from 'react-native-connectycube';
import config from '../config';
import { EventRegister } from 'react-native-event-listeners'

export default class AuthService {
  static isLoggedIn = false;

  init = () => ConnectyCube.init(...config);

  login = ({id, password}) => {
    // console.log("************** AuthService() ************");
    // console.log(JSON.stringify({ id, password }, 0, 2));
    // // console.log(JSON.stringify(user, 0, 2));
    // console.log("**************************");
    this.isLoggedIn = false;

    return new Promise((resolve, reject) => {
      ConnectyCube.createSession({ id, password })
        .then(() =>
          ConnectyCube.chat.connect({
            userId: id, //user.id,
            password: password, //user.password,
          }),
        )
        .then(r=>{
          // console.log("r: ", r);
          this.isLoggedIn = true;
          resolve(r);
        })
        .catch(r=>{
          console.log("r: ", r);
          this.isLoggedIn = false;
          reject(r)
        }
        );
    });
  };

  logout = () => {
    console.log("============== AuthService.logout() ================");
    this.isLoggedIn = false;

    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
    this._removeListeners();
    EventRegister.emit('onLoggedOutFromConnecty', {})
  };

  _removeListeners() {
    if (!ConnectyCube.videochat) return;
    ConnectyCube.videochat.onCallListener = undefined;
    ConnectyCube.videochat.onAcceptCallListener = undefined;
    ConnectyCube.videochat.onRejectCallListener = undefined;
    ConnectyCube.videochat.onStopCallListener = undefined;
    ConnectyCube.videochat.onUserNotAnswerListener = undefined;
    ConnectyCube.videochat.onRemoteStreamListener = undefined;
  }

}
