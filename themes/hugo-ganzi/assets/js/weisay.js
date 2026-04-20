//滚屏
jQuery(document).ready(function(){
jQuery('.roll-top').click(function(){jQuery('html,body').animate({scrollTop: '0px'}, 800);}); 
});

//手机版菜单展开
jQuery(document).ready(function(){
	jQuery('nav#menu').mmenu({
		extensions : [ 'left' ],
		counters : true,
		navbar : {
			title : '导航'
		},
	});
var $menu = $('nav#menu-right');
	$menu.mmenu({
		offCanvas : {
			position : 'right'
			},
		navbar : {
			title : '侧边栏'
			},
	});
});

//侧边栏TAB效果
jQuery(document).ready(function(){
	jQuery('.tabnav li').click(function(){
		jQuery(this).addClass("selected").siblings().removeClass();
		jQuery(".tab-content > ul").eq(jQuery('.tabnav li').index(this)).fadeIn(800).siblings().hide();
	});
});

//隐藏/显示侧边栏
jQuery(document).ready( function ($) {
	$( '.close-sidebar' ).click( function () {
		$( '.close-sidebar,.sidebar' ).hide();
		$( '.show-sidebar' ).show();
		$(".main").addClass("main-all");				
	});
	$( '.show-sidebar' ).click( function () {
		$( '.show-sidebar' ).hide();
		$( '.close-sidebar,.sidebar' ).show();
		$(".main").removeClass("main-all");
	});
});

//图片渐隐
jQuery(function () {
	jQuery('.thumbnail img').hover(
		function() {jQuery(this).fadeTo("fast", 0.5);},
		function() {jQuery(this).fadeTo("fast", 1);
	});
});

//手风琴
jQuery(document).ready(function(){
	  $('.accordion-box').on('click', '.accordion-head', function() {
		  $(this).next().slideToggle('200', function() {
		  $('.accordion-head').toggleClass('accordion-show', $(this).is(':visible'));
		});
	  });
});

//评论表情
jQuery(document).ready(function(){
        $(".emoji").click(function() {
            $(".emoji-smilies").animate({
                opacity: "toggle"
            },
            300);
            return false
        });
        $(".emoji-smilies a").click(function() {
            $(".emoji-smilies").animate({
                opacity: "toggle",
            },
            300)
        });
});

//文章编辑hover
jQuery(document).ready(function(){
	jQuery('.post').hover(
		function() {
			jQuery(this).find('.edit').stop(true,true).fadeIn();
		},
		function() {
			jQuery(this).find('.edit').stop(true,true).fadeOut();
		}
	);
});

//新窗口打开
jQuery(document).ready(function(){
	jQuery("a[rel='external'],a[rel='external nofollow']").click(
	function(){window.open(this.href);return false})
});

//赏弹层
jQuery(document).ready(function(){
	jQuery('.zanzhu').click(function(){
		jQuery('.shang-bg').fadeIn(200);
		jQuery('.shang-content').fadeIn(400);
	});
	jQuery('.shang-bg, .shang-close').click(function(){
		jQuery('.shang-bg, .shang-content').fadeOut(400);
	});
});

//顶部导航下拉菜单，包含延迟效果
(function($){
$.fn.hoverDelay = function(selector, options) {
 var defaults = {
 hoverDuring: 200,
 outDuring: 150,
 hoverEvent: $.noop,
 outEvent: $.noop
 };
 var sets = $.extend(defaults, options || {});
 return jQuery(document).on("mouseenter mouseleave", selector, function(event) {
 var that = this;
 if(event.type == "mouseenter"){
clearTimeout(that.outTimer);
that.hoverTimer = setTimeout(
function(){sets.hoverEvent.apply(that)},sets.hoverDuring);
 }else {
clearTimeout(that.hoverTimer);
that.outTimer = setTimeout(
function(){sets.outEvent.apply(that)},sets.outDuring);
 }
 });
}
})(jQuery);
jQuery(document).ready(function(){
jQuery(".mainmenu li,.top-page li").each(function(){
if($(this).find("ul").length!=0){$(this).find("a:first").addClass("hasmenu")};
});
jQuery(".mainmenu ul li,.top-page ul li").hoverDelay(".mainmenu ul li,.top-page ul li", {
	hoverEvent: function(){
	jQuery(this).children("ul").show();
},
	outEvent: function(){
	jQuery(this).children("ul").hide();
}
});
jQuery(".qrcode-scan").hoverDelay(".qrcode-scan", {
	hoverEvent: function(){
		jQuery(".qrcode-img").show();
	},
	outEvent: function(){
		jQuery(".qrcode-img").hide();
	}
});
});

//检查是否是Windows11
if(navigator.userAgentData){//判断当前环境是否支持
	navigator.userAgentData.getHighEntropyValues(["platformVersion"])
	 .then(ua => {
		if (navigator.userAgentData.platform === "Windows") {//判断是否是Windows系统
		const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
		if (majorPlatformVersion >= 13) {//判断是否是win11或以上
		document.cookie = "win11=true;path=/";//写入cookie
		}
	}
});}