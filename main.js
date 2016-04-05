// Expecting this line in file named key.js
// var api_key = "[YOUR API KEY HERE]";
var cvurl = "https://vision.googleapis.com/v1/images:annotate?key=" + api_key;

$(document).ready(function() {
    $('form').on('submit', uploadFiles);
});

function uploadFiles(event) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening

    //Grab the file and asynchronously convert to base64.
    var file = $('#fileInput')[0].files[0];
    var reader = new FileReader()
    reader.onloadend = processFile
    reader.readAsDataURL(file);
}

function processFile(event) {
    var encodedFile = event.target.result;
    sendFiletoCloudVision(encodedFile)
}

function sendFiletoCloudVision(content) {
    var type = $("#type").val();

    // Strip out the file prefix when you convert to json.
    var json = '{' +
        ' "requests": [' +
        ' { ' +
        '   "image": {' +
        '     "content":"' + content.replace("data:image/jpeg;base64,", "") + '"' +
        '   },' +
        '   "features": [' +
        '       {' +
        '         "type": "' + type + '",' +
        '     "maxResults": 200' +
        '       }' +
        '   ]' +
        ' }' +
        ']' +
        '}';

    $.ajax({
        type: 'POST',
        url: cvurl,
        dataType: 'json',
        data: json,
        //Include headers, otherwise you get an odd 400 error.
        headers: {
            "Content-Type": "application/json",
        },

        success: function(data, textStatus, jqXHR) {
            displayJSON(data);
            displayImage(content);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus + ' ' + errorThrown);
        }
    });
}

function displayJSON(data) {
    var contents = JSON.stringify(data, null, 4);
    $("#results").html("<code><pre>" + contents + "</pre></code>");
}

function displayImage(data) {
    var contents = data;
    $("#image").attr("src", data);
    console.log("imagedispayed")
}
