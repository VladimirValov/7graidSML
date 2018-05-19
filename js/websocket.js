window.onload = () => {
  if (!window.WebSocket) {
    document.body.innerHTML = "WebSocket в этом браузере не поддерживается.";
    return;
  }

  const socket = connectionWebsocket("ws://localhost:8081");    

  document.forms.myform.onsubmit = (event) => {
      event.preventDefault();
      const form = event.target;
      const name = form.name.value;
      const text = form.mess.value;
      // console.log("onsubmit", name, message );
      socket.send(JSON.stringify({name, text}));
  }  
}


// Web Socket
const connectionWebsocket = (wsUrl) => {
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
      setStatus("Connection open");
  }
  socket.onclose = (event) => {
      const status = event.wasClean
          ? "Connection close"
          : "Connection lost"
      setStatus(status);
  }
  socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      showMessage(message);
  }
  socket.onerror = (err) => {
      console.log("Connection error");
      setStatus(JSON.stringify(err));
  }

  return socket;
}


const setStatus = (status) => {
  const statusBar = document.querySelector("#status");
  statusBar.innerHTML = status;
}

const showMessage = (message) => {
  const time = new Date();
  const messageListElem = document.querySelector("#messageList");

  const messageElem = document.createElement("p");
  messageElem.appendChild(document.createTextNode(`
    ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}
    ${message.name} : ${message.text}  
  `));
  messageListElem.appendChild(messageElem);

  showNotification(`New message from ${message.name}`, {
      body: message.text,
      icon: "img/40.png",      
      dir: "auto"
  });
}

const showNotification = (title, options) => {
  if (!("Notification" in window)) {
      alert("Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.");
  }
  else if (Notification.permission === "granted") {
      var notification = new Notification(title, options);
     
      notification.onerror = (err) => {
          console.error(err);
      }
      notification.onshow = () => {
          setTimeout(() => {
            notification.close();
          }, 2000)
      }
      notification.onclick = () => {
        console.log("Пользователь кликнул на уведомление");
      }
  }
  else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
          if (permission === "granted") {
              var notification = new Notification(title, options);
          } else {
              console.log("Вы запретили показывать уведомления");
          }
      });
  } else {
      console.log("Denied")
  }
}
