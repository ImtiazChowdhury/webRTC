navigator.mediaDevices.enumerateDevices().then(device => console.log(device))

window.navigator.getUserMedia(
  { audio: true, video: true },
  (stream) => {
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = stream
    }
  },
  (err) => {
    console.error(err)
  }
)

const socket = io.connect("localhost:5000")

socket.on("connection", () => {
  console.log("Socket connected!")
})

const activeUserContainer = document.getElementById("active-user-container")
const talkingWithContainer = document.getElementById("talking-with-info")
socket.on("update-user", ({ activeUserList }) => {
  activeUserContainer.innerHTML = "";

  for (let user of activeUserList) {
    if(socket.id === user) continue;
    const userItem = document.createElement("div")
    userItem.innerHTML += `<li style="padding: 5px; border: 1px solid #3333; margin: 2px; background: #fff" id="${user}">${user}</li>`
    userItem.addEventListener("click", () => {
      talkingWithContainer.innerHTML = `Talking With ${user}`
    })
    activeUserContainer.appendChild(userItem)
  }
})