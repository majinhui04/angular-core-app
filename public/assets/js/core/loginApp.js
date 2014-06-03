define(function(require, exports, module) {

    require('angular-core');


    var app = angular.module('loginApp', ['angular-core']);

    app.controller('loginCtrl',['$scope','resource', 'mLoading',function($scope,resource,mLoading){
        var userDao = resource('/user',{}, { login:{ method:'POST' } } );
        
        $scope.login = function(){
            var  formData = $scope.formData || {};

            console.log(formData,userDao);
            mLoading.show('正在验证...');
            if(formData.email && formData.password) {
                userDao.login({ user_name:formData.email,password:formData.password },function(result){
                    location.href = '/dashboard/index.html';
                },function(result){
                    alert('用户名或者密码不对');
                },function(){
                    mLoading.hide();
                });
            }

        };
 
        
    }]);

    return app;

});