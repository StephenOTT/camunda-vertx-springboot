# Camunda BPM with Vert.x (Spring Boot + Camunda + Vert.x)

This is a working example/prototype/use case builder for testing the capabilities of using Vertx.io to extend CamundaBPM (Spring Boot Deployment).


## Why does this exist?

CamundaBPM provides a amazing BPM engine to orchestrate processes from, but there can be "annoyances" when working with Camunda as a "microserice": that is, you use Camunda as a common microservice rather than a "embedded BPM engine in your application".  This means that you would be interacting with Camunda through the Rest API, and as your API usage grows in complexity, there are limits to what the current Rest API offers.  Given that this is a "common microservice" (that may be used 'enterprise wide') we may or may not want to continually extend Camunda's core REST API.  So how do we add API functionality without having to recompile Camunda's Jar, and preferably, how can we add these API functions **without** having to write "Java".

Vertx to the rescue!  [Vertx.io](vertx.io) provides a Polyglot library on the JVM.  This lets us create a Spring Boot Camunda BPM application, and as part of that application, we will instantiate Vertx and deploy Vertx "Verticles".

### Why use SpringBoot? and why not just run Camunda Embedded Jar in Vertx Verticle?

1. SpringBoot Starter for Camunda provides a lot of ease of use capabilities that simplifies the configuration and management of camunda.
1. Camunda manages its own "workers", threads, and processing of data.  If Vertx was used to setup/deploy a camunda instance, then someone could activate multiple "instances" of the verticle, creating multiple instances of camunda... this does not work so well...
1. Camunda already manages threads per process instance and sync/async controls.  Vertx's capabilities in this space is not required and only creates the need for further management.
1. The Camunda SpringBoot starter is officially supported by Camunda, thus issues and configurations options are less likely to be a problem compared to a homegrown vertx setup.
1. Camunda has many other options for Database control, Rest API control, authorizations and authentication, etc.  SpringBoot already provides the easy to use hooks and connections for this. If these benefits were ignored, we would be back at setting it up manually within a vertx instance.
1. Camunda has worker pool and thread size configurations that make Vertx Instance count configurations a redundant option.

Overall the general view is: Camunda should be treated as a application, even when it is being embedded.  Vertx is embedded within the SpringBoot application, providing easy polyglot access to Camunda's Java API, and allowing Camunda to communicate with Vertx through the Vertx eventbus.

# How to Build and Deploy

1. Go to src/main/resources and run `npm install lodash`

1. Root of Project and run: `./mvnw clean install`

1. After build is complete, run: `YAML_VERTICLE_PATH=/path/to/yaml/file/js_app/verticle-config.yaml java -jar /path/to/jar/vertxcamunda-0.1.0-SNAPSHOT.jar`

Follow along in the Console, you will see Camunda boot followed by the Vertx Verticles.  See the [Verticle Configuration through YAML](#verticle-configuration-through-yaml) section for more details about the `YAML_VERTICLE_PATH` env variable.

Once you see the message: `Primary Javascript Vertx Verticle is Deployed` then you can navigate to: `http://localhost:8081/my-deployments` which should return a result such as:

```json
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
  ```

  You can extend the use case or add additional verticles by modifying the `myVerticle.js` file in `src/main/resources`


# TODO

1. Add Clustering Support
1. Add NPM project example showing how to build a NPM style project of JS verticles.
1. Add error handling to Vertx Delegate


## Additional Scenarios to Test:

1. What are benefits of using Vertx vs Deploying Many Camunda instances that have been customized, and all instances point to same Camunda DB.
1. Add support for using es4x (https://github.com/reactiverse/es4x) so that "node" projects can be used to extend the Camunda BPM API.


# How does this all work? I am not quite sure what is going on...

![overview](./docs/Vertx-Camunda-Models.png)


# How to scale this thing

The Camunda SpringBoot will provide the standard camunda clustering capabilities.  This will allow you to deploy multiple instances of the Camunda SpringBoot application that point to a common database service.

Vertx can be clustered and scaled as well with all of the standard Vertx scaling features.  Multiple instances of stand-alone Vertx can be setup once you establish event bus endpoints that speak to Camunda's Java API.  


# Vertx Camunda JavaDelegate

The Vertx delegate is a Camunda JavaDelegate that enables access to the Vertx EventBus.

using the Java Class: `io.digitalstate.vertxcamunda.VertxDelegate` you can then use Field Injection to provide a `address` (String) ad `message` (Currently String is only supported, but will be converted to JSON in future iterations) which will be used to communicate with the Event Bus.

This allows you to create javascript verticles that listen for eventbus actions that are activated by the Camunda Java Delegate.

Consider the following:

The `delegate-verticle.js` verticle is in `src/main/resources`.  This verticle contains the following:

```javascript
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
```

The eventbus is establishing a consumer for the eventbus Address of `someAction`

You can then set your Service Task or any other delegate code as follows:

![config 1](./docs/Delegate-Config-1.png)
![config 2](./docs/Delegate-Config-2.png)
![config 3](./docs/Delegate-Config-3.png)


# camunda-services.js

The camunda-services.js library is a small set of code that exposes the Camunda engine services as variables.

You can load this in any javascript vertx verticle with `load('classpath:camunda-services.js')`.  See the [camunda-services.js](./src/main/resources/camunda-services.js) file for which variables are exposed.


# Sample BPMN File

The `sample.bpmn` BPMN file (`src/main/resources`) has been configured with a example of the [VertxDelegate](#vertx-camunda-javadelegate):

![config 1](./docs/Delegate-Config-1.png)

You can activate this process through the Task list (Default configuration of User: `admin` Password: `admin`).  Start the "Sample" process definition.

The console will print the following

```console
I have received a message: AWESOME!!!!
{"isCanceled":false,"activityInstanceId":"Task_042ajsy:9596ecb2-3c26-11e8-b22d-60c547076970","CurrentActivityName":"VertxDelegate","ProcessInstanceId":"9594a2c0-3c26-11e8-b22d-60c547076970","ParentActivityInstanceId":"9594a2c0-3c26-11e8-b22d-60c547076970","ProcessDefinitionId":"Sample:1:7b508b8f-3c26-11e8-b22d-60c547076970","CurrentActivityId":"Task_042ajsy","ExecutionId":"9594a2c0-3c26-11e8-b22d-60c547076970"}
EventBus SUCCESS: how interesting!
```

![bus response](./docs/Bus-response.png)


# Verticle Configuration through YAML

Included in the Jar is the `vertx-yaml-config-verticle.js`, this verticle manages the processing of the config YAML file.  This config file contains the configuration of verticle

```yaml
# Verticle Configurations
verticles:
    my_delegate_verticle:
        path: "app/verticles/vert1.js"
        worker: false
        instances: 1
        isolationGroup:
        isolatedClasses:
        config:
            value1: "dog"
            value2: "cat"
    processing_verticle_ABC:
        path: "some/docker/volume/location/verticleABC.js"
        worker: true
        instances: 10
```

the file can be as minimal as:

```yaml
verticles:
    my_delegate_verticle:
        path: "app/verticles/vert1.js"
```

See Vertx.io documentation for details about Verticle Deployment Options.

On the startup of the `vertx-yaml-config-verticle.js` verticle, it will look for verticles described in the YAML file.  The location of the YAML file is defined by the ENV variable `YAML_VERTICLE_PATH`.  A example YAML file in included in `./js_app` folder as `verticle-config.yaml`.

Verticles that are deployed within the context of the Camunda BPM SpringBoot application will be able to access the Java API of Camunda directly.

Verticles that are deployed on other Vertx Instances that are not part of a Camunda deployment will not be able to access the API directly.  The workaround for this is to build EventBus APIs for various Camunda engine services.

**Note** that Lodash is available on the classpath as part of the vertx-yaml-config-verticle.js verticle.  You can add Lodash to any deployed verticle with a `require('lodash')` in your verticle's JS code.