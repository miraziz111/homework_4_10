

import { Api } from "./api.js";


const users = document.querySelector(`.users`);;
const elBody = document.querySelector(`body`);
const posts = document.querySelector(`.posts`);
const comments = document.querySelector(`.comments`);
const select = document.querySelector(`select`);
const form = document.querySelector(`#form`);
const userForm = document.querySelector(`form`);
const box = document.querySelector(".box");

elBody.addEventListener("click", (evt) => {
  if(evt.target.tagName == "BUTTON"){
    let elem = evt.target
    if (elem.textContent == "Show post form") {
      form.classList.add("class", "d-flex");
      form.classList.remove("class", "d-none");
    } else if (elem.textContent == "Close form") {
      form.classList.remove("class", "d-flex");
      form.classList.add("class", "d-none");
    } else if (elem.textContent == "Show user form") {
      userForm.classList.add("class", "d-flex");
      userForm.classList.remove("class", "d-none");
    } else if (elem.textContent == "Close user form") {
      userForm.classList.remove("class", "d-flex");
      userForm.classList.add("class", "d-none");
    }
  }
});

userForm.addEventListener("submit", async evt => {
  evt.preventDefault()
  
  let {user_name, user_username, user_address} = evt.target.elements
  
  let Obj = {
    name: user_name.value,
    username: user_username.value,
    address: {
      city: user_address.value,
    },
  };
  
  let result = await Api.POST("users", Obj);
  console.log(result);
  if (result){
    let userData = await Api.GET("users");
    let newData = [result, ...userData];
    renderUsers(newData, users);
    
    userForm.classList.remove("class", "d-flex");
    userForm.classList.add("class", "d-none");
  };
});

async function getUsers(elem) {
  let data = await Api.GET("users");
  
  data.forEach((user) => {
    let option = document.createElement("option");
    option.textContent = user.name;
    option.value = user.id;
    select.append(option);
  });
  renderUsers(data, elem);
}
getUsers(users);

async function getPosts(elem, id, user) {
  let data = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}/posts`
    )
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.log(error));
    renderPosts(data, elem, user);
  }
  
  async function getComments(elem, id) {
    let data = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments/`
      )
      .then((response) => response.json())
      .then((json) => json)
      .catch((error) => console.log(error));
      console.log(data);
      renderComments(data, comments);
    }
    
    function renderUsers(arr, elem) {
      elem.innerHTML = null;
      if (arr) {
        arr.forEach((item) => {
          let li = document.createElement("li");
          li.dataset.id = item.id;
          li.classList.add("list-group-item", "item-users");
          let delBtn = document.createElement("button");
          delBtn.setAttribute("class", "position-absolute z-2 end-0 top-0");
          delBtn.textContent = "DEL"
          li.innerText = `${item.id}. Name: ${item.name},
          Username: ${item.username},
          Address: ${item.address.city}
          `;
          li.append(delBtn);
          
          li.addEventListener("click", (e) => {
            comments.innerHTML = null;
            const itemUsers = document.querySelectorAll(`.item-users`);
            let userFind = arr.find((user) => {
              return user.id == e.target.dataset.id;
            });
            itemUsers.forEach((e) => {
              e.classList.remove("active");
            });
            // li.classList.add("active");
            let id = e.target.dataset.id;
            getPosts(posts, id, userFind?.name);
          });
          elem.appendChild(li);
          
          delBtn.addEventListener("click", async(evt) => {
            evt.preventDefault();
            let parentLi = evt.target.parentNode;
            let parentUl = parentLi.parentNode;
            let delUserId = parentLi.dataset.id;
            
            let response = await Api.DELETE(`users/${delUserId}`);
            if (response){
              parentUl.removeChild(parentLi);
            }
          });
        });
      }
    }
    
    function renderPosts(arr, elem, user) {
      elem.innerHTML = null;
      let s = 1;
      arr.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "item-posts");
        li.innerText = `Post by ${user}
        ${s}. Title: ${item.title}
        Post: ${item.body},
        `;
        li.dataset.id = item.id;
        s++;
        li.addEventListener("click", (e) => {
          const itemUsers = document.querySelectorAll(`.item-posts`);
          itemUsers.forEach((e) => {
            e.classList.remove("active");
          });
          // li.classList.add("active");
          let id = e.target.dataset.id;
          getComments(comments, id);
        });
        elem.appendChild(li);
      });
    }
    
    function renderComments(arr, elem) {
      elem.innerHTML = null;
      let s = 1;
      arr.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerText = `${s}. Title: ${item.name}
        Comment: ${item.body},
        `;
        elem.appendChild(li);
        s++;
      });
    }
    
    form.addEventListener("submit", async(e) => {
      e.preventDefault();
      let {user_id, post_title, post_body} = e.target.elements
      let Obj = {
        title: `${post_title.value}`,
        body: `${post_body.value}`,
        userId: user_id.value,
      };
      
      let result = await Api.POST("posts", Obj);
      
      if(result){
        alert("Post created ura");  
        form.classList.remove("class", "d-flex");
        form.classList.add("class", "d-none");
      }
    });