/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");

  const existing = collection.fields.getByName("synced_at");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("synced_at"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "synced_at",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  collection.fields.removeByName("synced_at");
  return app.save(collection);
})