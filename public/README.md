angular-mobile-igrow
====================

igrow微信客户端 


## 前端 [angualr + seajs +  bootstrap + jquery] ##

### 文件目录 ###

	assets/					--> all of the files to be used in production
		js/					--> all of js
            config/         --> 全局配置的js
            core/           --> 核心的js
			modules/        --> 各个模块的js
			public/         --> 公共的js
			directives/     --> 指令集合
			services/       --> 服务集合
			
		css/
			main/
                    main.css        --> 所有页面的样式
			public/
                    common.css      --> 所有页面公用的样式
                    
		
		views/              --> 所有视图
			tpl/            --> 模板
			modules/        --> 模块视图
					
		img/
			public/
			icon/
			sprites/
            student/       --> 学生模块相关的图片
            ...

### 关于ajax请求 ###

    基于angular $http 自定义http服务,再基于http 使用自定义resouce
    
            *   @param url --> string ajax路径 
            *           假设完整路径 'http://m.igrow.cn/api/1.1b/school/people/get'  则url为'/school/people'
            *   @param options --> object 暂时没用
            *   @param actions --> object example :{ 'get2': { method:'GET',params:{ '默认参数1':'','默认参数2':'' } } }
            *
            *  默认返回的对象包含的方法:get,update,create,list,search,_delete   
            *  调用example
            *  var schoolPeople = resource('/school/people');
            *  schoolPeople.get({id:'1'}).then(function(result){
            *      console.log('返回的数据',result.data) ;
            *  },
            *  function(result){
            *      console.log( '错误信息',result.message );
            *  });
            *  // or
            *  schoolPeople.get({id:'1'}, 
            *    function(result){console.log('成功回调 返回数据：',result.data)},
            *    function(result){console.log('失败回调 错误消息：',result.message)},
            *    function(){alert(无论成功失败我必执行) }
            *  );
     

### 通用服务 [angular-core]###
    
    require('angular-core');
    var app = angular.module('myApp',['angular-core'])
    1. loading显示
        mLoading.show('提示语');
        mLoading.hide();
    2. 消息提示
        mNotice('提示语',type，timeout) // type: 'info' or 'success' ; timeout:消失时间,默认3000
    3. confirm和alert（未完成）

## 单页demo ##
    
### step1: 配置文件 path:'/assets/js/config/seajs-config.js' ###
    // 这里加入自己的模块
    window['IGrow'] = {
        modules:[
            {
            // 唯一的id 
            code:'student_profile',
            // 模块里设置的名称 angular.module(name,[])
            name:'studentProfileApp',
            // 模块的标题
            title:'学生个人信息',
            // 模块js的路径
            path:'modules/student/studentProfileApp.js',
            // 模块对应的页面
            view:'modules/student/profile.html',
            // 依赖 暂未无用 可直接填写空数组
            dependency:['bootstrap']
            },
            ...
       ]
    }



### step2 编写静态页面  ###

    业务css写在 main.css ,path:'/assets/css/main/main.css'

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="format-detection" content="telephone=no" />
        <title>密码修改</title>
        <link rel="stylesheet" type="text/css" href="/assets/css/public/common.css">
        <link rel="stylesheet" type="text/css" href="/assets/css/main/main.css">
        <script type="text/javascript" src="http://assets.haoyuyuan.com/vendor/libs/seajs/2.0.0/sea.js"></script>
        <script type="text/javascript" src="/assets/js/config/seajs-config.js"></script>
    </head>
    <body>
        <div class="user-password-wrapper" ng-controller="userPasswordController" >
           <!-- 自己的布局 -- >
            
        </div>
       
        <script type="text/javascript">
            // 加载自己的业务js 
            seajs.use(['userPasswordApp'],function(app){
               angular.bootstrap(document.documentElement,[app.name]);
            });
    
        </script>
    
    </body>
    </html>
    
### step3 编写业务js ###
    // 参考js path:'/assets/js/modules/user/userPasswordApp.js'

    define(function(require, exports, module) {
        // angularCoreApp 提供 'mLoading','mNotice','resource' 等通用服务
        var angularCoreApp = require('angular-core');
        var app = angular.module('userPasswordApp', ['angular-core']);
    
        // 业务
        app.controller('userPasswordController', ['$scope', '$q', 'mLoading','mNotice','resource',
            function($scope, $q, mLoading,mNotice,resource) {
              
                $scope.save = function(){
                    var formData = $scope.formData || {},
                        userPasswordDao = resource('/user/password');
                    
                    
                    mLoading.show('正在处理');
  
                    userPasswordDao.update( formData ).then(function(result){
                        mLoading.hide();
                        mNotice('密码修改成功,请重新登录','success');
                        setTimeout(function() {
                            location.href = 'http://auth.igrow.cn/logout?go=http://m.igrow.cn/';
                        }, 2000);
    
                    }, function(result){
                        mLoading.hide();
                        mNotice(result.message,'error');
    
                    });
    
                };
            
               
    
            }
        ]);
    
        // important 这里要返回 app
        return app;
    });