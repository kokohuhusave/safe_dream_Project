const URL_find = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';



function findUserID() {
    const username = document.getElementById('username').value;
    const HP = document.getElementById('HP').value;

    fetch(`${URL_find}/safedream/findUserID`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, HP })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            let IDbox = document.querySelector('.noticeBoxID');
            IDbox.style.display = "block";
            // console.log(data);

            if (data.error) {
                document.querySelector('.noticeBoxID').innerHTML = `<p style="color:black">이름 및 전화번호를 확인해주세요.</p>
                <button class="btn" id="loginButton" onclick="location.href='./IDPWsearch_edit.html'">다시시도</button>`;

            } else {
                IDbox.innerHTML = `<p style="color:black">아이디 : ${data.foundUserID}</p>
                <button class="btn" id="loginButton" onclick="location.href='./index.html'">로그인</button>`;

             }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
