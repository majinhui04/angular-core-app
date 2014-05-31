/*
*  全局配置 
*  IGrow = { api:'ajax前缀',dir:'网站根目录',modules = [] }
*/
(function(){
    var IGrow = window['IGrow'] = {
        log:function(){
            console.log.apply(console,arguments);
        },
        constant:{
           noCover:'/assets/img/public/no-cover-135.jpg',
           noAvatar:'/assets/img/public/avatar-80.png',
           attachment : {
                'doc':'/assets/img/attachment/doc.jpg',
                'wps':'/assets/img/attachment/wps.jpg',
                'html':'/assets/img/attachment/html.jpg',
                'mp3':'/assets/img/attachment/mp3.jpg',
                'mp4':'/assets/img/attachment/mp4.jpg',
                'xls':'/assets/img/attachment/xls.jpg',
                'xlsx':'/assets/img/attachment/xls.jpg',
                'ppt':'/assets/img/attachment/ppt.jpg',
                'pptx':'/assets/img/attachment/ppt.jpg',
                'txt':'/assets/img/attachment/txt.jpg',
                'zip':'/assets/img/attachment/rar.jpg',
                'rar':'/assets/img/attachment/rar.jpg',
                'pdf':'/assets/img/attachment/pdf.jpg',
                'unknow':'/assets/img/attachment/unknow.jpg'
           }
        },
        modules:[
            {
                body:'page-profile',
                route:'/:uid/student/profile',
                controller:'studentProfileController',
                name:'studentProfileApp',
                title:'个人信息',
                path:'modules/student/studentProfileApp.js',
                view:'modules/student/profile.html',
                dependency:['bootstrap']
            },
            {
                body:'page-profile',
                route:'/student/profile',
                controller:'studentProfileController',
                // 模块里设置的名称 angular.module(name,[])
                name:'studentProfileApp',
                // 模块的标题
                title:'学生个人信息',
                // 模块js的路径
                path:'modules/student/studentProfileApp.js',
                // 模块对应的页面
                view:'modules/student/profile.html',
                // 依赖 暂时无用
                dependency:['bootstrap']
            },
            {
                body:'page-profile',
                route:'/student/father',
                controller:'studentParentController',
                title:'我的爸爸',    
                path:'modules/student/studentParentApp.js',
                view:'modules/student/parent.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/mother',
                controller:'studentParentController',
                title:'我的妈妈',
                path:'modules/student/studentParentApp.js',
                view:'modules/student/parent.html',
                dependency:[]
            },
            {
                route:'/student/teacher',
                controller:'studentTeacherController',
                name:'studentTeacherApp',
                title:'我的老师',
                path:'modules/student/studentTeacherApp.js',
                view:'modules/student/teacher.html',
                dependency:[]
            },
            {
                route:'/class/course',
                controller:'classCourseController',
                name:'classCourseApp',
                title:'班级课程',
                path:'modules/class/classCourseApp.js',
                view:'modules/class/course.html',
                dependency:[]
            },
            {
                route:'/student/attence',
                controller:'studentAttenceController',
                name:'studentAttenceApp',
                title:'我的考勤',
                path:'modules/student/studentAttenceApp.js',
                view:'modules/student/attence.html',
                dependency:[]
            },
            {
                route:'/user/password',
                controller:'userPasswordController',
                name:'userPasswordApp',
                title:'密码修改',
                path:'modules/user/userPasswordApp.js',
                view:'modules/user/password.html',
                dependency:[]
            },
            {
                route:'/:uid/user/album',
                controller:'userAlbumController',
                name:'userAlbumApp',
                title:'相册',
                path:'modules/user/userAlbumApp.js',
                view:'modules/user/album.html',
                dependency:[]
            },
            {
                route:'/user/album',
                controller:'userAlbumController',
                name:'userAlbumApp',
                title:'我的相册',
                path:'modules/user/userAlbumApp.js',
                view:'modules/user/album.html',
                dependency:[]
            },
            {
                route:'/:uid/user/album/:albumid',
                controller:'userPhotoController',
                name:'userPhotoApp',
                title:'照片',
                path:'modules/user/userPhotoApp.js',
                view:'modules/user/photo.html',
                dependency:[]
            },
            {
                route:'/user/album/:albumid',
                controller:'userPhotoController',
                name:'userPhotoApp',
                title:'我的照片',
                path:'modules/user/userPhotoApp.js',
                view:'modules/user/photo.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/schoolday',
                controller:'studentSchoolDayController',
                name:'studentSchoolDayApp',
                title:'请假考勤',
                path:'modules/student/studentSchoolDayApp.js',
                view:'modules/student/schoolday.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/askforleave',
                controller:'studentAskForLeaveController',
                name:'studentAskForLeaveApp',
                title:'我要请假',
                path:'modules/student/studentAskForLeaveApp.js',
                view:'modules/student/askForLeave.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/absence',
                controller:'studentAbsenceController',
                name:'studentAbsenceApp',
                title:'我的假条',
                path:'modules/student/studentAbsenceApp.js',
                view:'modules/student/absence.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/absence/:absenceid',
                controller:'studentAbsenceDetailController',
                name:'studentAbsenceDetailApp',
                title:'我的假条',
                path:'modules/student/studentAbsenceDetailApp.js',
                view:'modules/student/absenceDetail.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/homework',
                controller:'homeworkController',
                name:'homeworkApp',
                title:'我的作业',
                path:'modules/student/homeworkApp.js',
                view:'modules/student/homework.html',
                dependency:[]
            },
            {
                route:'/student/homework/:homeworkid',
                controller:'homeworkDetailController',
                name:'homeworkDetailApp',
                title:'我的作业',
                path:'modules/student/homeworkDetailApp.js',
                view:'modules/student/homeworkDetail.html',
                dependency:[]
            },
            {
                body:'',
                route:'/student/homework/submit/:homeworkid',
                controller:'homeworkSubmitController',
                name:'homeworkSubmit',
                title:'提交作业',
                path:'modules/student/homeworkSubmitApp.js',
                view:'modules/student/homeworkSubmit.html',
                dependency:[]
            },
            {
                body:'page-profile',
                route:'/student/news',
                controller:'newsController',
                name:'news',
                title:'日常表现',
                path:'modules/student/newsApp.js',
                view:'modules/student/news.html',
                dependency:[]
            },
            {
                body:'page-profile page-publish-text',
                route:'/publish/text',
                controller:'newsPublishController',
                name:'news',
                title:'发布文字',
                path:'modules/news/newsPublishApp.js',
                view:'modules/news/newsPublish.html',
                dependency:[]
            },
            {
                body:'page-profile page-publish-photo',
                route:'/publish/photo',
                controller:'newsPublishController',
                name:'news',
                title:'发布照片',
                path:'modules/news/newsPublishApp.js',
                view:'modules/news/newsPublish.html',
                dependency:[]
            },
            {
                body:'page-profile page-publish-video',
                route:'/publish/video',
                controller:'newsPublishController',
                name:'news',
                title:'发布视频',
                path:'modules/news/newsPublishApp.js',
                view:'modules/news/newsPublish.html',
                dependency:[]
            },
            {
                body:'',
                route:'/student/score',
                controller:'scoreController',
                name:'score',
                title:'成绩表彰',
                path:'modules/student/scoreApp.js',
                view:'modules/student/score.html',
                dependency:[]
            },
            {
                route:'/test',
                controller:'testController',
                title:'测试',
                path:'modules/test/testApp.js',
                view:'modules/test/test.html',
                dependency:[]
            }
            
        ]
    };

    IGrow.dir = getRootPath().replace('/assets','');// 网站根目录
    // 替换多余的前缀
    IGrow.dir = getRootPath().replace('/main','');
    IGrow.api = IGrow.dir + '/api/1.1b';
    
    IGrow.getCurrentSemester = getCurrentSemester;

    
    // 获取站点根目录
    function getRootPath() {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        return (prePath + postPath);
    }

    function getCurrentSemester(semesterList) {
        var semesterList = semesterList || [],semester;

        for(var i = 0; i<semesterList.length; i++){
            semester = semesterList[i]
            if( 1 == semester.status ){
                return semester;
            }
        }
        
        semester = semesterList.length?semesterList[0]:null;

        return semester;
    }

})();

/* 
*
*  seajs 配置 
*  
*/
(function(){
    var dir = window['IGrow']['dir'],
        modules = window['IGrow']['modules'] || [],
        js = dir + '/assets/js/',
        css = dir + '/assets/css/',
        alias,module;

    // 设置别名
    alias = {
        //项目样式
        'common.css':css + 'public/common.css',
        'main.css':css + 'main/main.css',
        // 库
        'webuploader.js':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/js/webuploader.js',
        'webuploader.css':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/css/webuploader.css',
        'datetimepicker.css':'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/css/bootstrap.min.css',
        'datetimepicker.js':'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/js/bootstrap.min.js',
        'hammer':js + 'libs/hammer/1.1.0/hammer.js',
        'bootstrap.css':'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/css/bootstrap.min.css',
        'bootstrap':'http://assets.haoyuyuan.com/vendor/libs/bootstrap/3.0.0/js/bootstrap.min.js',
        'jquery':'http://assets.haoyuyuan.com/vendor/libs/jquery/jquery-2.0.0.min.js',
        'angular':'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular.min.js',
        'angular-sanitize':'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular-sanitize.min.js',
        'angular-route':'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular-route.min.js',
        'angular-touch':'http://assets.haoyuyuan.com/vendor/libs/angularjs/1.2.14/angular-touch.min.js',
        // 公共
        'angular-core':js + 'core/angular-core.js',
        'angular-lazyload': js + 'core/angular-lazyload.js',
        'utils':js + 'public/utils.js',
        'scroll':js + 'public/scroll.js',
        'emotion':js + 'public/emotion.js',
        'photoLayout':js + 'public/photoLayout.js',
        'mainApp':js + 'core/mainApp.js'

    };

    // 将业务的js载入
    /*for( var i = 0; i < modules.length; i++ ) {
        module = modules[i];
        alias[module.name] = js + module.path;
    };*/

    // console.log('alias',alias)
    window['seajs'] && seajs.config({
        alias:alias,
        charset: 'utf-8',
        map: [
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?'+new Date().valueOf() ]
        ]
    });

    window['seajs'] && seajs.on('error', function(module){

        if(module.status!=5){
            alert(module.status)
            console.error('seajs error: ', module);
        }
    });

})();