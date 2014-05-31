/*
    学生假条 具体
 */
define(function(require, exports, module) {
    
    var app = require('mainApp');


    app.register.controller('studentAbsenceDetailController', ['$scope', '$q', '$routeParams','mLoading','mNotice','resource',
        function($scope, $q, $routeParams,mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                absenceDao = resource('/yo/student/absent'),
                absenceid = $routeParams.absenceid,
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
            
            mLoading.show();
            absenceDao.get( { id:absenceid ,_relatedfields : 'type.name,type.id'} ,function(result){
                var data = result.data || {},checkstatus = data.checkstatus,typeName = data.type.name;

                data.starttime = data.starttime*1000;
                data.endtime = data.endtime*1000;
                data._statusClass = statusClassMap[checkstatus]?statusClassMap[checkstatus]:'absence-status-unread';
                data._typeClass = typeClassMap[typeName]?typeClassMap[typeName]:'absence-type-others';

                $scope.absence = data;

            },function(result){
                mNotice(result.message,'error');
            },function(){
                mLoading.hide();
            });
        }
    ]);


    return app;
});