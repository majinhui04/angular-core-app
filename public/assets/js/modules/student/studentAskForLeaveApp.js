/*
 *   学生请假
 *   
 */
define(function(require, exports, module) {
    var Utils = require('utils');
    
    var app = require('mainApp');


    app.register.controller('studentAskForLeaveController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                semester = IGrow.semester,
                student = IGrow.student,
                schoolid = student.schoolid,
                semesterid = semester.id,
                leaveTypeDao = resource('/yo/absent/type'),
                timeStamp = new Date().valueOf() + 24*60*60*1000,
                tomorrow = Utils.formatDate(new Date(timeStamp),'yyyy-MM-dd hh:mm'),
                afterTomorrow = Utils.formatDate(new Date(timeStamp + 24*60*60*1000 ),'yyyy-MM-dd hh:mm'),
                date = tomorrow.split(' ')[0],
                time = tomorrow.split(' ')[1]

     
            // 请假数据
            $scope.formData = {
                schoolid:schoolid,
                semesterid:semesterid,
                gradeid:student.grade.id,
                classid:student.classid,
                studentid:student.id,
                starttime:'',
                endtime:'',
                typeid:'',
                notes:'',
                _startDate:tomorrow.split(' ')[0],
                _startTime:'08:00',
                _endDate:afterTomorrow.split(' ')[0],
                _endTime:'18:00'
            };
            $scope.save = function(){
                var leaveDao = resource('/yo/student/absent'),
                    formData = $scope.formData,
                    now = new Date().valueOf(),
                    starttime = formData._startDate + ' ' + formData._startTime,
                    endtime = formData._endDate + ' ' + formData._endTime,
                    typeid = formData.typeid,
                    starttimeStamp = new Date(starttime).valueOf(),
                    endtimeStamp = new Date(endtime).valueOf();

                if(!typeid){
                    mNotice('请假类型必填','error');
                    return;
                }
                if(!formData._startDate || !formData._startTime){
                    mNotice('开始时间必填','error');
                    return;
                }
                if(!formData._endDate || !formData._endTime){
                    mNotice('结束时间必填','error');
                    return;
                }
              /*  if(starttimeStamp<now){
                    mNotice('开始时间必须大于今天','error');
                    return;
                }*/
                if(starttimeStamp>=endtimeStamp){
                    mNotice('开始时间必须小于结束时间','error');
                    return;
                }

                /*console.log(now,starttimeStamp,endtimeStamp)
                console.log($scope.formData);*/

                formData.starttime = starttime;
                formData.endtime = endtime;

                mLoading.show('正在保存');
                delete formData._startDate;
                delete formData._startTime;
                delete formData._endDate;
                delete formData._endTime;
                leaveDao.create(formData,function(){
                    // 跳转到我的假条列表
                    location.hash = '/student/absence';
                },function(result){
                    mNotice(result.message,'error');
                },function(){
                    mLoading.hide();
                });

            };
            function run(){

                mLoading.show();
                // 获取请假类型 
                leaveTypeDao.list( { schoolid:schoolid } ,function(result){
                    var list = result.data || [];

                    mLoading.hide();
                    $scope.leaveTypeList = list;
                    angular.forEach(list, function(item,_){
                        if(item.name == '病假') {
                            $scope.formData.typeid = item.id;
                        }
                    });
                    
                    (list.length === 0) && mNotice('请假类型为空','info');

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                    
                });
                
            }

            run();
    
            
        }
    ]);


    return app;
});