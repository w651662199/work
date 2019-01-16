import {obj2string} from './common.js';
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

export const scrollBarWidth =  () => {
    var oP = document.createElement('p'),
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'
        }, i, scrollbarWidth;
    for (i in styles) oP.style[i] = styles[i];
    document.body.appendChild(oP);
    scrollbarWidth = oP.offsetWidth - oP.clientWidth;
    oP.remove();
    return scrollbarWidth;
};

export const getFixedTableHeader = (el) => {
  var table = el.getElementsByClassName('main-table')[0].cloneNode(true);
  var tableBody = table.getElementsByTagName('tbody')[0];
  tableBody.remove();
  var headerWapper = document.createElement('div');
  headerWapper.className = 'fixed-head-wapper';
  headerWapper.style = 'display:none;position: fixed;top: 0;right: 40px;width: 100%;overflow: hidden;';
  headerWapper.appendChild(table);
  return headerWapper;
};

export const scrollHandler = () => {
  var el = document.getElementsByClassName('data-table')[0];
  var scrollBW = scrollBarWidth();
  var windowWidth = window.outerWidth;
  var leftNavWidth = document.getElementsByClassName('content-menu')[0].clientWidth;
  var wapperWidth = el.clientWidth - scrollBW;
  if ((el.clientWidth + leftNavWidth) > windowWidth) {
    wapperWidth = wapperWidth - leftNavWidth;
  }
  var fixColumnWapper = el.getElementsByClassName('fixed-columns')[0];
  var headWapper = el.getElementsByClassName('fixed-head-wapper')[0];
  var table = el.getElementsByClassName('main-table')[0];
  var tableWapper = el.getElementsByClassName('main-table-wapper')[0];
  var scrollWapper = el.getElementsByClassName('table-scroll-wapper')[0];
  var scrollBarContent = el.getElementsByClassName('table-scroll-content')[0];
  headWapper.style.width = wapperWidth + 'px';
  console.log(table.clientWidth + '----' + windowWidth);
  if ((table.clientWidth + 220) > windowWidth) {
    scrollWapper.style.width = wapperWidth + 'px';
    scrollBarContent.style.width = table.clientWidth + 'px';
    on(scrollWapper, 'scroll', e => {
      var scrollLeft = e.target.scrollLeft;
      headWapper.scrollLeft = e.target.scrollLeft;
      tableWapper.scrollLeft = e.target.scrollLeft;
    });
    var fixColumnTh = fixColumnWapper.getElementsByTagName('th');
    var tableColumnTh = table.getElementsByTagName('th');
    for (var i = 0; i < tableColumnTh.length;i++) {
      fixColumnTh[i].style.width = tableColumnTh[i].clientWidth + 'px';
    }
    fixColumnWapper.style.width = (tableColumnTh[0].clientWidth + tableColumnTh[1].clientWidth) + 'px';
  } else {
    scrollWapper.style.display = 'none';
    fixColumnWapper.style.display = 'none';
  }
};

export const domCreator = (ele, styles, attr) => {
    var _element = document.createElement(ele), _style = '';
    if (styles) _style = obj2string(styles).replace('{', '').replace('}', '').replace(/,/g, ';').replace(/"/g, '');
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        _element.style.cssText = _style;
    } else {
        _element.setAttribute("style", _style);
    }
    for (var key in attr) {
        _element.setAttribute(key, attr[key]);
    }
    _style = null; attr = null;
    return _element;
};

export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};