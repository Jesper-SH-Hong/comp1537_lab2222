const express = require('express')
const app = express()
const bodyparser = require("body-parser");  //rq의 body 읽기 위해 바디 파서!

app.use(bodyparser.urlencoded({          // lemme decode the body of the http 뜻임
    extended: true
}));



//step1
// app.listen(5000, function (err) {  deploy 전까지 테스트는 이거
//     if (err) console.log(err);

//step1 new. HEROKU
app.listen(process.env.PORT || 5000, function (err) { 
    if (err)
        console.log(err);
})

// app.get('/', function (req, res) {
//     res.send('GET request to homepage")  

// app.get('/code.js', function (req, res) {
// res.sendFile(__dirname + "/code.js")  

//걍 한큐에 처리하게 app.use를 씀


app.use(express.static('public'))  //클라 사이드는 걍 개별 라우터 지정 없이 다 public에서 알아서 찾아가라.


//step 1.5
//클라이언트에서 rq 받게 인덱스.html 가서 code.js랑 꾸미고 오셈(나빌 사이트 inspect 복붙)
//submit 버튼들 id 유용하게 쓰일것 ㅋㅋ




//step3
//DB와 서버 연결. npm install mongoose, dependencies chk in pkg.json

const mongoose = require('mongoose'); //import mongoose 맨위든 어디든

//step3 & 8
mongoose.connect("mongodb+srv://jesp11:comp1537@cluster0.sgygh.mongodb.net/JesperFirstDB?retryWrites=true&w=majority",
//우선 mongodb://localhost:27017/test로 로컬에서 작업(test: 우리 기본 db)
// 마지막에 atlas에 자료 올리고 저렇게 바꿈. JesperFirstDB는 db 네임(로컬에선 test) 그 안에 unicorns 컬렉션 넣어놨지 ㅎㅎ
    {               
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const unicornSchema = new mongoose.Schema({ //몽구스에서 유일하게 손대는 부분 스키마 이름/ 키밸류. 콜렉션 업뎃용(사실 A3 필요x). schema가 네 json 오브젝트의 shape을 정할 거임ㅎㅎ
    name: String,       
    weight: Number,
    dob: Date,
    loves: [String], //Array로 주고 싶으면.
    gender: String //실제 사용할 거만 스키마에 갖다 박으셈
});
const unicornModel = mongoose.model("unicorns", unicornSchema); // 상수명도 unicornModel, model은 db 접속용. "콜렉션명", 스키마




//step2
app.post("/findUnicornByName", function (req, res) {      // "/"말고 code.js에서 각 ajax 콜이 요청한 라우터로 매치
    console.log("req. has been received")
    console.log(req.body.unicornName) // Ajax rq(POST)에 실려진 data(json obj)의 키를 활용
    //서버가 클라의 RQ 정상적으로 받음.
    //https request의 body를 읽으려면 body-parser 필요.


    //step4
    //궁금하면 cmd mongo 켜서 융니콘 db 잘 있나 확인ㅋㅋ
    //DB에서 읽어오기  //모델명은 위에 몽구스 스키마에서. find든 update든 remove든 함수는 맘대루 ㅎㅎ
    unicornModel.find({name: req.body.unicornName}, function(err, unicorns){   //뒤는 콜백. err이거나 유니콘 리스트(맞는 유니콘 데이터들) 뱉을거
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ (unicorns));  //우리(vs) 서버측 콘솔에만 보임
        }
        res.send(unicorns);  // 결과값 response/send
    });
})
  // 여까지 하면 브라우저에도 서버측 답 잘 오고(오브젝트) 콘솔에도 오로라 오브젝트 잘 뜰거임!


  //step5. 클라쪽 넘어가서 code.js에 result div에 결과 띄우깅


//step6 체크박스 다루기(index) 거기 개별 input id 줘났음 weight~등



//step6-2
app.post("/findUnicornByFood", function (req, res) {     
    console.log("req. has been received")  
    console.log(req.body.appleIsChecked) 
    console.log(req.body.carrotIsChecked)
    aList = [] // 이 빈 어레이를 위 2 밸류로 populate해보자.. 아예 안좋아하거나 1개, 다 좋아할 수도 ㅎㅎ 일단 이 어레이에 담아 던져주게

    if(req.body.appleIsChecked == "checked")
        aList.push("apple")  //push는 어레이에 추가 하는 거
        
    if(req.body.carrotIsChecked == "checked")
        aList.push("carrot")

    if (req.body.appleIsChecked == "checked" && req.body.carrotIsChecked == "checked"){
        unicornModel.find(
            {$and: [{loves: "apple"}, {loves: "carrot"}]}
        , function(err, unicorns) {

            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Data "+ unicorns);  //우리(vs) 서버측 콘솔에서 보깅ㅋㅋ
            }
            res.send(unicorns);  // send unicorns back to the client if there's any unicorns
            }
        )
    }
    else if (!(req.body.appleIsChecked == "checked" || req.body.carrotIsChecked == "checked")){
      unicornModel.find(
        {}
    , function(err, unicorns) {

        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Data "+ unicorns); 
        }
        res.send(unicorns); 
        }
    )
}
    else{
    unicornModel.find(
        {loves: {   $in : aList  }}, function(err, unicorns) {

        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Data "+ unicorns);  //우리(vs) 서버측 콘솔에서 보깅ㅋㅋ
        }
        res.send(unicorns);  // send unicorns back to the client if there's any unicorns
        }
    )};
});



//step m-1
app.post("/findUnicornByWeight", function (req, res) {     
    console.log("req. has been received")  
    console.log(req.body.lowerWeight) 
    console.log(req.body.higherWeight)

    low = req.body.lowerWeight
    high = req.body.higherWeight


    
    unicornModel.find(
        {weight: {$gt : low}, weight: {$lt : high}} , function(err, unicorns) {

        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Data "+ unicorns);  //우리(vs) 서버측 콘솔에서 보깅ㅋㅋ
        }
        res.send(unicorns);  // send unicorns back to the client if there's any unicorns
        }
    );
});



//Step 8 Hosting

//HEROKU에 올렸어도..
// 네 DB는 지금 mongoose.connect 보면 ("mongodb://localhost:27017/test")로 네 랩탑. 로컬 호스트에 연결되있음.
// HEROKU는 거기 access 못해.
// DB도 atlas에 해줘야겠다.


//야 그러고 나면 mongoose에도 atlas로 바꿔주고
//클라이언트 code.js 단에도 이제 localhost가 아니라 네 deploy한 주소로 꿔야지 ㅎㅎ