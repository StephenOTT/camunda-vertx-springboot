// vertxStart and vertxStop are functions that are automatically 
// called when the verticle is Deployed and UnDeployed
exports.vertxStart = function() {
  console.log('Primary Javascript Vertx Verticle is Deployed')
}
exports.vertxStop = function() {
  console.log('Primary Javascript Vertx Verticle has UnDeployed')
}

// @TODO Replace to Require() at some point
load('classpath:camunda-services.js')

// See the following for other services you can access:
// Engine Services: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/org/camunda/bpm/engine/ProcessEngineServices.html

// Setup the Vertx Web Router
var Router = require("vertx-web-js/router")

// Create a Vertx HTTP Server and set the router for the server
var server = vertx.createHttpServer()
var router = Router.router(vertx)

// Setup a /my-deployments route:
router.route('/my-deployments').handler(function (routingContext) {
  var response = routingContext.response();
  
  response.putHeader("content-type", "application/json");
  
  // Runs a Deployment Query in the repositoryService
  var deploymentList = repositoryService.createDeploymentQuery().list()
  // Uses the JSONArray json util to convert the list of deployments 
  // into a pretty string
  var prettyDeploymentList = new JSONArray(deploymentList).toString(2)

  // Returns the pretty string as the response for the route
  response.end(prettyDeploymentList);
});

// Has the defined server use the defined router and listen on port 8081
server.requestHandler(router.accept).listen(8081);

// Returns a response such as:
/*
  [{
    "deployedArtifacts": null,
    "deployedCaseDefinitions": null,
    "deployedDecisionDefinitions": null,
    "deployedDecisionRequirementsDefinitions": null,
    "deployedProcessDefinitions": null,
    "deploymentTime": "Tue Apr 03 16:45:51 EDT 2018",
    "id": "ff48de6a-377f-11e8-95e6-60c547076970",
    "name": "vertxCamundaApplication",
    "new": false,
    "persistentState": "class org.camunda.bpm.engine.impl.persistence.entity.DeploymentEntity",
    "source": "process application",
    "tenantId": null,
    "validatingSchema": true
  }]
*/