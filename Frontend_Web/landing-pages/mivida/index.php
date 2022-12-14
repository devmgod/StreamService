<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Mivida</title>
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
    <script src="https://geodata.solutions/includes/countrystatecity.js"></script>
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
              url: "http://127.0.0.1:9000/api/register",
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
                url: "http://127.0.0.1:9000/api/login",
                type: "POST",
                data: jsonData,
                success: function(r) {
                  if (r.status) {
                    setCookie('AuthCookie', r.data[0].token);
                    swal("Success!", "You have successfully LoggedIN!", "success");
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
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
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
                            <p>Conoce, charla y divi??rtete con gente nueva</p>
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
                                                <h3 class="login-heading">Acceso</h3>
                                                <form id="mysigninForm" autocomplete="off" action="" method="post">
                                                    <div class="form-row">
                                                      <div class="form-group col-md-12 mb-4">
                                                        <span class="login-input">
                                                            <input id="loginUsername" type="email" name="email" class="form-control" placeholder="Nombre de usuario" autocomplete="off" />
                                                        </span>  
                                                      </div>
                                                    </div>
                                                    <div class="form-row">
                                                        <div class="form-group col-md-12">
                                                          <span class="login-input">
                                                          <input id="loginPassword" type="password" name="password" class="form-control" placeholder="Contrase??a" autocomplete="off" />
                                                          </span>
                                                        </div>
                                                    </div>
                                                    <div class="form-row social-login">
                                                        <div class="form-group col-md-12 col-lg-6">
                                                            <a class="log-fb" href="#">
                                                                <svg width="147" height="50" viewBox="0 0 147 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="123.112" height="40" rx="20" fill="#1976D2"/>
                                                                    <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white"/>
                                                                    <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white"/>
                                                                    <path d="M106.403 16.5938V13.4688C106.403 12.6063 107.046 11.9062 107.838 11.9062H109.274V8H106.403C104.024 8 102.096 10.0984 102.096 12.6875V16.5938H99.2251V20.5H102.096V33H106.403V20.5H109.274L110.709 16.5938H106.403Z" fill="#1976D2"/>
                                                                </svg>
                                                            </a>
                                                            <a href="#">
                                                                <svg width="134" height="40" viewBox="0 0 134 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect width="134" height="40" rx="20" fill="#F14336"/>
                                                                    <path d="M14.4746 23.9268H19.1914V25H13.1553V15.0469H14.4746V23.9268ZM20.1553 21.2334C20.1553 20.5088 20.2965 19.8571 20.5791 19.2783C20.8662 18.6995 21.2627 18.2529 21.7686 17.9385C22.279 17.624 22.86 17.4668 23.5117 17.4668C24.5189 17.4668 25.3324 17.8154 25.9521 18.5127C26.5765 19.21 26.8887 20.1374 26.8887 21.2949V21.3838C26.8887 22.1038 26.7497 22.751 26.4717 23.3252C26.1982 23.8949 25.804 24.3392 25.2891 24.6582C24.7786 24.9772 24.1908 25.1367 23.5254 25.1367C22.5228 25.1367 21.7093 24.7881 21.085 24.0908C20.4652 23.3936 20.1553 22.4707 20.1553 21.3223V21.2334ZM21.4268 21.3838C21.4268 22.2041 21.6159 22.8626 21.9941 23.3594C22.377 23.8561 22.8874 24.1045 23.5254 24.1045C24.168 24.1045 24.6784 23.8538 25.0566 23.3525C25.4349 22.8467 25.624 22.1403 25.624 21.2334C25.624 20.4222 25.4303 19.766 25.043 19.2646C24.6602 18.7588 24.1497 18.5059 23.5117 18.5059C22.8874 18.5059 22.3838 18.7542 22.001 19.251C21.6182 19.7477 21.4268 20.4587 21.4268 21.3838ZM28.1738 21.2402C28.1738 20.0872 28.4404 19.1712 28.9736 18.4922C29.5068 17.8086 30.2132 17.4668 31.0928 17.4668C31.9951 17.4668 32.6992 17.7858 33.2051 18.4238L33.2666 17.6035H34.4219V24.8223C34.4219 25.7793 34.137 26.5335 33.5674 27.085C33.0023 27.6364 32.2412 27.9121 31.2842 27.9121C30.751 27.9121 30.2292 27.7982 29.7188 27.5703C29.2083 27.3424 28.8187 27.0303 28.5498 26.6338L29.2061 25.875C29.7484 26.5449 30.4115 26.8799 31.1953 26.8799C31.8105 26.8799 32.2891 26.7067 32.6309 26.3604C32.9772 26.014 33.1504 25.5264 33.1504 24.8975V24.2617C32.6445 24.8451 31.9541 25.1367 31.0791 25.1367C30.2132 25.1367 29.5114 24.7881 28.9736 24.0908C28.4404 23.3936 28.1738 22.4434 28.1738 21.2402ZM29.4453 21.3838C29.4453 22.2178 29.6162 22.874 29.958 23.3525C30.2998 23.8265 30.7783 24.0635 31.3936 24.0635C32.1911 24.0635 32.7767 23.7012 33.1504 22.9766V19.5996C32.763 18.8932 32.182 18.54 31.4072 18.54C30.792 18.54 30.3112 18.7793 29.9648 19.2578C29.6185 19.7363 29.4453 20.445 29.4453 21.3838ZM41.1826 25H39.918V17.6035H41.1826V25ZM39.8154 15.6416C39.8154 15.4365 39.877 15.2633 40 15.1221C40.1276 14.9808 40.3145 14.9102 40.5605 14.9102C40.8066 14.9102 40.9935 14.9808 41.1211 15.1221C41.2487 15.2633 41.3125 15.4365 41.3125 15.6416C41.3125 15.8467 41.2487 16.0176 41.1211 16.1543C40.9935 16.291 40.8066 16.3594 40.5605 16.3594C40.3145 16.3594 40.1276 16.291 40 16.1543C39.877 16.0176 39.8154 15.8467 39.8154 15.6416ZM44.4092 17.6035L44.4502 18.5332C45.0153 17.8223 45.7536 17.4668 46.665 17.4668C48.2282 17.4668 49.0166 18.3486 49.0303 20.1123V25H47.7656V20.1055C47.7611 19.5723 47.638 19.1781 47.3965 18.9229C47.1595 18.6676 46.7881 18.54 46.2822 18.54C45.8721 18.54 45.512 18.6494 45.2021 18.8682C44.8923 19.0869 44.6507 19.374 44.4775 19.7295V25H43.2129V17.6035H44.4092ZM60.959 23.2568L62.3809 17.6035H63.6455L61.4922 25H60.4668L58.6689 19.3945L56.9189 25H55.8936L53.7471 17.6035H55.0049L56.4609 23.1406L58.1836 17.6035H59.2021L60.959 23.2568ZM66.3115 25H65.0469V17.6035H66.3115V25ZM64.9443 15.6416C64.9443 15.4365 65.0059 15.2633 65.1289 15.1221C65.2565 14.9808 65.4434 14.9102 65.6895 14.9102C65.9355 14.9102 66.1224 14.9808 66.25 15.1221C66.3776 15.2633 66.4414 15.4365 66.4414 15.6416C66.4414 15.8467 66.3776 16.0176 66.25 16.1543C66.1224 16.291 65.9355 16.3594 65.6895 16.3594C65.4434 16.3594 65.2565 16.291 65.1289 16.1543C65.0059 16.0176 64.9443 15.8467 64.9443 15.6416ZM70.0576 15.8125V17.6035H71.4385V18.5811H70.0576V23.168C70.0576 23.4642 70.1191 23.6875 70.2422 23.8379C70.3652 23.9837 70.5749 24.0566 70.8711 24.0566C71.0169 24.0566 71.2174 24.0293 71.4727 23.9746V25C71.14 25.0911 70.8164 25.1367 70.502 25.1367C69.9368 25.1367 69.5107 24.9658 69.2236 24.624C68.9365 24.2822 68.793 23.7969 68.793 23.168V18.5811H67.4463V17.6035H68.793V15.8125H70.0576ZM74.1865 18.499C74.7471 17.8109 75.4762 17.4668 76.374 17.4668C77.9372 17.4668 78.7256 18.3486 78.7393 20.1123V25H77.4746V20.1055C77.4701 19.5723 77.347 19.1781 77.1055 18.9229C76.8685 18.6676 76.4971 18.54 75.9912 18.54C75.5811 18.54 75.221 18.6494 74.9111 18.8682C74.6012 19.0869 74.3597 19.374 74.1865 19.7295V25H72.9219V14.5H74.1865V18.499Z" fill="white"/>
                                                                    <path d="M93 0H114C125.046 0 134 8.95431 134 20C134 31.0457 125.046 40 114 40H93V0Z" fill="white"/>
                                                                    <g clip-path="url(#clip0)">
                                                                    <path d="M106.097 21.8991L105.297 24.8879L102.371 24.9498C101.496 23.3278 101 21.472 101 19.4999C101 17.5929 101.464 15.7946 102.286 14.2112H102.286L104.892 14.6888L106.033 17.2783C105.794 17.9746 105.664 18.7221 105.664 19.4999C105.664 20.3441 105.817 21.1529 106.097 21.8991Z" fill="#FBBB00"/>
                                                                    <path d="M123.799 17.3516C123.931 18.0473 124 18.7657 124 19.4999C124 20.3233 123.914 21.1264 123.749 21.9011C123.189 24.5372 121.726 26.8391 119.7 28.468L119.699 28.4674L116.418 28.3L115.953 25.401C117.298 24.6124 118.349 23.3784 118.902 21.9011H112.753V17.3516H118.992H123.799Z" fill="#518EF8"/>
                                                                    <path d="M119.699 28.4675L119.699 28.4681C117.729 30.0522 115.225 31 112.5 31C108.12 31 104.313 28.5522 102.37 24.9499L106.097 21.8992C107.068 24.4912 109.569 26.3362 112.5 26.3362C113.76 26.3362 114.94 25.9956 115.953 25.401L119.699 28.4675Z" fill="#28B446"/>
                                                                    <path d="M119.84 10.6475L116.115 13.6975C115.067 13.0423 113.828 12.6638 112.5 12.6638C109.502 12.6638 106.955 14.5935 106.033 17.2783L102.287 14.2113H102.286C104.2 10.5212 108.055 8 112.5 8C115.29 8 117.849 8.99394 119.84 10.6475Z" fill="#F14336"/>
                                                                    </g>
                                                                    <defs>
                                                                    <clipPath id="clip0">
                                                                    <rect width="23" height="23" fill="white" transform="translate(101 8)"/>
                                                                    </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </a>
                                                        </div>
                                                        <div class="form-group col-md-6 text-right">
                                                            <a class="forget-text" href="#">??Contrase??a olvidada?</a>
                                                        </div>
                                                    </div>
                                                    <div class="form-row mt-2">
                                                        <div class="form-group col-md-12 text-center">
                                                            <button class="btn-submit effect-1" id="loginButton">Iniciar sesi??n</button>
                                                        </div>
                                                    </div>
                                                  </form>
                                            </div>
                                        </div>
                                        <div class="signup-col">
                                            <div class="signin-from">
                                                <h3 class="signup-heading">Nueva en MiVida?</h3>
                                                <form id="registrationForm" autocomplete="off" action="" method="post"></form>
                                                    <div class="form-row">
                                                      <div class="form-group col-md-3 mb-4">
                                                        <span class="signup-input">
                                                            <input type="text" name="name" class="form-control" placeholder="Nombre" required />
                                                        </span>  
                                                      </div>
                                                      <div class="form-group col-md-6 mb-4">
                                                        <span class="signup-input">
                                                            <input name="email" type="email" class="form-control" placeholder="Correo electr??nico" required>
                                                        </span>  
                                                    </div>
                                                    <div class="form-group col-md-3 mb-4">
                                                        <span class="signup-input">
                                                            <input type="password" name="password_token" class="form-control" placeholder="Contrase??a" required />
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
                                                            <input type="text" class="form-control" placeholder="Data de nascimento" required/>
                                                            </span>  
                                                        </div>
                                                        <div class="m-d-y-wrap">
                                                            <div class="form-group col-sm-4 col-md-3 mb-4">
                                                                <span class="signup-input">
                                                                    <select name="month" class="custom-select form-control" required>
                                                                        <option value="">Mes</option>
                                                                        <?php for ($m = 1; $m <= 12; $m++) { ?>
                                                                            <option value="<?php echo $m; ?>"><?php echo $m; ?></option>
                                                                        <?php } ?>
                                                                    </select>
                                                                </span>  
                                                              </div>
                                                              <div class="form-group col-sm-4 col-md-3 mb-4">
                                                                <span class="signup-input">
                                                                    <select name="day" class="custom-select form-control" required>
                                                                        <option value="">D??a</option>
                                                                        <?php for ($d = 1; $d <= 31; $d++) { ?>
                                                                            <option value="<?php echo $d; ?>"><?php echo $d; ?></option>
                                                                        <?php } ?>
                                                                    </select>
                                                                </span>  
                                                              </div>
                                                              <div class="form-group col-sm-4 col-md-3 mb-4">
                                                                <span class="signup-input">
                                                                    <select name="year" class="custom-select form-control" required>
                                                                        <option value="">A??o</option>
                                                                        <?php for ($y = 1950; $y <= date('Y'); $y++) { ?>
                                                                            <option value="<?php echo $y; ?>"><?php echo $y; ?></option>
                                                                        <?php } ?>
                                                                    </select>
                                                                </span>  
                                                              </div>
                                                        </div>
                                                    </div>

                                                    <div class="form-row">
                                                        <div class="form-group col-md-4 mb-4">
                                                          <span class="signup-input">
                                                              <select name="country" class="countries custom-select form-control" id="countryId" required>
                                                                <option value="">Ciudad</option>
                                                              </select>
                                                          </span>  
                                                        </div>
                                                        <div class="form-group col-md-4 mb-4">
                                                            <span class="signup-input">
                                                                <select name="region" class="states custom-select form-control" id="stateId" required>
                                                                    <option value="">Regi??n</option>
                                                                </select>  
                                                            </span>
                                                      </div>
                                                      <div class="form-group col-md-4 mb-4">
                                                          <span class="signup-input">
                                                              <select name="city" class="cities custom-select form-control" id="cityId" required>
                                                                <option value="">Pa??s</option>
                                                              </select>
                                                          </span>  
                                                      </div>
                                                      </div>
      
                                                      <div class="form-row mt-2">
                                                        <div class="form-group col-md-12 text-center">
                                                            <button type="submit" id="registerButton" class="btn-signup effect-2">Inscribirse</button>
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
                                    <a download="" href="#" class="mr-3">
                                    <svg width="253" height="87" viewBox="0 0 253 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M244.934 86.8891H7.90111C3.5555 86.8891 0 82.9791 0 78.2002V8.68891C0 3.91001 3.5555 0 7.90111 0H244.934C249.28 0 252.836 3.91001 252.836 8.68891V78.2002C252.836 82.9791 249.28 86.8891 244.934 86.8891Z" fill="white"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3577 42.5754V19.7669C19.3577 18.4636 20.3453 17.3774 21.3329 17.3774C22.3206 17.3774 22.7156 17.5947 23.3082 18.0291L61.4311 41.0548C62.2212 41.4893 62.6162 42.1409 62.6162 42.7926C62.6162 43.4443 62.2212 44.096 61.4311 44.5304L23.3082 67.5561C22.9132 67.7733 22.3206 68.2078 21.3329 68.2078C20.3453 68.2078 19.3577 67.1217 19.3577 65.8183V42.5754Z" fill="url(#paint0_linear)"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M44.0487 42.7927L20.938 17.3774C21.1355 17.3774 21.1355 17.3774 21.333 17.3774C22.3207 17.3774 22.7157 17.5947 23.3083 18.0291L51.3573 34.9727L44.0487 42.7927Z" fill="url(#paint1_linear)"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M51.1597 50.3961L44.0487 42.5758L51.3572 34.5383L61.4312 40.6208C62.2213 41.0552 62.6163 41.7069 62.6163 42.3586C62.6163 43.0103 62.2213 43.662 61.4312 44.0964L51.1597 50.3961Z" fill="url(#paint2_linear)"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1355 67.7744L44.0487 42.5762L51.1597 50.3963L23.3083 67.1227C22.7157 67.5572 22.3207 67.7744 21.1355 67.7744C21.333 67.7744 21.333 67.7744 21.1355 67.7744Z" fill="url(#paint3_linear)"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M140.442 73.6389C139.455 72.77 138.664 71.2495 138.269 70.3806L141.43 68.86C141.627 69.2945 142.022 69.9462 142.418 70.5978C143.208 71.4667 144.393 72.3356 145.578 72.3356C146.763 72.3356 148.146 71.6839 148.936 70.5978C149.529 69.5117 149.924 68.4256 149.924 66.905V65.6017C147.553 68.86 142.615 68.4256 139.85 64.95C136.887 61.4745 136.887 55.6095 139.85 52.1339C142.813 48.8756 147.158 48.4411 149.726 51.4823V49.9617H153.084V66.2534C153.084 70.3806 151.701 72.77 149.924 74.2906C148.738 75.3767 146.961 75.8112 145.38 75.8112C143.603 75.5939 141.825 74.9423 140.442 73.6389ZM223.206 74.5078L226.564 65.8189L220.639 50.8306H223.996L228.145 61.4745L232.293 50.8306H235.651L226.564 74.5078H223.206ZM207.207 66.2534C206.219 65.1673 205.824 63.6467 205.824 62.1261C205.824 60.8228 206.219 59.5195 207.009 58.6506C208.392 57.13 210.367 56.4784 212.54 56.4784C213.923 56.4784 215.108 56.6956 216.095 57.3473C216.095 54.7406 214.12 53.6545 212.54 53.6545C211.157 53.6545 209.774 54.5234 209.182 56.0439L206.219 54.7406C206.812 53.22 208.392 50.3961 212.342 50.3961C214.318 50.3961 216.293 51.0478 217.478 52.5684C218.663 54.0889 219.058 55.8267 219.058 58.2161V67.3395H215.7V65.8189C215.305 66.4706 214.515 66.905 213.923 67.3395C213.132 67.7739 212.145 67.9912 211.157 67.9912C209.972 67.7739 208.194 67.3395 207.207 66.2534ZM101.924 58.4334C101.924 54.0889 104.887 49.31 110.22 49.31C115.356 49.31 118.517 54.0889 118.517 58.4334C118.517 62.7778 115.554 67.5567 110.22 67.5567C104.887 67.5567 101.924 62.7778 101.924 58.4334ZM119.702 58.4334C119.702 54.0889 122.665 49.31 127.998 49.31C133.134 49.31 136.294 54.0889 136.294 58.4334C136.294 62.7778 133.331 67.5567 127.998 67.5567C122.862 67.5567 119.702 62.7778 119.702 58.4334ZM79.6037 63.2123C74.6655 57.7817 74.863 48.8756 79.8012 43.2278C82.3691 40.4039 85.5295 39.1006 88.8875 39.1006C92.0479 39.1006 95.2084 40.4039 97.5787 43.0106L95.2084 45.8345C91.6529 41.9245 85.9246 42.1417 82.5666 46.0517C79.0111 50.1789 79.0111 56.4784 82.5666 60.6056C86.1221 64.7328 92.0479 64.95 95.6034 60.8228C96.7886 59.5195 97.1837 57.7817 97.3812 56.0439H89.085V52.1339H100.739C100.937 53.0028 100.937 54.0889 100.937 55.175C100.937 58.4334 99.7515 61.6917 97.7762 63.8639C95.6034 66.2534 92.443 67.5567 89.2825 67.5567C85.727 67.3395 82.1715 66.0361 79.6037 63.2123ZM163.158 64.7328C160.195 61.2573 160.195 55.3923 163.158 51.6995C166.121 48.2239 171.059 48.2239 173.824 51.6995C174.812 52.7856 175.405 54.3061 175.997 55.8267L165.133 60.8228C165.726 62.3434 167.109 63.6467 169.084 63.6467C170.862 63.6467 172.047 62.995 173.232 61.04L176.195 63.2123C175.8 63.6467 175.405 64.0812 175.207 64.5156C171.849 68.2084 166.121 68.2084 163.158 64.7328ZM183.701 67.3395V43.2278H190.812C194.96 43.2278 198.318 46.4861 198.318 50.3961C198.318 54.3061 195.355 57.5645 191.602 57.5645H187.256V67.1223H183.701V67.3395ZM200.293 67.3395V43.2278H203.651V67.3395H200.293ZM155.652 66.905V39.9695H159.207V66.905H155.652ZM215.898 60.1712C215.108 59.5195 213.923 59.3023 212.737 59.3023C210.367 59.3023 208.984 60.6056 208.984 62.1261C208.984 63.6467 210.367 64.5156 211.75 64.5156C213.725 64.5156 215.898 62.7778 215.898 60.1712ZM114.764 58.4334C114.764 55.8267 113.183 53.0028 110.22 53.0028C107.258 53.0028 105.677 55.8267 105.677 58.4334C105.677 61.04 107.258 63.8639 110.22 63.8639C112.986 63.8639 114.764 61.04 114.764 58.4334ZM132.541 58.4334C132.541 55.8267 130.961 53.0028 127.998 53.0028C125.035 53.0028 123.455 55.8267 123.455 58.4334C123.455 61.04 125.035 63.8639 127.998 63.8639C130.961 63.8639 132.541 61.04 132.541 58.4334ZM150.121 59.9539C150.121 59.7367 150.121 59.5195 150.319 59.3023C150.319 59.085 150.319 58.6506 150.319 58.4334C150.319 58.2162 150.319 57.7817 150.319 57.5645V57.3473C150.319 57.13 150.121 56.6956 150.121 56.4784C149.529 54.3061 147.751 52.7856 145.973 52.7856C143.603 52.7856 141.627 55.3923 141.627 58.2161C141.627 61.2573 143.603 63.6467 146.171 63.6467C147.751 63.8639 149.331 62.3434 150.121 59.9539ZM164.541 57.9989L171.849 54.5234C171.059 53.0028 169.874 52.5684 168.886 52.5684C165.923 52.7856 164.146 56.2612 164.541 57.9989ZM194.762 50.6134C194.762 48.4411 193.182 46.9206 191.009 46.9206H187.059V54.5234H191.207C193.182 54.5234 194.762 52.7856 194.762 50.6134Z" fill="black"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M225.775 70.1675H225.577V69.9463H225.775H225.577V70.1675H225.775Z" fill="black"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M226.17 70.1675C226.17 69.9463 226.17 69.9463 226.17 70.1675C225.972 69.9463 225.972 69.9463 226.17 70.1675C225.972 70.1675 225.972 70.1675 226.17 70.1675ZM226.17 69.9463C226.17 70.1675 226.17 70.1675 226.17 69.9463C226.17 70.1675 225.972 70.1675 226.17 69.9463C225.972 69.9463 226.17 69.9463 226.17 69.9463Z" fill="black"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M226.368 69.9463H226.169H226.368V70.1675V69.9463Z" fill="black"/>
                                        <path d="M76.8383 21.94C76.8383 18.0301 79.4061 15.6406 82.5666 15.6406C84.7394 15.6406 86.1221 16.7267 87.1097 18.2473L85.5295 19.3334C84.9369 18.4645 83.9493 17.8128 82.5666 17.8128C80.3938 17.8128 78.8135 19.5506 78.8135 22.1573C78.8135 24.7639 80.3938 26.5017 82.5666 26.5017C83.7517 26.5017 84.7394 25.85 85.1344 25.4156V23.4606H81.974V21.5056H87.3072V26.0673C86.3196 27.3706 84.7394 28.2395 82.7641 28.2395C79.4061 28.2395 76.8383 25.6328 76.8383 21.94Z" fill="black"/>
                                        <path d="M89.6776 28.0217V15.8569H97.1837V17.812H91.4554V20.8532H96.9862V22.8083H91.4554V26.2839H97.1837V28.239L89.6776 28.0217Z" fill="black"/>
                                        <path d="M102.714 28.0216V17.812H99.3564V15.8569H108.048V17.812H104.69V28.0216H102.714Z" fill="black"/>
                                        <path d="M114.764 28.0216V15.8569H116.739V28.0216H114.764Z" fill="black"/>
                                        <path d="M122.072 28.0216V17.812H118.714V15.8569H127.405V17.812H124.047V28.0216H122.072Z" fill="black"/>
                                        <path d="M133.726 21.94C133.726 18.2473 136.097 15.6406 139.455 15.6406C142.813 15.6406 145.183 18.2473 145.183 21.94C145.183 25.6328 142.813 28.2395 139.455 28.2395C136.097 28.2395 133.726 25.4156 133.726 21.94ZM143.01 21.94C143.01 19.3334 141.627 17.5956 139.257 17.5956C137.084 17.5956 135.504 19.5506 135.504 21.94C135.504 24.5467 136.887 26.2845 139.257 26.2845C141.627 26.2845 143.01 24.3295 143.01 21.94Z" fill="black"/>
                                        <path d="M155.059 28.0216L149.331 19.3326V28.0216H147.356V15.8569H149.331L155.059 24.3288V15.8569H157.035V28.0216H155.059Z" fill="black"/>
                                        <defs>
                                        <linearGradient id="paint0_linear" x1="32.1326" y1="14.279" x2="45.3509" y2="63.6422" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#006884"/>
                                        <stop offset="1" stop-color="#8AD1D0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear" x1="18.648" y1="21.3826" x2="50.0109" y2="36.8002" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#24BBB6"/>
                                        <stop offset="1" stop-color="#DBE692"/>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear" x1="53.3215" y1="51.3087" x2="53.3215" y2="34.0424" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#FCC072"/>
                                        <stop offset="1" stop-color="#F58A5B"/>
                                        </linearGradient>
                                        <linearGradient id="paint3_linear" x1="24.483" y1="72.269" x2="50.588" y2="48.1107" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#712B8F"/>
                                        <stop offset="1" stop-color="#EA1D27"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                   </a>
                                    <a download="" href="#" class="ml-3">
                                      <svg width="254" height="87" viewBox="0 0 254 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M246.089 87H8.75311C4.40195 87 0.841919 83.085 0.841919 78.3V8.7C0.841919 3.915 4.40195 0 8.75311 0H246.089C250.44 0 254 3.915 254 8.7V78.3C254 83.085 250.44 87 246.089 87Z" fill="white"/>
                                        <path d="M54.2425 43.0659C54.2425 36.3234 59.3847 33.0609 59.5825 32.8434C56.6158 28.2758 52.2647 27.6233 50.6824 27.4058C46.9246 26.9708 43.1668 29.7984 41.3868 29.7984C39.409 29.7984 36.4423 27.4058 33.2778 27.4058C29.1245 27.4058 25.3666 30.0159 23.1911 34.1484C18.8399 42.4134 22.0044 54.5934 26.1578 61.3359C28.3333 64.5984 30.7067 68.2959 33.8712 68.0784C37.0356 67.8609 38.2223 65.9034 41.9801 65.9034C45.738 65.9034 46.7268 68.0784 50.0891 68.0784C53.4514 68.0784 55.6269 64.8159 57.6047 61.5534C59.9781 57.8559 60.967 54.1584 60.967 53.9409C60.7692 53.7234 54.2425 51.1134 54.2425 43.0659Z" fill="black"/>
                                        <path d="M48.1112 23.0547C49.6934 20.6622 50.8801 17.6172 50.6824 14.3547C48.309 14.5722 45.1445 16.0947 43.5623 18.4872C41.98 20.4447 40.5956 23.7072 40.9911 26.7521C43.5623 26.9696 46.3312 25.2296 48.1112 23.0547Z" fill="black"/>
                                        <path d="M99.3363 67.642H94.9851L92.6118 59.3771H84.305L82.1295 67.642H77.9761L86.2828 39.5847H91.4251L99.3363 67.642ZM91.8206 55.8971L89.6451 48.5022C89.4473 47.8497 89.0517 45.8922 88.2606 43.2822C88.0628 44.3697 87.6673 46.3272 87.0739 48.5022L84.8984 55.8971H91.8206Z" fill="black"/>
                                        <path d="M120.499 57.42C120.499 60.9 119.708 63.51 117.928 65.685C116.345 67.425 114.565 68.295 112.192 68.295C109.819 68.295 108.039 67.425 107.05 65.4675V76.1251H102.896V54.375C102.896 52.2 102.896 50.025 102.698 47.6325H106.259L106.456 50.895C107.841 48.5025 109.819 47.1975 112.587 47.1975C114.763 47.1975 116.543 48.0675 117.928 50.025C119.708 51.765 120.499 54.1575 120.499 57.42ZM116.345 57.42C116.345 55.4625 115.95 53.7225 115.159 52.635C114.367 51.33 113.181 50.6775 111.599 50.6775C110.61 50.6775 109.621 51.1125 108.83 51.765C108.039 52.4175 107.445 53.505 107.247 54.5925C107.05 55.245 107.05 55.68 107.05 55.8975V59.3775C107.05 60.9 107.445 61.9875 108.236 63.075C109.027 64.1625 110.214 64.5975 111.401 64.5975C112.983 64.5975 114.17 63.945 114.961 62.64C115.95 61.335 116.345 59.595 116.345 57.42Z" fill="black"/>
                                        <path d="M141.661 57.42C141.661 60.9 140.87 63.51 139.09 65.685C137.508 67.425 135.728 68.295 133.354 68.295C130.981 68.295 129.201 67.425 128.212 65.4675V76.1251H124.059V54.375C124.059 52.2 124.059 50.025 123.861 47.6325H127.421L127.619 50.895C129.003 48.5025 130.981 47.1975 133.75 47.1975C135.926 47.1975 137.706 48.0675 139.09 50.025C140.87 51.765 141.661 54.1575 141.661 57.42ZM137.508 57.42C137.508 55.4625 137.112 53.7225 136.321 52.635C135.53 51.33 134.343 50.6775 132.761 50.6775C131.772 50.6775 130.783 51.1125 129.992 51.765C129.201 52.4175 128.608 53.505 128.41 54.5925C128.212 55.245 128.212 55.68 128.212 55.8975V59.3775C128.212 60.9 128.608 61.9875 129.399 63.075C130.19 64.1625 131.377 64.5975 132.563 64.5975C134.146 64.5975 135.332 63.945 136.123 62.64C137.112 61.335 137.508 59.595 137.508 57.42Z" fill="black"/>
                                        <path d="M165.395 59.8126C165.395 62.2051 164.604 64.1626 163.219 65.6851C161.637 67.4251 159.264 68.0776 156.297 68.0776C153.528 68.0776 151.352 67.4251 149.77 66.3376L150.759 62.6401C152.539 63.7276 154.517 64.3801 156.692 64.3801C158.275 64.3801 159.461 63.9451 160.252 63.2926C161.044 62.4226 161.439 61.5526 161.439 60.2476C161.439 59.1601 161.044 58.0726 160.45 57.4201C159.659 56.5501 158.472 55.8976 156.89 55.245C152.341 53.505 150.166 50.6775 150.166 47.1975C150.166 44.805 150.957 43.065 152.539 41.5424C154.121 40.0199 156.099 39.3674 158.868 39.3674C161.241 39.3674 163.021 39.8024 164.604 40.6724L163.615 44.37C162.23 43.5 160.648 43.065 158.67 43.065C157.286 43.065 156.099 43.5 155.308 44.1525C154.715 44.805 154.319 45.675 154.319 46.7625C154.319 47.85 154.715 48.72 155.506 49.59C156.099 50.2425 157.484 50.895 159.264 51.765C161.439 52.635 163.021 53.94 164.208 55.245C164.801 56.3326 165.395 57.8551 165.395 59.8126Z" fill="black"/>
                                        <path d="M178.844 50.895H174.295V60.6824C174.295 63.0749 175.086 64.3799 176.668 64.3799C177.459 64.3799 178.053 64.3799 178.448 64.1624L178.646 67.6424C177.855 68.0774 176.866 68.0774 175.481 68.0774C173.899 68.0774 172.515 67.6424 171.724 66.5549C170.735 65.4674 170.339 63.7274 170.339 61.1174V50.895H167.57V47.4151H170.339V43.7176L174.295 42.4126V47.4151H178.844V50.895Z" fill="black"/>
                                        <path d="M199.215 57.4203C199.215 60.4653 198.424 63.0753 196.842 65.0328C195.062 66.9903 192.886 68.0778 190.117 68.0778C187.348 68.0778 185.173 66.9903 183.59 65.0328C182.008 63.0753 181.217 60.6828 181.217 57.6378C181.217 54.5928 182.008 51.9828 183.788 50.0252C185.37 48.0677 187.744 46.9802 190.513 46.9802C193.282 46.9802 195.457 48.0677 197.039 50.0252C198.424 51.9828 199.215 54.3753 199.215 57.4203ZM194.864 57.6378C194.864 55.6803 194.468 54.1578 193.677 52.8528C192.886 51.3302 191.502 50.4602 189.919 50.4602C188.337 50.4602 186.953 51.3302 186.162 52.8528C185.37 54.1578 184.975 55.8978 184.975 57.6378C184.975 59.5953 185.37 61.1178 186.162 62.4228C186.953 63.9453 188.337 64.8153 189.919 64.8153C191.502 64.8153 192.688 63.9453 193.677 62.4228C194.468 61.1178 194.864 59.3778 194.864 57.6378Z" fill="black"/>
                                        <path d="M212.466 51.3299C212.071 51.3299 211.675 51.1124 211.082 51.1124C209.697 51.1124 208.511 51.7649 207.72 52.8524C207.126 53.9399 206.731 55.2449 206.731 56.7674V67.4248H202.577V53.5049C202.577 51.1124 202.577 49.1549 202.38 47.1974H205.94L206.137 51.1124H206.335C206.731 49.8074 207.522 48.7199 208.313 47.8499C209.302 47.1974 210.291 46.7625 211.28 46.7625C211.675 46.7625 212.071 46.7625 212.268 46.7625V51.3299H212.466Z" fill="black"/>
                                        <path d="M230.662 56.5503C230.662 57.4203 230.662 58.0728 230.464 58.5078H218.202C218.202 60.4653 218.795 61.9878 219.982 63.0753C220.971 63.9453 222.355 64.5978 223.937 64.5978C225.717 64.5978 227.498 64.3803 228.882 63.7278L229.475 66.7728C227.695 67.6428 225.717 68.0778 223.344 68.0778C220.575 68.0778 218.202 67.2078 216.62 65.2503C215.037 63.5103 214.246 60.9003 214.246 57.8553C214.246 54.8103 215.037 52.2002 216.422 50.2427C218.004 48.0677 220.18 46.9802 222.949 46.9802C225.52 46.9802 227.695 48.0677 228.882 50.2427C230.266 51.9827 230.662 54.1578 230.662 56.5503ZM226.904 55.4628C226.904 54.1578 226.706 53.0703 226.113 51.9828C225.322 50.6777 224.333 50.0252 222.949 50.0252C221.564 50.0252 220.575 50.6777 219.784 51.7652C219.191 52.6353 218.795 53.9403 218.597 55.2453H226.904V55.4628Z" fill="black"/>
                                        <path d="M90.6339 22.4028C90.6339 24.7952 90.0406 26.7527 88.6561 28.0577C87.4694 29.1451 85.6894 29.7976 83.3161 29.7976C82.1294 29.7976 81.1405 29.7976 80.3494 29.5801V16.0954C81.3383 15.8779 82.5249 15.8779 83.9094 15.8779C86.085 15.8779 87.6672 16.3129 88.8539 17.4004C89.8428 18.4879 90.6339 20.2278 90.6339 22.4028ZM88.4583 22.4028C88.4583 20.8803 88.0628 19.5754 87.2717 18.7054C86.4805 17.8354 85.2939 17.4004 83.9094 17.4004C83.3161 17.4004 82.7227 17.4004 82.3272 17.6179V27.8402C82.5249 27.8402 83.1183 27.8402 83.7116 27.8402C85.2939 27.8402 86.4805 27.4052 87.2717 26.5352C88.0628 25.6652 88.4583 24.1428 88.4583 22.4028Z" fill="black"/>
                                        <path d="M101.71 24.5777C101.71 26.1002 101.314 27.4053 100.523 28.2753C99.7318 29.3628 98.5451 29.7978 97.1606 29.7978C95.7762 29.7978 94.7873 29.3628 93.9961 28.2753C93.205 27.4053 92.8094 26.1002 92.8094 24.5777C92.8094 23.0552 93.205 21.7502 93.9961 20.8802C94.7873 19.7927 95.9739 19.3577 97.3584 19.3577C98.7429 19.3577 99.7318 19.7927 100.523 20.8802C101.314 21.7502 101.71 23.0552 101.71 24.5777ZM99.7318 24.5777C99.7318 23.7077 99.534 22.8377 99.1384 22.1852C98.7429 21.3152 98.1495 21.0977 97.3584 21.0977C96.5673 21.0977 95.9739 21.5327 95.5784 22.1852C95.1828 22.8377 94.985 23.7077 94.985 24.5777C94.985 25.4477 95.1828 26.3177 95.5784 26.9703C95.9739 27.8403 96.5673 28.0578 97.3584 28.0578C98.1495 28.0578 98.7429 27.6228 99.1384 26.7527C99.534 26.3177 99.7318 25.4477 99.7318 24.5777Z" fill="black"/>
                                        <path d="M116.939 19.575L114.17 29.5798H112.39L111.203 25.2299C110.807 24.1424 110.61 23.0549 110.412 21.9674C110.214 23.0549 110.016 24.1424 109.621 25.2299L108.434 29.5798H106.654L103.687 19.575H105.665L106.654 24.3599C106.852 25.4474 107.05 26.5349 107.247 27.6223C107.445 26.7524 107.643 25.6649 108.039 24.3599L109.225 19.575H110.807L111.994 24.1424C112.39 25.2299 112.587 26.3174 112.785 27.4048C112.983 26.3174 113.181 25.2299 113.379 24.1424L114.565 19.575H116.939Z" fill="black"/>
                                        <path d="M127.223 29.5805H125.245V23.9254C125.245 22.1854 124.652 21.3154 123.465 21.3154C122.872 21.3154 122.476 21.5329 122.081 21.9679C121.685 22.4029 121.488 23.0554 121.488 23.7079V29.5805H119.51V22.4029C119.51 21.5329 119.51 20.6629 119.51 19.5754H121.29V21.0979C121.488 20.6629 121.883 20.2279 122.279 19.7929C122.872 19.3579 123.465 19.1404 124.059 19.1404C124.85 19.1404 125.641 19.3579 126.234 20.0104C127.025 20.6629 127.223 21.7504 127.223 23.2729V29.5805Z" fill="black"/>
                                        <path d="M132.761 29.5802H130.783V15.0073H132.761V29.5802Z" fill="black"/>
                                        <path d="M144.628 24.5777C144.628 26.1002 144.232 27.4053 143.441 28.2753C142.65 29.3628 141.463 29.7978 140.079 29.7978C138.694 29.7978 137.705 29.3628 136.914 28.2753C136.123 27.4053 135.728 26.1002 135.728 24.5777C135.728 23.0552 136.123 21.7502 136.914 20.8802C137.705 20.0102 138.892 19.3577 140.277 19.3577C141.661 19.3577 142.65 19.7927 143.441 20.8802C144.232 21.7502 144.628 23.0552 144.628 24.5777ZM142.65 24.5777C142.65 23.7077 142.452 22.8377 142.057 22.1852C141.661 21.3152 141.068 21.0977 140.277 21.0977C139.485 21.0977 138.892 21.5327 138.497 22.1852C138.101 22.8377 137.903 23.7077 137.903 24.5777C137.903 25.4477 138.101 26.3177 138.497 26.9703C138.892 27.8403 139.485 28.0578 140.277 28.0578C141.068 28.0578 141.661 27.6228 142.057 26.7527C142.452 26.3177 142.65 25.4477 142.65 24.5777Z" fill="black"/>
                                        <path d="M154.319 29.5803H152.539L152.341 28.4928C151.748 29.3628 150.759 29.7978 149.77 29.7978C148.979 29.7978 148.188 29.5803 147.792 28.9278C147.397 28.2753 147.001 27.6228 147.001 26.9703C147.001 25.6652 147.397 24.7952 148.386 24.1427C149.374 23.4902 150.561 23.2727 152.341 23.2727V23.0552C152.341 21.7502 151.748 21.0977 150.561 21.0977C149.572 21.0977 148.979 21.3152 148.188 21.7502L147.792 20.2277C148.583 19.5752 149.572 19.3577 150.957 19.3577C153.33 19.3577 154.517 20.6627 154.517 23.4902V27.1878C154.319 28.2753 154.319 28.9278 154.319 29.5803ZM152.341 26.1002V24.5777C150.166 24.5777 148.979 25.2302 148.979 26.5352C148.979 26.9703 149.177 27.4053 149.374 27.6228C149.572 27.8403 149.968 28.0578 150.363 28.0578C150.759 28.0578 151.154 27.8403 151.55 27.6228C151.946 27.4053 152.143 26.9703 152.341 26.5352C152.341 26.5352 152.341 26.3177 152.341 26.1002Z" fill="black"/>
                                        <path d="M165.79 29.5802H164.01V28.0577C163.417 29.3627 162.428 29.7977 161.044 29.7977C159.857 29.7977 159.066 29.3627 158.275 28.4927C157.484 27.6227 157.286 26.3177 157.286 24.7952C157.286 23.2726 157.681 21.9676 158.472 20.8801C159.264 20.0101 160.252 19.5751 161.241 19.5751C162.428 19.5751 163.219 20.0101 163.812 20.8801V15.2251H165.79V26.9702C165.79 27.8402 165.79 28.7102 165.79 29.5802ZM163.812 25.4477V23.7076C163.812 23.4901 163.812 23.2726 163.812 23.0551C163.615 22.6201 163.417 22.1851 163.021 21.7501C162.626 21.3151 162.23 21.3151 161.637 21.3151C160.846 21.3151 160.252 21.7501 159.857 22.4026C159.461 23.0551 159.264 23.9251 159.264 25.0127C159.264 26.1002 159.461 26.7527 159.857 27.4052C160.252 28.0577 160.846 28.4927 161.637 28.4927C162.23 28.4927 162.824 28.2752 163.219 27.6227C163.615 26.7527 163.812 26.1002 163.812 25.4477Z" fill="black"/>
                                        <path d="M182.997 24.5777C182.997 26.1002 182.602 27.4053 181.81 28.2753C181.019 29.3628 179.833 29.7978 178.448 29.7978C177.064 29.7978 176.075 29.3628 175.284 28.2753C174.493 27.4053 174.097 26.1002 174.097 24.5777C174.097 23.0552 174.493 21.7502 175.284 20.8802C176.075 19.7927 177.262 19.3577 178.646 19.3577C180.03 19.3577 181.019 19.7927 181.81 20.8802C182.602 21.7502 182.997 23.0552 182.997 24.5777ZM180.822 24.5777C180.822 23.7077 180.624 22.8377 180.228 22.1852C179.833 21.3152 179.239 21.0977 178.448 21.0977C177.657 21.0977 177.064 21.5327 176.668 22.1852C176.273 22.8377 176.075 23.7077 176.075 24.5777C176.075 25.4477 176.273 26.3177 176.668 26.9703C177.064 27.8403 177.657 28.0578 178.448 28.0578C179.239 28.0578 179.833 27.6228 180.228 26.7527C180.624 26.3177 180.822 25.4477 180.822 24.5777Z" fill="black"/>
                                        <path d="M193.875 29.5805H191.897V23.9254C191.897 22.1854 191.304 21.3154 190.117 21.3154C189.524 21.3154 189.128 21.5329 188.733 21.9679C188.337 22.4029 188.139 23.0554 188.139 23.7079V29.5805H186.161V22.4029C186.161 21.5329 186.161 20.6629 186.161 19.5754H187.942V21.0979C188.139 20.6629 188.535 20.2279 188.93 19.7929C189.524 19.3579 190.117 19.1404 190.71 19.1404C191.502 19.1404 192.293 19.3579 192.886 20.0104C193.677 20.6629 193.875 21.7504 193.875 23.2729V29.5805Z" fill="black"/>
                                        <path d="M207.324 21.315H205.148V26.1001C205.148 27.4051 205.544 27.8401 206.335 27.8401C206.731 27.8401 206.928 27.8401 207.324 27.8401V29.5802C206.928 29.7977 206.335 29.7977 205.742 29.7977C204.951 29.7977 204.357 29.5802 203.962 28.9277C203.566 28.4926 203.368 27.4051 203.368 26.3176V21.315H201.984V19.5749H203.368V17.8349L205.346 17.1824V19.5749H207.522V21.315H207.324Z" fill="black"/>
                                        <path d="M218.004 29.5802H216.026V23.925C216.026 22.185 215.433 21.315 214.246 21.315C213.257 21.315 212.664 21.75 212.268 22.8375C212.268 23.055 212.268 23.2725 212.268 23.7075V29.5802H210.291V15.0073H212.268V21.0975C212.862 20.01 213.851 19.3574 215.037 19.3574C215.828 19.3574 216.62 19.5749 217.015 20.2275C217.608 20.88 218.004 22.185 218.004 23.49V29.5802Z" fill="black"/>
                                        <path d="M228.882 24.1424C228.882 24.5774 228.882 24.7949 228.882 25.2299H222.949C222.949 26.3174 223.344 26.9699 223.74 27.4049C224.333 27.8399 224.926 28.0574 225.717 28.0574C226.706 28.0574 227.498 27.8399 228.091 27.6224L228.486 29.1449C227.695 29.5799 226.706 29.7974 225.52 29.7974C224.135 29.7974 222.949 29.3624 222.158 28.4924C221.366 27.6224 220.971 26.3174 220.971 24.7949C220.971 23.2724 221.366 21.9675 222.158 21.0975C222.949 20.01 223.937 19.575 225.322 19.575C226.706 19.575 227.695 20.01 228.289 21.0975C228.684 21.75 228.882 22.8374 228.882 24.1424ZM227.102 23.4899C227.102 22.8374 226.904 22.1849 226.706 21.7499C226.311 21.0974 225.915 20.88 225.124 20.88C224.531 20.88 223.938 21.0974 223.542 21.7499C223.146 22.1849 222.949 22.8374 222.949 23.4899H227.102Z" fill="black"/>
                                      </svg>
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
                            <h2 class="heading-h2 mb-3 mb-lg-4">Transmita y viva sus sue??os</h2>
                            <h5 class="heading-h5 pr-lg-4 mb-3 mb-lg-4">MiVida es la mejor aplicaci??n de transmisi??n en vivo. Mira a los mejores talentos en vivo y en streaming.</h5>
                            <p class="text-p pr-lg-5">Desde la transmisi??n de video en vivo hasta la interacci??n en tiempo real, StreamKar le permite ver videos en vivo, transmitir su vida, chatear por video con sus amigos y hacer nuevos amigos en todo el mundo. No espere: ??nase a nosotros, transmita su vida, gane fans y haga nuevos amigos ahora.</p>
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
                            <h2 class="heading-h2 mb-3 mb-lg-4">Iniciar</h2>
                            <h5 class="heading-h5 mb-3 mb-lg-4">Inscreva-se e participe</h5>
                            <p class="text-p">Abra-se para um novo c??rculo social. Conhe??a novos amigos, participe de entretenimento sem fim, discuta a vida e muito mais.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <div class="landing-img text-right">
                            <img src="assets/images/landing-img-3.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <div class="row flex-row-reverse align-items-center pt-3">
                    <div class="col-md-6 col-lg-6">
                        <div class="comm-text-wrap pr-lg-4">
                            <h2 class="heading-h2 mb-3 mb-lg-4">Pare de deslizar, Comece a transmitir</h2>
                            <h5 class="heading-h5 mb-3 mb-lg-4">Ganhe muito transmitindo sua vida</h5>
                            <p class="text-p">Torne-se uma celebridade compartilhando sua vida com seus f??s. Seja amado pelas pessoas ao seu redor enquanto ganha a vida com o StreamKa</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <div class="landing-img">
                            <img src="assets/images/landing-img-2.jpg" alt="" />
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
                            <p>?? 2021 MiVida <span>All rights reserved.</span></p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="footer-left">
                            <p>??opyright todos los derechos reservados</p>
                            <ul class="social-link">
                                <li>
                                    <a class="tw" href="" target="_blank">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.3216 4.47333C21.4666 5.07644 20.5199 5.53772 19.518 5.83941C18.9803 5.22111 18.2656 4.78288 17.4707 4.58398C16.6758 4.38508 15.839 4.43512 15.0734 4.72731C14.3079 5.0195 13.6505 5.53976 13.1903 6.21772C12.7301 6.89568 12.4892 7.69863 12.5001 8.51798V9.41083C10.9311 9.45152 9.37628 9.10352 7.97426 8.39784C6.57223 7.69215 5.36649 6.65069 4.46443 5.36619C4.46443 5.36619 0.892996 13.4019 8.92871 16.9733C7.0899 18.2215 4.89939 18.8474 2.67871 18.759C10.7144 23.2233 20.5359 18.759 20.5359 8.49119C20.535 8.24249 20.5111 7.9944 20.4644 7.75012C21.3757 6.85145 22.0187 5.71683 22.3216 4.47333V4.47333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a class="fb" href="" target="_blank">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.2855 3.42859H13.7141C12.5774 3.42859 11.4873 3.88012 10.6836 4.68385C9.87989 5.48757 9.42836 6.57766 9.42836 7.7143V10.2857H6.85693V13.7143H9.42836V20.5714H12.8569V13.7143H15.4284L16.2855 10.2857H12.8569V7.7143C12.8569 7.48698 12.9472 7.26896 13.108 7.10821C13.2687 6.94747 13.4867 6.85716 13.7141 6.85716H16.2855V3.42859Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>                                            
                                    </a>
                                </li>
                                <li>
                                    <a class="ins" href="" target="_blank">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <mask id="path-1-inside-1" fill="white">
                                            <path d="M17.3929 4H8.46428C5.99873 4 4 5.99873 4 8.46429V17.3929C4 19.8584 5.99873 21.8571 8.46428 21.8571H17.3929C19.8584 21.8571 21.8571 19.8584 21.8571 17.3929V8.46429C21.8571 5.99873 19.8584 4 17.3929 4Z"/>
                                            <path d="M16.5 12.3661C16.6102 13.1092 16.4833 13.8681 16.1373 14.5348C15.7913 15.2016 15.2439 15.7423 14.5729 16.0801C13.9019 16.4178 13.1415 16.5354 12.3998 16.416C11.6581 16.2967 10.973 15.9465 10.4418 15.4153C9.91064 14.8841 9.56047 14.199 9.44113 13.4573C9.32179 12.7157 9.43934 11.9553 9.77708 11.2843C10.1148 10.6133 10.6555 10.0658 11.3223 9.71986C11.9891 9.37388 12.748 9.24696 13.4911 9.35714C14.249 9.46954 14.9508 9.82274 15.4926 10.3646C16.0344 10.9064 16.3876 11.6081 16.5 12.3661Z"/>
                                            <path d="M19.1786 7.57143C19.1786 8.06454 18.7788 8.46429 18.2857 8.46429C17.7926 8.46429 17.3929 8.06454 17.3929 7.57143C17.3929 7.07832 17.7926 6.67857 18.2857 6.67857C18.7788 6.67857 19.1786 7.07832 19.1786 7.57143Z"/>
                                            </mask>
                                            <path d="M16.5 12.3661L15.5108 12.5128L16.5 12.3661ZM13.4911 9.35714L13.3444 10.3463L13.4911 9.35714ZM8.46428 5H17.3929V3H8.46428V5ZM17.3929 5C19.3061 5 20.8571 6.55101 20.8571 8.46429H22.8571C22.8571 5.44644 20.4107 3 17.3929 3V5ZM20.8571 8.46429V17.3929H22.8571V8.46429H20.8571ZM20.8571 17.3929C20.8571 19.3061 19.3061 20.8571 17.3929 20.8571V22.8571C20.4107 22.8571 22.8571 20.4107 22.8571 17.3929H20.8571ZM17.3929 20.8571H8.46428V22.8571H17.3929V20.8571ZM8.46428 20.8571C6.55101 20.8571 5 19.3061 5 17.3929H3C3 20.4107 5.44644 22.8571 8.46428 22.8571V20.8571ZM5 17.3929V8.46429H3V17.3929H5ZM5 8.46429C5 6.55101 6.55101 5 8.46428 5V3C5.44644 3 3 5.44644 3 8.46429H5ZM15.5108 12.5128C15.5902 13.0478 15.4988 13.5942 15.2497 14.0743L17.0249 14.9954C17.4678 14.1419 17.6302 13.1705 17.4892 12.2194L15.5108 12.5128ZM15.2497 14.0743C15.0006 14.5544 14.6064 14.9437 14.1233 15.1868L15.0225 16.9733C15.8813 16.541 16.5821 15.8489 17.0249 14.9954L15.2497 14.0743ZM14.1233 15.1868C13.6402 15.43 13.0927 15.5146 12.5587 15.4287L12.2409 17.4033C13.1903 17.5561 14.1636 17.4056 15.0225 16.9733L14.1233 15.1868ZM12.5587 15.4287C12.0247 15.3428 11.5314 15.0907 11.1489 14.7082L9.73471 16.1224C10.4146 16.8023 11.2916 17.2506 12.2409 17.4033L12.5587 15.4287ZM11.1489 14.7082C10.7665 14.3258 10.5144 13.8325 10.4284 13.2985L8.45383 13.6162C8.60659 14.5655 9.0548 15.4425 9.73471 16.1224L11.1489 14.7082ZM10.4284 13.2985C10.3425 12.7645 10.4271 12.217 10.6703 11.7339L8.88384 10.8347C8.45154 11.6936 8.30107 12.6669 8.45383 13.6162L10.4284 13.2985ZM10.6703 11.7339C10.9135 11.2507 11.3028 10.8566 11.7829 10.6075L10.8617 8.83224C10.0083 9.27509 9.31614 9.97579 8.88384 10.8347L10.6703 11.7339ZM11.7829 10.6075C12.263 10.3584 12.8094 10.267 13.3444 10.3463L13.6378 8.36796C12.6866 8.22692 11.7152 8.38938 10.8617 8.83224L11.7829 10.6075ZM13.3444 10.3463C13.8901 10.4273 14.3954 10.6816 14.7855 11.0717L16.1997 9.65745C15.5062 8.96392 14.608 8.51183 13.6378 8.36796L13.3444 10.3463ZM14.7855 11.0717C15.1756 11.4618 15.4299 11.967 15.5108 12.5128L17.4892 12.2194C17.3453 11.2492 16.8932 10.351 16.1997 9.65745L14.7855 11.0717ZM18.1786 7.57143C18.1786 7.51226 18.2265 7.46429 18.2857 7.46429V9.46429C19.3311 9.46429 20.1786 8.61683 20.1786 7.57143H18.1786ZM18.2857 7.46429C18.3449 7.46429 18.3929 7.51226 18.3929 7.57143H16.3929C16.3929 8.61683 17.2403 9.46429 18.2857 9.46429V7.46429ZM18.3929 7.57143C18.3929 7.6306 18.3449 7.67857 18.2857 7.67857V5.67857C17.2403 5.67857 16.3929 6.52603 16.3929 7.57143H18.3929ZM18.2857 7.67857C18.2265 7.67857 18.1786 7.6306 18.1786 7.57143H20.1786C20.1786 6.52603 19.3311 5.67857 18.2857 5.67857V7.67857Z" fill="white" mask="url(#path-1-inside-1)"/>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
   
    <!-- all js  -->
    <script src="assets/js/jquery-3.5.1.min.js"></script>
    <script src="assets/js/zindagi.min.js"></script>
    <script src="assets/js/website-init.js"></script>
</body>
</html>