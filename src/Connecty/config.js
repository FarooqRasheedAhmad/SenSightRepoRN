export default [
  {
    appId: 4407,
    authKey: "f2dzm2XKU-hU6wE",
    authSecret: "8S5QF-3ST249HtU"
  },
  {
    debug: {mode: 1},
    // on: {
    //   sessionExpired: (handleResponse, retry) => {
    //     // call handleResponse() if you do not want to process a session expiration,
    //     // so an error will be returned to origin request
    //     // handleResponse();
  
    //     ConnectyCube.createSession()
    //       .then(retry)
    //       .catch((error) => { });
    //   },
    // },
  },
];

export const DEFAULT_PASSWORD = "test1234";
export const USERS_URL = "https://api.connectycube.com/users";

export const users = [
  {
    id: 4184244,
    name: 'Faheem Individual',
    login: 'faheem_ind@getnada.com',
    password: DEFAULT_PASSWORD,
    color: '#077988',
  },
  {
    id: 4189699,
    name: 'Faheem Caregiver',
    login: 'faheem_caregiver@getnada.com',
    password: DEFAULT_PASSWORD,
    color: '#077988',
  },
];
