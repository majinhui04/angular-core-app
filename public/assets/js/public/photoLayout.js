define(function(){
    jQuery.fn.doPhotoLayout = function(options){
        var opts = options || {};
        var imgItem = opts.imgItem || '.imgItem';
        var border = opts.border || 5;//图片之间的边距
        var $container = $(this);
        var $imgItems = $container.find(imgItem);
        var index = 1;
        //保存图片初始宽高
        var widths = [];
        var heights = [];
        var timeStamp = new Date().valueOf();
        var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        $container.attr('doPhotoLayout',timeStamp);
        //console.log('winWidth',winWidth)
        // 开始
        run();

        
        function run(){
            prepare().done(function(){
                doPhotoLayout();
                opts.callback && opts.callback();
            });
        } 
        
        function getWidths(){
            /*if(typeof(widths)=="undefined"){
                var $items = getItems();
                widths = new Array();
                $.each($items,function(key,val){
                    var $imgs = $(this).find("img");
                    widths[key] = $imgs.width();
                });
            }*/
            var tmpWidths = widths.slice();//不污染原数组
            return tmpWidths;
        }
        function getHeights(){
            /*if(typeof(heights)=="undefined"){
                var $items = getItems();
                heights = new Array();
                $.each($items,function(key,val){
                    var $imgs = $(this).find("img");
                    heights[key] = $imgs.height();
                });
            }*/
            var tmpHeights = heights.slice();//不污染原数组
            return tmpHeights;
        }
           
       
        function getContainerWidth() {
            if(opts.containerWidth){
                return options.containerWidth;
            }
            if( $container.parent().length ){
                return $container.parent().width();
            }
            return winWidth;
        }
        //判断浏览器宽度范围，相当于media-query
        function getStandardHeight(){
            if(opts.imgHeight){
                return opts.imgHeight;
            }
            var sHeight = 0;
            var bWidth = getContainerWidth();
            if(bWidth <= 360){
                sHeight = 100;
                
            }
            else if(bWidth <= 400){
                sHeight = 140;
                
            }
            else if(bWidth <= 480){
                sHeight = 150;
                
            }
            else if(bWidth <= 550){
                sHeight = 160;
                
            }
            else if(bWidth <= 640){
                sHeight = 170;
                
            }
            else if(bWidth <= 740){
                sHeight = 180;
            }
            else if(bWidth <= 800){
                sHeight = 190;
                
            }
            else if(bWidth <= 960){
                sHeight = 210;
                
            }
            else if(bWidth <= 1500){
                sHeight = 230;
                
            }
            else if(bWidth <= 1920){
                sHeight = 250;
                
            }
            else if(bWidth <= 2200){
                sHeight = 270;
                
            }
            else if(bWidth <= 2400){
                sHeight = 280;
                
            }
            else if(bWidth <= 2880){
                sHeight = 300;  
                
            }
            else if(bWidth <= 3280){
                sHeight = 320;
                
            }
            else{
                sHeight = 340;
            }
            return sHeight;
        }
        //获取图片宽 和 高
        function imgReady(url, success, error) {
            var width, height, intervalId, check, div,
                img = new Image(),
                body = document.body;
                
            img.src = url;
            
            // 从缓存中读取
            if (img.complete) {
                return success(img.width, img.height);
            }
            // 通过占位提前获取图片头部数据
            if (body) {
                div = document.createElement('div');
                div.style.cssText = 'position:absolute;left:-99999px;top:0;';
                div.appendChild(img);
                body.appendChild(div);
                width = img.offsetWidth;
                height = img.offsetHeight;
               
                check = function () {
                   
                    if (img.offsetWidth !== width || img.offsetHeight !== height) {
                        
                        clearInterval(intervalId);
                        success(img.offsetWidth, img.clientHeight);
                        img.onload = null;
                        div.innerHTML = '';
                        div.parentNode.removeChild(div);
                    };

                };
                
                intervalId = setInterval(check, 150);
            }
            
            // 加载完毕后方式获取
            img.onload = function () {
                if(img.complete){
                    var parentNode = img.parentNode;
                    success(img.width, img.height);
                    img.onload = img.onerror = null;
                    clearInterval(intervalId);
                    parentNode && parentNode.removeChild(img);
                    parentNode && body.removeChild(parentNode);
                }
                    
            };
            
            // 图片加载错误
            img.onerror = function () {
                var parentNode = img.parentNode;
                error && error();
                clearInterval(intervalId);
                parentNode && parentNode.removeChild(img);
                parentNode && body.removeChild(parentNode);
            };
            
        }
        // 获取图片的实际宽和高 widths[] = width; heights[] = height;
        function prepare(){
            var data = [];
            var photos = [],complete = 0,deferred = $.Deferred();
            var count = function(index,width,height){
                complete++;
                data.push({
                    index:index,
                    width:width,
                    height:height
                })
                if(photos.length === complete) {

                    for (var i = data.length - 1; i >= 0; i--) {
                        var _index = data[i]['index'],width = data[i]['width'],height = data[i]['height'];
                        widths[_index] = width;
                        heights[_index] = height;
                    };
                    //console.log(11111111,data)
                    deferred.resolve();
                    
                }
            };
            // 获取所有图片路径
            $imgItems.each(function(index, item) {
                var url = $(item).find('img').eq(0).attr('src');

                photos.push(url);

            });
            // 假如设定了图片宽和高 则不去计算
            if(opts.imgWidth && opts.imgHeight) {
                 // 获取图片宽和高
                for(var i = 0; i<photos.length; i++ ){
                    widths[i] = opts.imgWidth;
                    heights[i] = opts.imgHeight;     
                }
                deferred.resolve();

            }else {
                // 获取图片宽和高
                for(var i = 0; i<photos.length; i++ ){
                    (function(index){
                        imgReady(photos[i],function(width,height){
                            count(index,width,height);
                        },function(){
                            count(index,0,0);
                        });
                    })(i);
                        
                }
            }
                

            return deferred.promise();

        }
        //调整主函数
        function doPhotoLayout(){
            var sHeight = getStandardHeight();
            var bWidth = getContainerWidth();
            var $items = $imgItems;
            var widthAry = getWidths()
            var heightAry = getHeights();
            var itemsLen = $items.length || 0;
            

            if(itemsLen==0){
                var $para = $("<p>不好意思，你还没有上传图片哦</p>");
                $para.css({"font-size":"18px","text-align":"center"});
                $container.append($para);
            }
            else{
                // step 1
                //记录每个图片转化后的宽度和高度 高度均为标准高
                for(var i = 0; i < itemsLen ; i++){
                    if(heightAry[i] != sHeight){
                        widthAry[i] = Math.round(widthAry[i]*(sHeight/heightAry[i]));
                        heightAry[i] = sHeight;
                    }
                }

                // step 2
                //创建每行父容器，并寻找各自子节点
                $container.find(".photoLayoutRow").remove();//清楚旧容器
                var rowWidth = 2*border;//记录每行宽度，初始为容器左右padding宽
                var i = 0,j = 0;// i:图片索引 j:行索引
                var rowDivs = [];
                var rowSonsLen = [];
                // 将图片丢进row里
                while(i < itemsLen){
                    var rowDiv = $("<div></div>");
                    rowDiv.attr("class","photoLayoutRow");
                    rowDiv.width(bWidth-border*2);
                    rowSonsLen[j] = 0;// 每行图片的个数 初始 0 
                    for(i ; i < itemsLen ;i ++){
                        rowWidth += widthAry[i]+2*border;
                        rowDiv.append($items[i]);
                        rowSonsLen[j] += 1;
                        //装不下下一个图片则保存该行，然后继续下一行
                        if( i+1 < itemsLen && (rowWidth+widthAry[i+1]+2*border) > bWidth ){
                            rowDivs[j++] = rowDiv;
                            rowWidth = 2*border;
                            i++;
                            break;
                        }
                        else if( i+1 === itemsLen ){
                            rowDivs[j] = rowDiv;
                        }
                    }
                }

                // step 3
                // 重新计算高度以及宽度 使宽度能够填满容器宽
                var rowDivsLen = rowDivs.length;
                //只有1行不做调整
                if( rowDivsLen>1 ){
                    //计算调整后差距
                    var rowTotalWidth = 0;
                    var restAry = [];// 记录每行调整后的总宽度
                    var j = 0;//记录宽度数组下标
                    var maxLen = 0;
                    var containerWidth = 0;
                    for(var i = 0 ; i < rowDivsLen ; i++){
                        var k = j;
                        containerWidth = bWidth - 2 * border;
                        rowTotalWidth = 0;
                        maxLen += rowSonsLen[i];
                        // 计算每行的实际总宽度
                        for(j ; j < maxLen ; j++){
                            rowTotalWidth += widthAry[j];
                            containerWidth -= 2 * border;
                        }
                        //比例=目标宽度/实际宽度=目标高度/实际高度
                        //var rate = parseFloat(containerWidth/rowTotalWidth);
                        var afterHeight = Math.round(parseFloat(sHeight*containerWidth/rowTotalWidth));
                        heightAry[i] = afterHeight;
                        restAry[i] = 2*border;
                        //算出高度列表后再更新宽度列表 这时候算出的宽度有误差
                        for(k ; k < maxLen ; k++){
                            widthAry[k] = Math.round(parseFloat(widthAry[k]*afterHeight/sHeight));
                            restAry[i] += widthAry[k]+2*border;//调整后宽度
                        }
                    }

                    //调整每行的最后间距 每行可能有2px/-2px 的误差宽度
                    var gap = 0;//间距值
                    var acIndex = 0;// 图片索引
                    for (var i = 0; i < rowDivsLen; i++) {
                        gap = bWidth - restAry[i];

                        //小于容器宽度
                        if(gap > 0){
                            while(gap!=0){
                                var j = 0;
                                widthAry[acIndex+j] = widthAry[acIndex+j] + 1;
                                gap--;
                                j = (j + 1 + rowSonsLen[i]) % rowSonsLen[i];
                            }
                        }
                        //大于容器宽度
                        else if(gap < 0){
                            while(gap!=0){
                                var j = 0;
                                widthAry[acIndex+j] = widthAry[acIndex+j] - 1;
                                gap++;
                                j = (j + 1 + rowSonsLen[i]) % rowSonsLen[i];
                            }
                        }
                        acIndex += rowSonsLen[i];
                    };          
                }

                // step 4
                //把宽度和高度列表赋予图片 heightAry[i] 某行的高度
                var i = 0 , j = 0;

                // 假如定好图片宽和高 最后一行的图片若数量不足 不做撑满宽度
                if( rowDivsLen>1 && opts.imgWidth && opts.imgHeight && rowSonsLen[rowDivsLen-1]<rowSonsLen[rowDivsLen-2] ) {
                    // 每行个数是一样的
                    var rowSons = rowSonsLen[0];
                    $.each($items,function(key,val){
                        
                        $(this).css({"width":widthAry[key%rowSons],"height":heightAry[0],"margin":border});
                        var $img = $(this).find("img");
                        $img.css({"width":widthAry[key%rowSons],"height":heightAry[0]});
                        
                    });
                }else {
                    $.each($items,function(key,val){
                        $(this).css({"width":widthAry[key],"height":heightAry[i],"margin":border});
                        var $img = $(this).find("img");
                        $img.css({"width":widthAry[key],"height":heightAry[i]});
                        // 下一行 换高度 i 高度  j 行中图片数
                        if( j < rowSonsLen[i]-1 ) {
                            j++;
                        }
                        else {
                            i++;
                            j=0;
                        }
                    });
                }
                    

                
                
                $container.css("padding","0 "+border+"px");
                $container.append(rowDivs);


                /*//有如下情况则舍弃一行
                //1）原始宽高比与转换后宽高比大于rate;
                //2）转换后宽度大于原始宽度1.5倍
                //3）转换后高度大于原始高度1.5倍
                var $lastImgs = $container.find("img");
                var rate=1;
                var heightRaw=0,heightNow=0,widthRaw=0,widthNow=0;
                $.each($lastImgs,function(key,val){
                    heightRaw = parseFloat(heights[key]/widths[key]);
                    heightNow = parseFloat($(this).height()/$(this).width());
                    widthRaw = parseFloat(widths[key]/heights[key]);
                    widthNow = parseFloat($(this).width()/$(this).height());
                    if(Math.abs(heightRaw - heightNow)>rate||Math.abs(widthRaw - widthNow)>rate||heights[key]*1.5<$(this).height()||widths[key]*1.5<$(this).width()){
                        $(this).parents(".row").css("display","none");
                    }
                });*/

    
                
            }
        }
    };
});