-- Database Name: primx_project_db

-- START HERE -- 

-- create estimates table
CREATE TABLE "estimates" (
	"id" serial NOT NULL,
	"measurement_units" varchar(15) NOT NULL,
	"country" varchar(25) NOT NULL,
	"date_created" DATE NOT NULL,
	"project_name" varchar(100) NOT NULL,
	"licensee_id" int NOT NULL,
	"project_general_contractor" varchar(100) NOT NULL,
	"ship_to_address" varchar(150) NOT NULL,
	"ship_to_city" varchar(100) NOT NULL,
	"shipping_costs_id" int NOT NULL,
	"zip_postal_code" varchar(20) NOT NULL,
	"anticipated_first_pour_date" DATE NOT NULL,
	"project_manager_name" varchar(50) NOT NULL,
	"project_manager_email" varchar(100) NOT NULL,
	"project_manager_phone" varchar(25) NOT NULL,
	"floor_types_id" int NOT NULL,
	"placement_types_id" int NOT NULL,
	"square_feet" int DEFAULT NULL,
	"square_meters" int DEFAULT NULL,
	"thickness_inches" DECIMAL DEFAULT NULL,
	"thickness_millimeters" DECIMAL DEFAULT NULL,
	"thickened_edge_perimeter_lineal_feet" DECIMAL DEFAULT NULL,
	"thickened_edge_perimeter_lineal_meters" DECIMAL DEFAULT NULL,
	"thickened_edge_construction_joint_lineal_feet" DECIMAL DEFAULT NULL,
	"thickened_edge_construction_joint_lineal_meters" DECIMAL DEFAULT NULL,
	"primx_flow_dosage_liters" DECIMAL NOT NULL,
	"primx_steel_fibers_dosage_lbs" DECIMAL DEFAULT NULL,
	"primx_steel_fibers_dosage_kgs" DECIMAL DEFAULT NULL,
	"primx_cpea_dosage_liters" DECIMAL NOT NULL,
	"waste_factor_percentage" int NOT NULL DEFAULT '5',
	"primx_dc_unit_price" money NOT NULL,
	"primx_dc_shipping_estimate" money NOT NULL,
	"primx_flow_unit_price" money NOT NULL,
	"primx_flow_shipping_estimate" money NOT NULL,
	"primx_steel_fibers_unit_price" money NOT NULL,
	"primx_steel_fibers_shipping_estimate" money NOT NULL,
	"primx_ultracure_blankets_unit_price" money NOT NULL,
	"primx_cpea_unit_price" money NOT NULL,
	"primx_cpea_shipping_estimate" money NOT NULL,
	"estimate_number" varchar(50) NOT NULL UNIQUE,
	"ordered_by_licensee" bool NOT NULL DEFAULT 'false',
	"po_number" varchar(100) DEFAULT NULL,
	"order_number" varchar(50) DEFAULT NULL,
	"marked_as_ordered" bool NOT NULL DEFAULT 'false',
	"archived" bool NOT NULL DEFAULT 'false',
	"processed_by" varchar(50) DEFAULT NULL,
	CONSTRAINT "estimates_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


-- create shipping_costs table
CREATE TABLE "shipping_costs" (
	"id" serial NOT NULL,
	"ship_to_state_province" varchar(50) NOT NULL,
	"dc_price" money NOT NULL,
	"flow_cpea_price" money NOT NULL,
	"fibers_price" money NOT NULL,
	CONSTRAINT "shipping_costs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

-- create licensees table
CREATE TABLE "licensees" (
	"id" serial NOT NULL,
	"licensee_contractor_name" varchar(150) NOT NULL,
	"active" BOOLEAN DEFAULT TRUE,
	CONSTRAINT "licensees_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

-- create floor_types table
CREATE TABLE "floor_types" (
	"id" serial NOT NULL,
	"floor_type" varchar(50) NOT NULL,
	CONSTRAINT "floor_types_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

-- create placement_types table
CREATE TABLE "placement_types" (
	"id" serial NOT NULL,
	"placement_type" varchar(50) NOT NULL,
	CONSTRAINT "placement_types_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

-- create user table
CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


-- create products table
CREATE TABLE "products" (
	"id" serial NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"product_price" money NOT NULL,
	"on_hand" int NOT NULL,
	"product_identifier" varchar(25) NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



-- add foreign key constraints
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_fk0" FOREIGN KEY ("licensee_id") REFERENCES "licensees"("id");
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_fk1" FOREIGN KEY ("shipping_costs_id") REFERENCES "shipping_costs"("id");
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_fk2" FOREIGN KEY ("floor_types_id") REFERENCES "floor_types"("id");
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_fk3" FOREIGN KEY ("placement_types_id") REFERENCES "placement_types"("id");
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_fk4" FOREIGN KEY ("processed_by") REFERENCES "user"("username");

-- starting values for products table
INSERT INTO "products" ("product_name", "product_price", "on_hand", "product_identifier")
VALUES ('PrīmX DC (lbs)', .40, 0, 'dc_lbs'), ('PrīmX DC (kgs)', .88, 0, 'dc_kgs'), ('PrīmX Flow (liters)', 2.00, 0, 'flow_liters'), 
('PrīmX Steel Fibers (lbs)', .69, 0, 'steel_fibers_lbs'), ('PrīmX Steel Fibers (kgs)', 1.52, 0, 'steel_fibers_kgs'), ('PrīmX UltraCure Blankets (sqft)', .08, 0, 'blankets_sqft'), 
('PrīmX UltraCure Blankets (metersq)', .86, 0, 'blankets_sqmeters'), ('PrīmX CPEA (liters)', 3.55, 0, 'cpea_liters');

-- starting values for placement_types table
INSERT INTO "placement_types" ("placement_type") VALUES ('Truck Discharge'), ('Pump'), ('Buggy'), ('Conveyor');

-- starting values for floor_types
INSERT INTO "floor_types" ("floor_type") VALUES ('Slab on Grade - Interior'), ('Slab on Grade - Exterior'), ('Slab on Insulation'), ('Slab on Piles - Interior'), ('Slab on Piles - Exterior');

-- starting values for licensees
INSERT INTO "licensees" ("licensee_contractor_name") VALUES ('All-Phase Concrete Construction'), ('Alphacon'), ('Gesick Concrete'), ('Belmont Concrete Finishing'), ('Lewis Construction'),
('Fabbri Concrete & Masonry'), ('Fessler Bowman'), ('Absolute Concrete'), ('Gresser'), ('Lithko Contracting');



-- STOP HERE -- 

-- Import the Shipping Source CSV into the shipping_costs table at this point. The CSV headers to DB columns to match up are as follows:
	-- Shiping Source => ship_to_state_province
	-- DC => dc_price
	-- Flow => flow_cpea_price
	-- Fibers => fibers_price

-- Once this is done, everything needed for the estimates table to accept incoming estimates should be ready. Feel free to insert the dummy data
-- seen below to have searchable estimates from the EstimateLookup view, and data that will populate on the AdminOrder view.



-- Imperial dummy data starter
INSERT INTO "estimates" 
	("measurement_units","country","date_created","project_name","licensee_id","project_general_contractor","ship_to_address","ship_to_city","shipping_costs_id","zip_postal_code",
	"anticipated_first_pour_date","project_manager_name","project_manager_email","project_manager_phone","floor_types_id","placement_types_id","square_feet",
	"thickness_inches","thickened_edge_perimeter_lineal_feet","thickened_edge_construction_joint_lineal_feet",
	"primx_flow_dosage_liters","primx_steel_fibers_dosage_lbs","primx_cpea_dosage_liters",
	"primx_dc_unit_price","primx_dc_shipping_estimate","primx_flow_unit_price","primx_flow_shipping_estimate","primx_steel_fibers_unit_price",
	"primx_steel_fibers_shipping_estimate","primx_ultracure_blankets_unit_price","primx_cpea_unit_price","primx_cpea_shipping_estimate","estimate_number")
VALUES ('imperial', 'United States', '2021-07-23', 'Imperial Test Project', 1, 'Tucknology Industries', '500 Main St', 'Minneapolis', 22, 55454, '2021-10-31', 'Chris Klemz', 'chris@prime.io',
	1234567890, 2, 1, 10000, 5, 1000, 1000, 3, 68, 4, .40, 16000, 2.00, 15000, .69, 15000, .08, 3.55, 15000, 1234);

-- Metric dummy data starter
INSERT INTO "estimates" 
	("measurement_units","country","date_created","project_name","licensee_id","project_general_contractor","ship_to_address","ship_to_city","shipping_costs_id","zip_postal_code",
	"anticipated_first_pour_date","project_manager_name","project_manager_email","project_manager_phone","floor_types_id","placement_types_id","square_meters",
	"thickness_millimeters","thickened_edge_perimeter_lineal_meters","thickened_edge_construction_joint_lineal_meters",
	"primx_flow_dosage_liters","primx_steel_fibers_dosage_kgs","primx_cpea_dosage_liters",
	"primx_dc_unit_price","primx_dc_shipping_estimate","primx_flow_unit_price","primx_flow_shipping_estimate","primx_steel_fibers_unit_price",
	"primx_steel_fibers_shipping_estimate","primx_ultracure_blankets_unit_price","primx_cpea_unit_price","primx_cpea_shipping_estimate","estimate_number")
VALUES ('metric', 'Canada', '2021-07-23', 'Metric Test Project', 3, 'Genocchio Productions', '700 First Ave', 'Vancouver', 5, 'a52bc1', '2021-11-07', 'Alex Kim', 'alex@prime.io',
	9876543210, 1, 3, 4000, 120, 200, 200, 3.92, 40, 1, .88, 15000, 2.00, 14000, 1.52, 14000, .86, 3.55, 15000, 5678);

