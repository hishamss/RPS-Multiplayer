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
var EnmeyUsername = "";
var EnemySelection = "";
var Username;
$(document).ready(function() {
  $(".selections").hide();
  $(".cards").hide();
  // get how many users are connected
  database.ref("/connections").once("value", function(data) {
    var users = data.val();
    for (key in users) {
      Counter++;
    }
    // only 2 users allowed to connect
    if (Counter < 2) {
      AddUser();
      $(".Me > .card-header").text(Username);

      $(".cards").show();
      WhoIsConnected();
    } else {
      alert("Sorry, Only 2 users allowed to play!");
    }
  });
  function AddUser() {
    Username = prompt("Please enter your username: ");
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
    Selection = $(this).attr("data-value");

    // this will add key without overiding the exesting keys
    database.ref("/connections/" + con.key).update({
      selection: Selection
    });
    $(".Me > .card-body").text(Selection);
    // IsMySelected = true;
    // console.log("You have selected, call the function");
  });

  function WhoIsConnected() {
    WhoIsConnectedisCalled = true;
    database.ref("/connections").once("value", function(data) {
      var users = data.val();

      for (keys in users) {
        if (keys !== con.key) {
          // display the name of the other players in case is connected
          $(".Enemy > .card-header").text(users[keys].username);
          $(".selections").show();
        }
        // else {
        //   $(".message").text("You the first one!");

        //   break;
        // }
      }
    });
  }
  // this will detect if user joins the game while u r connected
  database.ref("/connections").on("value", function(snapshot) {
    if (WhoIsConnectedisCalled) {
      var users = snapshot.val();
      // console.log(users);
      for (keys in users) {
        if (keys !== con.key) {
          EnmeyUsername = users[keys].username;
          // check if the enemy made the selection
          if (
            snapshot
              .child(keys)
              .child("selection")
              .exists()
          ) {
            EnemySelection = users[keys].selection;
            $(".Enemy > .card-body").text(EnemySelection);
            if (
              snapshot
                .child(con.key)
                .child("selection")
                .exists()
            ) {
              ShowResult();
            }
          }

          $(".Enemy > .card-header").text(EnmeyUsername);
          $(".selections").show();
          // IsMySelected = true;
          // ShowResult();
          break;
        }
      }
      // once the enemy close his borwser, it will clear his card
      if (Object.keys(users).length == 1) {
        $(".Enemy > .card-header").text("");
        $(".selections").hide();
        $(".Enemy > .card-body").text("");
        $(".result").text("");
        $(".Me > .card-body").text("");
        database
          .ref("/connections/" + con.key)
          .child("selection")
          .remove();
      }
    }
  });
  // database.ref("/selections").on("value", function(snapshot) {
  //   console.log("check selection?");
  // Select = snapshot.val();
  // // for (keys in Select) {
  // // if (keys == EnmeyUsername) {
  // if (EnmeyUsername in Select) {
  //   EnemySelection = Select[EnmeyUsername];
  //   console.log("display Enemy Card Body " + EnemySelection);
  //   $(".Enemy > .card-body").text(EnemySelection);
  //   // IsEnemySelected = true;
  //   // ShowResult();
  //   // break;
  //   // }
  // }
  // });

  function ShowResult() {
    // console.log("IsEnemySelected: " + IsEnemySelected);
    // if (IsMySelected) {
    console.log("showresult");
    if (Selection == "scissors") {
      if (EnemySelection == "paper") {
        $(".result").text("You Win");
      } else if (EnemySelection == "rock") {
        $(".result").text("You lose");
      } else {
        $(".result").text("Tie");
      }
    } else if (Selection == "rock") {
      if (EnemySelection == "paper") {
        $(".result").text("You lose");
      } else if (EnemySelection == "rock") {
        $(".result").text("Tie");
      } else {
        $(".result").text("You Win");
      }
    } else if (Selection == "paper") {
      if (EnemySelection == "paper") {
        $(".result").text("Tie");
      } else if (EnemySelection == "rock") {
        $(".result").text("You Win");
      } else {
        $(".result").text("You lose");
      }
    }
    //   IsMySelected = false;
    // }
  }

  // $(window).on("unload", function() {
  //   database
  //     .ref("/selections")
  //     .child(Username)
  //     .remove();
  // });
});
