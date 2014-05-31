/*
    成绩表彰 
    根据课程id获取近期课程的成绩 最多显示5条
 */
define(function(require, exports, module) {
    
    var app = require('mainApp');
    var Utils = require('utils');
    
    app.register.controller('scoreController', ['$scope', '$q', '$routeParams','mLoading','mNotice','resource',
        function($scope, $q, $routeParams,mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                student = IGrow['student'],
                semester = IGrow['semester'],
                log = IGrow.log,
                courseDao = resource('/yo/course');

            $scope.queryData = {
                courseid:''
            };
            // 获取科目列表
            $scope.list = function(){
                mLoading.show();
                courseDao.list({ schoolid:student.schoolid }, function(result){
                    var list = result.data || [];

                    log('课程表',list);
                    list.unshift({id:'',name:'请选择'});
                    
                    $scope.courseList = list;

                },function(result){
                    mNotice(result.message,'error');

                },function(){
                    mLoading.hide();
                });
            };
            // 科目变化
            $scope.courseChange = function(){
                var courseid = $scope.queryData.courseid;

                if(courseid) {
                    doStatistics(courseid);
                }else {
                    $scope.dataList = [];
                }
            
            };

            // 科目成绩统计
            function doStatistics(courseid) {
                var scoreDao = resource('/yo/score'),
                    examDao = resource('/yo/class/exam/check'),
                    promiseScore,promiseExam,examCheckList = [],scoreList = [];

                // 某门课程的近期成绩
                promiseScore = scoreDao.list({ semesterid:semester.id,courseid:courseid,studentid:student.id,_pagesize:50 },function(result){
                    var list = result.data || [];
                    log('scoreList',list);
                    scoreList = list;
                },function(result){
                    mNotice(result.message,'error');
                });
                // 某门课程的近期统计
                promiseExam = examDao.list({ semesterid:semester.id,courseid:courseid,studentid:student.id,_relatedfields:'exam.name,exam.date,classcourse.score',_pagesize:50 },function(result){
                    var list = result.data || [];
                    log('examCheckList',list);
                    examCheckList = list;
                },function(result){
                    mNotice(result.message,'error');
                });

                mLoading.show();
                $q.all([promiseScore,promiseExam]).then(function(){
                    mLoading.hide();

                    var examid,result,ret = [],examCheck,data;
                    // 根据统计信息获取自己的成绩
                    for (var i = examCheckList.length - 1; i >= 0; i--) {
                        examCheck = examCheckList[i];
                        examid = examCheck.examid;
                        
                        result = Utils.getItem(scoreList,{ examid:examid,courseid:courseid });
                        if(result){
                            var data = {
                                scoreStyle:{},
                                averageStyle:{},
                                score:result.score || 0,
                                average:examCheck.avgscore,
                                name:examCheck.exam.name,
                                time:examCheck.exam.date,
                                total:examCheck.classcourse.score || 100
                            };
                            data.barClass = (data.score-data.average)>0?'score-bar-columnA':'score-bar-columnB';
                            data.scoreClass = (data.score-data.average)>0?'scoreA':'scoreB';
                            data.scoreStyle.height = data.score/data.total*100+'%';
                            data.averageStyle.height = data.average/data.total*100+'%';
                            ret.push(data);
                        }
                    };
                    $scope.dataList = ret.length>5?ret.slice(0,5):ret;

                    log('统计结果',ret);

                }, function(){
                    mLoading.hide();

                });
                
            }

            $scope.list();
            
            
        }
    ]);


    return app;
});