const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴

function fetchDataWithToken() {
    
  const URL = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';
  
    fetch(`${URL}/admin/index`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error loading user count');
        }
      })
      .then(data => {
        document.getElementById('user-count').innerText = data.countUser;
        document.getElementById('userBoard-count').innerText = data.countBoard.countBoardUser;
        document.getElementById('adminBoard-count').innerText = data.countBoard.countBoardAdmin;
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('user-count').innerText = 'Error loading user count';
      });  

  }
  function clearToken() {
    console.log(token);
    localStorage.clear(token);
    console.log('토큰 삭제 완료');
  }

  window.addEventListener('load', fetchDataWithToken);