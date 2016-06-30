// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

//= require manager/firebase
//= require gentelella/custom.min

/*function getIt(url){
	$.ajax({
      type: "GET",
      url: url,
      success:(data) ->
        alert data.farms.length
        return false
      error:(data) ->
        return false
    })
}

function postIt(url, payload){
	$.ajax({
      type: "POST",
      url: url,
      data: payload,
      success:(data) ->
        alert data.farms.length
        return false
      error:(data) ->
        return false
    })
}
*/
$(document).on("ready", function(){
  //$("#map-view").hide();

  function showMap(){
    $("#map-view").show();
  }
})
