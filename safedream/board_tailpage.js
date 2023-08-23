const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const post_id = urlParams.get('post_id');
const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
const URL_tail = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';


document.addEventListener('DOMContentLoaded', () => {
    fetch(`${URL_tail}/safedream/board_tailpage?post_id=${post_id}`, {
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
      category.textContent = data.data[0].category;
      title.textContent = data.data[0].title;
      userid.textContent = data.data[0].userid;
      date.textContent = data.data[0].created_At;
      content.textContent = data.data[0].content;
      })
    }
  )

function clearToken() {
  console.log(token);
  localStorage.clear(token);
  console.log('토큰 삭제 완료');
}