const container = document.querySelector(".container");
const dataEntry = document.getElementById("dataEntry");
const saveButton = document.getElementById("save");

const time = () =>{
  const recodeTimer = new Date();
  return {
    date: recodeTimer.getDate(),
    month: recodeTimer.getMonth() + 1,
    year: recodeTimer.getFullYear()
  }
}


async function loadRecords() {
  try{
    const {date, month, year} = time();
    const response = await fetch("http://localhost:3000/records");
    const records = await response.json();

    container.innerHTML = "";
    records.forEach(record => {
      let recordContext = document.createElement("div");
      recordContext.className = "record";
      recordContext.innerHTML =`
      ${record.content}
      <div class="timestamps">
      ${date}/${month}/${year}
      </div>`;
      container.append(recordContext);
      
    });
  }
  catch(error){
    console.log("Error loading records:", error);
  }

}

async function saveMessage(event) {
  event.preventDefault();
  const userMessage = dataEntry.value.trim();
  if(!userMessage) return;

  await fetch("http://localhost:3000/messages",{
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({content: userMessage})
  });

  dataEntry.value = "";
  loadRecords();
  
}
loadRecords();
saveButton.addEventListener("click", saveMessage);