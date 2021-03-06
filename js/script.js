
/* ROBOKASSA PAYMENTS */ 
/* Robokassa payment setup */

var merchantLogin = "po-sochi";
var merchantPass1 = "qwerty12345";
var payNowPrice = "799"; // amount to pay now
var payLaterPrice = "999"; // amount to pay later
var orderId = "0"; // order ID = 0 if you want to generate new order
/* End robokassa payment setup */

//var formSpreeURL = "//formspree.io/hichnik@gmail.com";
// debug email

var formSpreeURL = "//formspree.io/info@po-sochi.ru";
/* */ 

function sendAjaxToEmail( formID ) {
  var formData = $( formID ).serialize();
    $.ajax({
      url: formSpreeURL, 
      // url: "//formspree.io/hichnik@gmail.com", 
      method: "POST",
      data: formData,
      dataType: "json"
    });
  // console.log("data sent")
}


function generateRoboLink(name, phone, email, quantity) {
  var roboLink = "https://auth.robokassa.ru/Merchant/Index.aspx";
 // https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=demo
 // &OutSum=11&InvoiceID=0
 // &Description=Покупка в демо магазине
 // &SignatureValue=$crc
 //
  var outSum = payNowPrice * quantity;


 roboLink += "?MerchantLogin=" + merchantLogin;
 roboLink += "&OutSum=" + outSum;
 roboLink += "&SignatureValue=" + generateHash(merchantLogin, outSum, orderId, merchantPass1);
 roboLink += "&Description=" + 'Покупка ' + name + " (" + phone + "/" +
             email + ") " + quantity + " билетов";
 

 return roboLink;
}

function generateHash(merchantLogin, outSum, orderId, merchantPass1) {
  /*
  //po-sochi:10:0:po-sochipass1 only if exist orderid param
  var stringValue = merchantLogin + ":" + outSum + ":" + orderId + ":" + merchantPass1;
  */
  /* We do now have one so ... */
  var stringValue = merchantLogin + ":" + outSum + "::" + merchantPass1;
  
  return md5( stringValue );
}

/* END ROBOKASSA PAYMENTS */ 

var duration = 600;
var visible_popup = '';
var document_scroll;

function stopPropagation(e) {
  var event = e || window.event;
  event.stopPropagation();
} 

function trim(string){
  return string.replace(/(^\s+)|(\s+$)/g, "");
}


function initPopup(popup){
    var close = popup.find('.close');
    close.click(hidePopup);
    $('#back').click(hidePopup);

    $('.popup_holder').hide().removeClass('none');
    $(popup).hide().removeClass('none');
}

function hidePopup(){
    $('.popup_holder').fadeOut(duration,function(){
        $('.popup.act').removeClass('act').hide();
        
        $('body').removeClass('body_popup');
        
    });
}

function showPopup(popup){

    if ( $(popup).hasClass('act') ) return;

    if( $('body').hasClass('body_popup') ){
        // we have active popup
        $('.popup.act')
            .fadeOut(duration,function(){
                $(popup).fadeIn(duration);
                $(popup).addClass('act');
            })
            .removeClass('act');
    } else {

        $('body').addClass('body_popup');

        $(popup).show().addClass('act');
        $('.popup_holder').stop(1,1).fadeIn(duration);
    }
}

function updateFreePlaces() {
  var $freePlaces = $(document).find(".bus__place.free")
  //console.log( $("#leftplaces").text( $freePlaces.length ) )
  $("#leftplaces").text( $freePlaces.length )
}

function placeOrder() {
  var $freePlace = $(document).find(".bus__place.free")
  $($freePlace[0]).removeClass("free").addClass("ocupped")

  updateFreePlaces()
}

$(document).on('ready', function() {

  // reviews init
  $('.bxslider').bxSlider()

  $('.mfp-open-bottom').magnificPopup({
    type:'inline',
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  $('.mfp-open-order').magnificPopup({
    type:'inline',
    midClick: true 
  });

  $('.mfp-open-callback').magnificPopup({
    type:'inline',
    midClick: true 
  });


  $('.mfp-open-thanks').magnificPopup({
    type:'inline',
    midClick: true 
  });

  // if ( $('.popup').length ){
  //   $('.popup').each(function( index, item ) {
        
  //       initPopup($(item))

  //   })
    
  //   if( visible_popup.length ) {
  //     showPopup($('.'+visible_popup));
  //   }

  //   $('[data-popup]').click(function(e){
  //           e.preventDefault();
  //           var popup_class = $(this).data('popup');
  //           showPopup($('.'+popup_class));
  //   });
  // }
  function isPositiveInt(n){
    return Number(n)===n && n%1===0 && n > 0;
  }


  $('.button__callback').on('click',function() {

    sendAjaxToEmail("#form__callback")
/*    var formData = $("#form__callback").serialize()
    
    $.ajax({
      url: "//formspree.io/info@po-sochi.ru", 
      // url: "//formspree.io/hichnik@gmail.com", 
      method: "POST",
      data: formData,
      dataType: "json"
    });
  
*/ 
  /*  $.magnificPopup.close()
      console.log("send data")
   */
   
 })

 $('.button__close').on('click',function(){
  // console.log("close window");
  $.magnificPopup.close();
 }) 

  $('.viewall').on('click', function() {
    
    if ( $('.promo__all').hasClass('hidden_promo') ) {
      $('.viewall').text('Спрятать')
    } else {
      $('.viewall').text('Посмотреть все')
    }

    $('.promo__all').toggleClass('hidden_promo')

  })
  
  $('.popup__quantity').on('keyup', function(){
    
    var value = parseInt($('.popup__quantity').val(),10)
    
    if ( isPositiveInt(value) ) {
      
      var nowSum = 799 * value
      var laterSum = 999 * value
      $(".sum__paynow").text( nowSum )
      $(".sum__paylater").text( laterSum )
      // console.log( value )
    
    } 
    
  })

  $("#robokassa__paynow").on('click', function(){
    var name = $('.order__name').val(),
        phone = $('.order__phone').val(),
        email = $('.order__email').val(),
        quantity = $('.order__quantity').val(),
        roboLink = "";

    // $mrh_login:$out_summ:$inv_id:$mrh_pass1
    // po-sochi:10:0:po-sochipass1
    // http://robokassa.ru/ru/Doc/Ru/Interface.aspx#rabota_s_testovim_serverom
    // Документация по ссылке выше
    // console.log( md5('po-sochi:100:0:posochi1') );
      $('.order__total').val(payNowPrice * quantity);

      var descriptionValue = "Оплата:  " + name +
          " ( " + phone + " / " + email + " ) " +
          quantity + " билетов";

      $('.order__description').val(descriptionValue);
      sendAjaxToEmail("#order__form");
      
      roboLink = generateRoboLink(name, phone, email, quantity);
      $('.robokassa__paynow').attr('href', roboLink);
      // console.log( roboLink );

  })

  $('#pay__later_thanks').on('click', function(e){
    console.log("pay thanks open thanks");
  });

  function showWarning(content) {
    $('#pay__warning').html(content);
    $('#pay__warning').addClass('show');
  }

  function hideWarning() {
    $('#pay__warning').removeClass('show');
  }

  $('.order__name').on('focus', function(e){
    hideWarning();
  });
  
  $('.order__phone').on('focus', function(e){
    hideWarning();
  });
  
  $('.order__email').on('focus', function(e){
    hideWarning();
  });


  $('#pay__later').on('click', function(e){


    var name = $('.order__name').val(),
        phone = $('.order__phone').val(),
        email = $('.order__email').val(),
        quantity = $('.order__quantity').val();
        
      if (name.length === 0) {
        showWarning("Поле имя должно быть заполнено");
        return false;
      };

      if (phone.length === 0) {
        showWarning("Поле телефон должно быть заполнено");
        return false;
      };

      if (email.length < 5 || email.indexOf('@') === -1 ) {
        showWarning("Поле email должно быть заполнено");
        return false;
      };

      $('.order__total').val(payLaterPrice * quantity);
      var descriptionValue = "Оплата завтра:  " + name +
          " ( " + phone + " / " + email + " ) " +
          quantity + " билетов";
      $('.order__description').val(descriptionValue);
    
      sendAjaxToEmail("#order__form");

      $.magnificPopup.instance.currItem.src = "#popup_thanks";
      $.magnificPopup.instance.updateItemHTML();
      return false;

  });


// Funny client Placement ... :-)
  updateFreePlaces()
  
  setTimeout(function() { 
    placeOrder()
  }, 5000);
  
  setTimeout(function() {
    placeOrder()
  }, 7000);
  


})
