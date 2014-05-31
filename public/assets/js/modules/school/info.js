'use strict';

(function (app) {

    app.controller('m.school.controller', ['modelSchool', function (modelSchool) {

        document.title = '我的学校';

        var $this = this;

        modelSchool.get({
            id: IGrow.User.schoolid,
            _relatedfields: 'profile.*'
        }, function (result) {
            $this.articleData = result.data;
        })

    }]);

})(angular.module('m.school', []));