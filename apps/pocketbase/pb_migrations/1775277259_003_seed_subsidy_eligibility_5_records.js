/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("subsidy_eligibility");

  const record0 = new Record(collection);
    record0.set("criteria_name", "Wheat Subsidy");
    record0.set("crop_type", "wheat");
    record0.set("min_land_size", 0.5);
    record0.set("max_land_size", 10);
    record0.set("subsidy_rate", 25);
    record0.set("max_subsidy_amount", 50000);
    record0.set("income_threshold", 500000);
    record0.set("active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("criteria_name", "Rice Subsidy");
    record1.set("crop_type", "rice");
    record1.set("min_land_size", 0.5);
    record1.set("max_land_size", 10);
    record1.set("subsidy_rate", 30);
    record1.set("max_subsidy_amount", 60000);
    record1.set("income_threshold", 500000);
    record1.set("active", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("criteria_name", "Cotton Subsidy");
    record2.set("crop_type", "cotton");
    record2.set("min_land_size", 1);
    record2.set("max_land_size", 20);
    record2.set("subsidy_rate", 20);
    record2.set("max_subsidy_amount", 80000);
    record2.set("income_threshold", 600000);
    record2.set("active", true);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("criteria_name", "Sugarcane Subsidy");
    record3.set("crop_type", "sugarcane");
    record3.set("min_land_size", 0.5);
    record3.set("max_land_size", 15);
    record3.set("subsidy_rate", 35);
    record3.set("max_subsidy_amount", 105000);
    record3.set("income_threshold", 600000);
    record3.set("active", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("criteria_name", "Maize Subsidy");
    record4.set("crop_type", "maize");
    record4.set("min_land_size", 0.5);
    record4.set("max_land_size", 10);
    record4.set("subsidy_rate", 22.5);
    record4.set("max_subsidy_amount", 45000);
    record4.set("income_threshold", 500000);
    record4.set("active", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})