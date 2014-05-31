'use strict';

(function (app) {

    app.controller('m.class.controller', ['$cookies', '$routeParams', '$scope', '$swipe', 'modelSchoolClassTeacher', 'modelSchoolClassStudent', function ($cookies, $routeParams, $scope, $swipe, modelSchoolClassTeacher, modelSchoolClassStudent) {

        document.title = '我的班级';

        if (IGrow.User.school.student) {

            var $this = this,
                data = {
                    classid: IGrow.User.school.student.classid,
                    includeclassmaster: 1,
                    _pagesize: 1000,
                    _fields: 'id,uid,name,spell,mobile',
                    _relatedfields: 'user.avatar'
                },
                spellSort = function (data) {

                    var spell = {}, tmp = [];

                    angular.forEach(data, function (item, key) {
                        key = (item.spell && /[A-Z]/.test(key = item.spell.substr(0, 1).toUpperCase())) ? key : '#';
                        spell[key] = spell[key] || [];
                        spell[key].push(item);
                    });

                    angular.forEach(spell, function (item, key) { key != '#' && this.push({ name: key, data: item }) }, tmp);

                    if (!tmp.length) return data;

                    tmp.sort(function (a, b) { return a.name < b.name ? -1 : 1 });

                    spell['#'] && tmp.push({ name: '#', data: spell['#'] });

                    angular.forEach(tmp, function (item) {
                        this.push({ name: item.name, head: true });
                        angular.forEach(item.data, function (item) { this.push(item) }, this);
                    }, data = []);

                    return data

                };

            if ($routeParams.action) {
                $cookies.classAction = $routeParams.action || $cookies.classAction;
                location.hash = '/class';
                return
            }

            $this.action = $routeParams.action || $cookies.classAction || 'student';
            delete $cookies.classAction;

            modelSchoolClassStudent.list(data, function (result) { $this.studentData = spellSort(result.data) });

            modelSchoolClassTeacher.list(data, function (result) { $this.teacherData = spellSort(result.data) });

            //event touch
            (function touch() {

                var $tab = $('.nav-tab'),
                    $content = $('.tab-content'),
                    $list = $content.children('.tab-pane'),
                    $width, $maxwidth, $left, $start, $move,
                    called = function () {
                        if ($move) {
                            $content.animate({ left: $left = Math.abs($move.x - $start.x) > 30 ? Math.max(Math.min(0, $move.x > $start.x ? $left + $width : $left - $width), -$maxwidth) : $left }, 250);
                            $this.action = Math.abs($left) / $width ? 'teacher' : 'student';
                            $scope.$apply();
                            $move = null;
                        }
                    },
                    screen = function () {
                        $width = $(document).width();
                        $maxwidth = $width * ($list.length - 1);
                        $tab.width($width).children('a').width($width / 2);
                        $list.width($width - 30);
                        $content.css({ left: $width * ($this.action == 'student' ? 0 : -1), width: $maxwidth + $width });
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
                    $this.action = index ? 'teacher' : 'student';
                };

                $(window).resize(screen);

            })();

        }

    }]);

})(angular.module('m.class', []));