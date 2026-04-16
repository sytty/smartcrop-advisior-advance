/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("subsidy_applications");

  const existing = collection.fields.getByName("eligibility_verified");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("eligibility_verified"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "eligibility_verified",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("subsidy_applications");
  collection.fields.removeByName("eligibility_verified");
  return app.save(collection);
})