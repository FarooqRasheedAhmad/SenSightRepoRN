import {
    AppConstants,
    StorageUtils,
    convertDate,
    showMessage,
} from "../../../utils";
import { Avatar, Button } from "react-native-elements";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import { NavigationHeaderV2, NoDataState } from "../../../components";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";

export const PatientDiaryNoteForm = (props) => {
    const noteId = props.navigation.getParam("noteId", null);
    const seniorId = props.navigation.getParam("seniorId", null);
    const name = props.navigation.getParam("name", null);

    const [notes, setNotes] = useState("");
    const [loadingSave, setLoadingSave] = useState(false);

    const { data, loading, error } = useFetch(
        api.patientDiary + "/NotesDetail/" + noteId
    );
    useEffect(() => { }, []);

    const onSave = async () => {
        setLoadingSave(true);
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

        fetch(api.patientDiary + "/NotesDetail", {
            method: "post",
            headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
            body: JSON.stringify({ notes, seniorId: +seniorId, }),
        })
            .then((response) => {
                if (!response.ok) {
                    setLoadingSave(false);
                    showMessage("Error in adding notes");
                }
                return response.json();
            })
            .then((data) => {
                setLoadingSave(false);
                data.notes && props.navigation.goBack();
            })
            .catch((error) => {
                setLoadingSave(false);
                showMessage("Error in adding notes");
            });
    };

    const getDescriptionElement = (key, value) => (
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={styles.elementLeft}>{key}</Text>
            <Text style={styles.elementRight}>{value}</Text>
        </View>
    );

    if (noteId && error) return <NoDataState text={"Error: " + error} />;
    if (noteId && loading) return <NoDataState text="Loading..." />;

    const { day, month, time } = convertDate(data && data.createdDate, "full");

    return (
        <View style={styles.root}>
            <NavigationHeaderV2  
                    title={'Patient Diary'}
                    allowBack={true}
                    
                    navigation={props.navigation}
            />
            {noteId ? (
                <View style={{flex:1, backgroundColor: "white"}}>
                    <View style={{ margin: 16 }}>
                        <Text style={styles.notes}>{data ? data.notes : ""}</Text>
                    </View>
                    <View style={{ margin: 16 }}>
                        {getDescriptionElement("Author:", name)}
                        {getDescriptionElement("Date:", `${day} ${month}`)}
                        {getDescriptionElement("Time:", time)}
                    </View>
                </View>
            ) : (
                <View style={{flex:1, backgroundColor: "white"}}>
                        <View style={styles.inputView}>
                            <TextInput
                                value={notes}
                                autoFocus
                                multiline
                                placeholder="Add notes here"
                                placeholderTextColor="grey"
                                style={styles.input}
                                onChangeText={(text) => setNotes(text)}
                            />
                        </View>
                        <View style={styles.buttonView}>
                            <Button
                                title="Save"
                                titleStyle={{ fontWeight: "600" }}
                                raised
                                buttonStyle={{ backgroundColor: theme.colors.colorPrimary, borderRadius: 8, }}
                                containerStyle={{ width: 120, marginHorizontal: 16 }}
                                loading={loadingSave}
                                disabled={loadingSave}
                                onPress={onSave}
                                loadingProps={{ color: theme.colors.colorPrimary }}
                            />
                        </View>
                    </View>
                )}
        </View>
    );
};

PatientDiaryNoteForm.navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("name", "Add Notes");
    const profileImage = navigation.getParam("profileImage", "");
    const placeholderTitle = title ? title.split(" ") : ["", ""];

    return {
        title: title || "Add Notes",
        headerBackTitle: "",
        headerTintColor: "white",
        headerTitleStyle: { fontSize: 22 },
        headerStyle: { backgroundColor: theme.colors.colorPrimary },
        headerRight: () => (
            <Avatar
                source={profileImage}
                rounded
                title={
                    placeholderTitle[0].charAt(0) + (placeholderTitle[1] || "").charAt(0)
                }
                titleStyle={{ color: theme.colors.colorPrimary }}
                overlayContainerStyle={{ backgroundColor: "white" }}
            />
        ),
        headerRightContainerStyle: { marginRight: 16 },
    };
};

const styles = StyleSheet.create({
    root: { flex: 1, 
        backgroundColor: theme.colors.colorPrimary,     
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
    input: {
        height: Dimensions.get("window").height / 4,
        justifyContent: "flex-start",
        fontSize: 16,
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
