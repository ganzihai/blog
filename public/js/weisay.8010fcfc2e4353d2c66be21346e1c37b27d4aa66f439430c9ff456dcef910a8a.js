// 滚屏
jQuery(document).ready(function(){
jQuery('.roll-top').click(function(){jQuery('html,body').animate({scrollTop: '0px'}, 800);}); 
});

// 手机端菜单：左侧纯CSS抽屉 + 右侧mmenu
document.addEventListener('DOMContentLoaded', function() {

	// ===== 右侧侧边栏：仅手机端初始化 mmenu v9 =====
	var isMobile = window.innerWidth < 992;

	if (isMobile && document.querySelector('nav#menu-right')) {
		var rightMenu = new Mmenu('nav#menu-right', {
			offCanvas: { position: 'right' },
			navbar: { title: '侧边栏' }
		});

		function updateMmenuTheme() {
			var el = document.querySelector('nav#menu-right');
			if (!el) return;
			if (document.body.classList.contains('dark')) {
				el.classList.add('mm-menu--theme-dark');
				el.classList.remove('mm-menu--theme-white');
			} else {
				el.classList.remove('mm-menu--theme-dark');
				el.classList.add('mm-menu--theme-white');
			}
		}
		updateMmenuTheme();

		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(m) {
				if (m.attributeName === 'class') updateMmenuTheme();
			});
		});
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		// 右侧按钮绑定 mmenu API
		var sidebarBtn = document.getElementById('mobile-sidebar-btn');
		if (sidebarBtn && rightMenu.API) {
			sidebarBtn.addEventListener('click', function(e) {
				e.preventDefault();
				rightMenu.API.open();
			});
		}
	}

	// ===== 左侧导航：纯CSS抽屉，不依赖mmenu =====
	var drawer = document.getElementById('left-drawer');
	var overlay = document.getElementById('left-drawer-overlay');
	var menuBtn = document.getElementById('mobile-menu-btn');

	function openDrawer() {
		if (drawer) drawer.classList.add('is-open');
		if (overlay) overlay.classList.add('is-open');
		document.body.style.overflow = 'hidden';
	}
	function closeDrawer() {
		if (drawer) drawer.classList.remove('is-open');
		if (overlay) overlay.classList.remove('is-open');
		document.body.style.overflow = '';
	}

	if (menuBtn) {
		menuBtn.addEventListener('click', function(e) {
			e.preventDefault();
			openDrawer();
		});
	}
	if (overlay) {
		overlay.addEventListener('click', closeDrawer);
	}
	var closeBtn = document.getElementById('left-drawer-close');
	if (closeBtn) {
		closeBtn.addEventListener('click', closeDrawer);
	}
});

// 侧边栏TAB效果
jQuery(document).ready(function(){
	jQuery('.tabnav li').click(function(){
		jQuery(this).addClass("selected").siblings().removeClass();
		jQuery(".tab-content > ul").eq(jQuery('.tabnav li').index(this)).fadeIn(800).siblings().hide();
	});
});

// 隐藏/显示侧边栏
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

// 图片渐隐
jQuery(function () {
	jQuery('.thumbnail img').hover(
		function() {jQuery(this).fadeTo("fast", 0.5);},
		function() {jQuery(this).fadeTo("fast", 1);
	});
});

// 手风琴
jQuery(document).ready(function(){
	  $('.accordion-box').on('click', '.accordion-head', function() {
		  $(this).next().slideToggle('200', function() {
		  $('.accordion-head').toggleClass('accordion-show', $(this).is(':visible'));
		});
	  });
});

// 评论表情
jQuery(document).ready(function(){
        $(".emoji").click(function() {
            $(".emoji-smilies").animate({ opacity: "toggle" }, 300);
            return false
        });
        $(".emoji-smilies a").click(function() {
            $(".emoji-smilies").animate({ opacity: "toggle" }, 300)
        });
});

// 文章编辑hover
jQuery(document).ready(function(){
	jQuery('.post').hover(
		function() { jQuery(this).find('.edit').stop(true,true).fadeIn(); },
		function() { jQuery(this).find('.edit').stop(true,true).fadeOut(); }
	);
});

// 新窗口打开
jQuery(document).ready(function(){
	jQuery("a[rel='external'],a[rel='external nofollow']").click(
	function(){window.open(this.href);return false})
});

// 赏弹层
jQuery(document).ready(function(){
	jQuery('.zanzhu').click(function(){
		jQuery('.shang-bg').fadeIn(200);
		jQuery('.shang-content').fadeIn(400);
	});
	jQuery('.shang-bg, .shang-close').click(function(){
		jQuery('.shang-bg, .shang-content').fadeOut(400);
	});
});

// 顶部导航下拉菜单（含延迟效果）
(function($){
$.fn.hoverDelay = function(selector, options) {
 var defaults = { hoverDuring: 200, outDuring: 150, hoverEvent: $.noop, outEvent: $.noop };
 var sets = $.extend(defaults, options || {});
 return jQuery(document).on("mouseenter mouseleave", selector, function(event) {
  var that = this;
  if(event.type == "mouseenter"){
    clearTimeout(that.outTimer);
    that.hoverTimer = setTimeout(function(){sets.hoverEvent.apply(that)},sets.hoverDuring);
  } else {
    clearTimeout(that.hoverTimer);
    that.outTimer = setTimeout(function(){sets.outEvent.apply(that)},sets.outDuring);
  }
 });
}
})(jQuery);
jQuery(document).ready(function(){
jQuery(".mainmenu li,.top-page li").each(function(){
if($(this).find("ul").length!=0){$(this).find("a:first").addClass("hasmenu")};
});
jQuery(".mainmenu ul li,.top-page ul li").hoverDelay(".mainmenu ul li,.top-page ul li", {
	hoverEvent: function(){ jQuery(this).children("ul").show(); },
	outEvent:   function(){ jQuery(this).children("ul").hide(); }
});
jQuery(".qrcode-scan").hoverDelay(".qrcode-scan", {
	hoverEvent: function(){ jQuery(".qrcode-img").show(); },
	outEvent:   function(){ jQuery(".qrcode-img").hide(); }
});
});

// 检查是否是Windows11
if(navigator.userAgentData){
	navigator.userAgentData.getHighEntropyValues(["platformVersion"])
	 .then(ua => {
		if (navigator.userAgentData.platform === "Windows") {
		const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
		if (majorPlatformVersion >= 13) {
			document.cookie = "win11=true;path=/";
		}
	}
});
}
