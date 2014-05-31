define(function(require, exports, module) {
    var Utils = require('utils');
    require('angular-route');
    require('angular-lazyload');
    require('angular-core');
    require('angular-touch');

    
    var app = angular.module('mainApp', ['ngRoute','ngTouch','angular-lazyload', 'angular-core']);

    //配置期
    app.config(['$routeProvider',
        function($routeProvider) {
            //Step4: add `controllerUrl` to your route item config

            /*$routeProvider.when('/main', {
                title:'入口',
                controller: function($scope, $routeParams, $location) {
                    $scope.str = new Date()
                    //console.log($routeParams,$location)
                },
                template: '<div>{{str}}</div>'
            })
            .otherwise({
                redirectTo: '/main'
            });*/

           
        }
    ]);
    /*
        获取用户信息
        获取当前学期
        获取当前学生或者老师

     */
    // 入口
    app.controller('mainController',['$scope','$q','$route','$timeout','routeConfig','resource', 'mLoading','mNotice','$routeParams',function($scope,$q,$route,$timeout,routeConfig,resource,mLoading,mNotice,$routeParams){
        var userDao = resource('/user'),
            semesterDao = resource('/school/semester'),
            IGrow = window['IGrow'] || {},
            hash = location.hash || '',
            index,
            semesterPromise,
            userPromise,
            errors = 0,
            failCallback = function(result){
                errors++;
                if(result && result.message){
                    mNotice(result.message,'error');
                }
                $('.hello-everyone').html('sorry,进入失败');
            };
        
        
        $('body').append('<div class="hello-everyone" style="text-align:center;padding:15px;">正在进入...</div>');
        // iphone下传过来的hash会影响路由
        index = hash.indexOf('%23wechat_redirect');
        if(index>-1){
            location.hash = hash.substring(0,index);
        }
        index = hash.indexOf('#/wechat_redirect');
        if(index>-1){
            location.hash = hash.substring(0,index);
        }

        // 假如是未登录跳转过来的
        var hashValue = Utils.getQuery('hash');
        if(hashValue) {
            location.href = 'http://m.igrow.cn/main#/'+hashValue;
            return;
        }


        // 获取当前学期
        semesterPromise = semesterDao.list({},function(result){
            var semesterList = result.data || [];

            IGrow.semester = IGrow.getCurrentSemester(semesterList); 
            if(!IGrow.semester){
                mNotice('当前学期不存在','error');
                errors ++;
            }
            

        },function(result){
            failCallback(result);
        });
        // 获取当前用户
        userPromise = userDao.get({},function(result){
            var user = result.data || {};

            IGrow.user = user;
            

        },function(result){
            failCallback(result);
        });

        $q.all( [semesterPromise,userPromise] ).then(function(){
            var studentDao,teacherDao;
            
            if(errors>0){
                failCallback();
                return;
            }
            // 若是学生
            if(IGrow.user.typeid == 4) {
                studentDao = resource('/school/student');
                studentDao.get( { _relatedfields : 'grade.id,grade.name' } ).then(function(result){
                    var student = result.data || {};

                    IGrow.student = student;
                    initRouteConifg();

                }, function(result){
                    failCallback(result);
                });

            } else {
                teacherDao = resource('/school/teacher');
                teacherDao.get( { _relatedfields:'classes' } ).then(function(result){
                    var teacher = result.data || {};

                    IGrow.teacher = teacher;
                    initRouteConifg();

                }, function(result){
                    failCallback(result);
                });
            }
                
                

        }, function(){
            
        });


        function initRouteConifg(){

        
            // 假如没有路由 则显现完整菜单
            if(!location.hash){
                $scope.flag = true;
            }
            
            $('.hello-everyone').remove();
            // 配置路由
            routeConfig();
            $route.reload();
        }
            
       
        
    }]);

    //运行期
    app.run(['$lazyload', function($lazyload) {
            //Step5: init lazyload & hold refs
            $lazyload.init(app);
            app.register = $lazyload.register;

        }
    ]);

    module.exports = app;
});