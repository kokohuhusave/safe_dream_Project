function loginSrv() {
  const userid = document.getElementById('userid').value;
  const password = document.getElementById('userpw').value;
  const URL_login = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';

  const data = {
    userid: userid,
    password: password
  };

  fetch(`${URL_login}/safedream/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function(response) {
      console.log(response.statusText); // 서버로부터 받은 응답 출력
      console.log(response);
      if (response.ok) {
        return response.json(); // 응답에서 토큰 추출하기 위해 response.json() 호출
      } else {
        alert('로그인 실패 :  아이디 또는 패스워드를 확인해주세요.');
      }
    })
    .then(function(data) {
      const token = data.token; // 응답에서 토큰 추출
      localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
      location.href = './Main_1.html'; // 로그인 성공 시 index.html로 리디렉션
    })
    .catch(function(error) {
      console.error(error);
      alert('로그인 실패: ' + error.message); // 로그인 요청 실패 시 알림 표시
    });

}
