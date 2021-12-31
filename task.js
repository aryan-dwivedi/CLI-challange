var fs = require("fs");

let items = [];
let completed = [];

let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

if (!fs.existsSync(`${__dirname}/items.json`)) {
  fs.writeFileSync(`${__dirname}/items.json`, JSON.stringify(items));
  fs.writeFileSync(`${__dirname}/completed.json`, JSON.stringify(completed));
}
const items_data = fs.readFileSync(`${__dirname}/items.json`);
const completed_data = fs.readFileSync(`${__dirname}/completed.json`);
items = JSON.parse(items_data);
completed = JSON.parse(completed_data);

function printItems() {
  let index = 1;
  if (items.length == 0) {
    console.log(`There are no pending tasks!`);
  } else {
    items.forEach((item) => {
      console.log(`${index++}. ${item.task} [${item.priority}]`);
    });
  }
}

function printPendingItems() {
  items.sort((a, b) => {
    return a.priority - b.priority;
  });
  let index = 1;
  console.log(
    `Pending : ${
      items.filter((item) => {
        return !item.completed;
      }).length
    }`
  );
  items.forEach((item) => {
    console.log(`${index++}. ${item.task} [${item.priority}]`);
  });
}

function printCompletedItems() {
  completed.sort((a, b) => {
    return a.priority - b.priority;
  });
  let index = 1;
  console.log(`Completed : ${completed.length}`);
  completed.forEach((item) => {
    console.log(`${index++}. ${item.task}`);
  });
}

if (process.argv[2] === undefined || process.argv[2] === "help") {
  console.log(usage);
} else if (process.argv[2] === "add") {
  let task = process.argv[4];
  let priority = process.argv[3];
  let item = {
    task: task,
    priority: priority,
  };

  if (task === undefined || priority === undefined) {
    console.log("Error: Missing tasks string. Nothing added!");
  } else {
    items.push(item);
    items.sort((a, b) => {
      return a.priority - b.priority;
    });
    fs.writeFileSync(`${__dirname}/items.json`, JSON.stringify(items));
    console.log(`Added task: "${task}" with priority ${priority}`);
  }
} else if (process.argv[2] === "ls") {
  printItems();
} else if (process.argv[2] === "done") {
  let index = process.argv[3];

  if (index === undefined) {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else if (index <= 0 || index > items.length) {
    console.log(`Error: no incomplete item with index #${index} exists.`);
  } else {
    let completedItem = items[index - 1];
    items.splice(index - 1, 1);
    completed.push(completedItem);
    fs.writeFileSync("./items.json", JSON.stringify(items));
    fs.writeFileSync("./completed.json", JSON.stringify(completed));
    console.log(`Marked item as done.`);
  }
} else if (process.argv[2] === "del") {
  let index = process.argv[3];

  if (index === undefined) {
    console.log("Error: Missing NUMBER for deleting tasks.");
  } else if (index <= 0 || index > items.length) {
    console.log(
      `Error: task with index #${index} does not exist. Nothing deleted.`
    );
  } else {
    items.splice(index - 1, 1);
    console.log(`Deleted task #${index}`);
  }
} else if (process.argv[2] === "report") {
  printPendingItems();
  printCompletedItems();
}
