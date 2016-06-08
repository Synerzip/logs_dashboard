/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 'user strict'

var React = require('react-native');
import Streams from './Streams';

import {PropTypes } from 'react';

import {getGroups} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as groupWebActionCreators from 'common/webServices/dropdownList';
import * as groupActionCreators from 'common/actions/dropdown';
import {urlobj} from 'common/apiurls';
import {serverUrl} from 'common/constants/loginConstants.js'

 var {
   StyleSheet,
   Image,
   ListView,
   View,
   TextInput,
   TouchableHighlight,
   ListView,
   Text,
   Component,
   ActivityIndicatorIOS
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
   },
   sectionContainer: {
     flexDirection: 'row',
     padding: 5,
     backgroundColor: '#dfdfdf',
   }
 });


 //var MOCKED_DATA =  ['Group 1', 'Group 2', 'Group 3', 'Group 4'];


class Groups extends Component {

constructor(props) {
  super(props)
     this.state = {
       dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1.guid !== row2.guid,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        })
     };
    loaded: false;
    price: 'fix';
  }

  componentWillMount (){

    let userName = this.props.userName;
    let password = this.props.password;
    let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getGroups
      this.props.groupwebactions.getGroups(url);
      console.log('this.props: ');
      console.log(this.props);
  }

componentWillReceiveProps(nextProps) {
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(nextProps.groups.groups)
  });
}
  onGroupSelected(e,obj){
      // e.preventDefault();
      console.log("selected Group:",e.target.value);
  }

  rowPressed(guid) {
    console.log('row pressed' + {guid});
    console.log('in rowPressed');

    let userName = this.props.userName;
    let password = this.props.password;
      this.props.navigator.push ({
        title: 'Streams',
        component: Streams,
        passProps: {
          userName: userName,
          password: password
        }
      });
  }

  renderSectionHeader(sectionData, sectionID) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>Sample Section added for study</Text>
    </View>
  );
}

renderFooter() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Sample Footer </Text>
        <ActivityIndicatorIOS
          animating={true}
          size={'large'} />
      </View>);
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
      renderRow={this.renderRow.bind(this)}
      // renderSectionHeader={this.renderSectionHeader}
      // renderFooter={this.renderFooter} style={styles.listView}
      />
    );
  }
}

const mapStateToProps = (state) => ({
    groups:state.groups.groups
});

const mapDispatchToProps = (dispatch) => ({
    groupactions:bindActionCreators(groupActionCreators, dispatch),
    groupwebactions:bindActionCreators(groupWebActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
