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
// Whenever someone clicks a p tag
$(document).on("click", ".view-notes", function() {
  // Empty the notes from the note section
  // $("#myModal").empty();


  $('#myModal').modal('show');
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
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

      // $("#notes").append("<h2>" + data.headline + "</h2>");

      $('#note-title').append("<h5> Note for Article " + data._id + "</h5>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      $("#add-note").attr("data-id", data._id);
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#note-content").val(data.note.body);
      }
    });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// When you click the savenote button
$(document).on("click", ".savearticle", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/save/" + thisId
    // data: {
    //   // Value taken from title input
    //   title: $("#titleinput").val(),
    //   // Value taken from note textarea
    //   body: $("#bodyinput").val()
    // }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      // $("#notes").empty();
    });
  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});

// When you click the savenote button
$(document).on("click", ".scrapearticle", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/scrape"
    // data: {
    //   // Value taken from title input
    //   title: $("#titleinput").val(),
    //   // Value taken from note textarea
    //   body: $("#bodyinput").val()
    // }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      location.reload();
      // Empty the notes section
      // $("#notes").empty();
    });
  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});




// When you click the savenote button
$(document).on("click", ".delete-saved-article", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  })
    // With that done
    .done(function(data) {
      // Log the response
      location.reload();
      // Empty the notes section
      // $("#notes").empty();
    });
  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});

// myForm

$("#myForm").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        console.log("submit pushed");
        var thisId = $('#add-note').attr("data-id");
        console.log(thisId);
        alert(thisId);

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





