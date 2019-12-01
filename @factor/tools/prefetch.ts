import { addCallback, applyFilters } from "@factor/tools/filters"
import { currentRoute } from "@factor/app/router"
import { storeItem } from "@factor/app/store"
import { setPostMetatags } from "@factor/tools/metatags"
import { requestPostSingle } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

export function addGlobalPrefetch(cb: Promise<void>): void {
  addCallback("global-prefetch", cb)
}

export async function preFetchPost({ to = null, clientOnly = false } = {}): Promise<
  FactorPost | {}
> {
  const route = to || currentRoute()

  const request = applyFilters("post-params", {
    ...route.params,
    ...route.query,
    status: "published"
  })

  const { permalink, _id } = request

  // Only add to the filter if permalink is set. That way we don't show loader for no reason.
  if (
    (!permalink && !_id) ||
    permalink == "__webpack_hmr" ||
    /\.(png|jpg|gif|svg|ico)$/.test(permalink)
  ) {
    return {}
  }
  // For pre-fetching that happens only in the browser
  // If this applied on server it causes a mismatch (store set with full post then set to loading)
  if (clientOnly) {
    storeItem("post", { loading: true })
  }

  const post = await requestPostSingle(request)

  storeItem("post", post)

  if (post) setPostMetatags(post._id)

  return post
}
