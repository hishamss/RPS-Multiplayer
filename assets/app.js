// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDDuqGDPv8cO-4S-I7YPJt07qpmCFf_cj4",
  authDomain: "rps-multiplayer-445bf.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-445bf.firebaseio.com",
  projectId: "rps-multiplayer-445bf",
  storageBucket: "rps-multiplayer-445bf.appspot.com",
  messagingSenderId: "817299326611",
  appId: "1:817299326611:web:bfc3ce96baab5deed3ef66"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var Counter = 0;
$(document).ready(function() {
  database.ref("/connections").once("value", function(data) {
    var users = data.val();
    for (key in users) {
      Counter++;
    }
    console.log(Counter);
    if (Counter < 2) {
      AddUser();
    } else {
      alert("Soory, Only 2 users allowed to play!");
    }
  });
  function AddUser() {
    var Username = prompt("Please enter your username: ");
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/connections");
    // '.info/connected' is a special location provided by Firebase that is updated
    // every time the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");
    // When the client's connection state changes...
    connectedRef.on("value", function(snap) {
      // If they are connected..
      if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(Username);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
      }
    });
  }
  // //   to check how many users are connected
  // database.ref().once("value", function(data) {
  //   Counter = data.val().counter;
  //   //   console.log(Counter);

  //   if (Counter < 3) {
  //     AddUser();
  //   } else {
  //     alert("Only 2 users can play!!");
  //   }

  //   //database.ref("/connections").on("child_added", function(childsnapshot) {
  //   // if (childsnapshot.val().username !== username) {
  //   //   console.log(childsnapshot.val().username);
  //   // }
  // });

  // //   database.ref().on("value", function(snapshot) {
  // //     counter = snapshot.val().counter;
  // //     console.log(counter);
  // //   });
  // $(window).on("unload", function() {
  //   Counter--;
  //   database.ref().set({
  //     counter: Counter
  //   });
  // });

  // function AddUser() {
  //   Counter++;
  //   database.ref("/" + Counter).set({
  //     name: Username
  //   });
  // }
});
