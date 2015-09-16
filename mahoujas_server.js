Mahoujas = {};

OAuth.registerService('mahoujas', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);
    console.log(identity);
  return {
    serviceData: {
      id: identity.sub,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
      username: identity.preferred_username
    },
    options: { _id: identity.sub, profile: {
        firstName: identity.given_name || "",
        lastName: identity.family_name || "",
        gender: identity.gender || "unknown",
        dateOfBirth: moment(identity.birthdate, "MM/DD/YYYY").toDate()  || null,
        email: identity.email  || "",
        emailVerified: identity.email_verified  || false,
        mobile: identity.phone_number  || "",
        mobileVerified: identity.phone_number_verified  || false
    }}
  };
});

// ask admin
var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'mahoujas'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var url = (!!config.isDevelopment && config.isDevelopment)?
      "https://mhjs-test1.azurewebsites.net/identity/connect/token" :
      "https://accounts.mahoujas.com/identity/connect/token";
  var response;
  try {


      if (query.accessToken) {
          return query.accessToken;
      }else{
          response = HTTP.post(
              url, {
                  headers: {
                      Accept: 'application/json',
                      "User-Agent": userAgent
                  },
                  params: {
                      grant_type: 'authorization_code',
                      code: query.code,
                      client_id: config.clientId,
                      client_secret: OAuth.openSecret(config.secret),
                      redirect_uri: OAuth._redirectUri('mahoujas', config),
                      state: query.state
                  }
              });
      }
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Mahoujas. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Mahoujas. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  var config = ServiceConfiguration.configurations.findOne({service: 'mahoujas'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var url = (!!config.isDevelopment && config.isDevelopment)?
      "https://mhjs-test1.azurewebsites.net/identity/connect/userinfo" :
      "https://accounts.mahoujas.com/identity/connect/userinfo";
  try {
    return HTTP.get(
      url, {
        headers: {"Authorization": "Bearer " + accessToken}
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Mahoujas. " + err.message),
                   {response: err.response});
  }
};


Mahoujas.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
