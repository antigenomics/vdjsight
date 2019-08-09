package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class CachedClonotypeTableView(totalPages: Int, defaultPage: Int, pageSize: Int, pagesRegion: Int, pages: Seq[CachedClonotypeTablePage])

object CachedClonotypeTableView {
  implicit val cachedClonotypeTableViewWrites: Writes[CachedClonotypeTableView] = Json.writes[CachedClonotypeTableView]
}
