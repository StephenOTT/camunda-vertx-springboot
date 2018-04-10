package io.digitalstate.vertxcamunda;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
// import io.vertx.core.json.JsonObject;
// import io.vertx.core.DeploymentOptions;

@SpringBootApplication
@EnableProcessApplication
public class VertxCamundaApplication {
  
  final public static Vertx vertx = Vertx.vertx();

  public static void main(String... args) {
    vertx.executeBlocking(future -> {
      SpringApplication.run(VertxCamundaApplication.class, args);
      future.complete();
    }, res -> {
      System.out.println("Camunda has been deployed!!!");
      deployVerticle();
    });
  }

  public static void deployVerticle() {
    vertx.deployVerticle("vertx-yaml-config-verticle.js", new DeploymentOptions().setWorker(true));
    // vertx.deployVerticle("delegate-verticle.js");

  }
}
