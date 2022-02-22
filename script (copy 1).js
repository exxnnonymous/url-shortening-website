const buttons = document.querySelectorAll(".choose-btn");
const cardContainer = document.querySelector(".cards-wrapper");


async function fetchTheData(dataTopic) {
const smallCards = cardContainer.querySelectorAll('.sm-card')
if(smallCards.length!==0){
  smallCards.forEach(cards=>{
    cards.parentNode.removeChild(cards)
  })
}
    let contentDiv = ``;

  async function fetchData() {
    const response = await fetch("./data.json");
    return await response.json();
  }

  const data = await fetchData();
  data.forEach((data) => {
    const timeframes = data.timeframes[dataTopic];

    contentDiv += `<div class="sm-card">
                        <div class="icon-box ${data.classname}">
                            <img src="./images/${data.imgUrl}" alt="work-icon" />
                        </div>
                        <div class="content-box">
                            <div class="topic">
                            <h2 class="topic-name">${data.title}</h2>
                            <img src="./images/icon-ellipsis.svg" alt="menu-icon" />
                            </div>
                            <div class="data-container">
                            <div class="current-data">${timeframes.current}hrs</div>
                            <div class="previous-data">Last Week - ${timeframes.previous}hrs</div>
                            </div>
                        </div>
                        </div>`;
  });

  cardContainer.insertAdjacentHTML('beforeend', contentDiv);
  contentDiv = ``
}

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    buttons.forEach((button)=>{
      button.classList.remove('active')
    })
    const dataTopic = e.target.value;
    e.target.classList.add('active')
    fetchTheData(dataTopic)
  });
});



fetchTheData("weekly");
