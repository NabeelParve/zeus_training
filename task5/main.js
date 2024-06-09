const button = document.getElementById("submit");

button.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("file", document.getElementById("csvfile").files[0]);
  console.log(...formData);
  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((data) => data.json())
    .then((response) => console.log(response));
});
