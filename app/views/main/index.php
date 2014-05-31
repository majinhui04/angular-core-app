<!doctype html>
<html>
<head>
<meta charset="UTF-8">
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta http-equiv="Pragma" content="no-cache" />  
  <meta http-equiv="Cache-Control" content="no-cache" />
  <meta http-equiv="Cache-Control" content="max-age=0"/> 
  <meta http-equiv="Expires" content="0" />
  <link rel="stylesheet" type="text/css" href="http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/assets/css/public/common.css">
  <link rel="stylesheet" type="text/css" href="/assets/css/main/main.css">
</head>
<body ng-controller="mainController">
    <div class="navbar navbar-inverse navbar-fixed-top ng-cloak" ng-show="flag">
      <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          <a class="navbar-brand hidden-sm" href="/">IGrow微信端</a>
          </div>
          <div class="navbar-collapse collapse">
              <ul class="nav navbar-nav">
                  <li><a href="/main">首页</a></li>
                  <li class="dropdown"> <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">家校联系<b class="caret"></b></a>
   
                      <ul class="dropdown-menu">
                          <li class=""> <a href="/#notice" target="_blank">校园通知(可测1)</a></li>
                          <li class=""> <a href="javascript:void(0)" target="_blank">家校私信</a></li>
                          <li class=""> <a href="javascript:void(0)" target="_blank">家校圈</a></li>
                          <li class=""> <a href="#/student/schoolday" target="_blank">请假考勤(可测)</a></li>
                          <li class=""> <a href="#/student/homework" target="_blank">作业辅助(可测)</a></li>
                      </ul>
                  </li>
                  <li class="dropdown"> <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">成长记录<b class="caret"></b></a>
   
                      <ul class="dropdown-menu">
                          <li> <a href="#/student/news" target="_blank">日常表现(可测)</a></li>
                          <li> <a href="#/student/score" target="_blank">成绩表彰(可测)</a></li>
                          <li> <a href="javascript:void(0)" target="_blank">班级风采</a></li>
                          <li> <a href="javascript:void(0)" target="_blank">成长档案</a></li>
                      </ul>
                  </li>
                  <li class="dropdown"> <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">个人中心<b class="caret"></b></a>
   
                      <ul class="dropdown-menu">
                          <li> <a href="#/student/profile" target="_blank">我的资料(可测)</a></li>
                          <li> <a href="/#/class" target="_blank">我的班级(可测1)</a></li>
                          <li> <a href="javascript:void(0)" target="_blank">我的学校</a></li>
                      </ul>
                  </li>
              </ul>
          </div>
      </div>
  </div>
  <div data-ng-view data-ng-cloak id="view" ></div>
  <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/jquery/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular.min.js"></script>
  <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular-sanitize.js"></script>
  <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/seajs/2.0.0/sea.js"></script>
  <script type="text/javascript" src="/assets/js/public/WeixinApi.js"></script>
  <script type="text/javascript" src="/assets/js/config/seajs-config.js"></script>

  <script>
      
    seajs.use(['mainApp'], function(app){
      angular.bootstrap(document, [app.name]);
    });
  </script>
</body>
</html>
