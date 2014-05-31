/*
    学生作业 详情
 */
define(function(require, exports, module) {
    
    var app = require('mainApp');
    var Utils = require('utils');
    
    app.register.controller('homeworkDetailController', ['$scope', '$q', '$routeParams','mLoading','mNotice','resource',
        function($scope, $q, $routeParams,mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                attachmentMap = IGrow.constant.attachment,
                noAvatar = IGrow.constant.noCover,
                imageTypes = ['jpg','png','gif'],
                homeworkDao = resource('/yo/student/work'),
                homeworkid = $routeParams.homeworkid,
                queryData = {
                    id:homeworkid,
                    _relatedfields:'teacher.name,teacher.user,course.name,homework.*'
                };
            
            mLoading.show();
            homeworkDao.get( queryData ,function(result){
                var data = result.data || {}, homework = data.homework,attachmentList = homework.config || [];

                IGrow.log('作业详情',data);

                angular.forEach(attachmentList, function(item,_){
                    var name = item.name, ext;

                    ext = Utils.getFileExt(name);

                    if( attachmentMap[ext] ){
                        item._thumb = attachmentMap[ext];

                    }else if( imageTypes.indexOf(ext)>-1 && item.url ){
                        item._type = 'image';
                        item._thumb = Utils.addPhotoSuffix(item.url,'!square.75');

                    }else{
                        item._thumb = attachmentMap['unknow'];
                    }
                    // 名字截取
                    item._name = Utils.mb_cutstr(item.name,25);
                });
                data._attachmentList = attachmentList;
                data.teacher.user = data.teacher.user?data.teacher.user:{};
                data.teacher.user.avatar = data.teacher.user.avatar?data.teacher.user.avatar:noAvatar;
                $scope.data = data;



            },function(result){
                mNotice(result.message,'error');
            },function(){
                mLoading.hide();
            });

            bind();
            function bind(){
                $('.student-homework-detail-wrapper').off('click','.homework-attachment-image',previewPhoto);
                $('.student-homework-detail-wrapper').on('click', '.homework-attachment-image',previewPhoto);
            }
            function previewPhoto(e){
                var $target = $(e.currentTarget),
                    $photo = $target.find('img'),
                    url = $photo.attr('data-original'),
                    current = url + '!small.240';

                
                WeixinApi.imagePreview( current ,[current] );
                
            }
        }
    ]);


    return app;
});