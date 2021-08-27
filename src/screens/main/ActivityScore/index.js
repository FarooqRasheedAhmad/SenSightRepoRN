import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, AppState } from 'react-native'
import Modal from 'react-native-modal';
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer';
import { StorageUtils, AppConstants } from "../../../utils";
import DailyActivityScreen from './containers/DailyActivityScreen'
import WeeklyActivityScreen from './containers/WeeklyActivityScreen'
import { theme } from "../../../theme";
import { Row, Col } from '../../../components'
import { ScrollView } from 'react-native-gesture-handler';

// import AsyncStorage from "@react-native-community/async-storage";

const ACTIVITY_KEY = "activityScore";
const activityCheck_Interval = 1.5;

// StorageUtils.storeInStorage(AppConstants.SP.ROLE, json.role)

export class ActivityScore extends Component {
    constructor(props){
        super(props);
        this.checkActivity = this.checkActivity.bind(this);
        this.chkDailyActivity = this.chkDailyActivity.bind(this);
        this.chkWeeklyActivity = this.chkWeeklyActivity.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
    }

    timout=null;
    mounted = false;
    intervalId = null;
    dailyActivationTime = 9;
    weeklyActivationTime = 10;
    state = { showModal: false, activityStatus: [], appState: AppState.currentState, logs:[] };

    async componentDidMount(){
        // await StorageUtils.remove(ACTIVITY_KEY);
        // let records = await StorageUtils.getValue(ACTIVITY_KEY);
        // console.log("records: ", records);
        
        this.mounted = true;
      //  AppState.addEventListener("change", this._handleAppStateChange);

        // BackgroundTimer.runBackgroundTimer(() => {
        //     this.chkDailyActivity();
        // }, (30 * 60 * 1000));

        // this.checkActivity();
        // setTimeout(this.chkDailyActivity, (1 * 1000));
        if (this.interval) clearInterval(this.interval)
        this.timout = setTimeout( () => {
            this.interval = setInterval(() => this.checkActivity(), activityCheck_Interval * 60 * 1000)
        }, activityCheck_Interval * 60 * 1000 );
    }
    componentWillUnmount() {
        this.mounted = false;
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        // console.log("ActivityScore:::::::: _handleAppStateChange()");
        
        if ( this.state.appState.match(/inactive|background/) && nextAppState === "active" ) {
            // console.log("ActivityScore:::::::: App has come to the foreground!");
            this.checkActivity();
        }
        this.setState({ appState: nextAppState });
    };

    /****
     * updateActivity({daily:{}, weekly:{}})
     */
    updateActivity = async args => {
        const defaultLog = {
            date: moment().format(),
        }

        if (!args.daily && !args.weekly) {
            // console.log("ActivityScore:::::::: ", "No daily or weekly data provided");
            return;
        }

        let records = await StorageUtils.getValue(ACTIVITY_KEY);
        let email = await StorageUtils.getValue(AppConstants.SP.EMAIL);
        records = records ? JSON.parse(records) : {};
        Object.assign(records, { email });

        if (args.daily) Object.assign(records, { daily: { ...args.daily, ...defaultLog } })
        if (args.weekly) Object.assign(records, { weekly: { ...args.weekly, ...defaultLog } })

        await StorageUtils.storeInStorage(ACTIVITY_KEY, JSON.stringify(records))
    }

    onActivityUpdated = async type => {
        if(type=='daily'){
            await this.updateActivity({daily:{updated:1}})
            this.chkWeeklyActivity();
        }
        if (type == 'weekly') await this.updateActivity({ weekly:{updated:1}})

        this.setState({ showModal: false });
    }

    async verifyUser() {
        // remove if email does not match
        let email = await StorageUtils.getValue(AppConstants.SP.EMAIL);
        let records = await StorageUtils.getValue(ACTIVITY_KEY);
        records = records ? JSON.parse(records) : {};
        if (records && records.email && records.email.length > 4 && email && records.email != email) {
            // console.log("Previus user found in activity, removing!!");
            await StorageUtils.remove(ACTIVITY_KEY);
            // Object.assign(records, {email});
            // await StorageUtils.storeInStorage(ACTIVITY_KEY, JSON.stringify(records))
        }
        return;
    }

    async checkActivity(){
        // console.log("ActivityScore:::::::: checkActivity()");
        // return;

        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
        const role = await StorageUtils.getValue(AppConstants.SP.ROLE);

        await this.verifyUser();


        if (!userId || userId<1){
            // console.log(`ActivityScore:::::::: Not logged in for daily activity, checking again in ${activityCheck_Interval} minute`);
            // this.timout = setTimeout( () => this.checkActivity(), 3000 );

            // if (this.interval) clearInterval(this.interval)
            // this.interval = setInterval(() => this.checkActivity(), 1 * 60 * 1000)

            return;
        }
        if (role !== 'senior'){
            // console.log("ActivityScore:::::::: Activity is only for senior accounts");
            return;
        }

        // console.log(`ActivityScore:::::::: Checking activity in : ${activityCheck_Interval} min`);
        this.chkDailyActivity();

        // if (this.interval) clearInterval(this.interval)
        // this.interval = setInterval(() => this.checkActivity(), activityCheck_Interval * 60 * 1000)

        // clearTimeout(this.timout);
        // this.timout = setTimeout(this.chkDailyActivity, (activityCheck_Interval * 60 * 1000));
        
        // console.log("checkActivity().userId: ", userId);
        // if (!userId || userId < 1){
        //     console.log(`Checking activity in : ${1 * 60 * 1000}`);
        //     setTimeout(this.checkActivity, (1 * 60 * 1000));
        // }else{
        //     // this.chkDailyActivity();
        //     setTimeout(this.chkDailyActivity, (1 * 60 * 1000));
        // }
    }

    async chkDailyActivity() {
        // console.log("ActivityScore:::::::: chkDailyActivity()");

        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
        const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
        // if (role!=='senior') return;

        // console.log("userId: ", userId);
        if (!userId || userId<1) return;
        
        // console.log("Checking daily activity")

        let isSameDay = false;
        if(this.state.showModal) return;

        let records = await StorageUtils.getValue(ACTIVITY_KEY);
            records = records ? JSON.parse(records) : {};
            
        let lastHB = (records.daily && records.daily.date) ? moment(records.daily.date) : false;
        var now = moment(); // moment(lastHB).add(1, 'm'); // moment(); //todays date

        // console.log(`Last check: ${lastHB ? lastHB.format() : "never"}`);
        
        
        if (lastHB){
            var duration = moment.duration(now.diff(lastHB));
            var dateDifference = duration.asDays();
            // console.log("Last: ", lastHB.format());
            // console.log("NOW : ", now.format());
            // console.log("dateDifference: ", dateDifference);
            
            // Check date
            isSameDay = moment(lastHB.format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
        }
        else{
            // isSameDay = false;
        }

        // if (dateDifference<1){
        if (isSameDay){
            // console.log("================================");
            // console.log("Daily activity already performed");
            // console.log("================================");
            // console.log(`Daily activity already performed`)
            this.chkWeeklyActivity()
            return;
        }
        
        // check hour
        let thisHr = moment().hour();
        if (Number(thisHr) >= this.dailyActivationTime) {
            // console.log(`Daily Activity Due, show activity screen`)
            // console.log("its time");
            this.setState({ showModal:'daily' });
        }else{
            // console.log(`Activity is due for today but will display after ${this.dailyActivationTime}`)
        }
        // this.setState({ showModal: 'daily' });

    }

    async chkWeeklyActivity(){
        // console.log("ActivityScore:::::::: chkWeeklyActivity()");

        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
        if (!userId || userId < 1) return;
        // console.log("chkDailyActivity()");
        // BackgroundTimer.clearInterval(this.intervalId);

        // console.log(`Checking weekly activity`)

        let records = await StorageUtils.getValue(ACTIVITY_KEY);
            records = records ? JSON.parse(records) : {};
        let lastHB = (records.weekly && records.weekly.date) ? moment(records.weekly.date) : false;
        var now = moment(); // moment(lastHB).add(1, 'm'); // moment(); //todays date
        
        if (lastHB){
            let isSameWeek = lastHB.isSame(now, 'week'); //true if dates are in the same week
            if (!isSameWeek) this.setState({ showModal: 'weekly' });
            else{
                // console.log("================================");
                // console.log("WEEKLY activity already performed");
                // console.log("================================");
                // console.log(`WEEKLY activity already performed`)
            }
        }else{
            this.setState({ showModal: 'weekly' });
        }

    }

  render() {
      const { showModal } = this.state;

      return(<>
        {/* <View style={{height:150}}>
            <ScrollView>
                  <Text style={{ borderWidth: 1, borderColor: "#F00", padding: 5, backgroundColor: "#CCC" }}>{JSON.stringify(this.state.logs, 0, 2)}</Text>
            </ScrollView>
        </View> */}
          
        {showModal && <>
            <Modal isVisible={true} coverScreen={true} style={{ margin: 0, backgroundColor: "#FFF" }}>
                <View style={{ flex: 1, backgroundColor: "#FFF", width: "100%", paddingTop:50 }}>
                    {/* <Row>
                        <Col flex="auto"><Text style={{ color: '#EEE' }}>{`${showModal} activity`}</Text></Col>
                        <Col><TouchableOpacity style={{ padding: 5, margin: 5, borderWidth: 1, borderColor: "#CCC", borderRadius: 5 }} onPress={() => this.setState({ showModal: false })}><Text>Close</Text></TouchableOpacity></Col>
                    </Row> */}

                    <Text style={styles.title}>Activity Score Questionnaire ({showModal})</Text>
                    {(showModal && showModal != 'daily' && showModal != 'weekly') && <Text style={{ padding: 50 }}>:{showModal}</Text>}
                    {showModal == 'daily' && <DailyActivityScreen onClose={() => this.setState({ showModal: false })} onSuccess={() => this.onActivityUpdated('daily')} />}
                    {showModal == 'weekly' && <WeeklyActivityScreen onClose={() => this.setState({ showModal: false })} onSuccess={() => this.onActivityUpdated('weekly')} />}
                </View>
            </Modal>
        </>}

      </>)
      
    //   if (!showModal) return null;

        // return (<>
        //     {/* <Text style={{borderWidth:1, borderColor:"#F00", padding:5, backgroundColor:"#CCC", margin:20}}>{JSON.stringify(this.state.logs, 0, 2)}</Text> */}
        //     <Text style={{borderWidth:1, borderColor:"#F00", padding:5, backgroundColor:"#CCC", margin:20}}>hello world</Text>

        //     <Modal isVisible={true} coverScreen={true} style={{ margin: 0, backgroundColor:"#FFF" }}>
        //         <View style={{ flex: 1, backgroundColor: "#FFF", width:"100%" }}>
        //             <Row>
        //                 <Col flex="auto"><Text style={{ color: '#EEE' }}>{`${showModal} activity`}</Text></Col>
        //                 <Col><TouchableOpacity style={{padding:5, margin:5, borderWidth:1, borderColor:"#CCC", borderRadius:5}} onPress={() => this.setState({ showModal:false })}><Text>Close</Text></TouchableOpacity></Col>
        //             </Row>
                    
        //             <Text style={styles.title}>Activity Score Questionnaire ({showModal})</Text>
        //             {(showModal && showModal != 'daily' && showModal != 'weekly') && <Text style={{padding:50}}>:{showModal}</Text>}
        //             {showModal == 'daily' && <DailyActivityScreen onClose={() => this.setState({ showModal: false })} onSuccess={()=>this.onActivityUpdated('daily')} />}
        //             {showModal == 'weekly' && <WeeklyActivityScreen onClose={() => this.setState({ showModal: false })} onSuccess={()=>this.onActivityUpdated('weekly')} />}
        //         </View>
        //     </Modal>
        // </>)
  }
}


export default ActivityScore;

const styles = StyleSheet.create({
    title:{
        color: theme.colors.colorPrimary, fontSize: 30, fontWeight: "bold", textAlign: "center", lineHeight: 26, paddingVertical: 20
    },
    container:{
        position:"absolute", 
        top:0,
        borderWidth: 1,
        flex:1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: "#F00",
    },
});
