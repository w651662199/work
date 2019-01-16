import React, {Component} from 'react';

import {AD_TYPE} from '../../utils/constants.js';

import Item from '../item/index.js';
import Normal from '../normal/index.js';
import Video from '../video/index.js';
import Content from '../content/index.js';

class ListItem extends Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}
  isNormal(type) {
    return [AD_TYPE.PRODUCT, AD_TYPE.SHOP, AD_TYPE.TOPIC].indexOf(+type) > -1;
  }
	render() {
    let item = this.props.item;
		if (item.type == 1) {
      if (item.contentObject.ctype == AD_TYPE.ITEM) {
        return <Item type="item" item={item}/>
      } else if (this.isNormal(item.contentObject.ctype)) {
        return <Normal item={item}/>
      } else if (item.contentObject.ctype == AD_TYPE.VIDEO) {
        return <Video type="video" item={item}/>
      } else {
        return <p>{item.contentObject.ctype}</p>
      }
    } else {
      return <Content item={item}/>
    }
	}
}

export default ListItem;