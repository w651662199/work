import React, {Component} from 'react';
import EventEmitter from '../../utils/EventEmeitter.js';

import shareIcon from '../../assets/img/share_icon.png';
import './action.scss';

class Action extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  rebateSumHandler() {
    EventEmitter.emit('showRebateModal', this.props.sharePraiseNum);
  }

  render() {
    let rebate = this.props.sharePraiseNum;
    let rebateEl = '', getRebateEl = '';
    if (rebate) {
      if (rebate.rebateStatus === '1' && rebate.totalRebateBid > 0) {
        rebateEl = <p className="rebate-sum" onClick={this.rebateSumHandler.bind(this)}>最高可得红包{rebate.totalRebateBid}</p>
      }
      if (rebate.rebateGotUserNum) {
        getRebateEl = <p className="rebate-num">{rebate.rebateGotUserNum}人已得红包</p>
      }
    }
    return (
      <div className="action-bar">
        <div className="rebate-info">
          {rebateEl}
          {getRebateEl}
        </div>
        <div className="share-btn">
          <img alt="" src={shareIcon}/>
          <span>分享</span>
        </div>
      </div>
    )
  }
}

export default Action;