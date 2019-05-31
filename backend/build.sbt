name := """vdjsight-backend"""
organization := "com.antigenomics"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.12.8"

libraryDependencies ++= Seq(
  evolutions,
  jdbc,
  guice
)

libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play-slick" % "4.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "4.0.0",
  "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.2" % Test
)

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "com.antigenomics.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "com.antigenomics.binders._"
