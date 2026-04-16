/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");
  collection.listRule = "user_id = @request.auth.id";
  collection.viewRule = "user_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "user_id = @request.auth.id";
  collection.deleteRule = "user_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");
  collection.listRule = "user_id = @request.auth.id";
  collection.viewRule = "user_id = @request.auth.id";
  collection.createRule = "user_id = @request.auth.id";
  collection.updateRule = "user_id = @request.auth.id";
  collection.deleteRule = null;
  return app.save(collection);
})