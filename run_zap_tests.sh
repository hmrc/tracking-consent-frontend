#!/usr/bin/env bash
sbt \
  -Dplay.http.router=testOnlyDoNotUseInAppConf.Routes \
  -Dbrowser=chrome \
  -Dzap.proxy=true \
  acceptance:test zap:test
