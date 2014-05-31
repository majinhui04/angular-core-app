/*
*    微信跳转过来的入口 根据code进行跳转
*/
define(function(require,exports,module){
    "use strict";

    var Utils = require('utils');
    /*require('angular');
    var utils = require('utils');

    var app = angular.module('mobile.entrance', []);

    app.controller('mobile.entrance.controller',['$scope',function($scope){
        var code = 'profile',href = location.href;

        console.log('mobile.entrance.controller')
        // 先获取用户信息

        // 根据身份和code进行相应的跳转
        switch(code){
            case 'profile':
                //location.href = '';
                break;
            default:
                //location.href = '404.html';
                break;
        };


    }]);*/
    var IGrow = window['IGrow'],dir = IGrow.dir;
    return {
        run:function(){
            location.href = dir + '/assets/views/profile/student.html';
        }
    }

        
});