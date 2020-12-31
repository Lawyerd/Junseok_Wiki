var template = {
  HTML: (title, list, control, body) => {
    return ` 
      <!DOCTYPE html>
      <html lang="kr">
      
      <head>
          <meta charset="UTF-8">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
          <script src="lib/colors.js"></script>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="css/switch_style.css">
          <link rel="stylesheet" href="css/list_style.css">

          <title>JUNSEOK WIKI - ${title}</title>
      </head>
      <body>
      <div class="switch switch--2 switches" data-theme="dark">
          <label class=" switch__label" width="400">
              <input type="checkbox" class="switch__input" value="day" onclick="nightDayHandler(this);">
              <span class=" switch__design"></span>
          </label>
      </div>
      <h1><a href="/">WEB</a></h1>
      <img src="src/profile.jpg" width="400"/>
      ${list}
      ${control}
      ${body}
      </body>
      </html>
  `;
  },

  list: filelist => {
    var list = `<ol class="rounded-list">`;
    for (i in filelist) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list = list + "</ol>";
    return list;
  },

  control: (title, selectlist) => {
    var control = "";
    for (i in selectlist) {
      if (selectlist[i] === "create") {
        control += `<a href="/create">create</a><br/>`;
      }
      if (selectlist[i] === "update") {
        control += `<a href="/update?id=${title}">update</a><br/>`;
      }
      if (selectlist[i] === "delete") {
        control += `
        <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value="delete"><br/>`;
      }
    }
    return control;
  },

  createFile: (path, title) => {
    return `
      <form action=
      /${path}_process method="post">
      <p><input type="hidden" name="id" value=${title}></p>
      <p><input type="text" name="title" value=${title}></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>`;
  },
};

module.exports = template;
