import React, { useState, useEffect } from "react";
import { Button, View, TextInput, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import _ from 'lodash'


const _DateField = props => {
    if (props.value && !_.isString(props.value)) {
        alert("Please provide string format for date field value");
        console.log('Please provide string format for date field value', props);
        return null;
    }
    const format = props.format || 'MM/DD/YYYY HH:mm:ss'
    const displayFormat = props.displayFormat || 'MM/DD/YYYY'

    const validateDateValue = args => (props.value && _.isString(props.value) && props.value.length > 5 && props.value.indexOf('0001') < 0)
    const currentMoment = args => {
        let _date = moment();

        console.log("props.value: ", props.value);
        if (validateDateValue()) _date = moment(new Date(props.value));


        return null;
        if (_date.format().toLowerCase().indexOf('invalid') > -1) _date = moment();
        return _date;
    }
    const currentDate = args => {
        let _date = currentMoment();
        let _a = _date.format(format)
        let _d = new Date(_a);
        return _d;
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {

        let __date = moment(date);
        console.log("1 setSelectedDate called with: "+ __date.format(format))
        setSelectedDate(__date)
        hideDatePicker();
        if (props.onChange) props.onChange(__date.format(format));
    };

    React.useEffect(() => {
        let isValidValue = validateDateValue();
        if (isValidValue) {
            let _selectedDate = currentMoment();
            console.log("2 setSelectedDate called with: "+ _selectedDate.format(format))
            setSelectedDate(_selectedDate);
        }

        return () => {
            // effect
        };
    }, [props])


    return <Text>DateField</Text>
}


export const __DateField = (props) => {
    if (props.value && !_.isString(props.value)){
        alert("Please provide string format for date field value");
        console.log('Please provide string format for date field value', props);
        return null;
    }
    const format = props.format || 'MM/DD/YYYY HH:mm:ss'
    const displayFormat = props.displayFormat || 'MM/DD/YYYY'

    const validateDateValue = args => (props.value && _.isString(props.value) && props.value.length > 5 && props.value.indexOf('0001') < 0)
    const currentMoment = args => {
        let _date = moment();
        if (validateDateValue()) _date = moment(new Date(props.value));
        if (_date.format().toLowerCase().indexOf('invalid') > -1) _date = moment();
        return _date;
    }
    const currentDate = args => {
        let _date = currentMoment();
        let _a = _date.format(format)
        let _d = new Date(_a);
        return _d;
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState( null );

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        let __date = moment(date);
        console.log("3 setSelectedDate called with: "+ __Date.format(format))
        setSelectedDate(__date)
        hideDatePicker();
        if (props.onChange) props.onChange(__date.format(format));
    };

    useEffect(() => {
        let isValidValue = validateDateValue();
        if (isValidValue){
            let _selectedDate = currentMoment();
            console.log("4 setSelectedDate called with: "+ _selectedDate.format(format))
            setSelectedDate(_selectedDate);
        }

        return () => {
            // effect
        };
    }, [props])


    return (
        <>
            <TouchableOpacity onPress={showDatePicker}>
                <Text style={props.style}>
                    {selectedDate ? selectedDate.format(displayFormat) : props.placeholder ? <Text style={{ color: "rgba(0,0,0,0.2)" }}>{props.placeholder}</Text> : ""}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                maximumDate={props.maximumDate} //{new Date(2000, 1, 1)}
                minimumDate={props.minimumDate}
                isVisible={isDatePickerVisible}
                mode={props.mode || "date"}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={currentDate()}
            />
        </>
    );
};


export const DateField = (props) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState( null );
    const [selectedDateDisplay, setSelectedDatedisplay] = useState( null );
    const [outputDate, setOutputDate] = useState( null );

    if (props.value && !_.isString(props.value)){
        alert("Please provide string format for date field value");
        console.log('Please provide string format for date field value', props);
        return <Text>Invalid Date provided</Text>;
    }

    const format = props.format || 'MM/DD/YYYY HH:mm:ss'
    const displayFormat = props.displayFormat || 'MM/DD/YYYY'

    const validateDateValue = args => (props.value && _.isString(props.value) && props.value.length > 5 && props.value.indexOf('0001') < 0)
    const currentMoment = args => {
        console.log("currentMoment()");

        let _date = moment();
        if (validateDateValue()) _date = moment(new Date(props.value || ""));
        if (_date.format().toLowerCase().indexOf('invalid') > -1) _date = moment();
        return _date;
    }
    const currentDate = args => {
        let _date = currentMoment();
        const localDateString = _date.toLocaleString()
        let _d = new Date(localDateString);

        return !isNaN(_d) ? _d : new Date();
    }

    const getDispalyDate = args => {
        console.log("getDisplayDate -- props.value: "+ props.value)
        console.log("getDisplayDate -- selectedDateDisplay: "+ selectedDateDisplay)

        if(_.isNull(props.value) || _.isEmpty(props.value)){
            console.log("IT IS EMPTY")
            var _date = currentMoment();
            console.log("1 New Date: "+  _date.format(format))
        }
        else{
            console.log("IT IS NOT EMPTY")
            var _date = moment(props.value, "DD/MM/YYYY HH:mm:ss");
            console.log("2 New Date: "+  _date.format(format))
        }
        const localDateString = _date.toLocaleString()
        let _d = new Date(localDateString);

        return !isNaN(_d) ? _d : new Date();
    }

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        // UTC Date : date
        let __date = moment(date); // converting the selected date as current date on utc 0, fixing time difference

        const _displayDate = __date.format(displayFormat)
        const _outputDate = __date.format(format);

        setSelectedDatedisplay(_displayDate)
        setOutputDate(_outputDate);
        console.log("5 setSelectedDate called with: "+ __date.format(format))
        setSelectedDate(__date)
        hideDatePicker();

        if (props.onChange) props.onChange(_outputDate);
    };

    React.useEffect(() => {
        let isValidValue = validateDateValue();
        if (isValidValue){
            let _selectedDate = currentMoment();
            console.log("6 setSelectedDate called with: "+ _selectedDate.format(format))
            setSelectedDate(_selectedDate);
        }

        return () => {
            // effect
        };
    }, [props])

    // 
    return (
        <View>
            <TouchableOpacity onPress={showDatePicker}>
                <Text style={props.style}>
                    {selectedDateDisplay || props.value ||   <Text style={{ color: "rgba(0,0,0,0.2)" }}>{props.placeholder || ""}</Text>}
                </Text>
                {/* <Text>{outputDate}</Text> */}
            </TouchableOpacity>

            <DateTimePickerModal
                // maximumDate={props.maximumDate} //{new Date(2000, 1, 1)}
                maximumDate={props.maximumDate || new Date(moment().subtract(18, 'years').format("YYYY"), 1, 1)}
                minimumDate={props.minimumDate || new Date(moment().subtract(100, 'years').format("YYYY"), 1, 1)}
                date={getDispalyDate()}
                display="spinner"

                isVisible={isDatePickerVisible}
                mode={props.mode || "date"} // date, time, datetime
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

// export default DateField;