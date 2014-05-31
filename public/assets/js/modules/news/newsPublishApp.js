/*
 *   日常表现
 *   包含老师的考评以及家长发布的动态
 *   content:{
 *       owner:4,
 *       text:'',
 *       images:[]
 *       videos:[]
 *    
 *   }
 */
define(function(require, exports, module) {
    require('webuploader.js');
    require('webuploader.css');
    var Utils = require('utils');
    var libEmotion = require('emotion');
    
    var app = require('mainApp');


    app.register.controller('newsPublishController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                student = IGrow.student,
                semester = IGrow.semester,
                reviewDao = resource('/yo/check/group/result'),
                newsDao = resource('/book/tweet'),
                noAvatar = IGrow['constant']['noAvatar'],
                lastIndex = location.href.lastIndexOf('/'),
                _action = location.href.substring(lastIndex+1),
                _pagesize = 10,
                replyTimer,
                uploader;
            

            $scope.photoLimit = 9;
            $scope.photoList = [];
            $scope.videoList = [];
            console.log('_action',_action)
            // 若是发布照片
            if('photo' === _action) {
                uploader = WebUploader.create({
                    mode:'html5',
                    auto:true,
                    multiple:false,
                    pick:{
                        id:'photoPicker'
                    },
                    token:{
                        data:{ configkey:'school_classalbum' }
                    },
                    // 只允许选择图片文件。
                    accept: {
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    }
                });
                
                $scope.removePhoto = function(photo) {
                    uploader.removeFile(photo);
                    Utils.removeItem($scope.photoList,photo,'id');
                };

                // 单个文件加入队列
                uploader.on('fileQueued',function(file){
                    
                    //console.log('fileQueued',file);
                    file.statusText = '上传';

                    // 获取预览图片
                    uploader.getImgDataUrl(file,function(url){
                        file.thumbnail = url;

                        $scope.photoList.push(file);
                        $scope.$apply();
                    });
                    
                });

                uploader.on('uploadStart',function(file){
                    
                    $scope.$apply();
                    
                });
                uploader.on('uploadProgress',function(file,percentage){
                    var id = file.id,progress = percentage*100;

                    if( percentage == 1 ){
                        file.statusText = '正在保存';
                    }else {
                        file.statusText = Math.floor(progress)+'%';
                    }
                    
                    $scope.$apply();
                    //console.log('uploadProgress',percentage);
                    
                });

                uploader.on('uploadError',function(file ,result){
                    var message = result.message?'上传失败:'+result.message:'上传失败';
                    file.status = 'error';
                    file.statusText = '失败';
                    $scope.$apply();
                    mNotice(message,'error');
                   
                });

                // 上传成功
                uploader.on('uploadSuccess',function(file ,result ){
                    var url = result.data.url;
                    
                    file.url = url;
                    file.status = 'success';
                    file.statusText = '成功';
                    $scope.$apply();
                    //console.log('uploadSuccess',url);
                    
                });
            }
            if('video' === _action) {

                uploader = WebUploader.create({
                    mode:'html5',
                    auto:true,
                    multiple:false,
                    pick:{
                        id:'filePicker'
                    },
                    token:{
                        data:{ configkey:'school_fsfile' }
                    },
                    // 只允许选择视频文件。
                    accept: {
                        extensions:'MOV,MP4,3GP,MKV,RMVB,FLV,AVI,MPG',
                        mimeTypes: 'video/*'
                    }
                });
                
                $scope.removeVideo = function(video) {
                    uploader.removeFile(video);
                    Utils.removeItem($scope.videoList,video,'id');
                };

                // 单个文件加入队列
                uploader.on('fileQueued',function(file){
                    file._name = Utils.mb_cutstr(file.name,15);
                    file._size = WebUploader.formatSize(file.size,0);
                    file.statusText = '上传中';
                    $scope.videoList.push(file);
                    $scope.$apply();
                    
                });

                uploader.on('uploadProgress',function(file,percentage){
                    var id = file.id,progress = percentage*100;

                    if( percentage == 1 ){
                        file.statusText = '正在保存';
                    }else {
                        file.statusText = Math.floor(progress)+'%';
                    }
                    
                    $scope.$apply();
                    //console.log('uploadProgress',percentage);
                    
                });

                uploader.on('uploadError',function(file ,result){
                    var message = result.message?'上传失败:'+result.message:'上传失败';
                    file.status = 'error';
                    file.statusText = '失败';
                    $scope.$apply();
                    mNotice(message,'error');
                    //console.warn('uploadError',file,result);
                   
                });

                // 上传成功
                uploader.on('uploadSuccess',function(file ,result ){
                    var url = result.data.url;
                    
                    file.url = url;
                    file.status = 'success';
                    file.statusText = '成功';
                    $scope.$apply();
                    //console.log('uploadSuccess',url);
                    
                });
                uploader.on('uploadComplete',function(file){
                    file._complete = true;
                    $scope.$apply();
                });

                uploader.on('error',function(type,tip){
                    if ('F_TYPE_INVALID' === type ){
                        mNotice('允许上传的视频格式:'+tip);
                    }
                    
                });
            }   

            
            replyTimer = setInterval(function() {
                if($('textarea[name="content"]')[0]){
                    Utils.strLenCalc( $('textarea[name="content"]')[0], 'pText', 500 );
                }else{
                    clearInterval(replyTimer);
                    replyTimer = null;
                }
                
                
            }, 1000);

            libEmotion.init({
                container:'.expreList',
                textarea:'#content'
            });

            $scope.goBack = function() {
                Utils.confirm('确定取消发布吗?',function(){
                    clearInterval(replyTimer);
                    replyTimer = null;
                    history.go(-1);
                })
            };
            $scope.send = function(){
                var data = {},
                    content = $('#content').val(),
                    photoList = getPhotoList(),
                    videoList = getVideoList();

                if(!content) {
                    mNotice('内容必填','error');
                    return;
                }
                if( photoList.length>$scope.photoLimit ) {
                    mNotice('照片不允许超过'+$scope.photoLimit+'张','error');
                    return;
                }
                if( content && Utils.strlen(content)>500 ) {
                    mNotice('字数不允许超过500字','error');
                    return;
                }
                if( uploader && uploader.isInProgress && uploader.isInProgress() ){
                    mNotice('正在上传,请稍后','error');
                    return;
                }
                console.log(photoList)
                if('photo' === _action && !photoList.length ) {
                    mNotice('至少上传一张照片','error');
                    return;
                }

                data = {
                    studentid:student.id,
                    semesterid:semester.id,
                    content:{
                        owner:4,//表示家长
                        text:content,
                        images:photoList,
                        videos:videoList
                    }
                        
                };
                mLoading.show();
                newsDao.create(data, function(){
                    mNotice('发布成功!','success',1000);
                    setTimeout(function(){
                        clearInterval(replyTimer);
                        replyTimer = null;
                        history.go(-1);
                    },1100);
                        

                },function(result){
                    mNotice(result.message);

                },function(){
                    mLoading.hide();
                });
    
            };

            function getPhotoList() {
                var photoList = [];

                $('.publish-photo-box').each(function(_,item) {
                    var $item = $(item), $img = $item.find('.publish-photo-cut img'),url = $img.attr('data-original');

                    if(url) {
                        photoList.push( { url:url } );
                    }

                });

                return photoList;
            }
            function getVideoList() {
                var list = [];

                $('.publish-video-box').each(function(_,item) {
                    var $item = $(item), url = $item.attr('data-url');

                    if(url) {
                        list.push( { url:url } );
                    }

                });

                return list;
            }
            
            
            
        }
    ]);


    return app;
});