(function(){
    window['API'] = {
        map:{
            '/user/login':{
                local:'/api/user/validate',
                server:'http://192.168.1.101:8080/newmedia/user/login',
                description:'登录验证'
            },
            '/user/get':{
                local:'/api/user/get',
                //server:'http://192.168.1.101:8080/newmedia/user/get',
                description:'获取用户信息'
            },
            '/test/get':{
                local:'/api/test/get',
                //server:'http://192.168.1.101:8080/newmedia/topic/list',
                description:'测试而已',
            },
            '/test/update':{
                local:'/api/test/get',
                server:'',
                description:'update 测试而已'
            }
        }
        
    };
})()