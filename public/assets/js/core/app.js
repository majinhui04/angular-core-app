'use strict';

/*  app  */
(function (app) {

    var siteHost = location.protocol + '//' + location.host + '/',
        timestamp = Date.parse(new Date()) / 1000,
        absPath = function (path) { return !path || !path.indexOf('http://') || path.substr(0, 1) === '/' },
        apiPath = function (path) { return siteHost + 'api/' + AppConfig.api.version + '/' + path },
        filePath = function (path, ext) {
            if (!absPath(path)) {
                path = path.indexOf('.' + ext) > -1 ? path.substr(0, path.indexOf('.' + ext)) : path;
                path = siteHost + 'assets/' + (ext === 'html' ? 'views' : ext) + '/' + AppConfig.app.dir + path + '.' + ext + '?t=' + timestamp
            } else if (path.indexOf('?t=') == -1 && path.indexOf('&t=') == -1) {
                path += (path.indexOf('.' + ext + '?') == -1 ? '?' : '&') + 't=' + timestamp
            }
            return path
        },
        eachPath = function (list, ext) { angular.forEach(list, function (path) { this.push(filePath(path, ext)) }, list = []); return list },
        urlHash = function (val, hash) { hash = hash || (location.hash || '').replace('#/', ''); return val ? val == hash : hash },
        AppConfig = {
            api: { version: '1.1b' },
            app: { code: '', dir: '/', styles: [], scripts: [], modules: [] },
            map: [{ path: '', view: '', viewUrl: null, styles: null, scripts: null, modules: null }],
            menu: [{ code: '', name: '', icon: '' }],
            preload: [{ styles: null, scripts: null, modules: null }]
        },
        viewMask = (function () {
            var count = 0,
                mask = function (callback, bool, closeAll) {
                    if (bool) {
                        count++;
                        !$('.modal-backdrop').length &&
                        !$('.view-mask').length &&
                        $('<div class="view-mask"><div></div><span></span></div>').prependTo('body')
                    } else {
                        if (closeAll) { count = 0; } else { count-- }
                        !count && $('.view-mask').remove()
                    }
                    callback instanceof Function && setTimeout(callback)
                };
            return {
                open: function () { mask(arguments[0], true) },
                close: function () {
                    var callback = arguments[0], closeAll = arguments[1];
                    if (!(callback instanceof Function)) {
                        callback = null;
                        closeAll = arguments[0];
                    }
                    mask(callback, false, closeAll)
                }
            }
        })();

    /*  extend config  */
    IGrow.Config && angular.forEach(AppConfig, function (item, name, config) { if ((config = IGrow.Config[name]) && item instanceof Array) { AppConfig[name] = config } else if (typeof item === 'object') { angular.extend(item, config) } else if (config !== undefined) { AppConfig[name] = config } });

    /*  extend preload  */
    angular.forEach(AppConfig.preload, function (item) {
        if (typeof item === 'object') {
            item.styles instanceof Array ? (AppConfig.app.styles = AppConfig.app.styles.concat(item.styles)) : item.styles && AppConfig.app.styles.push(item.styles);
            item.scripts instanceof Array ? (AppConfig.app.scripts = AppConfig.app.scripts.concat(item.scripts)) : item.scripts && AppConfig.app.scripts.push(item.scripts);
            item.modules instanceof Array ? (AppConfig.app.modules = AppConfig.app.modules.concat(item.modules)) : item.modules && AppConfig.app.modules.push(item.modules);
        }
    });

    /*  config  */
    app.config(['$compileProvider', '$controllerProvider', '$filterProvider', '$httpProvider', '$provide', '$routeProvider', function ($compileProvider, $controllerProvider, $filterProvider, $httpProvider, $provide, $routeProvider) {

        /*  register the interceptor via an anonymous factory  */
        $httpProvider.interceptors.push(['$q', function ($q) {
            return {
                request: function (request) {
                    if (request.url && request.url.indexOf('/api/' + AppConfig.api.version) > -1 && request.method) {
                        if (request.method.toUpperCase() !== 'GET') {
                            request.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                            request.transformRequest = [function (data) { return typeof data === 'object' ? $.param(data) : null }];
                        }
                        request.url = decodeURIComponent(request.url);
                    }
                    viewMask.open();
                    return request
                },
                requestError: function (request) { return $q.reject(request) },
                response: function (response) {
                    viewMask.close();
                    return response
                },
                responseError: function (response) {
                    viewMask.close();
                    if (response.data.code == '10020002') { location.href = 'http://auth.igrow.cn/auth/login?go=' + encodeURIComponent(location.href); }
                    return $q.reject(response)
                }
            }
        }]);

        /*  loader files [html,css,js]  */
        $provide.service('loader', ['$cacheFactory', '$http', function ($cacheFactory, $http) {
            var cache = $cacheFactory('loader-cacheFactory');
            this.html = function (path, callback) {
                var result = [], count = 0, call = function () { count++; count >= path.length && callback instanceof Function && setTimeout(function () { callback(result) }) };
                angular.forEach((path = path instanceof Array ? path : [path]), function (url, idx) { url ? $http.get(url).success(function (data) { call(result[idx] = data) }).error(call) : setTimeout(call) });
            };
            this.style = function (path, preload) {
                var count = 0,
                    element,
                    load = function (url) {
                        if (!url) return;
                        element = document.createElement('link');
                        element.rel = 'stylesheet';
                        element.type = 'text/css';
                        element.href = url;
                        if (!preload) element.className = 'loader-stylesheet';
                        (document.head || document.getElementsByTagName('head')[0]).appendChild(element)
                    };
                angular.forEach(path instanceof Array ? path : [path], function (item) { load(item) });
            };
            this.script = function (path, callback) {
                path = path instanceof Array ? path : [path];
                var count = 0,
                    ISL = document.addEventListener,
                    call = function () {
                        count++;
                        if (count >= path.length) { callback instanceof Function && setTimeout(callback) } else { setTimeout(function () { load(path[count]) }) }
                    },
                    load = function (url, element, disponse) {
                        if (!url || cache.get(url)) return setTimeout(call);
                        cache.put(url, true);
                        disponse = function () {
                            call();
                            document.body.removeChild(element);
                            element = element.onerror = element[ISL ? 'onload' : 'onreadystatechange'] = null;
                        };
                        element = document.createElement('script');
                        element[ISL ? 'onload' : 'onreadystatechange'] = function (_, isAbort) { (isAbort || !element.readyState || /loaded|complete/.test(element.readyState)) && disponse() };
                        element.onerror = disponse;
                        element.type = 'text/javascript';
                        element.src = url;
                        document.body.appendChild(element)
                    };
                load(path[count])
            };
        }]);

        /*  model factory  */
        $provide.factory('modelFactory', ['$resource', 'api', function ($resource, api) {
            var defaults = { query: { get: {}, list: {}, search: {} }, save: { set: {}, create: {}, update: {}, remove: { action: 'delete' }, 'delete': {} } };
            return function (key, actions) {
                actions = actions || angular.copy(defaults);
                angular.forEach(defaults, function (items, name) { actions[name] = actions[name] || angular.copy(items) });
                angular.forEach(actions, function (items, action) {
                    angular.forEach(angular.extend(angular.copy(defaults[action]), items instanceof Array && items.length ? eval('items={' + items.join(':{},') + ':{}}') : items || {}), function (item, key) {
                        (item = item || {}).action = item.action || key;
                        this[key] = function () {
                            var parameters = arguments[0], success = arguments[1], error = arguments[2], always = arguments[3],
                                callSuccess = function (result) {
                                    success instanceof Function && success(result);
                                    always instanceof Function && always(result);
                                },
                                callError = function (result) {
                                    error instanceof Function && error(result);
                                    always instanceof Function && always(result);
                                };
                            if (arguments[0] instanceof Function) {
                                parameters = item;
                                success = arguments[0];
                                error = arguments[1];
                                always = arguments[2];
                            }
                            parameters = angular.extend(angular.copy(item), parameters);
                            if (arguments[1] && !(arguments[1] instanceof Function)) {
                                success = arguments[2];
                                error = arguments[3];
                                always = arguments[4];
                                return this[action](parameters, arguments[1], callSuccess, callError)
                            } else {
                                return this[action](parameters, callSuccess, callError)
                            }
                        }
                    }, this)
                }, actions = { auth: api.auth });
                return angular.extend(angular.copy($resource(api[key], { action: '@action' }, { query: { method: 'GET' } })), actions)
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
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + queue[0]; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(runBlocks, function (fn) { $injector.invoke(fn) });
            }
        }]);

        /*  route config  */
        $provide.factory('routeConfig', ['loader', 'moduleRegister', function (loader, moduleRegister) {
            return function (routes, callback) {
                angular.forEach(routes, function (route) {
                    if (route.view || route.viewUrl) {
                        route.styles && angular.forEach(route.styles instanceof Array ? route.styles : [route.styles], function (path) { this.push(filePath(path, 'css')) }, route.styles = []);
                        route.scripts && angular.forEach(route.scripts instanceof Array ? route.scripts : [route.scripts], function (path) { this.push(filePath(path, 'js')) }, route.scripts = []);
                        angular.forEach(route.path instanceof Array ? route.path : [route.path], function (path, config) {
                            config = {
                                resolve: {
                                    defer: function ($q) {
                                        var defer = $q.defer(), endcall = function () { callback instanceof Function && callback(); route.styles && loader.style(route.styles); };
                                        route.scripts ? loader.script(route.scripts, function () { defer.resolve(endcall(moduleRegister(route.modules instanceof Array ? route.modules : [route.modules]))) }) : defer.resolve(endcall);
                                        return defer.promise
                                    }
                                }
                            };
                            if (route.viewUrl) { config.templateUrl = filePath(route.viewUrl, 'html') } else { config.template = route.view }
                            $routeProvider.when('/' + path, config)
                        })
                    }
                });
                $routeProvider.otherwise({ redirectTo: '/', resolve: { defer: function () { callback instanceof Function && setTimeout(callback) } } });
            }
        }]);

        /*  api service  */
        $provide.service('api', ['$http', function ($http) {
            var config = {};
            this.apply = function (name, data) {
                angular.forEach(this, function (item, name) { !(item instanceof Function) && (delete this[name]) }, this);
                angular.forEach(config[name] = data || config[name], function (item, name) { this[name] = (item === AppConfig.api.version || absPath(item)) ? item : apiPath(item) }, this);
                return this
            };
        }]);

    }]);

    /*  app controller  */
    app.controller(app.name + '.controller', ['$http', '$q', '$route', 'api', 'loader', 'moduleRegister', 'routeConfig', function ($http, $q, $route, api, loader, moduleRegister, routeConfig) {

        loader.style(eachPath(AppConfig.app.styles, 'css'), true);
        loader.script(eachPath(AppConfig.app.scripts, 'js'), function () {

            api.apply(app.name, {
                userGet: 'user/get',
                semesterList: 'school/semester/list'
            });

            $q.all([
                $http.get(api.userGet, {
                    params: {
                        _fields: 'id,uid,schoolid,typeid,username,realname,email,mobile,sex,avatar',
                        _relatedfields: 'school.student.classid,school.student.gradeid'
                    }
                }),
                $http.get(api.semesterList, { params: { _orderby: 'starttime desc' } })
            ]).then(function (result) {

                result[0] && (IGrow.User = result[0].data.data) && (function () {

                    moduleRegister(AppConfig.app.modules);
                    api.apply(AppConfig.app.code, AppConfig.api);
                    routeConfig(AppConfig.map, function () { $('link[class="loader-stylesheet"]').remove(); });
                    $route.reload();

                })();

                result[1] && (function (data) {

                    var curr, now, next, last;
                    angular.forEach(data, function (item) {
                        if (item.status === 0) { next = { id: item.id, name: item.name } }
                        if (item.status === 1) { now = { id: item.id, name: item.name } }
                        if (!now && !next && !last) { last = { id: item.id, name: item.name } }
                    });
                    IGrow.User.semesterid = (curr = now || next || last).id;

                })(result[1].data.data);

            })

        });

    }]);

    /*  angular rendering  */
    angular.element(document).ready(function () {
        $(document.body).attr('ng-controller', app.name + '.controller');
        angular.bootstrap(document, [app.name]);
    });

})(angular.module('m.app', ['ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch']));