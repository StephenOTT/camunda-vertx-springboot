exports.vertxStart = function() {
  console.log('Camunda Delegate Verticle has Deployed')
}
exports.vertxStop = function() {
  console.log('Camunda Delegate Verticle has UnDeployed')
}

var eb = vertx.eventBus()
console.log(eb)

var consumer = eb.consumer("someAction")
consumer.handler(function (message) {
  console.log("I have received a message: " + message.body())
  console.log(message.headers().get('DelegateExecution'))
  message.reply("how interesting!")
})