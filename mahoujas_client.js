Mahoujas = {};

// Request Mahoujas credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Mahoujas.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'mahoujas'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();

  var scope = (options && options.requestPermissions) || [];
  var flatScope = _.map(scope, encodeURIComponent).join('+');

  var loginStyle = OAuth._loginStyle('mahoujas', config, options);

  var url = (!!config.isDevelopment && config.isDevelopment)?
      "https://mhjs-test1.azurewebsites.net/identity/connect/authorize" :
      "https://accounts.mahoujas.com/identity/connect/authorize";

  var loginUrl =
    url +
    '?client_id=' + config.clientId +
    '&response_type=code' +
    '&scope=' + flatScope +
    '&redirect_uri=' + OAuth._redirectUri('mahoujas', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "mahoujas",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {width: 900, height: 450}
  });
};
