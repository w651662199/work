import React, {Component} from 'react';

import EventEmitter from '../../utils/EventEmeitter.js';
import './tab.scss';

class Tab extends Component {
	constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1
    };
  }

  changeTab(i) {
    this.setState({
      tabIndex: i
    });
    EventEmitter.emit('reloadList', i);
  }

  render() {
    return (
      <div className="tab-con">
        <div className={`tab-item ${this.state.tabIndex === 1 ? 'actived' : ''}`} onClick={this.changeTab.bind(this, 1)}>推荐</div>
        <div className={`tab-item ${this.state.tabIndex === 2 ? 'actived' : ''}`} onClick={this.changeTab.bind(this, 2)}>最热</div>
        <div className={`tab-item ${this.state.tabIndex === 3 ? 'actived' : ''}`} onClick={this.changeTab.bind(this, 3)}>最新</div>
        <div className={`tab-item ${this.state.tabIndex === 4 ? 'actived' : ''}`} onClick={this.changeTab.bind(this, 4)}>有红包</div>
      </div>
    )
  }
}

export default Tab;