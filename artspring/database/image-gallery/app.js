const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 정적 파일 제공
app.use(express.static('public'));

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  }
});

const upload = multer({ storage: storage });

// 이미지 리스트 API
app.get('/images', (req, res) => {
  fs.readdir('public/uploads/', (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send('서버 에러');
    } else {
      res.json(files);
    }
  });
});

// 이미지 업로드 처리
app.post('/upload', upload.single('image'), (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
