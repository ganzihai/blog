(function(){
    function setsplicon(c, d){
        if(c.innerHTML === "+" || d === "+"){
            c.innerHTML = "-";
            c.classList.remove("car-plus");
            c.classList.add("car-minus");
        } else {
            if(!d || d === "-"){
                c.innerHTML = "+";
                c.classList.remove("car-minus");
                c.classList.add("car-plus");
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        // 月份折叠切换
        document.querySelectorAll('.car-collapse .car-yearmonth').forEach(function(el){
            el.addEventListener('click', function(){
                var nextUl = this.nextElementSibling;
                if(nextUl && nextUl.tagName === 'UL'){
                    var isVisible = nextUl.style.display !== 'none';
                    nextUl.style.display = isVisible ? 'none' : 'block';
                    setsplicon(this.querySelector('.car-toggle-icon'));
                }
            });
        });

        // 展开/折叠所有月份
        var toggleBtn = document.getElementById('archives-btn');
        if(toggleBtn){
            toggleBtn.addEventListener('click', function(e){
                e.preventDefault();
                var isAllOpen = this.textContent === '折叠所有月份';
                document.querySelectorAll('.car-collapse .car-monthlisting').forEach(function(ul){
                    ul.style.display = isAllOpen ? 'none' : 'block';
                });
                document.querySelectorAll('.car-collapse .car-toggle-icon').forEach(function(icon){
                    setsplicon(icon, isAllOpen ? '-' : '+');
                });
                this.textContent = isAllOpen ? '展开所有月份' : '折叠所有月份';
            });
        }

        // 年份筛选器
        var selector = document.getElementById('archive-selector');
        if(selector){
            selector.addEventListener('change', function(){
                var selval = parseInt(this.value, 10);
                document.querySelectorAll('.car-list li[class^="car-pubyear-"], .car-list div[class^="car-year-"]').forEach(function(el){
                    var year = parseInt(el.className.match(/car-(?:pub)?year-(\d+)/)[1], 10);
                    el.style.display = (selval === 0 || selval === year) ? '' : 'none';
                });
            });

            // 动态生成年份选项
            var years = {};
            document.querySelectorAll('.car-list li[class^="car-pubyear-"]').forEach(function(li){
                var year = li.className.replace('car-pubyear-', '');
                if(!years[year]){
                    years[year] = true;
                    var opt = document.createElement('option');
                    opt.value = year;
                    opt.textContent = year + '年';
                    selector.appendChild(opt);
                }
            });

            var allOpt = document.createElement('option');
            allOpt.value = '0';
            allOpt.textContent = ' 全部 ';
            selector.insertBefore(allOpt, selector.firstChild);
        }
    });
})();
