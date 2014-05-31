'use strict';

(function (app) {

    //school
    app.factory('modelSchool', ['modelFactory', function (modelFactory) { return modelFactory('school') }]);

    //school teacher
    app.factory('modelSchoolTeacher', ['modelFactory', function (modelFactory) { return modelFactory('schoolTeacher') }]);

    //school student
    app.factory('modelSchoolStudent', ['modelFactory', function (modelFactory) { return modelFactory('schoolStudent') }]);

    //school class teacher
    app.factory('modelSchoolClassTeacher', ['modelFactory', function (modelFactory) { return modelFactory('schoolClassTeacher') }]);

    //school class student
    app.factory('modelSchoolClassStudent', ['modelFactory', function (modelFactory) { return modelFactory('schoolClassStudent') }]);

    //yo class news
    app.factory('modelYoClassNews', ['modelFactory', function (modelFactory) { return modelFactory('yoClassNews') }]);

})(angular.module('m.data.models', []));