const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const post_id = urlParams.get('post_id');
const URL = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';
const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${URL}/admin/board-read1?post_id=${post_id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      }
    })
    .then(response => response.json())
    .then(data => {
      const category = document.getElementById('board-category');
      const title = document.getElementById('board-title');
      const userid = document.getElementById('upload-name');
      const date = document.getElementById('upload-date');
      const content = document.getElementById('board-content');
      category.style.color = 'blue'
      date.style.color = 'gray'
      category.textContent = data.data[0].category;
      title.textContent = data.data[0].title;
      userid.textContent = data.data[0].userid;
      date.textContent = data.data[0].created_At;
      content.textContent = data.data[0].content;
      })
    }
  )

const DeleteBtn = document.getElementById("btn-delete-board")
DeleteBtn.addEventListener('click', () => {
  fetch(`${URL}/board-read1?post_id=${post_id}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
    }
  }).then(
        window.location.href = './board.html')
    .catch(error => {
      // 오류 처리
      console.error(error);
      alert('데이터 전송에 실패했습니다.');
    })
})
function clearToken() {
  console.log(token);
  localStorage.clear(token);
  console.log('토큰 삭제 완료');
}