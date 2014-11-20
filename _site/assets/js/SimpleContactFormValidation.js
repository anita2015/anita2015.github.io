var contactForm = {};

var keys = {

	contactFormAPI: 'db07f8d08ef37c13f5d51513152e388c'

}

$(document).ready(function(){

	// get ID of each input & add to contactForm object as a key with
	// a default value of 'false' (invalid) except the honeypot field

	$('#contactForm .form-control').each(function(){
	
		var ID = $(this).attr('id');
		
		if (ID === 'contactCatchya') {
			
			contactForm[ID] = true;
			
		} else {
		
			contactForm[ID] = false;
		
		}
	
	});
	
	// Whenever any form field's input value changes, check them all and update
	// the relevant form object property's value accordingly

	var currentInput;
	
	$('#contactForm .form-control').on('input', function(){
	
		currentInput = $(this).attr('id');	
		
		// If currentInput is the bot-catchin' field, it better be empty

		if ( currentInput === 'contactCatchya' ) {
		
			if ( $(this).val().length > 0 ) {
		
				contactForm[currentInput] = false;
				
				$(this).css('border-color', 'red');
				
				alert('Please leave the "code" field completely empty');
			
			} else {
			
				contactForm[currentInput] = true;
				
				$(this).css('border-color', '#70C7D2');
			
			}
		
		} else if ( currentInput === 'contactEmail' ) {

			if ( validateEmail($(this).val()) ) {

				contactForm[currentInput] = true;
				
				$(this).css('border-color', '#70C7D2');

			} else {
		
				contactForm[currentInput] = false;
					
				$(this).css('border-color', 'red');

			}

		} else if ( $(this).val() !== '' && $(this).val() !== null && $(this).val().length > 2 ) {
		
			contactForm[currentInput] = true;
				
			$(this).css('border-color', '#70C7D2');
		
		} else {
		
			contactForm[currentInput] = false;
				
			$(this).css('border-color', 'red');
		
		}

		checkInputs();
	
	});

	var checkInputs = function() {
		
		// Create an array of all contactForm input values (true/false)

		var formInputs = [];
		
		for (var input in contactForm) {
		
			formInputs.push(contactForm[input]);
		
		}
		
		// If array contains no falses, un-disable submit button

		if (jQuery.inArray(false, formInputs) === -1 ) {
		
			$('#contactForm .submit').removeAttr('disabled');
		
		} else {
			
			$('#contactForm .submit').attr('disabled', 'disabled');
		
		}		

	}
	
});

/*
 * Submit the contact form via ajax
 */
 
$('#contactForm').submit(function(){

	// check that sekrit Catchya input is empty
	if ($('#contactForm #contactCatchya').val().length > 0) {
		
		window.alert('Please empty the "code" field in the contact form');
		
	} else {

		$.ajax({
		
		  dataType: 'jsonp',
		  
		  url: 'http://getsimpleform.com/messages/ajax?form_api_token=' + keys.contactFormAPI,
		  
		  data: $('#contactForm').serialize() 
		  
		}).done(function() {
		
		  // reset and hide the form
		  $('#contactForm').slideUp(200);
		  
		  $('#contactForm .form-control').val('').css('border-color', 'silver');

		  for (field in contactForm) {
		  	if (field != "contactCatchya") {
				contactForm[field] = false;
		  	}
		  }
		  
		  // show 'thank you' message, after a moment
		  window.setTimeout(function(){
		  	$('.contact-confirmation').fadeIn(300);
		  }, 300);
		  
		});
	
	}
	
	return false; // stops the form from submitting in the default way

});

/*
 * Make the 're-show form' link work
 */
 
$('.contact-confirmation a').click(function(){

	$('.contact-confirmation').hide();

	$('#contactForm').slideDown(200);

	return false;

});

/*
 * RegExp for email validation
 */

var validateEmail = function(email) { 

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);

};