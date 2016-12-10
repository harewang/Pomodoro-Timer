var Clock = function (durationTime) {
    var duration = durationTime,   //间隔时间
        seconds = duration * 60,
        count = 0,      //次数计数
        that = this;
    //DOM元素
    var timeText, moveEle, cntEle, settings;
    var className;
    this.canSwitch = false;
    this.onWork = false;

    this.init = function (timeTextEle, moveElement, cnt, settingEle, flag) {
        timeText = timeTextEle;
        moveEle = moveElement;
        cntEle = cnt;
        settings = settingEle;
        className = flag;

        settings.duration.innerText = duration;
        changeDuration();
    };

    //增减间隔时间
    var changeDuration = function () {
        function setDuration () {
            if (duration < 1) {
                duration = 1;
            } else if (duration > 60) { 
                duration = 60;
            }
            settings.duration.innerText = duration;
            that.end();
            that.start();
        }

        settings.minus.onclick = function () {
            duration--;
            setDuration();
        };

        settings.plus.onclick = function () {
            duration++;
            setDuration();
        };
    };

    var showTime = function (ele, seconds) {
        var second = seconds % 60+'';
        var minute = Math.floor(seconds / 60)+'';
        second = second.length === 2 ? second : '0'+second;
        minute = minute.length === 2 ? minute : '0'+minute;

        ele.innerText = minute + ':' + second;
    };

    //倒计时
    var decrease = function () {
        seconds--;
    };

    //运动效果
    var move = function (ele) {
        var percent = 1 - seconds / (duration*60);
        ele.style.height = percent*100 + '%';
    }

    this.start = function () {
        this.canSwitch = false;
        this.onWork = true;
        seconds = duration * 60;
        moveEle.className = className;
        moveEle.style.height = 0;

        clearInterval(timer);
        timer = setInterval(function () {
            decrease();
            showTime(timeText, seconds);
            move(moveEle);

            if (seconds === 0) {
                count++;
                that.end();
                that.canSwitch = true;
            }
        }, 1000);
    };

    this.end = function () {
        clearInterval(timer);
        cntEle.innerText = count;
        this.onWork = false;
    };
};

var ClockSystem = function () {
    var sessionClock = new Clock(5),
        breakClock = new Clock(1),
        that = this;
    this.nowClock = sessionClock;

    //需要显示信息的元素：时间及次数及调节信息处
    this.init = function (timeText, moveEle, breakCount, sessionCount, 
            breakSetting, sessionSetting) {
        breakClock.init(timeText, moveEle, breakCount, breakSetting, 'b');
        sessionClock.init(timeText, moveEle, sessionCount, sessionSetting, 's');

        this.switchClock();
    };

    this.start = function () {
        this.nowClock.start();
    };

    this.end = function () {
        this.nowClock.end();
    }

    //两个计时器的切换
    this.setNowClock = function () {
        this.nowClock = this.nowClock === sessionClock ? breakClock : sessionClock;
    };

    this.switchClock = function () {
        setInterval(function () {
            if (that.nowClock.canSwitch) {
                that.setNowClock();
                that.nowClock.start();
            }
        }, 50); 
        
    }
}

function step () {
    var timeText = document.getElementById('timer').getElementsByTagName('p')[0],
        moveEle = document.getElementById('timer').getElementsByTagName('span')[0],
        //计数的地方
        breakCnt = document.getElementById('details').getElementsByTagName('p')[0].
            getElementsByTagName('span')[0],
        sessionCnt = document.getElementById('details').getElementsByTagName('p')[1].
            getElementsByTagName('span')[0],
        //时间设置及显示的地方
        breakSetting = document.getElementsByClassName('setting')[0].getElementsByTagName('span'),
        sessionSetting = document.getElementsByClassName('setting')[1].getElementsByTagName('span');

    var timerEle = document.getElementById('timer');

    var cs = new ClockSystem();
    cs.init(timeText, moveEle, breakCnt, sessionCnt, {duration: breakSetting[1], minus: 
            breakSetting[0], plus: breakSetting[2]}, {duration: sessionSetting[1], minus: 
            sessionSetting[0], plus: sessionSetting[2]});

    timerEle.onclick = function () {
        cs.nowClock.onWork ? cs.end() : cs.start();
    }
}

var timer = null;

window.onload = function () {
    step();
}
