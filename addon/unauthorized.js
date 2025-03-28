import { getConfig } from "@eflexsystems/ember-simple-auth-oidc/config";
import getAbsoluteUrl from "@eflexsystems/ember-simple-auth-oidc/utils/absolute-url";
import { getOwner } from "@ember/application";
import { debounce } from "@ember/runloop";
import { isTesting, macroCondition } from "@embroider/macros";

const replaceUri = (session) => {
  location.replace(
    getAbsoluteUrl(getConfig(getOwner(session)).afterLogoutUri || "")
  );
};

export default function handleUnauthorized(session) {
  if (session.isAuthenticated) {
    // Only store current location for redirect if the session is not
    // invalidated yet.
    session.set("data.nextURL", location.href.replace(location.origin, ""));
    session.invalidate();
  }
  if (macroCondition(isTesting())) {
    // don't redirect in tests
  } else {
    // Debounce the redirect, so we can collect all unauthorized requests and trigger a final
    // redirect. We don't want to interrupt calls to the authorization endpoint nor create race
    // conditions when multiple requests land in this unauthorized handler.
    debounce(
      this,
      replaceUri,
      session,
      getConfig(getOwner(session)).unauthorizedRequestRedirectTimeout,
    );
  }
}
