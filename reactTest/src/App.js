import React, { Component } from 'react';

import Config from './utils/config.js';
import {urlEncode} from './utils/index.js';
import EventEmitter from './utils/EventEmeitter.js';

import Tab from './components/tab/tab.js';
import ListItem from './components/listItem/index.js';
import RebateModal from './components/rebateModal/rebateModal.js';
import './list.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      type: 1,
      isLoading: false,
      rebateItem: {},
      isShowRebateModal: false
    }
  }

  render() {
    let rbModal = '';
    if (this.state.isShowRebateModal) {
      rbModal = <RebateModal sharePraiseNum={this.state.rebateItem}/>
    }
    return (
      <>
        <Tab/>
        <div className="main" id="J_list">
          <div className="list-box">
            {this.state.list.map((item) =>
              <ListItem key={item.contentObject.adId} item={item}/>
            )}
          </div>
        </div>
        {rbModal}
      </>
    );
  }

  addGlobalEvent() {
    EventEmitter.on('showRebateModal', (rebate) => {
      this.setState({
        isShowRebateModal: true,
        rebateItem: rebate
      });
    });
    EventEmitter.on('hideRebateModal', () => {
      this.setState({
        isShowRebateModal: false,
        rebateItem: {}
      });
    });
    EventEmitter.on('reloadList', (type) => {
      this.setState({
        type: type
      });
      this.getList(1, type);
    });
  }

  getList(action, type) {
    let that = this;
    if (that.state.isLoading) return;
    that.setState({
      isLoading: true
    });
    let url = Config.domain + '/api/mm/recommend?';
    let param = {
      ac: action ? action : 1,
      k: type ? type : that.state.type,
      p: 3
    };
    url = url + urlEncode(param).slice(1);
    fetch(url, {method: 'get'}).then((res) => {
      return res.json();
    }).then((res) => {
      if (res.code === 200 && res.data) {
        let list = this.state.list;
        if (action === 2) {
          list = list.concat(res.data);
        } else {
          list = res.data
        }
        that.setState({
          isLoading: false,
          list: list
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  initLoadMore() {
    let listCon = document.querySelector('#J_list');
    let screenHeight = document.body.clientHeight;
    listCon.addEventListener('scroll', (e) => {
      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      if ((scrollTop + screenHeight) >= (scrollHeight - 50)) {
        this.getList(2);
      }
    })
  }

  initRefresh() {
    let that = this;
    let listCon = document.querySelector('#J_list');
    let startY, endY, sub;
    listCon.addEventListener('touchstart', (e) => {
      if (e.targetTouches.length === 1) {
        let touch = e.targetTouches[0];
        startY = touch.pageY;
      }
    });
    listCon.addEventListener('touchmove', (e) => {
      if (e.targetTouches.length === 1) {
        let touch = e.targetTouches[0];
        let y = touch.pageY;
        if (y > startY && listCon.scrollTop === 0) {
          e.preventDefault();
          sub = Math.floor((y - startY) * 0.4);
          listCon.style.transform = 'translateY(' + sub + 'px)';
        }
      }
    });
    listCon.addEventListener('touchend', (e) => {
      if (listCon.scrollTop === 0 && sub > 0) {
        listCon.className = listCon.className + ' trans-animate';
        listCon.style.transform = 'translateY(0px)';
        that.getList();
        setTimeout(function() {
          listCon.className = listCon.className.replace(' trans-animate', '');
        }, 500);
      }
    })
  }

  componentDidMount() {
    this.addGlobalEvent();
    this.getList();
    this.initLoadMore();
    this.initRefresh();
  }
}

export default App;
