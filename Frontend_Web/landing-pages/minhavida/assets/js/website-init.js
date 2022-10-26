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
  $(".birthdate input").focus(function() {
      $('.m-d-y-wrap').toggleClass('fieldshow'); 
      $('.birthdate').hide();             
      //return false;
  });
    
//  $('.tax-wrap input').blur(function(){
//     if( !$(this).val() ) {
//           $('.hide-tax').show('slow');
//     }
// });
});
//end