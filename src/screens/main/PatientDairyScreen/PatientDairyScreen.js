import { AppConstants, StorageUtils, convertDate, showMessage, } from "../../../utils";
import { ButtonGroup, Divider, Icon, ListItem } from "react-native-elements";
import { NoDataState, SearchBar } from "../../../components";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View,Text,TouchableOpacity } from "react-native";
import { withNavigationFocus } from 'react-navigation';
import { NavigationHeaderV2 } from '../../../components'
import { api } from "../../../api";
import { theme } from "../../../theme";
import { icons } from "../../../assets";

const SH_USERS = ["Caregiver", "Individual", "Agent"];
const SW_USERS = ["Supervisor", "Staff Member", "Agent"];

export const _PatientDairyScreen = (props) => {
  const { navigation } = props
  const appType = navigation.getParam("appType", "");
  const DIARY_USERS = appType === "1" ? SH_USERS : SW_USERS
  const role = navigation.getParam('role')
  const seniorId = navigation.getParam("seniorId", "");


  let roleValue = 0
  if (appType !== "1") {
    if (role == 'caretaker') { roleValue = 0 }
    else if (role == 'senior') { roleValue = 1 }
    else { roleValue = 2 }
  }

  if (appType == "1") {
    if (role == 'caretaker') { roleValue = 0 }
    else if (role == 'senior') { roleValue = 1 }
    else { roleValue = 2 }
  }

  const [selectedPerson, setSelectedPerson] = useState(roleValue);
  const [loading, setLoading] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    setLoading(true);
    try {
      const res = await fetch(api.patientDiary + "/GetAllNotesDetail", {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res) {
        setLoading(false);
        if (!res.ok) {
          showMessage("Error in getting notes!");
          return;
        }
        const json = await res.json();
        // console.log("json: ", json)
        if (json && json.length > 0) {
          setNotesList(updateList(json));
          setAllNotes(updateList(json));
        }
      }
    } catch (error) {
      setLoading(false);
      showMessage("Error in getting notes!");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [refreshing]);

  const suffix = (day) => {
    if (day > 3 && day < 30) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  const dateFormate =(date) =>{
    const month = date.substr(0, 3);
    const day = date.substr(4, 2);
    const year = date.substr(7, 4);
    return (`${day + suffix(day)}  ${month}, ${year}`);
  }

  const updateList = (list) => {
    const newList = [];
    list.forEach((itm) => {
      const { notes, createdDate, roleId, seniorId, noteId } = itm;
      const { date } = convertDate(createdDate, "full");
      newList.push({
        ...itm,
        date: dateFormate(date),
        // notes,
        // roleId,
        // seniorId,
        // noteId,
      });
    });
    return newList;
  };

  const getFilteredNotes = (notes) => {
    const caregiver = [];
    const indvidual = [];
    const agent = [];
    const filteredNotes = [caregiver, indvidual, agent];

    notes.forEach((e) => {
      if (e.roleId === 1) indvidual.push(e);
      else if (e.roleId === 2) caregiver.push(e);
      else agent.push(e);
    });
    return filteredNotes;
  };

  const searchFilter = (text) => {
    text
      ? setNotesList(
        allNotes.filter(
          (e) => e.notes && (e.notes.includes(text) || e.date.includes(text))
        )
      )
      : setNotesList(allNotes);
  };

  const filteredNotes = getFilteredNotes(notesList);

  const addDiaryNotes = () => {
    const seniorId = props.navigation.getParam("seniorId", "");
    const name = props.navigation.getParam("seniorName", "");
    const profileImage = props.navigation.getParam("seniorProfile", "");
    const role = props.navigation.getParam("role", "");
    props.navigation.navigate("PatientDiaryNoteForm", { name, profileImage, seniorId, role, });
  }

  return (
    <View style={styles.root}>
      <NavigationHeaderV2  
        title={'Patient Diary'}
        allowBack={true}
        buttonRight={{ onPress: addDiaryNotes, text:'Add Note'}}
        // rightComponent= {
        // <TouchableOpacity onPress={ addDiaryNotes} style={{width: 30, height: 30 }}>
        //   <Text style={{color: "white", fontSize: 22}}>＋</Text>
        //   </TouchableOpacity>}
        navigation={props.navigation}

        />

     <View style={{flex:1, backgroundColor: "white"}}>
      <SearchBar searchFilter={searchFilter} />

      <ButtonGroup
        onPress={(person) => setSelectedPerson(person)}
        selectedIndex={selectedPerson}
        buttons={DIARY_USERS}
        containerStyle={{ borderWidth: 0, marginTop: 0 }}
        buttonStyle={{ backgroundColor: "transparent" }}
        textStyle={{
          ...styles.buttonGroupText,
          ...(appType === "2" ? { fontSize: 19 } : {}),
        }}
        selectedButtonStyle={styles.selectedButton}
        selectedTextStyle={styles.selectedButtonText}
        innerBorderStyle={{ color: "white" }}
      />

      <View style={{ margin: 8, flex: 1 }}>

        {loading && <NoDataState text="Loading..." />}

        {!loading && <>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ flex: 1 }}>

            {filteredNotes[selectedPerson].length < 1 && <NoDataState text={`No notes by ${DIARY_USERS[selectedPerson]}`} style={{ height: "100%" }} />}

            {filteredNotes[selectedPerson].length > 0 && <>
              {filteredNotes[selectedPerson].filter(e=>e.seniorId == seniorId).map(
                (itm, key) => {
                  const { date, noteId, seniorId, roleId } = itm;
                  return (<>
                    <ListItem key={key} subtitle={date} chevron
                      title={itm.notes}
                      titleProps={{ numberOfLines: 1 }}
                      onPress={() => {
                        props.navigation.navigate("TaskForm", { id: "some", name: itm.writerName, noteId, seniorId, roleId, });
                        // props.navigation.navigate("TaskForm", { id: "some", name: DIARY_USERS[selectedPerson], noteId, seniorId, roleId, });
                      }}
                      titleStyle={{ fontFamily: theme.fonts.SFProRegular }}
                      subtitleStyle={{ fontFamily: theme.fonts.SFProRegular }}
                    />
                    <Divider />
                  </>);
                }
              )}
            </>}

          </ScrollView>
        </>}

      </View>
      </View>
    </View>
  );
};


const Wrapper = props => {
  return props.isFocused ? <_PatientDairyScreen {...props} /> : null;
}
export const PatientDairyScreen = withNavigationFocus(Wrapper)

PatientDairyScreen.navigationOptions = ({ navigation }) => {
  const seniorId = navigation.getParam("seniorId", "");
  const name = navigation.getParam("seniorName", "");
  const profileImage = navigation.getParam("seniorProfile", "");
  const role = navigation.getParam("role", "");
  return {
    title: "Patient Diary",
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: { fontSize: 18 },
    headerStyle: { backgroundColor: theme.colors.colorPrimary },
    headerRight: () => (
      <Icon color="white" name="add" size={28}
        onPress={() => {
          navigation.navigate("PatientDiaryNoteForm", { name, profileImage, seniorId, role, });
          // onPress={() => { navigation.navigate("TaskForm", { name, profileImage, seniorId, role, });
        }}
      />
    ),
    headerRightContainerStyle: { marginRight: 12 },
  };
};




const styles = StyleSheet.create({
  root: { flex: 1, 
    backgroundColor: theme.colors.colorPrimary,     
    paddingTop: Platform.OS === "ios" ?  35 : 25
  },
  buttonGroupText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.grey_shade_1,
    fontFamily: theme.fonts.SFProSemibold,
    textAlign: "center",
  },
  selectedButton: {
    backgroundColor: "transparent",
  },
  selectedButtonText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProSemibold,
  },
});
