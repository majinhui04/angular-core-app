'use strict';

IGrow.Config = {
    app: { code: 'M', dir: 'modules/' },
    preload: [
        '/assets/css/main/app.css?t=20140430',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular-cookies.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular-resource.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular-route.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular-sanitize.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.16/angular-touch.min.js',
        'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.1.1/css/bootstrap.min.css',
        'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.1.1/js/bootstrap.min.js',
        '/assets/js/core/app.js?t=20140430',
        { scripts: '/assets/js/config/app.models.js', modules: 'm.data.models' }
    ],
    api: {

        school: 'school/:action',
        schoolTeacher: 'school/teacher/:action',
        schoolStudent: 'school/student/:action',
        schoolClassTeacher: 'school/class/teacher/:action',
        schoolClassStudent: 'school/class/student/:action',
        yoClassNews: 'yo/class/news/:action'

    },
    map: [
        {
            path: '',
            view: ' '
        },
        {
            path: [
                'class',
                'class/:action'
            ],
            viewUrl: 'class/info',
            styles: 'class',
            scripts: 'class/info',
            modules: 'm.class'
        },
        {
            path: 'teacher/profile/:id',
            viewUrl: 'teacher/profile',
            styles: 'teacher',
            scripts: 'teacher/info',
            modules: 'm.teacher'
        },
        {
            path: 'school',
            viewUrl: 'school/info',
            scripts: 'school/info',
            modules: 'm.school'
        },
        {
            path: [
                'notice',
                'notice/:action/:id'
            ],
            viewUrl: 'school/notice',
            styles: 'notice',
            scripts: 'school/notice',
            modules: 'm.notice'
        }
    ]
};