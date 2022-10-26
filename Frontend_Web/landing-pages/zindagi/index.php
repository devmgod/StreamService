<<<<<<< HEAD
<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Zindagi</title>
  <link href="assets/images/favicon.svg" rel=icon sizes=32x32>
  <!-- font family CSS -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700;1,900&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300&display=swap" rel="stylesheet">
  <!-- bootstrap CSS -->
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/responsive.css">
  <script data-ad-client="ca-pub-2161181046732399" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

  <!-- all js  -->
  <script src="assets/js/jquery-3.5.1.min.js"></script>
  <script src="assets/js/zindagi.min.js"></script>
  <script src="assets/js/website-init.js"></script>
  <script src="//geodata.solutions/includes/countrystatecity.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

  <script>
    $(document).ready(function() {

      $("#registerButton").click(function() {
        var serializedData = $("#registrationForm").serializeArray();
        var returnArray = {};
        for (var i = 0; i < serializedData.length; i++) {
          returnArray[serializedData[i]['name']] = serializedData[i]['value'];
        }
        returnArray['birthdate'] = jQuery("select[name='year']").val() + '-' + jQuery("select[name='month']").val() + '-' + jQuery("select[name='day']").val();
        returnArray['latitude']  = jQuery("#lat").val();
        returnArray['longitude'] = jQuery("#long").val();
        delete returnArray["month"];
        delete returnArray["day"];
        delete returnArray["year"];

        // Variable to hold request
        var jsonData = JSON.stringify(returnArray);
        var request;
        // Fire off the request to process_registration_form.php
        request = $.ajax({
          url: "http://localhost:9090/api/register",
          type: "POST",
          data: jsonData,
          success: function(r) {
            if (r.status) {
              swal("Success!", "You have successfully registered here!", "success");
              $('#registrationForm').trigger("reset");
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
            // url: "http://api.zindagi.io/api/login",
            url: "http://0.0.0.0:9090/api/login",
            type: "POST",
            data: jsonData,
            success: function(r) {
              if (r.status) {
                setCookie('AuthCookie', r.data[0].token);
                swal("Success!", "You have successfully LoggedIN!", "success");
                // window.location = 'http://beta.zindagi.io';
                window.location = 'http://localhost:3000';
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
        //document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=zindagi.io";
        if(document.domain === 'localhost') {
          document.cookie = name + "=" + (value || "") + expires + "; path=/;";
        } else {
          document.cookie = name + '=' + value + ';domain=.' + document.domain + ';path=/;';
        }
      }

      setTimeout(function() {
        jQuery('#mysigninForm input').val('');
        jQuery('#registrationForm input').val('');
      }, 1000);


      if (window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getMap);
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      function getMap(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        jQuery('body').append('<input type="hidden" id="lat" value="'+lat+'"/> <input type="hidden" id="long" value="'+long+'"/>');
      }

    });
  </script>
</head>

<body>
  <header class="page-header">
    <nav class="navbar isnav container">
      <a class="navbar-brand" href="index.html">
        <img src="assets/images/logo.svg" alt="logo">
      </a>
      <div class="collapse show">
        <ul class="navbar-nav ml-auto">
          <li class="header-text">
            <p>Stream, connect, and chat with new people - Worldwide!</p>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <main class="page-main">
    <section class="main-banner">
      <div class="hero-image">
        <div class="container pt-5">
          <div class="row">
            <div class="col-md-12">
              <div class="login-box-bg">
                <div class="login-row">
                  <div class="signin-col">
                    <div class="login-from">
                      <h3 class="login-heading">Login</h3>
                      <form id="mysigninForm" autocomplete="off" action="" method="post">
                        <div class="form-row">
                          <div class="form-group col-md-12 mb-4">
                            <span class="login-input">
                              <input id="loginUsername" type="email" name="email" class="form-control" placeholder="Email" autocomplete="off" />
                            </span>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-12">
                            <span class="login-input">
                              <input id="loginPassword" type="password" name="password" class="form-control" placeholder="Password" autocomplete="off" />
                            </span>
                          </div>
                        </div>
                        <div class="form-row social-login">
                          <div class="form-group col-md-12 col-lg-6">
                            <a class="log-fb" href="#">
                              <svg width="147" height="50" viewBox="0 0 147 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="123.112" height="40" rx="20" fill="#1976D2" />
                                <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white" />
                                <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white" />
                                <path d="M106.403 16.5938V13.4688C106.403 12.6063 107.046 11.9062 107.838 11.9062H109.274V8H106.403C104.024 8 102.096 10.0984 102.096 12.6875V16.5938H99.2251V20.5H102.096V33H106.403V20.5H109.274L110.709 16.5938H106.403Z" fill="#1976D2" />
                              </svg>
                            </a>
                            <a href="#">
                              <svg width="134" height="40" viewBox="0 0 134 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="134" height="40" rx="20" fill="#F14336" />
                                <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white" />
                                <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white" />
                                <g clip-path="url(#clip0)">
                                  <path d="M106.097 21.8991L105.297 24.8879L102.371 24.9498C101.496 23.3278 101 21.472 101 19.4999C101 17.5929 101.464 15.7946 102.286 14.2112H102.286L104.892 14.6888L106.033 17.2783C105.794 17.9746 105.664 18.7221 105.664 19.4999C105.664 20.3441 105.817 21.1529 106.097 21.8991Z" fill="#FBBB00" />
                                  <path d="M123.799 17.3516C123.931 18.0473 124 18.7657 124 19.4999C124 20.3233 123.914 21.1264 123.749 21.9011C123.189 24.5372 121.726 26.8391 119.7 28.468L119.699 28.4674L116.418 28.3L115.953 25.401C117.298 24.6124 118.349 23.3784 118.902 21.9011H112.753V17.3516H118.992H123.799Z" fill="#518EF8" />
                                  <path d="M119.699 28.4675L119.699 28.4681C117.729 30.0522 115.225 31 112.5 31C108.12 31 104.313 28.5522 102.37 24.9499L106.097 21.8992C107.068 24.4912 109.569 26.3362 112.5 26.3362C113.76 26.3362 114.94 25.9956 115.953 25.401L119.699 28.4675Z" fill="#28B446" />
                                  <path d="M119.84 10.6475L116.115 13.6975C115.067 13.0423 113.828 12.6638 112.5 12.6638C109.502 12.6638 106.955 14.5935 106.033 17.2783L102.287 14.2113H102.286C104.2 10.5212 108.055 8 112.5 8C115.29 8 117.849 8.99394 119.84 10.6475Z" fill="#F14336" />
                                </g>
                                <defs>
                                  <clipPath id="clip0">
                                    <rect width="23" height="23" fill="white" transform="translate(101 8)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </div>
                          <div class="form-group col-md-6 text-right">
                            <a class="forget-text" href="#">Forget password?</a>
                          </div>
                        </div>
                        <div class="form-row mt-2">
                          <div class="form-group col-md-12 text-center">
                            <button class="btn-submit effect-1" id="loginButton">Log In</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="signup-col">
                    <div class="signin-from">
                      <h3 class="signup-heading">New to Zindagi?</h3>
                      <form id="registrationForm" autocomplete="off" action="" method="post">
                        <div class="form-row">
                          <div class="form-group col-md-3 mb-4">
                            <span class="signup-input">
                              <input type="text" name="name" class="form-control" placeholder="Name" required />
                            </span>
                          </div>
                          <div class="form-group col-md-6 mb-4">
                            <span class="signup-input">
                              <input name="email" type="email" class="form-control" placeholder="Email" required>
                            </span>
                          </div>
                          <div class="form-group col-md-3 mb-4">
                            <span class="signup-input">
                              <input type="password" class="form-control" name="password_token" placeholder="Password" required />
                            </span>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-3 mb-4">
                            <div class="signup-input">
                              <select id="gender" name="gender" class="custom-select form-control">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group birthdate col-md-9 mb-4">
                            <span class="signup-input">
                              <input type="text" class="form-control" placeholder="Birthdate" required>
                            </span>
                          </div>
                          <div class="m-d-y-wrap">
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="month" class="custom-select form-control" required>
                                  <option value="">Month</option>
                                  <?php for ($m = 1; $m <= 12; $m++) { ?>
                                    <option value="<?php echo $m; ?>"><?php echo $m; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="day" class="custom-select form-control" required>
                                  <option value="">Day</option>
                                  <?php for ($d = 1; $d <= 31; $d++) { ?>
                                    <option value="<?php echo $d; ?>"><?php echo $d; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="year" class="custom-select form-control" required>
                                  <option value="">Year</option>
                                  <?php for ($y = 1950; $y <= date('Y'); $y++) { ?>
                                    <option value="<?php echo $y; ?>"><?php echo $y; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="country" class="countries custom-select form-control" id="countryId" required>
                                <option value="">Select Country</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="region" class="states custom-select form-control" id="stateId" required>
                                <option value="">Select Region</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="city" class="cities custom-select form-control" id="cityId" required>
                                <option value="">Select City</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div class="form-row mt-2">
                          <div class="form-group col-md-12 text-center">
                            <button type="submit" id="registerButton" class="btn-signup effect-2">Sign Up</button>
                          </div>
                        </div>

                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="play-store-sec">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="max-w-store">
              <div class="d-flex justify-content-center">
                <a download="" href="#" class="store-box">
                  <div class="media">
                    <div class="d-flex align-self-center mr-2 mr-lg-4">
                      <img src="assets//images/android.svg" alt="" />
                    </div>
                    <div class="media-body">
                      <p>Get in for</p>
                      <h4>ANDROID</h4>
                    </div>
                  </div>
                </a>
                <a download="" href="#" class="store-box">
                  <div class="media">
                    <div class="d-flex align-self-center mr-2 mr-lg-4">
                      <img src="assets//images/ios.svg" alt="" />
                    </div>
                    <div class="media-body">
                      <p>Get in for</p>
                      <h4>IOS</h4>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-sec-1 comm-sec">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-7">
            <div class="comm-text-wrap">
              <h2 class="heading-h2 mb-3 mb-lg-4">Stream & Live your Dreams</h2>
              <h5 class="heading-h5 pr-lg-4 mb-3 mb-lg-4">Zindagi is the top live streaming app. Watch the best talent live & stream.</h5>
              <p class="text-p pr-lg-5">From live video streaming to real-time interaction, Zindagi allows you to watch live videos, broadcast your life, video chat with your friends and make new friends globally. Don't wait – Join us, broadcast your life, gain fans and make new friends now.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-5">
            <div class="benefits-img">
              <img src="assets/images/landing-img-1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-sec-2">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 col-lg-6">
            <div class="comm-text-wrap pr-lg-4">
              <h2 class="heading-h2 mb-3 mb-lg-4">Get Started</h2>
              <h5 class="heading-h5 mb-3 mb-lg-4">Sign-up and Join in</h5>
              <p class="text-p">Open yourself to a new social circle. Meet new friends, partake in endless entertainment, discuss life and much more.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-6">
            <div class="landing-img text-right">
              <img src="assets/images/landing-img-2.png" alt="" />
            </div>
          </div>
        </div>
        <div class="row flex-row-reverse align-items-center pt-3">
          <div class="col-md-6 col-lg-6">
            <div class="comm-text-wrap pr-lg-4">
              <h2 class="heading-h2 mb-3 mb-lg-4">Stop Swiping, <br /> Start Streaming</h2>
              <h5 class="heading-h5 mb-3 mb-lg-4">Earn big by streaming your life</h5>
              <p class="text-p">Become a celebrity by sharing your life with your fans. Get loved by people around you while earning a top living via Zindagi</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-6">
            <div class="landing-img">
              <img src="assets/images/landing-img-3.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="container">
      <div class="row flex-row-reverse justify-content-center align-items-center">
        <div class="col-md-12 col-lg-5">
          <div class="footer-right">
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How to start</a></li>
              <li><a href="#">Safety</a></li>
              <li><a download="" href="#">Download App</a></li>
            </ul>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="footer-mid">
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="footer-left">
            <p>© 2020 GBN Live <span>All rights reserved.</span></p>
            <ul class="social-link">
              <li>
                <a class="tw" href="" target="_blank">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3216 4.47333C21.4666 5.07644 20.5199 5.53772 19.518 5.83941C18.9803 5.22111 18.2656 4.78288 17.4707 4.58398C16.6758 4.38508 15.839 4.43512 15.0734 4.72731C14.3079 5.0195 13.6505 5.53976 13.1903 6.21772C12.7301 6.89568 12.4892 7.69863 12.5001 8.51798V9.41083C10.9311 9.45152 9.37628 9.10352 7.97426 8.39784C6.57223 7.69215 5.36649 6.65069 4.46443 5.36619C4.46443 5.36619 0.892996 13.4019 8.92871 16.9733C7.0899 18.2215 4.89939 18.8474 2.67871 18.759C10.7144 23.2233 20.5359 18.759 20.5359 8.49119C20.535 8.24249 20.5111 7.9944 20.4644 7.75012C21.3757 6.85145 22.0187 5.71683 22.3216 4.47333V4.47333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a class="fb" href="" target="_blank">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2855 3.42859H13.7141C12.5774 3.42859 11.4873 3.88012 10.6836 4.68385C9.87989 5.48757 9.42836 6.57766 9.42836 7.7143V10.2857H6.85693V13.7143H9.42836V20.5714H12.8569V13.7143H15.4284L16.2855 10.2857H12.8569V7.7143C12.8569 7.48698 12.9472 7.26896 13.108 7.10821C13.2687 6.94747 13.4867 6.85716 13.7141 6.85716H16.2855V3.42859Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a class="ins" href="" target="_blank">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1" fill="white">
                      <path d="M17.3929 4H8.46428C5.99873 4 4 5.99873 4 8.46429V17.3929C4 19.8584 5.99873 21.8571 8.46428 21.8571H17.3929C19.8584 21.8571 21.8571 19.8584 21.8571 17.3929V8.46429C21.8571 5.99873 19.8584 4 17.3929 4Z" />
                      <path d="M16.5 12.3661C16.6102 13.1092 16.4833 13.8681 16.1373 14.5348C15.7913 15.2016 15.2439 15.7423 14.5729 16.0801C13.9019 16.4178 13.1415 16.5354 12.3998 16.416C11.6581 16.2967 10.973 15.9465 10.4418 15.4153C9.91064 14.8841 9.56047 14.199 9.44113 13.4573C9.32179 12.7157 9.43934 11.9553 9.77708 11.2843C10.1148 10.6133 10.6555 10.0658 11.3223 9.71986C11.9891 9.37388 12.748 9.24696 13.4911 9.35714C14.249 9.46954 14.9508 9.82274 15.4926 10.3646C16.0344 10.9064 16.3876 11.6081 16.5 12.3661Z" />
                      <path d="M19.1786 7.57143C19.1786 8.06454 18.7788 8.46429 18.2857 8.46429C17.7926 8.46429 17.3929 8.06454 17.3929 7.57143C17.3929 7.07832 17.7926 6.67857 18.2857 6.67857C18.7788 6.67857 19.1786 7.07832 19.1786 7.57143Z" />
                    </mask>
                    <path d="M16.5 12.3661L15.5108 12.5128L16.5 12.3661ZM13.4911 9.35714L13.3444 10.3463L13.4911 9.35714ZM8.46428 5H17.3929V3H8.46428V5ZM17.3929 5C19.3061 5 20.8571 6.55101 20.8571 8.46429H22.8571C22.8571 5.44644 20.4107 3 17.3929 3V5ZM20.8571 8.46429V17.3929H22.8571V8.46429H20.8571ZM20.8571 17.3929C20.8571 19.3061 19.3061 20.8571 17.3929 20.8571V22.8571C20.4107 22.8571 22.8571 20.4107 22.8571 17.3929H20.8571ZM17.3929 20.8571H8.46428V22.8571H17.3929V20.8571ZM8.46428 20.8571C6.55101 20.8571 5 19.3061 5 17.3929H3C3 20.4107 5.44644 22.8571 8.46428 22.8571V20.8571ZM5 17.3929V8.46429H3V17.3929H5ZM5 8.46429C5 6.55101 6.55101 5 8.46428 5V3C5.44644 3 3 5.44644 3 8.46429H5ZM15.5108 12.5128C15.5902 13.0478 15.4988 13.5942 15.2497 14.0743L17.0249 14.9954C17.4678 14.1419 17.6302 13.1705 17.4892 12.2194L15.5108 12.5128ZM15.2497 14.0743C15.0006 14.5544 14.6064 14.9437 14.1233 15.1868L15.0225 16.9733C15.8813 16.541 16.5821 15.8489 17.0249 14.9954L15.2497 14.0743ZM14.1233 15.1868C13.6402 15.43 13.0927 15.5146 12.5587 15.4287L12.2409 17.4033C13.1903 17.5561 14.1636 17.4056 15.0225 16.9733L14.1233 15.1868ZM12.5587 15.4287C12.0247 15.3428 11.5314 15.0907 11.1489 14.7082L9.73471 16.1224C10.4146 16.8023 11.2916 17.2506 12.2409 17.4033L12.5587 15.4287ZM11.1489 14.7082C10.7665 14.3258 10.5144 13.8325 10.4284 13.2985L8.45383 13.6162C8.60659 14.5655 9.0548 15.4425 9.73471 16.1224L11.1489 14.7082ZM10.4284 13.2985C10.3425 12.7645 10.4271 12.217 10.6703 11.7339L8.88384 10.8347C8.45154 11.6936 8.30107 12.6669 8.45383 13.6162L10.4284 13.2985ZM10.6703 11.7339C10.9135 11.2507 11.3028 10.8566 11.7829 10.6075L10.8617 8.83224C10.0083 9.27509 9.31614 9.97579 8.88384 10.8347L10.6703 11.7339ZM11.7829 10.6075C12.263 10.3584 12.8094 10.267 13.3444 10.3463L13.6378 8.36796C12.6866 8.22692 11.7152 8.38938 10.8617 8.83224L11.7829 10.6075ZM13.3444 10.3463C13.8901 10.4273 14.3954 10.6816 14.7855 11.0717L16.1997 9.65745C15.5062 8.96392 14.608 8.51183 13.6378 8.36796L13.3444 10.3463ZM14.7855 11.0717C15.1756 11.4618 15.4299 11.967 15.5108 12.5128L17.4892 12.2194C17.3453 11.2492 16.8932 10.351 16.1997 9.65745L14.7855 11.0717ZM18.1786 7.57143C18.1786 7.51226 18.2265 7.46429 18.2857 7.46429V9.46429C19.3311 9.46429 20.1786 8.61683 20.1786 7.57143H18.1786ZM18.2857 7.46429C18.3449 7.46429 18.3929 7.51226 18.3929 7.57143H16.3929C16.3929 8.61683 17.2403 9.46429 18.2857 9.46429V7.46429ZM18.3929 7.57143C18.3929 7.6306 18.3449 7.67857 18.2857 7.67857V5.67857C17.2403 5.67857 16.3929 6.52603 16.3929 7.57143H18.3929ZM18.2857 7.67857C18.2265 7.67857 18.1786 7.6306 18.1786 7.57143H20.1786C20.1786 6.52603 19.3311 5.67857 18.2857 5.67857V7.67857Z" fill="white" mask="url(#path-1-inside-1)" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</body>

</html>
=======
<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Zindagi</title>
  <link href="assets/images/favicon.svg" rel=icon sizes=32x32>
  <!-- font family CSS -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700;1,900&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300&display=swap" rel="stylesheet">
  <!-- bootstrap CSS -->
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/responsive.css">
  <script data-ad-client="ca-pub-2161181046732399" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

  <!-- all js  -->
  <script src="assets/js/jquery-3.5.1.min.js"></script>
  <script src="assets/js/zindagi.min.js"></script>
  <script src="assets/js/website-init.js"></script>
  <script src="//geodata.solutions/includes/countrystatecity.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

  <script>
    $(document).ready(function() {

      $("#registerButton").click(function() {
        var serializedData = $("#registrationForm").serializeArray();
        var returnArray = {};
        for (var i = 0; i < serializedData.length; i++) {
          returnArray[serializedData[i]['name']] = serializedData[i]['value'];
        }
        returnArray['birthdate'] = jQuery("select[name='year']").val() + '-' + jQuery("select[name='month']").val() + '-' + jQuery("select[name='day']").val();
        returnArray['latitude']  = jQuery("#lat").val();
        returnArray['longitude'] = jQuery("#long").val();
        delete returnArray["month"];
        delete returnArray["day"];
        delete returnArray["year"];

        // Variable to hold request
        var jsonData = JSON.stringify(returnArray);
        var request;
        // Fire off the request to process_registration_form.php
        request = $.ajax({
          url: "http://api.zindagi.io/api/register",
          type: "POST",
          data: jsonData,
          success: function(r) {
            if (r.status) {
              swal("Success!", "You have successfully registered here!", "success");
              $('#registrationForm').trigger("reset");
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
            url: "http://api.zindagi.io/api/login",
            type: "POST",
            data: jsonData,
            success: function(r) {
              if (r.status) {
                setCookie('AuthCookie', r.data[0].token);
                swal("Success!", "You have successfully LoggedIN!", "success");
                window.location = 'http://beta.zindagi.io';
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
        document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=zindagi.io";
      }

      setTimeout(function() {
        jQuery('#mysigninForm input').val('');
        jQuery('#registrationForm input').val('');
      }, 1000);


      if (window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getMap);
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      function getMap(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        jQuery('body').append('<input type="hidden" id="lat" value="'+lat+'"/> <input type="hidden" id="long" value="'+long+'"/>');
      }

    });
  </script>
</head>

<body>
  <header class="page-header">
    <nav class="navbar isnav container">
      <a class="navbar-brand" href="index.html">
        <img src="assets/images/logo.svg" alt="logo">
      </a>
      <div class="collapse show">
        <ul class="navbar-nav ml-auto">
          <li class="header-text">
            <p>Stream, connect, and chat with new people - Worldwide!</p>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <main class="page-main">
    <section class="main-banner">
      <div class="hero-image">
        <div class="container pt-5">
          <div class="row">
            <div class="col-md-12">
              <div class="login-box-bg">
                <div class="login-row">
                  <div class="signin-col">
                    <div class="login-from">
                      <h3 class="login-heading">Login</h3>
                      <form id="mysigninForm" autocomplete="off" action="" method="post">
                        <div class="form-row">
                          <div class="form-group col-md-12 mb-4">
                            <span class="login-input">
                              <input id="loginUsername" type="email" name="email" class="form-control" placeholder="Email" autocomplete="off" />
                            </span>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-12">
                            <span class="login-input">
                              <input id="loginPassword" type="password" name="password" class="form-control" placeholder="Password" autocomplete="off" />
                            </span>
                          </div>
                        </div>
                        <div class="form-row social-login">
                          <div class="form-group col-md-12 col-lg-6">
                            <a class="log-fb" href="#">
                              <svg width="147" height="50" viewBox="0 0 147 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="123.112" height="40" rx="20" fill="#1976D2" />
                                <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white" />
                                <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white" />
                                <path d="M106.403 16.5938V13.4688C106.403 12.6063 107.046 11.9062 107.838 11.9062H109.274V8H106.403C104.024 8 102.096 10.0984 102.096 12.6875V16.5938H99.2251V20.5H102.096V33H106.403V20.5H109.274L110.709 16.5938H106.403Z" fill="#1976D2" />
                              </svg>
                            </a>
                            <a href="#">
                              <svg width="134" height="40" viewBox="0 0 134 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="134" height="40" rx="20" fill="#F14336" />
                                <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white" />
                                <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white" />
                                <g clip-path="url(#clip0)">
                                  <path d="M106.097 21.8991L105.297 24.8879L102.371 24.9498C101.496 23.3278 101 21.472 101 19.4999C101 17.5929 101.464 15.7946 102.286 14.2112H102.286L104.892 14.6888L106.033 17.2783C105.794 17.9746 105.664 18.7221 105.664 19.4999C105.664 20.3441 105.817 21.1529 106.097 21.8991Z" fill="#FBBB00" />
                                  <path d="M123.799 17.3516C123.931 18.0473 124 18.7657 124 19.4999C124 20.3233 123.914 21.1264 123.749 21.9011C123.189 24.5372 121.726 26.8391 119.7 28.468L119.699 28.4674L116.418 28.3L115.953 25.401C117.298 24.6124 118.349 23.3784 118.902 21.9011H112.753V17.3516H118.992H123.799Z" fill="#518EF8" />
                                  <path d="M119.699 28.4675L119.699 28.4681C117.729 30.0522 115.225 31 112.5 31C108.12 31 104.313 28.5522 102.37 24.9499L106.097 21.8992C107.068 24.4912 109.569 26.3362 112.5 26.3362C113.76 26.3362 114.94 25.9956 115.953 25.401L119.699 28.4675Z" fill="#28B446" />
                                  <path d="M119.84 10.6475L116.115 13.6975C115.067 13.0423 113.828 12.6638 112.5 12.6638C109.502 12.6638 106.955 14.5935 106.033 17.2783L102.287 14.2113H102.286C104.2 10.5212 108.055 8 112.5 8C115.29 8 117.849 8.99394 119.84 10.6475Z" fill="#F14336" />
                                </g>
                                <defs>
                                  <clipPath id="clip0">
                                    <rect width="23" height="23" fill="white" transform="translate(101 8)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </div>
                          <div class="form-group col-md-6 text-right">
                            <a class="forget-text" href="#">Forget password?</a>
                          </div>
                        </div>
                        <div class="form-row mt-2">
                          <div class="form-group col-md-12 text-center">
                            <button class="btn-submit effect-1" id="loginButton">Log In</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="signup-col">
                    <div class="signin-from">
                      <h3 class="signup-heading">New to Zindagi?</h3>
                      <form id="registrationForm" autocomplete="off" action="" method="post">
                        <div class="form-row">
                          <div class="form-group col-md-3 mb-4">
                            <span class="signup-input">
                              <input type="text" name="name" class="form-control" placeholder="Name" required />
                            </span>
                          </div>
                          <div class="form-group col-md-6 mb-4">
                            <span class="signup-input">
                              <input name="email" type="email" class="form-control" placeholder="Email" required>
                            </span>
                          </div>
                          <div class="form-group col-md-3 mb-4">
                            <span class="signup-input">
                              <input type="password" class="form-control" name="password_token" placeholder="Password" required />
                            </span>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-3 mb-4">
                            <div class="signup-input">
                              <select id="gender" name="gender" class="custom-select form-control">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group birthdate col-md-9 mb-4">
                            <span class="signup-input">
                              <input type="text" class="form-control" placeholder="Birthdate" required>
                            </span>
                          </div>
                          <div class="m-d-y-wrap">
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="month" class="custom-select form-control" required>
                                  <option value="">Month</option>
                                  <?php for ($m = 1; $m <= 12; $m++) { ?>
                                    <option value="<?php echo $m; ?>"><?php echo $m; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="day" class="custom-select form-control" required>
                                  <option value="">Day</option>
                                  <?php for ($d = 1; $d <= 31; $d++) { ?>
                                    <option value="<?php echo $d; ?>"><?php echo $d; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-3 mb-4">
                              <div class="signup-input">
                                <select name="year" class="custom-select form-control" required>
                                  <option value="">Year</option>
                                  <?php for ($y = 1950; $y <= date('Y'); $y++) { ?>
                                    <option value="<?php echo $y; ?>"><?php echo $y; ?></option>
                                  <?php } ?>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="country" class="countries custom-select form-control" id="countryId" required>
                                <option value="">Select Country</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="region" class="states custom-select form-control" id="stateId" required>
                                <option value="">Select Region</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group col-md-4 mb-4">
                            <div class="signup-input">
                              <select name="city" class="cities custom-select form-control" id="cityId" required>
                                <option value="">Select City</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div class="form-row mt-2">
                          <div class="form-group col-md-12 text-center">
                            <button type="submit" id="registerButton" class="btn-signup effect-2">Sign Up</button>
                          </div>
                        </div>

                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="play-store-sec">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="max-w-store">
              <div class="d-flex justify-content-center">
                <a download="" href="#" class="store-box">
                  <div class="media">
                    <div class="d-flex align-self-center mr-2 mr-lg-4">
                      <img src="assets//images/android.svg" alt="" />
                    </div>
                    <div class="media-body">
                      <p>Get in for</p>
                      <h4>ANDROID</h4>
                    </div>
                  </div>
                </a>
                <a download="" href="#" class="store-box">
                  <div class="media">
                    <div class="d-flex align-self-center mr-2 mr-lg-4">
                      <img src="assets//images/ios.svg" alt="" />
                    </div>
                    <div class="media-body">
                      <p>Get in for</p>
                      <h4>IOS</h4>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-sec-1 comm-sec">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-7">
            <div class="comm-text-wrap">
              <h2 class="heading-h2 mb-3 mb-lg-4">Stream & Live your Dreams</h2>
              <h5 class="heading-h5 pr-lg-4 mb-3 mb-lg-4">Zindagi is the top live streaming app. Watch the best talent live & stream.</h5>
              <p class="text-p pr-lg-5">From live video streaming to real-time interaction, Zindagi allows you to watch live videos, broadcast your life, video chat with your friends and make new friends globally. Don't wait – Join us, broadcast your life, gain fans and make new friends now.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-5">
            <div class="benefits-img">
              <img src="assets/images/landing-img-1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-sec-2">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 col-lg-6">
            <div class="comm-text-wrap pr-lg-4">
              <h2 class="heading-h2 mb-3 mb-lg-4">Get Started</h2>
              <h5 class="heading-h5 mb-3 mb-lg-4">Sign-up and Join in</h5>
              <p class="text-p">Open yourself to a new social circle. Meet new friends, partake in endless entertainment, discuss life and much more.</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-6">
            <div class="landing-img text-right">
              <img src="assets/images/landing-img-2.png" alt="" />
            </div>
          </div>
        </div>
        <div class="row flex-row-reverse align-items-center pt-3">
          <div class="col-md-6 col-lg-6">
            <div class="comm-text-wrap pr-lg-4">
              <h2 class="heading-h2 mb-3 mb-lg-4">Stop Swiping, <br /> Start Streaming</h2>
              <h5 class="heading-h5 mb-3 mb-lg-4">Earn big by streaming your life</h5>
              <p class="text-p">Become a celebrity by sharing your life with your fans. Get loved by people around you while earning a top living via Zindagi</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-6">
            <div class="landing-img">
              <img src="assets/images/landing-img-3.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="container">
      <div class="row flex-row-reverse justify-content-center align-items-center">
        <div class="col-md-12 col-lg-5">
          <div class="footer-right">
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How to start</a></li>
              <li><a href="#">Safety</a></li>
              <li><a download="" href="#">Download App</a></li>
            </ul>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="footer-mid">
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="footer-left">
            <p>© 2020 GBN Live <span>All rights reserved.</span></p>
            <ul class="social-link">
              <li>
                <a class="tw" href="" target="_blank">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3216 4.47333C21.4666 5.07644 20.5199 5.53772 19.518 5.83941C18.9803 5.22111 18.2656 4.78288 17.4707 4.58398C16.6758 4.38508 15.839 4.43512 15.0734 4.72731C14.3079 5.0195 13.6505 5.53976 13.1903 6.21772C12.7301 6.89568 12.4892 7.69863 12.5001 8.51798V9.41083C10.9311 9.45152 9.37628 9.10352 7.97426 8.39784C6.57223 7.69215 5.36649 6.65069 4.46443 5.36619C4.46443 5.36619 0.892996 13.4019 8.92871 16.9733C7.0899 18.2215 4.89939 18.8474 2.67871 18.759C10.7144 23.2233 20.5359 18.759 20.5359 8.49119C20.535 8.24249 20.5111 7.9944 20.4644 7.75012C21.3757 6.85145 22.0187 5.71683 22.3216 4.47333V4.47333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a class="fb" href="" target="_blank">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2855 3.42859H13.7141C12.5774 3.42859 11.4873 3.88012 10.6836 4.68385C9.87989 5.48757 9.42836 6.57766 9.42836 7.7143V10.2857H6.85693V13.7143H9.42836V20.5714H12.8569V13.7143H15.4284L16.2855 10.2857H12.8569V7.7143C12.8569 7.48698 12.9472 7.26896 13.108 7.10821C13.2687 6.94747 13.4867 6.85716 13.7141 6.85716H16.2855V3.42859Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a class="ins" href="" target="_blank">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1" fill="white">
                      <path d="M17.3929 4H8.46428C5.99873 4 4 5.99873 4 8.46429V17.3929C4 19.8584 5.99873 21.8571 8.46428 21.8571H17.3929C19.8584 21.8571 21.8571 19.8584 21.8571 17.3929V8.46429C21.8571 5.99873 19.8584 4 17.3929 4Z" />
                      <path d="M16.5 12.3661C16.6102 13.1092 16.4833 13.8681 16.1373 14.5348C15.7913 15.2016 15.2439 15.7423 14.5729 16.0801C13.9019 16.4178 13.1415 16.5354 12.3998 16.416C11.6581 16.2967 10.973 15.9465 10.4418 15.4153C9.91064 14.8841 9.56047 14.199 9.44113 13.4573C9.32179 12.7157 9.43934 11.9553 9.77708 11.2843C10.1148 10.6133 10.6555 10.0658 11.3223 9.71986C11.9891 9.37388 12.748 9.24696 13.4911 9.35714C14.249 9.46954 14.9508 9.82274 15.4926 10.3646C16.0344 10.9064 16.3876 11.6081 16.5 12.3661Z" />
                      <path d="M19.1786 7.57143C19.1786 8.06454 18.7788 8.46429 18.2857 8.46429C17.7926 8.46429 17.3929 8.06454 17.3929 7.57143C17.3929 7.07832 17.7926 6.67857 18.2857 6.67857C18.7788 6.67857 19.1786 7.07832 19.1786 7.57143Z" />
                    </mask>
                    <path d="M16.5 12.3661L15.5108 12.5128L16.5 12.3661ZM13.4911 9.35714L13.3444 10.3463L13.4911 9.35714ZM8.46428 5H17.3929V3H8.46428V5ZM17.3929 5C19.3061 5 20.8571 6.55101 20.8571 8.46429H22.8571C22.8571 5.44644 20.4107 3 17.3929 3V5ZM20.8571 8.46429V17.3929H22.8571V8.46429H20.8571ZM20.8571 17.3929C20.8571 19.3061 19.3061 20.8571 17.3929 20.8571V22.8571C20.4107 22.8571 22.8571 20.4107 22.8571 17.3929H20.8571ZM17.3929 20.8571H8.46428V22.8571H17.3929V20.8571ZM8.46428 20.8571C6.55101 20.8571 5 19.3061 5 17.3929H3C3 20.4107 5.44644 22.8571 8.46428 22.8571V20.8571ZM5 17.3929V8.46429H3V17.3929H5ZM5 8.46429C5 6.55101 6.55101 5 8.46428 5V3C5.44644 3 3 5.44644 3 8.46429H5ZM15.5108 12.5128C15.5902 13.0478 15.4988 13.5942 15.2497 14.0743L17.0249 14.9954C17.4678 14.1419 17.6302 13.1705 17.4892 12.2194L15.5108 12.5128ZM15.2497 14.0743C15.0006 14.5544 14.6064 14.9437 14.1233 15.1868L15.0225 16.9733C15.8813 16.541 16.5821 15.8489 17.0249 14.9954L15.2497 14.0743ZM14.1233 15.1868C13.6402 15.43 13.0927 15.5146 12.5587 15.4287L12.2409 17.4033C13.1903 17.5561 14.1636 17.4056 15.0225 16.9733L14.1233 15.1868ZM12.5587 15.4287C12.0247 15.3428 11.5314 15.0907 11.1489 14.7082L9.73471 16.1224C10.4146 16.8023 11.2916 17.2506 12.2409 17.4033L12.5587 15.4287ZM11.1489 14.7082C10.7665 14.3258 10.5144 13.8325 10.4284 13.2985L8.45383 13.6162C8.60659 14.5655 9.0548 15.4425 9.73471 16.1224L11.1489 14.7082ZM10.4284 13.2985C10.3425 12.7645 10.4271 12.217 10.6703 11.7339L8.88384 10.8347C8.45154 11.6936 8.30107 12.6669 8.45383 13.6162L10.4284 13.2985ZM10.6703 11.7339C10.9135 11.2507 11.3028 10.8566 11.7829 10.6075L10.8617 8.83224C10.0083 9.27509 9.31614 9.97579 8.88384 10.8347L10.6703 11.7339ZM11.7829 10.6075C12.263 10.3584 12.8094 10.267 13.3444 10.3463L13.6378 8.36796C12.6866 8.22692 11.7152 8.38938 10.8617 8.83224L11.7829 10.6075ZM13.3444 10.3463C13.8901 10.4273 14.3954 10.6816 14.7855 11.0717L16.1997 9.65745C15.5062 8.96392 14.608 8.51183 13.6378 8.36796L13.3444 10.3463ZM14.7855 11.0717C15.1756 11.4618 15.4299 11.967 15.5108 12.5128L17.4892 12.2194C17.3453 11.2492 16.8932 10.351 16.1997 9.65745L14.7855 11.0717ZM18.1786 7.57143C18.1786 7.51226 18.2265 7.46429 18.2857 7.46429V9.46429C19.3311 9.46429 20.1786 8.61683 20.1786 7.57143H18.1786ZM18.2857 7.46429C18.3449 7.46429 18.3929 7.51226 18.3929 7.57143H16.3929C16.3929 8.61683 17.2403 9.46429 18.2857 9.46429V7.46429ZM18.3929 7.57143C18.3929 7.6306 18.3449 7.67857 18.2857 7.67857V5.67857C17.2403 5.67857 16.3929 6.52603 16.3929 7.57143H18.3929ZM18.2857 7.67857C18.2265 7.67857 18.1786 7.6306 18.1786 7.57143H20.1786C20.1786 6.52603 19.3311 5.67857 18.2857 5.67857V7.67857Z" fill="white" mask="url(#path-1-inside-1)" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</body>

</html>
>>>>>>> #issue-36-29
