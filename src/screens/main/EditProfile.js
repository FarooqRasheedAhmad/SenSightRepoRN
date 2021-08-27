import { AgentInputDetails, CustomSwitch, JobShiftTime, Row, Col, DropDown, HeaderButton, DateField, TimeField, NavigationHeader, NavigationHeaderV2 } from "../../components";
import { AppConstants, StorageUtils, getAppUsers, cmToFeet, feetToCm } from "../../utils";
import { Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,Modal  } from "react-native";
import moment from "moment";
import _ from 'lodash'
import { canadaStates, usStates, otherState } from "../../utils/constants";
import RNPickerSelect from "react-native-picker-select"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { Component } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api, GET_BRANCHES_AND_AGENTS } from "../../api";
import { sendRequest } from "../../apicall";
import { icons, images } from "../../assets";
import { theme } from "../../theme";
import { Divider } from "react-native-elements";
import { unitList } from '../../configs/general'
import ProfileUpdated from '../../utils/updater'
import { fieldsString } from '../../utils/vars'
// import { getLocalProfile } from '../../utils/fetcher'
import { countryArray, heightFeetsArray, heightInchesArray, genderArray, careHomeOfficeAray } from '../../configs'
import {HiddenInfoButton} from '../../components';


/********* **********
 * *******
 * **********
 * 
 * 
 * WARNING: 
 * do not get loval stored profile, as this value might be comming with nav in case caregiver edit's the account of a patient
 * 
 * 
 * 
 *****************************************/

export class EditProfile extends Component {
  state = {
    fatalError: null,

    date: "",
    firstName: "",
    lastName: "",
    phone: "",
    profileDescription: "",
    address: "",
    image: { uri: "", name: "image", type: "", },
    weightUnitSelected: 1,
    heightUnitSelected: 1,
    spinner: false,
    source: null,
    // role: "",
    appType: "",
    height: '',
    weight: '',
    validationMsg: '',
    state: '',
    isDatePickerVisible: false,
    dateOfBirth: null,
    heightInch: 0,
    heightInch: 0,
    heightInFeet: null,
    heightInInches: null,
    selectedTempUnit: 1,
    gender: 'Male',
    patientId: '', medicareNumber: '', medicaidNumber: '',modalVisible: false,
    // compnayList: [],
    // branchId:null,
    // agentId:null,
  }
  constructor(props) {
    super(props);
    const { getParam } = this.props.navigation;

    this.role = getParam("role");
    this.noBack = getParam("noBack");

    // Only for UK CareHomes
    // this.jobTitle = getParam("jobTitle", "");
    this.shiftStartTime = getParam("shiftStartTime", "");
    this.shiftEndTime = getParam("shiftEndTime", "");

    // this.agentEmail = getParam("agentEmail", null);
    // this.careHomeLocation = getParam("careHomeLocation", 1);
  }

  componentDidMount() {
    const { getParam } = this.props.navigation;
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }

    StorageUtils.getValue('user_modules').then(r => this.setState({ user_modules: r }));

    this.getData();
    // getAppUsers((user, type) => {
    //   this.setState({ appType: type });
    // })

    StorageUtils.getValue(AppConstants.SP.DEFAULT_TEMP_UNIT).then(
      (value) => {
        this.setState({ selectedTempUnit: value == 'F' ? 2 : 1 });
      }
    );

    StorageUtils.getValue('getPackageModuleResponse').then(getPackageModuleResponse => {
      if (getPackageModuleResponse) {
        console.log("getPackageModuleResponse:", JSON.parse(getPackageModuleResponse));
        this.setState({ getPackageModuleResponse: JSON.parse(getPackageModuleResponse) })
      }
    })
    StorageUtils.getValue('userExpiryDate').then(userExpiryDate => {
      if (userExpiryDate) {
        this.setState({ userExpiryDate })
      }
    })


    // sendRequest({ uri: GET_BRANCHES_AND_AGENTS(companyId), method: 'get', }).then(r => {
    //   if (!r || !_.isArray(r) || r.error) {
    //     console.log("ERROR: ", r);
    //     Snackbar.show({ text: r.error, duration: Snackbar.LENGTH_LONG, });
    //     return;
    //   }
    //   if (r) this.setState({ compnayList:r });
    // }).catch(err => {
    //   console.log("ERROR: ", err);
    // })




  }

  getData = async () => {
    const { getParam } = this.props.navigation;
    console.log("getData()");

    // console.log("getPackageModuleResponse: ", getParam('getPackageModuleResponse'))
    
    // const localProfile = await getLocalProfile();
    let fieldsArray = String(`${fieldsString},userId,user_id`).split(",");

    const newState = { role: getParam('role') };
    for (let a in fieldsArray){
      Object.assign(newState, { [fieldsArray[a]]: getParam(fieldsArray[a]) })
    }

    if (!newState.email && newState.email.length<4){
      Snackbar.show({ text: "Invalid User Provided!!!", duration: Snackbar.LENGTH_LONG, });
      this.setState({ fatalError:"Invalid User Provided!!!"});
      return;
    }

    let weightUnit = unitList.weight.find(o => o['value'] == (newState.weightUnit || 1));
    let weight = newState.weight != undefined? newState.weight: 0;
    if (weightUnit.value > 1) weight = weightUnit.formula(weight, weightUnit.name);
    if (!weightUnit) weightUnit = unitList.weight.find(o => o['value'] == 1)

    // if (weightUnit.value==2) weight = weightUnit.formula(weight)
    
    
    // unitList.weight.find(o => o['value'] == 1).formula(weight, weightUnitSelected.name)
    // this.state.weightUnitSelected

    let heightUnit = unitList.height.find(o => o['value'] == (newState.heightUnit || 1));
    if (!heightUnit) heightUnit = unitList.height.find(o => o['value'] == 1)

    Object.assign(newState, {
      weight,
      weightUnitSelected: weightUnit,
      weightUnit: newState.weightUnit || 1,
      heightUnit: newState.heightUnit || 1,
      heightUnitSelected: heightUnit,
      image: { uri: getParam("imagePath", "") },
    })

    await getAppUsers((user, type) => {
      Object.assign(newState, { appType: type })
    })

    if (newState.companyId && this.role == "caretaker") {
      await sendRequest({ uri: GET_BRANCHES_AND_AGENTS(newState.companyId, newState.appType), method: 'get', }).then(r => {
        if (!r || r.error) {
          console.log("ERROR: ", r);
          Snackbar.show({ text: r.error, duration: Snackbar.LENGTH_LONG, });
          return;
        }

        Object.assign(newState, { agents: r.agents, branches: r.branches })

      }).catch(err => {
        console.log("ERROR: ", err);
        return;
      })
    }

    this.setState(newState)
    this.setState({dateOfBirth: this.state.dateOfBirth.split(" ")[0]})

  }

  setWeightDimensions = (index) => {
    const { getParam } = this.props.navigation;
    // console.log(`setWeightDimensions()${index}`);

    let new_weightUnit = unitList.weight[index];
    if (!new_weightUnit){
      alert("Unable to fund weight unit!");
      return;
    }

    // let nw_weight = new_weightUnit.formula(getParam("weight", ""));
    // this.setState({ weightUnitSelected: new_weightUnit, weight: nw_weight });

    let weight = this.state.weight
    let currentUnit = this.state.weightUnitSelected;

    if (currentUnit.name == 'kg' && new_weightUnit.name=='lbs'){ // from kg to lbs
      weight = new_weightUnit.formula(weight);
    }
    if (currentUnit.name == 'lbs' && new_weightUnit.name == 'kg') { // from lbs to kg
      weight = new_weightUnit.formula(weight, currentUnit.name);
    }

    this.setState({ weightUnitSelected: new_weightUnit, weight });
    
    StorageUtils.storeInStorage(AppConstants.SP.DEFAULT_WEIGHT_UNIT, new_weightUnit.name);
    
    return;


    // const { weight, weightUnitSelected } = this.state
    // if (index !== weightUnitSelected) {
    //   let weightVal = ''
    //   if (weight == '') {
    //     weightVal = ''
    //   }
    //   else {
    //     weightVal = index == 1 ? weight * 2.2046 : weight * 0.45359237
    //     weightVal = weightVal.toFixed(2).toString()
    //   }

    //   this.setState({ weightUnitSelected: index, weight: weightVal })
    //   StorageUtils.storeInStorage(AppConstants.SP.DEFAULT_WEIGHT_UNIT, index == 0 ? "kg" : "lbs")
    // }
  }

  setHeightDimensions = (index) => {
    this.setState({ heightUnitSelected: index })
  }

  getFormObject = () => {

    const { firstName, lastName, image, phone, address, gender, country, height,
      jobTitle, shiftStartTime, shiftEndTime, profileDescription,
      appType, weight, state, weightUnitSelected, dateOfBirth, heightInFeet, heightInInches, heightUnitSelected, patientId, medicareNumber, medicaidNumber } = this.state

    const formData = {
      firstName,
      lastName,
      phone,
      address,
      gender,
      country,
      state,
      heightInFeet,
      heightInInches,
      height, // // heightUnitSelected === 1 ? height : 0)
      weight,
      // weight: unitList.weight.find(o => o['value'] == 1).formula(weight, weightUnitSelected.name), // set the value back to default unit
      dateOfBirth: (!dateOfBirth || (_.isString(dateOfBirth) && dateOfBirth.indexOf("0001")>-1)) ? null : moment(dateOfBirth).format("MM/DD/YYYY HH:mm:ss"),
      jobTitle: jobTitle || " ",
      shiftStartTime,
      shiftEndTime,
      profileDescription,
      patientId, medicareNumber, medicaidNumber,
    };

    // convert value into KG if in lbs selected
    const kgFormula = unitList.weight.find(o => o['value'] == 1).formula
    Object.assign(formData, { weight: kgFormula(this.state.weight, this.state.weightUnitSelected.name) })
    // if (this.state.weightUnitSelected.value == 2){
    //   const kgFormula = unitList.weight.find(o => o['value'] == 1).formula
    //   Object.assign(formData, { weight: kgFormula(this.state.weight, this.state.weightUnitSelected.name) })
    // }

    // height in Feet & Inches available, calculate height in CM
    if (heightUnitSelected && heightUnitSelected.value === 2 && (heightInFeet>0 || heightInInches>0)){
      let _height = feetToCm(heightInFeet, heightInInches);
      Object.assign(formData, {height: _height});
    }

    // height available in CM, calculate in Feet & Inches
    if (heightUnitSelected && heightUnitSelected.value == 1 && height>0){
      let _height = cmToFeet(height);
      Object.assign(formData, { heightInFeet: _height.feet, heightInInches: _height.inches });
    }




    if (this.role == "caretaker"){
      console.log("==============", this.state.agentEmail);
      Object.assign(formData, { 
        // agentEmail: this.state.agentEmail, 
        // careHomeOffice: this.state.careHomeOffice,
        agentId: this.state.agentId,
        branchId: this.state.branchId,
      })
    }

    const prevImage = this.props.navigation.getParam("imagePath", "");
    if (image && image.uri && prevImage !== image.uri) {
      Object.assign(formData, {
        ProfileImagePath: image.uri,
        ProfileImage: image
      })
    }

    return formData;
  }

  isValidInput = () => {
    const { firstName, lastName, address, phone, image, country, state, heightUnitSelected, height } = this.state

    const fields = this.getFormObject();
    console.log('====================================');
    console.log("fields: ");
    console.log(JSON.stringify(fields, 0, 2));
    console.log('====================================');

     // Remove special charcter check from first name and last name
    if (!fields.firstName || fields.firstName.length < 1) {
      Snackbar.show({ text: "First name is invalid or empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "First name is invalid or empty" })
      return false;
    }

    if (!fields.lastName || fields.lastName.length < 1) {
      Snackbar.show({ text: "Surname is invalid or empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Surname is invalid or empty" })
      return false;
    }

    if (!fields.phone || !/^[0-9+\+\(\)\-\s]+$/.test(fields.phone) || fields.phone.length < 8) {
      Snackbar.show({ text: "Phone is invalid or empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Phone is invalid or empty" })
      return false;
    }

    if (!fields.address || fields.address.length < 1) {
      Snackbar.show({ text: "Address is empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Address is empty" })
      return false;
    }

    if (!fields.dateOfBirth || fields.dateOfBirth.length < 5 || fields.dateOfBirth.indexOf('0001')>-1) {
      Snackbar.show({ text: "Missing date of birth", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Missing date of birth" })
      return false;
    }

    if (!fields.country || fields.country == 'Country' || fields.country.length < 1) {
      Snackbar.show({ text: "Country is empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Please choose country" })
      return false;
    }

    if (!fields.state || fields.state == 'Province/State' || fields.state.length < 1) {
      Snackbar.show({ text: "Province/State is empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Please choose Province/State" })
      return false;
    }

    if (!fields.gender || fields.gender.length < 1) {
      Snackbar.show({ text: "Gender is empty", duration: Snackbar.LENGTH_SHORT, })
      this.setState({ validationMsg: "Please choose Gender" })
      return false;
    }

    // if (heightUnitSelected === 1 && (fields.height == 0 || fields.height == '')) {
    //   Snackbar.show({ text: "Please enter height", duration: Snackbar.LENGTH_SHORT, })
    //   this.setState({ validationMsg: "Please enter height" })
    //   return false;
    // }



    // ****************** User Level Checks ****************** //
    if (this.role =="senior"){}

    if (this.role =="individual"){}

    if (this.role =="agend"){}

    if (this.role =="caretaker")
    {
      // var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      // if (!fields.agentEmail || !mailformat.test(fields.agentEmail) || fields.agentEmail.length < 1) {
      //   Snackbar.show({ text: `${this.state.appType === 1 ? 'Agent' : 'Manager' } Email is invalid or empty`, duration: Snackbar.LENGTH_SHORT, })
      //   this.setState({ validationMsg: `${this.state.appType === 1 ? 'Agent' : 'Manager' } Email is invalid or empty` })
      //   return false;
      // }

      // if (!fields.careHomeOffice || fields.careHomeOffice.length < 1) {
      //   Snackbar.show({ text: "Missing Care Home Office", duration: Snackbar.LENGTH_SHORT, })
      //   this.setState({ validationMsg: "Please select Care Home Office" })
      //   return false;
      // }

      if (!fields.agentId) {
        Snackbar.show({ text: "Please select agent", duration: Snackbar.LENGTH_SHORT, })
        this.setState({ validationMsg: "Please select agent" })
        return false;
      }

      if (!fields.branchId) {
        Snackbar.show({ text: "Please select branch", duration: Snackbar.LENGTH_SHORT, })
        this.setState({ validationMsg: "Please select branch" })
        return false;
      }

    }

    // console.log("fields: ", fields); return false;

    this.setState({ validationMsg: "" })
    return true;
  }

   uploadPhoto = (selectOption) => {
    
    const ImagePicker = selectOption === 'camera'? launchCamera: launchImageLibrary
    const options = {
      title: "Select Image",
      allowsEditing: true,
      maxWidth: 450,
      maxHeight: 450,
      storageOptions: { 
        skipBackup: true, 
        // path: 'images', 
      },
    }

    ImagePicker(options, (response) => {
      this.setState({  modalVisible: false,})
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        this.setState({
          image: {
            uri: response.uri,
            type: response.type,
            name: response.fileName || "profile.jpg",
          }
        })
      }
    })
  }

  getToken = async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    if (token) {
      return token;
    }
    return;
  }

  goBackToProfileScreen = () => {
    const { navigation } = this.props
    const { getParam } = navigation
    const callBackToProfileScreen = getParam("onRefreshCallBack")
    if (callBackToProfileScreen) {
      callBackToProfileScreen();  
      //navigation.navigate("ProfileScreenTab")  
      navigation.navigate("HomeScreen",{selectedTab: 4})
    }
    else // if we are coming from OTP screen then
    {
      navigation.navigate("HomeScreen")
    }
  }

  updateProfile = async () => {
    if (this.isValidInput()) {
      this.setState({ spinner: true })

      const reqBody = this.getFormObject()
      // console.log("Sending: ", reqBody)
      // return;

      // await ProfileUpdated.updateProfile({ input: reqBody, updateLocal:true}).then(r => {
      await ProfileUpdated.updateProfile({ input: reqBody, updateLocal:true}).then(r => {
        this.setState({ spinner: false });

        if(!r || r.error){
          console.log("ERROR: ", r);
          Snackbar.show({ text: r.error, duration: Snackbar.LENGTH_LONG, });
          return;
        }

        this.goBackToProfileScreen();

      }).catch((error) => {
          console.log("error: ", error);
          this.setState({ spinner: false });
          Snackbar.show({ text: `${error}`, duration: Snackbar.LENGTH_LONG, });
      })

    }
  }

  selectCountry = (country) => {
    if (country === 'Canada')  this.setState({state: canadaStates[0].value, country: country, validationMsg: ''})
    else if (country === 'USA' || country === 'United States') this.setState({state: usStates[0].value, country: country, validationMsg: ''})
    else if(country === 'Other')  this.setState({state: otherState[0].value, country: country, validationMsg: ''})
  }

  cancelButtonPress = () => {
    const { firstName, lastName } = this.state
    const { navigation } = this.props
    navigation.navigate("HomeScreen")
  }

  toFeet = (n) => {
    var realFeet = ((n * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return { feet: feet.toString(), inches: inches.toString() }
  }

  modalView = () => {
        return (
          <Modal
            visible={this.state.modalVisible}
            transparent={true}
          >
            <View style={styles.modalView}>
              <View style={{width: '90%',backgroundColor: 'white',padding: 22,}} >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Select Image </Text>
                <TouchableOpacity onPress={()=>this.uploadPhoto('camera')}>
                  <Text style={styles.photoText}>Take Photo... </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.uploadPhoto('gallery')}>
                  <Text style={styles.photoText}>Choose from Library... </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '40%',alignSelf: 'flex-end',}} onPress={()=>this.setState({modalVisible: false})}>
                  <Text style={{ fontWeight: 'normal', fontSize: 15, marginTop: 15, textAlign: 'right',}}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
         </Modal>
        )
      }
    

  render() {
    // console.log("this.state: ", this.state);
    if (this.state.fatalError) return <Text style={{ padding: 50, color: "#F00", textAlign: "center" }}>{this.state.fatalError}</Text>

    const { spinner, firstName, lastName, image, profileDescription, phone, address, appType, validationMsg, heightInFeet, heightInInches,
      heightUnitSelected, height, weightUnitSelected, country, state, isDatePickerVisible, dateOfBirth, gender,
      user_modules
    } = this.state;

    const weightPlaceHolder = `Weight in ${this.state.weightUnitSelected.name}`
    let statesArrayItems = []
    
    if (country === 'Canada') statesArrayItems = canadaStates
    else if (country === 'USA' || country === 'United States') statesArrayItems = usStates
    else if(country === 'Other') statesArrayItems = otherState

    // unitList.weight.find(o => o['value'] == 1).formula(weight, weightUnitSelected.name)
    // this.state.weightUnitSelected

    let age18 = moment().subtract(18, 'years');
    
     return (
      <View style={styles.root}>
        <Spinner visible={spinner} />
        {this.modalView()}
        {/* <NavigationHeader title='Personal Profile' leftText={'Cancel'} navigation={this.props.navigation} /> */}
        <NavigationHeaderV2 //allowBack backText={'Cancel'} 
          title='Personal Profile' 
          buttonLeft={{ onPress: this.cancelButtonPress, text:'Cancel'}}
          buttonRight={{ onPress: this.updateProfile, text:'Done'}}
        navigation={this.props.navigation} />

        {validationMsg.length ? <Text style={styles.validationMsg}>{validationMsg}</Text> : null}

        <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>
            <View style={styles.container}>

              <View style={{ flexDirection: "row", paddingTop: 20, paddingLeft: 20, }}>
                <View>
                <TouchableOpacity onPress={()=>this.setState({modalVisible: true})} style={{ alignItems: "center" }}>
                    <Image style={{ width: 86, height: 86, borderRadius: 43 }} source={image && image.uri ? { uri: image.uri } : images.placeholder_user} />
                    <Text style={[styles.subText, { color: theme.colors.colorPrimary },]}>edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput value={firstName} style={{ ...styles.inputField, marginTop: 0 }}
                    placeholder="First Name *" placeholderTextColor="rgba(0,0,0,0.2)"
                    onChangeText={(text) => { this.setState({ firstName: text, validationMsg: '' }); }}
                  />
                  <TextInput value={lastName} style={{ ...styles.inputField, marginTop: 16 }}
                    placeholder="Surname *" placeholderTextColor="rgba(0,0,0,0.2)"
                    onChangeText={(text) => { this.setState({ lastName: text, validationMsg: '' }); }}
                  />
                </View>
              </View>


              <View style={{marginLeft:5, marginTop:10}}>

                <TextInput value={phone} placeholder="Phone Number *"
                  style={[styles.inputField, styles.text, { marginTop: 8, borderBottomWidth: 0 }]}
                  placeholderTextColor="rgba(0,0,0,0.2)"
                  onChangeText={(text) => { this.setState({ phone: text, validationMsg: '' }); }}
                />
                <Divider style={{ marginLeft: 20 }} />

                <TextInput value={address} 
                  style={[styles.inputField, styles.text, { marginTop: 8, borderBottomWidth: 0 }]}
                  placeholder="Address *" placeholderTextColor="rgba(0,0,0,0.2)"
                  onChangeText={(text) => { this.setState({ address: text, validationMsg: '' }); }}
                />
                <Divider style={{ marginLeft: 20 }} />

                <DropDown size="large" 
                  style={{ alignSelf: "auto", marginRight: 15, marginLeft: 12, marginTop: 8, backgroundColor: "#FFF" }}
                  placeholder="Gender"
                  value={gender}
                  onChange={(value, index, item) => { this.setState({ gender: value, validationMsg: '' }); }}
                  data={genderArray}
                />
                <Divider style={{ marginLeft: 20 }} />

                <DropDown size="large" 
                  style={{ alignSelf: "auto", marginRight: 15, marginLeft: 12, marginTop: 8, backgroundColor: "#FFF" }}
                  value={country}
                  placeholder="Country"
                  onChange={(value, index, item) => { this.selectCountry(value) }}
                  data={countryArray}
                />
                <Divider style={{ marginLeft: 20 }} />
                
                <DropDown size="large" 
                  style={{ alignSelf: "auto", marginRight: 15, marginLeft: 12, marginTop: 8, backgroundColor: "#FFF" }}
                  placeholder="Province/State"
                  noDataText="Please select a country from above"
                  value={state}
                  onChange={(value, index, item) => { this.setState({ state: value, validationMsg: '' }); }}
                  data={statesArrayItems}
                />
                <Divider style={{ marginLeft: 20 }} />

                {/* HEIGHT */}
                <Row style={{ marginVertical: 10 }}>
                  <Col flex="auto">

                    {(heightUnitSelected && heightUnitSelected.value === 2) && <Row>
                      <Col align="center">
                        <DropDown size="small"
                          style={{ alignSelf: "auto", marginTop:5, marginRight: 15, marginLeft: 12, backgroundColor: "#FFF" }}
                          value={heightInFeet}
                          onChange={(value, index, item) => { this.setState({ heightInFeet: value, validationMsg: '' }); }}
                          data={heightFeetsArray}
                        />
                      </Col>
                      <Col align="center" style={{ marginLeft: 5 }}>
                        <DropDown size="small"
                          style={{ alignSelf: "auto", marginTop: 5, marginRight: 15, marginLeft: 12, backgroundColor: "#FFF" }}
                          value={heightInInches}
                          onChange={(value, index, item) => { this.setState({ heightInInches: value, validationMsg: '' }); }}
                          data={heightInchesArray}
                        />
                      </Col>
                    </Row>}

                    {(heightUnitSelected && heightUnitSelected.value == 1) && <>
                      <TextInput
                        style={[styles.inputField, styles.text, { marginTop: 8, borderBottomWidth: 0 }]}
                        // style={[styles.inputField, styles.text, { marginTop: 0, flex: 1, borderBottomWidth: 0, marginLeft: 5 }]}
                        value={`${height != undefined? height: 0}`}
                        placeholder='Height in cm'
                        placeholderTextColor="rgba(0,0,0,0.2)"
                        keyboardType='decimal-pad'
                        maxLength={6}
                        onChangeText={(text) => { this.setState({ height: text }) }}
                      /></>
                    }

                  </Col>

                  {/* <Col valign="center" style={{ paddingRight: 10 }}><Text style={styles.selectedUnit}>{unitList.height[heightUnitSelected || 0].name}</Text></Col> */}
                  <Col valign="center" style={{ paddingRight: 10 }}><Text style={styles.selectedUnit}>{heightUnitSelected.name}</Text></Col>
                </Row>

                <Divider style={{ marginLeft: 20 }} />

                {/* WEIGHT */}
                <Row>
                  <Col flex="auto" valign="center">
                      <TextInput keyboardType='decimal-pad' placeholder={weightPlaceHolder} placeholderTextColor="rgba(0,0,0,0.2)" maxLength={6}
                        style={[styles.inputField, styles.text, { marginTop: 8, borderBottomWidth: 0, flex:1 }]}
                        value={`${this.state.weight}`}
                        onChangeText={(text) => { this.setState({ weight: text }) }}
                      />
                  </Col>
                  <Col valign="center" style={{ paddingRight: 10 }}>
                    <Text style={styles.selectedUnit}>{this.state.weightUnitSelected && this.state.weightUnitSelected.name}</Text>
                    {/* <Text style={styles.selectedUnit}>{this.state.weightUnitSelected.value && unitList.weight.find(o => o['value'] == this.state.weightUnitSelected.value).name}</Text> */}
                  </Col>
                </Row>
                <Divider style={{ marginLeft: 20 }} />

                {/* DOB */}
                <Text style={styles.labelHeading}>Date of Birth*</Text>
                <DateField 
                  maximumDate={new Date(age18.format("YYYY"), age18.format("M"), age18.format("D"))}
                  style={[styles.inputField, styles.text, { borderBottomWidth: 0, marginLeft:23, marginTop:5, marginBottom:10 }]} 
                  value={dateOfBirth}
                  placeholder="DOB" placeholderTextColor="rgba(0,0,0,0.2)"
                  onChange={(val) => this.setState({ dateOfBirth:val })}
                />
                <Divider style={{ marginLeft: 20 }} />

                {this.role =="caretaker" && <>
                  {/* <Text style={styles.labelHeading}>{this.state.appType == 1 ? "Agent Email" : "Senior Manager"}*</Text>
                  <TextInput style={[styles.inputField, styles.text, { marginTop: 0, paddingTop:0, borderBottomWidth: 0 }]}
                    value={this.state.agentEmail}
                    placeholder={`Enter ${this.state.appType === 1 ? 'agent' : 'manager'}'s email`}
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    keyboardType={"email-address"}
                    onChangeText={val => this.setState({ agentEmail: val, validationMsg:'' })}
                  />
                  <Divider style={{ marginLeft: 20 }} /> */}

                  {/* BranchId, AgentId */}
                  <Text style={styles.labelHeading}>{this.state.appType == 1 ? "Agent" : "Senior Manager"}*</Text>
                  <DropDown
                    style={{ alignSelf: "auto", marginRight: 15, marginLeft: 12, marginTop: 0, paddingTop: 0, backgroundColor: "#FFF" }}
                    textStyle={{ color: "#000" }}
                    data={!this.state.agents ? [] : this.state.agents.map(item => ({ value: item.agentId, label: item.agentEmail }))}
                    placeholder={this.state.appType == 1 ? "Agent" : "Senior Manager"}
                    value={this.state.agentId}
                    onChange={(value, index, item) => {
                      this.setState({ agentId: value })
                    }}
                  />
                  <Divider style={{ marginLeft: 20 }} />
                  
                  <Text style={styles.labelHeading}>Branch*</Text>
                  <DropDown
                    style={{ alignSelf: "auto", marginRight: 15, marginLeft: 12, marginTop: 0, paddingTop: 0, backgroundColor: "#FFF" }}
                    textStyle={{ color: "#000" }}
                    data={!this.state.branches ? [] : this.state.branches.map(item => ({ value: item.id, label: item.branchname }))}
                    placeholder="Branches"
                    value={this.state.branchId}
                    onChange={(value, index, item) => {
                      this.setState({ branchId: value })
                    }}
                  />
                  <Divider style={{ marginLeft: 20 }} />
                </>}

                <Text style={styles.labelHeading}>Job Title</Text>
                <TextInput style={[styles.inputField, styles.text, { marginTop: 0, paddingTop: 0, borderBottomWidth: 0 }]}
                  value={this.state.jobTitle}
                  placeholder="Enter job title" placeholderTextColor="rgba(0,0,0,0.2)"
                  onChangeText={val => this.setState({ jobTitle: val, validationMsg: '' })}
                />
                <Divider style={{ marginLeft: 20 }} />

                {/* shiftStartTime,shiftEndTime */}
                {this.role!='senior' && <>
                  <Text style={styles.labelHeading}>Job Shift</Text>
                  {/* <Text>shiftStartTime: {this.state.shiftStartTime}</Text> */}
                  <Row>
                    <Col><TimeField 
                        format="YYYY-MM-DDTHH:mm:ss"
                        displayFormat="HH:mm"
                        style={[styles.inputField, styles.text, { borderBottomWidth: 0, marginLeft: 23, marginTop: 5, marginBottom: 10 }]} 
                        value={this.state.shiftStartTime}
                        placeholder="Start Time" placeholderTextColor="rgba(0,0,0,0.2)"
                        onChange={(val) => this.setState({ shiftStartTime: val })}
                    /></Col>
                    <Col valign="center" style={{ paddingLeft: 20 }}><Text style={{fontWeight:"bold", fontSize:18}}>to</Text></Col>
                    <Col><TimeField
                      format="YYYY-MM-DDTHH:mm:ss"
                      displayFormat="HH:mm"
                      style={[styles.inputField, styles.text, { borderBottomWidth: 0, marginLeft: 23, marginTop: 5, marginBottom: 10 }]}
                      value={this.state.shiftEndTime}
                      placeholder="End Time" placeholderTextColor="rgba(0,0,0,0.2)"
                      onChange={(val) => {
                        console.log("val: ", val);
                        this.setState({ shiftEndTime: val });
                      }}
                    /></Col>
                  </Row>
                  <Divider style={{ marginLeft: 20 }} />
                </>}

                <Text style={styles.labelHeading}>Notes</Text>
                <TextInput
                placeholder="Profile description"
                  value={profileDescription !== 'null' ? profileDescription : ''}
                  multiline={true}
                  style={[styles.inputFieldMultiLine, { borderBottomWidth: 0, marginBottom: 20 }]}
                  onChangeText={(text) => { this.setState({ profileDescription: text }); }}
                  // onContentSizeChange={(e) => { numOfLinesCompany = e.nativeEvent.contentSize.height / 18; }}
                />
                <Divider style={{ marginLeft: 20 }} />


                 {country === 'Canada'  && this.role === 'senior'  && <>
                    <Text style={styles.labelHeading}>Health Card Number</Text>
                    <TextInput style={[styles.inputField, styles.text, { marginTop: 0, paddingTop: 0, borderBottomWidth: 0 }]}
                      value={this.state.patientId}
                      placeholder="Health Card Number" placeholderTextColor="rgba(0,0,0,0.2)"
                      onChangeText={val => this.setState({ patientId: val, validationMsg: '' })}
                      maxLength={15}
                    />
                    <Divider style={{ marginLeft: 20 }} />
                 </>}

                 {country === 'USA'  && this.role === 'senior'  && <>
                   <Text style={styles.labelHeading}>Medicare Number</Text>
                    <TextInput style={[styles.inputField, styles.text, { marginTop: 0, paddingTop: 0, borderBottomWidth: 0 }]}
                     value={this.state.medicareNumber}
                      placeholder="Medicare Number" placeholderTextColor="rgba(0,0,0,0.2)"
                     onChangeText={val => this.setState({ medicareNumber: val, validationMsg: '' })}
                     maxLength={15}
                    />
                    <Divider style={{ marginLeft: 20 }} />

                   <Text style={styles.labelHeading}>Medicaid Number</Text>
                    <TextInput style={[styles.inputField, styles.text, { marginTop: 0, paddingTop: 0, borderBottomWidth: 0 }]}
                     value={this.state.medicaidNumber}
                      placeholder="Medicaid Number" placeholderTextColor="rgba(0,0,0,0.2)"
                     onChangeText={val => this.setState({ medicaidNumber: val, validationMsg: '' })}
                     maxLength={15}
                    />
                    <Divider style={{ marginLeft: 20 }} />
                 </>}


              </View>

              {this.role !="caretaker" &&  this.state.getPackageModuleResponse && 
                <View style={{ borderWidth: 0, padding:25 }}>
                  <Text style={{color:"#999999", fontSize:18}}>Plan type: {this.state.getPackageModuleResponse.title}</Text>
                  {this.state.userExpiryDate && 
                    <Text style={{ color: "#999999", fontSize: 18 }}>Subscription expiry: {this.state.userExpiryDate ? this.state.userExpiryDate.split(" ")[0] : ''}</Text>
                  }
                </View>
              }

               <HiddenInfoButton />

            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText:{
    fontFamily: theme.fonts.SFProRegular, fontSize: 17, lineHeight: 22, letterSpacing: -0.41, color: theme.colors.white
  },


  selectedUnit:{
    color: theme.colors.colorPrimary, 
    borderWidth: 1, borderColor: theme.colors.colorPrimary, borderRadius: 20, 
    paddingHorizontal: 15, paddingVertical: 5, fontSize: 18,

  },
  root: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary,
    paddingTop: Platform.OS === "ios" ? 44 : 0
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  inputField: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    color: "black",
    marginLeft: 20,
    height: Platform.OS === "ios" ? 40 : undefined,
  },
  inputFieldMultiLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    color: "black",
    marginLeft: 20,
  },
  subText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black,
  },
  validationMsg: {
    width: '100%',
    paddingLeft: 20,
    backgroundColor: theme.colors.white,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 16,
    paddingVertical: 4,
    color: theme.colors.red_shade_1
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropDownInput: {
    flex: 1,
    fontSize: 26,
    letterSpacing: -0.41,
    color: theme.colors.black,
    alignItems: 'center'
  },
  dropDown: {
    width: '50%',
    fontSize: 26,
    letterSpacing: -0.41,
    color: theme.colors.black,
    alignItems: 'center'
  },
  downArrow: {
    width: 13,
    height: 10,
  },
  dropDownContainer: {
    flex: 1,
    // height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
    paddingVertical:5,
  },
  shiftTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 8,
    marginLeft: 23
  },
  labelHeading: {
    fontSize: 18,
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 8,
    marginLeft: 23
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#d3d3d3C2'
  },
  photoText: {
    fontWeight: 'normal', 
    fontSize: 18, 
    marginTop: 15 
  },
})
