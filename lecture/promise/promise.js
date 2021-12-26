const promise1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('Resolved promise1');
  }, 1000);
  // reject('Rejected promise1');
});
const promise2 = new Promise(function (resolve, reject) {
  // resolve('Resolved promise2');
  setTimeout(function () {
    reject('Rejected promise2');
  }, 3000);
});
Promise.all([promise1, promise2])
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.error(error);
  });
