/**
 * @QQ表情
 **/
 
define(function (require, exports, module) {

    var libScroll = require('scroll');

    var ICON = {
        "闭嘴": "e107.gif",
        "NO": "e188.gif",
        "跳跳": "e192.gif",
        "怄火": "e194.gif",
        "转圈": "e195.gif",
        "磕头": "e196.gif",
        "回头": "e197.gif",
        "跳绳": "e198.gif",
        "闭嘴": "e107.gif",
        "\u5472\u7259": "e113.gif",
        "\u8c03\u76ae": "e112.gif",
        "\u6d41\u6c57": "e127.gif",
        "\u5077\u7b11": "e120.gif",
        "\u518d\u89c1": "e139.gif",
        "\u6572\u6253": "e138.gif",
        "\u64e6\u6c57": "e140.gif",
        "\u732a\u5934": "e162.gif",
        "\u73ab\u7470": "e163.gif",
        "\u6d41\u6cea": "e105.gif",
        "\u5927\u54ed": "e109.gif",
        "\u5618..": "e133.gif",
        "\u9177": "e116.gif",
        "\u6293\u72c2": "e118.gif",
        "\u59d4\u5c48": "e149.gif",
        "\u4fbf\u4fbf": "e174.gif",
        "\u70b8\u5f39": "e170.gif",
        "\u83dc\u5200": "e155.gif",
        "\u53ef\u7231": "e121.gif",
        "\u8272": "e102.gif",
        "\u5bb3\u7f9e": "e106.gif",
        "\u5f97\u610f": "e104.gif",
        "\u5410": "e119.gif",
        "\u5fae\u7b11": "e100.gif",
        "\u53d1\u6012": "e111.gif",
        "\u5c34\u5c2c": "e110.gif",
        "\u60ca\u6050": "e126.gif",
        "\u51b7\u6c57": "e117.gif",
        "\u7231\u5fc3": "e166.gif",
        "\u793a\u7231": "e165.gif",
        "\u767d\u773c": "e122.gif",
        "\u50b2\u6162": "e123.gif",
        "\u96be\u8fc7": "e115.gif",
        "\u60ca\u8bb6": "e114.gif",
        "\u7591\u95ee": "e132.gif",
        "\u7761": "e108.gif",
        "\u4eb2\u4eb2": "e152.gif",
        "\u61a8\u7b11": "e128.gif",
        "\u7231\u60c5": "e190.gif",
        "\u8870": "e136.gif",
        "\u6487\u5634": "e101.gif",
        "\u9634\u9669": "e151.gif",
        "\u594b\u6597": "e130.gif",
        "\u53d1\u5446": "e103.gif",
        "\u53f3\u54fc\u54fc": "e146.gif",
        "\u62e5\u62b1": "e178.gif",
        "\u574f\u7b11": "e144.gif",
        "\u98de\u543b": "e191.gif",
        "\u9119\u89c6": "e148.gif",
        "\u6655": "e134.gif",
        "\u5927\u5175": "e129.gif",
        "\u53ef\u601c": "e154.gif",
        "\u5f3a": "e179.gif",
        "\u5f31": "e180.gif",
        "\u63e1\u624b": "e181.gif",
        "\u80dc\u5229": "e182.gif",
        "\u62b1\u62f3": "e183.gif",
        "\u51cb\u8c22": "e164.gif",
        "\u996d": "e161.gif",
        "\u86cb\u7cd5": "e168.gif",
        "\u897f\u74dc": "e156.gif",
        "\u5564\u9152": "e157.gif",
        "\u74e2\u866b": "e173.gif",
        "\u52fe\u5f15": "e184.gif",
        "OK": "e189.gif",
        "\u7231\u4f60": "e187.gif",
        "\u5496\u5561": "e160.gif",
        "\u6708\u4eae": "e175.gif",
        "\u5200": "e171.gif",
        "\u53d1\u6296": "e193.gif",
        "\u5dee\u52b2": "e186.gif",
        "\u62f3\u5934": "e185.gif",
        "\u5fc3\u788e": "e167.gif",
        "\u592a\u9633": "e176.gif",
        "\u793c\u7269": "e177.gif",
        "\u8db3\u7403": "e172.gif",
        "\u9ab7\u9ac5": "e137.gif",
        "\u6325\u624b": "e199.gif",
        "\u95ea\u7535": "e169.gif",
        "\u9965\u997f": "e124.gif",
        "\u56f0": "e125.gif",
        "\u5492\u9a82": "e131.gif",
        "\u6298\u78e8": "e135.gif",
        "\u62a0\u9f3b": "e141.gif",
        "\u9f13\u638c": "e142.gif",
        "\u6eb4\u5927\u4e86": "e143.gif",
        "\u5de6\u54fc\u54fc": "e145.gif",
        "\u54c8\u6b20": "e147.gif",
        "\u5feb\u54ed\u4e86": "e150.gif",
        "\u5413": "e153.gif",
        "\u7bee\u7403": "e158.gif",
        "\u4e52\u4e53": "e159.gif"
    };
    
    /*var tpl = '<div class="expreBox">'+
                '<ul class="expreCon expreConNew" id="exp_emo0">'+
                    '<li class="bg1" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="微笑"></a>'+
                        '<a href="javascript:void(0);" title="撇嘴"></a>'+
                        '<a href="javascript:void(0);" title="色"></a>'+
                        '<a href="javascript:void(0);" title="发呆"></a>'+
                        '<a href="javascript:void(0);" title="得意"></a>'+
                        '<a href="javascript:void(0);" title="流泪"></a>'+
                        '<a href="javascript:void(0);" title="害羞"></a>'+
                        '<a href="javascript:void(0);" title="闭嘴"></a>'+
                        '<a href="javascript:void(0);" title="睡"></a>'+
                        '<a href="javascript:void(0);" title="大哭"></a>'+
                        '<a href="javascript:void(0);" title="尴尬"></a>'+
                        '<a href="javascript:void(0);" title="发怒"></a>'+
                        '<a href="javascript:void(0);" title="调皮"></a>'+
                        '<a href="javascript:void(0);" title="呲牙"></a>'+
                        '<a href="javascript:void(0);" title="惊讶"></a>'+
                        '<a href="javascript:void(0);" title="难过"></a>'+
                        '<a href="javascript:void(0);" title="酷"></a>'+
                        '<a href="javascript:void(0);" title="冷汗"></a>'+
                        '<a href="javascript:void(0);" title="抓狂"></a>'+
                        '<a href="javascript:void(0);" title="吐"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                    '<li class="bg2" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="偷笑"></a>'+
                        '<a href="javascript:void(0);" title="可爱"></a>'+
                        '<a href="javascript:void(0);" title="白眼"></a>'+
                        '<a href="javascript:void(0);" title="傲慢"></a>'+
                        '<a href="javascript:void(0);" title="饥饿"></a>'+
                        '<a href="javascript:void(0);" title="困"></a>'+
                        '<a href="javascript:void(0);" title="惊恐"></a>'+
                        '<a href="javascript:void(0);" title="流汗"></a>'+
                        '<a href="javascript:void(0);" title="憨笑"></a>'+
                        '<a href="javascript:void(0);" title="大兵"></a>'+
                        '<a href="javascript:void(0);" title="奋斗"></a>'+
                        '<a href="javascript:void(0);" title="咒骂"></a>'+
                        '<a href="javascript:void(0);" title="疑问"></a>'+
                        '<a href="javascript:void(0);" title="嘘.."></a>'+
                        '<a href="javascript:void(0);" title="晕"></a>'+
                        '<a href="javascript:void(0);" title="折磨"></a>'+
                        '<a href="javascript:void(0);" title="衰"></a>'+
                        '<a href="javascript:void(0);" title="骷髅"></a>'+
                        '<a href="javascript:void(0);" title="敲打"></a>'+
                        '<a href="javascript:void(0);" title="再见"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                    '<li class="bg3" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="擦汗"></a>'+
                        '<a href="javascript:void(0);" title="抠鼻"></a>'+
                        '<a href="javascript:void(0);" title="鼓掌"></a>'+
                        '<a href="javascript:void(0);" title="溴大了"></a>'+
                        '<a href="javascript:void(0);" title="坏笑"></a>'+
                        '<a href="javascript:void(0);" title="左哼哼"></a>'+
                        '<a href="javascript:void(0);" title="右哼哼"></a>'+
                        '<a href="javascript:void(0);" title="哈欠"></a>'+
                        '<a href="javascript:void(0);" title="鄙视"></a>'+
                        '<a href="javascript:void(0);" title="委屈"></a>'+
                        '<a href="javascript:void(0);" title="快哭了"></a>'+
                        '<a href="javascript:void(0);" title="阴险"></a>'+
                        '<a href="javascript:void(0);" title="亲亲"></a>'+
                        '<a href="javascript:void(0);" title="吓"></a>'+
                        '<a href="javascript:void(0);" title="可怜"></a>'+
                        '<a href="javascript:void(0);" title="菜刀"></a>'+
                        '<a href="javascript:void(0);" title="西瓜"></a>'+
                        '<a href="javascript:void(0);" title="啤酒"></a>'+
                        '<a href="javascript:void(0);" title="篮球"></a>'+
                        '<a href="javascript:void(0);" title="乒乓"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                    '<li class="bg4" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="咖啡"></a>'+
                        '<a href="javascript:void(0);" title="饭"></a>'+
                        '<a href="javascript:void(0);" title="猪头"></a>'+
                        '<a href="javascript:void(0);" title="玫瑰"></a>'+
                        '<a href="javascript:void(0);" title="凋谢"></a>'+
                        '<a href="javascript:void(0);" title="示爱"></a>'+
                        '<a href="javascript:void(0);" title="爱心"></a>'+
                        '<a href="javascript:void(0);" title="心碎"></a>'+
                        '<a href="javascript:void(0);" title="蛋糕"></a>'+
                        '<a href="javascript:void(0);" title="闪电"></a>'+
                        '<a href="javascript:void(0);" title="炸弹"></a>'+
                        '<a href="javascript:void(0);" title="刀"></a>'+
                        '<a href="javascript:void(0);" title="足球"></a>'+
                        '<a href="javascript:void(0);" title="瓢虫"></a>'+
                        '<a href="javascript:void(0);" title="便便"></a>'+
                        '<a href="javascript:void(0);" title="月亮"></a>'+
                        '<a href="javascript:void(0);" title="太阳"></a>'+
                        '<a href="javascript:void(0);" title="礼物"></a>'+
                        '<a href="javascript:void(0);" title="拥抱"></a>'+
                        '<a href="javascript:void(0);" title="强"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                    '<li class="bg5" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="弱"></a>'+
                        '<a href="javascript:void(0);" title="握手"></a>'+
                        '<a href="javascript:void(0);" title="胜利"></a>'+
                        '<a href="javascript:void(0);" title="抱拳"></a>'+
                        '<a href="javascript:void(0);" title="勾引"></a>'+
                        '<a href="javascript:void(0);" title="拳头"></a>'+
                        '<a href="javascript:void(0);" title="差劲"></a>'+
                        '<a href="javascript:void(0);" title="爱你"></a>'+
                        '<a href="javascript:void(0);" title="NO"></a>'+
                        '<a href="javascript:void(0);" title="OK"></a>'+
                        '<a href="javascript:void(0);" title="爱情"></a>'+
                        '<a href="javascript:void(0);" title="飞吻"></a>'+
                        '<a href="javascript:void(0);" title="跳跳"></a>'+
                        '<a href="javascript:void(0);" title="发抖"></a>'+
                        '<a href="javascript:void(0);" title="怄火"></a>'+
                        '<a href="javascript:void(0);" title="转圈"></a>'+
                        '<a href="javascript:void(0);" title="磕头"></a>'+
                        '<a href="javascript:void(0);" title="回头"></a>'+
                        '<a href="javascript:void(0);" title="跳绳"></a>'+
                        '<a href="javascript:void(0);" title="挥手"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                '</ul>'+
        '</div>'+   
        '<p class="pNumCon" id="exp_emo0_page">'+
            '<a href="javascript:void(0);" class=" pNumOn  pNum "></a>'+
            '<a href="javascript:void(0);" class=" pNum "></a>'+
            '<a href="javascript:void(0);" class=" pNum "></a>'+
            '<a href="javascript:void(0);" class=" pNum "></a>'+
            '<a href="javascript:void(0);" class=" pNum "></a>'+
        '</p>';*/
    var tpl = '<div class="expreBox">'+
                '<ul class="expreCon expreConNew" id="exp_emo0">'+
                    '<li class="bg1" style="background-position: 50% 50%;">'+
                        '<a href="javascript:void(0);" title="微笑"></a>'+
                        '<a href="javascript:void(0);" title="撇嘴"></a>'+
                        '<a href="javascript:void(0);" title="色"></a>'+
                        '<a href="javascript:void(0);" title="发呆"></a>'+
                        '<a href="javascript:void(0);" title="得意"></a>'+
                        '<a href="javascript:void(0);" title="流泪"></a>'+
                        '<a href="javascript:void(0);" title="害羞"></a>'+
                        '<a href="javascript:void(0);" title="闭嘴"></a>'+
                        '<a href="javascript:void(0);" title="睡"></a>'+
                        '<a href="javascript:void(0);" title="大哭"></a>'+
                        '<a href="javascript:void(0);" title="尴尬"></a>'+
                        '<a href="javascript:void(0);" title="发怒"></a>'+
                        '<a href="javascript:void(0);" title="调皮"></a>'+
                        '<a href="javascript:void(0);" title="呲牙"></a>'+
                        '<a href="javascript:void(0);" title="惊讶"></a>'+
                        '<a href="javascript:void(0);" title="难过"></a>'+
                        '<a href="javascript:void(0);" title="酷"></a>'+
                        '<a href="javascript:void(0);" title="冷汗"></a>'+
                        '<a href="javascript:void(0);" title="抓狂"></a>'+
                        '<a href="javascript:void(0);" title="吐"></a>'+
                        '<a href="javascript:void(0);"></a>'+
                    '</li>'+
                '</ul>'+
        '</div>'+   
        '<p class="pNumCon" id="exp_emo0_page">'+
            '<a href="javascript:void(0);" class=" pNumOn  pNum "></a>'+
        '</p>';

    module.exports = {
        init:function(options) {
            var opts = options || {} , 
                $container = $(opts.container),
                $textarea = opts.textarea?$(opts.textarea):$('#content'),
                $select = opts.select?$(opts.select):$('.expreSelect');

            $container.html(tpl);

            libScroll.initScroll('.expreBox ul', true, 'body', 'pNumOn');

            // 表情按钮选中后 显示表情列表
            $select.bind('click', function(){
                var target = $(this);
                target.toggleClass('expreSelectOn');
                if(target.hasClass('expreSelectOn')){
                    $container.show();
                }else{
                    $container.hide();
                }
            });
            
            $container.find(".expreCon li a").each(function(i){
                
                jQuery(this).on("click", function() {
                    var title = jQuery(this).attr("title");
                    
                    if($textarea) {
                        var content = $textarea.val();
                        if(!title) {
                            if(content && content.lastIndexOf(']') == content.length - 1) {
                                var LeftIndex = content.lastIndexOf('[');
                                content = content.substring(0, LeftIndex);
                            } else {
                                content = content.substring(0, content.length - 1);
                            }
                        } else {
                            content = content + "[" + title + "]";
                        }
                        $textarea.val(content);
                    }
                });
            });

        },
        replace_em:function(str) {
            var str = str || '' , prefix = '/assets/img/news/emotion/',qqFace = '/assets/img/news/emotion1/';

            // 为了兼容成长档案里的表情
            str = str.replace(/\</g,'&lt;');
            str = str.replace(/\>/g,'&gt;');
            str = str.replace(/\n/g,'<br/>');
            str = str.replace(/\[em_([0-9]*)\]/g,'<img src="'+qqFace+'/$1.gif" border="0" />');

            return str.replace(/\[(.*?)\]/igm , function(match, key) {
                var url;
                if(typeof ICON[key] != 'undefined'){
                    url = prefix + ICON[key];
                    return '<img src="'+url+'" border="0" />';
                }
                return match;
            });
        }
 
 
    };
});