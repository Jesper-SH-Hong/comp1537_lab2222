const express = require('express')
const app = express()
const bodyparser = require("body-parser");  //rq의 body 읽기 위해 바디 파서!

app.use(bodyparser.urlencoded({          // lemme decode the body of the http 뜻임
    extended: true
}));



//step1
// app.listen(5000, function (err) {
//     if (err) console.log(err);
// }) deploy 전까지 테스트는 이거

//step1 new. HEROKU
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


// app.get('/', function (req, res) {
//     res.send('GET request to homepage")  기본형. 뭐 html을 코드나, text로 send 가능. index.html 자체를 통쨰로 보내려면? 
//   })                                     //sendFIle 쓰면 됨

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + "/index.html")   //해당 파일의 path
//   })

// app.get('/code.js', function (req, res) {
// res.sendFile(__dirname + "/code.js")   //누군가 code.js를 까볼라나 싶어서..ㅋㅋ code.js도 만들고
// })                                     //그래서 무튼 우리가 서버 side에서 code.js도 send해주고 있는 상황임. 모든 게 server side에 머무는 중 ㅋㅋ


// 근데 위처럼 /나 /code.js처럼 하나하나 라우터 만들면 너무 귀찮잖아. css.style이나 image 폴더나.. 
// 그래서 한큐에 처리하게 app.use를 씀


app.use(express.static('public'))  //이 경우 위에는 저렇게 다 죽여야 함.
//public이란 폴더를 다 클라이언트한테 줄라면 저 폴더 내의 index가 돌아가 질거임.
//안 바뀌는 static 컨텐츠.. 이미지, html, style.css, code.js 등 과거에 클라 사이드를 위해 쓰던 걸.. public에 넣어서.. publc의 파일 중 하나로 넣으면 그것들이 클라에게 쏴질거임.
// 하나씩 라우터 지정 get(/~~)안 해주고 저 퍼블릭에서 알아서 찾아가라. // 안 바뀌는 static 파일들이니 걍 짱박아두면 되잖아 ㅎㅎ


//이제 클라이언트의 첫 다이내믹 Rq from client. 클라가 어떤 거든 입력하고 그 request에 따라 결과 보여줘야지.
//유니콘 패스할 거임.. 인덱스.html 가서 code.js랑 꾸미고 오셈
//오키 일단 인덱스 f12 보니 텍스트 창은 unicornName,   검색 submit 버튼은 findUnicornByName이네 이걸로 clicking evt 캐치하자. 클라 사이드에서
//code.js로 가자)




//step3
//이제 DB랑 연결해보자. 저 이름 갖고 작업해서 다시 클라한테 쏴주게
// npm install mongoose, dependencies chk in pkg.json

const mongoose = require('mongoose'); //import mongoose 맨 위에 해줘도 되고 어디든 mongoose 쓰기 전에만 들가면 됨.

mongoose.connect("mongodb+srv://seonghyun91:comp1537@cluster0.sgygh.mongodb.net/JesperFirstDB?retryWrites=true&w=majority", //connect to ur local DB. 포트는 그대로. 모두 DB 기본이 test일거임. 너의 db 위치, db명. mongoDB atlas에 호스트해서 쓸 일 있을 것. 웹사이트나 db 등
    {               //mongodb://localhost:27017/test로 테스트하고 마지막에 atlas에 자료 올리고 저렇게 바꿈. myFirstDatabase는 우리 몽고db test같은거임 그 안에 unicorns 컬렉션 넣어놨지 ㅎㅎ
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const unicornSchema = new mongoose.Schema({ //사실상 몽구스에선 이름이랑 이 스키마만 수정!! 네 콜렉션 업뎃용. schema가 네 json 오브젝트의 shape을 정할 거임ㅎㅎ
    name: String,       //A3는 업뎃이 과제가 아니라 상관없지만 그래도 해보자.
    weight: Number,
    // loves: String // array로 주고 싶으면 loves: [string]
    dob: Date,
    loves: [String],
    gender: String //실제 사용할 거만 스키마에 갖다 박으셈
});
const unicornModel = mongoose.model("unicorns", unicornSchema); // 상수명도 unicornModel, model은 db 접속용. "콜렉션명", 스키마




//step2
app.post("/findUnicornByName", function (req, res) {      // "/"말고 클라단. code.js 가서 ajax가 요청할 라우터로 매치해주자.
    console.log("req. has been received")  //클라가 요청한 게 Post인 동시에 저 라우트  url이어야만 발동함!
    console.log(req.body.unicornName) // 그 유니콘 네임 잡아보자 ㅋㅋ Ajax rq(post!)에 실려진 data.json object의 키를 활용함 수업중질문: .balance는 get이나 url로 list 보낼 떄 쓰던거
    //Aurora라고 콘솔에 띄움ㅋㅋ. 드디어 서버가 클라의 RQ를 읽었따. 드디어 유저 RQ를 활용할 수 있겠군

    //https request의 body를 read하려면 parse 해야 함. body에 접근하기 위해선 body-parser 세팅해주고 오자!



    //step4
    //DB에서 읽어오기  //모델은 위에 몽구스에서 따오고. find든 update든 remove든은 네 맘대루 ㅎㅎ
    unicornModel.find({name: req.body.unicornName}, function(err, unicorns){   //뒤는 콜백. err이거나 유니콘 리스트(맞는 유니콘 데이터들) 뱉을거
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ (unicorns));  //우리(vs) 서버측 콘솔에서 보깅ㅋㅋ
        }
        res.send(unicorns);  // send unicorns back to the client if there's any unicorns
    });
})
  // 여까지 하면 브라우저에도 서버측 답 잘 오고(오브젝트) 콘솔에도 오로라 오브젝트 잘 뜰거임!


  //step5. 클라쪽 넘어가서 code.js에 result div에 결과 띄우깅


//step6 체크박스 다루기(index) 거기 개별 input id 줘났음 weight~등



//step6 7 
app.post("/findUnicornByFood", function (req, res) {     
    console.log("req. has been received")  
    console.log(req.body.appleIsChecked) 
    console.log(req.body.carrotIsChecked)
    aList = [] // 이 빈 어레이를 위 2 밸류로 populate해보자.. 아예 안좋아하거나 1개, 다 좋아할 수도 ㅎㅎ 일단 이 어레이에 담아 던져주게

    if(req.body.appleIsChecked == "checked")
        aList.push("apple")  //push가 어레이에 추가 하는 거
        
    if(req.body.carrotIsChecked == "checked")
        aList.push("carrot")
    
    unicornModel.find(
        {loves: {   $in : aList  }}, function(err, unicorns) {

        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Data "+ unicorns);  //우리(vs) 서버측 콘솔에서 보깅ㅋㅋ
        }
        res.send(unicorns);  // send unicorns back to the client if there's any unicorns
        }
    );
});






//HEROKU에 올렸어도..
// 네 DB는 지금 mongoose.connect 보면 ("mongodb://localhost:27017/test")로 네 랩탑. 로컬 호스트에 연결되있음.
// HEROKU는 거기 access 못해.
// DB도 atlas에 해줘야겠다.


//야 그러고 나면 mongoose에도 atlas로 바꿔주고
//클라이언트 code.js 단에도 이제 localhost가 아니라 네 deploy한 주소로 꿔야지 ㅎㅎ




// //app.post 복붙하고 /findUnic~해주고
// app.post("/findUnicornByName", function (req, res) {
//             console.log("req. has been received!");
//             // res.send("SSS!");

//             //access DB, retrieve back to client!
//             //cmd mongo 켜서 융니콘 db 잘 도나 확인 find(), count해봐서 ㅋㅋ

