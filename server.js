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
