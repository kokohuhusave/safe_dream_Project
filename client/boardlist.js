let postIds = []
const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
let page = 0

// 무한 스크롤 적용 코드

function fetchData(page) {
  let selectedCategory = categorySelect.value; 
  const URL = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';

  fetch(`${URL}/admin/board?category=${selectedCategory}&page=${page}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
    }
  }).then(response => response.json())
    .then(data => {
      for (let i in data.result) {
        let tableRow = document.createElement('tr');
        let tableData0 = document.createElement('td');
        let tableData1 = document.createElement('td');
        let tableData2 = document.createElement('td');
        let tableData3 = document.createElement('td');
        let tableData4 = document.createElement('td');

        // checkbox 생성
        tableData0.className = 'dt-body-center';
        let checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'dt-checkbox';
        let checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.name = 'id[]';
        let checkboxLabel = document.createElement('span');
        checkboxLabel.className = 'dt-checkbox-label';
        checkboxDiv.appendChild(checkboxInput);
        checkboxDiv.appendChild(checkboxLabel);
        tableData0.appendChild(checkboxDiv);
        checkboxInput.addEventListener('change', () => {
          const post_id = data.result[i].post_id
          postIds.push(post_id)
        }
        )
        tableRow.appendChild(tableData0);
        tableData1.textContent = data.result[i].category;
        tableRow.appendChild(tableData1);
        tableData2.textContent = data.result[i].userid;
        tableRow.appendChild(tableData2);
        tableData3.textContent = data.result[i].title;
        tableData3.addEventListener('click', () => {
          // 클릭 이벤트 핸들러 내에서 새로운 페이지로 이동하는 코드 작성
          const post_id = data.result[i].post_id; // 게시판 ID 또는 해당하는 식별자
          location.href = `./board-read1.html?post_id=${post_id}`; // 새로운 페이지로 이동 및 게시판 ID 전달

        })
        tableData3.style.cursor = 'pointer';
        tableRow.appendChild(tableData3);
        tableData4.textContent = data.result[i].created_At;
        tableRow.appendChild(tableData4);
        boardList.appendChild(tableRow);
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
  // console.log(page)
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    page = page + 10; 
    fetchData(page)
    return page
  }
} 


window.addEventListener('scroll', handleScroll)