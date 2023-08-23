// API 경로
const URL_update = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';
const token = localStorage.getItem('token');


// 개인정보 수정 함수
function handleUpdate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('userpw').value;
    const passwordConfirm = document.getElementById('userpw_a').value;
    const hp = document.getElementById('hp').value;
    const guardianHp = document.getElementById('guardianHp').value;


    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
        return;
    }

    const data = {
        username: username,
        password: password,
        hp: hp,
        guardianHp: guardianHp
    };

    fetch(`${URL_update}/safedream/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
        },
        body: JSON.stringify(data)
    })
        .then(function(response) {
            if (response.ok) {
                alert('정보가 성공적으로 수정되었습니다.');
                // 페이지 리디렉션 또는 다른 작업 수행
                location.href = './Main_1.html'
            } else {
                alert('정보 수정에 실패했습니다.');
                // 에러 처리 등의 동작 수행
            }
        })
        .catch(function(error) {
            console.error(error);
            alert('정보 수정 요청에 실패했습니다.');
        });
}

function userDelete() {
    fetch(`${URL_update}/safedream/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
        }
    })
        .then(function(response) {
            if (response.ok) {
                alert('회원 탈퇴가 완료되었습니다.');
                // 페이지 리디렉션 또는 다른 작업 수행
                localStorage.clear(token);
                location.href = './login_edit.html';
            } else {
                alert('회원 탈퇴에 실패했습니다.');
                // 에러 처리 등의 동작 수행
            }
        })
        .catch(function(error) {
            console.error(error);
            alert('회원 탈퇴 요청에 실패했습니다.');
        });
}   