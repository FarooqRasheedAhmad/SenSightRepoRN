import React from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { theme } from "../../theme";
import { InputField } from './InputField';

export const Medicationform = props => {
    const [fields, setFields] = React.useState({})
    const [error, setError] = React.useState(null)

    const onValueChange = (value, name) => {
        const _fields = {...fields};
        Object.assign(_fields, {[name]:value});
        setFields(_fields);
    }

    const onSubmit = args => {
        if (!fields.medicine || fields.medicine.length<1){ setError("Missing Medicine name"); return; }
        if (!fields.dosage || fields.dosage.length < 1) { setError("Missing Dosage"); return; }
        if (!fields.doctorName || fields.doctorName.length<1){ setError("Missing Doctor's Name"); return; }
        if (!fields.remarks || fields.remarks.length<1){ setError("Missing Remarks"); return; }

        props.onSubmit(fields)
    }
    return (<TouchableWithoutFeedback onPress={()=>{ console.log("something")}}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
            {error && <Text style={{ color: "#F00", fontWeight: "bold", paddingBottom: 15, textAlign:"center" }}>{error}</Text>}

            <InputField label="Medicine Name" value={fields.medicine} onChange={(val) => onValueChange(val, 'medicine')} />
            <InputField label="Dosage" value={fields.dosage} onChange={(val) => onValueChange(val, 'dosage')} />
            <InputField label="Doctor's Name" value={fields.doctorName} onChange={(val) => onValueChange(val, 'doctorName')} />
            <InputField label="Remarks" value={fields.remarks} onChange={(val) => onValueChange(val, 'remarks')} />

            <TouchableOpacity onPress={onSubmit} disabled={props.busy} activeOpacity={0.8} style={{ ...theme.palette.nextButton, marginTop: 15 }}>
                {!props.busy && <Text style={theme.palette.buttonText}>Save</Text>}
                {props.busy && <ActivityIndicator animating={true} />}
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>);
}
