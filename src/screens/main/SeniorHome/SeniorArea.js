import React from 'react'
import { Text, View, StyleSheet,TouchableOpacity } from 'react-native'
import { ChartContainer, Device, LocationItem, NavigationHeader, ShowWeather, UsersList, AlertHelper, App, BellAlert } from "../../../components";
import { theme } from "../../../theme";
import { Icon } from "react-native-elements";


const SeniorArea = ({ navigation, date, refetchWeather, temperature, weather, cityName, name, newAlertCount, getAlertsFromServer, refreshSOS, seniorId }) => {
    return (
        <View>
            <View style={styles.primaryBgStyle}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15 }}>
                    <Text style={styles.date}>{date}</Text>
                    {temperature && <ShowWeather
                        refetchWeather={(refresh) => (refetchWeather = refresh)}
                        temperature={temperature}
                        weather={weather}
                        cityName={cityName}
                    />}
                </View>
                <View style={styles.horizontalView}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                        <View style={{ flex: .65 }}>
                            <Text style={[styles.name, { marginLeft: 15 }]} numberOfLines={1}>{"Hi " + name}</Text>
                        </View>
                        <View style={styles.navRightContainer}>
                        <TouchableOpacity style={{ height:'100%', marginRight: 20,flexDirection: 'row' , alignItems: 'center' }}
                            onPress={() => {
                                navigation.navigate("TaskForm", {
                                    // name: seniorName, seniorId: seniorId, profileImage: seniorImg,
                                });
                            }}>
                                <Text style={{marginRight: 10,color: 'white', fontWeight: 'bold'}}>Add Task</Text>
                                <Icon type="material-community" name="square-edit-outline" color="#FFFFFF" /></TouchableOpacity>
                            <BellAlert alerts={newAlertCount || 0} onPress={() => navigation.navigate("AlertsScreen", { getAlertsFromServer: getAlertsFromServer, })} />
                        </View>
                    </View>
                </View>
            </View>

            <UsersList type="caregiver" size="small" refreshSOS={refreshSOS} navigate={navigation.navigate} />

        </View>
    )
}


export default SeniorArea;

const styles = StyleSheet.create({
    primaryBgStyle: {
        backgroundColor: theme.colors.colorPrimary,
        paddingBottom: 10,
        paddingTop: 10,
        elevation: 8,
        shadowColor: theme.colors.white,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.26,
    },
    date: {
        fontFamily: theme.fonts.SFProSemibold,
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 13,
        marginTop: 20,
        marginLeft: 15,
        textTransform: "uppercase",
    },
    horizontalView: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    name: {
        fontFamily: theme.fonts.SFProBold,
        color: "rgba(255, 255, 255, 1)",
        fontSize: 32,
        marginLeft: 15,
        flexGrow: 1,
    },
    navRightContainer: {
        flex: .35,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 15,
    },
})
