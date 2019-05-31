
name := """vdjsight-backend"""
organization := "com.antigenomics"
version := "0.0.1"

scalaVersion := "2.12.8"

resolvers += "Local Maven Repository" at Path.userHome.asFile.toURI.toURL + ".m2/repository"
resolvers += Resolver.sonatypeRepo("releases")
resolvers += "jitpack" at "https://jitpack.io"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)


libraryDependencies ++= Seq(
  evolutions,
  jdbc,
  guice,
  ws,
  filters
)

libraryDependencies ++= Seq(
  "com.typesafe.slick" %% "slick" % "3.3.0",
  "org.slf4j" % "slf4j-nop" % "1.7.26",
  "com.typesafe.play" %% "play-slick" % "4.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "4.0.0",
  "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.2" % Test
)

scalacOptions ++= Seq(
  "-encoding", "UTF-8",
  "-unchecked",
  "-deprecation",
  "-Xfuture",
  "-Yno-adapted-args",
  "-Ywarn-dead-code",
  "-Ywarn-numeric-widen",
  "-feature",
  "-Xfatal-warnings"
)

scalacOptions in Universal ++= Seq(
  "-Xdisable-assertions",
  "–optimise",
)

// Starts: Prevent documentation of API for production bundles
sources in (Compile, doc) := Seq.empty
mappings in (Compile, packageDoc) := Seq.empty
publishArtifact in(Compile, packageDoc) := false
// Ends.


