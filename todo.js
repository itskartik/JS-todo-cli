const fs = require("fs");
const { fileURLToPath } = require("url");
const moment = require("moment");

var todos = [];

let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

//function to add a todo

function addTodo(argument) {
  fs.appendFile("todo.txt", `${argument},`, (err) => {
    if (err) throw err;
    console.log(`Added todo: \"${argument}\"`);
  });
}

//function to show all data in reverse

function reverseTodo() {
  fs.readFile("todo.txt", "utf8", (err, data) => {
    if (err) {
      console.log("There are no pending todos!");
    } else {
      var reverse = data.split(",");
      //console.log(reverse);
      var len = reverse.length - 2;
      for (i = len; i >= 0; i--) {
        console.log(`[${i + 1}] ` + reverse[i]);
      }
    }
  });
}
//delete todo command
var deleteTodo = (command) => {
  fs.readFile("todo.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
      return;
    }
    var str = data.split(",");
    len = str.length - 2;
    if (command == 0 || command > len + 1) {
      console.log(`Error: todo #${command} does not exist. Nothing deleted.`);
    } else {
      for (i = 0; i <= str.length; i++) {
        var x = i;
        if (x + 1 == command) {
          str[i] = "";
          console.log(`Deleted todo #${command}`);
          console.log(str);
          updateTodo(str);
        }
      }
    }
  });
};
//updating the file todo
var updateTodo = (str) => {
  for (i = 0; i < str.length; i++) {
    var store = str[i];
    console.log(store);
    var data = "";
    fs.writeFile("todo.txt", data, (err) => {
      if (err) throw err;
    });
    if (store) {
      fs.appendFile("todo.txt", `${store},`, (err) => {
        if (err) throw err;
      });
    }
  }
};

//program to mark a todo item as done
var todoDone = (command) => {
  fs.readFile("todo.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
      return;
    }
    var str = data.split(",");
    len = str.length - 2;
    if (command == 0 || command > len + 1) {
      console.log(`Error: todo #${command} does not exist. Nothing deleted.`);
    } else {
      for (i = 0; i <= str.length; i++) {
        var x = i;
        if (x + 1 == command) {
          var done = str[i];
          str[i] = "";
          console.log(`Marked todo #${command} as done.`);
          console.log(str);
          updateTodo(str);
          updateDone(done);
        }
      }
    }
  });
};

//updating file done.txt
var updateDone = (done) => {
  var date = moment().format("YYYY-MM-DD");

  fs.appendFile("done.txt", `x ${date} ${done} ,`, (err) => {
    if (err) throw err;
  });
};

//report all todo
var reportTodo = () => {
  var p = fs.readFileSync("todo.txt", "utf8", (err, data) => {
    if (err) throw err;
    else {
      return data;
    }
  });
  var pcount = 0;
  var pending = p.split(",");
  for (i = 0; i < pending.length; i++) {
    if (pending[i]) {
      pcount++;
    }
  }

  var d = fs.readFileSync("done.txt", "utf8", (err, data) => {
    if (err) throw err;
    else {
      return data;
    }
  });

  var dcount = 0;
  var done = d.split(",");
  for (i = 0; i < done.length; i++) {
    if (done[i]) {
      dcount++;
    }
  }

  var date = moment().format("YYYY-MM-DD");

  console.log(`${date} Pending : ${pcount} Completed : ${dcount}`);
};

var command = process.argv[2];
var argument = process.argv[3];

switch (command) {
  case "add":
    if (!argument) {
      console.log("Error: Missing todo string. Nothing added!");
    } else {
      todos.push(argument);
      addTodo(argument);
    }
    break;
  case "ls":
    reverseTodo();
    break;
  case "del":
    if (!argument) {
      console.log("Error: Missing NUMBER for deleting todo.");
    } else {
      deleteTodo(argument);
    }
    break;
  case "done":
    if (!argument) {
      console.log("Error: Missing NUMBER for marking todo as done.");
    } else {
      todoDone(argument);
    }
    break;
  case "report":
    reportTodo();
    break;
  case undefined:
    console.log(usage);
    break;
  default:
    console.log(usage);
    break;
}
