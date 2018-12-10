(function(win) {
    var doc = win.document,
        html = doc.documentElement,
        option = html.getAttribute("data-use-rem");
    if(option === null) {
        return
    }
    var baseWidth = parseInt(option).toString() === "NaN" ? 640 : parseInt(option);
    var grids = baseWidth / 100;
    var clientWidth = html.clientWidth || 320;
    var fontsize = html.style.fontSize = clientWidth / grids + "px";
    fontsize = parseFloat(fontsize);
    var maxFontsize = Math.ceil(fontsize);
    var minFontsize = Math.floor(fontsize);
    var testDom = document.createElement("div");
    var testDomWidth = 0;
    var adjustRatio = 0;
    testDom.style.cssText = "height:0;width:1rem;";
    doc.body.appendChild(testDom);
    var calcTestDom = function() {
        testDomWidth = testDom.offsetWidth;
        if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)) {
            if(testDomWidth < minFontsize || testDomWidth > maxFontsize) {
                adjustRatio = clientWidth / grids / testDomWidth;
                var reCalcRem = clientWidth * adjustRatio / grids;
                html.style.fontSize = reCalcRem + "px"
            } else {
                doc.body.removeChild(testDom)
            }
        } else {
            html.style.fontSize = "50px";
            document.body.style.width = "375px";
            document.body.style.margin = "0 auto";
            doc.body.removeChild(testDom)
        }
    };
    setTimeout(calcTestDom, 20);
    var reCalc = function() {
        var newCW = html.clientWidth;
        if(newCW === clientWidth) {
            return
        }
        clientWidth = newCW;
        if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)) {
            html.style.fontSize = newCW * (adjustRatio ? adjustRatio : 1) / grids + "px"
        } else {
            html.style.fontSize = "50px";
            document.body.style.width = "375px";
            document.body.style.margin = "0 auto"
        }
    };
    if(!doc.addEventListener) {
        return
    }
    var resizeEvt = "orientationchange" in win ? "orientationchange" : "resize";
    win.addEventListener(resizeEvt, reCalc, false);
    doc.addEventListener("DOMContentLoaded", reCalc, false)
})(window);