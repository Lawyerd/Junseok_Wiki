var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");
var template = require("./lib/template.js");

var app = http.createServer((request, response) => {
  var _url = request.url;
  var pathname = url.parse(_url, true).pathname;
  var queryData = url.parse(_url, true).query;
  var path = url.parse(_url).path;

  if (pathname === "/") {
    fs.readdir(`data`, "utf-8", (err, filelist) => {
      fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
        console.log(url.parse(_url));
        var title = queryData.id;
        var list = template.list(filelist);
        var description = data;
        var control = template.control(title, ["create", "delete", "update"]);
        if (path === "/") {
          title = "Main";
          description = "Hello";
          control = template.control(title, ["create"]);
        }
        var HTML = template.HTML(
          title,
          list,
          control,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(HTML);
      });
    });
  } else if (pathname === "/create") {
    fs.readdir("./data", "utf-8", function (error, filelist) {
      var list = template.list(filelist);
      var title = "Web - Create";
      var description = template.createFile("create", "title");
      var control = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
      var HTML = template.HTML(
        title,
        list,
        control,
        `<h2>${title}</h2>${description}`
      );
      response.writeHead(200); // 정상적으로 작동한 것
      response.end(HTML); // response.end(fs.readFileSync(__dirname + url)); // 노드 js가 경로에 있는 파일을 가져온다. 그리고 그 값을 response.end()안에다가 위치시킨다.
      // ==> '사용자에게 전송할 데이터를 생성한다'는 것이 node.js가 갖고있는 힘이다.
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        console.log(title);
        console.log(qs.escape(title));
        response.writeHead(302, { Location: `/?id=${qs.escape(title)}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", "utf-8", function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, data) {
        var title = queryData.id;
        var list = template.list(filelist);
        var description = template.createFile("update", title);
        var control = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
        var HTML = template.HTML(
          `${title} update`,
          list,
          control,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200); // 정상적으로 작동한 것
        response.end(HTML); // response.end(fs.readFileSync(__dirname + url)); // 노드 js가 경로에 있는 파일을 가져온다. 그리고 그 값을 response.end()안에다가 위치시킨다.
        // ==> '사용자에게 전송할 데이터를 생성한다'는 것이 node.js가 갖고있는 힘이다.
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${qs.escape(title)}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);
