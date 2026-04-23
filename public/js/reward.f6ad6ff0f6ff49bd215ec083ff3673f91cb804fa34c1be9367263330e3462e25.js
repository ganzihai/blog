(function(){
    var openBtn = document.getElementById('rewardOpenBtn');
    var bg = document.getElementById('rewardBg');
    var box = document.getElementById('rewardBox');
    var closeBtn = document.getElementById('rewardCloseBtn');

    function open() {
        bg.classList.add('is-open');
        box.classList.add('is-open');
        document.body.classList.add('modal-open');
    }

    function close() {
        bg.classList.remove('is-open');
        box.classList.remove('is-open');
        document.body.classList.remove('modal-open');
    }

    if(openBtn) openBtn.addEventListener('click', open);
    if(bg) bg.addEventListener('click', close);
    if(closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e){
        if(e.key==='Escape') close();
    });
})();
