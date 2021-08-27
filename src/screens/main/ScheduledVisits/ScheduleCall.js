import React, { Component } from "react";
import { StyleSheet, Platform, TouchableOpacity, Text, View, FlatList, Image } from "react-native";
import { NavigationHeader, } from "../../../components";
import { theme } from "../../../theme";
import { icons } from "../../../assets";
import { ScrollView } from "react-native-gesture-handler";
import { api } from '../../../api'
import Spinner from "react-native-loading-spinner-overlay";
import Snackbar from "react-native-snackbar";
import { AppConstants, StorageUtils } from "../../../utils";
import moment from 'moment'
const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export class ScheduleCall extends Component {

    constructor(props) {
        super();
        this.state = {
            callVisitList: [],
            visitList: [{ title: 'Lisa Fernandes', dateAndTime: '18th July,2021 - 09:00 AM' },
            { title: 'Tom Towers', dateAndTime: '20th July,2021 - 09:00 AM' },
            { title: 'Ellis Pierce', dateAndTime: '30th July,2021 - 09:00 AM' }]
        };
    }

    async componentDidMount() {
        await this.scheduleList()
        this.focusListener = this.props.navigation.addListener("didFocus", async () => {
            await this.scheduleList()
        });
    }

    showError = () => {
        this.setState({ spinner: false, });

        Snackbar.show({
            text: 'Error',
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    scheduleList = async () => {
        this.setState({spinner: true})
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        fetch(api.getCallScheduleList, {
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
                this.setState({ callVisitList: data })

            })
            .catch((error) => {
                this.showError();
            });
    }


    dateAndTime = (dateAndTime) => {
        let value = dateAndTime
        value = moment(value).format('MM/DD/YYYY HH:mm a')
        const month = value.substr(0, 2);
        let day = value.substr(3, 2);
        const year = value.substr(6, 4);
        let hours = value.substr(11, 2)
        const minutes = value.substr(13, 3)
        const timeUnit = value.substr(16, 3)
        hours = hours > 12 ? parseInt(hours) - 12 : hours
        day = day[0] == 0 ? day[1] : day
        return (`${day + this.suffix(day)} ${monthName[month - 1]}, ${year} - ${hours}${minutes}${timeUnit}`);
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


    render() {
        const { navigation, } = this.props
        return (
            <View style={styles.container}>
                <NavigationHeader title={'Scheduled Visits'} showBackBtn={false} />
                <Spinner visible={this.state.spinner} textStyle={styles.spinnerTextStyle} />
                <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                    <ScrollView>
                        <View>
                            <FlatList
                                data={this.state.callVisitList}
                                keyExtractor={(item, index) => "key" + index}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={styles.root} activeOpacity={0.8} onPress={() => { navigation.navigate("ScheduleCallDetails", { navigation: navigation, item: item, }) }}>
                                        <View style={{ flex: 3, }}>
                                            <View>
                                                <Text style={styles.name}>{item.visitDetail}</Text>
                                                <Text style={styles.detail}>{this.dateAndTime(item.meetingDateTime)}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.15 }}><Image style={styles.image} source={icons.disclosure} /></View>
                                    </TouchableOpacity>
                                )}
                                numColumns={1}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => navigation.navigate("ScheduleForm", { navigation: navigation })}
                            style={styles.scheduleBtn} >
                            <Text style={[theme.palette.buttonText,]}>Schedule Call</Text>
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
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    scheduleBtn: {
        height: 50,
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 20,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
        marginBottom: 100
    },
    root: {
        width: '95%',
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.grey_shade_4,
        borderRadius: 12,
        padding: 10,
        marginTop: 20
    },
    name: {
        color: theme.colors.black,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 18,
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
    image: {
        alignSelf: "center",
    },
    spinnerTextStyle: {
        color: "#FFF",
    },
});