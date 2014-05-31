/*
 *   用户密码修改
 *   
 */
define(function(require, exports, module) {
    
   
    var app = require('mainApp');


    app.register.controller('userPasswordController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
          
       
            $scope.save = function(){
                var formData = $scope.formData || {},
                    userPasswordDao = resource('/user/password');

                console.log(formData)
                if( !validate(formData) ){
                    return;
                }
                mLoading.show('正在处理');
                // oldpassword  newpassword newpassword2
                userPasswordDao.update( formData ).then(function(result){
                    mLoading.hide();
                    mNotice('密码修改成功','success',1000);
                    setTimeout(function() {
                        location.hash = '#/student/profile';
                    }, 1000);

                }, function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');

                });

            };
        
            function validate(data){
                if(!data.oldpassword){
                    mNotice('当前密码必填','warning');
                    return false;
                }
                if(!data.newpassword){
                    mNotice('新密码必填','warning');
                    return false;
                }
                if(!data.newpassword2){
                    mNotice('确认密码必填','warning');
                    return false;
                }
                if( data.newpassword2 != data.newpassword){
                    mNotice('确认密码和新密码不同','warning');
                    return false;
                }

                return true;
            }
           

        }
    ]);


    return app;
});