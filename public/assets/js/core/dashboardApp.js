define(function(require, exports, module) {
    var Utils = require('utils');
    var BOSS = window['Boss'];
    require('angular-route');
    require('angular-lazyload');
    require('angular-core');
    
    var app = angular.module('mainApp', ['ngRoute','angular-lazyload', 'angular-core']);

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

     */
    app.controller('dashboardCtrl',['$scope','$q','$route','$timeout','routeConfig','resource', 'mLoading','mNotice','$routeParams',function($scope,$q,$route,$timeout,routeConfig,resource,mLoading,mNotice,$routeParams){
        var userDao = resource('/user');

        userDao.get({},function(result){
            var user = result.data || {};

            $scope.user = BOSS.user = user;
            initRouteConifg();
      

        },function(){

        },function(){

        });
        console.log('init dashboardController')

   

        function initRouteConifg(){
            // 配置路由
            routeConfig();
            location.hash = '#/dashboard';
            $route.reload();
        }

    }]);

    //运行期
    app.run(['$lazyload','$rootScope', '$window', '$location', '$log', function($lazyload,$rootScope, $window, $location, $log) {
        //Step5: init lazyload & hold refs
            $lazyload.init(app);
            app.register = $lazyload.register;
            var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);  
            var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);  
          
            var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);  
            var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);  
          
            function locationChangeStart(event) {  
                //$log.log('locationChangeStart');  
                //$log.log(arguments);  
            }  
          
            function locationChangeSuccess(event) {  
                //$log.log('locationChangeSuccess');  
                //$log.log(arguments); 
                hashChange(location.hash);
            }  
          
            function routeChangeStart(event) {  
                //$log.log('routeChangeStart');  
                //$log.log(arguments);  
            }  
          
            function routeChangeSuccess(event) {  
                //$log.log('routeChangeSuccess');  
                //$log.log(arguments); 

                //$log.log(11111111111111,$location.hash(),location.hash) 
                
            }  



            function hashChange(hash) {
                var hash = hash || '',
                    $target = $('.dashboard-sidebar').find('[href="'+hash+'"]'),
                    title = $target.attr('data-title') || '',
                    $submenu = $target.closest('.sub-menu');

                if(!$target.length) {
                    return;
                }
                $('.sidebar-menu li,.sidebar-menu a ').removeClass('active');
                $('.sidebar-menu [data-role="selected"]').removeClass('selected');
                $('.dashboard-breadcrumb .current').text(title);
                if($submenu.length){
                    $target.addClass('active');
                    $submenu.closest('li').addClass('active');
                    $submenu.closest('li').find('[data-role="selected"]').addClass('selected');
                }else {
                    $target.closest('li').addClass('active');
                }
            }


        }
    ]);

    module.exports = app;
});