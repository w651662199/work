import React, {Component} from 'react';

import EventEmitter from '../../utils/EventEmeitter.js';

import shareIcon from '../../assets/img/rebate_share_icon.png';
import surveyIcon from '../../assets/img/rebate_survey_icon.png';
import videoIcon from '../../assets/img/rebate_video_icon.png';

import './rebateModal.scss';

class RebateModal extends Component {
	constructor(props) {
    super(props);
    this.state = {};
  }

  hideRebateModal() {
    EventEmitter.emit('hideRebateModal');
  }

  render() {
    let rebate = this.props.sharePraiseNum;
    let share = '', survey = '', watch = '';
    if (rebate && rebate.rebateStatus === '1') {
      if (rebate.shareRebateBid > 0) {
        share = (
          <div className="rebate-item">
            <img className="img-icon" alt="" src={shareIcon}/>分享得红包{rebate.shareRebateBid}
          </div>
        )
      }
      if (rebate.researchRebateBid > 0) {
        survey = (
          <div className="rebate-item">
            <img className="img-icon" alt="" src={surveyIcon}/>答问卷得红包{rebate.researchRebateBid}
          </div>
        )
      }
      if (rebate.watchRebateBid > 0) {
        watch = (
          <div className="rebate-item">
            <img className="img-icon" alt="" src={videoIcon}/>看视频得红包{rebate.watchRebateBid}
          </div>
        )
      }
    }
    return (
      <div className="modal-box">
        <div className="modal-content">
          <em className="close-icon" onClick={this.hideRebateModal}></em>
          {share}
          {watch}
          {survey}
        </div>
      </div>
    );
  }
}

export default RebateModal;