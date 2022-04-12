received_data = null;

function process_response(data) {
    received_data = data
    // console.log(data);
    //$("#result").html(data); //흠 바로 위 클라이언트 크롬 콘솔엔 잘 뜨는데 여긴 안 떠..


    //step5                    //  .html 메서드는 string이나 string 아니면 안 받음.. 지금 data는 json 파일임
    //요래 json obj -> string 해주셈
    // $("#result").html(JSON.stringify(data));
    
    good_look_data = JSON.stringify(data, null, 4);  //보기 이쁨
    $("#result").html("<pre>" + good_look_data + "</pre>");   //이래야 k 안 꺠지고 나옴..
}


function findUnicornByName() {
    console.log("findUnicornByName()" + "got called")
    console.log($("#unicornName").val()) // 텍스트 필드 이름ㅋㅋㅋ
    $.ajax({ //우리 클라/브라우저 사이드에서 작업 중       (서버단 작업하며 app.post하다 보니 홈에 하는 건 아닌 거 같아서 findUnicornByName이란 라우터로 url specify하자 ㅋㅋ)
        url: "https://damp-coast-44326.herokuapp.com/findUnicornByName", // 서버에 find~ 라우터 이써야 함. 이 과제에선 우리 자체 서버이므로 일단 localhost:5000 나중엔 heroku로 바꾸자
        //디플로이 전까진 이걸로 테스트 http://localhost:5000/findUnicornByName
        type: "POST", //get 말고 POST. Rq 보내기! ㅎㅎㅎ data 키페어가 하나 들어가.  //옛날엔 서버에 뭔가 요청할 때 get으로 URL에서 따왔지만 이젠 http 바디에서 따와 ㅇㅇ보안에도 굳.
        data: { //"POST" 하려면 data field(서버에게 POST RQ와 함꼐 보낼 json파일)가 있어야 함. 왜냐,POST request는 url이 아니라 http body와 함께 data를 보냄

            "unicornName": $("#unicornName").val() //뭐가 좋을까? 일단 val은 저거하고 키 이름은 이렇게 해주자 ㅋㅋ
        },
        success: process_response
    })
}


//step6-1
//geekforce링크 보면 is() 메서드로 체크됐나 아닌가. prop()으로 강제로 체크, 안체크 하게 체크.
//w3school   .is(":checked")ㅋㅋ
function findUnicornByFood() {
    appleIsChecked = "unchecked" //변수명, 값 네 맘대로 해도됨 ㅎㅎ
    carrotIsChecked = "unchecked" //디폴트는 unchecked로 하고 ㅋㅋ

    if ($('#apple').is(":checked")) //is 메서드! 저 아디인 체크박스가 체크됐냐.
        appleIsChecked = "checked"


    if ($('#carrot').is(":checked"))
        carrotIsChecked = "checked" // if문에 한 줄 이상 올거면 { }로 처리해줬어야 함!

    // ㅇㅋ 이 버튼으로 할 요청도 POST니까 위에서 복붙해오자.
    $.ajax({
        url: "https://damp-coast-44326.herokuapp.com/findUnicornByFood",
        // heorku, mongoDB deploy 전까진 localhost로 테스트하렴!
        type: "POST",
        data: {
            "appleIsChecked": appleIsChecked,
            "carrotIsChecked": carrotIsChecked,
        },
        success: process_response
    })
}


//step M-0
function findUnicornByWeight() {
    lowerWeight = $('#lowerWeight').val()
    higherWeight = $('#higherWeight').val()

    $.ajax({
        url: "https://damp-coast-44326.herokuapp.com/findUnicornByWeight",
        // heorku, mongoDB deploy 전까진 localhost로 테스트하렴!
        type: "POST",
        data: {
            "lowerWeight": lowerWeight,
            "higherWeight": higherWeight,
        },
        success: process_response
    })
}

//step M-2
function filter() {
    nameIsChecked = "unchecked"
    weightIsChecked = "unchecked"

    if(
        (! ($('#unicornNameFilter').is(":checked"))) && (! ($('#unicornWeightFilter').is(":checked"))))     {
            good_look_data = JSON.stringify(received_data, null, 4);
            $("#result").html("<pre>" + good_look_data + "</pre>"); 
    }else {

    aList = []
    filtered_output = received_data.map(function (obj_) {
        
        if ($('#unicornNameFilter').is(":checked"))
            aList.push(obj_["name"])
        if ($('#unicornWeightFilter').is(":checked"))
            aList.push(obj_["weight"])
        return aList
       
    })
    $('#result').html("<pre>" + filtered_output + "</pre>")

}
}




function setup() {
    // console.log("setup fx called")
    $('#findUnicornByName').click(findUnicornByName);
    $('#findUnicornByFood').click(findUnicornByFood); //step 6. 푸드 검색 submit 버튼이랑 묶기
    $('#findUnicornByWeight').click(findUnicornByWeight);
    $('#filter').click(filter);
}


$(document).ready(setup)




//이 code.js를 퍼블릭  넣어뒀으니 code.js가 서버단에서 쏴질 거임
// 이 방식 싫으면 app.get으로 해도 된다..  근데 server.js 에 이렇게 1줄로 처리하는 게 낫지 않을까나?