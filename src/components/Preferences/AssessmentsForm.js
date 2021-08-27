import React from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { theme } from "../../theme";
import { InputField, styles } from './InputField';
import { DateField } from '../DateField';
import { Row, Col } from '../Grid';
import { Divider } from "react-native-elements";
import { outgoingDateFormat } from '../../configs'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'

export const AssessmentsForm = props => {
    const [fields, setFields] = React.useState({})
    const [error, setError] = React.useState(null)
    const [date,setDate]= React.useState(null)
      
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const onValueChange = (value, name) => {
        const _fields = {...fields};
        Object.assign(_fields, {[name]:value});
        setFields(_fields);
    }

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const updateDateField = (value) => {
     
        const format =  'MM/DD/YYYY HH:mm:ss'
        const displayFormat =  'MM/DD/YYYY'
        let __date = moment(value); 
        const _outputDate = __date.format(format);
        const _displayFormat = __date.format(displayFormat);
        onValueChange(_outputDate, 'assessDate')
        setDate(_displayFormat)
        hideDatePicker()
      }

    const onSubmit = args => {
        setError(null);

        if (!fields.assessmentName || fields.assessmentName.length < 1) { setError("Missing Assessment Name"); return; }
        if (!fields.assessDate || fields.assessDate.length < 1) { setError("Missing Assessments Date"); return; }
        if (!fields.score || fields.score.length < 1) { setError("Missing Score"); return; }
        if (isNaN(fields.score)) { setError("Please provide number value for score"); return; }
        // if (Number(fields.score) < 1) { setError("Please provide number value for score"); return; }
        if (!fields.remarks || fields.remarks.length < 1) { setError("Missing Remarks"); return; }

        props.onSubmit(fields)
    }

    return (<TouchableWithoutFeedback onPress={() => { console.log("something") }}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
            {error && <Text style={{ color: "#F00", fontWeight: "bold", paddingBottom: 15, textAlign: "center" }}>{error}</Text>}

            <InputField label="Assessments Name" value={fields.assessmentName} onChange={(val) => onValueChange(val, 'assessmentName')} />
            {/* <InputField label="Date" value={fields.assessDate} onChange={(val) => onValueChange(val, 'assessDate')} /> */}
            <Row>
                <Col flex={150} valign="center"><Text>Date</Text></Col>
                <Col flex="auto">
                    <View style={{backgroundColor: 'rgba(238,238,238,255)' ,padding: 5,borderRadius: 4}}>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text >
                                <Text style={{ color: date == null ? "rgba(0,0,0,0.2)" : 'black' }}>{date != null ? date : "Date"}</Text>
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            display="spinner"
                            mode={"date"}
                            isVisible={isDatePickerVisible}
                            onConfirm={updateDateField}
                            onCancel={hideDatePicker}
                        />
                        </View>
                    {/* <DateField
                        // format="YYYY-MM-DD[T]00:00:00Z"
                        format={outgoingDateFormat}
                        style={{...styles.textField, paddingVertical:10 }}
                        // maximumDate={new Date(moment().subtract(18, 'years').format("YYYY"), 1, 1)}
                        value={fields.assessDate}
                        placeholder="Date" placeholderTextColor="rgba(0,0,0,0.2)"
                        onChange={(val) => onValueChange(val, 'assessDate')}
                    /> */}
                </Col>
            </Row>
            <Divider style={{ margin: 5 }} />

            <InputField label="Score" keyboardType='numeric' value={fields.score} onChange={(val) => onValueChange(val, 'score')} />
            <InputField label="Remarks" value={fields.remarks} onChange={(val) => onValueChange(val, 'remarks')} />

            <TouchableOpacity onPress={onSubmit} disabled={props.busy} activeOpacity={0.8} style={{ ...theme.palette.nextButton, marginTop: 15 }}>
                {!props.busy && <Text style={theme.palette.buttonText}>Save</Text>}
                {props.busy && <ActivityIndicator animating={true} />}
            </TouchableOpacity>

            {/* <Text>{JSON.stringify(fields, 0, 2)}</Text> */}
        </View>
    </TouchableWithoutFeedback>);

}
