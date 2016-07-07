// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).on('click', 'form .remove_fields', function(event){
  $(this).prev('input[type=hidden]').val('1');
  $(this).closest('fieldset').hide();
  event.preventDefault();
});

$(document).on('click', 'form .add_fields', function(event){
  time = new Date().getTime();
  regexp = new RegExp($(this).data('id'), 'g');
  $(this).before($(this).data('fields').replace(regexp, time));
  event.preventDefault();
});
