import { AppConstants, StorageUtils } from "../../utils";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import RNDialog from "react-native-dialog";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";

const showMessage = (title, color) => {
  Snackbar.show({
    title,
    duration: Snackbar.LENGTH_SHORT,
    textColor: "white",
    backgroundColor: color,
  });
};

export const InviteDialog = (props) => {
  const [visible, setVisible] = useState(props.visible || false);
  const [spinner, setSpinner] = useState(false);
  const { title, description, inviteId } = props;

  const onAction = async (type) => {
    setVisible(false);
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
          setSpinner(false);
          showMessage(`Request ${type === "Accept" ? "accepted" : "rejected"}`);
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
        `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
      );
    }
  };

  const onIgnore = async () => {
    setVisible(false);
    // try {
    //   setSpinner(true);
    //   const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    //   const url = `${api.alerts}/${props.id}/Acknowledge`;

    //   const response = await fetch(url, {
    //     method: "put",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token
    //     }
    //   });

    //   if (response.ok) {
    //     const json = await response.json();
    //     if (json) setSpinner(false);
    //   } else {
    //     setSpinner(false);
    //     showMessage("Error in acknowledging alert");
    //   }
    // } catch (error) {
    //   setSpinner(false);
    //   showMessage("Error in acknowledging alert");
    // }
  };

  return (
    <>
      <Spinner visible={spinner} />
      <RNDialog.Container visible={visible}>
        <RNDialog.Title>{title}</RNDialog.Title>
        <RNDialog.Description>{description}</RNDialog.Description>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <TouchableOpacity onPress={onIgnore}>
            <Text
              style={{
                color: Platform.OS === "ios" ? "#007ff9" : "#169689",
                fontSize: 18,
              }}
            >
              Ignore
            </Text>
          </TouchableOpacity>
        </View>
      </RNDialog.Container>
    </>
  );
};
