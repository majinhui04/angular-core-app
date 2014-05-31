/*
 *   学生考勤
 *   http://m.igrow.cn/api/1.1b/yo/attend/student/list?_dateformat=Y-m-d&_page=1&_pagesize=10&_relatedfields=student.*&schoolid=404&semesterid=52&studentid=133672
 *   todo: 刷卡状态未判断
 */
define(function(require, exports, module) {
    var Utils = require('utils');
    
    var app = require('mainApp');


    app.register.controller('studentAttenceController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var studentDao = resource('/school/student'),
                semesterDao = resource('/school/semester'),
                attenceDao = resource('/yo/attend/student'),
                studentPromise,semesterPromise,currentSemester,
                range = 30*24*60*60*1000,
                endtime = new Date().valueOf(),
                starttime = endtime - range,
                postData = $scope.postData = {
                    _dateformat:'Y-m-d',
                    _page:1,
                    _pagesize:30
                };

            postData.starttime = Utils.formatDate(new Date(starttime),'yyyy-MM-dd');
            postData.endtime = Utils.formatDate(new Date(endtime),'yyyy-MM-dd');


            studentPromise = studentDao.get({},function(result){
                var data = result.data || {};

                postData.schoolid = data.schoolid;
                postData.studentid = data.id;

            });
            semesterPromise = semesterDao.list({},function(result){
                var semesterList = result.data || [],semester;

                semester = Utils.getCurrentSemester(semesterList);
                if(semester){
                    postData.semesterid = semester.id;
                }
            });
            //console.log('postData',postData)
            mLoading.show('正在加载...');
            $q.all( [studentPromise,semesterPromise] ).then(function(){
                
                attenceDao.search(postData).then(function(result){
                    var attenceList = result.data || [];
                    mLoading.hide();
                    //console.log('attenceList',attenceList);
                    $scope.attenceList = handleData(attenceList);

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error',2000000);
                });

            }, function(result){
                mLoading.hide();
                mNotice(result.message,'error');
            });

            // 处理考勤 显示进校时间和离校时间 以及对应的状态
            function handleData(attenceList){
                var attenceList = attenceList || [], ret = [];

                angular.forEach(attenceList , function(attence,_){
                    var data = null,come,leave,date;
                    
                    come = getEnterSchoolTime(attence);
                    leave = getLeaveSchoolTime(attence);
                    
                    if(come){
                        date = new Date(come*1000);
                        data = {
                            time:Utils.formatDate(date,'yyyy-MM-dd hh:mm:ss'),
                            status:'正常',
                            source:'进校'
                        }
                    }
                    ret.push(data);

                    if(leave){
                        date = new Date(leave*1000);
                        data = {
                            time:Utils.formatDate(date,'yyyy-MM-dd hh:mm:ss'),
                            status:'正常',
                            source:'离校'
                        }
                    }
                    ret.push(data);
                    
                });
                
                return ret ;
                
            }
            // 获取进校时间
            function getEnterSchoolTime(attence) {

                if (attence && (attence.m1+'').length === 10 ) {
                    return attence.m1;
                }
                if (attence && (attence.a1+'').length === 10 ) {
                    return attence.a1;
                }
                if (attence && (attence.e1+'').length === 10 ) {
                    return attence.e1;
                }
                return null;
            }
            // 获取离校时间
            function getLeaveSchoolTime(attence) {
                if (attence && (attence.e2+'').length === 10 ) {
                    return attence.e2;
                }
                if (attence && (attence.a2+'').length === 10 ) {
                    return attence.a2;
                }
                if (attence && (attence.m2+'').length === 10 ) {
                    return attence.m2;
                }

                return null;
            }

            $scope.searchMore = function(){
                var postData = $scope.postData,
                    starttime = new Date(postData.starttime).valueOf() - range,
                    endtime = new Date(postData.endtime).valueOf() - range;
                
                postData.starttime = Utils.formatDate(new Date(starttime),'yyyy-MM-dd');
                postData.endtime = Utils.formatDate(new Date(endtime),'yyyy-MM-dd');
                //console.log('postData',postData)
                mLoading.show('正在加载...');
                attenceDao.search(postData).then(function(result){
                    var attenceList = result.data || [];
                    mLoading.hide();
                    console.log('11，attenceList',attenceList);
                    
                    if( attenceList.length ){
                        $scope.attenceList = $scope.attenceList.concat( handleData(attenceList) );
                    }else{
                        mNotice('没有新数据','error');
                    }

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                });
            }

            
    
            
        }
    ]);


    return app;
});