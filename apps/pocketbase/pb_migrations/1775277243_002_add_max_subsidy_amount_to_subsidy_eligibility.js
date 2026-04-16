/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("subsidy_eligibility");

  const existing = collection.fields.getByName("max_subsidy_amount");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("max_subsidy_amount"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "max_subsidy_amount",
    required: false,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("subsidy_eligibility");
  collection.fields.removeByName("max_subsidy_amount");
  return app.save(collection);
})