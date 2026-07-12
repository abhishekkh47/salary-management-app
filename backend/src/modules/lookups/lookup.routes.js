const LookupController = require("./lookup.controller");

module.exports = (router) => {
    const lookupController = new LookupController();

    router.get(
        "/lookups",
        lookupController.getAllLookups.bind(lookupController)
    );
};
