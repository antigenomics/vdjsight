import com.typesafe.sbt.packager.docker._

name := """vdjsight-backend"""
organization := "com.antigenomics"
maintainer := "bvdmitri@gmail.com"
version := "0.0.1"

scalaVersion := "2.13.0"

resolvers += "Local Maven Repository" at Path.userHome.asFile.toURI.toURL + ".m2/repository"
resolvers += Resolver.sonatypeRepo("releases")
resolvers += "jitpack" at "https://jitpack.io"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)

libraryDependencies ++= Seq(
  evolutions,
  guice,
  ws,
  filters
)

libraryDependencies ++= Seq(
  "org.postgresql" % "postgresql" % "42.2.6",
  "com.typesafe.slick" %% "slick" % "3.3.2",
  "com.typesafe.play" %% "play-slick" % "4.0.2",
  "com.typesafe.play" %% "play-slick-evolutions" % "4.0.2",
  "com.lambdaworks" % "scrypt" % "1.4.0",
  "com.antigenomics" % "mir" % "1.0-SNAPSHOT"
)

scalacOptions ++= Seq(
  "-encoding",
  "UTF-8",
  "-unchecked",
  "-deprecation",
  "-Ywarn-dead-code",
  "-Ywarn-numeric-widen",
  "-feature",
  "-Xfatal-warnings",
  "-language:existentials"
)

scalacOptions in Universal ++= Seq(
  "-Xdisable-assertions",
  "-optimize",
  "-opt"
)

PlayKeys.devSettings := Seq(
  "play.server.http.port"               -> "disabled",
  "play.server.https.port"              -> "9443",
  "play.server.https.keyStore.path"     -> "./../environment/dev/ssl/backend-keystore.jks",
  "play.server.https.keyStore.password" -> "vdjsight"
)

// Starts: Prevent documentation of API for production bundles
sources in (Compile, doc) := Seq.empty
mappings in (Compile, packageDoc) := Seq.empty
publishArtifact in (Compile, packageDoc) := false
// Ends.

// Starts: Test configurations
javaOptions in Test ++= Seq(
  "-Dslick.dbs.default.profile=slick.jdbc.H2Profile$",
  "-Dslick.dbs.default.db.driver=org.h2.Driver",
  "-Dslick.dbs.default.db.profile=org.h2.Driver",
  "-Dslick.dbs.default.db.url=jdbc:h2:mem:play;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_UPPER=FALSE;DATABASE_TO_LOWER=TRUE",
  "-Dapplication.temporary.interval=0",
  "-Dapplication.auth.verification.method=noop",
  "-Dapplication.auth.reset.method=noop",
  "-Dapplication.auth.controller.delay=0 seconds",
  "-Dapplication.projects.storagePath=/tmp/vdjsight-test/projects",
  "-Dapplication.samples.storagePath=/tmp/vdjsight-test/samples"
)

libraryDependencies ++= Seq(
  "com.h2database" % "h2" % "1.4.199" % Test,
  "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test,
  "com.typesafe.akka" %% "akka-testkit" % "2.5.23" % Test
)
// Ends.

// Starts: Docker configuration

packageName in Docker := "vdjsight-backend"
version in Docker := version.value
maintainer in Docker := "bvdmitri"

defaultLinuxInstallLocation in Docker := "/home/vdjsight"
daemonUserUid in Docker := None
daemonUser in Docker := "daemon"

dockerBaseImage := "azul/zulu-openjdk-alpine:11"
dockerEntrypoint := Seq(
  "bin/vdjsight-backend",
  "-Dconfig.file=/home/vdjsight/environment/configuration.conf",
  "-Dlogger.file=/home/vdjsight/environment/logback.xml",
  "-Dpidfile.path=/dev/null")
dockerExposedPorts := Seq(9000)
dockerExposedVolumes := Seq("/home/vdjsight/environment", "/home/vdjsight/logs")

dockerUsername := Some("bvdmitri")

dockerCommands := dockerCommands.value.flatMap {
  case cmd@Cmd("FROM", _) => List(cmd, ExecCmd("RUN", "apk", "add", "--no-cache", "bash"))
  case other => List(other)
}

// Ends.
