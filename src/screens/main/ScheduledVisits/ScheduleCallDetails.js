import React, { Component } from "react";
import { StyleSheet, Platform, TouchableOpacity, Text, View, FlatList, Image, Modal } from "react-native";
import { NavigationHeader, } from "../../../components";
import { theme } from "../../../theme";
import { icons } from "../../../assets";
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment'
import Spinner from "react-native-loading-spinner-overlay";
import { api } from '../../../api'
import { AppConstants, StorageUtils } from "../../../utils";
import Snackbar from "react-native-snackbar";

const RenderData = ({ title, value }) => {
    return (
        <Text style={{ marginTop: 20 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{value}</Text>
        </Text>
    )
}

const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const duration = ['15 mins','30 mins', '45 mins', '60 mins']

export class ScheduleCallDetails extends Component {

    constructor(props) {
        super();
        this.state = {
            confirmModal: false,
        };
    }

    async componentDidMount() {

    }
    
    showError = () => {
        this.setState({ spinner: false, });

        Snackbar.show({
            text: 'Error',
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    // Delete Schedule call 

onDelete = async () => {
        const { navigation } = this.props
        const item = navigation.getParam("item");
        this.setState({spinner: true})
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
       
        try {
          const response = await fetch(`${api.deleteScheduleCall}/${item.id}`, {
            method: "delete",
            headers: { Accept: "application/json","Content-Type": "application/json", Authorization: "Bearer " + token, },});

          if (response) {
              const json = response.json();
              this.setState({ spinner: false, });
              
            Snackbar.show({
                text: "Schedule call delted successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
               navigation.navigate("ScheduleCall", { navigation: navigation })
               this.setState({confirmModal:false})
              
          }
        } catch (error) {
        this.setState({ spinner: false, });
          Snackbar.show({
            text: "Error in deleting schedule Call",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      };

      //Update Schedule call

      onUpdate = async () => {
       
    }

    onBackPress = () => {
        const { navigation } = this.props
        navigation.goBack()
    }


    date = (dateAndTime) => {
        let value = dateAndTime
        value = moment(value).format('MM/DD/YYYY HH:mm a')
        const month = value.substr(0, 2);
        let day = value.substr(3, 2);
        const year = value.substr(6, 4);
        day = day[0] == 0 ? day[1] : day
        return (`${day + this.suffix(day)} ${monthName[month - 1]}, ${year}`);

    }

    time = (dateAndTime)=> {
        let value = dateAndTime
        value = moment(value).format('MM/DD/YYYY HH:mm a')
        let hours = value.substr(11, 2)
        const minutes = value.substr(13, 3)
        const timeUnit = value.substr(16, 3)
        hours = hours > 12 ? parseInt(hours) - 12 : hours
        return (`${hours}${minutes}${timeUnit}`)
    }

    suffix = (day) => {
        if (day > 3 && day < 30) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

     // Confirm Delete Schedule call Modal

    confirmModal = () => {
        
        const { navigation } = this.props
        const   item = navigation.getParam("item");
        return (
            <Modal
                visible={this.state.confirmModal}
                transparent={true}>
                <View style={styles.modalView}>
                    <View style={styles.modalContanier} >
                        <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}> </Text>
                        </View>
                        <View style={styles.inviteEmailContainer}>
                        <Text style={styles.modalHeaderText}>Are you sure you </Text>
                        <Text style={styles.modalHeaderText}> want to delete the</Text>
                        <Text style={styles.modalHeaderText}> following visit:</Text>
                        <Text style={[styles.modalHeaderText,{ marginTop: 20}]}>{this.date(item.meetingDateTime)}</Text>
                        <Text style={styles.modalHeaderText}>
                             {moment.utc(item.meetingDateTime).format('HH:mm')} -{' '} 
                            {moment.utc(item.meetingDateTime).add(duration[item.meetingDuration].split(' ')[0], 'minute').format('HH:mm')}
                          
                        </Text>
                        </View>
                        <View style={[styles.modalBtnContainer,{padding: 20}]}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#BDBDBD' }]} onPress={() => this.setState({ confirmModal: false })}>
                                <Text style={styles.modalBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             style={[styles.modalBtn,
                             { backgroundColor: '#00AEEF' }]} 
                                  onPress={this.onDelete}>
                                <Text style={styles.modalBtnText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    render() {
        const { navigation } = this.props
        const   item = navigation.getParam("item");
        return (
            <View style={styles.container}>
                <NavigationHeader onBackButtonPress={() => this.onBackPress()} title={'Scheduled Visits'} leftText={'Back'} navigation={this.props.navigation} />
                <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                 {this.confirmModal()}
                    <ScrollView>
                        
                        <View style={styles.inerContainer}>
                            <Text style={styles.title}>{item.visitDetail}</Text>
                            {/* <RenderData title={'Id: '} value={item.id} /> */}
                            <RenderData title={'Date: '} value={this.date(item.meetingDateTime)} />
                            <RenderData title={'Time: '} value={this.time(item.meetingDateTime)} />
                            <RenderData title={'Duration: '} value={duration[item.meetingDuration]} />
                            <RenderData title={'Call Type: '} value={item.meetingCalltype == 1?'Video': 'Audio'} />
                            <RenderData title={'Visit Details: '} value={'Follow up Visit'} />
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => { }}
                                style={styles.btn} >
                                <Text style={styles.btnText}>Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => navigation.navigate("ScheduleForm", { item:item  })}
                                style={[styles.btn, { backgroundColor: '#9EA2A3' }]} >
                                <Text style={styles.btnText}>Edit</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => { this.setState({ confirmModal: true }) }}
                                style={[styles.btn, { backgroundColor: '#ED2525' }]} >
                                <Text style={styles.btnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>

            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    btn: {
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 20,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    inerContainer: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: theme.colors.grey_shade_4,
        borderRadius: 12,
        padding: 10,
        marginTop: 50
    },
    title: {
        color: theme.colors.black,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 16,
        flexGrow: 1,
        fontWeight: 'bold'
    },
    detail: {
        color: "rgba(0,0,0, 0.48)",
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 15,
        flexGrow: 1,
        marginTop: 10
    },
    btnContainer: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 40,
    },
    btnText: {
        fontSize: 18,
        color: '#FFFFFF',
        alignSelf: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.16
    },
    modalView: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#d3d3d3C2',
    },
    modalContanier: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: 'white',
        borderRadius: 20
    },
     modalHeader: {
        backgroundColor: '#EBEDF0',
        width: '100%',
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20
    },
    modalHeaderText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 20,
        lineHeight: 23,
        textAlign: "center",
        letterSpacing: 0.1 ,
        color: "#000000",
        textShadowRadius: 3,
        textShadowColor: "black",
    },
    modalBtnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50
    },
    modalBtn: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtnText: {
        fontWeight: '600',
        color: '#FFFFFF',
        fontSize: 14,
        paddingHorizontal: 30,
        paddingVertical: 10
    },
});