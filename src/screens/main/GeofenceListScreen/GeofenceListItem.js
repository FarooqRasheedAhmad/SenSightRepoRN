import * as React from "react";

import { AppConstants, StorageUtils } from "../../../utils";
import { Icon, ListItem } from "react-native-elements";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";

import { CreateGeofenceModal } from "../../../components";
import RNDialog from "react-native-dialog";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../../api";
import { theme } from "../../../theme";

export const GeofenceListItem = ({
  onChangeActive,
  fetchData,
  disabled,
  ...rest
}) => {
  const { id, title, geofenceLimit, isActive } = rest;
  const [value, setValue] = React.useState(isActive);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [value]);

  const onDelete = async () => {
    setLoading(true);
    setDialog(false);
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    try {
      const response = await fetch(`${api.geofenceNew}/${id}`, {
        method: "delete",
        headers: { Accept: "application/json","Content-Type": "application/json", Authorization: "Bearer " + token, },});
      if (response) {
        const json = await response.json();
        if (response.ok) {
          if (json) {
            if (json.errors) {
              setLoading(false);
            } else {
              setLoading(false);
              fetchData();
            }
          }
        } else {
          setLoading(false);

          Snackbar.show({
            text: "Error in deleting geofence",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Snackbar.show({
        text: "Error in deleting geofence",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return (
    <>
      <Spinner visible={loading} />
      <RNDialog.Container visible={dialog}>
        <RNDialog.Title style={{ color: "#25BEED", fontSize: 22 }}>
          Delete Geofence
        </RNDialog.Title>
        <RNDialog.Description
          style={{ paddingTop: 12, fontSize: 16, flexDirection: "row" }}
        >
          Do you want to delete{" "}
          <Text style={{ fontWeight: "bold" }}>{title}</Text> geofence?
        </RNDialog.Description>
        <RNDialog.Button
          color="#25BEED"
          label={"Cancel"}
          onPress={() => setDialog(false)}
        />
        <RNDialog.Button bold label="Delete" color="red" onPress={onDelete} />
      </RNDialog.Container>

      <ListItem
        key={id}
        title={title}
        subtitle={
          geofenceLimit &&
          `Geofence Limit: ${
            geofenceLimit > 999
              ? geofenceLimit / 1000 + " km"
              : geofenceLimit + " m"
          }`
        }
        subtitleStyle={{ color: "grey" }}
        titleStyle={{ fontSize: 20 }}
        rightElement={
          <CreateGeofenceModal
            type="edit"
            disabled={disabled}
            size={16}
            {...rest}
          />
        }
        bottomDivider
        switch={{
          value: value,
          disabled,

          trackColor: {
            true: !disabled ? theme.colors.colorPrimary : "grey",
            false: "grey",
          },
          onValueChange: (switchValue) => {
            setValue(switchValue), onChangeActive(switchValue, id);
          },
        }}
        onLongPress={!disabled ? () => setDialog(true) : undefined}
        underlayColor="#25BEED"
        style={{
          borderRadius: 12,
          marginHorizontal: 8,
          marginTop: 8,
          elevation: 8,
          height: 90,
        }}
        containerStyle={{
          borderRadius: 12,
          height: 90,
        }}
      />
    </>
  );
};
