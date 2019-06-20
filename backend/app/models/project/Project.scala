package models.project

import java.util.UUID

import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.{Inject, Singleton}
import effects.EventStreaming
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.Configuration
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.concurrent.Future
import scala.language.higherKinds

case class Project(uuid: UUID, name: String, ownerID: UUID)

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {
  def uuid          = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def name          = column[String]("name", O.Length(255))
  def ownerID       = column[UUID]("owner_id", O.SqlType("uuid"))

  def * = (uuid, name, ownerID) <> (Project.tupled, Project.unapply)

  def owner = foreignKey("project_table_owner_fk", ownerID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def owner_idx = index("project_table_owner_index", ownerID, unique = false)

}

object ProjectTable {
  final val TABLE_NAME = "project"

  implicit class ProjectTableExtensions[C[_]](q: Query[ProjectTable, Project, C]) {
    def withOwner(implicit up: UserProvider): Query[(ProjectTable, UserTable), (Project, User), C] = q.join(up.table).on(_.ownerID === _.uuid)
  }
}

trait ProjectProviderEvent

object ProjectProviderEvents {
  case class ProjectCreated(uuid: UUID) extends ProjectProviderEvent
  case class ProjectUpdated(uuid: UUID) extends ProjectProviderEvent
  case class ProjectDeleted(uuid: UUID) extends ProjectProviderEvent
}

@Singleton
class ProjectProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider, conf: Configuration)(
  implicit up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with EventStreaming[ProjectProviderEvent] {

  final private val logger               = LoggerFactory.getLogger(this.getClass)
  final private val actorSystem          = ActorSystem.create("ProjectProviderActorSystem")
  final private val eventStream          = actorSystem.eventStream

  import dbConfig.profile.api._

  final private val projects = TableQuery[ProjectTable]

  def subscribe(subscriber: ActorRef): Unit = eventStream.subscribe(subscriber, classOf[ProjectProviderEvent])

  def unsubscribe(subscriber: ActorRef): Unit = eventStream.unsubscribe(subscriber)

  def table: TableQuery[ProjectTable] = projects

  def all: Future[Seq[Project]] = db.run(table.result)

  def get(uuid: UUID): Future[Option[Project]] = db.run(table.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[Project]] = db.run(table.filter(_.ownerID === userID).result)

  def getWithOwner(uuid: UUID): Future[Option[(Project, User)]] = db.run(table.withOwner.filter(_._1.uuid === uuid).result.headOption)

}
