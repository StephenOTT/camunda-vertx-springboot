package io.digitalstate.vertxcamunda;

import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.impl.util.json.JSONObject;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.Expression;

import io.vertx.core.eventbus.DeliveryOptions;

import java.util.concurrent.CompletableFuture;
import io.vertx.core.MultiMap;
import io.vertx.core.eventbus.EventBus;

public class VertxDelegate implements JavaDelegate {

  public MultiMap headers;
  public Expression address;
  public Expression message;
  
  public void execute(DelegateExecution execution) throws Exception {
    String addressValue = (String) address.getValue(execution);
    String messageValue = (String) message.getValue(execution);
    // System.out.println(addressValue);
    // System.out.println(messageValue);

    EventBus eventBus = VertxCamundaApplication.vertx.eventBus();

    DeliveryOptions options = new DeliveryOptions();
    options.setHeaders(headers);
    options.addHeader("DelegateExecution", executionJson(execution).toString());
 
    CompletableFuture<String> fut = new CompletableFuture<>();
    // Default EventBus timeout for response is 30 seconds
    eventBus.send(addressValue, messageValue, options, ar -> {
      if (ar.succeeded()) {
        System.out.println("EventBus SUCCESS: " + ar.result().body().toString());
        // System.out.println(ar.result().body().toString());
        fut.complete(ar.result().body().toString());
      } else {
        System.out.println("EventBus FAILED: " + ar.cause());
        // System.out.println(ar.cause());
        fut.complete(ar.cause().toString());
      }
    });
    execution.setVariable("busResponse", fut.get());
  }

  private JSONObject executionJson(DelegateExecution execution) {
    JSONObject myObject = new JSONObject();

    myObject.put("ExecutionId", execution.getId());
    myObject.put("activityInstanceId", execution.getActivityInstanceId());
    myObject.put("CurrentActivityId", execution.getCurrentActivityId());
    myObject.put("CurrentActivityName", execution.getCurrentActivityName());
    myObject.put("CurrentTransitionId", execution.getCurrentTransitionId());
    myObject.put("ParentActivityInstanceId", execution.getParentActivityInstanceId());
    myObject.put("ParentId", execution.getParentId());
    myObject.put("ProcessBusinessKey", execution.getProcessBusinessKey());
    myObject.put("ProcessDefinitionId", execution.getProcessDefinitionId());
    myObject.put("ProcessInstanceId", execution.getProcessInstanceId());
    // myObject.put("SuperExecutionId", execution.getSuperExecution().getId());
    myObject.put("isCanceled", execution.isCanceled());
    return myObject;
  }

}