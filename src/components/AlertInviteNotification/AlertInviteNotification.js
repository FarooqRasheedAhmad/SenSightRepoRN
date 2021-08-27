import { AppConstants, StorageUtils } from "../../utils";
import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { styles } from "./styles";

const showMessage = (title) => {
  Snackbar.show({
    title,
    duration: Snackbar.LENGTH_SHORT,
  });
};

export const AlertInviteNotification = (props) => {
  const { title, description, user, rerenderAlerts, alertId, inviteId, item } = props;
  const [spinner, setSpinner] = useState(false);

  const onAction = async (type) => {
    setSpinner(true);
    try {
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const url = `${api.invites}/${inviteId}/${type}`;

      const response = await fetch(url, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json) {
          showMessage(`Request ${type === "Accept" ? "accepted" : "rejected"}`);
          acknowledgeAlert(token);
        }
      } else {
        setSpinner(false);
        showMessage(
          `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
        );
      }
    } catch (error) {
      setSpinner(false);
      showMessage(
        `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite: ${
          error.message
        }`
      );
    }
  };

  const acknowledgeAlert = async (token) => {
    try {
      const url = `${api.alerts}/${alertId}/Acknowledge`;
      const response = await fetch(url, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json) {
          setSpinner(false);
          rerenderAlerts();
        }
      } else {
        setSpinner(false);
        showMessage(`Error in acknowledging alert`);
      }
    } catch (error) {
      setSpinner(false);
      showMessage(`Error in acknowledging alert`);
    }
  };

  console.log('item ', item)

  return (
    <View style={styles.card}>
      <Spinner visible={spinner} />
      <View style={styles.upperBackground}>
        <View style={styles.row2}>
          <Text style={styles.heading}>{user.name || ""}</Text>
          <Image
            style={{ width: 30, height: 30, borderRadius: 30 }}
            source={{ uri: user.image || "" }}
          />
        </View>
        <Text style={styles.text}>{description}</Text>
      </View>
      <View style={styles.row2}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => onAction("Reject")}>
            <Text style={{ fontSize: 20, color: "#ef3939" }}>Reject</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => onAction("Accept")}>
            <Text style={{ fontSize: 20, color: "#25BEED" }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
