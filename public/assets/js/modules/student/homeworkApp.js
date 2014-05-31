/*
 *   我的作业
 */
define(function(require, exports, module) {
    
    var app = require('mainApp');


    app.register.controller('homeworkController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                student = IGrow.student,
                semester = IGrow.semester,
                studentWorkDao = resource('/yo/student/work'),
                _pagesize = 6;
            
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
                        _relatedfields:'teacher.name,teacher.user,course.name,homework.*'
                    };

                mLoading.show();
                studentWorkDao.list( queryData ,function(result){
                    var list = result.data || [];
                    
                    IGrow.log('作业列表',list)
                    if($scope.dataList){
                        $scope.dataList = $scope.dataList.concat(list);
                    }else{
                        $scope.dataList = list;
                    }
                    if(!list.length){
                        mNotice('没有数据了','info');
                    }
                    // 是否显示更多
                    $scope.flag = list.length>=_pagesize?true:false;
                    

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