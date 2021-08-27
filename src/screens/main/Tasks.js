import { AppConstants, StorageUtils, showMessage } from "../../utils";
import { FlatList, View, StyleSheet } from "react-native";
import { NoDataState, SearchBar, TasksItem, NavigationHeader, NavigationHeaderV2 } from "../../components";
import React, { Component } from "react";

import Dialog from "react-native-dialog";
import { HeaderBackButton } from "react-navigation-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { theme } from "../../theme";

export class Tasks extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Tasks",
      headerTintColor: "white",
      headerTitleStyle: { fontSize: 24 },
      headerStyle: { backgroundColor: theme.colors.colorPrimary },
      headerLeft: (
        <HeaderBackButton
          tintColor={theme.colors.white}
          onPress={async () => {
            await navigation.getParam("getTasksFromServer")();
            navigation.goBack();
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const { getParam } = this.props.navigation;
    this.role = getParam("userType");
    this.state = {
      tasks: [],
      spinner: false,
      taskDialog: false,
    };
    this.arrayHolder = [];
    this.completedTaskId = null;
  }

  componentDidMount() {
    this.setState({ spinner: true });
    this.getTasksFromServer();
  }

  searchFilter = (text) => {
    const newData = this.arrayHolder.filter((item) => {
      // return item.taskname.toLowerCase().includes(text.toLowerCase());
      return item.taskDescription.toLowerCase().includes(text.toLowerCase());
    });
    this.setState({ tasks: newData });
  };

  getTasksFromServer = async () => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    
      let uri =   this.role == "1"?String(api.assignTasks).replace("{2}", "1"): String(api.assignTasks).replace("{2}", "2")
      const response = await fetch(uri, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        this.arrayHolder = data;
        this.setState({ spinner: false, tasks: data });
      }
    } catch (err) {
      this.setState({ spinner: false });
      showMessage("Error in getting task");
    }
  };

  showTaskCompleteDialog = (id) => {
    this.completedTaskId = id;
    this.setState({ taskDialog: true });
  };

  markTaskAsCompleted = async () => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const reqBody = JSON.stringify({
        taskId: this.completedTaskId,
        taskStatus: true,
      });
      const response = await fetch(api.updateTaskStatus, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: reqBody,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("RESP-->", data);
        const newData = this.state.tasks.map((item) => {
          if (data.id == item.id) {
            item.taskStatus = true;
          }
          return item;
        });
        this.setState({ tasks: newData, spinner: false, taskDialog: false });
      } else {
        this.setState({ spinner: false });
        showMessage("Unable to mark task as completed");
      }
    } catch (err) {
      this.setState({ spinner: false });
      showMessage("Error in marking task");
    }
  };
  
  render() {
    return (
      <View style={styles.container}>
        {/* <NavigationHeader title={'Tasks'} leftText={'Back'} navigation={this.props.navigation} /> */}
        <NavigationHeaderV2 title='Tasks' allowBack navigation={this.props.navigation} rightComponent={<View style={{width:50}} />} />

        <View style={styles.subContainer} >
          <Spinner visible={this.state.spinner} />
          <View><SearchBar searchFilter={this.searchFilter} /></View>

          {this.state.tasks.length ? (
            <FlatList
              data={this.state.tasks}
              renderItem={({ item }) => (
                <TasksItem
                  title={item.title}
                  message={item.taskname}
                  description={item.taskDescription}
                  time={item.createdDate}
                  checked={item.taskStatus}
                  priority={item.taskPriority}
                  assignedToName={item.assignedToName}
                  createdByName={item.createdByName}
                  taskDueDate={item.taskDate}
                  taskPriority={item.taskPriority}
                  id={item.id}
                  showTaskCompleteDialog={this.showTaskCompleteDialog}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
              <NoDataState text="No tasks available" />
            )}
        </View>

        <Dialog.Container visible={this.state.taskDialog}>
          <Dialog.Title style={{ textAlign: "center" }}>Task Confirmation</Dialog.Title>
          <Dialog.Description>Are you sure task is completed?</Dialog.Description>
          <Dialog.Button label="Ok" onPress={this.markTaskAsCompleted} />
          <Dialog.Button label="Cancel" onPress={() => this.setState({ taskDialog: false })} />
        </Dialog.Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary,
    paddingTop: Platform.OS === "ios" ? 44 : 0
  },
  subContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  heading: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: "rgba(0, 0, 0, 0.48)"
  }
});
