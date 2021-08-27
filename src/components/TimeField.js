import React, { useEffect, useState } from "react";
import { Button, View, TextInput, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import _ from 'lodash'

const isValidDate = (_value) => {
    let _valid = (_value && _.isString(_value) && _value.length > 4 && _value.indexOf('0001') < 0);
    if (!_valid) console.log("INVALID VALUE: ", _value);
    return _valid;
};



export const TimeField = (props) => {
    const { value, placeholder } = props;
    const format = props.format || 'HH:mm:ss'
    const displayFormat = props.displayFormat || 'HH:mm'

    const currentMoment = args => {
        let _date = isValidDate(value) ? moment(props.value, format) : moment();
        // if (isValidDate()) _date = moment(props.value, format);
        if (_date.format().toLowerCase().indexOf('invalid') > -1) _date = moment();
        return _date;
    }
    const currentDate = args => {
        let _date = currentMoment();
        let _a = _date.format()
        let _d = new Date(_a);
        return _d;
    }

    const [selectedDate, setSelectedDate] = useState(moment()); // useState(currentMoment());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleConfirm = (date) => {
        let __date = moment(date);
        // console.log(__date.format());
        setDatePickerVisibility(false);
        // setSelectedDate(__date)
        // hideTimePicker();
        if (props.onChange) props.onChange(__date.format(format));
    };


    React.useEffect(() => {
        // if (isValidDate(value)){
        //     setSelectedDate(currentMoment());
        //     setDatePickerVisibility(false);
        // }
        //   return () => { };
    }, [value])

    // if (props.value && !isValidDate(value)) {
    //     // alert("Please provide string format for date field value");
    //     // console.log('Please provide string format for date field value', props);
    //     return <Text>Invalid Date provided, must be a string ({format})</Text>;
    // }

    return(<>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <Text style={props.style}>
                {/* {selectedDate ? selectedDate.format(displayFormat) : placeholder ? <Text style={{ color: "rgba(0,0,0,0.2)" }}>{placeholder}</Text> : ""} */}
                {isValidDate(value) ? moment(value).format(displayFormat) : placeholder ? <Text style={{ color: "rgba(0,0,0,0.2)" }}>{placeholder}</Text> : ""}
            </Text>
        </TouchableOpacity>

        {isDatePickerVisible &&
            <DateTimePickerModal is24Hour mode="time"
                isVisible={isDatePickerVisible}
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                date={currentDate()}
                // date={new Date()}
            />
        }

    </>)

}


const _TimeField = (props) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    if (props.value && !_.isString(props.value)) {
        alert("Please provide string format for date field value");
        console.log('Please provide string format for date field value', props);
        return null;
    }
    const format = props.format || 'HH:mm:ss'
    const displayFormat = props.displayFormat || 'HH:mm'

    const validateDateValue = args => {
        console.log("validateDateValue()");
        console.log("props.value: ", (props.value && _.isString(props.value) && props.value.length > 4 && props.value.indexOf('0001') < 0) );
        
        return (props.value && _.isString(props.value) && props.value.length > 4 && props.value.indexOf('0001') < 0);
    }
    const currentMoment = args => {
        let _date = moment();
        // if (validateDateValue()) _date = moment(new Date(props.value));
        if (validateDateValue()) _date = moment(props.value, format);
        if (_date.format().toLowerCase().indexOf('invalid') > -1) _date = moment();
        return _date;
    }
    const currentDate = args => {
        let _date = currentMoment();
        let _a = _date.format()
        let _d = new Date(_a);
        return _d;
    }

    const showTimePicker = () => setDatePickerVisibility(true);
    const hideTimePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        let __date = moment(date);
        setSelectedDate(__date)
        hideTimePicker();
        if (props.onChange) props.onChange(__date.format(format));
    };

    React.useEffect(() => {
        let isValidValue = validateDateValue();
        // // let _selectedDate = 
        if (!isValidValue) {
            console.log("is not valid date: ", props.value);
            // let _selectedDate = currentMoment();
            // setSelectedDate(_selectedDate);
        }else{
            console.log("IS VALID");
        }

        if (!selectedDate){
            let _selectedDate = currentMoment();
            setSelectedDate(_selectedDate);
        }


        return () => {
            // effect
        };
    }, [props])


    return (
        <>
            <TouchableOpacity onPress={showTimePicker}>
                <Text style={props.style}>
                    {selectedDate ? selectedDate.format(displayFormat) : props.placeholder ? <Text style={{ color: "rgba(0,0,0,0.2)" }}>{props.placeholder}</Text> : ""}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal is24Hour mode="time"
                isVisible={isDatePickerVisible}
                onConfirm={handleConfirm}
                onCancel={hideTimePicker}
                date={currentDate()}
                // date={new Date()}
            />
        </>
    );
};

// export default TimeField;