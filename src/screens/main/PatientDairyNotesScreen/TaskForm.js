import { AppConstants, StorageUtils, convertDate, showMessage, } from "../../../utils";
import { Avatar, Button, Divider } from "react-native-elements";
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity , ScrollView} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { NavigationHeaderV2, NoDataState, DropDown, Col, Row, DateField, TextInput } from "../../../components";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";
import { priorityArray } from '../../../configs'
import moment from 'moment'

export const TaskForm = (props) => {
  const noteId = props.navigation.getParam("noteId", null);
  const name = props.navigation.getParam("name", null);
  // const seniorId = props.navigation.getParam("seniorId", null);
  // const userId = StorageUtils.getValue(AppConstants.SP.USER_ID)

  const [notes, setNotes] = useState("");
  const [taskDate, setTaskDate] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  const [fields, setFields] = useState({
    alertId: 0,
    assignedForId: props.navigation.getParam("seniorId", null),
    category: "Caretaker", // "Supervisor",
    taskDate: null, //yyyy/MM/dd HH:mm
    taskDescription: null,
    taskPriority: 1,
    taskName: "",
    taskStatus: 1,
    userId: null ,//: StorageUtils.getValue(AppConstants.SP.USER_ID),
  });

  const updateField = (field,value) => {
    let _fields = { ...fields };
    Object.assign(_fields, {[field]:value});
    setFields(_fields);
  }
  const updateDateField = (value) => {
    const format = props.format || 'MM/DD/YYYY HH:mm:ss'
    const displayFormat = props.displayFormat || 'MM/DD/YYYY'
    let __date = moment(value); // converting the selected date as current date on utc 0, fixing time difference
    const _displayDate = __date.format(displayFormat)
    const _outputDate = __date.format(format);

    let _fields = { ...fields };
    Object.assign(_fields, {["taskDate"]:_displayDate});
    setFields(_fields);
    hideDatePicker()
  }


  const { data, loading, error } = useFetch(
    api.patientDiary + "/NotesDetail/" + noteId
  );

  useEffect(() => {
    if (!fields.userId){
        StorageUtils.getValue(AppConstants.SP.USER_ID).then(r=>{
          updateField("userId", r);
        })
    }

  }, []);

  const validateInput = args => {
    if (!fields.taskDescription || fields.taskDescription.length < 1) {
      showMessage("Please add some notes");
      return false;
    }
    if (!fields.taskPriority || fields.taskPriority.length < 1) {
      showMessage("Please select priority");
      return false;
    }
    if (!fields.taskDate || fields.taskDate.length < 1) {
      showMessage("Please select a date/time");
      return false;
    }
    return true;
  }

  const onSave = async () => {
    if (!validateInput()) return;

    setLoadingSave(true);
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    fetch(api.addTask, {
    // fetch(api.patientDiary + "/NotesDetail", {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      body: JSON.stringify({
        ...fields
        // notes,
        // seniorId: +seniorId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          setLoadingSave(false);
          showMessage("Error in adding notes");
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        setLoadingSave(false);
        // data.notes && props.navigation.goBack();
        props.navigation.goBack();
      })
      .catch((error) => {
        setLoadingSave(false);
        showMessage("Error in adding notes");
      });
  };

  const suffix = (day) => {
    if (day > 3 && day < 30) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
  }
  }

  const getDescriptionElement = (key, value) => (
    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
      <Text style={styles.elementLeft}>{key}</Text>
      <Text style={styles.elementRight}>{value}</Text>
    </View>
  );
  const dateFormate =(date) =>{
    const month = date.substr(0, 3);
    const day = date.substr(4, 2);
    const year = date.substr(7, 4);
    return (`${day + suffix(day)}  ${month}, ${year}`);
}
const showDatePicker = () => setDatePickerVisibility(true);
const hideDatePicker = () => setDatePickerVisibility(false);

  if (noteId && error) return <NoDataState text={"Error: " + error} />;
  if (noteId && loading) return <NoDataState text="Loading..." />;

  const { day, month, time, date } = convertDate(data && data.createdDate, "full");
  

  if (noteId) return (<View style={styles.root}>

  <NavigationHeaderV2  
        title={'Patient Diary'}
        allowBack={true}
        
        navigation={props.navigation}
  />

  <View style={{flex:1, backgroundColor: "white"}}> 
    <View style={{ margin: 16 }}><Text style={styles.notes}>{data ? data.notes : ""}</Text></View>
      <View style={{ margin: 16 }}>
        {getDescriptionElement("Author:", name)}
        {getDescriptionElement("Date:", `${dateFormate(date)}`)}
        {/* {getDescriptionElement("Time:", time)} */}
      </View>
    </View>
  </View>)

  return (
    <View style={{flex:1,backgroundColor: theme.colors.colorPrimary,}}>
        
      <SafeAreaView style={[styles.root,{backgroundColor: theme.colors.colorPrimary,}]}>
      <NavigationHeaderV2  
                    title={'Add Task'}
                    allowBack={true}
                    navigation={props.navigation}
            />
      {/* <Text style={styles.label}>Task Description *</Text> */}
      <ScrollView style={{backgroundColor: theme.colors.white}}>
      <View style={{padding: 15,flex: 1 ,backgroundColor: theme.colors.white,}}>
      <TextInput multiline
        value={fields.taskDescription}
        label="Task Description *"
        placeholder="Add notes here" placeholderTextColor="grey"
        onChange={(text) => updateField("taskDescription", text)}
      />

      <Text style={styles.label}>Date *</Text>
      <View>
            <TouchableOpacity onPress={showDatePicker}>
                <Text style={styles.input}>
                     <Text style={{ color: fields.taskDate == null?"rgba(0,0,0,0.2)":'black' }}>{ fields.taskDate != null?fields.taskDate:"Select Date/Time"}</Text>
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
     
      {/* <DateField mode="datetime"
        format="YYYY/MM/DD HH:mm" displayFormat="YYYY/MM/DD HH:mm"
        style={styles.input}
        value={fields.taskDate}
        placeholder="Select Date/Time" placeholderTextColor="rgba(0,0,0,0.2)"
        onChange={(val) => updateField("taskDate", val)}
      /> */}

      <Text style={styles.label}>Priority *</Text>
      <DropDown size="large"
        style={{ ...styles.input, width: "100%" }}
        placeholder="Priority"
        value={fields.taskPriority}
        onChange={(value, index, item) => updateField("taskPriority", value)}
        data={priorityArray}
      />

      {/* <Text>{JSON.stringify(fields, 0, 2)}</Text> */}

      <View style={styles.buttonView}>
        <Button raised loading={loadingSave} disabled={loadingSave} loadingProps={{ color: theme.colors.colorPrimary }}
          title="Save" titleStyle={{ fontWeight: "600" }}
          buttonStyle={{ backgroundColor: theme.colors.colorPrimary, borderRadius: 8, }}
          containerStyle={{ width: 120, marginHorizontal: 16 }}
          onPress={onSave}
        />
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};

TaskForm.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam("name", "Add Task");
  const profileImage = navigation.getParam("profileImage", "");
  const placeholderTitle = title ? title.split(" ") : ["", ""];

  return {
    title: title || "Add Task",
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: { fontSize: 22 },
    headerStyle: { backgroundColor: theme.colors.colorPrimary },
    headerRight: () => (
      <Avatar source={profileImage} rounded 
        title={ placeholderTitle[0].charAt(0) + (placeholderTitle[1] || "").charAt(0) }
        titleStyle={{ color: theme.colors.colorPrimary }}
        overlayContainerStyle={{ backgroundColor: "white" }}
      />
    ),
    headerRightContainerStyle: { marginRight: 16 },
  };
};

const styles = StyleSheet.create({
  label:{ fontSize: 18, fontFamily: theme.fonts.SFProSemibold, },
  input: {
    // height: Dimensions.get("window").height / 4,
    // justifyContent: "flex-start",
    fontSize: 18,
    borderWidth: 1,
    borderColor: theme.colors.grey_shade_1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 50,
  },

  root: { flex: 1, 
    backgroundColor: theme.colors.white,    
    paddingTop: Platform.OS === "ios" ?  35 : 25
  },
  inputView: {
    borderColor: theme.colors.grey_shade_1,
    borderWidth: 1,
    padding: 5,
    margin: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  buttonView: {
    alignItems: "flex-end",
    width: "100%",
  },
  notes: {
    height: Dimensions.get("window").height / 2,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 16,
  },
  elementLeft: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 16,
    fontWeight: "400",
  },
  elementRight: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 16.5,
    marginHorizontal: 10,
  },
});
