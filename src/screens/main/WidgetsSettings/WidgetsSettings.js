import { Platform, SafeAreaView, View, ScrollView, StatusBar, Text } from "react-native"
import React, { Component } from "react"
import { NavigationHeader, Info } from "../../../components"
import { styles } from "./styles"
// import { ListItem } from "react-native-elements"
import { ListItem, Switch } from "../../../components/elements"
import { theme } from "../../../theme"
import { commonStyles } from '../../../commonStyles'
import { StorageUtils, AppWidgets, HEALTHDATA_WIDGETS } from "../../../utils"

const { heading, headingContainer } = styles

const widgetsArrayIndividual = [
    {
        title: 'Activity Score',
        widgetName: AppWidgets.ACTIVITY_SCORE,
        description: 'Monitor my activity levels',
        category: 'Home Widgets'
    },
    {
        title: 'Risk Score',
        widgetName: AppWidgets.RISK_SCORE,
        description: 'Monitor my risk propensity to infections and chronic conditions',
        category: 'Home Widgets'
    },
    {
        title: 'Infection Risk Assessment',
        widgetName: AppWidgets.INFECTION_RISK,
        description: 'Daily COVID-19 risk assessment questionnaire',
        category: 'Home Widgets'
    },
    {
        title: 'Health Data', // 'Statistics',
        widgetName: AppWidgets.STATICS,
        description: 'Monitor my health and wellness biomarkers',
        category: 'Home Widgets'
    },
    {
        title: 'Location',
        widgetName: AppWidgets.LOCATION,
        description: 'Monitor my location and create geo-fencing',
        category: 'Home Widgets'
    },
    {
        title: 'Patient Diary',
        widgetName: AppWidgets.PATIENT_DIARY,
        description: 'Manage my health and wellness notes',
        category: 'Home Widgets'
    },
    {
        title: 'Services',
        widgetName: AppWidgets.CHAT,
        description: 'Connect with other care services',
        category: 'Home Widgets'
    },
    {
        title: 'Social',
        widgetName: AppWidgets.SOCIAL,
        description: 'Helpful information for my care',
        category: 'Home Widgets'
    },
    {
        title: 'Veyetals',
        widgetName: AppWidgets.VEYETALS,
        description: 'Veyetals Settings',
        category: 'Home Widgets'
    },
    {
        title: 'Care Circle',
        widgetName: AppWidgets.CARE_CIRCLE,
        description: "My care-circle's contacts",
        category: 'Profile Widgets'
    },
    {
        title: 'Medication',
        widgetName: AppWidgets.MEDIACATION,
        description: 'My medications',
        category: 'Profile Widgets'
    },
    {
        title: 'Allergies',
        widgetName: AppWidgets.ALLERGIES,
        description: 'My allergies',
        category: 'Profile Widgets'
    },
    {
        title: 'Assessment Result',
        widgetName: AppWidgets.ASSESSMENT_RESULT,
        description: 'My recent assessment results',
        category: 'Profile Widgets'
    },
    {
        title: 'Ride Request',
        widgetName: AppWidgets.RIDE_REQUEST,
        description: 'Ride Request',
        category: 'Location'
    },
].concat(HEALTHDATA_WIDGETS)

const widgetsArrayStaff = [
    {
        title: 'Activity Score',
        widgetName: AppWidgets.ACTIVITY_SCORE,
        description: 'Monitor my activity levels',
        category: 'Home Widgets'
    },
    {
        title: 'Risk Score',
        widgetName: AppWidgets.RISK_SCORE,
        description: 'Monitor my risk propensity to infections and chronic conditions',
        category: 'Home Widgets'
    },
    {
        title: 'Infection Risk Assessment',
        widgetName: AppWidgets.INFECTION_RISK,
        description: 'Daily COVID-19 risk assessment questionnaire',
        category: 'Home Widgets'
    },
    {
        title: 'Health Data', // 'Statistics',
        widgetName: AppWidgets.STATICS,
        description: 'Monitor my health and wellness biomarkers',
        category: 'Home Widgets'
    },
    {
        title: 'Services',
        widgetName: AppWidgets.CHAT,
        description: 'Connect with other care services',
        category: 'Home Widgets'
    },
    {
        title: 'Social',
        widgetName: AppWidgets.SOCIAL,
        description: 'Helpful information for my care',
        category: 'Home Widgets'
    },
    {
        title: 'Veyetals',
        widgetName: AppWidgets.VEYETALS,
        description: 'Veyetals Settings',
        category: 'Home Widgets'
    },
].concat(HEALTHDATA_WIDGETS)

const caregiversWidgetsArray = [
    {
        title: 'Activity Score',
        // widgetName: AppWidgets.ACTIVITY_SCORE_CAREGIVER,
        widgetName: AppWidgets.ACTIVITY_SCORE,
        description: 'Monitor my activity levels',
        category: 'Home Widgets'
    },
    {
        title: 'Risk Score',
        // widgetName: AppWidgets.RISK_SCORE_CAREGIVER,
        widgetName: AppWidgets.RISK_SCORE,
        description: 'Monitor my risk propensity to infections and chronic conditions',
        category: 'Home Widgets'
    },
    {
        title: 'Tasks',
        widgetName: AppWidgets.TASKS,
        description: 'Manage tasks for myself and my care-circle',
        category: 'Home Widgets'
    },
    {
        title: 'Health Data',
        widgetName: AppWidgets.CAREGIVER_STATICS,
        description: 'Monitor my health and wellness biomarkers',
        category: 'Home Widgets'
    },
    {
        title: 'Location',
        widgetName: AppWidgets.LOCATION,
        description: 'Monitor my location and create geo-fencing',
        category: 'Home Widgets'
    },
    {
        title: 'Patient Diary',
        widgetName: AppWidgets.PATIENT_DIARY,
        description: 'Manage my health and wellness notes',
        category: 'Home Widgets'
    },
    {
        title: 'Ride Request',
        widgetName: AppWidgets.RIDE_REQUEST,
        description: 'Ride Request',
        category: 'Location'
    },
].concat(HEALTHDATA_WIDGETS)

const WidgetsArraySupervisor = [
    {
        title: 'Activity Score',
        // widgetName: AppWidgets.ACTIVITY_SCORE_CAREGIVER,
        widgetName: AppWidgets.ACTIVITY_SCORE,
        description: 'Monitor my activity levels',
        category: 'Home Widgets'
    },
    {
        title: 'Risk Score',
        // widgetName: AppWidgets.RISK_SCORE_CAREGIVER,
        widgetName: AppWidgets.RISK_SCORE,
        description: 'Monitor my risk propensity to infections and chronic conditions',
        category: 'Home Widgets'
    },
    {
        title: 'Tasks',
        widgetName: AppWidgets.TASKS,
        description: 'Manage tasks for myself and my care-circle',
        category: 'Home Widgets'
    },
    {
        title: 'Health Data',
        widgetName: AppWidgets.CAREGIVER_STATICS,
        description: 'Monitor my health and wellness biomarkers',
        category: 'Home Widgets'
    },
].concat(HEALTHDATA_WIDGETS)

const { container, subContainer } = commonStyles

export default class WidgetsSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: true,
            chat: false,
            tasks: false,
            social: false
        }
        this.previousCategory = 0
        this.role = this.props.navigation.getParam('role')
        this.apptype = this.props.navigation.getParam('apptype')
    }

    async componentDidMount() {
        if (Platform.OS !== "ios") {
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor(theme.colors.colorPrimary)
          }
      

        const widgetsData = this.role === "senior" ? widgetsArrayIndividual : caregiversWidgetsArray
        widgetsData.map(async item => {
            const switchValue = await StorageUtils.getValue(item.widgetName) || true
            console.log(item.widgetName + '  ' + switchValue)
            this.setState({ [item.widgetName]: switchValue })
        })
    }

    onChange = (val) => { }


    onChangeToggleValue = (switchValue, widgetName) => {
        console.log(`onChangeToggleValue() : ${widgetName} > ${switchValue}`);

        StorageUtils.storeInStorage(widgetName, `${switchValue}`);
        // StorageUtils.storeInStorage(widgetName, JSON.stringify(switchValue))
        this.setState({ [widgetName]: switchValue ? "true":"false" })
    }

    renderHeader = (categoryName) => {
        return (
            <View style={headingContainer}>
                <Text style={heading}>{categoryName}</Text>
            </View>
        )
    }

    renderSwitchListItem = (item) => {
        const switchVal = this.state[item.widgetName] || false
        const value = JSON.parse(switchVal)
        const categoryName = item.category
        if (this.previousCategory !== categoryName) {
            this.previousCategory = categoryName

            return (<View>
                {this.renderHeader(categoryName)}
                <ListItem
                    title={item.title}
                    subtitle={item.description}
                    subtitleStyle={{ color: "grey" }}
                    titleStyle={{ fontSize: 20 }}
                    // switch={{ value, onChange: (switchValue) => { this.onChangeToggleValue(switchValue, item.widgetName); }, }}
                    switch={{ value, onChange: (switchValue) => { 
                        this.onChangeToggleValue(switchValue, item.widgetName); 
                    }, }}
                    underlayColor="#25BEED"
                    style={{ paddingHorizontal: 8, marginBottom: 2, }}
                    containerStyle={{ paddingVertical: 15 }}
                />
            </View>
            )
        }

        return (
            <ListItem
                title={item.title}
                subtitle={item.description}
                subtitleStyle={{ color: "grey" }}
                titleStyle={{ fontSize: 20 }}
                // switch={{ value, onChange: (switchValue) => { this.onChangeToggleValue(switchValue, item.widgetName); }, }}
                switch={{ value, onChange: (switchValue) => { 
                    this.onChangeToggleValue(switchValue, item.widgetName); 
                }, }}
                underlayColor="#25BEED"
                style={{ paddingHorizontal: 8, marginBottom: 2, }}
                containerStyle={{ paddingVertical: 15 }}
            />

        )

    }

    onBackPress = () => {
        const { navigation } = this.props
        const reloadProfilePage = navigation.getParam('onReloadWidgetCallBack')
        reloadProfilePage()
        navigation.goBack()
    }

    render() {
        const typeOnelist = this.apptype === "1" && this.role === "senior"? widgetsArrayIndividual : caregiversWidgetsArray 
        const typetwolist = this.apptype === "2" && this.role === "senior"? widgetsArrayStaff : WidgetsArraySupervisor
        const widgetsList = this.apptype === "1"? typeOnelist:typetwolist
        
        return (<View style={[container,{backgroundColor: theme.colors.colorPrimary}]}>
             <NavigationHeader onBackButtonPress={this.onBackPress} title={'Widgets Settings'} leftText={'Back'}
                    navigation={this.props.navigation} />
            <View style={subContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ backgroundColor: theme.colors.bg_grey }}>
                        <View>
                            {widgetsList.map((item, i) => {
                                return <View key={i}>{this.renderSwitchListItem(item)}</View>
                            })}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>)
    }
}