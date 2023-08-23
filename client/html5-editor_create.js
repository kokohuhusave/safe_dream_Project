const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('myForm'); // 폼 요소의 ID를 지정해야 합니다
  const URL = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';


  form.addEventListener('submit', (e) => {
    e.preventDefault(); // 폼 제출 기본 동작을 막습니다.

    // 폼 데이터를 생성합니다.
    const formData = new FormData(form);
    const formDataJson = {
      category: formData.get('category'),
      title: formData.get('title'),
      content: formData.get('content')
    }
    // console.log(formData.get('category'))
    // 서버로 데이터를 전송합니다.
    fetch(`${URL}/admin/html5-editor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      },
      body: JSON.stringify(formDataJson)
    })
    .then(response => {
      // 서버 응답 처리
      if (response.ok) {
        // 성공적인 응답일 경우, 페이지 이동 등의 추가 작업을 수행합니다.
        window.location.href = './board.html';
      } else {
        // 오류 응답 처리
        throw new Error('데이터 전송에 실패했습니다.');
      }
    })
    .catch(error => {
      // 오류 처리
      console.error(error);
      alert('데이터 전송에 실패했습니다.');
    });
  });
});

function clearToken() {
  console.log(token);
  localStorage.clear(token);
  console.log('토큰 삭제 완료');
}