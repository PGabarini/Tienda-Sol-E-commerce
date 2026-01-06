import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || "http://keycloak:8080/",
  realm: process.env.REACT_APP_KEYCLOAK_REALM || "tiendasol",
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "frontend-react",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;