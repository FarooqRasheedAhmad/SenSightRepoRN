import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { NavigationHeader, Info, DropDown } from "../../../components";
import { styles } from "./styles";
import { theme } from "../../../theme";
import { api } from "../../../api";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { AppConstants, StorageUtils, } from "../../../utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from "lodash";
export default class ManuallyReadings extends Component {

  constructor(props) {
    super();
    this.state = {
      heartRate: '',
      hrv: '',
      temperature: '',
      tempUnit: '°C',
      oxygenSaturation: '',
      bloodGlucose: '',
      stepCounts: '',
      sleepHours: '',
      weight: '',
      fall: ' ',
      bpSystolic: '',
      bpDiastolic: '',
      weightUnit: 'Kg',
      spinner: false
    };

  }


  validity = () => {
    const { heartRate, hrv, temperature, oxygenSaturation, bloodGlucose, stepCounts, sleepHours, weight, fall,
      bpSystolic, bpDiastolic, } = this.state;
    this.setState({ spinner: true })
    if (heartRate.trim() != '' || hrv.trim() != '' || temperature.trim() != '' || oxygenSaturation.trim() != '' ||
      bloodGlucose.trim() != '' || stepCounts.trim() != '' || sleepHours.trim() != '' || weight.trim() != '' ||
      fall.trim() != '' || bpSystolic.trim() != '' || bpDiastolic.trim() != '') {
      if (this.zeroValueValidity()) this.saveData()
    } else {
      this.setState({ spinner: false })
      Snackbar.show({ text: "Please enter at least one value", duration: Snackbar.LENGTH_LONG, })
    }
  }

  zeroValueValidity = () => {
    const { heartRate, hrv, temperature, oxygenSaturation, bloodGlucose, stepCounts, sleepHours, weight, fall,
      bpSystolic, bpDiastolic, } = this.state;
    if ((heartRate.trim() == '' || heartRate > 0) && (hrv.trim() == '' || hrv > 0) &&
      (temperature.trim() == '' || temperature > 0) && (oxygenSaturation.trim() == '' || oxygenSaturation > 0) &&
      (bloodGlucose.trim() == '' || bloodGlucose > 0) && (stepCounts.trim() == '' || stepCounts > 0) &&
      (sleepHours.trim() == '' || sleepHours > 0) && (weight.trim() == '' || weight > 0) &&
      (bpSystolic.trim() == '' || bpSystolic > 0) && (bpDiastolic.trim() == '' || bpDiastolic > 0)) {
      return true
    }
    else {
      this.setState({ spinner: false })
      Snackbar.show({ text: "Please enter value greater than 0", duration: Snackbar.LENGTH_LONG, })
      return false
    }
  }


  saveData = async () => {
    const { heartRate, hrv, temperature, oxygenSaturation, bloodGlucose, stepCounts, sleepHours, weight, fall,
      bpSystolic, bpDiastolic, tempUnit, weightUnit } = this.state;
    this.setState({ spinner: true })
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

    let apiPayload = {}

    apiPayload.userId = userId
    apiPayload.deviceTag = "ManualEntry"
    if (temperature != '') apiPayload.bodyTemperature = tempUnit == '°C' ? temperature : _.round(((temperature - 32) / 1.8), 1)
    if (oxygenSaturation != '') apiPayload.oxygenLevel = oxygenSaturation
    if (bloodGlucose != '') apiPayload.bloodSugar = _.round((bloodGlucose / 18),3)
    if (hrv != '') apiPayload.hrv = hrv
    if (heartRate != '') apiPayload.heartRate = heartRate
    if (bpSystolic != '') apiPayload.systolic = bpSystolic
    if (bpDiastolic != '') apiPayload.diastolic = bpDiastolic
    if (stepCounts != '') apiPayload.stepCount = stepCounts
    if (weight != '') apiPayload.weight = weightUnit == 'Kg' ? weight : _.round(weight / 2.205, 1)
    if (weight != '') apiPayload.weightUnit = weightUnit == 'Kg' ? 1 : 2
    if (fall != '1' && fall != ' ') apiPayload.fallAccur = fall
    if (sleepHours != '') apiPayload.TimeInBed = sleepHours * 60
    
    console.log('apiPayload', apiPayload)

    fetch(api.addBMIScale, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      body: JSON.stringify(apiPayload),
    })
      .then((response) => {
        console.log("saveFdaDeviceData > response: ", response)
        if (response.ok) {
          return response.json();
        } else {
          Snackbar.show({ text: "Something went wrong ! Try again", duration: Snackbar.LENGTH_LONG, })
          // AlertHelper.show({ description: `Oops, Something went wrong ! Try again`, cancelBtn: { negativeBtnLable: 'Ok' } })
        }
        this.setState({ spinner: false });
      })
      .then((json) => {
        if (json) {
          Snackbar.show({ text: "Data has been saved successfully", duration: Snackbar.LENGTH_LONG, })
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.log("ERROR 3: ", error);

        this.setState({ spinner: false });
        Snackbar.show({
          text: "Something went wrong ! Try again later",
          duration: Snackbar.LENGTH_LONG,
        })
      })
  }

  setHeartRate = (heartRate) => {
    if (heartRate <= 250) this.setState({ heartRate })
    else Snackbar.show({ text: "Heart Rate max limit is 250", duration: Snackbar.LENGTH_LONG, })
  }

  setHRV = (hrv) => {
    if (hrv <= 300) this.setState({ hrv })
    else Snackbar.show({ text: "HR Variability limit is 300", duration: Snackbar.LENGTH_LONG, })
  }

  setTemperature = (temperature, tempUnit) => {
    const limit = tempUnit == '°C' ? 60 : 140
    if (temperature <= limit) this.setState({ temperature })
    else Snackbar.show({ text: `Body Temperature limit is ${limit} in ${tempUnit}`, duration: Snackbar.LENGTH_LONG, })
  }

  setOxygen = (oxygenSaturation) => {
    if (oxygenSaturation <= 100) this.setState({ oxygenSaturation })
    else Snackbar.show({ text: "Oxygen Saturation limit is 100 in (%)", duration: Snackbar.LENGTH_LONG, })
  }

  setBloodGlucose = (bloodGlucose) => {
    if (bloodGlucose <= 700) this.setState({ bloodGlucose })
    else Snackbar.show({ text: "Blood Glucose limit is 700 in (mg/dL)", duration: Snackbar.LENGTH_LONG, })
  }

  setStepCount = (stepCounts) => {
    if (stepCounts <= 35000) this.setState({ stepCounts })
    else Snackbar.show({ text: "Step counts limit is 35000", duration: Snackbar.LENGTH_LONG, })
  }

  setSleepHours = (sleepHours) => {
    if (sleepHours <= 24) this.setState({ sleepHours })
    else if (sleepHours.indexOf('.') > -1 && sleepHours < 24) this.setState({ sleepHours })
    else Snackbar.show({ text: "Sleep hours limit is 24", duration: Snackbar.LENGTH_LONG, })
  }

  setWeight = (weight, weightUnit) => {
    const limit = weightUnit == 'Kg' ? 400 : 882
    if (weight <= limit) this.setState({ weight })
    else Snackbar.show({ text: `Weight limit is ${limit} in ${weightUnit}`, duration: Snackbar.LENGTH_LONG, })
  }

  setBPsystolic = (bpSystolic) => {
    if (bpSystolic <= 350) this.setState({ bpSystolic })
    else Snackbar.show({ text: "BP Systolic limit is 350 in (mmHg)", duration: Snackbar.LENGTH_LONG, })
  }

  setBPDiasystolic = (bpDiastolic) => {
    if (bpDiastolic <= 350) this.setState({ bpDiastolic })
    else Snackbar.show({ text: "BP DiaSystolic limit is 350 in (mmHg)", duration: Snackbar.LENGTH_LONG, })
  }


  render() {
    const { navigation } = this.props;
    const { heartRate, hrv, temperature, tempUnit, oxygenSaturation, bloodGlucose, stepCounts, sleepHours, weight, weightUnit, fall,
      bpSystolic, bpDiastolic, spinner } = this.state;

    return (
      <View style={styles.container}>
        <NavigationHeader title={'Manual Readings'} leftText={'Back'} navigation={navigation} />

        <View style={styles.subContainer}>
          <Spinner visible={spinner} />

          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>
            <View style={{ padding: 16, marginBottom: 20 }}>
              <Text style={styles.headingText}>Input Fields</Text>
              <Text style={styles.stepHeading}>Enter current value for various measurements.</Text>
              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={theme.strings.heart_rate + ' (BPM)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(heartRate) => { this.setHeartRate(heartRate) }}
                  value={heartRate}
                />
                <Info type="heart_rate" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>
              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={theme.strings.heart_rate + ' Variability (ms)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(hrv) => { this.setHRV(hrv) }}
                  value={hrv}
                />
                <Info type="heart_rate_variation" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>
              <View style={[styles.textInputContainer, { marginTop: 15, }]}>
                <View style={{ flex: 1, justifyContent: 'space-between', marginRight: 16, flexDirection: 'row' }}>
                  <TextInput
                    style={[theme.palette.textInputRoundBg, { width: '75%' }]}
                    keyboardType='numeric'
                    placeholder={theme.strings.temperature}
                    placeholderTextColor={theme.colors.grey_shade_1}
                    onChangeText={(temperature) => { this.setTemperature(temperature, tempUnit) }}
                    value={temperature}
                  />
                  <DropDown
                    style={{ paddingHorizontal: 10, borderRadius: 10, minHeight: 45, backgroundColor: theme.colors.grey_shade_4, }}
                    data={[{ value: '°C', label: '°C' }, { value: 'F', label: 'F' },]}
                    value={tempUnit}
                    onChange={(value, index, item) => { this.setState({ tempUnit: value }) }}
                  />
                </View>
                <Info type="body_temperature" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>
              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Oxygen Saturation (%)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(oxygenSaturation) => { this.setOxygen(oxygenSaturation) }}
                  value={oxygenSaturation}
                />
                <Info type="oxigen_saturation" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>
              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Blood Glucose Level (mg/dL)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(bloodGlucose) => { this.setBloodGlucose(bloodGlucose) }}
                  value={bloodGlucose}
                />
                <Info type="blood_glucose" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>
              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Step Count (steps)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(stepCounts) => { this.setStepCount(stepCounts) }}
                  value={stepCounts}
                />
                <Info type="step_count" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>

              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Sleep (hours)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(sleepHours) => { this.setSleepHours(sleepHours) }}
                  value={sleepHours}
                  maxLength={sleepHours.indexOf('.') > -1 ? 4 : 3}
                />
                <Info type="sleep" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>

              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <View style={{ flex: 1, justifyContent: 'space-between', marginRight: 16, flexDirection: 'row' }}>
                  <TextInput
                    style={[theme.palette.textInputRoundBg, { width: '75%' }]}
                    keyboardType='numeric'
                    placeholder={'Weight'}
                    placeholderTextColor={theme.colors.grey_shade_1}
                    onChangeText={(weight) => { this.setWeight(weight, weightUnit) }}
                    value={weight}
                  />
                  <DropDown
                    style={{ paddingHorizontal: 10, borderRadius: 10, minHeight: 45, backgroundColor: theme.colors.grey_shade_4, }}
                    data={[{ value: 'Kg', label: 'Kg' }, { value: 'Lb', label: 'Lb' },]}
                    value={weightUnit}
                    onChange={(value, index, item) => { this.setState({ weightUnit: value }) }}
                  />
                </View>
                <Info type="weight" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>

              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <DropDown
                  textStyle={{ color: "#000" }}
                  style={{ borderRadius: 10, minHeight: 45, backgroundColor: theme.colors.grey_shade_4, flex: .88, marginRight: 16, paddingRight: 10 }}
                  data={[{ value: ' ', label: 'Have you had a fall?' },{ value: '0', label: 'Yes' }, { value: '1', label: 'No' },]}
                  placeholder={'Fall'}
                  value={fall}
                  onChange={(value, index, item) => { this.setState({ fall: value }) }}
                />
                {/* <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Fall (number of Falls)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(fall) => { this.setState({ fall }) }}
                  value={fall}
                /> */}
                {/* <Info type="fall" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} /> */}

              </View>

              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Blood Pressure - Systolic (mmHg)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(bpSystolic) => { this.setBPsystolic(bpSystolic) }}
                  value={bpSystolic}
                />
                <Info type="systolic_bp" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>

              <View style={[styles.textInputContainer, { marginTop: 15 }]}>
                <TextInput
                  style={[theme.palette.textInputRoundBg, styles.textInputStyle]}
                  keyboardType='numeric'
                  placeholder={'Blood Pressure - Diastolic (mmHg)'}
                  placeholderTextColor={theme.colors.grey_shade_1}
                  onChangeText={(bpDiastolic) => { this.setBPDiasystolic(bpDiastolic) }}
                  value={bpDiastolic}
                />
                <Info type="diasystolic_bp" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

              </View>

              <TouchableOpacity activeOpacity={0.8}
                onPress={() => { this.validity() }}
                style={[theme.palette.nextButton, { width: '100%', alignSelf: 'center', marginVertical: 20, marginTop: 40 }]} >
                <Text style={theme.palette.buttonText}>Save Data</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAwareScrollView>
        </View>

      </View>
    );
  }
}