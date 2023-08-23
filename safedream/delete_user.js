const URL_user = 'https://port-0-safedream-backend-otjl2cli33x5tw.sel4.cloudtype.app';

// 작성취소 버튼 클릭시 동작
document.getElementById('btn_bottom1').addEventListener('click', function(){
    // 입력 필드 초기화
    document.getElementById('username').value = '';
    document.getElementById('userpw').value = '';
    document.getElementById('userpw_a').value = '';
    document.getElementById('HP').value = '';
    document.getElementById('protector1').value = '';
    document.getElementById('protector2').value = '';
});

// 회원정보 삭제 버튼 클릭 시 동작
document.getElementById('del_btn').addEventListener('click', function(){
    const confirmDelete = confirm("정말 탈퇴 하시겠습니까?");
    if(confirmDelete) {
        // 사용자 ID를 알아야 함 - 여기서는 prompt를 사용하여 직접 입력받음
        const userid = prompt("Please enter your User ID", "");
        if (userid) {
            handleDelete(userid);
        } else {
            alert("User ID is required to delete the account.");
        }
    }
});
