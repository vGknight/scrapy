// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");
    // $("#articles").append("<div><p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p></div>");
    $("#articles").append("<button data-id='" + data[i]._id + "' class='savearticle'>Save Article</button>");
  }
});

$(document).on("click", ".view-notes", function() {
  $('#myModal').modal('show');
  var thisId = $(this).attr("data-id");
  //ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      $("#note-title").empty();
      $("note-content").empty();
      // The title of the article
      $("#notes").append("<h2>" + data.headline + "</h2>");
      $('#note-title').append("<h5> Note for Article " + data._id + "</h5>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#add-note").attr("data-id", data._id);
      // If there's a note in the article
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#note-content").val(data.note.body);
      }
    });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


//Save Article button
$(document).on("click", ".savearticle", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/save/" + thisId

  })

    .done(function(data) {
    });

});

// Save Note Button
$(document).on("click", ".scrapearticle", function() {

  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done
    .done(function(data) {
      location.reload();

    });

});




//Delete Saved ARticle
$(document).on("click", ".delete-saved-article", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  })
    // With that done
    .done(function(data) {

      location.reload();

    });

});


$("#myForm").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        console.log("submit pushed");
        var thisId = $('#add-note').attr("data-id");

        event.preventDefault();

        var newNote = {
            body: $("#note-content").val().trim()
        };

        console.log(newNote);

        // Send the POST request.
        $.ajax("/articles/" + thisId , {
            type: "POST",
            data: newNote
        }).then(
            function() {
                console.log("note Added...");
                // Reload the page to get the updated list - this sucks
                location.reload();


            }
        );
    });





