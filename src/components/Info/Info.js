import React, { useState } from "react";

import { Icon } from "react-native-elements";
import RNDialog from "react-native-dialog";
import { theme } from "../../theme";

export const Info = (props) => {
  const { type, icon, size, color, ...rest } = props;
  const [visible, setVisible] = useState(false);

  const getTitle = () => {
    switch (type) {
      case "activity-score":
        return "Activity Score";
      case "location":
        return "Location";
      case "heart-rate":
        return "Heart Rate";
      case "step-count":
        return "Step Count";
      case "heart-rate-variation":
        return "HR Variability";
      case "oxigen-saturation":
        return "Oxygen Saturation";
      case "body-temperature":
        return "Body Temperature";
      case "heart-rate-info":
        return "Body Temperature";
      case "heart_rate":
        return "Heart Rate";
      case "heart_rate_variation":
        return "Heart Rate Variability"
      case "body_temperature":
        return "Body Temperature";
      case "oxigen_saturation":
        return "Oxygen Saturation";
      case "blood_glucose":
        return "Blood Glucose";
      case "step_count":
        return "Step Count";
      case "sleep":
        return "Sleep"
      case "weight":
        return "Weight"
      case "fall":
        return "Fall";
      case "systolic_bp":
        return "Systolic Blood Pressure";
      case "diasystolic_bp":
        return "Diastolic Blood Pressure"
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "activity-score":
        return theme.strings.activityScoreInformation;
      case "location":
        return theme.strings.locationInformation;
      case "heart-rate":
        return theme.strings.heartRateInformation;
      case "step-count":
        return theme.strings.stepCountInformation;
      case "heart-rate-variation":
        return "Variation in heart rate through out the month";
      case "oxigen-saturation":
        return theme.strings.oxigen_info_info;
      case "body-temperature":
        return theme.strings.body_temperature_info;
      case "heart-rate-info":
        return theme.strings.pulse_rate_info;
      case "heart_rate":
        return theme.strings.manuallyReadings_info.heartRate;
      case "heart_rate_variation":
        return theme.strings.manuallyReadings_info.heartRateVarability;
      case "body_temperature":
        return theme.strings.manuallyReadings_info.bodyTemp;
      case "oxigen_saturation":
        return theme.strings.manuallyReadings_info.oxygenSaturation;
      case "blood_glucose":
        return theme.strings.manuallyReadings_info.bloodGlucose;
      case "step_count":
        return theme.strings.manuallyReadings_info.stepCount;
      case "sleep":
        return theme.strings.manuallyReadings_info.sleep
      case "weight":
        return theme.strings.manuallyReadings_info.weight
      case "fall":
        return theme.strings.manuallyReadings_info.fall;
      case "systolic_bp":
        return theme.strings.manuallyReadings_info.systolicBP;
      case "diasystolic_bp":
        return theme.strings.manuallyReadings_info.diastolicBP
      default:
        return "";
    }
  };

  return (
    <>
      <RNDialog.Container visible={visible}>
        <RNDialog.Title>{getTitle()}</RNDialog.Title>
        <RNDialog.Description style={{ fontSize: 15, textAlign: 'left' }}>
          {getDescription()}
        </RNDialog.Description>
        <RNDialog.Button label="Close" onPress={() => setVisible(false)} />
      </RNDialog.Container>
      <Icon
        name={icon || "help-circle-outline"}
        type="material-community"
        size={size || 30}
        color={color || theme.colors.colorPrimary}
        onPress={() => setVisible(true)}
        {...rest}
      />
    </>
  );
};
