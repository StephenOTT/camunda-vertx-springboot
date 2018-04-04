package io.digitalstate.vertxcamunda;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.vertx.core.Vertx;
// import io.vertx.core.json.JsonObject;
// import io.vertx.core.DeploymentOptions;

@SpringBootApplication
@EnableProcessApplication
public class VertxCamundaApplication {
  
  final static Vertx vertx = Vertx.vertx();

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
    // @TODO Add Config file handling - Use Vertx or Spring configs...
    // JsonObject jsonConfig = vertx.getOrCreateContext().config();
    // DeploymentOptions options = new DeploymentOptions(jsonConfig);
    // String entryJsVerticle = jsonConfig.getString("entryJsVerticle");
    // System.out.println(jsonConfig);
    // vertx.deployVerticle(entryJsVerticle, options);
    vertx.deployVerticle("myVerticle.js");

  }
}
