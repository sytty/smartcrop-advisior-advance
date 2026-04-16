/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");

  const existing = collection.fields.getByName("expires_at");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("expires_at"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "expires_at",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");
  collection.fields.removeByName("expires_at");
  return app.save(collection);
})