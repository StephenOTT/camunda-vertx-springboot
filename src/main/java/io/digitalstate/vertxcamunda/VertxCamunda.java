package io.digitalstate.vertxcamunda;

import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.Expression;

import io.vertx.core.eventbus.DeliveryOptions;
import io.vertx.core.MultiMap;

public class VertxCamunda extends VertxEventBus implements JavaDelegate {

  public MultiMap headers;
  public Expression address;
  public Expression message;

  public void execute(DelegateExecution execution) throws Exception {
    
    String addressValue = (String) address.getValue(execution);
    String messageValue = (String) message.getValue(execution);
    System.out.println(addressValue);
    System.out.println(messageValue);

    // Vertx vertx = ;
    // EventBus eventBus = vertx(new VertxOptions().setClustered(true)).eventBus();

    // System.out.println(eventBus);

    DeliveryOptions options = new DeliveryOptions();
    options.setHeaders(headers);
    options.addHeader("DelegateExecution", execution.toString());

    // Default timeout for response is 30 seconds
    // eventBus.send(addressValue, messageValue, options, ar -> {
    //   if (ar.succeeded()) {
    //     execution.setVariableLocal("vertx_response", ar.result().body());
    //   } else {
    //     System.out.println("FAILED");
    //     System.out.println(ar.cause());
    //   }
    // });

  }

}