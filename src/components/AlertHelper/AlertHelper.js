import React, { Component } from "react";
import {
  Modal,
  Text, View, TouchableOpacity, StyleSheet
} from "react-native"
import PropType from 'prop-types'
import { styles } from "./styles"

const { container, mainAlertView, textStyle,
  alertMessage, buttonStyle, btnContainer } = styles

export class AlertHelper extends Component {
  static alertHelperInstance

  static propTypes = {
    title: PropType.string,
    description: PropType.string,
    okButton: PropType.string,
    cancelBtn: PropType.string
  }

  static defaultProps = {
    title: '',
    description: '',
    okButton: '',
    cancelBtn: ''
  }

  constructor() {
    super()
    this.state = {
      visible: false,
    }
    AlertHelper.alertHelperInstance = this
  }

  static show(dialogProps) {
    AlertHelper.alertHelperInstance._show(dialogProps)
  }

  _show(dialogProps) {
    const { title, description, okButton, cancelBtn } = dialogProps
    this.setState({ visible: true, title, description, okButton, cancelBtn })
  }

  cancelAlertBox = () => {
    const { cancelBtn } = this.state
    cancelBtn && cancelBtn.onPress && cancelBtn.onPress()
    this.setState({ visible: false })
  }

  onClickPositiveBtn = () => {
    const { okButton } = this.state
    this.setState({ visible: false })
    okButton.onPress()
  }

  render() {
    const { title, description, okButton, cancelBtn, visible } = this.state
    if (!visible) return null

    const { lable } = okButton || 'Ok'
    const { negativeBtnLable } = cancelBtn || 'Cancel'

    return (<View style={container} >
      <Modal
        visible={visible}
        transparent={true}
        animationType={"fade"}
        onRequestClose={this.cancelAlertBox} >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={mainAlertView}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {!!description && <Text style={alertMessage}>{description}</Text>}
            </View>
            <View style={btnContainer}>
              {!!okButton && <TouchableOpacity style={buttonStyle} onPress={this.onClickPositiveBtn} activeOpacity={0.7} >
                <Text style={textStyle}>{lable}</Text>
              </TouchableOpacity>}
              {!!cancelBtn && <TouchableOpacity style={buttonStyle} onPress={this.cancelAlertBox} activeOpacity={0.7} >
                <Text style={textStyle}> {negativeBtnLable} </Text>
              </TouchableOpacity>}
            </View>
          </View>
        </View>
      </Modal>
    </View>
    )
  }
}
