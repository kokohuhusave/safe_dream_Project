function sendit(){
    //alert('회원가입 버튼 클릭! 작동 테스트용')

    const userid = document.getElementById('userid');
    const userpw = document.getElementById('userpw');
    const userpw_a = document.getElementById('userpw_a');
    
    // 정규표현식
    // 아이디 정규표현식
    const expIdText = /^[A-Za-z]{4,20}$/;

    // 비밀번호 정규표현식
    // const extPwText = 과제 
    // 최소 8자리 이면서 첫자리는 특수문자(!,@,#,*,^,%) 6개중 하나로 시작해야 하며, 영대소문자+숫자
    const expPwText = /^(?=[!@#*^%])[A-Za-z0-9!@#*^%]{8,}$/;
    // 영대소문자+숫자 8자리~ 20자리
    //const expPwText = /^[A-Za-z0-9]{3,20}$/;

    // 이름 정규표현식 = 과제
    // 한글만 입력받기(길이와 상관없이)
    const expNameText = /^[가-힣]+$/;

    // 휴대폰 번호 정규표현식 = 과제
    //-앞번호는 3글자,- 중간번호는 3글자 또는 4글자, - 마지막 번호는 4글자
    // 010-0000-0000 // 010-000-0000
    const expHPText = /^\d{3}-\d{3,4}-\d{4}$/;

    // 이메일 정규표현식 = 과제
    // -,.을 포함한 영문자,숫자 모두를 입력 가능 
    const expEmailText = /^[A-Za-z0-9\-\.]+@[A-Za-z0-9\-\.]+\.[A-Za-z0-9\-\.]+$/;

    //아이디
    if( !expIdText.test(userid.value) ){
        alert('아이디는 4자이상 20자이하의 영문자로 입력하세요.');
        userid.focus();// userid로 포커스를 두는것
        return false;
    }

    // 비밀번호
    if(userpw.value != userpw_a.value){
        alert('비밀번호와 비밀번호 확인의 값이 다릅니다. ');
        userpw.focus();
        return false;
    }else if(!expPwText.test(userpw.value)){
        alert('비밀번호 형식이 맞지 않습니다. (8자리이상 이면서 첫자리는 특수문자(!,@,#,*,^,%) 6개중 하나로 시작해야 하며, 영대소문자+숫자)'); 
        userpw.focus();// userpw로 포커스를 두는것
        return false;
    }
    
    //이름
    if( !expNameText.test(username.value)){
        alert('한글 이름이 맞는지 확인 해주세요. (단,길이는 상관없습니다.)');
        username.focus();// username로 포커스를 두는것
        return false;
    }

    //휴대폰
    if(!expHPText.test(hp.value)){
        alert('핸드폰 형식에 맞지 않습니다. 형식(xxx-xxxx-xxxx or xxx-xxx-xxxx)');
        hp.focus();// 핸드폰번호로 포커스를 두는것
        return false;
    } 
    //휴대폰
    if(!expHPText.test(guardianHp.value)){
        alert('핸드폰 형식에 맞지 않습니다. 형식(xxx-xxxx-xxxx or xxx-xxx-xxxx)');
        hp.focus();// 핸드폰번호로 포커스를 두는것
        return false;
    } 

    // 모든 정규식이 올바르게 입력되었을 경우
    if (expIdText.test(userid.value) &&
    expPwText.test(userpw.value) &&
    expPwText.test(userpw_a.value) &&
    expNameText.test(username.value) &&
    expHPText.test(hp.value) &&
    expHPText.test(guardianHp.value)) {

    // 변경 버튼 생성
    const btnBottom2 = document.getElementById("btn_bottom2");
    btnBottom2.innerHTML = '<div id="updateBtn" onclick="handleUpdate()">변경</div>';
    }
    return ture;
}