resolvers += "HMRC-open-artefacts-maven" at "https://open.artefacts.tax.service.gov.uk/maven2"
resolvers += Resolver.url("HMRC-open-artefacts-ivy", url("https://open.artefacts.tax.service.gov.uk/ivy2"))(
  Resolver.ivyStylePatterns
)
resolvers += Resolver.typesafeRepo("releases")

// If re-ordering plugins, we noticed in upgrading to Play 3 that builds broke with previous order plugins were added
addSbtPlugin("uk.gov.hmrc"        % "sbt-auto-build"           % "3.22.0")
addSbtPlugin("uk.gov.hmrc"        % "sbt-distributables"       % "2.5.0")
addSbtPlugin("org.playframework"  % "sbt-plugin"               % "3.0.2")
addSbtPlugin("com.typesafe.sbt"   % "sbt-gzip"                 % "1.0.2")
addSbtPlugin("org.scalameta"      % "sbt-scalafmt"             % "2.4.0")
addSbtPlugin("uk.gov.hmrc"        % "sbt-accessibility-linter" % "0.39.0")
addSbtPlugin("io.github.irundaia" % "sbt-sassify"              % "1.5.2")
addSbtPlugin("uk.gov.hmrc"        % "sbt-test-report"          % "0.26.0")
