/*
 *   学生家长
 *   
 */
define(function(require, exports, module) {
    var Utils = require('utils');
    var app = require('mainApp');


    app.register.controller('studentParentController', ['$scope', '$q', 'mLoading','mNotice','resource','$routeParams',
        function($scope, $q, mLoading,mNotice,resource,$routeParams) {
            var userProfileDao = resource('/user/profile'),
                userProfileFieldDao = resource('/user/profile/field'),
                hash = location.hash,
                parentType = hash.indexOf('father')>-1?'father':'mother',
                failCallback = function(result) {
                    mLoading.hide();
                    console.warn(result);
                };

            console.log(window['IGrow'])
            $scope.save = function(){
                var formData = $scope.formData || {};

                if( !validate(formData) ){
                    return;
                }
                mLoading.show('正在处理');
                // 先获取信息
                userProfileDao.get().then(function(result){
                    var profiles = angular.isObject(result.data)?result.data : {},parent,data;

                    parent = angular.isObject(profiles[parentType])?profiles[parentType] : {};
                    data = jQuery.extend(true,{},parent,formData);
                    update(data);

                }, function(result){
                    if(result.status == 404){
                        update(formData);
                    }else{
                        failCallback(result);
                    }
                });
                // postData {fieldname:'mother',fieldvalue:{} }
                function update(data){
                    var postData = {
                        fieldname:parentType
                    };
                    postData.fieldvalue = JSON.stringify(data);
                    userProfileFieldDao.update(postData).then(function(){
                        //mNotice('保存成功','success');
                        mLoading.hide();
                        location.hash = '#/student/profile';

                    }, function(result){
                        mNotice(result.message);
                        mLoading.hide();
                        
                    });
                }

            };
            function run(){
                mLoading.show('正在加载...');
                // 获取用户信息
                userProfileDao.get().then(function(result){
                    var data = result.data || {}, profiles = angular.isObject(data.profiles)?data.profiles : {};

                    $scope.formData = angular.isObject(profiles[parentType])?profiles[parentType] : {};
                    
                    mLoading.hide();

                }, function(result){
                    if(result.status == 404){
                        mLoading.hide();
                    }else{
                        failCallback(result);
                    }
                });
            }

            function validate(data){
                if(!data.name){
                    mNotice('姓名必填','warning');
                    return false;
                }

                if( data.mobile && !( /^1[3|4|5|8][0-9]\d{4,8}$/.test(data.mobile) ) ){
                    mNotice('手机格式不对','warning');
                    return false;
                }
                
                return true;
            }
            // 初始化scope的数据
            function initScopeData() {
    
                $scope.formData = {
                    name:'',
                    mobile:'',
                    weixin:''
                };

            }
            

            initScopeData();
            run();


        }
    ]);


    return app;
});