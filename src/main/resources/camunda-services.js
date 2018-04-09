// Camunda Services
// Exposes Camunda Engine Services for use with load() 
// function in other Vertx verticles

// @TODO change var to const once es4x lib has 
// been added for ES6 support is added

// Get the Default Process Engine
// ProcessEngines: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/org/camunda/bpm/engine/ProcessEngines.html
var ProcessEngines = Java.type('org.camunda.bpm.engine.ProcessEngines')
var processEngine = ProcessEngines.getDefaultProcessEngine()

// Get the Repository Service
var authorizationService = processEngine.getAuthorizationService()
var caseService = processEngine.getCaseService()
var decisionService = processEngine.getDecisionService()
var externalTaskService = processEngine.getExternalTaskService()
var filterService = processEngine.getFilterService()
var formService = processEngine.getFormService()
var historyService = processEngine.getHistoryService()
var identityService = processEngine.getIdentityService()
var managementService = processEngine.getManagementService()
var repositoryService = processEngine.getRepositoryService()
var runtimeService = processEngine.getRuntimeService()
var taskService = processEngine.getTaskService()

// Json handling using Camunda Json Util library.  See link for more details:
// https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/org/camunda/bpm/engine/impl/util/json/package-tree.html
var JSONObject = Java.type('org.camunda.bpm.engine.impl.util.json.JSONObject')
var JSONArray = Java.type('org.camunda.bpm.engine.impl.util.json.JSONArray')
