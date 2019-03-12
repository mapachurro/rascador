/* Article Loading Functionality
 * ==================== */

// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current notes
  $.getJSON("/all", function(data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      $("#results").prepend("<div class='col'><div class='card'><div class='card-body'><span id='data-id' data-id=" +
        data[i]._id + ">" + "<h2 class='card-title'>" + data[i].title + "</h2>" +"<br>" +"<a class='URL' id='URL' href=" + data[i].link + "> Fuente: " + 
        data[i].link + "</a>" + "<br><h4>Comentarios</h4><div " + "id=resultados" + "><p></p></div><div id='user-input'><textarea id='note'></textarea><div id='buttons'><div id='action-button'><button id='make-new'>Guardar Comentario</button></div><button id='clear-all'>Borrar todas las Notas</button></div></div></div></div></div><br>")
  };
})
getResultados();
};

// Runs the getResults function as soon as the script is executed
getResults();


/* Note Taker (18.2.6)
 * front-end
 * ==================== */

// Loads results onto the page
function getResultados() {
  // Empty any results currently on the page
  $("#resultados").empty();
  // Grab all of the current notes
  $.getJSON("/allNotes", function(data) {
    console.log(data)
    // For each note...
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].note)
      // if (data[i].article === $("")) {
        // parent.insertBefore(el, parent.firstChild);
        resultados.innerHTML = "<p class='data-entry' data-id=" + data[i]._id + ">" + data[i].note + "</span><span class='delete'>  _X_</span></p>"
      $("#resultados").prepend("<p class='data-entry' data-id=" + data[i]._id + ">" + data[i].note + "</span><span class='delete'>  _X_</span></p>")
    // }
    };
})};

// When the #make-new button is clicked
$(document).on("click", "#make-new", function() {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      article: $("#data-id").val(),
      note: $("#note").val(),
      created: Date.now()
    }
  })

  // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
      console.log(data);
    // Add the title and delete button to the #resultados section
      $("#resultados").prepend("<p class='data-entry' data-id=" + data._id + ">" + data.note + "</span><span class='delete'>  _X_</span></p>");
      // Clear the note and title inputs on the page
      $("#note").val("");
    });
});

// When the #clear-all button is pressed
$("#clear-all").on("click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function(response) {
      $("#resultados").empty();
    }
  });
});


// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#note").val("");
      $("#title").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});

// When user click's on note title, show the note, and allow for updates
$(document).on("click", ".dataTitle", function() {
  // Grab the element
  var selected = $(this);
  // Make an ajax call to find the note
  // This uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      // Fill the inputs with the data that the ajax call collected
      $("#note").val(data.note);
      $("#title").val(data.title);
      // Make the #action-button an update button, so user can
      // Update the note s/he chooses
      $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

// When user click's update button, update the specific note
$(document).on("click", "#updater", function() {
  // Save the selected element
  var selected = $(this);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    // On successful call
    success: function(data) {
      // Clear the inputs
      $("#note").val("");
      $("#title").val("");
      // Revert action button to submit
      $("#action-button").html("<button id='make-new'>Submit</button>");
      // Grab the results from the db again, to populate the DOM
      getResultados();
    }
  });
});
