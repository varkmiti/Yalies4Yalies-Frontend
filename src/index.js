
// URLs
const POSTS_URL = "http://127.0.0.1:3000/posts";

// DOM Elements
const mainArea = document.querySelector("#main");
const navBar = document.querySelector("nav");
const buttonWriteWindow = navBar.querySelector("#write-window-button");
const writeWindow = document.querySelector(".modal");
const newPostForm = writeWindow.querySelector("#new-post");
const closeWriteWindow = writeWindow.querySelector("#close-write-window");
const writeWindowBackground = writeWindow.querySelector("#write-window-background");

fetch(POSTS_URL)
.then(res => res.json())
.then(postArray => displayAllPosts(postArray));

function displayAllPosts(postArray) {
    postArray.forEach(post => displayPost(post))
};

function displayPost(post) {
    let postCard = document.createElement("div");
    postCard.dataset.id = post.id;
    postCard.classList.add("container")
    postCard.classList.add("is-fluid")
    postCard.innerHTML = `
                    <div class= "has-background-primary-light">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">${post.title}</p>
                                <p class="subtitle is-6">@johnsmith</p>
                            </div>
                        </div>

                        <div class="content">
                            ${post.content} 
                            <div class="tags has-addons">
                                <span class="tag">Package</span>
                                <span class="tag is-primary">Bulma</span>
                            </div>
                            <time>${post.created_at}</time>
                        </div>
                        <footer class="card-footer">
                            <div class ="buttons">
                                <button class="button card-footer-item is-success is-small">Reply</button>
                                <button class="button card-footer-item is-small"><img src="./assets/icons8-heart-24.png"/></button>
                            </div>
                        </footer>
                    </div>`

    mainArea.prepend(postCard)
};

buttonWriteWindow.addEventListener("click", event => {
    writeWindow.classList.add("is-active")
});



newPostForm.addEventListener("submit", event =>{
    event.preventDefault()
    console.log(event.target)
    console.log(event.target.querySelector("#new-title").value)
    const newPostData = {title: event.target.querySelector("#new-title").value,
                        content: event.target.querySelector("#new-content").value}
    displayPost(newPostData)
    scrollTop()

    fetch(POSTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(newPostData),
        })
    .then(res => console.log(newPostData))
});

closeWriteWindow.addEventListener("click", event => {
    writeWindow.classList.remove("is-active")
});

writeWindowBackground.addEventListener("click", event => {
    writeWindow.classList.remove("is-active")
});


function scrollTop() {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    })
};