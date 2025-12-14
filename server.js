const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser'); // 데이터 받기용
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // 폼 데이터 처리

// DB 연결 (비밀번호 본인 걸로 꼭 확인!)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '본인비밀번호', // <--- 여기 비밀번호 수정 필수!
    database: '202245098_schema'
});

db.connect((err) => {
    if (err) console.error('DB 연결 실패:', err);
    else console.log('MySQL 연결 성공!');
});

// 1. 메인 화면 (목록 조회)
app.get('/', (req, res) => {
    // 최신순으로 정렬해서 가져오기
    db.query('SELECT * FROM 202245098_schema ORDER BY id DESC', (err, results) => {
        if (err) throw err;
        res.render('index', { projects: results });
    });
});

// 2. 글쓰기 화면 (등록 폼)
app.get('/write', (req, res) => {
    res.render('write');
});

// 3. 글 저장 기능 (DB에 INSERT)
app.post('/write', (req, res) => {
    const { title, description, image_url } = req.body;
    // 이미지 없으면 기본 이미지 사용
    const img = image_url || 'https://via.placeholder.com/300';
    
    db.query('INSERT INTO 202245098_schema (title, description, image_url) VALUES (?, ?, ?)', 
    [title, description, img], (err) => {
        if (err) throw err;
        res.redirect('/'); // 저장 후 메인으로 이동
    });
});

// 4. 상세 화면 (하나만 조회)
app.get('/project/:id', (req, res) => {
    db.query('SELECT * FROM 202245098_schema WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('detail', { project: result[0] });
        } else {
            res.send('없는 프로젝트입니다.');
        }
    });
});

// 5. 수정 화면 보여주기 (기존 내용 채워서 보여줌)
app.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM 202245098_schema WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { project: result[0] });
    });
});

// 6. 진짜 수정하기 (DB 업데이트)
app.post('/edit/:id', (req, res) => {
    const { title, description, image_url } = req.body;
    
    // UPDATE 쿼리 실행
    db.query('UPDATE 202245098_schema SET title=?, description=?, image_url=? WHERE id=?', 
    [title, description, image_url, req.params.id], (err) => {
        if (err) throw err;
        // 수정 완료 후 상세 페이지로 다시 이동
        res.redirect(`/project/${req.params.id}`);
    });
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});