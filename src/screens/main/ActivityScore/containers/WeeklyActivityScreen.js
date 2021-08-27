import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Button, Icon } from "react-native-elements";
import { theme } from "../../../../theme";
// import { RadioButton } from '../components/Radio';
// import { Col, Row } from '../components/Grid'
import { Col, Row, RadioButton } from '../../../../components'
import Snackbar from "react-native-snackbar"
import { api } from "../../../../api";
import { AppConstants, StorageUtils } from "../../../../utils";


export default class WeeklyActivityScreen extends Component {
    state = { selected: null, loading: false }
    constructor(props) {
        super(props);
        this.handelApiResponse = this.handelApiResponse.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onRadioChanged = val => {
        this.setState({ selected:val });
    }

    onSubmit = async args => {
        const { selected } = this.state;

        if (!selected || selected == null) {
            return;
        }
        this.setState({ loading: true });
        const handelApiResponse = this.handelApiResponse;
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

        let body = {
            userId,
            deviceTag: "MobileApp",
            weeklySocialScore: selected,
        }
        console.log("body: ", body);
        

        fetch(api.addBMIScale, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("response.ERROR: ", response);
                    return { error: { message: "Something went wrong! Try again" } };
                }
            })
            .then((json) => {
                handelApiResponse(json)
            })
            .catch((error) => {
                handelApiResponse({ error })
            })

    }

    handelApiResponse(args) {
        this.setState({ loading: false });
        console.log("handelApiResponse()", args);

        if (args.error) {
            Snackbar.show({
                text: args.error.message || "Oops, Something went wrong!",
                duration: Snackbar.LENGTH_LONG,
            })
        }

        if (args.userDeviceReadingId && args.userDeviceReadingId > 0) {
            this.props.onSuccess();
            // this.props.onClose();
        }
    }



    render() {
        const { selected, loading } = this.state;

        return (<ScrollView contentContainerStyle={{}} style={{ borderWidth: 0, flex: 1,}}>
            <View style={{ flex: 1, display: 'flex', margin: 10, flexDirection: 'column', justifyContent: 'space-evenly'}}>
                
                <View style={{borderWidth:0}}>
                    <Text style={{ fontSize: 30, textAlign: "center", marginBottom:10 }}>How many social activities have you done this week?</Text>
                    <Text style={{ fontSize: 18, textAlign: "center" }}>This includes: volunteering, attending organized groups (sports, hobbies, etc.), and seeing family</Text>
                </View>
                
                <View style={{ borderTopWidth: 0.5, borderColor: "rgba(0, 0, 0, 0.2)", marginVertical: 50}}>

                    {['0', '1', '2', '3', {title:'4 or more', value:4}].map((item, i)=>{
                        return (<TouchableOpacity style={{ width: "100%" }} onPress={() => this.setState({ selected: item.value || item })} key={i}>
                            <Row style={{ borderTopWidth: 0, borderBottomWidth: 0.5, paddingVertical: 5, borderColor: "rgba(0, 0, 0, 0.2)" }}>
                                <Col flex={30}></Col>
                                <Col flex="auto" align="center"><Text style={{ fontSize: 20, paddingVertical: 5 }}>{item.title || item}</Text></Col>
                                <Col flex={30} valign="center"><RadioButton selected={selected} value={item.value || item} /></Col>
                            </Row>
                        </TouchableOpacity>
                        )
                    })}

                </View>

                <View style={{ borderWidth: 0, alignItems: "center", marginBottom:50}}>
                    <Button title="Submit" // raised
                        disabled={selected == null}
                        titleStyle={{ fontWeight: "400", fontSize:24 }}
                        buttonStyle={{ backgroundColor: theme.colors.colorPrimary, borderRadius: 8 }}
                        containerStyle={{ width: 200,  }}
                        onPress={() => this.onSubmit()}
                        loading={loading}
                    />
                    {/* <Button title="Close" onPress={this.props.onClose} /> */}
                </View>

            </View>
            
        </ScrollView>)

    }
}


const styles = StyleSheet.create({
    container:{
        alignContent: "center",
        alignItems: "center",
        margin: 10,
    },
})
