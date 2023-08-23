let postIds = []
const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
let page = 0
const server = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';

// 무한 스크롤 적용 코드

function fetchData(page) {
  let selectedCategory = categorySelect.value;
  fetch(`${server}/safedream/board_user?category=${selectedCategory}&page=${page}`, {
    method: 'GET',
      headers: {
      'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
    }
  }).then(response => response.json())
    .then(data => {
      for (let i in data.result) {
        let listul = document.createElement('ul');
        let listli0 = document.createElement('li');
        let listli1 = document.createElement('li');

        listul.classList.add('content')
        listli0.classList.add('title')
        listli1.classList.add('date')

        listli0.textContent = data.result[i].title;
        listul.appendChild(listli0);

        listli1.textContent = data.result[i].created_At;
        listul.appendChild(listli1);
        
        listul.addEventListener('click', () => {
          // 클릭 이벤트 핸들러 내에서 새로운 페이지로 이동하는 코드 작성
          const post_id = data.result[i].post_id; // 게시판 ID 또는 해당하는 식별자
          location.href = `./board_tailpage.html?post_id=${post_id}`; // 새로운 페이지로 이동 및 게시판 ID 전달

        })

        boardList.appendChild(listul);
          }
        })
        .catch(function (error) {
          console.error(error);
          alert('게시판 데이터 요청에 실패했습니다.');
          // 게시판 데이터 가져오기 실패 시 알림 표시 
        })
    }
  // fetchData 함수로 첫 화면에 0번부터 10개 먼저 띄우기
  fetchData(0)
     //카테고리 변경 시 해당되는 리스트 뿌리기 
    categorySelect.addEventListener('change', () => {
      page = 0;
       // 카테고리가 변경되면 페이지 번호를 0으로 초기화 
      while (boardList.firstChild) {
        // 카테고리 변경 전 추가된 데이터 삭제
        boardList.firstChild.remove();
      }
      fetchData(0); // 카테고리에 해당되는 첫 페이지 데이터 가져오기
    });

function handleScroll() {
  console.log(page)
  const scrollHeight = boardList.scrollHeight;
  const scrollTop = boardList.scrollTop;
  const clientHeight = boardList.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    page = page + 15; 
    fetchData(page)
    return page
  }
} 

boardList.addEventListener('scroll', handleScroll)