import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  NativeModules,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Buffer } from 'buffer';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const {CalendarModule, NtlCardReader} = NativeModules;
  const isDarkMode = useColorScheme() === 'dark';
  const [readerName, setReaderName] = useState('-');
  const [id, setId] = useState('-');
  const [name, setName] = useState('-');
  const [address, setAddress] = useState('-');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onPress = () => {
    console.log('**********onPress**********');
    CalendarModule.createCalendarEvent('testName', 'testLocation');

    setId('-')
    setName('-')
    setAddress('-')

    initCardReader();
    getCardReaderName();
    connectCardReader();
  };

  const initCardReader = () => {
    NtlCardReader.getInitStatus(isInit => {
      console.debug('getStatus ::', isInit);
      if (!isInit) {
        NtlCardReader.initCard();
        console.log('initCard!');
      }
      console.log('***end init***');
    });
  };

  const connectCardReader = () => {
    // ตรวจสอบว่าบัตรเสียบเข้า cardReader หรือยัง
    NtlCardReader.connectCardReader(isCardConnected => {
      console.debug('isCardConnected ::', isCardConnected);
      console.log('***end connectCardReader***');
      if (isCardConnected) {
        getInfoFromIdCard();
      }
    });
  };

  const decodeISOtoTIS620 = (val) => {
      console.log('***end decodeISOtoTIS620***');
    // ฝ = Ω -> Ω
    val = val.replace(/Ω/g, "Ω");
    // console.log('decodeISOtoTIS620',val)
    var iconv = require('iconv-lite');
    let buf = iconv.encode(val, 'macRoman');
    // console.log(buf);
  
    var utf8String = iconv.decode(new Buffer(buf), "tis-620");  //tis-620
    // console.log('utf8String',utf8String);
    return utf8String;
  }

  const getInfoFromIdCard = () => {
    // รับค่าข้อมูลบัตรประชาชน
      console.log('***end sendCommand***');
    NtlCardReader.sendCommand((err, data) => {
      console.log(data)
      setId('112212321234')
      // setId(data[0].replace('9', 'H').replace('6', 'H').replace('1', 'H').replace('3', 'H').replace('5', 'H').replace('2', 'H').replace('0', 'H').replace('6', 'H'))
      let fullname = data[1].split("#");
      let citizen = data[0];
      let title = fullname[0];
      let firstname = fullname[1];
      let lastNameArr = fullname[3].split(" ");
      let lastNameTHArr = Array()
      let lastname
      // if(lastNameArr.length > 50){
      lastNameArr.map((data, index) => {
        if (data != "" && index == 0) {
          lastNameTHArr.push(data)
        } else if (data != "") {
          lastNameTHArr.push(" " + data)
        } else {
          return
        }
      });
      lastname = lastNameTHArr.splice(0, lastNameTHArr.length - 1).join("");
      const birthdate = fullname[6].split(" ")[fullname[6].split(" ").length - 1].substring(0, 8);
      const gender = fullname[6].split(" ")[fullname[6].split(" ").length - 1].substring(8, 9);
      const addr = data[2];
      const expire = data[3];
      const regex = /[A-z]/g;
      // const idCardInfo = {
      //   citizen,
      //   titleName: decodeISOtoTIS620(title).replace(/ว่าที่/g, "วท.").replace(/ /g, ""),
      //   firstName: decodeISOtoTIS620(firstname),
      //   lastName: decodeISOtoTIS620(lastname).replace(regex, " "),
      //   birthdate: `${(birthdate.substring(0, 4) - 543)}-${birthdate.substring(4, 6)}-${birthdate.substring(6, 8)}`,
      //   gender,
      //   addr: addr,
      //   dateOfIssue: `${(expire.substring(0, 4) - 543)}-${expire.substring(4, 6)}-${expire.substring(6, 8)}`,
      //   idCardExpires: `${(expire.substring(8, 12) - 543)}-${expire.substring(12, 14)}-${expire.substring(14, 16)}`
      // }
      setName(decodeISOtoTIS620(firstname) + ' ' + decodeISOtoTIS620(lastname))
      let ss =  data[2].split("#");
      setAddress(decodeISOtoTIS620(ss[4]+' '+ss[7]).replace('ธนบุรี', 'XXXX'))
      // if (_.size(data) > 3) {
      //   this.loopDelayForRenderReadingModal = setTimeout(() => {
      //     firebase.analytics().setCurrentScreen('cardreader_reading_screen');
      //     this.props.dispatch({
      //       type: 'SETEVENT'
      //       , obj: {
      //         empid: this.state.empId,
      //         branchcode: this.state.afsBranchTemp,
      //         event: `cardreader_reading_screen`
      //         , ggprms: {
      //           event_category: `loan_info`,
      //           event_action: `Waiting & Redirect`,
      //           event_label: `เครื่องกำลังทำการอ่านข้อมูล`,
      //         }
      //       }
      //     });
      //     this.handleIdCardInfo(data);
      //   }, this.delayForRenderReadingModal);
      // } else {
      //   if (countLoopGetInfo < 2) {
      //     this.setState({ countLoopGetInfo: countLoopGetInfo + 1 });
      //     this.loopGetInfoFromIDCard = setTimeout(() => {
      //       this.getInfoFromIdCard();
      //     }, this.delayLoopTime);
      //   } else {
      //     firebase.analytics().setCurrentScreen('cardreader_notread_popup');
      //     this.props.dispatch({
      //       type: 'SETEVENT'
      //       , obj: {
      //         empid: this.state.empId,
      //         branchcode: this.state.afsBranchTemp,
      //         event: `cardreader_notread_popup`
      //         , ggprms: {
      //           event_category: `loan_info`,
      //           event_action: `Click`,
      //           event_label: `ลองใหม่`,
      //         }
      //       }
      //     });
      //     this.openRetryInsertCard();
      //   }
      // }
    });
  }

  const getCardReaderName = () => {
    NtlCardReader.statusCardReader((err, cardReaderName) => {
      console.log('getCardReaderName ::', cardReaderName);
      if (err) {
        console.log(err);
      } else if (cardReaderName) {
        setReaderName(cardReaderName);
      } else {
        console.log('other');
      }
      console.log('***end getCardReaderName***');
    });
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title={`ReaderName => ${readerName}`}>
              <Text style={styles.text}>{'****************'}{"\n"}</Text>
              <Text style={styles.text}>CitizenId::  {id}{"\n"}</Text>
              <Text style={styles.text}>Name:: {name}{"\n"}</Text>
              <Text style={styles.text}>Adress:: {address}{"\n"}</Text>
              <Text style={styles.text}>{'****************'}{"\n"}</Text>
            <Pressable style={styles.button} onPress={onPress}>
              <Text style={styles.text}>{'Click ME!!'}</Text>
            </Pressable>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default App;
