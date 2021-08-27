import { AppConstants, StorageUtils, getAppUsers } from "../../utils";
import {
  Avatar,
  Button,
  Divider,
  Icon,
  Overlay,
  withBadge,
} from "react-native-elements";
import { ListItem } from '../elements'
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ConfirmationDialog } from "../ConfirmationDialog";
import Snackbar from "react-native-snackbar";
import { api } from "../../api";
import { styles } from './styles'

export const SeniorDetail = ({ individual, fetchSenior, onPress }) => {
  const {
    seniorId,
    profileImage,
    isOnline,
    firstName,
    lastName,
    email,
    phone,
    profileDescription,
    address,
  } = individual;

  const [overlay, setOverlay] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(["", ""]);

  useEffect(() => {
    getAppUsers((u) => {
      setUser(u);
    });
  }, []);

  const showError = (title) => {
    setTimeout(
      function() {
        Snackbar.show({
          title,
          duration: Snackbar.LENGTH_LONG,
        });
      }.bind(this),
      100
    );
  };

  const removePatient = async () => {
    setDialog(false);
    setLoading(true);
    const url = api.deletePatient + seniorId;
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    fetch(url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setLoading(false);
          showError("Error");
          return;
        }
        return response.json();
      })
      .catch((error) => {
        setLoading(false);
        showError("Error");
      })
      .then((data) => {
        setLoading(false);
        setOverlay(false);
        fetchSenior();
      });
  };

  const BadgedAvatar = withBadge(isOnline, {
    status: isOnline ? "success" : "error",
    value: "",
    badgeStyle: { top: isOnline ? 3 : 0, right: isOnline ? 15 : 0 },
  })(Avatar);

  return (
    <View style={{ maxWidth: 100 }}>
      <View style={{ marginHorizontal: 12 }}>
        <BadgedAvatar title={firstName.charAt(0) + lastName.charAt(0)} rounded size={60} onPress={onPress} onLongPress={() => setOverlay(true)} activeOpacity={0.7}
          source={{ uri: profileImage ? profileImage
              : "https://www.uni-hildesheim.de/sustainability/wp-content/uploads/2018/05/platzhalter-bild.png",
          }}
        />
      </View>
      <Text numberOfLines={1} style={styles.nameTextStyle}>{firstName}</Text>

      <Overlay isVisible={overlay==true} borderRadius={35}><>
        <Icon name="close" onPress={() => setOverlay(false)} size={30} containerStyle={{ flexDirection: "row", justifyContent: "flex-end", }}/>
        <ScrollView>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Avatar title={firstName.charAt(0) + lastName.charAt(0)} rounded size={200}
              source={{ uri: profileImage ? profileImage : "https://www.uni-hildesheim.de/sustainability/wp-content/uploads/2018/05/platzhalter-bild.png", }}
            />
            <ListItem
              title={firstName + " " + lastName}
              titleStyle={{ fontSize: 24, fontWeight: "500", color: "#018786" }}
              containerStyle={{ width: "100%" }}
              rightTitle={isOnline ? "active" : "not active"}
              // leftIcon={{ name: "person" }}
            />
            <Text style={{ marginBottom: 8, fontSize: 15, color: "grey", marginHorizontal: 16, width: "90%", }}>{profileDescription}</Text>
            <ListItem
              topDivider
              title={email}
              containerStyle={{ width: "100%" }}
              leftIcon={{ name: "email", color: "#018786" }}
              bottomDivider
            />
            <ListItem
              title={phone}
              containerStyle={{ width: "100%" }}
              leftIcon={{ name: "phone", color: "#018786" }}
              bottomDivider
            />
            <ListItem
              title={address}
              containerStyle={{ width: "100%" }}
              leftIcon={{ name: "home", color: "#018786" }}
              bottomDivider
            />
            <View style={{ margin: 16, width: "90%" }}>
              <Text style={{ color: "grey", fontSize: 16, fontWeight: "600", alignSelf: "flex-start", }}>INFO</Text>
              <View style={{ flexDirection: "row", alignSelf: "center", padding: 4, }}>
                {/* <Text style={{ color: "grey", marginRight: 16, fontSize: 15, fontWeight: "bold", }}>AGE:</Text>
                <Text style={{ marginLeft: 16, fontSize: 15 }}>55</Text> */}
              </View>
            </View>
            <Divider style={{ width: "100%" }} />
            <Button title="Remove" type="outline" icon={{ name: "delete", color: "#E53935" }} raised
              onPress={() => setDialog(true)} titleStyle={{ color: "#E53935" }}
              buttonStyle={{ borderColor: "#E53935", borderRadius: 50, borderWidth: 2, }}
              containerStyle={{ width: 180, marginTop: 16 }}
              loading={loading}
            />

            <ConfirmationDialog
              visible={dialog} title={`Remove ${user[0]}`}
              description={`Are you sure you want to remove this ${user[0].toLowerCase()}?`}
              onCancel={() => setDialog(false)} onSave={removePatient}
            />
          </View>
        </ScrollView>
      </></Overlay>
    </View>
  );
};
