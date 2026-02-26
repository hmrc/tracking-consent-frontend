resolvers += "HMRC-open-artefacts-maven" at "https://open.artefacts.tax.service.gov.uk/maven2"
resolvers += Resolver.url("HMRC-open-artefacts-ivy", url("https://open.artefacts.tax.service.gov.uk/ivy2"))(
  Resolver.ivyStylePatterns
)
resolvers += Resolver.typesafeRepo("releases")

// If re-ordering plugins, we noticed in upgrading to Play 3 that builds broke with previous order plugins were added
addSbtPlugin("uk.gov.hmrc"       % "sbt-auto-build"     % "3.24.0")
addSbtPlugin("uk.gov.hmrc"       % "sbt-distributables" % "2.6.0")
addSbtPlugin("org.playframework" % "sbt-plugin"         % "3.0.10")
addSbtPlugin("com.github.sbt"    % "sbt-gzip"           % "2.0.0")
addSbtPlugin("org.scalameta"     % "sbt-scalafmt"       % "2.5.4")
addSbtPlugin("uk.gov.hmrc"       % "sbt-test-report"    % "1.10.0")
