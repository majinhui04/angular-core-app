/*
 *   学生个人资料
 *   student.profile = {
 *       birthday:'1990-12-12',
 *       father:{
 *           name:'',
 *           mobile:'',
 *           weixin:''
 *       },
 *       mother:{
 *       }
 *   }
 *   自己访问方式 /main#student/profile
 *   他人访问方式 /main#/:uid/student/profile
 */
define(function(require, exports, module) {
    var Utils = require('utils');
    var app = require('mainApp');

    app.register.controller('studentProfileController', ['$scope', '$q', 'mLoading','mNotice','resource','$routeParams',
        function($scope, $q, mLoading,mNotice,resource,$routeParams) {
            var userDao = resource('/user'),
                studentDao =  resource('/school/student'),
                userProfileDao = resource('/user/profile'),
                classDao = resource('/school/class'),
                albumDao = resource('/yo/useralbum'),
                IGrow = window['IGrow'],
                noCover = IGrow['constant']['noCover'],
                noAvatar = IGrow['constant']['noAvatar'],
                user = IGrow.user || {},
                uid = $routeParams.uid || user.uid,
                failCallback = function(result) {
                    mLoading.hide();
                    mNotice(result.message,'error');
                    console.warn(result)
                };


            if($routeParams.uid){
                $scope.isOwner = (user.uid == $routeParams.uid)?true:false;
            }else{
                $scope.isOwner = true;
            }
     
            //mNotice(22222222,'error',90000)
            $scope.updateSex = updateSex;
            $scope.updateBirth = updateBirth;
            // 修改性别视图
            $scope.toSexEditView = function(){
                var student = $scope.student;
                
                $scope.sexFormData = jQuery.extend({},{sex:student.sex});
            };
            // 修改生日视图
            $scope.toBirthEditView = function(){
                var birthday = $scope.student.profile.birthday || '',
                    arr = birthday.split('-'),
                    _birthday = {};
                
                if(arr.length === 3){
                    angular.forEach(arr, function(value,i){
                        if(i === 0){
                            _birthday.year = value;
                        }else if(i === 1){
                            _birthday.month = value;
                        }else{
                            _birthday.day = value;
                        }
                         
                    });
                    $scope.birthFormData = jQuery.extend({},_birthday);
                    
                }else{
                    $scope.birthFormData = {};
                }
                console.log($scope.birthFormData)
                
            };
   
            function run(){
                mLoading.show('正在加载...');
                // 获取用户信息
                userDao.get({uid:uid ,_relatedfields: 'school.student.*,profile.profiles'}).then(function(result){
                    var user = result.data || {},student = user.school.student || {},profile,father,mother,parents = [];

                    // 若不是学生或者家长
                    if(user.typeid < 4){
                        failCallback({message:'用户不是学生'});
                        return;
                    }
                    student.avatar = user.avatar?Utils.addPhotoSuffix(user.avatar,'!72'):noAvatar;
    
                    profile = angular.isObject(user.profile)?user.profile : {};
                    father = angular.isObject(profile.father)?profile.father : {};
                    mother = angular.isObject(profile.mother)?profile.mother : {};
                    student.profile = profile;

                    student._fatherName = father.name || '';
                    student._motherName = mother.name || '';
                    parents.push(student._fatherName,student._motherName);
                    student._parents = parents.join('  ');
                    $scope.student = student;
                    // 获取学生所在班级
                    var promiseClass = classDao.get({id:student.classid},function(result){
                        var _class = result.data || {};

                        student._className = _class.name || '';
                       
                    });
                    // 获取学生相册
                    var promiseAlubm = albumDao.list({uid:student.uid},function(result){
                        var albumList = result.data || [],album,count = 0,_album = [];
                        //限制显示2个相册
                        while( (album = albumList.shift() ) && album && count<2) {
                            album.url = album.url? ( album.url + '!square.75' ):noCover;
                            _album.push(album);
                            count++;
                        }
                        student._album = _album;
                    });
         
                    $q.all([promiseClass,promiseAlubm]).then(function(){
                        mLoading.hide();
                        $scope.loaded = true;


                    }, failCallback);


                }, function(result){
                    $scope.student = {};
                    $scope.student._album = [];
                    failCallback(result);
                });
            }
            // 初始化scope的数据
            function initScopeData() {
                var year = new Date().getFullYear();
                
                $scope.sexList = [{id:0,name:'未知'},{id:1,name:'男'},{id:2,name:'女'}];
                $scope.yearList = [];
                $scope.monthList = [];
                $scope.dayList = [];
                for(var i = 1990;i<year; i++){
                    var value = i+'';
                    $scope.yearList.push({id:value,name:value+''});
                }
                for(var i = 1;i<=12; i++){
                    var value = i+'';
                    $scope.monthList.push({id:value,name:value+''});
                }
                for(var i = 1;i<=31; i++){
                    var value = i+'';
                    $scope.dayList.push({id:value,name:value+''});
                }
                
                $scope.student = {
                    profile:{}
                };

            }
            // 更新性别
            function updateSex(){
                var student = $scope.student,
                    formData = $scope.sexFormData,
                    always = function() {
                        mLoading.hide();
                    };


                mLoading.show('正在处理');
                studentDao.update({sex:formData.sex}).then(function(){
                    student.sex = formData.sex;
                    always();
                    mNotice('修改成功','success');
                }, function(result){
                    always();
                    mNotice(result.message);
                });
            }

            // 更新生日
            function updateBirth(){
                var userProfileFieldDao = resource('/user/profile/field'),
                    birthday = $scope.birthFormData || {},
                    year = birthday.year || '',
                    month = birthday.month || '',
                    day = birthday.day || '',
                    _birthday = year + '-' + month + '-' + day,
                    always = function() {
                        mLoading.hide();
                    };

                // 年月日必填
                if(!year || !month || !day){
                    mNotice('年月日必填','info');
                    return;
                }
                // 判断 生日2月份的日期
                if(month == 2 && day >28 ){
                    mNotice('生日日期有误','info');
                    return;
                }
                mLoading.show('正在处理');
                userProfileFieldDao.update({fieldname:'birthday',fieldvalue:_birthday}).then(function(){
                    $scope.student.profile.birthday = _birthday;
                    mNotice('修改成功','success');
                    always();

                }, function(result){
                    mNotice(result.message);
                    always();
                    
                });
                
            }
            // 判断是否当前用户
            function checkUser(){
                var uid = $routeParams.uid, user = IGrow.user;

                if(uid == user.uid){
                    $scope.isOwner = true;
                }else{
                    $scope.isOwner = false;
                }
            }

            initScopeData();
            run();


        }
    ]);


    return app;
});