/*
 *   用户照片
 *   
 */
define(function(require, exports, module) {
    require('photoLayout');
    var Utils = require('utils');
    var app = require('mainApp');

    app.register.controller('userPhotoController', ['$scope', '$q', 'mLoading','mNotice','resource','$routeParams',
        function($scope, $q, mLoading,mNotice,resource,$routeParams) {
            var photoDao = resource('/yo/photo'),
                albumDao = resource('/yo/album'),
                IGrow = window['IGrow'],
                user = IGrow.user,
                uid = $routeParams.uid || user.uid,
                $container = $('.user-photo-wrapper'),
                queryData = {
                    albumid:$routeParams.albumid,
                    _page:1,
                    _pagesize:1000
                },
                thumbnail = {
                    '75':'!square.75',
                    '150':'!square.150',
                    '240':'!small.240',
                    '320':'!small.320',
                    '500':'!medium.500',
                    '800':'!medium.800',
                    '1024':'!large.1024',
                    '1600':'!large.1600',
                    '2000':'!large.2000'
                };


            // 判断权限 是否为当前用户
            if($routeParams.uid){
                $scope.isOwner = (user.uid == $routeParams.uid)?true:false;
            }else{
                $scope.isOwner = true;
            }
            // 待删除的照片
            $scope.selectedPhotos = [];
            $scope.photoStatus = 'normal';
            // 显示操作按钮
            $scope.toActionView = function(){
                $scope.isShowOptions = true;
                $scope.optionsClass = 'm-options-enter';
            };
            // 回到正常视图
            $scope.toNormalView = function(){
                var photoList = $scope.photoList || [];

                $scope.optionsClass = 'm-options-leave';
                $scope.photoStatus = 'normal';
                $scope.isShowOptions = false;
                $scope.isShowDeleteBtn = false;

                // 取消选中
                $container.find('.photo-item').each( function(index, val) {
                    var $target = $(val),$selectedBox = $target.find('.photo-selected-box');

                    $target.attr('data-checked', 'false');
                    $selectedBox.hide();
                });
                
            };
            // 编辑相册名字
            $scope.toEditAlbumView = function(){

                $scope.toNormalView();
                $scope.formData = angular.copy($scope.album);
            };
            // 管理相册照片
            $scope.toEditPhotoView = function(){
                $scope.optionsClass = 'm-options-leave';
                $scope.photoStatus = 'edit';
                $scope.isShowOptions = false;
            };
            
            // 修改相册名字
            $scope.updateAlbum = function(album) {
                if(!album.name){
                    mNotice('名称必填','info');
                    return ;
                }
                mLoading.show('正在处理');
                albumDao.update( { id:album.id , name:album.name } ).then(function(){
                    mLoading.hide();
                    mNotice('修改成功','success',1000);
                    document.title = album.name;

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                })
            };

            function previewPhoto(e){
                var $target = $(e.currentTarget),$photo = $target.find('img'), uuid = $photo.attr('data-uuid'), photo,
                    checked = $target.attr('data-checked');
                    
                
                // 假如是照片编辑状态 则勾选而不是预览
                if($scope.photoStatus === 'edit') {
                    if('true' == checked) {
                        $target.find('.photo-selected-box').hide();
                        $target.attr('data-checked','false');
                    }else {
                        $target.find('.photo-selected-box').show();
                        $target.attr('data-checked','true');
                    }
                    
                }else {
                    var pics = [], current = $photo.attr('data-original') + '!small.240';

                    $(this).closest('.photo-list').find('.photo-wrap img').each(function(e, item) {
                        pics.push( $(item).attr('data-original') + '!small.240' );
                    });
                   
                    WeixinApi.imagePreview( current ,pics );
                }
            }
            function resize(){
                $('#photoLayoutList').doPhotoLayout( { imgItem:'.photoLayoutItem' ,border:1,imgHeight:60,imgWidth:60 } );
            }
            function bind(){
                $('.user-photo-wrapper').off('click','.photo-item',previewPhoto);
                $('.user-photo-wrapper').on('click', '.photo-item',previewPhoto);
                
                setTimeout(function(){
                    $('#photoLayoutList').doPhotoLayout( { imgItem:'.photoLayoutItem' ,border:1,imgHeight:60,imgWidth:60 } );
                    $(window).off('resize',resize);
                    $(window).on('resize',resize);
                }, 1);
                    
                    
                
                
            }
            function run(){
                

                mLoading.show('正在加载...');
                photoDao.list(queryData).then(function(result){
                    var photoList = result.data || [];

                    //console.log('photoList',photoList)
                    mLoading.hide();
                    angular.forEach(photoList, function(photo,i){
                        //console.log('photo.url',photo.url)
                        //small.240
                        photo.thumbnail = Utils.addPhotoSuffix(photo.url,'!square.75');
                        //photo.thumbnail = Utils.addPhotoSuffix(photo.url,'!small.240');
                        photo.index = i;
                    });
                    
                    $scope.photoList = photoList;
                    bind();


                }, function(result){
                
                    mLoading.hide();
                    mNotice(result.message,'error');
                    
                });

                // 获取相册信息
                albumDao.get( { id:$routeParams.albumid } ).then(function(result){
                    var album = result.data || {};

                    $scope.album = album;
                    document.title = album.name;

                }, function(result){
                    mNotice(result.message,'error');
                });
                
            }
            
                
            // 确认删除
            $scope.toDeleteView = function(photo){
                var photoList = $scope.photoList || [],pending = [],uuids = [] , selected = [],promises = [],success = [],error =[];

                $scope.formData = angular.copy(photo);
                Utils.confirm('确定删除?',function(){
                    $container.find('.photo-item[data-checked="true"]').each(function(_,val){
                        var $target = $(val),uuid = $target.find('img').attr('data-uuid');

                        uuids.push(uuid);
                    });

                    angular.forEach(uuids, function(uuid , i) {
                        
                        (function(uuid){
                            promises[i] = photoDao._delete( { id:uuid } ,function(){
                                success.push(uuid);

                            },function(){
                                error.push(uuid);
                            });
                        })(uuid);
                                
                        
                    });

                    mLoading.show('正在处理');
                    $q.all(promises).then(function(){
                        mNotice('删除成功','success');
                        mLoading.hide();
                        syncPhotoList(success,'bulkdelete');
                        //console.log('success',success);
                        $scope.toNormalView();

                    }, function(){
                        mLoading.hide();
                        mNotice('删除出错','error');
                        //console.log('error',error);
                    });
                });
               
                
            };


            function syncPhotoList(target,action){
                var photoList = $scope.photoList || [];

                if(action === 'create'){
                    photoList.unshift(target);
                    return;
                }
                if(action === 'bulkdelete'){
                    var uuids = target || [];

                    angular.forEach(uuids, function(uuid,i) {
                        var index = -1;
                        for (var i = 0; i < photoList.length; i++ ){
                            photo = photoList[i];
                            if(uuid == photo.id) {
                                index = i;
                                break;
                                
                            }
                        }
                        if(index>-1){
                            photoList.splice(index,1);
                        }
                            
                    });
                    return;
                }
                for (var i = 0; i < photoList.length; i++ ){
                    photo = photoList[i];
                    if(target.id === photo.id) {
                        if(action == 'update'){
                            photo.name = target.name;

                        }else{
                            photoList.splice(i,1);
                        }
                        break;
                        
                    }
                }
                
            }

            run();
            
         

        }
    ]);


    return app;
});