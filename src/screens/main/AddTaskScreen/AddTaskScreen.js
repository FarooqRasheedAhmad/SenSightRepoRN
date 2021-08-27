import { AppConstants, StorageUtils, convertDate, showMessage, } from "../../../utils";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NoDataState, DropDown, Col, Row, DateField, TextInput } from "../../../components";
// import { TextInput } from '../../../components/TextInput';
// import { Button } from "react-native-elements";
import { Button } from '../../../components/elements'
import RNPickerSelect from "react-native-picker-select";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";
import { priorityArray } from '../../../configs'


export const AddTaskScreen = (props) => {
  const noteId = props.navigation.getParam("noteId", null);
  // const name = props.navigation.getParam("name", null);
  const fromAlerts = props.navigation.getParam("fromAlerts", false);
  const alertId = props.navigation.getParam("alertId", null);
  // const seniorId = props.navigation.getParam("seniorId", null);
  // const userId = StorageUtils.getValue(AppConstants.SP.USER_ID)
  const [fields, setFields] = useState({
    alertId: 0,
    assignedForId: props.navigation.getParam("seniorId", null),
    category: "Caretaker", // "Supervisor",
    taskDate: null, //yyyy/MM/dd HH:mm
    taskDescription: null,
    taskPriority: 1,
    taskName: "",
    taskStatus: 1,
    userId: null, //StorageUtils.getValue(AppConstants.SP.USER_ID),
  });

  // const [notes, setNotes] = useState("");
  // const [taskDate, setTaskDate] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const updateField = (field, value) => {
    let _fields = { ...fields };
    Object.assign(_fields, { [field]: value });
    setFields(_fields);
  }

  const { data, loading, error } = useFetch(
    api.patientDiary + "/NotesDetail/" + noteId
  );

  useEffect(() => {
    if (!fields.userId) {
      StorageUtils.getValue(AppConstants.SP.USER_ID).then(r => {
        updateField("userId", r);
      })
    }

    const taskName = props.navigation.getParam("taskName", "");
    if (taskName) updateField({taskName});

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
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      body: JSON.stringify({
        ...fields,
        ...(fromAlerts ? { alertId } : {})
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
        if (fromAlerts) props.navigation.navigate("AlertsScreen");
        else props.navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        setLoadingSave(false);
        showMessage("Error in adding notes");
      });
  };

  const { day, month, time } = convertDate(data && data.createdDate, "full");

  return (
    <View style={styles.root}>
      <SafeAreaView style={{flex:1}}>
      <Text style={styles.heading}>Create New Task</Text>
      
      {/* <Text style={styles.label}>Task Description *</Text> */}
      <TextInput multiline style={{ ...styles.input, minHeight: 150 }}
        value={fields.taskDescription}
        placeholder="Add notes here"
        onChange={(text) => updateField("taskDescription", text)}
      />
      {/* <TextInput multiline style={{ ...styles.input, minHeight: 150 }}
        value={fields.taskDescription}
        placeholder="Add notes here" placeholderTextColor="grey"
        onChangeText={(text) => updateField("taskDescription", text)}
      /> */}

      <Text style={styles.label}>Date *</Text>
      <DateField mode="datetime"
        format="YYYY/MM/DD HH:mm" displayFormat="YYYY/MM/DD HH:mm"
        style={styles.input}
        value={fields.taskDate}
        placeholder="Select Date/Time" placeholderTextColor="rgba(0,0,0,0.2)"
        onChange={(val) => updateField("taskDate", val)}
      />

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
      </SafeAreaView>
    </View>
  );
};

export const _AddTaskScreen = (props) => {
  const fromAlerts = props.navigation.getParam("fromAlerts", false);
  const alertId = props.navigation.getParam("alertId", null);
  const getTaskName = props.navigation.getParam("taskName", "");

  const [taskName, setTaskName] = useState();
  const [taskeDetail, setTaskDetail] = useState("");
  const [taskPriority, setTaskPriority] = useState("1");
  const [spinner, setSpinner] = useState(false);

  const taskPriorityItems = [
    { label: "Low", value: "1" },
    { label: "Medium", value: "2" },
    { label: "High", value: "3" },
  ];

  useEffect(() => {
    const getTaskName = props.navigation.getParam("taskName", "");
    if (getTaskName) {
      setTaskName(getTaskName);
    }
  }, []);

  const addTask = async () => {
    try {
      setSpinner(true);
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
      const reqBody = JSON.stringify({
        userId,
        taskName,
        ...(fromAlerts ? { alertId } : {}),
        taskDescription: taskeDetail,
        taskPriority: parseInt(taskPriority),
      });
      const response = await fetch(api.addTask, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: reqBody,
      });
      if (response.ok) {
        setSpinner(false);
        showMessage("Task Added.");
        if (fromAlerts) {
          props.navigation.navigate("AlertsScreen");
        } else {
          props.navigation.navigate("HomeScreen");
        }
      } else {
        setSpinner(false);
        showMessage("Error in adding task");
      }
    } catch (error) {
      setSpinner(false);
      showMessage("Error in adding task");
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Create New Task</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputHeading}>Task Name</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            // placeholder="Add task name"
            value={taskName}
            placeholderTextColor="grey"
            style={styles.textInput}
            onChangeText={(text) => setTaskName(text)}
          />
        </View>
      </View>

      <View style={{ marginVertical: 16 }}>
        <Text style={styles.inputHeading}>Detail</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            multiline
            // placeholder="Add task detail"
            placeholderTextColor="grey"
            style={{ ...styles.textInput, height: 100 }}
            onChangeText={(text) => setTaskDetail(text)}
          />
        </View>
      </View>

      <View style={styles.priorityRoot}>
        <Text style={{ ...styles.inputHeading }}>Importance Level:</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            value={taskPriority}
            placeholder={{}}
            onValueChange={(value) => setTaskPriority(value)}
            items={taskPriorityItems}
            style={{ borderWidth: 1, color: "grey" }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Confirm"
          titleStyle={{ fontWeight: "600" }}
          raised
          buttonStyle={{
            backgroundColor: theme.colors.colorPrimary,
            borderRadius: 8,
          }}
          containerStyle={{ width: 150, marginHorizontal: 16 }}
          onPress={addTask}
          loading={spinner}
          disabled={spinner}
        />
      </View>
    </View>
  );
};

AddTaskScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Tasks",
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: { fontSize: 22 },
    headerStyle: { backgroundColor: theme.colors.colorPrimary },
  };
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontFamily: theme.fonts.SFProSemibold,
    marginVertical: 16,
  },

  label: { fontSize: 18, fontFamily: theme.fonts.SFProSemibold, },
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


  root: { flex: 1, backgroundColor: "white", paddingHorizontal: 15, paddingVertical: 20 },
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
