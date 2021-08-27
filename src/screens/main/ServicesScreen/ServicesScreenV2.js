import React, { Component } from "react";
import { FlatList, Text, ScrollView, TouchableOpacity, View, Image, StatusBar } from "react-native";
// import { BleManager } from "react-native-ble-plx";
// import { ServiceItem,NavigationHeader} from "../../../components";
import { styles } from "./stylesV2";
import { images, icons } from "../../../assets";
// import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import Modal from "react-native-modal";
// import ListItem from './ListItem';
import WebViewComp from './WebViewComp'
import { AppConstants, StorageUtils } from "../../../utils";
import { checkModule } from "../../../utils/updater";
import { Row, Col } from "../../../components";
// import { theme } from "../../../theme";
import { commonStyles } from '../../../commonStyles'



const ListItem = ({ onPress, disabled, title, img }) => {
  const onButtonClick = () => {
    if (onPress){
      onPress();
      return;
    }
    alert("Coming Soon!")
  }

  const listItem_style = { ...styles.listItem}
    if (disabled) Object.assign(listItem_style, { ...styles.listItem_disabled })
  const itemTitle_style = { ...styles.itemTitle}
    if (disabled) Object.assign(itemTitle_style, { ...styles.itemTitle_disabled })

  return (<TouchableOpacity onPress={onButtonClick} disabled={disabled} style={listItem_style} activeOpacity={0.7}>
    <Row>
      <Col flex="auto" valign="center"><Text style={itemTitle_style}>{title}</Text></Col>
      <Col><Image style={{ opacity:disabled ? 0.2 : 1}} source={img} /></Col>
    </Row>
  </TouchableOpacity>)
}

export default class ServicesScreenV2 extends Component {
  state = { country: null, user_modules: null, showYDO1_WebView: false, visibleMessage:false };

  constructor() {
    super();
  }

  componentDidMount(){
    StorageUtils.getValue(AppConstants.SP.COUNTRY).then(country => {
      this.setState({ country });
    });

    StorageUtils.getValue('user_modules').then(r => this.setState({ user_modules: r || "" }));

  }

  onItemPress = (moduleName) => {
    // if (!moduleName){
    //   alert("Comming Soon!");
    //   return;
    // }

    if (moduleName =='YDO1'){
      this.openYDO1_WebView()
      return;
    }

    alert("Coming Soon!");
    // this.showMessage("Please upgrade your package!")
  }

  // checkModule(moduleName){
  //   const { user_modules } = this.state;
  //   if (!user_modules) return false;

  //   return user_modules.indexOf(moduleName) < 0 ? false : true;
  // }

  openYDO1_WebView = async args => {
    this.setState({ showYDO1_WebView: true });
  }

  showMessage(message=false){
    this.setState({ visibleMessage: message })
  }


 
  render() {
    const { country, showYDO1_WebView, visibleMessage } = this.state;

    return (<View style={commonStyles.full_page_container}>
      {/* <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.colorPrimary} /> */}

      <ScrollView contentContainerStyle={{flex:1, backgroundColor:'#FFF'}}>
        <View style={styles.container}>

          <Text style={styles.heading}>Services in {country}</Text>

          <ListItem onPress={() => this.onItemPress('YDO1')} title="Contact a Doctor Online" img={icons.contact_a_doctor} disabled={!checkModule('YDO1', this.state.user_modules)} />

          <ListItem onPress={() => this.onItemPress('CallNurse')} title="Contact a Nurse" img={icons.contact_a_nurse} />

          <ListItem onPress={() => this.onItemPress()} title="Get a Prescription" img={icons.get_a_prescription} />

          <ListItem onPress={() => this.onItemPress('HomeCare')} title="Contact Homecare/Nursing Services" img={icons.contact_homecare} />

          <ListItem onPress={() => this.onItemPress()} title="Schedule Vaccination" img={icons.schedule_vaccination} />

        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} isVisible={showYDO1_WebView} _onRequestClose={() => { Alert.alert("Modal has been closed."); }} >
        {showYDO1_WebView && <WebViewComp onClose={() => this.setState({ showYDO1_WebView: false })} />}
      </Modal>

      <Modal animationType="slide" transparent={true} isVisible={visibleMessage != false} onRequestClose={() => this.showMessage()} >
        {visibleMessage && <View style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 10 }}>
          <Row style={{ marginBottom: 10, paddingBottom: 10 }}>
            <Col flex="auto"><Text style={{ fontWeight: "bold" }}>Alert!</Text></Col>
            <Col><TouchableOpacity onPress={() => this.showMessage()} style={{borderWidth:1, paddingHorizontal:10, paddingVertical:5, borderColor:"#CCCCCC", borderRadius:5}}><Text>X</Text></TouchableOpacity></Col>
          </Row>
          <Text>{visibleMessage}</Text>
        </View>}
      </Modal>


    </View>);
  }
}
