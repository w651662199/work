<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<title>任务详情</title>
	<script src="/resource/scripts/discovery/zepto.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="/resource/scripts/discovery/dsbridge.js"></script>
	<link rel="stylesheet" type="text/css" href="/resource/css/discovery/mission.css" />
	<script type="text/javascript">
		var missionId = <?php echo $missionId; ?>;
	</script>
</head>
<body>
	<script src="/resource/scripts/discovery/self-adaption.js"></script>
		<article>
			<section>
				<p class="sectionVideo"></p>
			</section>
			<section>
				<p class="sectionmain"><span class="main-text"></span><span class="main-type" style="color: red;"></span><span class="main-text-l"></span></p>
			</section>
			<section>
				<div class="sectionprize">
					<span class="sectionreward">奖励</span><img src="/resource/images/danengliang.png" alt="" / class="sectionimg"><span class="sectionnumber">+</span>
				</div>
				<div class="sectioncomplete">
					<span>已完成 <span class="sectioncompletep"></span>/<span class="sectioncompleteci"></span>
					</span>
				</div>
				<a href="#">
					<div class="sectionsee"></div>
				</a>
			</section>
		</article>
		<footer>
			<p class="footerbottom"></p>
		</footer>
	</body>
	<script type="text/javascript">
		var token = dsBridge.call('getToken');
		$(function() {
			$('.sectionsee').on('click', function() {
				dsBridge.call('openMainPage');
			});
			$.ajax({
				type:"GET",
				url: $CONFIG['mdomain'] + 'api/mm/taskInfo?id=' + missionId,
				dataType: "json",
				headers: {
					'Authorization': token
				},
				success: function(res) {
					console.log(res);
					if(res.code == 200) {
						$(".sectionVideo").append(res.data.name);
						$(".footerbottom").append(res.data.desc);
						$(".sectioncompleteci").append(res.data.totalCnt);
						$(".sectioncompletep").append(res.data.completeCnt);
						var missionType=['分享', '看视频', '调研', '登录', '邀请注册', '体验小程序'];
						var rewardType = ['能量', '美钻', '奖品', '国美币'];
						var periodType = ['每日', '每周', '每月'];
						var buttonText = res.data.type == 1? '去分享' : (res.data.type == 2 ? '去看看' : '去参加');
						$(".sectionsee").text(buttonText);
						$('.main-text').text('用户完成' + res.data.totalCnt + '次' + missionType[res.data.type - 1] + '即可获得');
						$('.main-type').text(res.data.rewardAmount + rewardType[res.data.rewardType - 1]);
						$('.main-text-l').text(periodType[res.data.period - 1] + '只可参加一次该任务');
						$(".sectionnumber").append(res.data.rewardAmount);
					}
				},
				error:function(){
					console.log("请求失败...")
				}
			});
		});
	</script>
</html>