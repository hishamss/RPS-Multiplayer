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
var con;
var Counter = 0;
var WhoIsConnectedisCalled = false;
$(document).ready(function() {
  $(".selections").hide();
  // get how many users are connected
  database.ref("/connections").once("value", function(data) {
    var users = data.val();
    for (key in users) {
      Counter++;
    }
    // only 2 users allowed to connect
    if (Counter < 2) {
      AddUser();
      $(".selections").show();
      WhoIsConnected();
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
        con = connectionsRef.push({
          username: Username
        });
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
      }
    });
  }

  $(".selection").on("click", function() {
    var Selection = $(this).attr("data-value");
    // this will add key without overiding the exesting keys
    database.ref("/connections/" + con.key).update({
      selection: Selection
    });
  });

  function WhoIsConnected() {
    WhoIsConnectedisCalled = true;
    database.ref("/connections").once("value", function(data) {
      var users = data.val();

      for (keys in users) {
        if (keys !== con.key) {
          // display the name of the other players in case is connected
          $(".message").text(users[keys].username + " is connected");
          break;
        } else {
          $(".message").text("You the first one!");

          break;
        }
      }
    });
  }
  // this will detect if user joins the game while u r connected
  database.ref("/connections").on("value", function(snapshot) {
    if (WhoIsConnectedisCalled) {
      var users = snapshot.val();
      console.log(users);
      for (keys in users) {
        if (keys !== con.key) {
          $(".message").text(users[keys].username + " just joined");
        }
      }
    }
  });
});
