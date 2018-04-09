package io.digitalstate.vertxcamunda;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@EnableProcessApplication
public class CamundaApplication {


  @Bean
  public EventBus eventBus() {
    Vertx vertx = Vertx.vertx();
    return vertx.eventBus();
  }

}
