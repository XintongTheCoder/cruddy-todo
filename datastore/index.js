const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return callback(err); // In case of error, terminate the program before writeFile
    }
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        callback(err); // throw error will terminate the program
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = () => {
  // fs.readdir(exports.dataDir, (err, filenames) => {
  //   if (err) {
  //     return callback(err);
  //   } else {
  //     let data = [];
  //     //  { id: '00001', text: '00001' },
  //     filenames.forEach((filename) => {
  //       data.push({
  //         id: filename.slice(0, -4),
  //         text: filename.slice(0, -4),
  //       });
  //     });
  //     callback(null, data);
  //   }
  // });
  return Promise.promisify(fs.readdir)(exports.dataDir)
    .catch((err) => console.error(err))
    .then((filenames) =>
      Promise.all(
        filenames.map((filename) =>
          Promise.promisify(fs.readFile)(path.join(exports.dataDir, filename))
        )
      ).then((todos) =>
        todos.map((todo, index) => ({
          id: filenames[index].slice(0, -4), // path.basename(filename, '.txt)
          text: todo.toString(),
        }))
      )
    )
    .catch((err) => console.error(err));
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {
        id: id,
        text: data.toString(),
      });
    }
  });
};

exports.update = (id, text, callback) => {
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
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
