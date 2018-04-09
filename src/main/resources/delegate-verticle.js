exports.vertxStart = function() {
  console.log('Camunda Delegate Verticle has Deployed')
}
exports.vertxStop = function() {
  console.log('Camunda Delegate Verticle has UnDeployed')
}


var eb = vertx.eventBus();
console.log(eb)

var consumer = eb.consumer("someAction");
consumer.handler(function (message) {
  console.log("I have received a message: " + message.body());
  message.reply("how interesting!");
});