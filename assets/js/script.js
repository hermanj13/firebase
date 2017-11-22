$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyAFl5mq3Cs8bjQi3iywc9_vWf8WSDP_yJk",
    authDomain: "fir-demo-4f98b.firebaseapp.com",
    databaseURL: "https://fir-demo-4f98b.firebaseio.com",
    projectId: "fir-demo-4f98b",
    storageBucket: "fir-demo-4f98b.appspot.com",
    messagingSenderId: "908050688183"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // Function to login to google
  function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      //Creates a user object to add to database
      userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      };
      // References the datebase user database
      var demoFirebase = database.ref().child('user');
      // Adds the user oject to the user database
      demoFirebase.child(user.uid).child("User Info").set(userInfo);
      // Runs the currentUser function to display info on the right panel
      currentUser(user);
      // Load messages as soon as user logs in
      messagesLoad();
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  };

  // Runs on page load to check if the user exists
  // If user exists currentUser function will run to display info on the right panel
  function loginCheck() {
    // `firebase.auth().currentUser` allows you to check the current user
    var user = firebase.auth().currentUser
    if (firebase.auth().currentUser) {
      currentUser(user);
    };
  };
  setTimeout(function(){
    loginCheck();
  },500)

  // Function to populate the right panel or if it is run from the logout function it clears the name, email, and photo
  function currentUser(user) {
    if (firebase.auth().currentUser) {
      // Hides login button and shows logout button
      $('#googleLogin').hide();
      $('#googleLogout').show();
      // Displays the messages divs
      $('.messages').show()
      // Writes a welcome message to the user
      $('#welcomeGoesHere').text('Hello ' + user.displayName);
      // Populates the right side with display name, email, and image
      $('#name').text(user.displayName);
      $('#email').text(user.email);
      $('#photo').html("<img width='50px' height='50px' src='" + user.photoURL + "'>");
    } else {
      $('#name').empty();
      $('#email').empty();
      $('#photo').empty();
    };
  };

  // Function to logout users
  function logout() {
    firebase.auth().signOut();
    setTimeout(function() {
      // Hide the messages board from logout users
      $('.messages').each(function(){
        $(this).hide()
      });
      // Welcome div gets cleared so no longer welcoming user
      $('#welcomeGoesHere').empty();
      // Login button gets shown
      $('#googleLogin').show();
      // Logout button gets hidden
      $('#googleLogout').hide();
      // CurrentUser function gets run so that the right panel is emptied
      currentUser();
    }, 100);
  };

  // OnClick function on the login button that runs the login function
  $('#googleLogin').click(function() {
    googleLogin();
  });

  // OnClick function on the logout button that runs the logout function
  $('#googleLogout').click(function() {
    logout();
  });

  // Function to load messages and populates the message board div to display them
  var messagesLoad = function() {
    var databaseReference = database.ref('messageBoard').once('value').then(function(snapshot) {
      if (snapshot.val()) {
        $(`.insertMessageHere`).empty()
        posts = snapshot.val();
        for (var i = 0 in posts) {
          create(posts[i].message, posts[i].name, posts[i].date);
        };
      };
    });
  };

  var create = function(message, name, date){
    dates = dateMaker(date);
    var newMessage = `<div class="col-2 message">${name}</div><div class="col-8 message">${message}</div><div class="col-2 message">${dates[0]}/${dates[1]}/${dates[2]} ${dates[3]}:${dates[4]} ${dates[5]}</div>`
    $('.insertMessageHere').prepend(newMessage)
  }

  var dateMaker = function(date){
    var dates = new Date(date);
    var month = dates.getMonth();
    var day = dates.getDate();
    var year = dates.getYear() - 100;
    var hours = dates.getHours();
    var minutes = dates.getMinutes();
    if(minutes<10){
      minutes = "0" + minutes;
    };
    var time = "AM";
    if(hours === 0){
      hours = 12;
    }else if(hours === 12){
      time = "PM";
    } else if(hours > 12){
      hours = hours - 12;
      time = "PM";
    } else if(hours===0){
      hours = 12;
    };
    return [month,day,year,hours,minutes,time]
  }
  // Automatically runs the messagesLoad function on page load as well as everytime an element is added
  var messagesDatabase = firebase.database().ref('messageBoard');
    messagesDatabase.on('value', function(snapshot) {
      messagesLoad();
  });

  // Function that builds objects for new posts and add's them to the proper datebase
  var newPost = function() {
    // Creates a date element to attach to the message object
    var date = new Date;
    today = date.toString();
    // console.log(new Dateprints.getDay())

    // Grabs the user that has been logged in
    var user = firebase.auth().currentUser;
    // Grabs the message from the textarea
    var message = $('#messagePost').val();

    // Creates the object that will be added to the messageboard database
    var post = {
      name: user.displayName,
      uid: user.uid,
      message: message,
      date: today
    };

    // Creates the object that will be added to the user database
    var userMessage = {
      date: today,
      message: message
    };

    // Grabs the user child of the database
    var demoFirebase = database.ref().child('user');
    // Adds the userMessage obect to the specific users messages table
    demoFirebase.child(user.uid).child('messages').push(userMessage);

    // Add message to the messageBoard database
    var demoFirebase = database.ref().child('messageBoard');
    demoFirebase.push(post);

    // Empties the textarea
    var message = $('#messagePost').val("");
    // Reruns the messagesLoad function so that the messageBoard gets repopulated
    messagesLoad();
  };

  $(document).keyup(function(event){
    if(event.which === 13){
      newPost()
    }
  })
  // OnClick function on the submit button to run the newPost function
  $('#messageSubmit').click(function() {
    newPost();
  });

});
