import React from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { theme } from "../../theme";
import { InputField } from './InputField';

export const AllergiesForm = props => {
    const [fields, setFields] = React.useState({})
    const [error, setError] = React.useState(null)

    const onValueChange = (value, name) => {
        const _fields = {...fields};
        Object.assign(_fields, {[name]:value});
        setFields(_fields);
    }

    const onSubmit = args => {
        if (!fields.allergy || fields.allergy.length < 1) { setError("Missing Allergy name"); return; }
        if (!fields.remarks || fields.remarks.length<1){ setError("Missing Remarks"); return; }

        props.onSubmit(fields)
    }

    return (<TouchableWithoutFeedback onPress={()=>{ console.log("something")}}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
            {error && <Text style={{ color: "#F00", fontWeight: "bold", paddingBottom: 15, textAlign:"center" }}>{error}</Text>}

            <InputField label="Allergy" value={fields.allergy} onChange={(val) => onValueChange(val, 'allergy')} />
            <InputField label="Remarks" value={fields.remarks} onChange={(val) => onValueChange(val, 'remarks')} />

            <TouchableOpacity onPress={onSubmit} disabled={props.busy} activeOpacity={0.8} style={{ ...theme.palette.nextButton, marginTop: 15 }}>
                {!props.busy && <Text style={theme.palette.buttonText}>Save</Text>}
                {props.busy && <ActivityIndicator animating={true} />}
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>);

}
