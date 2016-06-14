/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 'user strict'

import SearchLogs from './SearchLogs';

import {PropTypes } from 'react';
import {getStreams} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as groupWebActionCreators from 'common/webServices/dropdownList';
import * as groupActionCreators from 'common/actions/dropdown';
import {urlobj} from 'common/apiurls';
import {serverUrl} from 'common/constants/loginConstants.js'

var Subscribable = require('Subscribable');
var EventEmitter = require('EventEmitter');
var React = require('react-native')


 var {
   StyleSheet,
   Image,
   ListView,
   View,
   TextInput,
   TouchableHighlight,
   ListView,
   Text,
   Component
 } = React;

 var styles = StyleSheet.create({
   textContainer: {
     flex: 1
   },
   separator: {
     height: 1,
     backgroundColor: '#dddddd'
   },
   title: {
     fontSize: 20,
     color: '#656565'
   },
   rowContainer: {
     flexDirection: 'row',
     padding: 10
   }
 });


 // var MOCKED_DATA =  ['Stream 1', 'Stream 2', 'Stream 3', 'Stream 4'];

var rightButtonHandler = new EventEmitter()

class Streams extends Component {

constructor(props) {
  super(props)

  this.state={
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.guid !== row2.guid,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
  };
    loaded: false;
    price: 'fix';
  }


  componentWillMount (){
    // this.props.streamwebactions.getGroups(urlobj.getGroups);
    this.eventEmitter = new EventEmitter();

    let userName = this.props.userName;
    let password = this.props.password;
    let url = "http://"+ serverUrl + urlobj.getStreams;
    this.props.streamwebactions.getStreams(url, userName, password);
    console.log('streamwebactions this.props: ');
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps==>');
    console.log(nextProps.streams);
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(nextProps.streams)
  });
  }

  onRightButtonPress() {
   rightButtonHandler.emit('rightButtonPressed', { someArg: 'argValue' });
  }


  rowPressed(guid) {
    console.log('row pressed' + {guid});
    let userName = this.props.userName;
    let password = this.props.password;

    this.props.navigator.push ({
      title: 'Logs',
      component: SearchLogs,
      rightButtonTitle: 'Advanced',
      onRightButtonPress: this.onRightButtonPress,
        passProps: {
          userName: userName,
          password: password,
          events: rightButtonHandler
        }
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
  <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
      underlayColor='#dddddd'>
    <View>
      <View style={styles.rowContainer}>
        <View  style={styles.textContainer}>
          <Text style={styles.title}>{rowData}</Text>
        </View>
      </View>
      <View style={styles.separator}/>
    </View>
  </TouchableHighlight>
  );
}
  render() {
    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow.bind(this)}/>
    );
  }
}

const mapStateToProps = (state) => ({
    streams:state.streams.streams

});
const mapDispatchToProps = (dispatch) => ({
    // streamactions : bindActionCreators(groupActionCreators, dispatch),
    streamwebactions : bindActionCreators(groupWebActionCreators, dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(Streams);
