

function create_paragrah_item(title, content, time_of_post){
  let new_blog_post = document.createElement("div");
  let new_blog_title = document.createElement("h3");
  let new_blog_text = document.createElement("p");
  let new_blog_date = document.createElement("p");

  let current_html = document.getElementByID("current_html");

  new_blog_title.innerHTML = title;
  new_blog_text.innerHTML = content;
  new_blog_date.innerHTML = time_of_post;

  new_blog_post.class = "post";
  new_blog_title.class = "blog_title";
  new_blog_text.class = "blog_post_text";
  new_blog_date.class = "date";

  new_blog_post.appendChild(new_blog_title);s
  new_blog_post.appendChild(new_blog_text);
  new_blog_post.appendChild(new_blog_date);

  current_html.appendChild(new_blog_date);
}

async function send_new_blog_post_to_server(title, content, path_for_file, user_password){
    let message = convert_to_JSON(title, content, path_for_file, user_password);

    let xhr = new XMLHttpRequest();
    let url = "/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(message);
    console.log(xhr);
    return 200;
}

function convert_to_JSON(title, content, path_for_file, user_password){
  let post_file = {title: title, content: content, path_for_file: path_for_file, password: user_password};

  return JSON.stringify(post_file);
}
