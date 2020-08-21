#!/usr/bin/env bash
sbt -mem 8192 \
  -Dbrowser=remote-chrome \
  -Dzap.proxy=true \
  -Dlocal.services.tracking-consent-frontend.port=6001 \
  acceptance:test zap:test
