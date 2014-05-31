/*
    提交作业
 */
define(function(require, exports, module) {
    require('webuploader.js');
    require('webuploader.css');
    var app = require('mainApp');
    var Utils = require('utils');
    
    app.register.controller('homeworkSubmitController', ['$scope', '$q', '$routeParams','mLoading','mNotice','resource',
        function($scope, $q, $routeParams,mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                attachmentMap = IGrow.constant.attachment,
                noAvatar = IGrow.constant.noCover,
                imageTypes = ['jpg','png','gif'],
                homeworkDao = resource('/yo/student/work',{},{ 'submitwork': { method:'POST' } }),
                homeworkid = $routeParams.homeworkid,
                uploader,
                queryData = {
                    id:homeworkid,
                    _relatedfields:'homework.name'
                };
            
            
            $scope.formData = {
                id:homeworkid,
                config:[],
                reply:''
            };
            uploader = WebUploader.create({
                mode:'html5',
                auto:true,
                multiple:false,
                pick:{
                    id:'filePicker'
                },
                token:{
                    data:{ configkey:'school_fsfile' }
                }
            });
            // 单个文件加入队列
            uploader.on('fileQueued',function(file){
                var attachment = { name:file.name,_id:file.id },ext = file.ext.toLowerCase();

                attachment._complete = false;
                attachment._name = Utils.mb_cutstr(attachment.name,25);
                attachment._statusText = '上传';
                uploader.getImgDataUrl(file,function(url){
                    attachment._thumb = url;
                },function(){
                    attachment._thumb = attachmentMap[ext]?attachmentMap[ext]:attachmentMap['unknow'];
                });
                $scope.formData.config.unshift(attachment);
                $scope.$apply();
                
            });

            uploader.on('uploadProgress',function(file,percentage){
                var id = file.id,
                    progress = percentage*100, 
                    attachmentList = $scope.formData.config, 
                    attachment = Utils.getItem(attachmentList,{_id:id});

                if( percentage == 1 ){
                    attachment._statusText = '正在保存';
                }else {
                    attachment._statusText = Math.floor(progress)+'%';
                }
                
                $scope.$apply();
                
            });

            uploader.on('uploadError',function(file ,result){
                var id = file.id, 
                    message = result.message || '上传失败',
                    attachmentList = $scope.formData.config, 
                    attachment = Utils.getItem(attachmentList,{_id:id});
                
                attachmentList._status = 'error';
                attachmentList._statusText = '失败';
                Utils.removeItem(attachmentList,attachment,'id');
                mNotice(message,'error');
                $scope.$apply();
               
            });

            // 上传成功
            uploader.on('uploadSuccess',function(file ,result ){
                var id = file.id,
                    url = result.data.url,
                    attachmentList = $scope.formData.config, 
                    attachment = Utils.getItem(attachmentList,{_id:id});
                
                attachment.url = url;
                attachment._status = 'success';
                attachment._statusText = '成功';
                $scope.$apply();
                
            });
            uploader.on('uploadComplete',function(file){
                var id = file.id, 
                    attachmentList = $scope.formData.config, 
                    attachment = Utils.getItem(attachmentList,{_id:id}) || {};

                attachment._complete = true;
                $scope.$apply();
            });

            mLoading.show();
            homeworkDao.get( queryData ,function(result){
                var data = result.data || {},work = data.homework || {},name = work.name || '', 
                    title = (data.workstatus == 0)?'提交作业':'修改作业';

                IGrow.log('作业详情',data);
                data.config = data.config || [];
                data.reply = data.reply || '';
                document.title = title + '--' + name;

                angular.forEach(data.config, function(item,_){
                    var name = item.name || '', ext;

                    _addAttachment(item);
                });

                $scope.homework = data;
                $scope.formData.config = data.config;
                $scope.formData.reply = data.reply;


            },function(result){
                mNotice(result.message,'error');
            },function(){
                mLoading.hide();
            });


            function _addAttachment(attachment){
                var name = attachment.name || '', ext;

                ext = Utils.getFileExt(name);
                attachment._name = Utils.mb_cutstr(attachment.name,25);
                if( attachmentMap[ext] ){
                    attachment._thumb = attachmentMap[ext];

                }else if( imageTypes.indexOf(ext)>-1 && attachment.url ){
                  
                    attachment._type = 'image';
                    attachment._thumb = Utils.addPhotoSuffix(attachment.url,'!square.75');

                }else{
                    attachment._thumb = attachmentMap['unknow'];
                }
                attachment._complete = true;
                return attachment;
            }
            $scope.remove = function(attachment){
                var formData = $scope.formData, attachmentList = formData.config;

                Utils.removeItem(attachmentList,attachment,'url');
            };
            $scope.save = function(){
                var formData = $scope.formData,attachmentList = $.extend(true,[],formData.config),config = [];

                angular.forEach(attachmentList, function(item){
                    delete item['$$hashKey'];
                    for(var key in item){
                        if( key.indexOf('_') === 0 ) {
                            delete item[key];
                        }
                    }
                    if(item.url){
                        config.push(item);
                    }
                });

                mLoading.show();
                formData.config = config;
                homeworkDao.submitwork(formData,function(){
                    mNotice('保存成功','success',1500);
                    setTimeout(function(){
                        location.hash = '#/student/homework/'+homeworkid;
                    }, 1500);
                    

                },function(result){
                    mNotice(result.message,'error')
                },function(){
                    mLoading.hide();
                });
            };

            bind();
            function bind(){
                $('.homework-submit-wrapper').off('click','.homework-attachment-image',previewPhoto);
                $('.homework-submit-wrapper').on('click', '.homework-attachment-image',previewPhoto);
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