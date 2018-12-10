<head>
	<title>问卷</title>
	<link href="/resource/css/question.css" rel="stylesheet">
	<script type="text/javascript">
		var surveyId = <?php echo $survey->getSurveyId();?>;
	</script>
</head>
<body>
	<script type="text/javascript">
	(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto";doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px";document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto"}};if(!doc.addEventListener){return}var resizeEvt="orientationchange" in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);
	</script>
		<header>
			<h2 class="header-title">
				<?php echo $survey->getName();?>
			</h2>
			<p class="header-description">
				<?php echo $survey->getDescription();?>
			</p>
		</header>
		<section>
			<?php foreach($survey->getSurveyQuestions() as $question) { ?>
				<?php if($question->getIsRadio()) { ?>
				<div class="radio question" data-judge="radio">
					<h2><span data-survey-question-id="<?php echo $question->getSurveyQuestionId();?>"><?php echo $question->getSequence(); ?>.</span><?php echo $question->getName();?><em style="color: #EA5C5E;">(必答)</em></h2>
					<?php foreach($question->getSurveyQuestionOptions() as $key => $option) {?>
						<div class="formRadio"><input id="<?php echo 'linkLabel_' . $question->getSurveyQuestionId() . $key;?>" value="<?php echo $option->getSurveyQuestionOptionId(); ?>" type="radio" name="<?php echo $question->getSurveyQuestionId();?>"/><label id="label" for="<?php echo 'linkLabel_' . $question->getSurveyQuestionId() . $key;?>"><p></p><span class="radioText"><?php echo $option->getTitle();?></span></label></div>
					<?php } ?>
				</div>
				<?php } elseif($question->getIsCheckbox()) { ?>
				<div class="checkBox question" data-judge="checkBox">
					<h2><span data-survey-question-id="<?php echo $question->getSurveyQuestionId();?>"><?php echo $question->getSequence(); ?>.</span><?php echo $question->getName();?><em style="color: #EA5C5E;">(必答)</em></h2>
					<div class="content">
						<ul>
						<?php foreach($question->getSurveyQuestionOptions() as $key=>$option) {?>
						<li><input id="<?php echo 'box_' . $question->getSurveyQuestionId() . $key;?>" type="checkbox" name="<?php echo $question->getSurveyQuestionId();?>" value="<?php echo $option->getSurveyQuestionOptionId(); ?>" /><label for="<?php echo 'box_' . $question->getSurveyQuestionId() . $key;?>"><em></em><span><?php echo $option->getTitle();?></span></label></li>
						<?php } ?>
						</ul>
					</div>
				</div>
				<?php } elseif($question->getIsRating()) { ?>
				<div class="grade question" data-judge="grade">
					<h2><span data-survey-question-id="<?php echo $question->getSurveyQuestionId();?>"><?php echo $question->getSequence(); ?>.</span><?php echo $question->getName();?><em style="color: #EA5C5E;">(必答)</em></h2>
					<div class="heart">
						<ul class="clearfix">
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</div>
				</div>
				<?php } elseif($question->getIsText()) { ?>
				<div class="textBox question" data-judge="textarea">
					<h2><span data-survey-question-id="<?php echo $question->getSurveyQuestionId();?>"><?php echo $question->getSequence(); ?>.</span><?php echo $question->getName();?><em style="color: #EA5C5E;">(必答)</em></h2>
					<textarea onfocus="Event.focus(event);" onkeyup="Event.judgeSubmit();" placeholder="" id="textBox-textarea"></textarea>
				</div>
				<?php } ?>
			<?php } ?>
		</section>
		<footer>
			<a href="javascript:;" class="surveySubmit">提交</a>
		</footer>
		<div id="popup" class="none">
			<div class="content">
				<div class="top">
					<div class="top-finish">
						<p class="finish">答题完成</p>
						<p class="thank">感谢您的参与</p>
					</div>
				</div>
				<a class="bottom" href="javascript:void(0)">完成</a>
			</div>
		</div>
	</body>

	<script src="/resource/scripts/modules/share/appInterface.js" type="text/javascript" charset="utf-8"></script>
	<script src="/resource/scripts/discovery/GomeJSBridge.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/resource/scripts/common/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/resource/scripts/discovery/crypto-js.min.js"></script>
	<script src="/resource/scripts/discovery/dsbridge.js"></script>
	<script src="/resource/scripts/discovery/utils.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
		var Event = {
			init: function() {
				Event.gradeSelected();
				Event.radioChecked();
				Event.checkBoxChecked();
				Event.popupShow();
				Event.judgeSubmit();
			},
			focus: function(event) {
				var summaryHeight = event.target.offsetTop-$('body').scrollTop()+event.target.offsetHeight;
				var winHeight = $(window).height();
				if (/Android/.test(navigator.appVersion) && summaryHeight>winHeight/2) {
						$(window).resize(function(){
						    var thisHeight=$(this).height();
						    if(winHeight - thisHeight >50){
						    	$("body").css('padding-bottom',(summaryHeight-winHeight/2)/100+'rem').animate({ scrollTop: $("body").outerHeight() }, 300);
						    }else{
						    	$("body").css('padding-bottom',0).animate({ scrollTop: $("body").outerHeight() }, 300);
						    }
						});
					}
			},
			judgeSubmit: function() {
				var answers = [];
				var flag = true;
				$(".question").each(function() {
					if ($(this).attr('data-judge') == 'radio') {
						var RadioValue = $(this).find('input:checked').val();
						var surveyRadioId = $(this).find('h2 span').attr('data-survey-question-id');
						answers.push({"survey_question_id":surveyRadioId,"content":RadioValue});
					} else if ($(this).attr('data-judge') == 'checkBox') {
						var surveyCheckboxId = $(this).find('h2 span').attr('data-survey-question-id');
						var checkBoxArr = [];
						$(this).find('input:checked').each(function(){ 
							checkBoxArr.push($(this).val()); 
						});
						answers.push({"survey_question_id":surveyCheckboxId,"content":checkBoxArr.join()})
					} else if ($(this).attr('data-judge') == 'grade') {
						var grade = 0;
						var surveyGradeId = $(this).find('h2 span').attr('data-survey-question-id');
						$(this).find('.heart li').each(function(){
							if ($(this).attr('class') == 'selected') {
								grade++;
							}
						});
						answers.push({"survey_question_id":surveyGradeId,"content":grade});
					} else if ($(this).attr('data-judge') == 'textarea') {
						var surveyTextBoxId = $(this).find('h2 span').attr('data-survey-question-id');
						var surveyText = $(this).find('#textBox-textarea').val();
						answers.push({"survey_question_id":surveyTextBoxId,"content":surveyText});
					}
				});
				for(var i = 0;i<answers.length;i++) {
					if (!answers[i].content || answers[i].content == 0) {
						flag = false;
					}
				}
				if (flag) {
					$(".surveySubmit").css('background','#f20c59');
					Event.surveySubmit(answers);
				} else {
					$(".surveySubmit").css('background','#999');
					$('footer .surveySubmit').unbind("click");
				}
			},
			gradeSelected: function() {
				$(".grade .heart li").click(function(event) {
					$(this).nextAll().removeClass('selected');
					$(this).prevAll().addClass('selected');
					$(this).addClass('selected');
					Event.judgeSubmit();
					setTimeout(function() {
						Event.judgeSubmit();
					},0);
				});
			},
			radioChecked: function() {
				$(".formRadio label").click(function() {
					$(this).find('p').css("display",'block');
					$(this).find('span').addClass('checked');
					$(this).addClass('checked');
					$(this).parent('.formRadio').siblings().find('p').css('display','none');
					$(this).parent('.formRadio').siblings().find('span').removeClass('checked');
					$(this).parent('.formRadio').siblings().find('label').removeClass('checked');
					setTimeout(function() {
						Event.judgeSubmit();
					},0)
				});
			},
			checkBoxChecked: function() {
				$(".checkBox label").click(function() {
					if ($(this).find('em').hasClass('bgChecked')) {
						$(this).find('em').removeClass('bgChecked');
					} else {
						$(this).find('em').addClass('bgChecked');
					}
					setTimeout(function() {
						Event.judgeSubmit();
					},0);
				});
			},
			popupShow: function() {
				$("#popup .bottom").click(function() {
					$("#popup").addClass('none');
					if (utils.isMMBoard) {
						//美媒榜app
						dsBridge.call('investSuccess');
					} else {
						window.history.go(-1);
					}
				});
				$("#popup")[0].addEventListener('touchmove', function(e) {
					e.preventDefault();
				}, false);
			},
			surveyOldSubmit: function(answers) {
				var params = utils.commonParams();
				var tempAnswers = [];
				for (var i = 0 ; i < answers.length; i++) {
					var answer = answers[i];
					tempAnswers.push({surveyQuestionId : answer['survey_question_id'], content: answer['content']});
				}
				var paramData = {
					surveyId: surveyId,
					answers: tempAnswers,
					p: params['p'],
					q: params['q']
				};
				$.ajax({
					type: 'post',
					url: '/api/mm/surveyCommit',
					data: JSON.stringify(paramData),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': utils.token
					},
					success: function(data) {
						if (data.code == 200) {
							$("#popup").removeClass('none');
							$("#popup").find('.finish')[0].innerHTML = data.msg;
						}
					},
					error: function(data) {
						console.log(data);
						$("#popup").removeClass('none');
						$("#popup").find('.finish')[0].innerHTML = data.msg;
					}
				});
			},
			surveySubmit: function(answers) {
				$("footer .surveySubmit").unbind("click").click(function() {
					var urlParams = utils.commonParams();
					if (urlParams['p']) {
						Event.surveyOldSubmit(answers);
					} else {
						var tempAnswers = [];
						for (var i = 0 ; i < answers.length; i++) {
							var answer = answers[i];
							tempAnswers.push({surveyQuestionId : answer['survey_question_id'], content: answer['content']});
						}
						var reqData = {
							url: '/api/mm/surveyCommitV2',
							method: 'post',
							data: JSON.stringify({
								surveyId: surveyId,
								answers: tempAnswers,
								q: urlParams.q
							}),
							headers: {
								'Content-Type': 'application/json'
							},
							success: function(data) {
								if (data.code == 200) {
									$("#popup").removeClass('none');
								}
							},
							error: function(data) {
								$("#popup").removeClass('none');
								$("#popup").find('.finish')[0].innerHTML = data.msg;
							}
						};
						if (utils.isMMBoard) {
							reqData.headers.Authorization = utils.token;
						} else {
							reqData.headers.a = utils.getHeaderA();
						}
						$.ajax(reqData);
					}
				});
			},
			initQuestionView: function() {
				var params = utils.commonParams();
				if (params['p']) {
					var urlParams = utils.getUncryptParams();
					var questionRebateParams = {};
					questionRebateParams['userId'] = utils.userId;
					questionRebateParams['requestId'] = urlParams['requestId'];
					questionRebateParams['deviceId'] = utils.getDeviceIdFromAgent();
					questionRebateParams['slotId'] = urlParams['slotId'];
					questionRebateParams['slotType'] = 1;
					questionRebateParams['logParam'] = urlParams['logParam'];
					questionRebateParams['flightJobId'] = urlParams['flightJobId'];
					$.ajax({
						url: $CONFIG['questionViewUrl'],
						type: 'get',
						data: questionRebateParams,
						dataType: 'jsonp',
						success: function(result) {
							console.log("questionRebate");
						}
					});
				} else {
					var reqData = {
						url: '/api/mm/sv?q=' + params.q,
						type: 'get'
					};
					if (utils.isGome) {
						reqData.headers = {
							a: utils.getHeaderA()
						};
					} else if (utils.isMMBoard) {
						reqData.headers = {
							'Authorization': utils.token
						};
					}
					$.ajax(reqData);
				}
			}
		};
		utils.getUserId();
		Event.init();
		$(function(){
			Event.initQuestionView();
		});
	</script>
</html>
