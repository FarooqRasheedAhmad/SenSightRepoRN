import React, { Component } from 'react'
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native'
import ConnectyCube from 'react-native-connectycube';
import config, { users } from './config'

const Button = props => {
    return <TouchableHighlight {...props} style={{borderWidth:1, borderRadius:5, padding:5, backgroundColor:"#EEE", margin:5, ...props.style}}>
        <Text style={{ fontSize: 18, textAlign:"center", ...props.textStyle}}>{props.title}</Text>
    </TouchableHighlight>
}


export default class Connecty extends Component {
    state = { logs:[]  }

    constructor(props){
        super(props);
        // ConnectyCube.init(...config);
        // // console.log(">>>>>>>>>>>>>>>>>>>> ConnectyCube: ", ConnectyCube);
        // for (let a in ConnectyCube){
        //     console.log("===================");
        //     console.log(`${a} : `, ConnectyCube[a]);
        //     console.log("--------");
        // }
    }

    componentDidMount(){
        // for (let a in ConnectyCube){
        //     console.log("===================");
        //     console.log(`${a} : `, ConnectyCube[a]);
        //     console.log("--------");
        // }

        const user = users[0];

        // Logging in
        ConnectyCube.createSession(user)
            .then(() =>{
                this.setState(prevState => ({ logs: [...prevState.logs, "Session created"], }));
                ConnectyCube.chat.connect({ userId: user.id, password: user.password, })
            })
            .then((r)=>{
                this.setState(prevState => ({
                    logs: [...prevState.logs, `Logging in as ${JSON.stringify(user)}`],
                }));

                this._setUpListeners()
                // console.log("=========== Session created ===========");
                // this.setState({ logs: this.state.slice().push("Session created") });
            })
            .catch(err=>{
                this.setState(prevState => ({ logs: [...prevState.logs, `Error in logging ${JSON.stringgify(err)}`], }));
                console.log(" ======= ERROR =======");
                console.log(err);
                console.log(" ======= END ERROR =======");
            });

    }

    _test(){
        if (!ConnectyCube.videochat) {
            alert("No ConnectyCube.videochat")
            return false;
        }
        return true;
    }

    _setUpListeners(){
        if(!this._test()){
            return;
        }
        ConnectyCube.videochat.onCallListener = ()=>{
            console.log("onCallListener");
        };
        ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
        ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
        ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
        ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
        ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;

    }


    render() {
        const { logs } = this.state;

        return (<>
            <View style={styles.container}>
                <Button onPress={() => this._test()} title="_test" />

                {logs.map((l,i)=>{
                    return <Text key={i}>- {l}</Text>
                })}
            </View>
        </>)
    }
}


const styles = new StyleSheet.create({
    container:{
        marginTop: 40, marginBottom: 20, marginHorizontal: 10, borderWidth: 1, flex: 1
    },
    modalContainer:{
        flex:1,
        padding:40,
    },
})