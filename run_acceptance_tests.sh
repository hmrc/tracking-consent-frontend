#!/usr/bin/env bash
sbt \
  -Dplay.http.router=testOnlyDoNotUseInAppConf.Routes \
  -Dbrowser=chrome \
  acceptance:test
