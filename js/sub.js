/* detail slider */
$(document).ready(function () {
	//메인 슬라이더
    var $slider = $("#content .cnt3 .detail_slider");
    var $visualLi = $slider.find(".visual > li");
    var $pagingLi = $slider.find(".paging > li");
    var nowNum = 0; //현재보여지는 .visual > li의 인덱스 번호, 문서로딩시 최초 한번은 0으로 지정
    var nextNum; //클릭한 .visual > li의 인덱스 번호
    var playNext; //전역변수를 만들어 timer함수 내부의 playNext변수(지역변수)

    $visualLi.eq(0).addClass("on");
    $pagingLi.eq(0).addClass("on");

    //1)인디케이터(.paging li a)를 클릭하는 경우
    $pagingLi.children().on("click", function () {
        nextNum = $(this).parent().index();
        //console.log(nextNum);

        //제어1) 자동실행 멈추기
        clearInterval(playNext);

        //제어2) play 버튼을 보이게 함
        $slider.find(".play_stop .play").addClass("on").siblings().removeClass("on");

        //제어3) 나자신 인디케이터는 클릭하지 못하게 함
        if (nowNum == nextNum) return false;

        //1-1)인디케이터 li에 .on 클래스명 제어
        $(this).parent().addClass("on").siblings().removeClass("on");

        //1-2).visual li 제어
        $visualLi.eq(nowNum).removeClass("on");

        setTimeout(function () {
            $visualLi.eq(nextNum).addClass("on");

            nowNum = nextNum; //nowNum값을 0으로 고정시키지 말고 nextNum에 담긴 값으로 교체해 준다
        }, 400);

        return false;
    });

    //2)setInterval메서드로 자동 실행
    function timer() {
        playNext = setInterval(function () {
            nextNum = nowNum + 1;
            if (nextNum == 3) nextNum = 0;

            //2-1)인디케이터 li에 .on 클래스명 제어
            $pagingLi.eq(nextNum).addClass("on").siblings().removeClass("on");

            //2-2).visual li를 animate()
            $visualLi.eq(nowNum).removeClass("on");

            function fn() {
                $visualLi.eq(nextNum).addClass("on");

                nowNum = nextNum; //nowNum값을 0으로 고정시키지 말고 nextNum에 담긴 값으로 교체해 준다
            };
            setTimeout(fn, 400);

        }, 4000);
    }
    timer();

	
});