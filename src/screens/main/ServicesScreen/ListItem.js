import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from "../../../theme";
import { Col, Row } from '../../../components'
import Modal from "react-native-modal";


export const ListItem = (props) => {
    const [showMessage, set_showMessage] = React.useState(false)

    const onItemPress = () => {
        if (props.disabled){
            set_showMessage(true);
            return;
        }
        if (!props.onPress) return;
        props.onPress(props.data)
    }

    return (<>
        <TouchableOpacity style={{ ...styles.list, ...props.style }} onPress={onItemPress} /*disabled={props.disabled}*/><Row>
           <Col flex="auto"><Text style={{ ...styles.title, color: props.disabled ? "#999999" : "#000000"}}>{props.data.title}</Text></Col>
            <Col></Col>
        </Row></TouchableOpacity>

        <Modal animationType="slide" transparent={true} isVisible={showMessage != false} onRequestClose={() => { set_showMessage(false) }} >
            <View style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 10 }}>
                <Row style={{ marginBottom: 10, paddingBottom: 10 }}>
                    <Col flex="auto"><Text>Alert!</Text></Col>
                    <Col><TouchableOpacity onPress={() => set_showMessage(false)}><Text>X</Text></TouchableOpacity></Col>
                </Row>
                <Text>Please upgrade your package</Text>
            </View>
        </Modal>

    </>)
}

export default ListItem;

export const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey_shade_3,
        marginLeft: 10,
        padding: 10,
        // borderWidth:1,
        height: 70
    },
    title: {
        fontSize: 17,
    },

});
