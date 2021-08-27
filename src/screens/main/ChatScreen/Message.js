import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class Message extends Component {
  isAtachment = null

  constructor(props) {
    super(props)
    this.state = {
      isModal: false,
      send_state: props.message.send_state
    }
    this.isAtachment = props.message.attachment
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.message.send_state != nextState.send_state ||
      nextState.isModal !== this.state.isModal
    ) {
      return true
    } else {
      return false
    }
  }


  renderAttachment = () => {
    const { message } = this.props
    return (
      <TouchableOpacity style={{ marginBottom: 3 }} onPress={this.handleModalState}>
      </TouchableOpacity>
    )
  }

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }


  render() {
    const { message, otherSender } = this.props
    const { isModal } = this.state
    return (
      <View >
        {this.isAtachment &&
          <Modal visible={isModal} transparent={false} style={{ backgroundColor: 'black' }}>
            <View style={{
              width: fullWidth,
              height: fullHeight,
            }}>
            </View>
          </Modal>
        }
        {otherSender ?
          (
            <View style={[styles.container, styles.positionToLeft]}>
              <View style={[styles.message, styles.messageToLeft]}>
                {this.isAtachment && this.renderAttachment()}
                <Text style={[styles.messageText,{color: '#000'}, (otherSender ? styles.selfToLeft : styles.selfToRight)]}>{message || ''}</Text>
                <Text style={styles.dateSent}>6:47 pm</Text>
              </View>
            </View>
          ) :
          (
            <View style={[styles.container, styles.positionToRight]}>
              <View style={[styles.message, styles.messageToRight]}>
                {this.isAtachment &&
                  this.renderAttachment()
                }
                <Text style={[styles.messageText, styles.selfToRight]}>{message || ''}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.dateSent,{color: 'white'}]}>6:46 pm</Text>
                  <Icon name="done" size={12} color="white" />
                </View>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  positionToLeft: {
    justifyContent: 'flex-start'
  },
  positionToRight: {
    justifyContent: 'flex-end'
  },
  message: {
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  messageToLeft: {
    maxWidth: fullWidth - 90,
    borderBottomLeftRadius: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray'
  },
  messageToRight: {
    maxWidth: fullWidth - 55,
    borderBottomRightRadius: 2,
    backgroundColor: '#7c5494'
  },
  messageText: {
    fontSize: 16,
    color: 'white'
  },
  selfToLeft: {
    alignSelf: 'flex-start'
  },
  selfToRight: {
    alignSelf: 'flex-end'
  },
  dateSent: {
    alignSelf: 'flex-end',
    paddingTop: 1,
    paddingHorizontal: 3,
    fontSize: 12,
  }
})