import { AppConstants, StorageUtils } from "../../utils";
import { Image, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AlertHelper } from '../AlertHelper'
import { Dialog } from "../Dialog/Dialog";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { icons } from "../../assets";

const showMessage = (title, color) => {
  setTimeout(
    function () {
      Snackbar.show({
        title,
        duration: Snackbar.LENGTH_SHORT,
        textColor: "white",
        backgroundColor: color,
      });
    }.bind(this),
    50
  );
};

export const AddUser = (props) => {
  const { refetch, type, user } = props;
  const [dialog, setDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);

  let resetEmailValue = () => { };

  useEffect(() => { }, [dialog]);

  const onSave = async (code) => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    setDialog(false);
    try {
      setLoading(true);
      const reqBody = JSON.stringify(
        type === "senior"
          ? {
            seniorEmail: code,
          }
          : {
            caregiverEmail: code,
          }
      );
      const response = await fetch(
        type === "senior" ? api.invitesCaregiver : api.invitesSenior,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: reqBody,
        }
      );
      if (response.ok) {
        resetEmailValue();
        setLoading(false);
        const data = await response.json();
        if (data) {
          AlertHelper.show({description: `${data.message}`,
          cancelBtn: { negativeBtnLable: 'Ok' }})
        }
      } else {
        resetEmailValue();
        setLoading(false);
        const data = await response.json();
        console.log('data add caregiver 1', data)
        if (data) {
          AlertHelper.show({description: `${data.errors[0].description}`,
          cancelBtn: { negativeBtnLable: 'Ok' }})
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("Errrr: ", err)
      AlertHelper.show({description: `Oops! Error in adding ${type === "senior" ? user[0].toLowerCase() : user[1].toLowerCase()}`,
      cancelBtn: { negativeBtnLable: 'Ok' }})
    }
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View
        style={{
          height: type === "senior" ? 75 : 55,
          width: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <TouchableOpacity onPress={() => setDialog(true)}>
            <Image source={icons.add_green} style={{ alignSelf: "center" }} />
          </TouchableOpacity>
        </View>
        <Dialog
          visible={dialog}
          title={`Add ${type === "senior" ? user[0] : user[1]}`}
          description={`Add email of ${type === "senior" ? user[0].toLowerCase() : user[1].toLowerCase()
            }`}
          placeholder="email"
          onCancel={() => setDialog(false)}
          onSave={onSave}
          keyboardType="email-address"
          setValue={(reset) => (resetEmailValue = reset)}
        />
      </View>
    </>
  )
}
