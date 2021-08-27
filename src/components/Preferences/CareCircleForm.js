import React from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { theme } from "../../theme";
import { InputField } from './InputField';
import { CheckBox } from "react-native-elements";
import { Row, Col } from "../Grid";


export const CareCircleForm = props => {
    const [fields, setFields] = React.useState({ isEmergencyContact:false, })
    const [error, setError] = React.useState(null)

    const onValueChange = (value, name) => {
        const _fields = {...fields};
        Object.assign(_fields, {[name]:value});
        setFields(_fields);
    }

    const onSubmit = args => {
        if (!fields.memberName || fields.memberName.length < 1) { setError("Missing Name"); return; }
        if (!fields.relation || fields.relation.length < 1) { setError("Missing Relation"); return; }
        if (!fields.contactno || fields.contactno.length < 1) { setError("Missing Contact Number"); return; }
        if (!fields.address || fields.address.length < 1) { setError("Missing Address"); return; }

        props.onSubmit(fields)
    }

    return (<TouchableWithoutFeedback onPress={()=>{ console.log("something")}}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
            {error && <Text style={{ color: "#F00", fontWeight: "bold", paddingBottom: 15, textAlign:"center" }}>{error}</Text>}

            <InputField label="Name" value={fields.memberName} onChange={(val) => onValueChange(val, 'memberName')} />
            <InputField label="Relation" value={fields.relation} onChange={(val) => onValueChange(val, 'relation')} />
            <InputField label="Contact #" value={fields.contactno} onChange={(val) => onValueChange(val, 'contactno')} />
            {/* <InputField label="Emergency Contact" value={fields.isEmergencyContact} onChange={(val) => onValueChange(val, 'isEmergencyContact')} /> */}
            <Row style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.2)", paddingTop: 0, paddingBottom:5, marginBottom:5}}>
                <Col flex="auto" valign="center"><Text>Emergency Contact</Text></Col>
                <Col>
                    <CheckBox iconRight
                        // title={'checkbox'}
                        containerStyle={{ margin: 0, padding: 0, width: "100%", backgroundColor: "transparent", borderWidth: 0 }}
                        size={32}
                        checked={fields.isEmergencyContact}
                        checkedColor={theme.colors.colorPrimary}
                        onPress={() => { onValueChange(!fields.isEmergencyContact, "isEmergencyContact") }}
                    />
                </Col>
            </Row>
            

            <InputField label="Address" value={fields.address} onChange={(val) => onValueChange(val, 'address')} />

            <TouchableOpacity onPress={onSubmit} disabled={props.busy} activeOpacity={0.8} style={{ ...theme.palette.nextButton, marginTop: 15 }}>
                {!props.busy ? <Text style={theme.palette.buttonText}>Save</Text> : <ActivityIndicator animating={true} />}
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>);

}
