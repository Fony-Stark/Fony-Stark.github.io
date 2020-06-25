function create_paragrah_item(title, content, time_of_post, link=""){
  //console.log("This is title: ", title);
  content = content.replace(/\n/g, "<br/>");
  title = title.replace(/_/g, " ");
  //console.log(content);
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
      console.log("Full linked:", link+"/")
      clicked_link(title, link+"/");
    });
  }

  current_html.appendChild(new_blog_post);
}

function month_to_number(month){
  let months = {"Jan" : 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
  return months[month];
}

function compare_time(time1, time2){
  let list_for_time1 = time1.split(" ");
  let list_for_time2 = time2.split(" ");
  //console.log("This is time1", list_for_time1, "this is time2", list_for_time2);
  if(Number(list_for_time1[3]) > Number(list_for_time2[3])){
    return 0;
  } else if(month_to_number(list_for_time1[1]) > month_to_number(list_for_time1[1])){
    return 0;
  } else if(Number(list_for_time1[2]) > Number(list_for_time2[2])){
    return 0;
  } 
  
  let new_time1 = list_for_time1[1].split(":");
  let new_time2 = list_for_time2[1].split(":");
  if(Number(new_time1[0]) > Number(new_time2[0])){
    return 0;
  } else if(Number(new_time1[1]) > Number(new_time2[1])){
    return 0;
  } else if(Number(new_time1[2]) > Number(new_time2[2])){
    return 0;
  }

  return 1;
}

function sort_posts(array, newest_or_oldest=true){
  //console.log("This is what I was given:", array);

  let link_boolean, optimist_link;
  let index = 0;

  let title_swap = "";
  let content_swap = "";
  let edit_swap = "";

  for(let i = 0; i < array.content.length; i++){
    link_boolean = (array.content[i].search("!LINK") != -1) ? 1 : 0;

    title_swap = array.titles[i];
    content_swap = array.content[i];
    edit_swap = array.edit[i];

    index = i;
    for(let j = i + 1; j < array.content.length; j++){
      optimist_link = (array.content[j].search("!LINK") != -1) ? 1 : 0;

      if(optimist_link == 1 && link_boolean != 1){
        link_boolean = optimist_link;
        title_swap = array.titles[j];
        edit_swap = array.edit[j];
        content_swap = array.content[j];

        index = j;
      } else if(optimist_link == link_boolean){
        let diff_time = compare_time(edit_swap, array.edit[j]);
        if((diff_time == 1 && newest_or_oldest == true) || (diff_time == 0 && newest_or_oldest == false)){
          link_boolean = optimist_link;
          title_swap = array.titles[j];
          edit_swap = array.edit[j];
          content_swap = array.content[j];

          if(optimist_link == 1){
            
          }

          index = j;
        }
      } 
    }
    if(index != i){
      //console.log("I swapped ", i, "with", index);
    }

    let temp = array.content[i];
    array.content[i] = array.content[index];
    array.content[index] = temp;

    temp = array.titles[i];
    array.titles[i]= array.titles[index];
    array.titles[index] = temp;

    temp = array.edit[i];
    array.edit[i] = array.edit[index];
    array.edit[index] = temp;
  }
}

async function give_me_content(link=""){
  last_path = (link == "") ? "./blogs/posts/" : "./blogs/" + link;
  console.log("This is last_path:", last_path);
  //onsole.log("I");
  fetch(link + "content").then(async function(response) {
    let blog_posts = await response.json();
    //console.log("This:", blog_posts);

    let link_to_description = {};
    let description_n = 0;
    for(let i = 0; i < blog_posts.content.length; i++){
      if(blog_posts.content[i].search("!LINK") != -1){
        link_to_description[blog_posts.titles[i]] = blog_posts.discription[description_n];
        description_n++;
      }
    }


    //console.log("This is unsorted:", blog_posts);
    sort_posts(blog_posts);
    //console.log("This is sorted:", blog_posts);

    for(let i = 0; i < blog_posts.titles.length; i++){
      let content = blog_posts.content[i];
      let last_edit = blog_posts.edit[i];
      if(content.search("!LINK") == -1){
        let [file_name, file_type] = blog_posts.titles[i].split(".");
        let title = file_name;
        create_paragrah_item(title, content, last_edit);
      } else {
        let title = blog_posts.titles[i];
        let link = "";
        for(let j = "!LINK\n".length; j < content.length; j++){
          link += content[j];
        }
        link += "/" + title;
        create_paragrah_item(title, link_to_description[title], last_edit, link);
      }
    }
  });
}

async function clicked_link(title, link){
  document.getElementById("webpage_title").innerHTML = title;
  document.getElementById("current_html").innerHTML = "";
  await give_me_content(link);
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
let last_path = "./blogs/";
function convert_blog_post(event){
  event.preventDefault();

  let content = document.getElementById("content").value;
  let password = document.getElementById("password").value;
  let new_title = document.getElementById("new_title").value;
  let post = document.getElementById("pick_blog").checked == 0;

  console.log(new_title, content, password, post);

  if(content == "" || password == "" ||new_title == ""){
    return ;
  }
  let title = new_title.replaceAll(" ", "_");
  title += (post == false) ? "" : ".txt";
  let path = last_path;



  console.log("This is what I'll send:")
  console.log("title:    ", title);
  console.log("content:  ", content);
  console.log("path:     ", path);
  console.log("password: ", password);

  send_new_blog_post_to_server(title, content, path, password)
}

function convert_to_JSON(title, content, path_for_file, user_password){
  let post_file = {title: title, content: content, path_for_file: path_for_file, password: user_password};

  return JSON.stringify(post_file);
}

let toggle_post = 0;
function post(){
  let toggle = "", post_stuff = "", event_var = "";
  if(toggle_post == 0){
    toggle = "hidden";
    post_stuff = "visible";
    event_var = "close";
  }
  else {
    toggle = "visible";
    post_stuff = "hidden";
    event_var = "toggle_post";
  }

  document.getElementById(event_var).addEventListener("click", post);

  document.getElementById("toggle_post").style.visibility = toggle;
  document.getElementById("create_new_post").style.visibility = post_stuff;

  toggle_post = (toggle_post == 0) ? 1 : 0;
}

document.getElementById("toggle_post").addEventListener("click", post)
document.getElementById("submit_post").addEventListener("click", (event) => convert_blog_post(event));

give_me_content();