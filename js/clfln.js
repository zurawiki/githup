var request = require('request');
var cheerio = require('cheerio');
var my_http = require("http");


var data = [];

var url = 'http://www.commitlogsfromlastnight.com/';
request(url, function (err, resp, body) {
    if (err) {
        throw err;
    }
    $ = cheerio.load(body);

    $('tr').each(function (i, item) {

        var urlSplit = $(this).find('.avatarlink').attr('href').split('/');
        var author = {
            username: urlSplit[urlSplit.length - 1],
            url: $(this).find('.avatarlink').attr('href'),
            imageUrl: $(this).find('.avatar').attr('src')};
        var date = $(this).find('.date').text();
        var message = $(this).find('.commit').text();
        var url = $(this).find('.commit').attr('href');

        var commit = {
            author: author,
            date: date,
            message: message,
            url: url
        }
        data[i] = commit;


    });
    console.log("// Pulled %d commits", data.length);

    var jsonData = JSON.stringify(data);


    my_http.createServer(function (request, response) {
        console.log("%s - %s %s", new Date(), request.method, request.url);
        if (request.url === '/githup') {
            response.writeHeader(200,
                {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
            response.write(jsonData);
            response.end();
        }
        else {
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    }).listen(9080);
    console.log("Server Running on 9080, access API at /githup");
});

