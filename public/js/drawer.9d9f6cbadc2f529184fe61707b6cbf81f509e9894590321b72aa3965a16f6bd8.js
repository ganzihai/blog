document.addEventListener('DOMContentLoaded', function() {
    // 复制按钮
    document.querySelectorAll('.highlight').forEach(function(container) {
        if (container.querySelector('.copy-btn')) return;
        var button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerText = 'Copy';
        button.addEventListener('click', function() {
            var code = container.querySelector('pre').innerText;
            navigator.clipboard.writeText(code).then(function() {
                button.innerText = 'Copied!';
                setTimeout(function() { button.innerText = 'Copy'; }, 2000);
            });
        });
        container.appendChild(button);
    });

    // 左侧抽屉
    var leftDrawer = document.getElementById('left-drawer');
    var leftOverlay = document.getElementById('left-drawer-overlay');
    var leftBtn = document.getElementById('mobile-menu-btn');
    var leftClose = document.getElementById('left-drawer-close');

    function syncBodyDrawerLock() {
        var opened = (leftDrawer && leftDrawer.classList.contains('is-open')) ||
                     (rightDrawer && rightDrawer.classList.contains('is-open'));
        document.body.classList.toggle('drawer-open', opened);
    }

    function openLeft(e) {
        if(e) e.preventDefault();
        if(rightDrawer) rightDrawer.classList.remove('is-open');
        if(rightOverlay) rightOverlay.classList.remove('is-open');
        if(leftDrawer) leftDrawer.classList.add('is-open');
        if(leftOverlay) leftOverlay.classList.add('is-open');
        syncBodyDrawerLock();
    }

    function closeLeft() {
        leftDrawer.classList.remove('is-open');
        leftOverlay.classList.remove('is-open');
        syncBodyDrawerLock();
    }

    if(leftBtn) leftBtn.addEventListener('click', openLeft);
    if(leftClose) leftClose.addEventListener('click', closeLeft);
    if(leftOverlay) leftOverlay.addEventListener('click', closeLeft);

    // 右侧抽屉
    var rightDrawer = document.getElementById('right-drawer');
    var rightOverlay = document.getElementById('right-drawer-overlay');
    var rightBtn = document.getElementById('mobile-sidebar-btn');
    var rightClose = document.getElementById('right-drawer-close');

    function openRight(e) {
        if(e) e.preventDefault();
        if(leftDrawer) leftDrawer.classList.remove('is-open');
        if(leftOverlay) leftOverlay.classList.remove('is-open');
        if(rightDrawer) rightDrawer.classList.add('is-open');
        if(rightOverlay) rightOverlay.classList.add('is-open');
        syncBodyDrawerLock();
    }

    function closeRight() {
        rightDrawer.classList.remove('is-open');
        rightOverlay.classList.remove('is-open');
        syncBodyDrawerLock();
    }

    if(rightBtn) rightBtn.addEventListener('click', openRight);
    if(rightClose) rightClose.addEventListener('click', closeRight);
    if(rightOverlay) rightOverlay.addEventListener('click', closeRight);

    // ESC 关闭两侧抽屉
    document.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') { closeLeft(); closeRight(); }
    });
});
