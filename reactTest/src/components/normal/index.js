import React, {Component} from 'react';
import Action from '../action/action.js';

class Normal extends Component {
  render() {
    let item = this.props.item;
    let content = item.contentObject;
    return (
      <div className="list-item topic">
        <div className="cover">
          <img alt="" src={content.coverImg}/>
        </div>
        <p className="title">{content.title}</p>
        <Action sharePraiseNum={item.sharePraiseNum}/>
      </div>
    );
  }
}

export default Normal;