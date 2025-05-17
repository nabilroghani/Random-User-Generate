const form = document.querySelector("form");
const card = document.querySelector(".card");

async function fetchApi() {
  try {
    const input = document.querySelector("input").value;
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");

    // Validate the input
    if (!input.trim()) {
      username.textContent = "Please enter a valid user ID.";
      email.textContent = "";
      return;
    }

    const api = await fetch(
      `https://jsonplaceholder.typicode.com/users/${input}`
    );

    if (!api.ok) {
      throw new Error("User not found");
    }

    const result = await api.json();
    console.log(result);
    username.textContent = `Username: ${result.username}`;
    email.textContent = `Email: ${result.email}`;

    //--------create button only if it doesn't exist--------
    if (!document.querySelector(".get-post-btn")) {
      const btn = document.createElement("button");
      btn.innerText = "Get Post";
      btn.classList.add("get-post-btn");
      card.append(btn);

      btn.addEventListener("click", function () {
        fetchPost(result.id);
      });
    }
  } catch (err) {
    console.error(err);
    document.querySelector("#username").textContent = "User not found.";
    document.querySelector("#email").textContent = "";
  }
}

async function fetchPost(userId) {
  try {
    const postApi = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const posts = await postApi.json();

    console.log(posts);

    // Clear old posts before adding new ones
    const existingPosts = document.querySelector(".post-container");
    if (existingPosts) existingPosts.remove();

    // Create a post container
    const body = document.querySelector("body");
    const div = document.createElement("div");
    div.classList.add("post-container");
    body.append(div);

    // Add all posts for the user
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
          <h3>Post ID: ${post.id}</h3>
          <h4>${post.title}</h4>
          <p>${post.body}</p>
        `;
      div.append(postElement);
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchApi();
  e.target.reset(); // Reset form AFTER the API call
});
