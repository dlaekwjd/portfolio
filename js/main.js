$(document).ready(function () {

    //원페이지 스크롤 가로방향
    var $menu = $('#indicator ul li');
    var $wrap = $('#main .wrap');
    var total = $wrap.children('article').size();        //6
    var tgIdx = 0;      //현재 보여질 article의 인덱스 번호
    var windowWid;		//윈도우창의 가로 크기
    var timerResize = 0;      //누적되는 resize 이벤트의 실행문을 최소화 하기위해
    var timerWheel = 0;      //누적되는 mousewheel 이벤트의 실행문을 최소화 하기위해

    //초기설정 : 인디케이터 첫번째 li.on 추가
    $menu.eq(0).addClass('on');

    //1) resize 될 때 .wrap의 가로크기, article의 가로크기를 고정
    $(window).on('resize', function () {
        clearTimeout(timerResize);
        setTimeout(function () {
            windowWid = $(this).width();
            //console.log(windowWid);
            $wrap.css({width: windowWid*total}).children('article').css({width: windowWid, height:$(window).height()});
            $wrap.stop().animate({marginLeft: tgIdx*windowWid*-1});
        }, 50);
    });
    $(window).trigger('resize');

    //2) 인디케이터 클릭 : 인디케이터 li태그에 .on 제어, $wrap을 maginLeft로 animate() 
		$menu.children().on('click', function (e) {
			e.preventDefault();
			if ($wrap.is(':animated')) return false;

			tgIdx = $(this).parent().index();
			//console.log(tgIdx);
			$(this).parent().addClass('on').siblings().removeClass('on');
			$wrap.stop().animate({marginLeft: tgIdx*windowWid*-1});
		});

    /* 3) 마우스휠을 움직이기
        마우스휠 내리기 : delta 음수 : 오른쪽 이동 => tgIdx++ 조건 (total - 1 보다 작은 경우)
        마우스휠 올리기 : delta 양수 : 왼쪽 이동 => tgIdx-- 조건 (0보다 큰 경우)
    */
   $wrap.on('mousewheel DOMMouseScroll', function (e) {
       clearTimeout(timerWheel);
       setTimeout(function () {
           if ($wrap.is(':animated')) return false;
           $(".king").css({top: 40, left: '50%', marginLeft: 80});

           var delta = e.originalEvent.wheelDelta || e.originalEvent.detail*-1;
           //console.log(delta);

           //if 오른쪽(가장 마지막에서 더이상 제어되지 못하도록 return false), else if 왼쪽(가장 처음에서 ...) :  
            if (delta < 0) {
                if (tgIdx < total-1) tgIdx++;
                else return false;
            }
            else if (delta > 0) {
                if (tgIdx > 0) tgIdx--;
                else return false;
            }

           //인디케이터 li태그에 .on 제어, $wrap을 marginLeft로 animate ()
           indicatorBg ();
           txtAni ();
           $wrap.children('article').eq(tgIdx).addClass('on').siblings().removeClass('on');
       }, 200);
   });

   /* 키보드 좌우 방향키 제어 
    → 방향키 : e.keyCode = 39,  tgIdx++(total-1(5)보다 작을 경우만) 
    ← 방향키 : e.keyCode = 37,  tgIdx--(0보다 클경우만 가능) */
    $(window).on('keydown', function (e) {
        if ( $wrap.is(':animated') ) return false;
        //console.log(e.keyCode);
        //if 오른쪽(가장 마지막에서 더이상 제어되지 못하도록 return false), else if 왼쪽(가장 처음에서 ...) :  
        $(".king").css({top: 40, left: '50%', marginLeft: 80});
        if ((e.keyCode == 39 ||  e.keyCode == 40)) {
            if (tgIdx < total-1)tgIdx++;
            else return false;		//가장 마지막에 위치하면 강제 종료
        }
        else if ((e.keyCode == 37 || e.keyCode == 38)) {
            if (tgIdx > 0) tgIdx--;
            else return false;		//가장 처음에 위치하면 강제 종료
        }
        indicatorBg ();
        txtAni ();
        $wrap.children('article').eq(tgIdx).addClass('on').siblings().removeClass('on');
    });

    function txtAni () {
        //하단 포트폴리오 텍스트 애니메이션 제어 추가
        $('#indicator ul li.on').removeClass('on').addClass('off');
        setTimeout(function () {
            $('#indicator ul li.off').removeClass()
        }, 1000); 

        $menu.eq(tgIdx).addClass('on');
        $wrap.stop().animate({marginLeft: tgIdx*windowWid*-1});
    }

    function indicatorBg () {
        //메인화면 인디케이터 배경색 제거
        console.log(tgIdx);
        if (tgIdx == 0) $('#indicator').css({backgroundColor: 'transparent'});
        else $('#indicator').css({backgroundColor: 'rgba(255, 255, 255, 0.5)'});
    }
    indicatorBg ();


    /* text animation을 위한 글자 복제 */
    $menu.each(function () {
        var $before = $(this).children('a');
        $before.addClass('hide');

        var beforeTxt = $before.text();
        var txtLen = beforeTxt.length;
        var afterTxt = '<p class="clone" aria-hidden="true">';
        //console.log(txtLen);
        for (var i=0; i<txtLen; i++) {
            var shortTxt = beforeTxt.slice(i, i+1);		//한자리씩 자르기
            
            if (shortTxt == ' ') afterTxt += '<span class="blank">' + shortTxt + '</span>';
            else afterTxt += '<span>' + shortTxt + '</span>';
            //console.log(shortTxt);
        }
        afterTxt += '</p>';
        //console.log(afterTxt);
        $(this).prepend(afterTxt);
        $(this).find(".clone span").each(function  (idx) {
            //console.log(idx);
            $(this).css('transition-delay',0.1+idx*0.1+'s');
        });
    });

   //포트폴리오 소개로 이동시키기
   $('#box a').on('click', function (e) {
    e.preventDefault();
    tgIdx = 1;
    console.log(tgIdx);

    $menu.eq(tgIdx).addClass('on');
    $wrap.stop().animate({marginLeft: tgIdx*windowWid*-1});
   });

    $('#main .wrap ul li .king').on('click', function (e) {
        e.preventDefault(e);
        $('.king').stop().animate({left: '50%', top: 180, marginLeft: -60}, 1000, 'easeInOutBack', function () {
            tgIdx = 1;
            $menu.eq(tgIdx).addClass('on').siblings().removeClass('on');
            $('#main .wrap article').eq(tgIdx).addClass('on').siblings().removeClass('on');
            $wrap.stop().animate({marginLeft: tgIdx*windowWid*-1});
        });
        
    });

	//메인에서 about 과 skill 체스위에서 이동시키고 모달열기
    $('#main .wrap ul li .open_btn').on('click', function (e) {
        e.preventDefault(e);
 
        // .hor의 현재 위치
        //console.log("left: " + obj.left + "px, top: " + obj.top + "px");

        // .hor의 현재 위치에서 특정치(50px)만큼 이동
        if ($(this).hasClass('hor')) {
            $(".hor").stop().animate({left: '50%', top: 135, marginLeft: -630}, 1000, 'easeInOutBack', function () {
            open_modal ($(this));
            });  
        } else {
            $(".one").stop().animate({left: '50%', top: 360, marginLeft: 320}, 1000, 'easeInOutBack', function () {
                open_modal ($(this));
            });  
        }
        
    });

    $('#main .wrap ul li p').on('click', function () {
        $(this).next().click();
    });

    //모달
    function open_modal (tg) {
        var $openBtn = tg;
        var $mdCnt = $( $openBtn.attr('href') );
        var $closeBtn = $mdCnt.find('.close_btn');
        var $first = $mdCnt.find('[data-link="first"]');
        var timer = 0;
        console.log($openBtn, $mdCnt.attr('id'), $closeBtn);

        $mdCnt.siblings().attr({'aria-hidden': true, inert: ''});
        $mdCnt.before('<div id="dim"><div>');
        var $dim = $('#dim');
        $(window).on('resize', function () {
            clearTimeout(timer);

            timer = setTimeout(function () {
                var topPos = ($(this).height() - $mdCnt.outerHeight())/2;
                var leftPos = ($(this).width() - $mdCnt.outerWidth())/2;
                //console.log(topPos, leftPos);
                $mdCnt.css({top: topPos, left: leftPos});
            }, 50);
        });
        $(window).trigger('resize');

        $dim.stop().fadeIn().next().css({visibility: 'visible'});
        $first.focus();

        $first.on('keydown', function (e) {
            console.log(e.keyCode);
            if (e.shiftKey && e.keyCode == 9) {
                e.preventDefault();
                $last.focus();
            } 
        });

        $closeBtn.on('click', function () {
            $dim.stop().fadeOut('fast', function () {
                $(this).remove();
                $openBtn.focus();
            });
            $mdCnt.css({visibility: 'hidden'});
            $mdCnt.siblings().removeAttr('aria-hidden inert');
            if ($openBtn.hasClass('hor')) {
                $(".hor").css({top: 285, left: '50%', marginLeft: -755});
            }else {
                $(".one").css({top: 305, left: '50%', marginLeft: 405});
            }
        });

        $dim.on('click', function () {
            $closeBtn.click();
        });

        $(window).on('keydown', function (e) {
            console.log(e.keyCode);
            if (e.keyCode == 27) $closeBtn.click();
        });
    }
});
