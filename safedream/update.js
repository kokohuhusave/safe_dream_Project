const URL_update2 = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';


let switchNow = false;    //스위치 상태 기억할 변수
function delToggle() {
    console.log("object");
    if (switchNow == false) {  //스위치가 꺼져 있으면
    document.querySelector(".noticeBox").style.display = "block"; // 보여주고
    switchNow = true; // 스위치는 켠 상태로 바꿈
    } else {
    document.querySelector(".noticeBox").style.display = "none";  // 숨겨주고
    switchNow = false;  //스위차는 끈 상태로 바꿈
    }
}
// 사이드바 생성 소스
function toggleMenu(){
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}
let switch_start = false;
function singo_btn(guardianHp) {
    const userAgent = navigator.userAgent.toLowerCase();
    let singo = document.querySelectorAll('.singo_btn');
    const start_btn = document.querySelector('#start_btn');
    const telButton = document.getElementById('tel');
    const smsButton = document.getElementById('sms');
    const tel = "document.location.href = 'tel:112'"; // 경찰서로 고정 될거기때문에 const
    let sms = "document.location.href = ";// 내용물을 받아와야 해서 let으로 변수 선언

    singo.forEach((data) => {
        data.classList.toggle('active');
        if (data.classList.contains('active')) {
            telButton.setAttribute('onclick', `${tel}`);
            smsButton.setAttribute('onclick', `${sms}`);
        } else {
            telButton.setAttribute('onclick', "#");
            smsButton.setAttribute('onclick', "#");
        }
    });
    if (/iphone|ipad|ipod/.test(userAgent)) {
        // iOS 처리 코드 추가
        console.log("iOS에서 실행 중입니다.");
        sms += `sms:${guardianHp}&body=고객님의 소중한 가족이 위험합니다`;
    } else if (/android/.test(userAgent)) {
        // Android 처리 코드 추가
        console.log("Android에서 실행 중입니다.");
        sms += `sms:${guardianHp}?body=고객님의 소중한 가족이 위험합니다`;
    }
    if (switch_start == false) {
        start_btn.innerText = "종료(작동중)";
        start_btn.style.backgroundColor = 'var(--color-btn-red)';
        start_btn.style.color = 'white';
        switch_start = true;
    } else {
        start_btn.innerText = "시작";
        start_btn.style.backgroundColor = 'var(--color-btn-yello)';
        start_btn.style.color = 'black';
        switch_start = false;
    }
    smsButton.setAttribute('onclick', `${sms}`);
}
// main1.html 에서 사이렌 이미지위에 와이파이 뜨게 하는 js
let speaker = false;
function toggleSpeaker(){
    if (speaker == false) {  //스위치가 꺼져 있으면
    document.querySelector(".speaker").style.display = "block"; // 보여주고
    speaker = true; // 스위치는 켠 상태로 바꿈
    audio.play()
    } else {
    document.querySelector(".speaker").style.display = "none";  // 숨겨주고
    speaker = false;  //스위차는 끈 상태로 바꿈
    audio.pause();
    }
}
// 사이렌 소리 !
let switch_siren = false; // 사이렌소리 스위치
const audio = new Audio("./audio/siren.mp3");
let play = document.getElementById('play');
function playMusic(){
    if(switch_siren == false){
        audio.play()
        switch_siren = true;
    }else {
        audio.pause()
        switch_siren = false;
    }
}
/* 아이디 / 패스워드 찾기 */
let IDswitch = false;    //스위치 상태 기억할 변수
function alertToggle() {
    if (IDswitch == false) {  //스위치가 꺼져 있으면
    document.querySelector(".noticeBoxID").style.display = "block"; // 보여주고
    IDswitch = true; // 스위치는 켠 상태로 바꿈
    } else {
    document.querySelector(".noticeBoxID").style.display = "none";  // 숨겨주고
    IDswitch = false;  //스위차는 끈 상태로 바꿈
    }
}
let PWswitch = false;
function PWToggle() {
    if (PWswitch == false) {  //스위치가 꺼져 있으면
    document.querySelector(".noticeBoxPW").style.display = "block"; // 보여주고
    PWswitch = true; // 스위치는 켠 상태로 바꿈
    } else {
    document.querySelector(".noticeBoxPW").style.display = "none";  // 숨겨주고
    PWswitch = false;  //스위차는 끈 상태로 바꿈
    }
}
let switchNow2 = false;
function PWAToggle() {
    if (switchNow2 == false) {  //스위치가 꺼져 있으면
    document.querySelector(".noticeBoxPWA").style.display = "block"; // 보여주고
    switchNow2 = true; // 스위치는 켠 상태로 바꿈
    } else {
    document.querySelector(".noticeBoxPWA").style.display = "none";  // 숨겨주고
    switchNow2 = false;  //스위차는 끈 상태로 바꿈
    }
}
// 게시판 페이지 뒤로 가기 할때 쓰임
function goBack() {
    window.history.back();
}
function clearToken() {
    const token = localStorage.getItem('token');
    console.log(token);
    localStorage.clear(token);
    console.log('토큰 삭제 완료');
}
//
async function getGuardianHp() {
    try {
      const token = localStorage.getItem('token'); // 토큰 가져오기
        const response = await fetch(`${URL_update2}/safedream/guardianHp`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
        }
    });
    if (response.ok) {
        const data = await response.json();
        console.log("-----------------data.guardianHp----------------");
        console.log(typeof(data.guardianHp));
        singo_btn(data.guardianHp)
    } else {
        throw new Error('서버 요청에 실패하였습니다.');
    }
    } catch (error) {
        console.error(error);
    }
}