package io.digitalstate.vertxcamunda;

import org.springframework.boot.SpringApplication;
import io.vertx.core.AbstractVerticle;

public class DeployCamunda extends AbstractVerticle  {

  @Override
  public void start() {
      SpringApplication.run(CamundaApplication.class);
  }

}