/*
 *   Test
 *   
 */
define(function(require, exports, module) {
    
   
    var app = require('dashboardApp');

    app.register.controller('testCtrl', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            console.log(111);
            var testDao = resource('/test');


            testDao.get({},function(result){
                console.log('testDao.get',result);
            });

            testDao.update({a:1,b:'撒旦'},function(result){
                console.log('testDao.post',result);
            });
            
           

        }
    ]);


    return app;
});