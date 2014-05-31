'use strict';

(function (app) {

    app.controller('m.notice.controller', ['$cookies', '$routeParams', '$scope', '$swipe', 'modelYoClassNews', function ($cookies, $routeParams, $scope, $swipe, modelYoClassNews) {

        var $this = this;

        if ($routeParams.id) {

            document.title = '通知内容';

            $cookies.noticeAction = $routeParams.action;

            if ($routeParams.action == 'class') {
                modelYoClassNews.get({ id: $routeParams.id }, function (result) {

                    document.title = result.data.title;

                    $this.articleData = result.data;

                })
            } else if ($routeParams.action == 'school') {

            }

        } else {

            document.title = '学校通知';

            if ($routeParams.action) {
                $cookies.noticeAction = $routeParams.action || $cookies.noticeAction;
                location.hash = '/notice';
                return
            }

            $this.action = $routeParams.action || $cookies.noticeAction || 'class';
            delete $cookies.noticeAction;

            if (IGrow.User.school.student) {
                var data = {
                    semesterid: IGrow.User.semesterid,
                    classid: IGrow.User.school.student.classid,
                    status: 1,
                    _pagesize: 1000,
                    _fields: 'id,title,createtime'
                };
                modelYoClassNews.list(data, function (result) { $this.classData = result.data });
                //modelYoClassNews.list(data, function (result) { $this.classData = result.data });

                //event touch
                (function touch() {

                    var $tab = $('.nav-tab'),
                        $content = $('.tab-content'),
                        $list = $content.children('.tab-pane'),
                        $width, $maxwidth, $left, $start, $move,
                        called = function () {
                            if ($move) {
                                $content.animate({ left: $left = Math.abs($move.x - $start.x) > 30 ? Math.max(Math.min(0, $move.x > $start.x ? $left + $width : $left - $width), -$maxwidth) : $left }, 250);
                                $this.action = Math.abs($left) / $width ? 'school' : 'class';
                                $scope.$apply();
                                $move = null;
                            }
                        },
                        screen = function () {
                            $width = $(document).width();
                            $maxwidth = $width * ($list.length - 1);
                            $tab.width($width).children('a').width($width / 2);
                            $list.width($width - 30);
                            $content.css({ left: $width * ($this.action == 'class' ? 0 : -1), width: $maxwidth + $width });
                        };

                    screen();

                    $swipe.bind($content.addClass('tab-touch'), {
                        start: function (coords) {
                            $left = parseInt($content.css('left'));
                            $start = coords;
                        },
                        move: function (coords) {
                            $move = coords;
                            $content.css({ left: Math.max(Math.min(0, $left + ($move.x - $start.x)), -$maxwidth) });
                        },
                        end: called,
                        cancel: called
                    });

                    $this.tab = function (index) {
                        $tab.removeClass('active').eq(index).addClass('active');
                        $content.animate({ left: index * -$width }, 250);
                        $this.action = index ? 'school' : 'class';
                    };

                    $(window).resize(screen);

                })();

            }

        }
    }]);

})(angular.module('m.notice', []));