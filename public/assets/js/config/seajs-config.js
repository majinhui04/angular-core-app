/*
*  全局配置 
*  Boss = { api:'ajax前缀',dir:'网站根目录',modules = [] }
*/
(function(){
    var Boss = window['Boss'] = {
        api:'',
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
                route:'/test',
                controller:'testCtrl',
                title:'',
                path:'/assets/js/modules/test/testCtrl.js',
                view:'/assets/views/modules/test/test.html',
                dependency:[]
            }
            
        ]
    };

    Boss.dir = getRootPath().replace('/assets','');// 网站根目录
    
    Boss.getCurrentSemester = getCurrentSemester;

    
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
    var dir = window['Boss']['dir'],
        modules = window['Boss']['modules'] || [],
        js = dir + '/assets/js/',
        css = dir + '/assets/css/',
        alias,module;

    // 设置别名
    alias = {
        // 库
        'webuploader.js':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/js/webuploader.js',
        'webuploader.css':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/css/webuploader.css',
        'angular-route':'/assets/js/vendor/libs/angularjs/1.2.14/angular-route.min.js',
        'angular-touch':'/assets/js/vendor/libs/angularjs/1.2.14/angular-touch.min.js',
        'angular-sanitize':'/assets/js/vendor/libs/angularjs/1.2.14/angular-sanitize.js',
        // 公共
        'angular-core':'/assets/js/core/angular-core.js',
        'angular-lazyload': '/assets/js/core/angular-lazyload.js',
        'utils':'/assets/js/public/utils.js',
        'scroll':'/assets/js/public/scroll.js',
        'emotion':'/assets/js/emotion.js',
        'photoLayout':'/assets/js/public/photoLayout.js',

        // app
        'loginApp':'/assets/js/core/loginApp.js',
        'dashboardApp':'/assets/js/core/dashboardApp.js'

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