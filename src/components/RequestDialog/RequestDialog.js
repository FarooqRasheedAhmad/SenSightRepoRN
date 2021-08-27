import { AppConstants, StorageUtils, showMessage } from "../../utils";
import { Text, TouchableOpacity, View } from "react-native";

import RNDialog from "react-native-dialog";
import React from "react";
import { api } from "../../api";
import { styles } from "./styles";

export const RequestDialog = (props) => {
  const {
    visible,
    inviteId,
    alertId,
    inviteTitle,
    inviteDescription,
    setState,
  } = props;

  const onAction = async (type) => {
    setState({ loading: true, visible: false });
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
          acknowledgeAlert(token);
          showMessage(`Request ${type === "Accept" ? "accepted" : "rejected"}`);
        }
      } else {
        setState({ loading: false });
        showMessage(
          `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
        );
      }
    } catch (error) {
      setState({ loading: false });
      showMessage(
        `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
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
          setState({ loading: false });
        }
      } else {
        setState({ loading: false });
        showMessage(`Error in acknowledging alert`);
      }
    } catch (error) {
      setState({ loading: false });
      showMessage(`Error in acknowledging alert`);
    }
  };

  if (!visible) {
    return null;
  }
  return (
    <RNDialog.Container visible={visible}>
      <RNDialog.Title>{inviteTitle}</RNDialog.Title>
      <RNDialog.Description>{inviteDescription}</RNDialog.Description>
      <RNDialog.Button
        label={"Reject"}
        onPress={() => onAction("Reject")}
        bold
      />
      <RNDialog.Button
        label={"Approve"}
        onPress={() => onAction("Accept")}
        bold
      />
      <View style={styles.ignoreView}>
        <TouchableOpacity onPress={() => setState({ visible: false })}>
          <Text style={styles.ignoreText}>Ignore</Text>
        </TouchableOpacity>
      </View>
    </RNDialog.Container>
  );
};
