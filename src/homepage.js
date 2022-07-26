POSTS_URL = "http://127.0.0.1:3000/posts"

fetch(POSTS_URL)
.then(res => res.json())
.then(console.log)