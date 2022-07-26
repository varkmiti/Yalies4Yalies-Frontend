// Bulma formatting
// require('./sass/mystyles.scss');

// URLs
const POSTS_URL = "http://127.0.0.1:3000/posts";

// DOM Elements
const mainArea = document.querySelector("main")


fetch(POSTS_URL)
.then(res => res.json())
.then(postArray => displayAllPosts(postArray));

function displayAllPosts(postArray) {
    postArray.forEach(post => displayPost(post))
};

function displayPost(post) {
    let postCard = document.createElement("div");
    postCard.dataset.id = post.id;
    postCard.classList.add("card");
    postCard.innerHTML = `<h2 class = "post-title">${post.title}</h2>
    <p class = "content">${post.content}</p>`;

    mainArea.appendChild(postCard)
};

