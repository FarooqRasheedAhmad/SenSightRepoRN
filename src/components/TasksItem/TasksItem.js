import { Image, Text, TouchableOpacity, View ,ScrollView} from "react-native";
import React, { useState } from "react";
import { icons, images } from "../../assets";
import { Row, Col } from '../Grid';
import RNDialog from "react-native-dialog";
import { styles } from "./styles";
import { getTOffset } from '../../utils/Utils'
import moment from 'moment'
export const TasksItem = (props) => {
  const [visible, setVisible] = useState(false);
  console.log("props: ", props);
   const priorityArray = [
    { label: "Low", value: "1" },
    { label: "Medium", value: "2" },
    { label: "High", value: "3" },
];

  const { id, message, description, time, checked, priority, title, assignedToName, createdByName,taskDueDate ,taskPriority} = props;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(time);
  let dueDate = moment(taskDueDate);
  let createDate = moment(time)
  const _displayDate = dueDate.format('MM/DD/YYYY')
  const createdDate = createDate.format('MM/DD/YYYY')

  const getPriority = (val) => {
    switch (val) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "N/A";
    }
  };

  const __time = getTOffset(time);

  let __date = __time.offsetTime.format("dddd, HH:mm");

  // __date = `${days[date.getDay()]}, `;
  // __date += `${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:`;
  // if (date.getMinutes()>9) __date += `${date.getMinutes()}`
  // else __date += `0${date.getMinutes()}`


  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Row>
        <Col valign="center">
          <TouchableOpacity onPress={() => props.showTaskCompleteDialog(id)} style={{ padding: 10, paddingRight: 15 }}>
            <Image source={checked ? icons.checked_icon : icons.unchecked} />
          </TouchableOpacity>
        </Col>
        
        <Col flex="auto" valign="center">
          <TouchableOpacity onPress={() => setVisible(true)} style={{ width:"100%" }}>
            <View style={styles.contentRoot}>
              {/* {message ? <Text style={styles.taskName}>{message}</Text> : null} */}
              {(title || description) && <Text style={{ fontWeight: "bold", width: "90%" }} numberOfLines={1} ellipsizeMode={'tail'}>{title || description}</Text>}

              <Row>
                <Col flex="auto" valign="center"><Text>{__date}</Text></Col>
                <Col valign="center"><Text style={{ color: "grey", marginRight: 16 }}>Importance Level: <Text style={{ fontWeight: "bold" }}>{getPriority(priority)}</Text></Text></Col>
              </Row>
              {(createdDate) && <Text style={{ width: "90%", marginTop: 5 }} numberOfLines={1} ellipsizeMode={'tail'}>{createdDate}</Text>}
              {props.overdue && (
                <View style={styles.overdueContainer}>
                  <Text style={styles.overdueText}>Overdue</Text>
                  <Image source={icons.overdue_alert} />
                </View>
              )}

            </View>
          </TouchableOpacity>
        </Col>
      </Row>
   <View style={{backgroundColor: 'red'}}>
      <RNDialog.Container contentStyle={{height: '70%'}}  visible={visible} key={id}>
        <ScrollView style={{padding: 10}}>
        <RNDialog.Title style={{fontSize: 14,alignSelf: 'flex-start'}}>{`Task:  ${description}`}</RNDialog.Title>
        </ScrollView>
        <RNDialog.Description style={{fontSize: 14,alignSelf: 'flex-start'}}>{`Created by:  ${createdByName}`}</RNDialog.Description>
        <RNDialog.Description style={{fontSize: 14,alignSelf: 'flex-start'}}>{`Assign To:  ${assignedToName}`}</RNDialog.Description>
        <RNDialog.Description style={{fontSize: 14,alignSelf: 'flex-start'}}>{`Due on:  ${_displayDate}`}</RNDialog.Description>
        <RNDialog.Description style={{fontSize: 14,alignSelf: 'flex-start',paddingBottom: 0,}}>{`Priority:  ${priorityArray[taskPriority-1].label}`}</RNDialog.Description>
     
        <RNDialog.Button label="Cancel" onPress={() => setVisible(false)} bold />
  </RNDialog.Container>
      </View>
    </View>
  );
};
