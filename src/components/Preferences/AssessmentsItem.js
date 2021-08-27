import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from "../../theme";
import { Row, Col } from '../Grid';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome';



export const AssessmentsItem = props => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.6} style={styles.listItem}><>
            <Row>
                <Col flex="auto"><View>
                    <Text style={styles.text}>{props.assessmentName}</Text>
                    <Text style={{ ...styles.text, color: "rgba(0, 0, 0, 0.48)", fontSize: 13 }}>{moment(props.assessDate).format('dddd[,] Do MMMM YYYY')}</Text>
                </View></Col>
                <Col flex={80} valign="center" align="flex-end"><Text style={{ ...styles.text, color: "rgba(0, 0, 0, 0.48)"}}>{props.score}</Text></Col>
                <Col valign="center" style={{paddingLeft:10}}><Icon name="angle-right" size={25} color="#CCC" /></Col>
            </Row>


            {/* <Row>
                <Col flex="auto"><Text style={styles.li_heading}>{props.allergy}</Text></Col>
                <Col></Col>
            </Row>
            <Text style={styles.text}>{props.remarks}</Text> */}

            {/* <Image source={props.isChecked ? icons.checked_icon : icons.empty} /> */}
        </></TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        paddingRight: 10,
        borderBottomColor: "rgba(0,0,0,0.2)",
        borderBottomWidth: 0.5,
        paddingBottom: 15,
        paddingTop: 15,
        alignItems: "center",
    },
    li_heading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: theme.colors.black,
        fontWeight:"bold",
        marginBottom: 15,
    },
    text:{
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: -0.24,
        // color: "rgba(0, 0, 0, 0.48)"
    },

});
