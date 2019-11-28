import { applyFilters, pushToFilter } from "@factor/tools/filters"
import { toLabel } from "@factor/tools/utils"

export function addPostType(config) {
  pushToFilter("post-types-config", config)
}

export function postTypesConfig() {
  return applyFilters("post-types-config", []).map(_ => {
    const baseRoute = typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute

    const label = toLabel(_.postType)

    return { baseRoute, nameIndex: label, nameSingle: label, namePlural: label, ..._ }
  })
}

export function getPostTypeConfig(postType) {
  return postTypesConfig().find(pt => pt.postType == postType)
}