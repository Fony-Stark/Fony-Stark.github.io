function create_paragrah_item(title, content, time_of_post, link=""){
  console.log("This is title: ", title);
  content = content.replace(/\n/g, "<br/>");
  title = title.replace(/_/g, " ");
  console.log(content);
  let new_blog_post = document.createElement("div");
  let new_blog_title = document.createElement("h3");
  let new_blog_text = document.createElement("p");
  let new_blog_date = document.createElement("p");

  let current_html = document.getElementById("current_html");

  new_blog_title.innerHTML = title;
  new_blog_text.innerHTML = content;
  new_blog_date.innerHTML = time_of_post;

  new_blog_post.classList.add("blog");
  if(link!=""){
    new_blog_title.classList.add("blog_link");
  } else {
    new_blog_title.classList.add("blog_title");
  }
  new_blog_text.classList.add("blog_post_text");
  new_blog_date.classList.add("date");

  new_blog_post.appendChild(new_blog_title);
  new_blog_post.appendChild(new_blog_text);
  new_blog_post.appendChild(new_blog_date);

  if(link!=""){
    new_blog_post.addEventListener("click", function(){
      console.log("Someone clicked the link:", link);
    });
  }

  current_html.appendChild(new_blog_post);
}

async function give_me_content(){
  console.log("I");
  fetch("content").then(async function(response) {
    let blog_posts = await response.json();
    console.log("This:", blog_posts);

    for(let i = 0; i < blog_posts.titles.length; i++){
      let content = blog_posts.content[i];
      let last_edit = blog_posts.edit[i];
      if(content.search("!LINK") == -1){
        let [file_name, file_type] = blog_posts.titles[i].split(".");
        let title = file_name;
        create_paragrah_item(title, content, last_edit);
      } else {
        let title = blog_posts.titles[i];
        let description = blog_posts.discription[0];
        blog_posts.discription.shift();
        let link = "";
        for(let j = "!LINK\n".length; j < content.length; j++){
          link += content[j];
        }
        link += "/" + title;
        create_paragrah_item(title, description, last_edit, link);
      }
    }
  });
}

async function send_new_blog_post_to_server(title, content, path_for_file, user_password){
    let message = convert_to_JSON(title, content, path_for_file, user_password);

    let xhr = new XMLHttpRequest();
    let url = "/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(message);
    return 200;
}

function convert_to_JSON(title, content, path_for_file, user_password){
  let post_file = {title: title, content: content, path_for_file: path_for_file, password: user_password};

  return JSON.stringify(post_file);
}

give_me_content();
