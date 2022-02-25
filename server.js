const express = require("express"); // express 패키지 import

const app = express(); // 백엔드 관련된 인스턴스를 app에 넣기

// API key를 별도 관리 : dot(.)env 활용, .env라는 파일에 key를 보관하고 dotenv가 .env파일을 활용해서, process.env 객체에 포함시킴
const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECERT

// node.js 서버가 또 다른 client가 되어 naver 서버에 요청을 보내기 위해 사용.
const request = require('request');

// app에 설정들 추가
// express의 static 미들웨어 활용
app.use(express.static('public'))

// express의 json 미들웨어 활용 (json 형식 변환용)
app.use(express.json())

// 아래의 'index.html'만 입력했을때 서버 연결안됨
// 해당 경로 파악하기 위한 코드
// console.log(`현재 파일명: ${__filename}`);
// console.log(`index.html의 파일경로 : ${__dirnmae}`);

// root url : localhost:3000/ 
// 해당 경로로 요청이 들어왔을때 호출될 함수.
// 두 인자값 (arguments)을 받음 : request(req), response(res)
app.get("/", (req, res) => {
  //root url, 즉 메인 페이지로 접속했을때 papago의 메인페이지가 나와야함
  res.sendFile(__dirname, 'index.html');
});

// detectLangs 경로로 요청했을때
app.post("/detectLangs", (req, res) => {
  // 번역할 텍스트를 받아야 함.

  console.log(req.body);
  console.log(typeof req.body); // object ,JSON.parse()~ 해서 파싱해야하는데 알아서?

  const { text:query, targetLanguage } = req.body;
  // console.log(query);
  // console.log(targetLanguage);

  const url = "https://openapi.naver.com/v1/papago/detectLangs";
  const options = {
    url,
    form: { query: query },
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  };
// options에 요청에 필요한 데이터 동봉
// () => {} : 요청에 따른 응답 정보를 확인
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      // console.log(typeof body); //string (JSON)
      const parsedBody = JSON.parse(body); // parse() : string -> object 변환
      console.log(typeof parsedBody, parsedBody);
      
      // papago 번역 url로 redirect(재요청)
      res.redirect(`translate?lang=${parsedBody['langCode']}&targetLanguage=${targetLanguage}&query=${query}`);// 쿼리스티링(query string)으로 데이터 전송(GET요청)
      // localhost:3000/translate?lang=ko&targetLangquage=en&query=안녕(%2D%G5~~,퍼센트인코딩)

    } else {
      console.log(`error = ${response.statusCode}`);
    }
  });

});

// papago 번역 요청 부분
app.get("/translate", (req, res) => {
  const url = 'https://openapi.naver.com/v1/papago/n2mt';
  console.log(req.query, typeof req.query);
  const options = {
    url,
    form: {
      source: req.query['lang'], // query string으로 받은 값들 mapping or binding
      target: req.query['targetLanguage'],
      text: req.query['query'],
    },
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  }

  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // console.log(body, typeof body);
      res.json(body); // front에 해당하는 script.js에 응답데이터(json)전송
      // json() : stringify()가 적용된 메서드
    } else {
      console.log(`error = ${response.statusCode}`);
    }
  });

});

// 포트 설정 
app.listen(3000, () => {
  console.log('http://127.0.0.1:3000/ app listening on port 3000!');
});

