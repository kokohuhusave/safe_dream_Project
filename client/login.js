async function submitForm() {
  const userid = document.getElementById('userid').value;
  const password = document.getElementById('password').value;
  
  const URL = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';
  console.log(URL);

  const data = {
    userid: userid,
    password: password
  };

  fetch(`${URL}/admin/login`, {
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
        throw new Error('로그인 실패');
      }
    })
    .then(function(data) {
      const token = data.token; // 응답에서 토큰 추출
      localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
      window.location.href = 'index.html'; // 로그인 성공 시 index.html로 리디렉션
    })
    .catch(function(error) {
      console.error(error);
      alert('로그인 실패: ' + error.message); // 로그인 요청 실패 시 알림 표시
    });
}
