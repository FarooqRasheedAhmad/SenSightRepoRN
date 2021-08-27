import React, { Component } from "react";
import { StyleSheet, Platform, TouchableOpacity, Text, View, FlatList, Image } from "react-native";
import { NavigationHeader, } from "../../../components";
import { theme } from "../../../theme";
import { icons } from "../../../assets";
import { ScrollView } from "react-native-gesture-handler";


export class ChatList extends Component {

    constructor(props) {
        super();
        this.state = {
            visitList: [{ title: 'Lisa Fernandes', dateAndTime: '18th July,2021 - 09:00 AM' },
            { title: 'Tom Towers', dateAndTime: '20th July,2021 - 09:00 AM' },
            { title: 'Ellis Pierce', dateAndTime: '30th July,2021 - 09:00 AM' }]
        };
    }

    async componentDidMount() {}

    render() {
        const { navigation, } = this.props
        return (
            <View style={styles.container}>
                <NavigationHeader title={'Scheduled Visits'} showBackBtn={false} />

                <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                    <ScrollView>
                        <View>
                            <FlatList
                                data={this.state.visitList}
                                keyExtractor={(item, index) => "key" + index}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={styles.root} activeOpacity={0.8} onPress={() => { navigation.navigate("Chat", { navigation: navigation, item: item }) }}>
                                        <View style={{ flex: 3, }}>
                                            <View>
                                                <Text style={styles.name}>{item.title}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.15 }}><Image style={styles.image} source={icons.disclosure} /></View>
                                    </TouchableOpacity>
                                )}
                                numColumns={1}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => navigation.navigate("Chat", { navigation: navigation })}
                            style={styles.scheduleBtn} >
                            <Text style={[theme.palette.buttonText,]}>Start new Chat</Text>
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
        height: 76,
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
    image: {
        alignSelf: "center",
    },
});