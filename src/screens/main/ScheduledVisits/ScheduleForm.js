import React, { Component } from "react";
import { StyleSheet, Platform, TouchableOpacity, Text, View, TextInput, ScrollView, Image, Modal, FlatList } from "react-native";
import { NavigationHeader, DropDown, } from "../../../components";
import { theme } from "../../../theme";
import { icons, } from "../../../assets";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { api } from '../../../api'
import { AppConstants, StorageUtils } from "../../../utils";
import Spinner from "react-native-loading-spinner-overlay";
import Snackbar from "react-native-snackbar";

const TextinputField = (props) => {
    return (
        <>
            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 20 }}>{props.title}</Text>
            <TextInput
                style={[theme.palette.textInputRoundBg, { width: '100%', marginTop: 10, height: 50 }]}
                placeholder={props.placeholder}
                placeholderTextColor={theme.colors.grey_shade_1}
                {...props}
                value={props.value} />
        </>
    )
}

const DropDownField = (props) => {
    return (
        <>
            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 20 }}>{props.title}</Text>
            <DropDown
                textStyle={{ color: "#000" }}
                style={{ width: '100%', borderRadius: 10, minHeight: 50, backgroundColor: theme.colors.grey_shade_4, marginTop: 10 }}
                data={props.data}
                placeholder={props.placeholder}
                value={props.value}
                {...props}

            />
        </>
    )
}
const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


export class ScheduleForm extends Component {

    

    constructor(props) {
        super();
        this.state = {
            visitDetails: '',
            inviteUser: [],
            pinCode: '',
            date: '',
            time: '',
            duration: '',
            callType: '',
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            inviteModal: false,
            inviteEmail: '',
            spinner: false,
            registerUserModal: false,
            registertedList: [],
            selectedItems: [],
            checkItme: {},
        };
    }

     

    async componentDidMount() {
        this.getRegistertedSeniorList()
    }

    onBackPress = () => {
        const { navigation } = this.props
        navigation.goBack()
    }

    showError = () => {
        this.setState({ spinner: false, });

        Snackbar.show({
            text: 'Error',
            duration: Snackbar.LENGTH_SHORT,
        });
    };


    getRegistertedSeniorList = async () => {
        this.setState({ spinner: true, });
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        fetch(api.getRegistertedSeniors, {
            method: "get",
            headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
        })
            .then((response) => {
                return response.json();

            })
            .catch((error) => {
                console.log(error)
                this.showError();
            })
            .then((data) => {
                this.setState({ spinner: false, });
                if (data != null && data.errors != null) {
                    return;
                }
                if (data == undefined) {
                    this.showError();
                    return;
                }
                this.setState({ registertedList: data })

            })
            .catch((error) => {
                this.showError();
            });
    }

    selectDate = (value) => {
        const displayFormat = 'MM/DD/YYYY'
        let __date = moment(value); // converting the selected date as current date on utc 0, fixing time difference
        const _displayDate = __date.format(displayFormat)
        this.setState({ date: _displayDate, isDatePickerVisible: false })
    }

    selectTime = (value) => {
        const displayFormat = 'HH:mm a'
        let __time = moment(value); // converting the selected date as current date on utc 0, fixing time difference
        const _displaytime = __time.format(displayFormat)
        let hours = _displaytime.substr(0, 2);
        const min = _displaytime.substr(2,3)
        const unit = _displaytime.substr(6,2)
        hours = hours > 12? parseInt(hours) - 12: hours == '00'? 12: hours
        this.setState({ time: `${hours}${min} ${unit}`, isTimePickerVisible: false })
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

    dateFormate = (date) => {
        const month = date.substr(0, 2);
        var day = date.substr(3, 2);
        const year = date.substr(6, 4);
        day = day[0] == 0 ? day[1] : day
        return (`${day + this.suffix(day)} ${monthName[month - 1]}, ${year}`);
    }

    addExternalEmail = () => {
        if (this.state.inviteEmail == '') {
            Snackbar.show({ text: 'Please enter email', duration: Snackbar.LENGTH_SHORT, });
            return;
        }

        const externalEmail = {
            "meetingRoomId": 0,
            "userName": this.state.inviteEmail,
            "email": this.state.inviteEmail,
            "pin": this.state.pinCode,
            "userType": 1
        }
        const inviteUser = [...this.state.inviteUser, externalEmail]
        this.setState({ inviteUser, inviteModal: false, inviteEmail: '' })

    }

    addRegistertedEmail = () => {
        let selectedRow = [];
        const {selectedItems, registertedList} = this.state;
        for(let i=0; i < selectedItems.length; i++ ){
            const registertedEmail = {
                "meetingRoomId": 0,
                "userName": registertedList[selectedItems[i]].firstName,
                "email": registertedList[selectedItems[i]].email,
                "pin": this.state.pinCode,
                "userType": 1
            }

            selectedRow.push(registertedEmail)
        }
        console.log(selectedRow)
        const inviteUser = [...this.state.inviteUser, ...selectedRow]
        this.setState({ inviteUser, inviteModal: false, inviteEmail: '', selectedItems: [] })
    }

    inviteModal = () => {
        return (
            <Modal
                visible={this.state.inviteModal}
                transparent={true}>
                <View style={styles.modalView}>
                    <View style={styles.modalContanier} >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Invite User via Email</Text>
                        </View>
                        <View style={styles.inviteEmailContainer}>
                            <Text style={{ fontSize: 14, lineHeight: 16, fontWeight: 'normal' }}>Email:</Text>
                            <TextInput
                                style={styles.inviteEmail}
                                placeholder={'External_User@email.com'}
                                placeholderTextColor={theme.colors.grey_shade_1}
                                value={this.state.inviteEmail}
                                onChangeText={(inviteEmail) => { this.setState({ inviteEmail }) }} />
                        </View>
                        <View style={[styles.modalBtnContainer,{padding: 20}]}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#BDBDBD' }]} onPress={() => this.setState({ inviteModal: false })}>
                                <Text style={styles.modalBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00AEEF' }]} onPress={() => this.addExternalEmail()}>
                                <Text style={styles.modalBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    selectedItems = (index) => {
        const { selectedItems } = this.state
        if (selectedItems.includes(index)) {
            let items = selectedItems
            items.splice(items.indexOf(index), 1)
            this.setState({ selectedItems: items })
        } else {
            const selectedItems = [...this.state.selectedItems, index]
            this.setState({ selectedItems })

        }

    }

    registerUserModal = () => {
        const { selectedItems } = this.state
        return (
            <Modal
                visible={this.state.registerUserModal}
                transparent={true}>
                <View style={styles.modalView}>
                    <View style={[styles.modalContanier,]} >
                        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, padding: 20 }}>Call</Text>
                        <FlatList
                            data={this.state.registertedList}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={selectedItems.includes(index) ? styles.selectedRow : styles.unselectedRow} onPress={() => this.selectedItems(index)} >
                                    <Image source={item.profileImage ? { uri: item.profileImage } : icons.tab_profile} style={styles.imageStyle} />
                                    <View style={{ marginLeft: 15, width: '80%' }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold', }}>{`${item.firstName} ${item.lastName}`}</Text>
                                        <Text style={{ fontSize: 12, marginTop: 5 }}>Primary Caregiver</Text>
                                        <View style={{ height: 1, backgroundColor: '#E5E5E5', width: '100%', marginTop: 10 }} />
                                    </View>
                                </TouchableOpacity>
                            )}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={styles.flatListContent}
                        />
                        <View style={[styles.modalBtnContainer, { justifyContent: 'center', marginTop: 15, paddingBottom: 20 }]}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00AEEF', }]}
                                onPress={() => { this.addRegistertedEmail(), this.setState({ registerUserModal: false }) }}>
                                <Text style={styles.modalBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    showError = () => {
        this.setState({ spinner: false, });

        Snackbar.show({
            text: 'Error',
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    validate = () => {
        const { visitDetails, inviteUser, pinCode, date, time, duration, callType, } = this.state
        if (visitDetails == '') Snackbar.show({ text: 'Please enter visit details', duration: Snackbar.LENGTH_SHORT, });
        else if (inviteUser.length == 0) Snackbar.show({ text: 'Please enter atleast one inivite user', duration: Snackbar.LENGTH_SHORT, });
        else if (pinCode == '') Snackbar.show({ text: 'Please enter pin code', duration: Snackbar.LENGTH_SHORT, });
        else if (date == '') Snackbar.show({ text: 'Please enter visit date', duration: Snackbar.LENGTH_SHORT, });
        else if (time == '') Snackbar.show({ text: 'Please enter visit time', duration: Snackbar.LENGTH_SHORT, });
        else if (duration == '') Snackbar.show({ text: 'Please enter visit duration', duration: Snackbar.LENGTH_SHORT, });
        else if (callType == '') Snackbar.show({ text: 'Please enter visit Type', duration: Snackbar.LENGTH_SHORT, });
        else this.saveCallSchedule()

    }

    combineDateTimeFormate =(date,time)=>{
        const dateFormate = moment(date).format('YYYY-MM-DD');
        const datetime = moment(dateFormate + time, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        const dateobj = new Date(datetime._d);
        // Contents of above date object is
        // converted into a string using toISOString() method.
        const  combineDateTime = moment(dateobj)
              .add(new Date(dateobj).getTimezoneOffset() / -60, 'hours')
              .toISOString();
    console.log(combineDateTime)
    return combineDateTime;
    }

    saveCallSchedule = async () => {
        const { visitDetails, inviteUser, pinCode, date, time, duration, callType, } = this.state
        var callBody = JSON.stringify({
            visitDetail: visitDetails,
            meetingType: 1,
            meetingDuration: duration,
            meetingCallType: callType == 'Video'? 1:2,
            meetingDateTime: this.combineDateTimeFormate(date,time),
            meetingUsers: inviteUser
        });

        this.setState({ spinner: !this.state.spinner, });
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        fetch(api.callSchedule, {
            method: "post",
            headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
            body: callBody,
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                this.showError();
            })
            .then((data) => {
                this.setState({ spinner: false, });
                Snackbar.show({ text: 'Schedule visit is saved', duration: Snackbar.LENGTH_SHORT, });
                this.props.navigation.goBack()
                if (data != null && data.errors != null) {
                    return;
                }
                if (data == undefined) {
                    this.showError();
                    return;
                }

            })
            .catch((error) => {
                this.showError();
            });
    }

    renderinviteUser = () => {
        let value = '';
        const userlist = this.state.inviteUser;
        for (let i = 0; i < userlist.length; i++) {
            value += `${userlist[i].email},\n`
        }
        return value;
    }


    render() {
        const { visitDetails, inviteUser, pinCode, date, time, duration, callType, isDatePickerVisible, isTimePickerVisible } = this.state
        return (
            <View style={styles.container}>
                <NavigationHeader onBackButtonPress={() => this.onBackPress()} title={'Set up Scheduled Visit'} leftText={'Back'} navigation={this.props.navigation} />
                <Spinner visible={this.state.spinner} textStyle={styles.spinnerTextStyle} />
                <View style={{ flex: 1, backgroundColor: theme.colors.white, alignItems: 'center' }}>
                    {this.inviteModal()}
                    {this.registerUserModal()}
                    <ScrollView style={{ width: '100%', }}>
                        <View style={{ width: '90%', marginTop: 30, alignSelf: 'center' }}>

                            <TextinputField
                                title='Visit Details'
                                placeholder='Follow up Visit'
                                value={visitDetails}
                                onChangeText={(visitDetails) => { this.setState({ visitDetails }) }}
                            />

                            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 20 }}>Invited Users</Text>
                            <View style={styles.textAreaContainer} >
                                <TextInput
                                    style={styles.textArea}
                                    underlineColorAndroid="transparent"
                                    placeholder={"Mckelevey, Lisa,\nTom@email.com \n(External)"}
                                    multiline={true}
                                    editable={false}
                                    value={this.renderinviteUser()}
                                    onChangeText={(inviteUser) => { this.setState({ inviteUser }) }}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { this.setState({ registerUserModal: true }) }}
                                    style={styles.inviteBtn} >
                                    <Text style={{ color: 'white' }}>Select Contacts</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { this.setState({ inviteModal: true }) }}
                                    style={styles.inviteBtn} >
                                    <Text style={{ color: 'white' }}>Invite External Contacts</Text>
                                </TouchableOpacity>
                            </View>

                            <TextinputField
                                title='Pin Code'
                                placeholder='1234'
                                maxLength={4}
                                value={pinCode}
                                onChangeText={(pinCode) => { this.setState({ pinCode }) }}
                            />

                            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 20 }}>Select Date</Text>

                            <View style={{ borderRadius: 10, backgroundColor: theme.colors.grey_shade_4, marginTop: 10, justifyContent: 'center' }}>
                                <View style={{ width: '98%', position: 'absolute' }}>
                                    <Image style={styles.image} source={icons.down_arrow} />
                                </View>
                                <TouchableOpacity onPress={() => { this.setState({ isDatePickerVisible: true }) }}>
                                    <Text style={styles.input}>
                                        <Text style={{ color: date == '' ? "rgba(0,0,0,0.2)" : 'black' }}>{date != '' ? `${this.dateFormate(date)}` : "21st July, 2021"}</Text>
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    display="spinner"
                                    mode={"date"}
                                    isVisible={isDatePickerVisible}
                                    onConfirm={(value) => { this.selectDate(value) }}
                                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                                />
                            </View>

                            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 20 }}>Select Time</Text>

                            <View style={{ borderRadius: 10, backgroundColor: theme.colors.grey_shade_4, marginTop: 10, justifyContent: 'center' }}>
                                <View style={{ width: '98%', position: 'absolute' }}>
                                    <Image style={styles.image} source={icons.down_arrow} />
                                </View>
                                <TouchableOpacity onPress={() => { this.setState({ isTimePickerVisible: true }) }}>
                                    <Text style={styles.input}>
                                        <Text style={{ color: time == '' ? "rgba(0,0,0,0.2)" : 'black' }}>{time != '' ? time : "09:00 AM"}</Text>
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    display="spinner"
                                    mode={"time"}
                                    is24Hour={true}
                                    isVisible={isTimePickerVisible}
                                    onConfirm={(value) => { this.selectTime(value) }}
                                    onCancel={() => this.setState({ isTimePickerVisible: false })}
                                />
                            </View>

                            <DropDownField
                                title='Duration'
                                placeholder='30 mins'
                                data={[{ value: '0', label: '15 mins' }, { value: '1', label: '30 mins' }, { value: '02', label: '45 mins' }, { value: '3', label: '60 mins' },]}
                                value={duration}
                                onChange={(value, index, item) => { this.setState({ duration: value }) }}
                            />

                            <DropDownField
                                title='Call Type'
                                placeholder='Video'
                                data={[{ value: '0', label: 'Video' }, { value: '1', label: 'Audio' },]}
                                value={callType}
                                onChange={(value, index, item) => { this.setState({ callType: value }) }}
                            />

                        </View>

                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.validate() }}
                            style={styles.scheduleBtn} >
                            <Text style={[theme.palette.buttonText,]}>Save Visit</Text>
                        </TouchableOpacity>
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
        paddingTop: Platform.OS === "ios" ? 44 : 0,
    },
    scheduleBtn: {
        height: 50,
        width: '90%',
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 40,
        paddingHorizontal: 20
    },
    textAreaContainer: {
        color: theme.colors.black,
        fontSize: 14,
        backgroundColor: theme.colors.grey_shade_4,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 10,
        marginTop: 10
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        fontSize: 16,
        lineHeight: 19
    },
    inviteBtn: {
        height: 30,
        backgroundColor: '#73C1DE',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 20,
        paddingHorizontal: 10,
        marginBottom: 20
    },
    input: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 10,
        minHeight: 50,
    },
    image: {
        position: 'absolute',
        alignSelf: 'flex-end',
    },
    modalView: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#d3d3d3C2',
    },
    inviteEmail: {
        width: '80%',
        height: 30,
        fontSize: 14,
        fontFamily: theme.fonts.SFProRegular,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#9FA2B4'
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
        fontSize: 18,
        color: '#000000',
        textAlign: 'center',
        padding: 5
    },
    inviteEmailContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50
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
    spinnerTextStyle: {
        color: "#FFF",
    },
    imageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    selectedRow: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: 'rgba(191, 232, 255, 1)',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#00AEEF',
        paddingTop: 10,
        paddingHorizontal: 20
    },
    unselectedRow: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 20,
    }
});