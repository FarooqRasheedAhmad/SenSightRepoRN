var converter = require('hex2dec')
const Buffer = require('buffer').Buffer

export const base64ToHex = (base64Value) => {
    const buffer = Buffer.from(base64Value, 'base64')
    const bufString = buffer.toString('hex')
    return bufString
}

const hexToBase64 = (hexValue) => {
    return Buffer.from(hexValue, 'hex').toString('base64')
}

const hexToInt = (hex) => {
    if (hex.length % 2 !== 0) {
        hex = '0' + hex
    }
    var num = parseInt(hex, 16);
    var maxVal = Math.pow(2, (hex.length / 2) * 8)
    if (num > maxVal / 2 - 1) {
        num = num - maxVal
    }
    return num
}

const decimalToHex = d => Number(d).toString(16).padStart(2, '0')

export const calculatePulseOximeter = (value) => {
    let hexValue = base64ToHex(value)
    if (
        hexValue &&
        hexValue.length >= 8 &&
        hexValue.substring(0, 2) === '81'
    ) {
        // oxygen level,  86*0.1=8.6 % PI
        let pulseRate = converter.hexToDec(hexValue.substring(2, 4))
        let oxigenLevel = converter.hexToDec(hexValue.substring(4, 6))
        let PI = converter.hexToDec(hexValue.substring(6, 8))
        if (pulseRate !== '255' && oxigenLevel !== '127') {
            let valuesObject = { pulseRate: pulseRate, oxigenLevel: oxigenLevel, PI: PI }
            return valuesObject
        }
    }

    return null
}

export const calculateTemprature = (value) => {
    let hexValue = base64ToHex(value)
    // console.log(" - calculateTemprature: hexValue: "+ hexValue)
    // console.log(" - calculateTemprature: hexToDec: hexValue.substring(6, 6): "+ hexValue.substring(4, 6))
    // console.log(" - calculateTemprature: hexToDec: hexValue.substring(2, 4): "+ hexValue.substring(2, 4))
    let tempratureValue = converter.hexToDec(
        hexValue.substring(4, 6) + hexValue.substring(2, 4),
    )
    // console.log(" - calculateTemprature: tempratureValue: "+ tempratureValue)
    let exponentValue = hexToInt(hexValue.substring(8, 10))
    // console.log(" - calculateTemprature: exponentValue: "+ exponentValue)
    tempratureValue = (tempratureValue * 10 ** exponentValue).toFixed(1)
    // console.log(" - calculateTemprature: tempratureValue: "+ tempratureValue)
    let valuesObject = { temprature: tempratureValue }

    return valuesObject
}

export const calculateBloodPressure = (value) => {
    let hexValue = base64ToHex(value);
    let pulseRate = converter.hexToDec(hexValue.substring(16, 18))
    let systolicValue = converter.hexToDec(hexValue.substring(2, 6))
    let diastolicValue = converter.hexToDec(hexValue.substring(6, 10))
    let valuesObject = { pulseRate: pulseRate,  systolic: systolicValue, diastolic: diastolicValue }

    return valuesObject
}

export const calculateBMI = (value, userWeightUnit) => {
    let hexValue = base64ToHex(value);
        let wieghtValue = converter.hexToDec(hexValue.substring(4, 8))
        let weightString  =  hexValue.substring(2, 4)
        let weightUnit = weightString === '00' ? 'kg' : weightString == '01' ? 'lbs' : undefined
        if (weightUnit && userWeightUnit == weightUnit) {           
            wieghtValue = wieghtValue * 0.1
            let valuesObject = { unit: weightUnit,  wieght: wieghtValue }        
            return valuesObject
        }  
        return null
}

export const calculateBloodGlucose = (hexValue) => {
    // there will be many packets but we have to read when lenght is 24
      let glucoseValue = converter.hexToDec(
         hexValue.substring(20, 22) + hexValue.substring(18, 20)
      )
      let valuesObject = { glucose: glucoseValue * 0.0555 }
     return valuesObject
}

export const handshakingPacketData = () => {
    var now = new Date();
    var year = now.getFullYear().toString().slice(-2)
    var month = now.getMonth() + 1
    var day = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()
    var second = now.getSeconds()

    // as per doc Initial Byte Code 5AH(90)
    // Packet Length 0AH (10)
    // Packet Type 00H (00)
    // Check sum=total byte(1-9) + 2
    let checkSum = 90 + 10 + 0 + Number(year) + Number(month) + Number(day) + Number(hour) + Number(minute) + Number(second) + 2

    let yearHex = decimalToHex(year)
    let monthHex = decimalToHex(month)
    let dayHex = decimalToHex(day)
    let hourHex = decimalToHex(hour)
    let minuteHex = decimalToHex(minute)
    let secondHex = decimalToHex(second)
    let checkSumHex = decimalToHex(checkSum)

    var packetPayload = '5A' + '0A' + '00' + yearHex + monthHex + dayHex + hourHex + minuteHex + secondHex + checkSumHex;
    let base64Value = hexToBase64(packetPayload)
    return base64Value;
}
