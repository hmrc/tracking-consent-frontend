import com.typesafe.sbt.packager.Keys._
import sbt.Keys._
import sbt._

/**
  * Enables running NPM scripts
  *
  * This assumes that NPM is available, up-to-date, configured appropriately, etc. It makes not guarantees apart
  * from being able to invoke NPM with arguments.
  *
  * Additionally to this, there is some wiring to make 'npm test' run whenever 'sbt test' is run, and to
  * run 'npm run build' when doing the dist command (which is part of the distTgz command run in Jenkins)
  */
object JavaScriptBuild {
  val npmInstall  = TaskKey[Int]("npm-install")
  val npmTest     = TaskKey[Int]("npm-test")
  val npmBackstop = TaskKey[Int]("npm-backstop")
  val npmBuild    = TaskKey[Int]("npm-build")

  val javaScriptSettings: Seq[Setting[_]] = Seq(
    npmInstall := Npm.npmProcess("npm install failed")(baseDirectory.value, "install"),
    npmBuild := Npm.npmProcess("npm build failed")(baseDirectory.value, "run", "build"),
    npmBuild := (npmBuild dependsOn npmInstall).value,
    npmTest := Npm.npmProcess("npm test failed")(baseDirectory.value, "test"),
    npmTest := (npmTest dependsOn npmBuild).value,
    npmBackstop := Npm.npmProcess("npm backstop failed")(baseDirectory.value, "run", "backstop"),
    npmBackstop := (npmBackstop dependsOn npmBuild).value
  )
}
