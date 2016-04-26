/**
 * Created by amita on 4/26/2016.
 */
/**
 * Created by amita on 4/25/2016.
 */

import React, {PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {Input} from "react-bootstrap";
import * as groupWebActionCreators from 'common/webServices/dropdownList.js';
import * as groupActionCreators from 'common/actions/dropdown.js';
import {connect} from 'react-redux';

export default class StreamListContainer extends React.Component {
    componentWillMount (){
        this.props.streamwebactions.getStreams();
    }
    onStreamSelected(e){
        e.preventDefault();
        console.log("selected Stream:",e.target.value);

    }
    render() {
        const { streams } = this.props;
        if(streams.streams) {
            var streamValues = streams.streams.streams.map((stream) => {
                    return ( < option value = {stream} > {stream} < / option >)
        }
    );
    }
    return (
<Input type="select" label="Select Stream"
    placeholder="Select Stream"
    onChange={(e)=>this.onStreamSelected(e)}>
<option value="select">Select Stream</option>

{streamValues}

</Input>
)
}
}
const mapStateToProps = (state) => ({

    streams:state.streams

});
const mapDispatchToProps = (dispatch) => ({

    streamactions:bindActionCreators(groupActionCreators, dispatch),
    streamwebactions:bindActionCreators(groupWebActionCreators, dispatch)
})



export default connect(mapStateToProps,mapDispatchToProps)(StreamListContainer);