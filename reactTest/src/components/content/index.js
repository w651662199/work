import React, {Component} from 'react';

import Action from '../action/action.js';

class Content extends Component {
  getTagEl() {
    let tags = this.props.item.contentObject.tags;
    return (
      <p className="tag-con">
        {tags.map(tag => <span className="tag" key={tag}>#{tag}</span>)}
      </p>
    )
  }
	render() {
    let item = this.props.item;
		let content = this.props.item.contentObject;
    if (content.title) {
      return (
        <div className="list-item content">
          <div className="cover">
            <img alt="" src={content.coverImg}/>
          </div>
          <p className="title">{content.title}</p>
          {this.getTagEl()}
          <Action sharePraiseNum={item.sharePraiseNum}/>
        </div>
      )
    } else {
      return (
        <div className="list-item content">
          <p className="desc">{content.text.substring(0, 20)}</p>
          {this.getTagEl()}
          <Action sharePraiseNum={item.sharePraiseNum || {}}/>
        </div>
        )
    }
	}
}

export default Content;