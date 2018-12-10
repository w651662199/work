// uploadVideo();
import Event from 'event';
window.webpageUploadVideoIndex = 0;
window.isWebpage5 = false;
window.uploadVideo = () => {
	let flashContent = document.getElementById('flashContent');
	let swfVersionStr = "11.4.0";
	let xiSwfUrlStr = "expressInstall.swf";
	var flashvars = {
		// env : "dev",
		// appname : "h5",
		// user_id : "1",
		// description : "测试数据",
		// tag : "视频,新闻,体育"
		icon : 'https://mevent.meixincdn.com/common/image/T1O2xvBTLv1RCvBVdK.png'
	};
	var params = {};
	params.quality = "high";
	params.bgcolor = "#fff";
	params.allowscriptaccess = "always";
	params.allowfullscreen = "true";
	var attributes = {};
	attributes.id = "video-upload";
	attributes.name = "video-upload";
	attributes.align = "middle";
	attributes.bgcolor="#fff";
	swfobject.embedSWF(
		"https://js.meixincdn.com/gvs-player/dist/utils/video-upload.swf?t=" + new Date().getTime(),
		"flashContent",
		"120", "40",
		swfVersionStr, xiSwfUrlStr,
		flashvars, params, attributes);
	swfobject.createCSS(flashContent, "display:block;text-align:left;");
};
window.uploadInited = () => {};
//打开文件选择器
window.fileBrowse = () => {
	ajax({
		type:"get",
		url:"api/video/token",
		dataType:"json",
		data:{},
		success:function(msg){
			thisFlash("video-upload").setData({
				env: msg.data.env,
				appname: msg.data.appname,
				token: msg.data.token,
				is_published: 1,
				user_id: "11",
				description: "",
				tag: ""
			});
		},
		error:function(){
			console.log("error")
		}
	})
}
//准备上传
window.uploadPreparing = () => {
	console.log('准备上传');
	if (window.isWebpage5) {
		Event.$emit('preparingUploadVideo', {index: window.webpageUploadVideoIndex});
	} else {
		var tip = document.getElementById('videoIdsTip');
		tip.innerHTML='正在上传，请等待！';
	}
};
//上传视频开始
window.startUpload = (data) => {
	console.log('start');
	if (window.isWebpage5) {
		Event.$emit('startUploadVideo', {videoName: data.title, index: window.webpageUploadVideoIndex});
	}else {
		Event.$emit('startUploadVideo', {videoName: data.title});
	}
};

//上传视频进度
window.progress = (data) => {
	var cProgress = Math.round(data.bytesLoaded / data.bytesTotal * 100);
	console.log('procecss');
	if (window.isWebpage5) {
		Event.$emit('uploadVideoProgress', {progress: cProgress, index: window.webpageUploadVideoIndex});
	} else {
		Event.$emit('uploadVideoProgress', {progress: cProgress});
	}

};

//上传视频结束
window.uploadComplete = (data) => {
	if (window.isWebpage5) {
		Event.$emit('uploadVideoSuccess', {index: window.webpageUploadVideoIndex, videoId: data.videoId});
	} else {
		Event.$emit('uploadVideoSuccess', {videoId: data.videoId});
	}
};
window.error = (data) => {
	if (window.isWebpage5) {
		Event.$emit('uploadVideoFail', {index: window.webpageUploadVideoIndex});
	} else {
		Event.$emit('uploadVideoFail');
	}
};
window.thisFlash = (flashName) => {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		console.log(window[flashName]);
		return window[flashName];
	} else {
		return document[flashName];
	}
}

window.ajax = (data) => {
	var ajaxData = {
		type:data.type || "GET",
		url:data.url || "",
		async:data.async || "true",
		data:data.data || null,
		dataType:data.dataType || "text",
		contentType:data.contentType || "application/x-www-form-urlencoded",
		beforeSend:data.beforeSend || function(){},
		success:data.success || function(){},
		error:data.error || function(){}
	}
	ajaxData.beforeSend()
	var xhr = createxmlHttpRequest();
	xhr.responseType = ajaxData.dataType;
	xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
	xhr.setRequestHeader("Content-Type",ajaxData.contentType);
	xhr.send(convertData(ajaxData.data));
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				ajaxData.success(xhr.response)
			}else{
				ajaxData.error()
			}
		}
	}
}

window.createxmlHttpRequest = () => {
	if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
}

window.convertData = (data) => {
	if( typeof data === 'object' ){
		var convertResult = "" ;
		for(var c in data){
			convertResult+= c + "=" + data[c] + "&";
		}
		convertResult=convertResult.substring(0,convertResult.length-1)
		return convertResult;
	}else{
		return data;
	}
}
