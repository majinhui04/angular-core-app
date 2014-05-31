/*
 *   用户相册
 *   
 */
define(function(require, exports, module) {
    var Utils = require('utils');
    var app = require('mainApp');


    app.register.controller('userAlbumController', ['$scope', '$q', 'mLoading','mNotice','resource','$routeParams',
        function($scope, $q, mLoading,mNotice,resource,$routeParams) {
            var userAlbumDao = resource('/yo/useralbum'),
                albumDao = resource('/yo/album'),
                IGrow = window['IGrow'],
                user = IGrow.user,
                uid = $routeParams.uid || user.uid,
                noCover = IGrow['constant']['noCover'],
                queryData = {
                    uid:uid,
                    _page:1,
                    _pagesize:1000
                };
        
            if($routeParams.uid){
                $scope.isOwner = (user.uid == $routeParams.uid)?true:false;
            }else{
                $scope.isOwner = true;
            }

            $scope.uid = uid;
            mLoading.show('正在加载...');
            userAlbumDao.list(queryData).then(function(result){
                var albumList = result.data || [];

                mLoading.hide();
                angular.forEach(albumList, function(album,i){

                    album.url = album.url? ( album.url + '!square.75' ):noCover;
                });
               
                $scope.albumList = albumList;

            }, function(result){
                mLoading.hide();
                mNotice(result.message,'error');
            });
            

            $scope.swipeLeft = function(album,e){
                var $target = $(e.currentTarget);
               
                $target.css('transform','translateX(-50px)');
 
            };
            $scope.swipeRight = function(album,e){
                var $target = $(e.currentTarget);
               
                $target.css('transform','translateX(0px)');
            }
            $scope.toAddView = function($event){
                var $target = $()

                $scope.formData = {};
       
            };
            $scope.toDeleteView = function(album){
                $scope.formData = angular.copy(album);

                Utils.confirm('确定删除?',function(){
                    mLoading.show('正在处理');
                    albumDao._delete( { id:album.id } ).then(function(){
                        mLoading.hide();
                        mNotice('删除成功','success',1000);
                        syncAlbumList(album,'delete');

                    }, function(result){
                        mLoading.hide();
                        mNotice(result.message,'error');
                    });
                    
                });
               
                    
                
            };
           
            $scope.saveAlbum = function(album){
                if(!album.name){
                    mNotice('名称必填','info');
                    return ;
                }
                if(album.id){
                    $scope.updateAlbum(album);
                }else{
                    $scope.addAlbum(album);
                }
            };
            $scope.updateAlbum = function(album) {
                mLoading.show('正在处理');
                albumDao.update( { id:album.id , name:album.name } ).then(function(){
                    mLoading.hide();
                    mNotice('修改成功','success',1000);
                    syncAlbumList(album,'update');

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                })
            };
            // name accesstype 必填项，相册访问类型，0非公开 1公开 2同班级可见
            $scope.addAlbum = function(album) {
                mLoading.show('正在处理');
                userAlbumDao.create( {  name:album.name ,accesstype:1 } ).then(function(result){
                    var data = result.data || {};

                    album.id = data.id;
                    album.photocount = 0;
                    album.url = noCover;
                    mLoading.hide();
                    //mNotice('添加成功','success',1000);
 
                    location.hash = '#/user/album/' + album.id;
                    //syncAlbumList(album,'create');


                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                })
            }

            function syncAlbumList(target,action){
                var albumList = $scope.albumList || [];

                if(action == 'create'){
                    albumList.unshift(target);
                    return;
                }
                for (var i = 0; i < albumList.length; i++ ){
                    album = albumList[i];
                    if(target.id === album.id) {
                        if(action == 'update'){
                            album.name = target.name;

                        }else{
                            albumList.splice(i,1);
                        }
                        break
                        
                    }
                }
                
            }

           

        }
    ]);


    return app;
});