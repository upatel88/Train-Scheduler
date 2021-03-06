  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWsBihu1tT3RO45MbxgmdKq03IOhFD1W8",
    authDomain: "trainass-8031d.firebaseapp.com",
    databaseURL: "https://trainass-8031d.firebaseio.com",
    projectId: "trainass-8031d",
    storageBucket: "trainass-8031d.appspot.com",
    messagingSenderId: "191034892968"
  };
  firebase.initializeApp(config);


// Create a variable to reference the database
var dataRef = firebase.database();

// variables
var name = "";
var destination = "";
var firstTrain = 0;
var frequency = 0;
var minAway;
var arrival;

// on click event 
$("#submit").on("click", function(event) {
  event.preventDefault();

  // grabs user input and stores into variables
  name = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrain").val().trim();
  frequency = $("#frequency").val().trim();

  // push info to firebase
  dataRef.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  });

  // Clear all input fields 
  $(this).closest('form').find("input[type=text], textarea").val('');

});

// child added function
// passes callback function
// snapshot becomes event object
// "grab everything on the root level when a child is added. Then, pass that in to snapshot. Then, once it is added, it will grab values for each child"
dataRef.ref().on("child_added", function(snapshot) {

  // console.log(snapshot.val());
  // console.log(snapshot.val().name);
  // console.log(snapshot.val().destination);
  // console.log(snapshot.val().firstTrain);
  // console.log(snapshot.val().frequency);

    // Print the initial data to the console.
    console.log(snapshot.val());

    // First Time (pushed back 1 year to make sure it comes before current time)
    var initialTimeConverted = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    console.log(initialTimeConverted);


    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Calculate time difference
    var diffTime = moment().diff(moment(initialTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time remaining
    var timeRemainder = diffTime % snapshot.val().frequency;
    console.log("TIME REMAINDER = " + timeRemainder);

    // Next Train
    arrival = moment().add(minAway, "minutes");
    // arrival = moment(arrival).format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(arrival).format("hh:mm"));

    // Minutes Until Train
    minAway = snapshot.val().frequency - timeRemainder;
    console.log("MINUTES UNTIL NEXT TRAIN: " + minAway);



  // Add train to list
  let trainInfo = $('<tr>');
  // Append train info to new <tr>. (Using template strings from ES6)
  trainInfo.append(`<td>${snapshot.val().name}</td>`);
  trainInfo.append(`<td>${snapshot.val().destination}</td>`);
  trainInfo.append(`<td>${snapshot.val().frequency}</td>`);
  trainInfo.append(`<td>${arrival}</td>`);
  trainInfo.append(`<td>${minAway}</td>`);


  // Append the new train info to table 
  $('#train-table').append(trainInfo);


// handle errors
}, function(errorObject) {

  console.log("ERRORS: " + errorObject.code);

});
