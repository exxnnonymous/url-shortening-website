const mobile_nav_btn = document.querySelector(".mobile_toggle_nav_icon");
const nav_container = document.querySelector(".nav_with_sign_btns");

window.onload = () => {
  mobile_nav_btn.addEventListener("click", () => {
    nav_container.classList.toggle("active");
  });
};

const url_input = document.querySelector(".url_short_input");
const url_input_container = document.querySelector(".input_field");
const form = document.querySelector("#url_form");
const list_container = document.querySelector(".list_of_urls");

form.onsubmit = handle_url_submit;

function handle_invalid_url(e) {
  url_input_container.classList.add("warning_input");
  url_input.addEventListener("keydown", () => {
    url_input_container.classList.remove("warning_input");
  });
}

function show_link_to_website() {
  const link_data = JSON.parse(getFromLocalStorage());

  if (link_data && link_data.length > 0) {
    let content="";
    link_data.reverse().forEach((link, index) => {
      const short_url = link.short_link;
      const original_url = link.original_link;
      content += `<li class="short_url_item" id="short_url_${index}">
            <p class="long_url">
              <span>
                ${original_url}
              </span>
              
            </p>
            <p class="shorten_url">${short_url}</p>
            <button type="button" class="btn round-btn btn-bg-cyan url_copy_btn" onclick="copy_to_clipboard('short_url_${index}')">Copy</button>
          </li>`;
    });
    list_container.innerHTML =  content;
    content = "";
  }
}

function handle_url_submit(e) {
  e.preventDefault();
  if (url_input.value.length === 0) {
    handle_invalid_url();
  }
  const url_input_value = url_input.value;

  url_input.value = "";
  url_input.placeholder = "Loading...";
  fetch(`https://api.shrtco.de/v2/shorten?url=${url_input_value}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (!data.ok) {
        url_input.value = "";
        url_input.placeholder = "Please enter a valid link...";
        handle_invalid_url();

        return;
      }
      url_input.placeholder = "Shorten a link here...";
      saveToLocalStorage(data.result);
      show_link_to_website();
      form.reset();
    });
}

function copy_to_clipboard(e) {
  const short_url_parent = document.getElementById(e)
  const short_url = short_url_parent.querySelector(".shorten_url").innerText
  const short_utl_btn = short_url_parent.querySelector(".url_copy_btn")
  
  navigator.clipboard.writeText(short_url).then(function() {
    short_utl_btn.innerText = "Copied!"
    short_utl_btn.classList.add("copied")
    setTimeout(() => {
        short_utl_btn.innerText = "Copy"
    short_utl_btn.classList.remove("copied")
    }, 2000);    
});
}

function saveToLocalStorage(linkdata) {
  let savedLinkData = getFromLocalStorage();
  console.log("saved", savedLinkData);
  let linkArray;
  if (!savedLinkData || savedLinkData.length === 0) {
    linkArray = [];
  } else {
    linkArray = JSON.parse(savedLinkData);
  }
  console.log("link", linkArray);
  linkArray.push(linkdata);
  localStorage.setItem("shorten_url_data", JSON.stringify(linkArray));
}

function getFromLocalStorage() {
  return localStorage.getItem("shorten_url_data");
}

show_link_to_website();
