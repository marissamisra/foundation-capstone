const petName = document.querySelector("#pet-name");
const petImage = document.querySelector("#pet-image");
const petStatus = document.querySelector("#pet-status");

let petInfo = {};

axios
  .get("http://localhost:4000/pet")
  .then((res) => {
    console.log(res.data[0]);
    petInfo = res.data[0];
    petName.innerHTML = petInfo.name;
    petImage.src = petInfo.photo_url;
    petStatus.innerHTML = `I'm currently ${petInfo.status}`;
  })
  .catch((err) => {
    window.location.replace("./home.html");
  });