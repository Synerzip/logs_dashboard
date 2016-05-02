/**
 * Created by amita on 3/18/2016.
 */

import React, {PropTypes } from 'react';
import {Col} from 'react-bootstrap'
import {ItemList} from '../views'
import {Item} from '../views'
import {GroupListContainer,StreamListContainer,FilterContainer} from './index.js'
import {bindActionCreators} from 'redux';
import * as itemActionCreators from 'common/webServices/itemService';
import * as itemAddActionCreators from 'common/actions/itemActions';
import * as loaderActionCreators from 'common/actions/loader';
import Loader from 'react-loader';


import {connect} from 'react-redux';

export default class ItemContainer extends React.Component {
    componentWillMount (){


    }
    componentWillReceiveProps(nextProps){
        debugger;
        //if(nextProps.stream["stream"]){
        //    this.props.itemactions.getItems();
        //}
    }


    render() {
        const { products,addeditemsId } = this.props
        return (
                <div>
<FilterContainer />
                <div className="box">
            <div className="row">
<Col xs={12} sm={12} md={6}>
        <GroupListContainer />
            </Col>
        <Col xs={12} sm={12} md={6}>
        < StreamListContainer />
        </Col>
        </div>

        <div className="row">
            <Loader loaded={this.props.loader}>
        <Col xs={12} sm={12} md={12}>
            <ItemList
        itemAddAction={this.props.itemactions.getItems}
        liveLogAction={this.props.itemactions.getLiveLogs}
        liveLogHandlr={this.props.LiveLogHandler}
         loaderAction={ this.props.loaderAction}>
        {products && products.map(item=>
    item.events.map((product,i) =>
<Item

    product={product}
indexkey={i}

        />
)
)}
</ItemList>

    </Col>
            </Loader>
    </div>
    </div>
    </div>
)
}
}
const mapStateToProps = (state) => ({
    products   : state.Items,
    addeditemsId:state.AddedItemsCount,
    stream:state.stream,
    LiveLogHandler:state.liveLogHandler,
    loader:state.loader.loaded
});
const mapDispatchToProps = (dispatch) => ({
      itemactions : bindActionCreators(itemActionCreators, dispatch),
    itemAddActionCreators: bindActionCreators(itemAddActionCreators, dispatch),
    loaderAction:bindActionCreators(loaderActionCreators,dispatch)


})

ItemContainer.defaultProps ={
    products:[],
    addeditemsId:0

}

export default connect(mapStateToProps,mapDispatchToProps)(ItemContainer);
