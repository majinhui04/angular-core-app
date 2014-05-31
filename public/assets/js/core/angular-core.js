/*
 *    anuglar 通用的核心服务
 *    
 */
define(function(require, exports, module) {
    "use strict";
    var Utils = require('utils');
    require('angular-route');

    var IGrow = window['IGrow'];
    var app = angular.module('angular-core', ['ngRoute','ngSanitize']);

    /**/
    app.config(['$compileProvider', '$controllerProvider', '$filterProvider', '$httpProvider', '$provide', '$routeProvider' , function($compileProvider, $controllerProvider, $filterProvider, $httpProvider, $provide, $routeProvider){

        // 路由配置器
        $provide.factory('routeConfig', ['$http', function ($http) {
            return function (routes) {

                var modules = IGrow.modules,dir = IGrow.dir;

                angular.forEach(modules, function(module , i) {
                    var config = {
                        body:module.body,
                        title:module.title,
                        templateUrl:dir + '/assets/views/' +  module.view
                    },

                    route = module.route;
                    // 假如需要动态加载controller
                    if(module.path){
                        config.controller = module.controller;
                        config.controllerUrl = dir + '/assets/js/' + module.path;
                    }else{
                        config.controller = function(){
                            
                        }
                    }
                    $routeProvider.when(route,config);
                });

                $routeProvider.when('/error',{
                    title:'404',
                    controller: function($scope, $routeParams, $location) {
                        //$scope.str = 'test'
                        //console.log($routeParams,$location)
                    },
                    template: '<div style=" text-align:center;padding:15px;">404</div>'

                }).when('/profile',{
                    title:'我的资料',
                    controller: function($scope, $routeParams, $location) {
                        var IGrow = window['IGrow'], user = IGrow.user;

                        if(user.typeid == 4){
                            $location.path('/student/profile');
                        }else{
                            $location.path('/teacher/profile');
                        }
                        
                    },
                    template: ''

                }).when('/schoolday',{
                    title:'请假考勤',
                    controller: function($scope, $routeParams, $location) {
                        var IGrow = window['IGrow'], user = IGrow.user;

                        if(user.typeid == 4){
                            $location.path('/student/schoolday');
                        }else{
                            $location.path('/teacher/schoolday');
                        }
                        
                    },
                    template: ''

                });
            }
        }]);

        /*  module register  */
        $provide.factory('moduleRegister', ['$injector', '$log', function ($injector, $log) {
            var cache = [],
                requires = [],
                runBlocks = [],
                invokeQueue = [],
                providers = {
                    $compileProvider: $compileProvider,
                    $controllerProvider: $controllerProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide
                };
            return function (modules) {
                angular.forEach(modules, function (name, module) {
                    try {
                        if (module = angular.module(name).requires) {
                            requires = requires.concat(module);
                            this.push(name)
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                }, modules = []);
                angular.forEach(requires, function (name) {
                    try {
                        angular.module(name) && modules.push(name)
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(modules, function (module, index) {
                    try {
                        index = modules[modules.length - index - 1];
                        module = angular.module(index);
                        if (cache.indexOf(module.name) === -1) {
                            cache.push(module.name);
                            runBlocks = runBlocks.concat(module._runBlocks);
                            invokeQueue = invokeQueue.concat(module._invokeQueue);
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + index; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(invokeQueue, function (queue, provide) {
                    try {
                        providers.hasOwnProperty(queue[0]) && (provide = providers[queue[0]]) && provide[queue[1]].apply(provide, queue[2]);
                        /*$log.error('unsupported provider ' + queue[0]);*/
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + queue[0]; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(runBlocks, function (fn) { $injector.invoke(fn) });
            }
        }]);

    }]);
    /* 自定义ajax */
    app.factory('http', ['$http', '$q','mLoading','mNotice',
        function($http, $q ,mLoading , mNotice) {

            var http = window['http'] = {
                ajax: function(url, data, opts,successCallback, failCallback,always) {
                    var self = this,
                        opts = opts || {},
                        data = data || {},
                        deferred = $q.defer(),
                        method = opts.type || 'GET',
                        dataType = opts.dataType || 'json',
                        timeout = opts.timeout || 60 * 1000,
                        context = opts.context || self,
                        config = {};

                    config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(obj) {
                            return jQuery.param(obj);
                        },
                        method: method,
                        url: url,
                        dataType: dataType,
                        data: data

                    };
                    if (method === 'POST') {
                        config.data = data;
                    } else {
                        config.params = data;
                    }

                    $http(config).success(function(data, status, headers, config) {
                        var message;
                
                        if (data.code && data.code != 0) {

                            message = data.message;
                            deferred.reject({
                                status:status,
                                message: message
                            });

                            
                        } else {
                            successCallback && successCallback(data);
                            deferred.resolve(data);
                            always && always();
                        }


                    }).error(function(data, status, headers, config) {
                        var message = '';
                        
                        if(data.code && data.code != 0){
                            message = data.message;
                            // 若未登录
                            if(data.code == 10020002){
                                var hash = location.hash || '';
                                location.href = 'http://auth.igrow.cn/auth/login?from=AUTH&go=http://m.igrow.cn/main?hash=' + hash.replace('#/','');
                            }
                        }
                        failCallback && failCallback(data);
                        deferred.reject({
                            status:status,
                            message: message
                        });
                        always && always();

                    });

                    return deferred.promise;
                },
                get: function(url, data,successCallback, failCallback,always) {

                    return this.ajax(url, data, {
                        type: 'GET'
                    },successCallback, failCallback,always);

                },
                post: function(url, data, successCallback, failCallback,always) {

                    return this.ajax(url, data, {
                        type: 'POST'
                    },successCallback, failCallback,always);

                },
                // 处理请求错误
                handleXhrError: function(xhr) {
                    var responseText,
                        error = {},
                        isResponseObject = function(xhr) {
                            return /^{/.test(xhr.responseText);
                        };

                    if (xhr.statusText === 'timeout') {
                        error.message = '请求超时 ';
                    } else if (xhr.message) {
                        error = xhr;
                    } else if (xhr.status == 500 && isResponseObject(xhr)) {
                        try {
                            responseText = xhr.responseText.replace('/\\/g', '//');
                            error = $.parseJSON(responseText);
                            error.message = error.message || '错误未知';

                        } catch (e) {
                            console.warn('responseText parse error');
                            error = {
                                message: ' 错误未知 '
                            };
                        }

                    } else {
                        error = {
                            message: ' 错误未知 '
                        };
                    }

                    error.status = xhr.status;

                    return error;
                }

            };

            return http;


        }
    ]);

    /*  自定义resource */
    app.factory('resource', ['http',
        function(http) {
            /*
            *   @param url --> string ajax路径 example:假设完整路径 'http://m.igrow.cn/api/1.1b/school/people/get' 则url为'/school/people'
            *   @param options --> object 暂时没用
            *   @param actions --> object example :{ 'get2': { method:'GET',params:{ '默认参数1':'','默认参数2':'' } } }
            *
            *  默认返回的对象包含的方法:get,update,create,list,search,_delete   
            *  调用example
            *  var schoolPeople = resource('/school/people',{},{});
            *  schoolPeople.get({id:'1'}).then(function(result){
            *      console.log('返回的数据',result.data) ;
            *  },
            *  function(result){
            *      console.log( '错误信息',result.message );
            *  });
            */
            var $resource = function(url, options, actions) {
                var url = url || '',
                    options = options || {}, actions = actions || {},
                    resourse = {}, params;

                if (url.indexOf('http://') > -1) {
                    url = url;
                } else {
                    url = window['IGrow']['api'] + url;
                }
                resourse = {
                    url: url,
                    list: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/list',
                            data = data || {};

                        data._page = data._page ? data._page : 1;
                        data._pagesize = data._pagesize ? data._pagesize : 20;

                        return http.get(url, data ,successCallback, failCallback,always);
                    },
                    get: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/get',
                            data = data || {};

                        return http.get(url, data, successCallback, failCallback,always);
                    },
                    search: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/search',
                            data = data || {};

                        data._page = data._page ? data._page : 1;
                        data._pagesize = data._pagesize ? data._pagesize : 20;

                        return http.get(url, data,successCallback, failCallback,always);
                    },
                    _delete: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/delete',
                            data = data || {};

                        return http.get(url, data,successCallback, failCallback,always);
                    },
                    create: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/create',
                            data = data || {};

                        return http.post(url, data,successCallback, failCallback,always);
                    },
                    update: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/update',
                            data = data || {};

                        return http.post(url, data,successCallback, failCallback,always);
                    }
                };
                // 自定义action
                for (var action in actions) {
                    var opts = actions[action] || {}, method = opts.method || "GET",
                        params = opts.params || {};

                    method = method.toLowerCase();
                    resourse[action] = (function(url, action, method, params) {

                        return function(data, successCallback, failCallback,always) {
                            var data = data || {};

                            url = url + '/' + action;

                            data = jQuery.extend({}, params, data);

                            return http[method](url, data, successCallback, failCallback,always);

                        };

                    })(url, action, method, params)

                };

                return resourse;

            };

            return $resource;
        }
    ]);

    /* 自定义 MLoading */
    app.factory('mLoading',function(){
        return {
            show: function(notice,options){
                var notice = notice || '正在加载...',options = options || {},
                    tmpl = '<div id="mLoading"><div class="lbk"></div><div class="lcont">' + notice + '</div></div>';

                if( $('#mLoading').length >0 ) {
                    $('#mLoading .lcont').text(notice);
                }else{
                    $('body').append(tmpl);
                    centerElement($('#mLoading'),146,146);
                }
            },
            hide: function(){
                $('#mLoading').remove();
            }
        };
    });
    /* 自定义 MNotice */
    app.factory('mNotice',function(){
        var notice = function(message, iconType, timeout){
            if(iconType === 'error') {
                Utils.alert(message);
                return;
            }
            var message = message || '',iconType = iconType || 'info',timeout = timeout || 3000,ntc,
                tmpl = '<div class="mNotice">' + '<i class="' + iconType + '"></i>' + '<span>'+message+'</span>' + '</div>';
                   
            ntc = $(tmpl).appendTo($('body'));
            centerElement(ntc);
            setTimeout(function() {
                ntc.remove();
        
            }, timeout);

            return ntc;
        };

        return notice;
    });
    /* */
    app.directive('sayHello',function(){
        return {
                replace:true,
                restrict : 'E',
                templateUrl : 'helloTemplate.html',
                link:function(scope, elm, attr, ngModelCtrl){
                    //console.log(scope, elm, attr, ngModelCtrl)
                }
        }; 
    });

    //生成modal
    function makeModal(options) {
        var options = options || {},
            zIndex = options.zIndex || 900,
            opacity = options.opacity || 0.5;
            win = getClient(),
            backgroundColor = options.backgroundColor || '#000',
            height = win.h,
            position = options.position || 'fixed',
            id = 'modal_' + new Date().getTime(),
            tmpl = '<div class="m-modal"><a href="javascript:;" style="display:block;"></a></div>';

        $modal = $(tmpl).appendTo($('body'));
        $modal.css({
            left:0,
            top:0,
            position:position,
            width:'100%',
            zIndex: zIndex,
            opacity: opacity,
            backgroundColor:backgroundColor
        }).attr('id',id);

        $modal.find('a').css('height',height);

        return $modal;
    }
    function removeModal($element) {
        if ($element) {
            $element.remove();
        }else {
            $('.m-modal').remove();
        }
    }

   
    // 获取宽和高
    function getClient(e){
        var w,h;
        if (e) {
            w = e.clientWidth;
            h = e.clientHeight;
        } else {
            w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
            h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
        }
        return {w:w,h:h};
    }
    // 元素屏幕居中显示 position:fixed
    function centerElement(el,width,height) {
        var win = getClient(),
            winHeight = win.h,
            winWidth = win.w,
            element = el.jquery?el[0]:el,
            _width = width || element.offsetWidth,
            height =  height || element.offsetHeight,
            scrollTop,
            top,left;
            
        left =  Math.floor( (winWidth-_width)*0.5 );

        if(width){
            element.style.width = width+'px';
        }
        element.style.position = 'fixed';
        element.style.left = left+'px';
        
        top = Math.floor( (winHeight-height)*0.45 );
        element.style.top = top+'px';
    }


    return app;


});