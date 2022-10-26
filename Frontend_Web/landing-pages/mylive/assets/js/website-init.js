// ************* Header fixed & humburgar init start *************
$(function(){
  var shrinkHeader = 100;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
      $('.page-header').addClass('shrink');
    }
    else {
      $('.page-header').removeClass('shrink');
    }
  });
  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
});

// ************* Header fixed & humburgar init end *************
$(document).ready(function() {
  $("#registerButton").click(function() {
    var serializedData = $("#registrationForm").serializeArray();
    var returnArray = {};
    for (var i = 0; i < serializedData.length; i++) {
      returnArray[serializedData[i]['name']] = serializedData[i]['value'];
    }
    // Variable to hold request
    var jsonData = JSON.stringify(returnArray);
    var request;
    // Fire off the request to process_registration_form.php
    request = $.ajax({
      url: "https://api.streamlife.is/api/betasignup",
      type: "POST",
      data: jsonData,
      success: function(r) {
        if (r.status) {
          swal("Success!", "Thanks for signing up. See you at Beta Launch!", "success");
          $('#registrationForm').trigger("reset");
        } else {
          swal(r.message);
        }
      }
    });
    return false;
  });

  $("#registerButton2").click(function() {
    var serializedData = $("#registrationForm2").serializeArray();
    var returnArray = {};
    for (var i = 0; i < serializedData.length; i++) {
      returnArray[serializedData[i]['name']] = serializedData[i]['value'];
    }
    // Variable to hold request
    var jsonData = JSON.stringify(returnArray);
    var request;
    // Fire off the request to process_registration_form.php
    request = $.ajax({
      url: "https://api.streamlife.is/api/betasignup",
      type: "POST",
      data: jsonData,
      success: function(r) {
        if (r.status) {
          swal("Success!", "Thanks for signing up. See you at Beta Launch!", "success");
          $('#registrationForm2').trigger("reset");
        } else {
          swal(r.message);
        }
      }
    });
    return false;
  });

  $("#loginButton").click(function() {

    if ($.trim($("#loginUsername").val()) == '' || $.trim($("#loginPassword").val()) == '') {
      swal("Username and Password must contain values");
    } else {
      // using serialize function of jQuery to get all values of form
      var serializedData = $("#mysigninForm").serializeArray();
      var returnArray = {};
      for (var i = 0; i < serializedData.length; i++) {
        returnArray[serializedData[i]['name']] = serializedData[i]['value'];
      }
      // Variable to hold request
      var jsonData = JSON.stringify(returnArray);
      var request;
      // Fire off the request to process_registration_form.php
      request = $.ajax({
        url: "https://api.streamlife.is/api/login",
        type: "POST",
        data: jsonData,
        success: function(r) {
          if (r.status) {
            setCookie('AuthCookie', r.data[0].token);
            swal("Success!", "You have successfully LoggedIN!", "success");
            window.location = 'https://localhost:3000';
          } else {
            swal("Invalid username and password");
          }
        }
      });
    }
    return false;
  });

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  setTimeout(function() {
    jQuery('#mysigninForm input').val('');
    jQuery('#registrationForm input').val('');
  }, 1000);
});
//end
