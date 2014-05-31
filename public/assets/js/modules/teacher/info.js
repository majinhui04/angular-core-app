'use strict';

(function (app) {

    app.controller('m.teacher.controller', ['$cookies', '$routeParams', 'modelSchoolTeacher', function ($cookies, $routeParams, modelSchoolTeacher) {

        document.title = '我的班级';

        $cookies.classAction = 'teacher';

        var $this = this;

        modelSchoolTeacher.get({
            id: $routeParams.id,
            _pagesize: 1000,
            _fields: 'id,name,sex,mobile',
            _relatedfields: 'user.avatar'
        }, function (result) {
            $this.form = result.data
        });

    }]);
    
})(angular.module('m.teacher', []));