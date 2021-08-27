import React, { Component } from 'react'
import { SafeAreaView, Text, View, ScrollView, TextInput, ActivityIndicator, AlertIOS, } from 'react-native'
import Spinner from "react-native-loading-spinner-overlay";
import { NavigationHeader, Row, Col, CustomSwitch, Loader, DropDown } from "../../../components"
import { styles } from './styles'
import { unitList, unitListProps } from '../../../configs'
import Updater from "../../../utils/updater";
import { showMessage, StorageUtils, AppConstants } from "../../../utils";
import { commonStyles } from '../../../commonStyles'
import BackgroundTimer from "react-native-background-timer";
import { api } from "../../../api";
import BackgroundGeolocation from "react-native-background-geolocation";
// import { getTrackingStatus } from 'react-native-tracking-transparency';
export class DeviceUnitsScreen extends Component {
    state = { error: null, loading: false, profileData: null }

    componentDidMount() {
        // this.profileData.dataRefreshRate
        const profileData = this.props.navigation.getParam('profileData');
        console.log("profileData: ", profileData);

        this.setState({ profileData })
    }

    onUnitchange = async (index, state_label) => {
        // console.log(`index: ${index}, state_label: ${state_label}`);

        const unit = unitList[state_label];
        // console.log(state_label, " > ", unit);
        const selected_unit = unit[index];
        const unit_field = unitListProps(state_label).db_unit_field;
        // console.log("unit_field: ", unit_field);
        // console.log("selected_unit: ", selected_unit);

        if (!unit_field) {
            alert("Missing field name")
            return;
        }

        let fields = {}
        Object.assign(fields, { [unit_field]: unit[index].value })

        this.setState({
            // [`loading_${state_label}`]: true,
            loading: true,
            error: null,
        })

        let updated = await Updater.updateProfile({ input: fields });
        // console.log("updated: ", updated);

        if (updated && !updated.error) {
            this.setState({
                [state_label]: index,
                // [`loading_${state_label}`]: false,
                loading: false,
            })
        }
        else {
            this.setState({
                error: updated.error || null,
                // [`loading_${state_label}`]: false,
                loading: false,
            })
            alert("Unable to update at the moment!");
            // showMessage("Unable to update at the moment");
        }

    }

    onRefreshRate = async (value, index, item) => {
        this.setState({
            loading: true,
            error: null,
            // profileData: { ...this.state.profileData, dataRefreshRate:value }
        })
        BackgroundTimer.stopBackgroundTimer()
        console.log("Timer interval stop")
        const preValue = this.state.profileData.dataRefreshRate;

        let updated = await Updater.updateProfile({ input: { dataRefreshRate: value } });
        StorageUtils.storeInStorage(AppConstants.SP.DATA_REFRESH_RATE, `${value}`);
        if (updated && !updated.error) {
            this.setState({
                profileData: { ...this.state.profileData, dataRefreshRate: value },
                // dataRefreshRate: value,
                loading: false,
            })
            // const trackingStatus = await getTrackingStatus();
            // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
                // enable tracking features
                this.backgroundJob(value)
            // }

        }
        else {
            this.setState({
                error: updated.error || null,
                loading: false,
            })
            alert("Unable to update at the moment!");
        }

    }

    // profileData = this.props.navigation.getParam('profileData');

    backgroundJob = async (value) => {
        /**
         * * functions call to run location at background
         * ! Will run only in foreground and background not on killing the app
         */
        const intervalTime = value * 60000
        console.log("Timer interval start with", intervalTime)
        BackgroundTimer.runBackgroundTimer(async () => {
            console.log("Timer interval start")
            const locationPoint = await this.getLocation()
            const lat = locationPoint && locationPoint["coords"].latitude || 0
            const longi = locationPoint && locationPoint["coords"].longitude || 0
            if (lat && lat !== 0) {
                this.postCurrentLocation(lat, longi)
                console.log('....Timer interval location Updated....', new Date())
                // print("this")
            }
        }, intervalTime)
    }

    postCurrentLocation = async (latitude, longitude) => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        const isLogin = await StorageUtils.getValue(AppConstants.SP.IS_LOGGED_IN);

        if (isLogin === "1") {
            console.log("In posting location! ", latitude, longitude);

            fetch(api.seniorLocations, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    isWatchPaired: true,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("Location is posted in the Background", latitude, longitude)
                    }
                })
                .catch((onRejected) => {

                })
        }
    }

    getLocation = () => {
        return BackgroundGeolocation.getCurrentPosition({
            timeout: 30, // 30 second timeout to fetch location
            persist: true, // Defaults to state.enabled
            maximumAge: 50000, // Accept the last-known-location if not older than 5000 ms.
            desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
            samples: 3, // How many location samples to attempt.
            extras: {
                // Custom meta-data.
                route_id: 123,
            },
        }).then((currentlocation) => {
            console.log("Getting Location with timer: ", new Date(), currentlocation, Platform.OS)
            return currentlocation
        })
    }

    renderList = args => {

        let list = []
        for (let a in unitList) {
            const unit = unitList[a];
            const unitProps = unitListProps(a);

            let unit_field = unitProps.db_unit_field ? this.state.profileData[unitProps.db_unit_field] : undefined;
            let value_field = unitProps.db_value_field ? this.state.profileData[unitProps.db_value_field] : undefined;
            let unitIndex = unit_field ? unitList[a].findIndex(o => o['value'] == unit_field) : unitList[a].findIndex(o => o['value'] == 1);

            let isLoading = this.state[`loading_${a}`] || false;
            let selectedIndex = (this.state[`${a}`] || this.state[`${a}`] === 0) ? this.state[`${a}`] : unitIndex;

            list.push(<Loader key={a} loading={isLoading}><View style={styles.row}>
                <Row>
                    <Col flex="auto" style={{ paddingRight: 10 }} valign="center">
                        <Text style={styles.heading}>{a.replace("_", " ")}</Text>
                        {/* <TextInput 
                            value={this.state[`txt_${a}`]}
                            defaultValue={`${value_field || ""}`}
                            placeholder='placeholder' placeholderTextColor="rgba(0,0,0,0.2)"
                            // keyboardType='decimal-pad'
                            // maxLength={6}
                            style={styles.inputField}
                            onChangeText={(text) => { this.setState({ [`txt_${a}`]: text }) }}
                        /> */}
                    </Col>
                    <Col>
                        <CustomSwitch
                            tabItems={unit}
                            textSize={12}
                            selectedIndex={selectedIndex}
                            onPressCallBack={(selectedUnitIndex) => this.onUnitchange(selectedUnitIndex, `${a}`)}
                        />
                    </Col>
                </Row>
            </View></Loader>)

        }
        return list;
    }

    render() {
        // console.log("this.state: ", this.state);

        const { navigation } = this.props
        // const profileData = navigation.getParam('profileData');
        if (!this.state.profileData) return <Text style={{ padding: 50 }}>Missing Profile info</Text>


        return (<View style={commonStyles.full_page_container}>
            <NavigationHeader title={'Regional Settings'} leftText={'Back'} navigation={navigation} />
            <Spinner visible={this.state.loading} />
            <View style={commonStyles.subContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    {/* <NavigationHeader onBackButtonPress={this.onBackPress} title={'Widgets Settings'} leftText={'Back'} navigation={this.props.navigation} /> */}
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                        <View>
                            <View style={styles.row}>
                                <Row>
                                    <Col flex="auto" style={{ paddingRight: 10 }} valign="center">
                                        <Text style={styles.heading}>Data Refresh Rate</Text>
                                    </Col>
                                    <Col>
                                        <DropDown
                                            data={[
                                                { value: 1, label: "1 Min" },
                                                { value: 10, label: "10 Min" },
                                                { value: 60, label: "1 hr" },
                                                { value: (60 * 24), label: "24 hr" },
                                            ]}
                                            value={this.state.profileData.dataRefreshRate}
                                            // selectedIndex={2}
                                            onChange={(value, index, item) => {
                                                // console.log(value, index, item)
                                                this.onRefreshRate(value, index, item);
                                            }}
                                            noDataText="string"
                                        />
                                    </Col>
                                </Row>
                            </View>

                            {this.renderList()}

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>)


        // return (<View style={commonStyles.full_page_container}>
        //             <NavigationHeader title={'Regional Settings'} leftText={'Back'} navigation={navigation} />

        //             <View style={commonStyles.subContainer}>
        //                 <Spinner visible={this.state.loading} />
        //                 {this.state.error && <Text style={{padding:15, color:"#FF0000"}}>{this.state.error}</Text>}

        //                 <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
        //                     <View style={{ flex: 1, marginTop: 0 }}>
        //                         {this.renderList()}
        //                     </View>
        //                 </ScrollView>
        //             </View>

        // </View>)
    }
}
