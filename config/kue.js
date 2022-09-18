const kue = require('kue');
const queue = kue.createQueue();
queue.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});
module.exports = queue;
