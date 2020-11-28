const jsonParser = require("./includes/jsonParser");
const serverManager = require("./includes/serverManager");


serverManager.readInServers();
serverManager.addServer('123');
serverManager.removeServer('123');