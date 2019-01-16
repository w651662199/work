import React, {Component} from 'react';
import Action from '../action/action.js';

class Item extends Component {
	render() {
		let item = this.props.item;
    let content = item.contentObject;
    return (
      <div className="list-item item">
        <div className="cover">
          <img alt="" src={content.coverImg}/>
          <p className="title">{content.title}</p>
        </div>
        <div className="img-list">
          {content.images.map(img =>
            <div className="img-item" key={img}>
              <img alt="" src={img}/>
            </div>
          )}
        </div>
        <Action sharePraiseNum={item.sharePraiseNum}/>
      </div>
    );
	}
}

export default Item;