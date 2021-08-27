import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { theme } from "../../theme";
import { HeaderButton, Row, Col, NavigationHeaderV2, Contact } from '../../components'
import { GET_PATIENT_OVERVIEW } from '../../api';
import { AppConstants, StorageUtils, getAppUsers } from "../../utils";
import { sendRequest } from '../../apicall';
import _ from 'lodash'
import Spinner from "react-native-loading-spinner-overlay";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getLocalProfile } from '../../utils/fetcher';

const activityDisplayArray = [
    { key:'ActivityScore', title:'Activity Score'},
    { key:'RiskScore', title:'Risk Score'},
    { key:'HeartRate', title:'Heart Rate'},
    { key:'HRV', title:'HRV'},
    { key: 'BPSystolic', title:'Blood Pressure Systolic'},
    { key: 'BPDiastolic', title:'Blood Pressure Diastolic'},
    { key:'BloodGlucose', title:'Blood Glucose'},
    { key:'SpO2', title:'Oxygen Saturation'},
    { key:'Sleep', title:'Sleep'},
    { key:'BodyTemprature', title:'Body Temp'},
    { key:'StepCount', title:'Step Count'},
    { key:'BMIWeight', title:'Weight'}
]


const ListItem = ({data}) => {
    const [showActivity, setShowActivity] = React.useState(false)

    return <>
        <TouchableOpacity onPress={() => setShowActivity(!showActivity)} activeOpacity={0.5}>
            <Contact
                titleStyle={{ fontWeight: "100" }}
                desc="Offline"
                givenName={`${data.firstName} ${data.lastName}`}
                thumbnailPath={{ uri: data.profileImage }}
                />
        </TouchableOpacity>

        {showActivity && data.activity && data.activity.length>0 &&
            <View style={{marginLeft:60, marginTop:5}}>
            {console.log("data: ", data)}

            {activityDisplayArray.map((row, i)=>{
                let itm = data.activity.find(o => (o.title == row.key));
                if (!itm) return null;

                return (<Row key={i} style={{ marginBottom: 5 }}>
                    <Col valign="center"><View style={{ width: 30, height: 30, backgroundColor: itm.colorCode, borderRadius: 50 }} /></Col>
                    <Col valign="center" style={{ paddingHorizontal: 10 }}><Text>---</Text></Col>
                    <Col valign="center" flex="auto"><Text style={{ fontSize: 14 }}>{row.title}</Text></Col>
                </Row>)
            })}

            {/* {data.activity}
            itm.title==''
                <Row key={i} style={{ marginBottom: 5 }}>
                    <Col valign="center"><View style={{ width: 30, height: 30, backgroundColor: itm.colorCode, borderRadius: 50 }} /></Col>
                    <Col valign="center" style={{ paddingHorizontal: 10 }}><Text>---</Text></Col>
                    <Col valign="center" flex="auto"><Text style={{ fontSize: 14 }}>{itm.title}</Text></Col>
                </Row> */}



                {/* {data.activity.map((itm, i) => {
                    return (<Row key={i} style={{marginBottom:5}}>
                        <Col valign="center"><View style={{ width: 30, height: 30, backgroundColor: itm.colorCode, borderRadius:50}} /></Col>
                        <Col valign="center" style={{paddingHorizontal:10}}><Text>---</Text></Col>
                        <Col valign="center" flex="auto"><Text style={{fontSize:14}}>{itm.title}</Text></Col>
                    </Row>)
                })} */}
            </View>
        }
    </>
}

export class PatientOverviewList extends Component {
    state = { userList: null, busy: true, fatalError:null };
    role = null;

    async componentDidMount(){
        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID)
        this.role = StorageUtils.getValue(AppConstants.SP.ROLE);
        
        const localProfile = await getLocalProfile();
        console.log("=======localProfile: ", localProfile);

        let uri = GET_PATIENT_OVERVIEW(userId);

        sendRequest({ uri, method: 'get' }).then(results=>{
            console.log("results: ", results);

            if(results && results.errors){
                let errString = "";
                for (let a in results.errors) errString += `${a} = ${results.errors[a]}, `;

                this.setState({ fatalError: errString, busy: false });
            }


            if (!results || !_.isArray(results)){
                console.log("Patient Overview: ", results);
                return;
            }
            this.setState({ userList: results, busy:false });
        })

    }


    render() {
        const { busy, userList, fatalError } = this.state;
        const { navigation } = this.props;

        console.log("fatalError: ", fatalError);
        
        
        return (
            <View style={styles.root}>
                <Spinner visible={busy} />

                <NavigationHeaderV2 title='Patient Overview' allowBack navigation={this.props.navigation} rightComponent={<View style={{width:50}} />} />

                <View style={styles.container}>
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>

                        {this.state.fatalError && <Text style={{padding:10, fontSize:16, color:"#F00"}}>{this.state.fatalError}</Text>}

                        {userList && userList.length<1 && <Text style={{fontSize:18, padding:10, color:"#CCC", textAlign:"center"}}>Patient diary is empty</Text>}

                        {userList && userList.map((item, i) => {
                            console.log("item: ", item);
                            
                            return (<Row key={i} style={{ flexWrap: "nowrap" }}>
                                <Col flex="auto"><ListItem data={item} key={i} /></Col>
                                {/* <Col valign="center" style={{ paddingHorizontal: 0 }}>
                                    <TouchableOpacity onPress={console.log} activeOpacity={0.5} style={styles.menubutton}>
                                        <Icon name="phone" size={20} color="#CCC" />
                                    </TouchableOpacity>
                                </Col> */}
                                <Col style={{ paddingHorizontal: 10, paddingVertical:25 }}>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate("SeniorHome", {
                                            ...item,
                                            // seniorId: item.seniorId,
                                            seniorName: item.firstName + " " + item.lastName,
                                            seniorImg: item.profileImage,
                                            seniorGeofence: item.geofenceLimit,
                                            seniorPhone: item.phone,
                                            // noGoAreas: item.noGoAreas,
                                            role: this.role,
                                            // refreshSeniorsData: refreshSeniors
                                        });

                                    }} activeOpacity={0.5} style={styles.menubutton}>
                                        <Icon name="ellipsis-v" size={20} color="#CCC" />
                                    </TouchableOpacity>
                                </Col>
                            </Row>)
                        })}

                    </KeyboardAwareScrollView>

                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    menubutton:{
        borderWidth: 1, borderRadius: 50, borderColor: "#EEE", 
        width: 30, height: 30,
        alignItems:"center",
        justifyContent:"center"
    },
    root: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },

})
