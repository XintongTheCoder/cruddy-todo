const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
const writeTodo = (id, text, callback) => {
  fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
    if (err) {
      throw 'Failed to write todo';
    } else {
      callback(null, { id, text });
    }
  });
};

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, id) => {
    writeTodo(id, text, callback);
  });
};

const readTodos = (callback) => {
  fs.readdir(exports.dataDir, (err, filenames) => {
    if (err) {
      throw 'Failed to read todos';
    } else {
      let data = [];
      //  { id: '00001', text: '00001' },
      filenames.forEach((filename) => {
        data.push({
          id: filename.slice(0, -4),
          text: filename.slice(0, -4),
        });
      });
      callback(null, data);
    }
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  readTodos(callback);
};

const readTodo = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // { id, text: todoText }
      callback(null, {
        id: id,
        text: data.toString(),
      });
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  readTodo(id, callback);
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  fs.exists(path.join(exports.dataDir, `${id}.txt`), (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error('Failed to write file'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  fs.exists(path.join(exports.dataDir, `${id}.txt`), (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(new Error('Failed to delete file'));
        } else {
          console.log('Deleted!');
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
