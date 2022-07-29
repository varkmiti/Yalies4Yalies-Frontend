
// URLs
const POSTS_URL = "http://127.0.0.1:3000/posts";
const REPLIES_URL = "http://127.0.0.1:3000/replies"

// DOM Elements
const mainArea = document.querySelector("#main");
const navBar = document.querySelector("nav");
const buttonWriteWindow = navBar.querySelector("#write-window-button");
const writeWindow = document.querySelector("#write-window");
const newPostForm = writeWindow.querySelector("#new-post");
const closeWriteWindow = writeWindow.querySelector("#close-write-window");
const writeWindowBackground = writeWindow.querySelector("#write-window-background");

const newReplyForm = document.querySelector("#new-reply")
const replyWindow = document.querySelector("#reply-window");
const closeReplyWindow = document.querySelector("#close-reply-window");
const replyWindowBackground = document.querySelector("#reply-window-background");

// Establishing Fetches
fetch(POSTS_URL)
.then(res => res.json())
.then(postArray => displayAllPosts(postArray));

// Fixing all my life problems in one javascript function
mainArea.addEventListener("click", event => {
    console.log(event.target.parentNode.innerHTML)
    if (event.target.id == 'like-button') {
        if (event.target.parentNode.innerHTML == `<img id="like-button" src="./assets/icons8-heart-32.png">`) {
                        console.log("i like")
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-filled-heart-32.png"/>                        `
                        // debugger
                    } else {
                        console.log("unlike")
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-heart-32.png"/>`
                    };
        
    };
});

// Display Functions
function displayAllPosts(postArray) {
    postArray.forEach(post => displayPost(post))
};

function displayPost(post) {
    let postCard = document.createElement("div");
    postCard.dataset.id = post.id;
    postCard.classList.add("card")
    postCard.classList.add("is-fluid")
    postCard.innerHTML = `
                    <div class= "m-5 p-5">
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
                        <div class ="buttons">
                            <button class="button is-success is-small" id = "reply-window-button">Reply</button>
                            <button class = "button is-sucess is-small"><img id = "like-button" src="./assets/icons8-heart-32.png"/></button>
                        </div>
                       
                        <footer class="card-footer">
                        <div class = "content" id = "replies">
                            <h4>Replies</h3>
                            <ul id= "main-thread">
                            </ul>
                        </div>
                        </footer>
                    </div>`
    repliesFetch(postCard);
    makeReplyButton();
    // makeLikeButton();
    mainArea.prepend(postCard);
    
};

function listReplies(repliesArr, postCard){
    const mainThread = postCard.querySelector("#main-thread")
    let filteredReplies = repliesArr.filter(reply => reply.post_id == postCard.dataset.id)
    filteredReplies.forEach(reply => {
        let replyItem = document.createElement("li")
        replyItem.textContent = `${reply.content}`

        mainThread.prepend(replyItem)
    newReplyForm.addEventListener("submit", event =>{
        event.preventDefault()
        const newReplyData = {content: event.target.querySelector("#new-content").value, post_id: 20}
        writeWindow.classList.remove("is-active")
        scrollTop()
    
        fetch(REPLIES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify(newReplyData),
            })
        .then(res => console.log(newReplyData))
    });
    })
};

function repliesFetch(postCard) {
    fetch(REPLIES_URL)
    .then(res => res.json())
    .then(repliesArr => listReplies(repliesArr, postCard))
};

// function makeLikeButton() {
//     const likeButton = document.querySelectorAll(".like-button");
//     likeButton.forEach(button => button.addEventListener("click", event => {
         
//         if (button.innerHTML == `<img src="./assets/icons8-heart-24.png">`) {
//             console.log("i like")
//             button.innerHTML = `<img src="./assets/icons8-heart-26.png">`
//             button.classList.add("is-danger")
//         } else {
//             console.log("unlike")
//             button.innerHTML = `<img src="./assets/icons8-heart-24.png"/>`
//             button.classList.remove("is-danger")
//         };
//     }));
// };

function makeReplyButton() {
    const buttonReplyWindow = document.querySelectorAll("#reply-window-button");
    buttonReplyWindow.forEach(button => button.addEventListener("click", event => {
        replyWindow.classList.add("is-active")
    }))
};

// Event Listeners
buttonWriteWindow.addEventListener("click", event => {
    writeWindow.classList.add("is-active")
});

newPostForm.addEventListener("submit", event =>{
    event.preventDefault()
    const newPostData = {title: event.target.querySelector("#new-title").value,
                        content: event.target.querySelector("#new-content").value}
    displayPost(newPostData)
    writeWindow.classList.remove("is-active")
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

closeReplyWindow.addEventListener("click", event => {
    replyWindow.classList.remove("is-active")
});

replyWindowBackground.addEventListener("click", event => {
    replyWindow.classList.remove("is-active")
});





// Utility Functions
function scrollTop() {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    })
};

