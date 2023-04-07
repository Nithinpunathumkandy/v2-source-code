$(document).ready(function () {
  $('[data-toggle="tab"]').tooltip({
    trigger: 'hover',
    placement: 'top',
    animate: true,
    delay: 100,
    container: 'body'
  });


});





// Scroll Top
$(window).scroll(function () {
  if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
    $('#return-to-top').fadeIn(200);    // Fade in the arrow
  } else {
    $('#return-to-top').fadeOut(200);   // Else fade out the arrow
  }
});
$('#return-to-top').click(function () {      // When arrow is clicked

  alert(1)
  $('body,html').animate({
    scrollTop: 0                       // Scroll to top of body
  }, 500);

});













$("#menu-close").click(function (e) {
  e.stopPropagation();
  $("#sidebar-wrapper").toggleClass("active");
});
$("#menu-toggle").click(function (e) {
  e.stopPropagation();
  $("#sidebar-wrapper").toggleClass("active");
});

$("main").click(function () {
  if ($("#sidebar-wrapper").hasClass('active')) {
    $("#sidebar-wrapper").removeClass("active");
  }
});


function setup() {
  document.getElementById('buttonid').addEventListener('click', openDialog);
  function openDialog() {
    document.getElementById('fileid').click();
  }
  document.getElementById('fileid').addEventListener('change', submitForm);
  function submitForm() {
    document.getElementById('formid').submit();
  }
}




$("#message-toggle").click(function (e) {
  e.stopPropagation();
  $("#sidebar-wrapper2").toggleClass("active");
});

$("main").click(function () {
  if ($("#sidebar-wrapper2").hasClass('active')) {
    $("#sidebar-wrapper2").removeClass("active");
  }
});

$(".chat-box-close").click(function () {
  $("#sidebar-wrapper2").removeClass("active");

});

$(document).ready(function () {
  $(".chat-box-full-screen").click(function () {
    $("#sidebar-wrapper2").toggleClass("chat-box-full-screen");
  });
  $('.chat-box-close').click(function () {
    $('#sidebar-wrapper2').removeClass('chat-box-full-screen');
  });
});

$('.chat-box-full-screen').click(function () {
  $('.full-screen-icone').toggle();
  $('.smoal-screen-icone').toggle();
});


$(document).ready(function () {

  $(".main-menu").hover(function () {

    $("#sidebar-wrapper-menu").addClass("active");
  });

});


$(".sidebar-menu-toggle").click(function (e) {
  e.preventDefault();
  $("#sidebar-wrapper-menu").toggleClass("active");
});



$('.toggle-menu').click(function () {
  $(this).toggleClass('open');
  $("#sidebar-wrapper-menu").toggleClass("active");
});
$('.toggle-menujj').hover(function () {
  $(this).toggleClass('open');
  $("#sidebar-wrapper-menu").toggleClass("active");
});


$("main").hover(function () {
  $('.toggle-menu').removeClass('open');
  $("#sidebar-wrapper-menu").removeClass("active");
});





var moveForce = 30; // max popup movement in pixels
var rotateForce = 20; // max popup rotation in deg

$(document).mousemove(function (e) {
  var docX = $(document).width();
  var docY = $(document).height();

  var moveX = (e.pageX - docX / 2) / (docX / 2) * -moveForce;
  var moveY = (e.pageY - docY / 2) / (docY / 2) * -moveForce;

  var rotateY = (e.pageX / docX * rotateForce * 2) - rotateForce;
  var rotateX = -((e.pageY / docY * rotateForce * 2) - rotateForce);

  $('.popup')
    .css('left', moveX + 'px')
    .css('top', moveY + 'px')
    .css('transform', 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
});

$("html").mouseover(function () {
  $("html").getNiceScroll().resize();
});

$(document).ready(function () {
  $(".bpm-det").click(function () {
    $(".arrowlist").hide();
    $(".back-popup").show();

  });
  $(".bpm-close").click(function () {
    $(".arrowlist").show();
    $(".back-popup").hide();
  });
});

// Mouse pointer

$(document)
  .mousemove(function (e) {
    $('.cursor')
      .eq(0)
      .css({
        left: e.clientX,
        top: e.clientY
      });
    setTimeout(function () {
      $('.cursor')
        .eq(1)
        .css({
          left: e.clientX,
          top: e.clientY
        });
    }, 100);
  })




// particle

function Particle(x, y, radius) {
  this.init(x, y, radius);
}

Particle.prototype = {

  init: function (x, y, radius) {

    this.alive = true;

    this.radius = radius || 10;
    this.wander = 0.15;
    this.theta = random(TWO_PI);
    this.drag = 0.92;
    this.color = '#fff';

    this.x = x || 0.0;
    this.y = y || 0.0;

    this.vx = 0.0;
    this.vy = 0.0;
  },

  move: function () {

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.drag;
    this.vy *= this.drag;

    this.theta += random(-0.5, 0.5) * this.wander;
    this.vx += sin(this.theta) * 0.1;
    this.vy += cos(this.theta) * 0.1;

    this.radius *= 0.96;
    this.alive = this.radius > 0.5;
  },

  draw: function (ctx) {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};


$(document).ready(function () {

  
});



//arrow accordian

$('.panel-collapse').on('show.bs.collapse', function () {
  $(this).siblings('.panel-heading').addClass('active');
});

$('.panel-collapse').on('hide.bs.collapse', function () {
  $(this).siblings('.panel-heading').removeClass('active');
});

// Nice Scroll

$(document).ready(function () {

  var nice = $("html").niceScroll();  // The document page (body)
  $("body").niceScroll();

















});


// sidebar-toggle Start

//$(document).ready(function(){
//$(".curve-toggle").click(function(){

//$(".user-side-bar").toggle();

//$( ".user-right-details").addClass("flex-100");
//$(".side-bar-round").show();

//});
//$(".side-bar-round").click(function(){
// $(this).hide();

//$(".user-side-bar").toggle();

//$( ".user-right-details").removeClass("flex-100");
// });
//});
// sidebar-toggle Tend





(function ($) {
  $.fn.fixMe = function () {
    return this.each(function () {
      var $this = $(this),
        $t_fixed;
      function init() {
        $this.wrap('<div class="fix-table" />');
        $t_fixed = $this.clone();
        $t_fixed.find("tbody").remove().end().addClass("fixed-table").insertBefore($this);
        resizeFixed();
      }
      function resizeFixed() {
        $t_fixed.find("th").each(function (index) {
          // $(this).css("width",$this.find("th").eq(index).outerWidth()+"px");
        });
      }
      function scrollFixed() {
        var offset = $(this).scrollTop(),
          tableOffsetTop = $this.offset().top,
          tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
        if (offset < tableOffsetTop || offset > tableOffsetBottom)
          $t_fixed.hide();
        else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $t_fixed.is(":hidden"))
          $t_fixed.show();
      }
      $(window).resize(resizeFixed);
      $(window).scroll(scrollFixed);
      init();
    });
  };
})(jQuery);

$(document).ready(function () {
  $("table").fixMe();
  $(".up").click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 2000);
  });
});



// Model on loading


$(window).on('load', function () {
  $('#welcome-screen').modal('show');
});





// multi step form page starts 

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  if (x[n]) x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
  } else {
    if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    if (document.getElementById("nextBtn")) document.getElementById("nextBtn").innerHTML = "Save";
  } else {
    if (document.getElementById("nextBtn")) document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:

  // if (n == 1 && !validateForm()) return false;

  document.getElementsByClassName("step")[currentTab].className += " finish";

  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");

  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  if (x[n]) x[n].className += " active";
}

// multi step form page ends


$(document).ready(function () {
  var button = document.getElementById('hamburger-menu'),
    span = button ? button.getElementsByTagName('span')[0] : null;

  if (button)
    button.onclick = function () {
      if (button) span.classList.toggle('hamburger-menu-button-close');
    };

  $('#hamburger-menu').on('click', toggleOnClass);

  function toggleOnClass(event) {
    var toggleElementId = '#' + $(this).data('toggle'),
      element = $(toggleElementId);

    element.toggleClass('on');

  }

  // close hamburger menu after click a
  $('.menu li a').on("click", function () {
    $('#hamburger-menu').click();
  });
});





var rtl_direction = $('body').attr('dir');

var footer = $('.footer-news');
var footer_scroll = footer.niceScroll(
  {
    cursorcolor: "#0085c9",
    cursorwidth: "12px",
    cursoropacitymin: 1,
    cursorborder: 'none',

  }
);
if (footer_scroll.cursor)
  footer_scroll.cursor.parent().css({
    'background-color': '#b4c2ce',
    'border-radius': '5px',
    'padding': '1px 0px'
  });

if (rtl_direction) {
  setTimeout(function () {
    footer_scroll.cursor.parent().css({
      'left': footer.offset().left
    });
  }, 1000);

  footer_scroll.cursor.parent().css({
    'left': footer.offset().left
  });
  $(window).resize(function () {
    setTimeout(function () {
      footer_scroll.cursor.parent().css({
        'left': footer.offset().left
      });
    }, 100);
  });
}



// user-hover-popup starts 

$(window).on('load',function(){
  $('#welcome-screen').modal('show');
});

$('.rounde-hov').on('mouseover',function(e){
// this.preventDefault();
// console.log("hel");
var pop = $(this).closest('.rounde-hov-bg').find('.user-dtl-popup');

if(pop.hasClass('box-user-dtl-new')){
pop.removeClass("box-user-dtl-new");
}
setTimeout(function() {
if(pop.hasClass('box-user-dtl-new')){
}else{
  pop.show();
}
}, 700);
})

$('.rounde-hov').on('mouseleave',function(e){
var popp = $(this).closest('.rounde-hov-bg').find('.user-dtl-popup');
popp.addClass("box-user-dtl-new");
popp.hide();
})

$('.user-dtl-popup').on('mouseover',function(){
 $(this).show(); 

    var prevClass = $(this).data('user-dtl-class');

    var userImageDiv = $(this).closest('.owl-vertical-slider').find(prevClass);

})
$('.user-dtl-popup').on('mouseleave',function(){
 $(this).hide(); 
})

$('.ni-new-dtl').on('mouseleave',function(e){

    var test = $(this).data('user-dtl-class');
    var niPopUp = $(this).closest('.owl-vertical-slider').find(test);

   niPopUp.addClass("box-user-dtl-new-owl-slider");
    niPopUp.hide();
})
$('body').on('mouseover','.ni-new-dtl',function(){

var test = $(this).data('user-dtl-class');

var niTest =   $(this).closest('.owl-vertical-slider').find(test);

if(niTest.hasClass('box-user-dtl-new-owl-slider')){
niTest.removeClass("box-user-dtl-new-owl-slider");
}
 
 // $('.owl-verticaslider').closest(test);

 
 console.log(niTest);

console.log("position",$(this).position());

 console.log("offset",$(this).offset());

var positions = $(this).offset();

         var windowHeight = $(window).outerHeight();
         var windowWidth = $(window).outerWidth();
         var iconPosition = $(this).offset();
         var boxHeight = $(test).outerHeight();
         var boxWidth = $(test).outerWidth();
         var top = iconPosition.top - 20;
         var left = iconPosition.left;
         if (windowWidth <= left + boxWidth) {
            left = left - boxWidth + 50;
         }
         if (windowHeight <= top + boxHeight) {
            top= iconPosition.top - boxHeight - 5;
         }

         // alert("hel");s

         console.log("tot",top,"left",left);


         console.log("win he",windowHeight, "win wi",windowWidth);



         if (windowWidth <= left + boxWidth) {
            left = left - boxWidth + 50;
         }
         var niTop =  positions.top  + 50 - $(window).scrollTop();


         var niLeft =  positions.left  + 10 ;  //- windowWidth ;
         console.log("nitop ",niTop,"niLeft",niLeft);

       console.log("we",windowWidth, 'che',(positions.left + boxWidth + 50 ))
         if((positions.left + boxWidth + 50 )> windowWidth){
      
          console.log("first if");
          niLeft = positions.left - boxWidth + 55;

          if(niTest.hasClass('user-dtl-popup-right')){

          }else{

           niTest.addClass('user-dtl-popup-right')  
          
         }
       }
          if(windowWidth >= (positions.left + boxWidth + 50)){
            console.log("woring if condition");
           niLeft =  positions.left + 10; 

           if(niTest.hasClass('user-dtl-popup-right')){
                  console.log("yes im inside");
           niTest.removeClass('user-dtl-popup-right');
          }
           }
         

         if((positions.left + boxWidth > windowWidth) && ( positions.left - boxWidth < 0)){

          // nitop = (windowHeight/2) + (boxHeight/2);
          // niLeft = (windowWidth/2) -  (boxWidth/2);


         }else{
          niTest[0].style.setProperty( 'left', niLeft +'px', 'important' );

         niTest[0].style.setProperty( 'top', niTop + 'px', 'important' );
         }
         // if(positions.left - bo)

console.log("nitop ",niTop,"niLeft",niLeft);
         // niTest.css({
         //   // 'top':  niTop , // - 150,
         //   // 'left': niLeft  //- 1580
         //   });

console.log("nitest ",niTest);
         
         // niTest[0].style.setProperty( 'left', niLeft, 'important' );
         // $(niTest).style.setProperty('left', niLeft, 'important');
         // $(niTest).css("cssText", "left:" +  niLeft + " !important;");
         // $(test).offset

setTimeout(function() {

 if(niTest.hasClass('box-user-dtl-new-owl-slider')){
}else{
  $(niTest).show();
}


},700);
// alert($(this).data('user-dtl-class'));
})

// user-hover-popup ends 








