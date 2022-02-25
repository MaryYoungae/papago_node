const { options } = require("request");

const textAreaArray = document.querySelectorAll('textarea');
console.log(textAreaArray);

// 변수 네이밍 컨벤션, 도메인과 관련된 용어 정의 
// source : 번역할 텍스트와 관련된 명칭
// target : 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray;
// console.log(sourceTextArea);
// console.log(targetTextArea);

const [sourceSelect, targetSelect] = document.querySelectorAll('select');
// console.log(sourceSelect);
// console.dir(targetSelect);

// 번역할 언어의 타입 (ko?, en?, ja?)
let targetLanguage = 'en';

// console.dir(targetSelect);
// console.log(targetSelect.options);
// console.log(targetSelect.options[targetSelect.selectedIndex]); 
// 'ko', 'ja'
// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지 값이 바뀔때마다 이벤트 발생
targetSelect.addEventListener('change', () => {
    const selectedIndex = targetSelect.selectedIndex;
    // console.log(selectedIndex);
    targetLanguage = targetSelect.options[selectedIndex].value;
    // console.log(targetLanguage);
});

let debouncer;

// 1. 어떤 이벤트?
// 2. textarea에 입력한 값을 어떻게 가져올수 있을까?
sourceTextArea.addEventListener('input', (event) => {

    if(debouncer) { // 값이 있으면 true, 없으면 false
        clearTimeout(debouncer); // 시간을 계속 초기화 시킴. 계속 입력하고 있을때
    }

    debouncer = setTimeout(()=>{

        const text = event.target.value; // textArea에 입력한 값
        // console.log(text);
    
        if(text){
                    // 이름이 XML일뿐이지, XML에 국한되지 않음
        const xhr = new XMLHttpRequest();
    
        const url = '/detectLangs'; //node 서버의 특정 url 주소
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 & xhr.status == 200) {
                // 서버의 응답 결과 확인(responseText: 응답이 포함된 텍스트)
                // console.log(typeof xhr.responseText);
                const responseData = xhr.responseText;
                console.log(`responseDate: ${responseData}, type: ${typeof responseData}`);
                
                // 두번 파싱하는이유
                // https://stackoverflow.com/questions/30194562/json-parse-not-working/49460716
                const parseJsonToObject = JSON.parse(JSON.parse(responseData));
    
                console.log(typeof parseJsonToObject, parseJsonToObject);
    
                // parseJsonToObject의 프로퍼티 가져오는 방법
                const result = parseJsonToObject['message']['result']; // ?
                const options = sourceSelect.options;

                for (let i = 0; i < options.length; i ++) {
                    if(options[i].value === result['srcLangType']) {
                        sourceSelect.selectedIndex = i;
                    }
                }

                // 번역된 텍스트를 결과화면에 입력
                targetTextArea.value = result['translatedText'];
    
                
                // 응답의 헤더(Header)확인
                // console.log(`응답헤더 : ${xhr.getAllResponseHeaders()}`);
            }
        };


        /*
        status 몇번인지 확인 필요 없이 가능한 방법
        xhr.addEventListener('load', () => { //로딩이 완료되었을때 실행
            if (xhr.status == 200){
                // 내부 코드 동일. 
            }
        });
        */

        xhr.open("POST", url);
    
        // 서버에 보내는 요청 데이터의 형식이 json형식임을 명시
        xhr.setRequestHeader("Content-type", "application/json");
    
        // 아래 sned를 하나의 객체로 보내기 위해 객체생성
        const requestData = {
          text, 
          targetLanguage  
        };
    
    
        // JSON(Javascript Object notation)의 타입은? string
        // 내장모듈 JSON 활용 [ 'a', 'b', 'c']문자열타입 직렬화, 다시 파싱해서 받음
        // 서버에 보낼 데이터를 문자열화 시킴
        const jsonToString = JSON.stringify(requestData);
        // console.log(typeof jsonToString);
    
        xhr.send(jsonToString);

        } else {
            console.log('번역할 텍스트를 입력하세요');

        }
    }, 3000);
});

