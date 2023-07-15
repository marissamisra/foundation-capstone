const header = document.querySelector("#welcome");
const petList = document.querySelector("#my-pets");
const createPetForm = document.querySelector("#create-pet");
const logoutBtn = document.querySelector("#logout");

let pets = [];
let user;

axios.get("http://localhost:4000/user").then((res) => {
  user = res.data;
  if (res.data) {
    header.innerHTML = `Welcome to &nbsp<p id='logo'>Barkwoof!</p> &nbsp ${user.username}`;
    getPets(user.id);
  } else {
    window.location.replace("./login.html");
  }
});

function getPets(id) {
  axios.get(`http://localhost:4000/pets?id=${id}`).then((res) => {
    pets = res.data;
    const petsArray = pets.map((pet) => {
      return `
              <li class='pet'>
                  <img class='pet-list-item' src='${pet.photo_url}' onClick=goToPetPage(${pet.id}) />
                  <p id='pet-name'>${pet.name}</p>
                  <div>
                    <select onchange=updateStatus(${pet.id}) name="pets" id="pet-select-${pet.id}">
                        <option value="">--Please choose a status--</option>
                        <option value="eating">Eating</option>
                        <option value="sleeping">Sleeping</option>
                        <option value="playing">Playing</option>
                    </select>
                  </div>
              </li>
            `;
    });
    displayPets(petsArray);
  });
}

function displayPets(petsArray) {
  petList.innerHTML = petsArray.join("");
}

function createPet(e) {
  e.preventDefault();
  const petName = document.querySelector("#pet-name");
  const photoURL = document.querySelector("#photo-url");

  const newPet = {
    name: petName.value,
    photoURL: photoURL.value,
    ownerID: user.id,
  };

  axios.post("http://localhost:4000/pet/create", newPet).then((res) => {
    getPets(user.id);
    petName.value = "";
    photoURL.value = "";
  });
}

function goToPetPage(petID) {
  axios.post(`http://localhost:4000/pet/${petID}`).then((res) => {
    window.location.assign(`./pet-info.html`);
  });
}

function updateStatus(petID) {
  const select = document.querySelector(`#pet-select-${petID}`);
  const body = {
    newStatus: select.value,
    petID: petID,
  };
  axios.put("http://localhost:4000/status/update", body);
  console.log(select.value, petID);
}

createPetForm.addEventListener("submit", createPet);
logoutBtn.addEventListener("click", () => {
  axios.delete("http://localhost:4000/user/logout").then((res) => {
    if (res.status === 200) {
      window.location.replace("./login.html");
    }
  });
});