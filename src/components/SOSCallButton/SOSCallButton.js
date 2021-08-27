import React, { useEffect, useRef } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import ActionSheet from "react-native-actionsheet";
import { Icon } from "react-native-elements";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { api } from "../../api";
import { showMessage } from "../../utils";
import { styles } from "./styles";
import { theme } from "../../theme";
import { useFetch } from "../../hooks";
import { icons } from "../../assets";

export const SOSCallButton = (props) => {
  const { data, loading, error, fetchData } = useFetch(api.caregivers);

  let actionSheet = useRef();
  const options = [];
  let name = "";
  let phone = "";

  useEffect(() => {
    props.refreshSOS(() => {
      fetchData();
    });
  }, []);

  const makeCall = (phone) => () => {
    if (phone) {
      RNImmediatePhoneCall.immediatePhoneCall(phone);
    } else {
      showMessage("No phone number found", "short");
    }
  };

  const showActionSheet = () => {
    if (actionSheet && actionSheet.current) {
      actionSheet.current.show();
    }
  };
  if (error) {
    showMessage("Error in getting phone number", "short");
    return <View />;
  }

  /* if (data && data.length === 0) {
    showMessage("No cargiver found", "short");
    return <View />;
  } */

  if (data) {
    data.forEach((item, index) => {
      if (item.priority === 1) {
        name = item.firstName;
        phone = item.phone;
        options.push(`${item.phone} (${item.firstName} - Primary)`);
      } else {
        options.push(`${item.phone} (${item.firstName})`);
        if (index === options.length - 1 && !name && !phone) {
          name = data[0].firstName;
          phone = data[0].phone;
        }
      }
    });
  }

  return (
    <View style={{ flexDirection: "row" }}>
        <View style={styles.container} pointerEvents="box-none" >
          <TouchableOpacity style={styles.button} onPress={showActionSheet} >
            <Image source={icons.call_blue} style={{ tintColor: 'white', width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      <ActionSheet
        ref={actionSheet}
        title={data && data.length === 0 ? "No caregiver found" : "Whom do you want to call?"}
        options={[...options, "Cancel"]}
        cancelButtonIndex={options.length}
        tintColor={theme.colors.colorPrimary}
        onPress={(index) => {
          if (index < options.length) {
            makeCall(options[index].split(" ")[0])();
          }
        }}
      />
    </View>
  );
};

