/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  collection.listRule = "user_id = @request.auth.id";
  collection.viewRule = "user_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "user_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  collection.listRule = "user_id = @request.auth.id";
  collection.viewRule = "user_id = @request.auth.id";
  collection.createRule = "user_id = @request.auth.id";
  collection.updateRule = "user_id = @request.auth.id";
  collection.deleteRule = null;
  return app.save(collection);
})