# 홈페이지 👉 [A-fo.kr](https://a-fo.kr) 

## ✈ [A-fo](https://github.com/qwe1234k/HH99FinalProject_BE) BE repository
---
![a-fo-mainImage](https://user-images.githubusercontent.com/96129738/171001558-4c3a09b6-a265-4aff-9c3a-f6c5eba57071.png)


---

## 📋 [팀노션 링크 들어가기](https://www.notion.so/40fa62a06e8e444280f9c84ff5ea274d)

---

## 🔎 서비스 소개
✈ **워홀, 유학, 해외취업, 이민 통합 플랫폼**<br>
해외에서 성장하고싶은 사람들에게, 이전보다 정보를 쉽게 얻을 수 있도록 도움을 주는 사이트입니다.


---

## 👨‍👩‍👧‍👧 백엔드 팀원 깃허브 주소

- 백엔드
  - 이태성 : https://github.com/qwe1234k
  - 유지웅 : https://github.com/JiwoongYoo1
  - 윤석일 : https://github.com/IcandoDeveloper
---

## 🖥 프로젝트 아키텍쳐

![ppt-이미지로-변환용](https://user-images.githubusercontent.com/96129738/171004010-e03d4a6b-dda6-41c6-b0e3-5f18c12d149f.svg)


---

## 🎄 프로젝트 API

👉 A-fo API 명세서 : https://xkskxhtm96.gitbook.io/99-api-1/reference/api-reference

---

## 📕 주요 라이브러리

| 라이브러리    | 설명                       | 버전   |
| ------------- | -------------------------- | ------ |
| Express       | Node.js                    | 4.18.1 |
| MYSQL2         | 참조관계가 많은 데이터 특성. MySQL 적용 | 2.3.3 |
|sequelize      | mySql orm                      |6.19.0 |
|sequelize-cli      | mySql orm                      |6.4.1 |
| CORS          | Request resouRce 제한      | 2.8.5  |
| jsonwebtoken  | 암호화 토큰                 | 8.5.1  |
| multer       | 이미지 데이터 처리              | 1.4.4  |
| multer-s3        | 사진 파일 업로드               | 2.10.0  |
| passport-kakao      | 카카오 로그인    | 1.0.1  |
|  passport-google-oauth20      | 구글 로그인                | 2.0.0  |
| dotenv       | 환경변수 관리               | 16.0.0  |
| helmet       | HTTP 헤더 보안               | 5.1.0  |

---

## 🌠 기능소개

- 나라별 비교 정보 공유
- 커뮤니티 기능

---

## 🔑 트러블 슈팅 상세 보기


<details markdown="1">
<summary>1. 데이터 계층화 하기</summary>

<!--summary 아래 빈칸 공백 두고 내용을 적는공간-->
## 1. 데이터 계층화 하기

### 목적 및 초기상황

<aside>
💡 A-fo는 여러나라의 다양한 카테고리를 제공해줘야하는 목적이 있습니다. 이를 효과적으로 표현하려면 데이터를 json형태로 계층화 작업을 체계적으로 해야했습니다. 체계적이라 함은FE가 map함수를 사용하는데 문제가 없는 구조로 설계함을 의미합니다.

</aside>

### 문제상황

<aside>
💡 초기에는 BE가 자체적으로 판단해서 json 구조를 임의로 설계해서 응답을 해주었더니, FE 측에서 map이 안돌려진다고만 말씀하셔서 다시 BE가 임의로 json구조를 재설계하고 응답값을 FE가 확인하고 map이 안돌려진다는 식의 비효율적인 의사소통이 일어나고 있었습니다.

</aside>

### 해결책

<aside>
💡 json구조를 8번 가량을 재설계하고 나서 이렇게 해서는 일이 끝나지 않겠다 싶어서 먼저 FE가 원하는 구조를 제시해달라고 말씀드리고, 저희가 FE의 요구를 귀담아 듣고 재설계를 진행하였더니, 2번정도의 추가적인 재설계로 데이터의 json구조를 확정 지을 수 있었습니다.

</aside>

### 고찰

<aside>
  💡 일을 너무 단순하게 하던대로 하면 되겠지 식의 사고방식이 가장 문제였던것으로 생각됩니다. 해당 사고방식으로 인한 문제발생을 의식하자마자 FE의 요구를 먼저 들어보는게 맞겠다는 판단   이 들게되었습니다. 그에따라 FE의 요구대로 데이터의 json구조를 설계하니 재설계2번으로 정상동작을 할 수 있었고, 개발자간의 의사소통의 방법과 중요성에대해서 깨달게 되는 계기가 되었   습니다.

</aside>
</details>

<details markdown="1">
<summary>2. 로드밸런서로 인한 아키텍처변동</summary>

<!--summary 아래 빈칸 공백 두고 내용을 적는공간-->

## 2. 로드밸런서로 인한 아키텍처변동

### 목적 및 초기상황

<aside>
💡 초기 A-fo의 아키텍처는 게시글의 이미지를 단순히 EC2의 EBS에 저장하는 방식으로 구현을 했습니다. 그리고 이미지의 url을 RDS에 저장하는 방식으로 구현하여 FE에게 url을 응답하는 식으로 이미지가 게시글에 보이도록 하였습니다.
하지만 t2.micro 사양의 EC2 1개로는 많은 유저들이 사이트를 방문했을경우 긴 로딩을 유발하거나 먹통이 된다는 사례를 찾아볼 수 있어서 Application Load Balancer를 활용하여 2개의 EC2로 부하를 분산시키는 방식으로 아키텍처를 변경하였습니다.

</aside>

### 문제상황

<aside>
💡 EC2가 2개로 나뉘어지다 보니 url 주소를 FE에게 응답할때 1번EC2에 저장되어있는 이미지의 주소를 2번EC2에게 ALB가 요청을 하면 undefined가 뜨는 문제가 발생하게되었습니다.

</aside>

### 해결책

<aside>
💡 이미지를 Amazon S3라는 서비스로 별개의 이미지 저장공간을 활용하여 저장하였습니다. 그러므로 ALB가 어떤 EC2에게 이미지주소 요청을 하더라도 EC2는 S3가 생성한 이미지 url을 RDS에서 조회하여 응답하도록 하면 문제를 해결 할 수 있었습니다.

</aside>

### 고찰

<aside>
💡 서버 가용성을 위해 기존의 아키텍처에서 새로운 아케텍처로 구조 개선을 하게되었을때, 코드수정과 처음 사용해보는 AWS의 서비스를 공부하고 저희의 케이스에 맞도록 적용하는 경험을 하게되었습니다. 앞으로도 새로운 AWS 서비스를 공부해서 내 프로젝트에 적용해 볼 수 있겠다는 자신감을 얻을 수 있었습니다.

</aside>
</details

---
