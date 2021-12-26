class CustomPromise {
  state;
  returnValue;
  parentPromise;
  _then;

  resolve = (returnValue) => {
    this.state = 'resolved';
    this.returnValue = returnValue;
    if (this._then) {
      this._then(this.returnValue);
      this.state = 'done';
    }
    return this;
  };

  then = (callBack) => {
    this._then = callBack;
    if (this.state === 'resolved') {
      this._then(this.returnValue);
    }
  };

  reject = (returnValue) => {
    this.state = 'rejected';
    this.returnValue = returnValue;
    this.parentPromise && this.parentPromise.catch(this.parentPromise._catch);
    return this;
  };

  constructor(callback) {
    callback && callback(this.resolve, this.reject);
  }
}

new CustomPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve('Resolved promise1');
  }, 10000);
  // reject('Rejected promise1');
}).then(function (r) {
  console.log(r);
});

// const promises = [];
// promises[0] = new CustomPromise(function (resolve, reject) {
//   // resolve('Resolved promise1');
//   reject('Rejected promise1');
// });
// promises[1] = new CustomPromise(function (resolve, reject) {
//   // resolve('Resolved promise2');
//   reject('Rejected promise2');
// });
// CustomPromise.all(promises)
//   .then(function (result) {
//     console.log(result);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
