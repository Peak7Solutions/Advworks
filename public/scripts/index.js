'use strict';

const url = 'http://localhost:3000/api/product';

function getAllProducts() {
    $.getJSON(url, function (response) {
        $('#products').val(JSON.stringify(response));
    })
        .done(function () {
            console.log("Success");
        })
        .fail(function (error) {
            $('#products').val(
                "Can't retrieve Products.Check Console Window " + 
                JSON.stringify(error));
          console.error(error);
        });
}
