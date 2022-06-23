import OIDCJSONAPIAdapter from "@eflexsystems/ember-simple-auth-oidc/adapters/oidc-json-api-adapter";
import { inject as service } from "@ember/service";

export default class ApplicationAdapter extends OIDCJSONAPIAdapter {
  @service session;

  get headers() {
    return { ...this.session.headers, "Content-Language": "en-us" };
  }
}
