const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴

// 회원 정보 조회 및 출력
function fetchAndRenderMembers() {

  fetch('https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app/user', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
    }
  })
    .then(response => response.json())
    .then(data => {
      const membersTable = document.getElementById('userList');
      const tbody = membersTable.querySelector('tbody');
      tbody.innerHTML = '';

      console.log(data);
      data.forEach(member => {
        const tr = document.createElement('tr');
        tr.innerHTML = `										
        <th></th>
          <td>${member.userid}</td>
          <td>${member.username}</td>
          <td>${member.guardianHp}</td>
          <td>${member.hp}</td>
          <td>
          <div class="dropdown">
            <button class="btn btn-primary edit-button" data-member-id="${member.userid}" type="button">
              수정
            </button>
            <button class="btn btn-primary" id="btn-delete-a" data-member-id="${member.userid}" type="button" data-toggle="dropdown">
              삭제
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item delete-button" href="#" data-member-id="${member.userid}">확인</a>
            </div>
          </div> 

          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error('회원 정보 조회 실패:', error));
    // 회원 정보 생성후 다시 버튼 생성하기 
    const addbtn = document.getElementById("btn-delete-a")
    addbtn.style.display = 'inline-block';
}

// 회원 추가 함수

function addMember() {
  const addForm = document.createElement('form');
  addForm.innerHTML = `
  <h4 style="color:blue; margin-top: 10px;">회원 추가</h4>
  <div>
    <label for="userid" class="addlist">ID:</label><br>
    <input class="addlistinput" type="text" id="userid" name="userid" required>
  </div>
  <div>
    <label for="username" class="addlist">이름:</label><br>
    <input class="addlistinput" type="text" id="username" name="username" required>
  </div>
  <div>
    <label for="password" class="addlist">비밀번호:</label><br>
    <input class="addlistinput" type="password" id="password" name="password"  style="font-family:none !important" required>
  </div>
  <div>
    <label for="guardianHp" class="addlist">보호자 휴대폰 번호:</label><br>
    <input class="addlistinput" type="text" id="guardianHp" name="guardianHp" required>
  </div>
  <div>
    <label for="hp" class="addlist">휴대폰 번호:</label><br>
    <input class="addlistinput" type="text" id="hp" name="hp" required>
  </div><br>
  <button class="btn btn-primary addlistbtn" type="submit"> 추가 </button>
  <button class="btn btn-primary addlistbtn" type="button" onclick="cancelAdd()"> 취소 </button>
  `;
  
  
  addForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newMember = {
      userid: addForm.elements.userid.value,
      username: addForm.elements.username.value,
      password: addForm.elements.password.value,
      guardianHp: addForm.elements.guardianHp.value,
      hp: addForm.elements.hp.value,
    };
    
    fetch('https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      },
      body: JSON.stringify(newMember),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      addForm.remove(); // 추가 폼 제거
      fetchAndRenderMembers();
    })
    .catch(error => {
      console.error('회원 추가 실패:', error);
      // TODO: 회원 추가 실패 처리 작업 수행
      });
    });
    
    // 추가 폼을 화면에 표시
    const addContainer = document.getElementById('addContainer');
    addContainer.innerHTML = '';
    addContainer.appendChild(addForm);
    const addbtn = document.getElementById("btn-delete-a")
    addbtn.style.display = 'none';

  }    
  
  
  
  
  // 회원 정보 수정 함수 
  function updateMember(memberId) {
    const updateForm = document.createElement('form');
    updateForm.innerHTML = `
    <h4>회원 정보 수정</h4>
    <div>
    <label for="username" class="addlist">이름:</label><br>
    <input class="addlistinput" type="text" id="username" name="username" required>
    </div>
    <div>
    <label for="guardianHp" class="addlist">보호자 휴대폰 번호:</label><br>
    <input class="addlistinput" type="text" id="guardianHp" name="guardianHp" required>
    </div>
    <div>
    <label for="hp" class="addlist">휴대폰 번호:</label><br>
    <input class="addlistinput" type="text" id="hp" name="hp" required>
    </div><br>
    <button class="btn btn-primary addlistbtn" type="submit">수정</button>
    <button class="btn btn-primary addlistbtn" type="button" onclick="cancelAdd()"> 취소 </button>
    `;
    
    function MemberData(memberId) {
      fetch(`https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app/user/${memberId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
        }
      })
      .then(response => response.json())
      .then(data => {
        const { username, guardianHp, hp } = data;
        updateForm.elements.username.value = username;
        updateForm.elements.guardianHp.value = guardianHp;
        updateForm.elements.hp.value = hp;
      })
      .catch(error => console.error('회원 정보 조회 실패:', error));
    }
    MemberData(memberId);// memberId를 이용하여 회원정보내용 불러 오는 함수
    
    updateForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const updatedData = {
      username: updateForm.elements.username.value,
      guardianHp: updateForm.elements.guardianHp.value,
      hp: updateForm.elements.hp.value,
    };
    
    fetch(`https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app/user/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      updateForm.remove(); // 수정 폼 제거
      fetchAndRenderMembers(); // 회원정보내용 불러 오는 함수
    })
    .catch(error => {
      console.error('회원 정보 수정 실패:', error);
      // TODO: 회원 정보 수정 실패 처리 작업 수행
    });
  });
  
  // 수정 폼을 해당 회원의 데이터로 채운 뒤 화면에 표시
  const editContainer = document.getElementById('editContainer');
  editContainer.innerHTML = '';
  editContainer.appendChild(updateForm);
}



// 이벤트 위임을 사용하여 삭제 버튼 클릭 이벤트 처리
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-button')) {
    const memberId = event.target.dataset.memberId;
    const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
    
    // 서버로 회원 삭제 요청
    fetch(`https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app/user/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token // 가져온 토큰을 헤더에 추가
      }
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('회원 삭제에 실패했습니다.');
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data.message);
          fetchAndRenderMembers()
          
        })
        .catch(function (error) {
          console.error(error);
          // TODO: 오류 처리
        });
      }
      
      if (event.target.classList.contains('edit-button')) {
        const memberId = event.target.dataset.memberId;
        updateMember(memberId);
      }
    });
    
    
    document.addEventListener('DOMContentLoaded', () => {
      fetchAndRenderMembers();
    });

    function cancelAdd(){

        location.reload();
    }
    
    function clearToken() {
      console.log(token);
      localStorage.clear(token);
      console.log('토큰 삭제 완료');
    }
