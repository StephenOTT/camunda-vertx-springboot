exports.vertxStart = function() {
  console.log("Yaml config verticle has deployed")
}
exports.vertxStop = function() {
  console.log('Yaml config verticle has undeployed')
}

// @TODO Check if clustering is enabled for Entry Vert
// var isClustered = vertx.isClustered()
// @TODO Check if HA is enabled for Entry Vert

var _ = require('lodash')
var ConfigRetriever = require("vertx-config-js/config_retriever")

var deployedVerticles = {}

var yamlPath = java.lang.System.getenv("YAML_VERTICLE_PATH")
if (yamlPath == null || yamlPath == '') {
  console.error('YAML_VERTICLE_PATH ENV variable is null or a empty string. Falling back to default-config.yaml')
  
  var classloader = java.lang.Thread.currentThread().getContextClassLoader();
  var defaultYamlFile = classloader.getResource('default-config.yaml')
  yamlPath = defaultYamlFile.getPath()
}

var yamlPathScanPeriod = java.lang.System.getenv("YAML_PATH_SCAN_PERIOD")
if (_.isInteger(yamlPathScanPeriod) == false) {
  console.error('YAML_PATH_SCAN_PERIOD ENV variable is null or is not an integer. Falling back to value: 500000')
  yamlPathScanPeriod = 500000
}

// Setup Yaml Store
var yamlStore = {
  "type" : "file",
  "format" : "yaml",
  "config" : {
    "path" : yamlPath
  },
  "optional": false
}

var retrieverOptions = {
  "scanPeriod": yamlPathScanPeriod,
  "stores":[yamlStore]
  }

var retriever = ConfigRetriever.create(vertx, retrieverOptions)

processVerticles()

// // Watch for changes in the yaml config
// retriever.listen(function (change) {
//   console.log('Detected change in config yaml')
//   // Get Previous configuration
//   var prevConf = change.previousConfiguration
//   console.log('prev conf:')
//   console.log(JSON.stringify(prevConf))
//   // Get New configuration
//   var newConf = change.newConfiguration
//   console.log('new conf:')
//   console.log(JSON.stringify(newConf))

//   processChangedVerticles(prevConf['verticles'], newConf['verticles'])
// })

// One time processing of YAML File
function processVerticles() {
  retriever.getConfig(function (ar, ar_err) {
    if (ar_err != null) {
      console.error('Failed to retrieve yaml config!')
    } else {
      var config = ar['verticles'];
      _.forEach(config, function(value, key) {
        upVerticle(value, key)
      })
    }
  });
}

// When changes are detected, process the changes
function processChangedVerticles(prevConf, newConf) {
  // if config value was == {}
  if (_.isEmpty(prevConf) == true){
    console.log('Prev conf was empty')
     _.forEach(newConf, function(value, key) {
       upVerticle(value, key)
     })
  } else {
    // If previous config had values, 
    // then determine which verticles need redeployment
    compareConfs(newConf)
  }
  
  function compareConfs(newConf){
    // For each verticle in the New Conf
    _.forEach(newConf, function(value, key) {
      console.log('Reviewing: ' + key)
        var isConfSame = _.isEqual(value, prevConf[key])
        // If the specific verticle's Confs are not equal
        if (isConfSame == false){
          console.log('Change detected with: ' + key + ', new conf: ' + JSON.stringify(value))
          downVerticle(key)
          // Deploy the verticle
          upVerticle(value, key)
        } else {
          console.log('No change detected in: ' + key)
        }
    })
  }

  console.log('All verticles in config have been reviewed')
}

function upVerticle(confItem, confItemKey) {
  console.log('Deploying: ' + confItemKey + ' from path ' + confItem['path'])
  
  var deploymentPath = confItem['path']
  
  var deployOptions = {
    "worker": confItem['worker'] || null,
    "instances": confItem['instances'] || 1,
    "isolationGroup": confItem['isolationGroup'] || null,
    "isolatedClasses": confItem['isolatedClasses'] || null,
    "config": confItem['config'] || null
  }

  vertx.deployVerticle(deploymentPath, deployOptions, function (res, res_err) {
    if (res_err == null) {
      console.log("Deployment id is: " + res)
      listDeploymentIds()
      // Add deploymentID to the deployedVerticle var
      deployedVerticles[confItemKey] = res
    } else {
      console.error('Deployment of ' + confItemKey + ' failed!  ' + res_err);
    }
  })

}

//@TODO add support for detecting which verticles were removed from the config YAML file, and undeploy those.

// If the verticle name was deployed, it will be downed
function downVerticle(verticleName){
  var deploymentId = deployedVerticles[verticleName]
  if (deploymentId != null){
    vertx.undeploy(deploymentId, function(res, res_err){
      if (res_err == null){
        console.log('Verticle ' + verticleName + '(' + deploymentId + ') has been undeployed')
        listDeploymentIds()
      } else {
        console.log('Undeployment of verticle ' + verticleName + 'has failed: ' + res_err)
      }
    })
  }
}

function listDeploymentIds(){
  print('Deployments current active: ' + vertx.deploymentIDs())
}