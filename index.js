let user1Used = "";
let user2Used = "";
let userConnected = false;
let recMSG = "";

document.addEventListener("DOMContentLoaded", () => {
    let check = setInterval(() => {
        // Checking user 1 state
        fetch(`https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then(res => res.json())
            .then(data => {
                user1Used = data.used;
                console.log("User 1 used:", user1Used);
            })
            .catch(err => {
                console.log("Error fetching user 1:", err);
                document.getElementById("user").innerHTML = "Erreur Revoir plus tard"
            });

        // Checking user 2 state
        fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2', {
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).then(res => res.json())
            .then(data => {
                user2Used = data.used;
                console.log("User 2 used:", user2Used);
            })
            .catch(err => {
                console.log("Error fetching user 2:", err);
                document.getElementById("user").innerHTML = "Erreur Revoir Plus Tard"
            });

        // Determining current user eligibility
        if (user1Used === "false" && userConnected !== "Utilisateur 2") {
            userConnected = "Utilisateur 1";
            fetch("https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        used: "true",
                        taken: "true"
                    })
                }).then(res => res.json())
                .then(data => {
                    console.log("Utilisateur 1 now in use.");
                    document.getElementById("user").innerHTML = "Utilisateur 1";
                })
                .catch(err => { console.log("Error updating User 1:", err); });
        }

        if (user1Used === "true" && user2Used === "false" && userConnected !== "Utilisateur 1") {
            userConnected = "Utilisateur 2"
            fetch("https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        used: "true",
                        taken: "true"
                    })
                }).then(res => res.json())
                .then(data => {
                    console.log("Utilisateur 2 now in use.");
                    document.getElementById("user").innerHTML = "Utilisateur 2";
                    if (user1Used === "true" && user2Used === "true") {
                        document.getElementById("dialog").close();
                        clearInterval(check);
                    }
                })
                .catch(err => { console.log("Error updating User 2:", err); });
        }
    }, 3000);
});

// Resetting the roles
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        if (userConnected === "Utilisateur 1" && userConnected !== "Utilisateur 2") {
            fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1', {
                    method: "PUT",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({
                        used: "false",
                        taken: "false"
                    })
                }).then(res => res.json())
                .then(data => {
                    console.log(`User1Taken? = ${data.taken}`);
                })
                .catch(err => {
                    console.log("Error resetting User 1:", err);
                });
        }
        if (userConnected === "Utilisateur 2" && userConnected !== "Utilisateur 1") {
            fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2', {
                    method: "PUT",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({
                        used: "false",
                        taken: "false"
                    })
                }).then(res => res.json())
                .then(data => {
                    console.log(`User2Taken? = ${data.taken}`);
                })
                .catch(err => {
                    console.log("Error resetting User 2:", err);
                });
        }
    }
});
//recieve and siplay msgs
setInterval(() => {
    if (userConnected === "Utilisateur 1") {
        fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2', {
                method: 'GET',
                headers: { 'Content-Type': "application/json" }
            }).then(res => res.json())
            .then(data => {
                if (data.state === "send") {
                    document.getElementById("body").innerHTML += `<p style="animation:MESSAGE 300ms;border:none; background-color:blue; color:white;  padding:10px; border-radius:10px; margin-right:1400px;">${data.message}</p>`
                    setTimeout(() => {
                        fetch("https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2", {
                                method: "PUT",
                                headers: { 'Content-Type': "application/json" },
                                body: JSON.stringify({
                                    message: "",
                                    state: "none"
                                })
                            }).then(res => res.json())
                            .then(data => {
                                console.log("successfully POST the message blank", data.id)
                                const chatBox = document.getElementById("body");
                                chatBox.scrollTop = chatBox.scrollHeight;

                            })
                            .catch(err => { console.log(err) })
                    }, 100);
                } else {
                    console.log("haven't recieved anything yet")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    if (userConnected === "Utilisateur 2") {
        fetch(`https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1`, {
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).then(res => res.json())
            .then(data => {
                if (data.state === "send") {
                    document.getElementById("body").innerHTML += `<p style="animation:MESSAGE 300ms;border:none; background-color:blue; color:white; padding:10px; border-radius:10px; margin-right:1400px;">${data.message}</p>`
                    setTimeout(() => {
                        fetch("https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1", {
                                method: "PUT",
                                headers: { 'Content-Type': "application/json" },
                                body: JSON.stringify({
                                    message: "",
                                    state: "none"
                                })
                            }).then(res => res.json())
                            .then(data => {
                                console.log("successfully POST the message blank", data.id)
                                const chatBox = document.getElementById("body");
                                chatBox.scrollTop = chatBox.scrollHeight;

                            })
                            .catch(err => { console.log(err) })
                    }, 100);
                } else {
                    console.log("Havent recieved anything from U2", data.id)
                }
            })
            .catch(err => console.log(err))
    }
}, 1500);
//send messages
function send() {
    if (userConnected === "Utilisateur 1" && userConnected !== 'Utilisateur 2') {

        fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/1', {
                method: "PUT",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({
                    message: `${document.getElementById("input").value}`,
                    state: "send"
                })
            }).then(res => res.json())
            .then(data => {
                console.log('Sent message from', data.id)
                document.getElementById("body").innerHTML += `<p style="animation:MESSAGE 300ms; border:none; background-color:green; color:white;  padding:10px; border-radius:10px; margin-left:1400px;">${data.message}</p>`
                document.getElementById("input").value = ""
                const chatBox = document.getElementById("body");
                chatBox.scrollTop = chatBox.scrollHeight;

            })
            .catch(err => { console.log(err) })

    }
    if (userConnected === "Utilisateur 2" && userConnected !== 'Utilisateur 1') {

        fetch('https://68147b4b225ff1af1628f9c4.mockapi.io/Messaging/2', {

                method: "PUT",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({
                    message: `${document.getElementById("input").value}`,
                    state: 'send'
                })
            }).then(res => res.json())
            .then(data => {
                console.log('sent message from', data.id)
                document.getElementById("body").innerHTML += `<p style="animation:MESSAGE 300ms;border:none; background-color:green; color:white;  padding:10px; border-radius:10px; margin-left:1400px;">${data.message}</p>`
                document.getElementById("input").value = ""
                const chatBox = document.getElementById("body");
                chatBox.scrollTop = chatBox.scrollHeight;

            })
            .catch(err => console.log(err))
    }
}
document.addEventListener("keypress", event => {
    if (event.key === "ENTER" || event.key === "Enter") {
        send()
    }
})


//End Dude
// Copyright -Ahmed Moumin Ismail- Djibouti the 5/3/2025