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

  function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      $('#googleLogin').hide();
      $('#googleLogout').show();
      $('#welcomeGoesHere').text('Hello ' + user.displayName);
      currentUser();
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

  function currentUser() {
    var user = firebase.auth().currentUser;
    if(user){
      $('#googleLogin').hide();
      $('#googleLogout').show();
      $('#name').text(user.displayName);
      $('#email').text(user.email);
      $('#photo').html("<img width='50px' height='50px' src='"+user.photoURL+"'>");
    }else{
      $('#name').empty();
      $('#email').empty();
      $('#photo').empty();
    };
  };

  function logout() {
    firebase.auth().signOut();
    setTimeout(function(){
      $('#welcomeGoesHere').empty();
      $('#googleLogin').show();
      $('#googleLogout').hide();
      currentUser();
    },100)
  };

  $('#googleLogin').click(function() {
    googleLogin();
  });

  $('#googleLogout').click(function() {
    logout();
  });

});
