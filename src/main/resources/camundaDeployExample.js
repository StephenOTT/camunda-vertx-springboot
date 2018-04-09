// Entry Verticle for Testing purposes
exports.vertxStart = function() {
  console.log('Camunda Deployment Example Vertx Verticle is Deployed')
}
exports.vertxStop = function() {
  console.log('Camunda Deployment Example Vertx Verticle has UnDeployed')
}

var options = {
  "worker": true
}

// vertx.deployVerticle('io.digitalstate.vertxcamunda.DeployCamunda', options) 

vertx.deployVerticle("io.digitalstate.vertxcamunda.DeployCamunda", options, function (res, res_err) {
  if (res_err == null) {
    console.log('Camunda has Deployed!!');
 
    vertx.deployVerticle('myVerticle.js')
    vertx.deployVerticle('delegate-verticle.js')
 
  } else {
    console.log("Camunda Deployment failed!");
  }
});