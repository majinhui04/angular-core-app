/*
 *   学生老师
 *   
 */
define(function(require, exports, module) {
    var app = require('mainApp');

    app.register.controller('studentTeacherController', ['$scope', 'mLoading','mNotice','resource',
        function($scope,mLoading,mNotice,resource) {
            var studentDao = resource('/school/student'),
                classTeacherDao = resource('/school/class/teacher'),
                IGrow = window['IGrow'],
                noAvatar = IGrow['constant']['noAvatar'];

           
            function run(){
                mLoading.show('正在加载...');
                // 获取用户信息
                studentDao.get().then(function(result){
                    var student = result.data || {} ,classid = student.classid;

                    classTeacherDao.list({includeclassmaster:1,classid:classid,_relatedfields:'user.avatar'}).then(function(result){
                        var list = result.data || [];

                        //
                        angular.forEach(list, function(teacher,i){
                            teacher.avatar = teacher.user.avatar?teacher.user.avatar+'!72':noAvatar;
                        });
                     
                        $scope.teacherList = list;
 
                        mLoading.hide();

                    }, function(result){
                        mNotice(result.message,'error');
                        mLoading.hide();
                    })

                }, function(result){
                    mNotice(result.message,'error');
                    mLoading.hide();
                });
            }

            run();


        }
    ]);


    return app;
});