define(function(require, exports, module) {
    require('datetimepicker.css');
    require('datetimepicker.js');

    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        suffix: [],
        meridiem: []
    };

    var registerDatetime = function(app){
        /* 日历 */
        //yyyy-mm-dd hh:ii
        app.directive('mdatetimepicker', ['$filter', function ($filter) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function($scope,$element, $attr, $ctrl){
                    var model = $scope[$attr.ngModel],options = $attr.options,defOpt;
                    if(!$ctrl){
                        return;
                    }
                   
                    options = $scope[$attr.mdatetimepicker] || {};
                    
                    //console.log($scope,$element,$attr,ctrl);
                    defOpt = {
                        language:'zh-CN',
                        format:'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn:  1,
                        autoclose: 1,
                        startView: 2,//默认值：0 or 'hour' 1 or 'day' 2 or 'month' 3 or 'year' 4 or 'decade'
                        minView:2,//默认值：0, 'hour'
                        pickerPosition:'bottom-left'
                    };
                    
                    //console.log(111,$element)
                    angular.extend(defOpt,options);
                    $element.datetimepicker(defOpt).on('changeDate', function(e){
                        var value = e.currentTarget.value,date = e.date,time = '';
                        if(!value){
                            value = $(e.currentTarget).find('input[type=text]').val();
                        }
                        console.log(222,value,e,$attr.ngModel,$ctrl);
                        time =  date && date.getTime();
                        $element.attr('data-time',time);
                        $scope[$attr.ngModel] = value;
                        $ctrl.$setViewValue(value);
                        $scope.$apply();
                       
                    });
                }
            };
        }]);
    };

    return registerDatetime;



}