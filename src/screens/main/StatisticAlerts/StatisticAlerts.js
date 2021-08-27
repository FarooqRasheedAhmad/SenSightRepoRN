import React, { Component } from "react"
import { Text, Platform, View, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { icons } from "../../../assets"
import { NavigationHeader } from "../../../components"
import { theme } from "../../../theme"
import { styles } from './styles'
import { alertList } from '../../../configs'
import { AppConstants, StorageUtils, } from "../../../utils";

const { container, subContainer, root, title, body, image, titleContainer } = styles


export default class StatisticAlerts extends Component {
    constructor(props) {
        super(props)
        // this.seniorId = props.navigation.getParam("seniorId");
        // this.default_seniorId = StorageUtils.getValue(AppConstants.SP.USER_ID);
    }

    componentDidMount() {
        if (Platform.OS !== "ios") {
            StatusBar.setTranslucent(false)
            StatusBar.setBackgroundColor(theme.colors.colorPrimary)
        }
    }

    onPressListItem = async (item) => {
        var default_seniorId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

        this.props.navigation.navigate("SetAlertPreferences",
            {
                seniorId: this.props.navigation.getParam("seniorId") || default_seniorId,
                alertData: item
            })
    }

    renderRowItem = (item) => {
        return (
            <TouchableOpacity onPress={() => this.onPressListItem(item)} key={item.id}>
                <View style={root}>
                    <Image source={icons[item.icon]} />
                    <View style={titleContainer}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={title}>{item.title}</Text>
                        </View>
                        <View style={{ flex: 0.15 }}>
                            <Image style={image} source={icons.disclosure} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { navigation } = this.props

        return (
            <View style={container}>
                <NavigationHeader title={'Alert Settings'} leftText={'Back'} navigation={navigation} />
                <View style={subContainer}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                        <View style={{ flex: 1, marginTop: 10 }}>
                            {alertList.map(item => {
                                return this.renderRowItem(item)
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
