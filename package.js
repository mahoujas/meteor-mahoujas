Package.describe({
    name:"mahoujas:mahoujas",
    summary: "Mahoujas OAuth flow",
    version: "1.1.2",
    documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('momentjs:moment@2.10.6', ['server']);

  api.addFiles(
    ['mahoujas_configure.html', 'mahoujas_configure.js'],
    'client');

  api.addFiles('mahoujas_server.js', 'server');
  api.addFiles('mahoujas_client.js', 'client');

  api.export('Mahoujas');
});
