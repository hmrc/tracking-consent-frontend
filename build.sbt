import JavaScriptBuild._
import play.sbt.PlayImport.PlayKeys.playDefaultPort
import sbt.Keys.testOptions
import uk.gov.hmrc.AccessibilityLinterPlugin.autoImport.A11yTest
import uk.gov.hmrc.DefaultBuildSettings.addTestReportOption

val appName = "tracking-consent-frontend"

lazy val unitTestSettings =
  inConfig(Test)(Defaults.testTasks) ++
    Seq(
      Test / testOptions := Seq(Tests.Filter(_ startsWith "unit")),
      addTestReportOption(Test, "test-reports")
    )

lazy val IntegrationTest         = config("it") extend Test
lazy val integrationTestSettings =
  inConfig(IntegrationTest)(Defaults.testTasks) ++
    Seq(
      // The following is needed due to https://stackoverflow.com/questions/24791992/assets-are-not-loaded-in-functional-test-mode
      (IntegrationTest / managedClasspath) += (Assets / packageBin).value,
      (IntegrationTest / test) := (IntegrationTest / test).dependsOn(npmBuild).value,
      (IntegrationTest / testOptions) := Seq(Tests.Filter(_ startsWith "it")),
      addTestReportOption(IntegrationTest, "it-test-reports")
    )

lazy val AcceptanceTest         = config("acceptance") extend Test
lazy val acceptanceTestSettings =
  inConfig(AcceptanceTest)(Defaults.testTasks) ++
    Seq(
      // The following is needed to preserve the -Dbrowser option to the HMRC webdriver factory library
      AcceptanceTest / fork := false,
      // The following is needed due to https://stackoverflow.com/questions/24791992/assets-are-not-loaded-in-functional-test-mode
      (AcceptanceTest / managedClasspath) += (Assets / packageBin).value,
      (AcceptanceTest / test) := (AcceptanceTest / test).dependsOn(a11yInstall).dependsOn(npmBuild).value,
      (AcceptanceTest / testOptions) := Seq(Tests.Filter(_ startsWith "acceptance")),
      addTestReportOption(AcceptanceTest, "acceptance-test-reports")
    )

lazy val microservice = Project(appName, file("."))
  .enablePlugins(play.sbt.PlayScala, SbtDistributablesPlugin)
  .disablePlugins(JUnitXmlReportPlugin) // Required to prevent https://github.com/scalatest/scalatest/issues/1427
  .configs(AcceptanceTest, IntegrationTest)
  .settings(
    majorVersion := 1,
    scalaVersion := "2.13.12",
    playDefaultPort := 12345,
    resolvers += Resolver.jcenterRepo,
    libraryDependencies ++= AppDependencies.compile ++ AppDependencies.test,
    TwirlKeys.templateImports ++= Seq(
      "views.html.helper.CSPNonce",
      "uk.gov.hmrc.trackingconsentfrontend.config.AppConfig",
      "uk.gov.hmrc.trackingconsentfrontend.views.html.components._",
      "uk.gov.hmrc.govukfrontend.views.html.components._",
      "uk.gov.hmrc.hmrcfrontend.views.html.components._",
      "uk.gov.hmrc.hmrcfrontend.views.html.helpers._"
    ),
    PlayKeys.playRunHooks += Webpack(baseDirectory.value),
    PlayKeys.devSettings ++= Seq("metrics.enabled" -> "false"),
    Assets / pipelineStages := Seq(gzip),
    acceptanceTestSettings,
    unitTestSettings,
    integrationTestSettings,
    javaScriptSettings,
    scalacOptions += "-Wconf:src=routes/.*:s",
    scalacOptions += "-Wconf:cat=unused-imports&src=html/.*:s",
    A11yTest / unmanagedSourceDirectories += (baseDirectory.value / "test" / "a11y")
  )
