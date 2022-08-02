
// URLs
const POSTS_URL = "http://127.0.0.1:3000/posts";
const REPLIES_URL = "http://127.0.0.1:3000/replies";
const USERS_URL = "http://127.0.0.1:3000/users";

// DOM Elements
const mainArea = document.querySelector("#main");
const navBar = document.querySelector("nav");

const buttonSignIn = document.querySelector("#sign-in-window-button");
const heyThereWindow = document.querySelector("#hey-there-window");
const welcomeWindow = document.querySelector("#welcome-window");
const newUserForm = document.querySelector("#new-user-form");

const buttonWriteWindow = navBar.querySelector("#write-window-button");
const writeWindow = document.querySelector("#write-window");
const newPostForm = writeWindow.querySelector("#new-post");
const closeWriteWindow = writeWindow.querySelector("#close-write-window");
const writeWindowBackground = writeWindow.querySelector("#write-window-background");

const newReplyForm = document.querySelector("#new-reply")
const replyWindow = document.querySelector("#reply-window");
const closeReplyWindow = document.querySelector("#close-reply-window");
const replyWindowBackground = document.querySelector("#reply-window-background");

const searchBar = document.querySelector("#search-bar"); 
const mathSelector = document.querySelector("#math-selector");
const econSelector = document.querySelector("#economics-selector");
const bioSelector = document.querySelector("#biology-selector");
const chemSelector = document.querySelector("#chemistry-selector");
const socialSciencesSelector = document.querySelector("#social-sciences-selector");
const humanitiesSelector = document.querySelector("#humanities-selector");


// Establishing Fetches
fetch(POSTS_URL)
.then(res => res.json())
.then(postArray => displayAllPosts(postArray));

// Fixing all my life problems in one javascript function
mainArea.addEventListener("click", event => {
    let postId = event.target.parentNode.parentNode.parentNode.id
    let postLikes = event.target.parentNode.parentNode.parentNode.dataset.likes;
    postLikes = parseInt(postLikes) + 1;
    if (event.target.id == 'like-button') {
        if (event.target.parentNode.innerHTML == `<img id="like-button" src="./assets/icons8-heart-32.png">`) {
                        console.log("i like")
                        const likesCount = event.target.parentNode.parentNode.parentNode.querySelector("#likes-display") 
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-filled-heart-32.png"/>`
                        likesCount.textContent= `${postLikes} Likes`
                    } else {
                        console.log("unlike")
                        const likesCount = event.target.parentNode.parentNode.parentNode.querySelector("#likes-display") 
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-heart-32.png"/>`
                        postLikes = parseInt(postLikes) - 1;
                        likesCount.textContent= `${postLikes} Likes`
                    };
        
    } else if(event.target.parentNode.id == 'reply-window-button') {
        console.log(postId)
        replyWindow.classList.add("is-active")
        newReply(postId)
    };
});

function newReply(postId) {
    console.log(`Creating a reply to post ${postId}`)
    newReplyForm.addEventListener("submit", event =>{
        event.preventDefault()
        const newReplyData = {content: event.target.querySelector("#new-reply-content").value, post_id: postId}
        replyWindow.classList.remove("is-active")

        fetch(REPLIES_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                        body: JSON.stringify(newReplyData),
                    })
                .then(res => console.log(newReplyData))
    location.reload()
});
}

// Display Functions
function displayAllPosts(postArray) {
    postArray.forEach(post => displayPost(post))
};

function displayPost(post) {
    let postCard = document.createElement("div");
    postCard.dataset.id = post.id;
    postCard.classList.add("card")
    postCard.classList.add("is-fluid")
    postCard.classList.add("individual-post")
    postCard.innerHTML = `
                    <div class= "m-6 p-5" id = ${post.id} data-likes = ${post.likes}>
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">${post.title}</p>
                                <p class="subtitle is-6">@${post.showname}</p>
                            </div>
                        </div>
                        <div>
                            <h2 id = "likes-display">${post.likes} Likes</h2>
                        </div>
                        <div class="tags py-2">
                                <span class="tag is-link" id = "tag-1">${post.tag1}</span>
                                <span class="tag" id = "tag-2">${post.tag2}</span>
                                <span class="tag" id = "tag-3">${post.tag3}</span>
                            </div>
                        <div class="content p-3 m-5">
                            <div>
                                ${post.content} 
                            </div>
                        </div>

                        <div class = "content">
                            <time>${post.created_at}</time>
                        </div>

                        <div class ="buttons">
                            <button class="button is-success is-small" id = "reply-window-button"><img src="./assets/icons8-composing-mail-32.png"</button>
                            <button class = "button is-small"><img id = "like-button" src="./assets/icons8-heart-32.png"/></button>
                        </div>
                       
                        <footer class="card-footer">
                        <div class = "content" id = "replies">
                            <br>
                            <h4>Replies</h3>
                            <ul id= "main-thread">
                            </ul>
                        </div>
                        </footer>
                    </div>`
    repliesFetch(postCard);
    mainArea.prepend(postCard);
};

function listReplies(repliesArr, postCard){
    const mainThread = postCard.querySelector("#main-thread")
    let filteredReplies = repliesArr.filter(reply => reply.post_id == postCard.dataset.id)
    // debugger
    filteredReplies.forEach(reply => {
        let replyItem = document.createElement("div")
        replyItem.classList.add("card")
        replyItem.classList.add("p-5")
        replyItem.classList.add("m-3")
        replyItem.textContent = `${reply.content}`

        mainThread.append(replyItem)
    })
};

function repliesFetch(postCard) {
    fetch(REPLIES_URL)
    .then(res => res.json())
    .then(repliesArr => listReplies(repliesArr, postCard))
};

function filterBySearch(postArray, seachParams) {
    // debugger
    // return postArray.filter(post => post.tag1.toLowerCase().includes(seachParams))
    return postArray.filter(post => searchMagic(post, seachParams))
};

function searchMagic(post, seachParams) {
    if (post.tag1.toLowerCase().includes(seachParams) || 
    post.tag2.toLowerCase().includes(seachParams) || 
    post.tag3.toLowerCase().includes(seachParams) ||
    post.title.toLowerCase().includes(seachParams) ||
    post.tag1.includes(seachParams) || 
    post.tag2.includes(seachParams) || 
    post.tag3.includes(seachParams) ||
    post.title.includes(seachParams)) {
        return post
    }
};

function filterByMath(postArray) {
    return postArray.filter(post => post.tag1 == "Math")
};

function filterByEcon(postArray) {
    return postArray.filter(post => post.tag1 == "Economics")
};

function filterByBio(postArray) {
    return postArray.filter(post => post.tag1 == "Biology")
};

function filterByChem(postArray) {
    return postArray.filter(post => post.tag1 == "Chemistry")
};

function filterBySocialSciences(postArray) {
    return postArray.filter(post => post.tag1 == "Social Science")
};

function filterByHumanities(postArray) {
    return postArray.filter(post => post.tag1 == "Humanities")
};

// Event Listeners
searchBar.addEventListener("input", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterBySearch(postArray, event.target.value))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

mathSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByMath(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

econSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByEcon(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

bioSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByBio(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

chemSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByChem(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

socialSciencesSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterBySocialSciences(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

humanitiesSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByHumanities(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

buttonSignIn.addEventListener("click", event => {
    heyThereWindow.classList.remove("is-active")
    welcomeWindow.classList.add("is-active")
});

newUserForm.addEventListener("submit", event => {
    event.preventDefault()
    const newUserData = {username: event.target.querySelector("#new-username").value,
                        email: event.target.querySelector("#new-email").value,
                        password: event.target.querySelector("#new-password").value,
                        college: event.target.querySelector("#new-college").value,
                        major: event.target.querySelector("#new-major").value}
    console.log(newUserData)
    welcomeWindow.classList.remove("is-active")
    scrollTop()
    
    fetch(USERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
    })
    .then(res => console.log(newUserData))

});

buttonWriteWindow.addEventListener("click", event => {
    writeWindow.classList.add("is-active")
});

newPostForm.addEventListener("submit", event =>{
    event.preventDefault()
    const newPostData = {title: event.target.querySelector("#new-title").value,
                        content: event.target.querySelector("#new-write-content").value,
                        likes: 0, 
                        showname: event.target.querySelector("#show-user-name").value,
                        tag1: event.target.querySelector("#tag1-input").options[event.target.querySelector("#tag1-input").selectedIndex].value,
                        tag2: event.target.querySelector("#tag2-input").value,
                        tag3: event.target.querySelector("#tag3-input").value}
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