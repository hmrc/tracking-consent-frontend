#!/usr/bin/env bash
sbt \
  -Dapplication.router=testOnlyDoNotUseInAppConf.Routes \
  -Dbrowser=chrome \
  -Dzap.proxy=true \
  acceptance:test zap:test
