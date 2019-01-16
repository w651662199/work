import React, {Component} from 'react';

import videoIcon from '../../assets/img/shipin_icon.png';
import Action from '../action/action.js';

class Video extends Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}

	render() {
    let item = this.props.item;
    let content = this.props.item.contentObject;
		return (
      <div className="list-item video">
        <div className="cover">
          <img className="cover-img" alt="" src={content.coverImg}/>
          <img className="video-icon" alt="" src={videoIcon} />
        </div>
        <p className="title">{content.title}</p>
        <Action sharePraiseNum={item.sharePraiseNum}/>
      </div>
		)
	}
}

export default Video;