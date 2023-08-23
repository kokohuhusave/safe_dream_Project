let searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click", () => {
    let menu_wrap = document.getElementById('menu_wrap')
    menu_wrap.style.display='block'
})


var markers = [];

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 9 // 지도의 확대 레벨
    };

// 지도를 생성합니다  
// 스크립트 로딩이 끝났을 때 객체에 접근하도록 kakao.maps의 정적 메서드인 load를 사용하면 된다.
var map;
kakao.maps.load(function () {
    map = new kakao.maps.Map(mapContainer, mapOption);
})


// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드로 장소를 검색합니다
searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {

    var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title) {
            // kakao.maps.event.addListener(marker, 'click', function () {
            //     displayInfowindow(marker, title);
            // });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

            itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout = function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
    
    var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info">' +
            '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';
    el.addEventListener('click', () => {
        let centerX = places.x
        let centerY = places.y
        let center = new kakao.maps.LatLng(centerY, centerX)
        map.setCenter(center);
    })
    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;" left: 50%;>' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}
var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


// open API(여성안심지킴이집)
async function func1() {
    var result = await fetch('http://openapi.seoul.go.kr:8088/5345676b626b696d353958574e4268/json/tbSafeReturnService/0/347/', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => response.json())


    var positions = []
    for (let i = 0; i <= 346; i++) {
        // 경도
        let LONGITUDE = result['tbSafeReturnService']['row'][i]['LONGITUDE']
        // 위도
        let LATITUDE = result['tbSafeReturnService']['row'][i]['LATITUDE']
        let REMARK = result['tbSafeReturnService']['row'][i]['REMARK']
        let ADDRESS = result['tbSafeReturnService']['row'][i]['DE_LOC']
        let HP = result['tbSafeReturnService']['row'][i]['INST_TELNO']

        var temp2 = {
            title: REMARK,
            latlng: new kakao.maps.LatLng(LATITUDE, LONGITUDE)
        }
        let temp3 = JSON.stringify(temp2)
        positions.push(temp3)
        // console.log(temp2.title)

        var imageSrc_red = "./images/red.png";
        var imageSize = new kakao.maps.Size(48, 48);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc_red, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: temp2.latlng, // 마커를 표시할 위치
            title: temp2.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지 
        });
        // console.log(marker)
        kakao.maps.event.addListener(marker, 'click', function () {

            let content =
            `<img src="./images/red.png" style="width: 40px; height: 40px;float: left;"><p>여성안심지킴이집</p>
            <h2 style="font-size:18px">${REMARK}</h2>
            <h2 style="display:block; color:gray; font-weight:500">${ADDRESS}</h2><br>
            <img src="./images/phone.png" style="width: 20px; height: 20px; margin: 5px; margin-right:0; float: left;">
            <h2 style="display:inline; float: left;">${HP} (관리기관 전화번호)</h2>`

            const infoBox = document.getElementById('content');
            infoBox.style.display = 'block'
            infoBox.innerHTML = content;
        })

    }
    kakao.maps.event.addListener(map, 'click', () => {
        const infoBox = document.getElementById('content');
        infoBox.style.display = 'none'
    })
    kakao.maps.event.addListener(map, 'click', () => {
    menu_wrap.style.display = 'none'
    })

}



// open API(아동안전지킴이집)
async function func2() {
    // var result = await fetch('https://www.safe182.go.kr/api/lcm/safeMap.do?esntlId=10000546&authKey=9287c47a452a42bc&minY=37.4267&minX=126.7644&maxY=37.7010&maxX=127.1839&detailDate1=09&pageIndex=1&pageUnit=100', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     }
    // }).then((response) => response.json())
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err))
    var result = await fetch('safekid_fin.json')
    .then(response => response.json())

    var positions = []
    for (let i = 0; i < result.length; i++) {
        // 경도
        let LONGITUDE = parseFloat(result[i].x)
        // 위도
        let LATITUDE = parseFloat(result[i].y)
        let REMARK = result[i].name
        let ADDRESS = result[i].address
        let HP = result[i].tel

        var temp2 = {
            title: REMARK,
            latlng: new kakao.maps.LatLng(LONGITUDE, LATITUDE)
        }
        let temp3 = JSON.stringify(temp2)
        positions.push(temp3)
        // console.log(positions)
        var imageSrc_blue = "./images/blue.png";
        var imageSize = new kakao.maps.Size(48, 48);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc_blue, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: temp2.latlng, // 마커를 표시할 위치
            title: temp2.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지 
        });
    
        // console.log(temp2.latlng)
        kakao.maps.event.addListener(marker, 'click', function () {

            let content =
            `<img src="./images/blue.png" style="width: 40px; height: 40px;float: left;"><p style="color: blue">아동안전지킴이집</p>
            <h2 style="font-size:18px">${REMARK}</h2>
            <h2 style="display:block; color:gray; font-weight:500">${ADDRESS}</h2><br>
            <img src="./images/phone.png" style="width: 20px; height: 20px; margin: 5px; margin-right:0; float: left;">
            <h2 style="display:inline; float: left;">${HP}</h2>`

            const infoBox = document.getElementById('content');
            infoBox.style.display = 'block'
            infoBox.innerHTML = content;
        })

    }
    kakao.maps.event.addListener(map, 'click', () => {
        const infoBox = document.getElementById('content');
        infoBox.style.display = 'none'
    })
    kakao.maps.event.addListener(map, 'click', () => {
    menu_wrap.style.display = 'none'
    })

    }
    

func1()
func2()

