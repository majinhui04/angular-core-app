/*
 *   学生假条
 *   checkstatus 审核状态
        0 - 已批假
        1 - 未审批
        2 - 已拒绝
        3 - 已销假
 */
define(function(require, exports, module) {
    
    var app = require('mainApp');


    app.register.controller('studentAbsenceController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                student = IGrow.student,
                semester = IGrow.semester,
                absenceDao = resource('/yo/student/absent'),
                _pagesize = 20,
                typeClassMap = {
                    '事假':'absence-type-personal',
                    '其他':'absence-type-others',
                    '病假':'absence-type-sick'
                },
                statusClassMap = {
                    '0':'absence-status-accept',
                    '1':'absence-status-unread',
                    '2':'absence-status-reject',
                    '3':'absence-status-remove'
                };
            
            $scope.page = 1;
            $scope.list = function(options){
                var opts = options || {},
                    page = opts.page || 1,
                    queryData = {
                        schoolid:student.schoolid,
                        semesterid:semester.id,
                        studentid:student.id,
                        _page:opts.page,
                        _pagesize:_pagesize,
                        _relatedfields:'type.name'
                    };

                mLoading.show();
                absenceDao.list( queryData ,function(result){
                    var list = result.data || [];
        

                    angular.forEach(list, function(item,_){
                        item.starttime = item.starttime*1000;
                        item.endtime = item.endtime*1000;
                        item._typeClass = typeClassMap[item.type.name]?typeClassMap[item.type.name]:'absence-type-others';
                        item._statusClass = statusClassMap[item.checkstatus]?statusClassMap[item.checkstatus]:'absence-status-unread';
                    });

                    // 是否显示更多
                    $scope.flag = list.length>=_pagesize?true:false;
                    if($scope.absenceList){
                        $scope.absenceList = $scope.absenceList.concat(list);
                    }else{
                        $scope.absenceList = list;
                    }
                    if(!list.length){
                        mNotice('没有数据了','info');
                    }
                    


                },function(result){
                    mNotice(result.message,'error');
                },function(){
                    mLoading.hide();
                });
            };

            $scope.showMore = function(){
                var page = (++$scope.page);

                $scope.list( { page:page } );
            };

            $scope.list();
            
        }
    ]);


    return app;
});