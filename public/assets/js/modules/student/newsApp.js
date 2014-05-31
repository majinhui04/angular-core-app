/*
 *   日常表现
 *   包含老师的考评以及家长发布的动态
 *   @todo 家长动态未显示
 */
define(function(require, exports, module) {
    var libEmotion = require('emotion');
    var Utils = require('utils');
    var app = require('mainApp');


    app.register.controller('newsController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var IGrow = window['IGrow'],
                student = IGrow.student,
                user = IGrow.user,
                semester = IGrow.semester,
                reviewDao = resource('/yo/check/group/result'),
                newsDao = resource('/book/tweet'),
                reviewListExtra = {},
                newsListExtra = {},
                noAvatar = IGrow['constant']['noAvatar'],
                _pagesize = 10;
            

            $scope.page = 1;
            $scope.list = function(options){
                var opts = options || {},
                    page = opts.page || 1,
                    promiseReview,
                    promiseNews,
                    reviewList = [],
                    newsList = [],
                    reviewQueryData = {
                        schoolid:student.schoolid,
                        semesterid:semester.id,
                        studentid:student.id,
                        classid:student.classid,
                        _page:page,
                        _pagesize:_pagesize,
                        //_dateformat:'Y-m-d',
                        _relatedfields:'type.name,groupsurface.*,operator.realname,operator.avatar'
                    };

                mLoading.show();
                // 日常表现
                promiseReview = reviewDao.list( reviewQueryData ,function(result){
                    var list = reviewList = result.data || [];
                    
                    reviewListExtra = result.extra;
                    IGrow.log('日常表现',list);

                    angular.forEach( list, function( item,_ ) {
                        var operator = item.operator || ( item.operator = {} );

                        operator.avatar = operator.avatar?operator.avatar+'!72':noAvatar;
                    });
                    if($scope.reviewList){
                        $scope.reviewList = $scope.reviewList.concat(list);
                    }else{
                        $scope.reviewList = list;
                    }
                    
                    

                },function(result){
                    mNotice(result.message,'error');
                });
                // 学生动态
                promiseNews = newsDao.list( { studentid:student.id,semesterid:semester.id, _pagesize:_pagesize,_page:page } ,function(result){
                    var list = result.data || [], newsList = [];
                    
                    newsListExtra = result.extra;
                    IGrow.log('学生动态',list);

                    angular.forEach( list, function( item,_ ) {
                        var content = item.content;

                        if(content) {
                            content.images = content.images || [];
                            content.videos = content.videos || [];
                            content.text = content.text || '';
                            content.text = libEmotion.replace_em(content.text);
                            if(content.owner && content.owner == 4 && student.id == item.studentid ) {
                                content.isOwner = true;
                                content.author = {
                                    name:student.name+'家长',
                                    avatar:user.avatar?user.avatar+'!72':noAvatar
                                };
                            }else {
                                content.author = {
                                    name:'班主任',
                                    avatar:noAvatar
                                };
                            }
                            newsList.push(item);
                        }
                        
                            
                        
                    });
                    if($scope.newsList){
                        $scope.newsList = $scope.newsList.concat(newsList);
                    }else{
                        $scope.newsList = newsList;
                    }

                },function(result){
                    
                });

                $q.all([ promiseReview, promiseNews ]).then(function(){

                    // 是否显示更多
                    if( reviewListExtra.page<Math.ceil(reviewListExtra.total/reviewListExtra.pagesize) || newsListExtra.page<Math.ceil(newsListExtra.total/newsListExtra.pagesize) ) {
                        $scope.flag = true;
                    }else {
                        $scope.flag = false;
                    }
                   
                    //console.log('$scope.flag ',$scope.flag )
                    mLoading.hide();

                }, function(){
                    mLoading.hide();
                });
            };
            $scope._delete = function(news){
                var newsList = $scope.newsList || [];

                mLoading.show();
                newsDao._delete({ id:news.id,semesterid:semester.id },function(){
                    Utils.removeItem(newsList,news,'id');

                },function(result){
                    mNotice(result.message);
                },function(){
                    mLoading.hide();
                });
            };
            $scope.toDeleteView = function(news) {
                Utils.confirm('确定删除吗?', function(){
                    $scope._delete(news);
                });
            };
            $scope.showMore = function(){
                var page = (++$scope.page);

                $scope.list( { page:page } );
            };

            // 预览照片
            function previewPhoto(e){
                var $target = $(e.currentTarget),
                    $photo = $target.find('img'),
                    $parent = $target.closest('.news-images-list'),
                    url = $photo.attr('data-original'),current = url + '!small.240',pics = [];

                $parent.find('img').each(function(_,item) {
                    var url = $(item).attr('data-original') + '!small.240';

                    pics.push(url);
                });

                WeixinApi.imagePreview( current ,pics );
                

            }
            function bind(){
                $('.student-news-wrapper').off('click', '.news-images-item', previewPhoto);
                $('.student-news-wrapper').on('click', '.news-images-item', previewPhoto);
            }
           

            $scope.list();
            bind();
        }
    ]);


    return app;
});