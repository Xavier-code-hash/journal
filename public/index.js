const container = document.querySelector(".container");
const form = document.getElementById("recordForm");
const dataEntry = document.getElementById("dataEntry");
const imageInput = document.getElementById("imageInput");
const saveButton = document.getElementById("save");

async function loadRecords() {
  try {
    const response = await fetch("http://localhost:3000/records");
    const records = await response.json();
    container.innerHTML = "";
    records.forEach(record => {
      const recordDiv = document.createElement("div");
      recordDiv.className = "record";
      if (record.image_path){
        recordDiv.classList.add("has-image");
      } 

      const content = document.createElement("p");
      content.textContent = record.content;
      recordDiv.append(content);

      if (record.image_path) {
        const img = document.createElement("img");
        img.src = `http://localhost:3000${record.image_path}`;
        recordDiv.appendChild(img);
      }

      const dateDiv = document.createElement("div");
      dateDiv.className = "timestamps";
      dateDiv.textContent = new Date(record.created_at).toLocaleDateString();
      recordDiv.append(dateDiv);
      container.append(recordDiv);
    });
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("content", dataEntry.value);
  if (imageInput.files[0]){
    formData.append("image", imageInput.files[0]);
  } 

  saveButton.disabled = true;
  await fetch("http://localhost:3000/messages", { method: "POST", body: formData });
  dataEntry.value = "";
  imageInput.value = "";
  saveButton.disabled = false;
  loadRecords();
});

loadRecords();