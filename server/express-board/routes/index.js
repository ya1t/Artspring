const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

let posts = [];

// 홈 화면 - 게시글 목록
router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../public/index.html'), 'utf8', (err, data) => {
    if (err) throw err;

    let postList = posts.map(post => `<li><a href="/posts/${post.id}">${post.title}</a></li>`).join('');
    let htmlContent = data.replace('<!-- POST_LIST -->', postList);
    res.send(htmlContent);
  });
});

// 새 게시글 작성 폼
router.get('/posts/new', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/new.html'));
});

// 게시글 생성
router.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    createdAt: new Date()
  };
  posts.push(newPost);
  res.redirect('/');
});

// 게시글 상세 보기
router.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    fs.readFile(path.join(__dirname, '../public/show.html'), 'utf8', (err, data) => {
      if (err) throw err;

      let htmlContent = data.replace('<!-- TITLE -->', post.title).replace('<!-- CONTENT -->', post.content);
      res.send(htmlContent);
    });
  } else {
    res.status(404).send('Post not found');
  }
});

module.exports = router;
