/*
 *   班级课程
 *   data.config = {    
 *       //  第一节课
 *       1:{
 *           // 周一
 *           1:{
 *               course:{
 *                   name:''   
 *               },
 *               time:{
 *                   start:'',
 *                   end:''
 *               },
 *               teacher:{
 *                   name:''
 *               }
 *               
 *           },
 *           2:{},
 *           ...
 *           7:{}
 *       },
 *       2:{},
 *       ...
 *       10:{}
 *       
 *   
 *   }
 */
define(function(require, exports, module) {

    var Utils = require('utils');
    var app = require('mainApp');

    app.register.controller('classCourseController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var studentDao = resource('/school/student'),
                semesterDao = resource('/school/semester'),
                classCourseDao = resource('/yo/syllabus'),
                studentPromise,semesterPromise,currentSemester,postData = {};

            // 
            $scope.weekDayChange = function(day) {
                $scope.activeDay = day;
                console.log('day',day)
            };

            studentPromise = studentDao.get({},function(result){
                var data = result.data || {};

                postData.schoolid = data.schoolid;
                postData.classid = data.classid;
            });
            semesterPromise = semesterDao.list({},function(result){
                var semesterList = result.data || [],semester;

                semester = Utils.getCurrentSemester(semesterList);
                if(semester){
                    postData.semesterid = semester.id;
                }
            });

            mLoading.show('正在加载...');
            $q.all( [studentPromise,semesterPromise] ).then(function(){
                
                classCourseDao.get(postData).then(function(result){
                    var data = result.data || {},classCourseData = data.config;
                    mLoading.hide();
                    if(classCourseData){
                        handleData(classCourseData);
                    }else{
                        mNotice('班级课程不存在','error');
                    }

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                });

            }, function(result){
                mLoading.hide();
                mNotice(result.message,'error');
            });
            // 整理班级课程数据 周一到周日 
            /*
                {
                    '周一':{
                        1:{
    
                        },
                        2:{
    
                        }
                    }
                }

             */
            function handleData(classCourseData){
                var classCourseData = classCourseData || {}, 
                    courseMap = {
                        1:'第一节课',
                        2:'第二节课',
                        3:'第三节课',
                        4:'第四节课',
                        5:'第五节课',
                        6:'第六节课',
                        7:'第七节课',
                        8:'第八节课',
                        9:'第九节课',
                        10:'第十节课'
                    },
                    data = {
                        '1':[],
                        '2':[],
                        '3':[],
                        '4':[],
                        '5':[],
                        '6':[],
                        '7':[]
                    };

                angular.forEach(data, function(courses,weekNumber){
                    
                    angular.forEach(classCourseData, function(weekData,courseNumber){
                        // 早自习不算
                        if(-1 != courseNumber){
                            weekData[weekNumber] = weekData[weekNumber] || {};
                            weekData[weekNumber]['_name'] = courseMap[courseNumber];
                            courses.push(weekData[weekNumber]);
                        }
                        
                    });


                });

                $scope.classCourseData = data;
                console.log('classCourseData',data);
                // 默认显示周一
                $scope.activeDay = 1;

            }




        }
    ]);


    return app;
});