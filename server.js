const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 뷰 엔진 설정 (ejs 사용)
app.set('view engine', 'ejs');

// DB 연결 설정 (비밀번호 꼭 확인하세요!)
const db = mysql.createConnection({
    host: 'localhost',       // AWS에 올릴 때도 로컬 DB 쓸 거면 localhost, RDS면 엔드포인트
    user: 'root',            // 본인 MySQL 아이디 (보통 root)
    password: 'rootroot',  // <-- 여기 본인 비밀번호로 변경 필수!!!
    database: '202245098_schema'
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
        return;
    }
    console.log('MySQL 연결 성공!');
});

// 메인 페이지 라우터
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.send('DB 에러 발생');
        } else {
            // index.ejs 파일에 results 데이터를 보냄
            res.render('index', { projects: results });
        }
    });
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});