import { AppConstants, StorageUtils } from "../../../utils";
import {
  StyleSheet,
  View,
} from "react-native";
import React, { Component, PureComponent } from "react";
import {
  FlatList,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AttachmentIcon from 'react-native-vector-icons/Entypo'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import Message from './Message'
import { Col, Row } from "../../../components";
import { icons } from "../../../assets";


export class Chat extends Component {
  constructor(props) {
    super(props);
    this.opponentUser = this.props.navigation.getParam("opponentUser");
    this.state = {
      timePassed: false,
      messageText: '',
      dialog: {},
      activIndicator: false,
      history: [{ sender: true, body: 'hy, where are you?' }, { sender: false, body: 'hi, i am fine. whats about you? and what are you doing now a days' }]
    };
  }

  async componentDidMount() { }

  sendMessage = async () => { }

  onTypeMessage = messageText => this.setState({ messageText })

  _renderMessageItem(data) {
    return (
      <Message otherSender={data.sender} message={data.body} key={'id'} />
    )
  }

  renderHeader = () => {
    return (
      <Row style={styles.header}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Row>
            <Col valign="center">{<Image source={icons.arrow_blue} style={{ tintColor: '#7c5494' }} />}</Col>
            <Col valign="center"><Text style={styles.headerLeftTextStyle}>Back</Text></Col>
          </Row>
        </TouchableOpacity>
        <Row style={{ alignItems: 'center' }}>
          <Text style={styles.headerName}>Lisa Fernandes</Text>
          <Image source={icons.cicle_default} style={{ width: 50, height: 50, borderRadius: 25 }} />
        </Row>
      </Row>
    )
  }

  render() {
    const { messageText, activIndicator, history } = this.state
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white', }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <StatusBar barStyle="dark-content" />
        {this.renderHeader()}
        <Col style={styles.linStyle} />
        {activIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
        <FlatList
          data={history}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this._renderMessageItem(item)}
          onEndReachedThreshold={5}
          onEndReached={this.getMoreMessages}
        />
        <Text style={{marginLeft: 25, marginBottom: 5}}>Dr.Meslisaa Sanders is typing</Text>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachment}>
              <AttachmentIcon name="attachment" size={22} color="#8c8c8c" onPress={this.sendAttachment} />
            </TouchableOpacity>
            <AutoGrowingTextInput
              style={styles.textInput}
              placeholder='Glad to know everything'
              placeholderTextColor="grey"
              value={messageText}
              onChangeText={this.onTypeMessage}
              maxHeight={170}
              minHeight={50}
              enableScrollToCaret
            />

          </View>
          <TouchableOpacity style={styles.button} onPress={() => { }}>
            <Text style={{ color: '#7c5494', fontSize: 17 }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '300',
    color: '#8c8c8c',
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 10,
  },
  button: {
    width: 40,
    height: 50,
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    width: 40,
    height: 50,
    right: 5,
    bottom: 0,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    flexDirection: 'row'
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  headerLeftTextStyle: {
    marginLeft: 5,
    color: '#7c5494',
    fontSize: 17,
  },
  headerName: {
    paddingRight: 20,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: '#000000'
  },
  linStyle: {
    borderBottomWidth: .5,
    borderColor: '#000',
    marginTop: 10
  }
});
