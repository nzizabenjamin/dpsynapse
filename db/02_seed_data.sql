-- ============================================================================
-- DP World Synapse - Kigali Dry Port (Masaka) Seed Data
-- Version: 1.0.0
-- Realistic operations dataset for DP World Kigali Logistics Hub
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Seed: warehouse_zones
-- ----------------------------------------------------------------------------
INSERT INTO warehouse_zones (
    id, zone_code, zone_name, zone_type, total_capacity_sqm, total_capacity_teu, 
    current_occupancy_teu, temperature_celsius, target_temp_min, target_temp_max, 
    status, supervisor_name, created_at, updated_at
) VALUES
(1, 'ZONE-A-BONDED', 'Bonded CFS & Import Holding', 'BONDED', 12500.00, 850, 714, NULL, NULL, NULL, 'NEAR_CAPACITY', 'Jean-Paul Mugisha', NOW() - INTERVAL '30 days', NOW()),
(2, 'ZONE-B-NONBONDED', 'Non-Bonded FMCG & Retail Distribution', 'NON_BONDED', 18000.00, 1200, 820, NULL, NULL, NULL, 'OPTIMAL', 'Aline Uwase', NOW() - INTERVAL '30 days', NOW()),
(3, 'ZONE-C-AGRI', 'Agri-Commodities & Mineral Export Hub', 'CFS', 9500.00, 600, 495, NULL, NULL, NULL, 'OPTIMAL', 'Emmanuel Habimana', NOW() - INTERVAL '30 days', NOW()),
(4, 'ZONE-D-COLD', 'Cold Chain Pharma & Fresh Produce Hub', 'COLD_CHAIN', 4200.00, 240, 218, 3.4, 2.0, 8.0, 'NEAR_CAPACITY', 'Dr. Diane Keza', NOW() - INTERVAL '30 days', NOW()),
(5, 'ZONE-E-HAZMAT', 'Dangerous Goods & Project Heavy Cargo', 'HAZMAT', 3500.00, 180, 72, NULL, NULL, NULL, 'OPTIMAL', 'Claude Ndayisaba', NOW() - INTERVAL '30 days', NOW()),
(6, 'ZONE-F-EMPTY', 'Empty Container Yard & Reefer Gantry', 'EMPTY_YARD', 22000.00, 1800, 1340, -18.2, -22.0, -15.0, 'OPTIMAL', 'Patrick Nshimiyimana', NOW() - INTERVAL '30 days', NOW());

SELECT setval('warehouse_zones_id_seq', (SELECT MAX(id) FROM warehouse_zones));

-- ----------------------------------------------------------------------------
-- 2. Seed: shipments (35+ realistic shipments)
-- ----------------------------------------------------------------------------
INSERT INTO shipments (
    id, tracking_number, container_number, seal_number, shipping_line, consignee_name, 
    consignor_name, origin_port, destination_hub, corridor, cargo_type, commodity_description, 
    weight_kg, teu_count, customs_channel, customs_status, customs_declaration_number, 
    stage, warehouse_zone_id, eta, gate_in_at, customs_cleared_at, gate_out_at, 
    dwell_time_hours, is_bonded, created_at, updated_at
) VALUES
-- Cleared & In Warehouse / Stored
(1, 'DPW-KGL-2026-1001', 'MSKU7829104', 'SL-MSK-9912', 'Maersk', 'Bralirwa Plc', 'Heineken Supply BV', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'Barley Malt & Brewing Raw Materials', 26400.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-DEC-09812', 'WAREHOUSE_STORED', 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '48 hours', NOW() - INTERVAL '24 hours', NULL, 48.0, TRUE, NOW() - INTERVAL '5 days', NOW()),
(2, 'DPW-KGL-2026-1002', 'CMAU8192031', 'SL-CMA-4421', 'CMA CGM', 'Inyange Industries Ltd', 'Tetra Pak Arabia', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'FCL', 'Aseptic Beverage Packaging Rolls', 21500.00, 1, 'YELLOW', 'CLEARED', 'RRA-2026-DEC-09844', 'WAREHOUSE_STORED', 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '36 hours', NOW() - INTERVAL '12 hours', NULL, 36.0, FALSE, NOW() - INTERVAL '4 days', NOW()),
(3, 'DPW-KGL-2026-1003', 'MSCU9102834', 'SL-MSC-1109', 'MSC', 'Rwanda Tea Authority (NAEB)', 'Twinings Global', 'DP World Masaka', 'Mombasa Port', 'NORTHERN_CORRIDOR', 'FCL', 'Highland Premium Black Tea (Export)', 24000.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-EXP-00412', 'WAREHOUSE_STORED', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '18 hours', NULL, 20.0, TRUE, NOW() - INTERVAL '3 days', NOW()),
(4, 'DPW-KGL-2026-1004', 'HLCU3910283', 'SL-HLC-7732', 'Hapag-Lloyd', 'Rwanda Medical Supply (RMS)', 'Sanofi Pasteur France', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'COLD_CHAIN', 'Temperature-Controlled Vaccines & Insulin', 12800.00, 1, 'BLUE', 'CLEARED', 'RRA-2026-AEO-0012', 'WAREHOUSE_STORED', 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '28 hours', NOW() - INTERVAL '26 hours', NULL, 28.0, TRUE, NOW() - INTERVAL '4 days', NOW()),
(5, 'DPW-KGL-2026-1005', 'TEMU4401928', 'SL-TEM-6619', 'PIL', 'Cimerwa Cement Ltd', 'Sinoma Equipment Beijing', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'BULK', 'Grinding Mill Heavy Machinery Parts', 42000.00, 2, 'YELLOW', 'CLEARED', 'RRA-2026-DEC-10023', 'WAREHOUSE_STORED', 5, NOW() - INTERVAL '4 days', NOW() - INTERVAL '60 hours', NOW() - INTERVAL '30 hours', NULL, 60.0, FALSE, NOW() - INTERVAL '6 days', NOW()),

-- Inspection Bay / Physical Scan (Red Channel Backlog)
(6, 'DPW-KGL-2026-1006', 'MSKU9918234', 'SL-MSK-3341', 'Maersk', 'Airtel Rwanda Ltd', 'Huawei Tech Shenzhen', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'FCL', 'Telecom Transmission Base Stations & Antennas', 18500.00, 1, 'RED', 'PHYSICAL_SCAN', 'RRA-2026-DEC-10119', 'INSPECTION_BAY', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '16 hours', NULL, NULL, 16.0, TRUE, NOW() - INTERVAL '3 days', NOW()),
(7, 'DPW-KGL-2026-1007', 'MSCU3019284', 'SL-MSC-8821', 'MSC', 'Simba Supermarket Holdings', 'Nestle Middle East', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'Confectionery & Dairy Packaged Goods', 23000.00, 2, 'RED', 'PHYSICAL_SCAN', 'RRA-2026-DEC-10140', 'INSPECTION_BAY', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '14 hours', NULL, NULL, 14.0, TRUE, NOW() - INTERVAL '4 days', NOW()),
(8, 'DPW-KGL-2026-1008', 'CMAU1102938', 'SL-CMA-2204', 'CMA CGM', 'Utexrwa Textile Mills', 'Surat Tex Mills India', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'LCL', 'Synthetic Fabric Rolls & Garment Accessories', 16400.00, 1, 'RED', 'PHYSICAL_SCAN', 'RRA-2026-DEC-10155', 'INSPECTION_BAY', 1, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '8 hours', NULL, NULL, 8.0, TRUE, NOW() - INTERVAL '2 days', NOW()),
(9, 'DPW-KGL-2026-1009', 'HLCU8819203', 'SL-HLC-5512', 'Hapag-Lloyd', 'Rwanda Foam Ltd', 'BASF Chemical Antwerp', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'HAZMAT', 'Polyurethane Chemical Precursors (Class 3)', 19800.00, 1, 'RED', 'CUSTOMS_HOLD', 'RRA-2026-DEC-10178', 'INSPECTION_BAY', 5, NOW() - INTERVAL '2 days', NOW() - INTERVAL '26 hours', NULL, NULL, 26.0, TRUE, NOW() - INTERVAL '5 days', NOW()),

-- Yard Gate-In (Awaiting Verification)
(10, 'DPW-KGL-2026-1010', 'MSKU2201948', 'SL-MSK-7718', 'Maersk', 'Africa Improved Foods (AIF)', 'Archer Daniels Midland', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'BULK', 'Non-GMO Fortified Soybeans', 28000.00, 2, 'YELLOW', 'DOCUMENT_VERIFICATION', 'RRA-2026-DEC-10201', 'YARD_GATE_IN', 3, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours', NULL, NULL, 4.0, TRUE, NOW() - INTERVAL '2 days', NOW()),
(11, 'DPW-KGL-2026-1011', 'MSCU6619284', 'SL-MSC-3392', 'MSC', 'Sulfo Rwanda Industries', 'Palm Oil Chem Selangor', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'Refined Stearin & Soap Manufacturing Base', 25500.00, 2, 'GREEN', 'PENDING_DECLARATION', 'RRA-2026-DEC-10214', 'YARD_GATE_IN', 2, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours', NULL, NULL, 2.0, FALSE, NOW() - INTERVAL '2 days', NOW()),
(12, 'DPW-KGL-2026-1012', 'CMAU9938102', 'SL-CMA-9941', 'CMA CGM', 'Minapharm Laboratories Ltd', 'Novartis Basel', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'COLD_CHAIN', 'Specialized Cold-Stored Oncology Therapeutics', 9400.00, 1, 'BLUE', 'DOCUMENT_VERIFICATION', 'RRA-2026-AEO-0034', 'YARD_GATE_IN', 4, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', NULL, NULL, 1.0, TRUE, NOW() - INTERVAL '3 days', NOW()),

-- In Corridor Transit (Central Corridor & Northern Corridor)
(13, 'DPW-KGL-2026-1013', 'MSKU4491029', 'SL-MSK-6623', 'Maersk', 'MTN Rwanda Ltd', 'Ericsson Sweden Hub', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', '5G Core Network Racks & Optical Fiber', 17800.00, 1, 'YELLOW', 'DOCUMENT_VERIFICATION', 'RRA-2026-DEC-10331', 'CORRIDOR_TRANSIT', 1, NOW() + INTERVAL '14 hours', NULL, NULL, NULL, 0.0, TRUE, NOW() - INTERVAL '1 day', NOW()),
(14, 'DPW-KGL-2026-1014', 'MSCU8810294', 'SL-MSC-4451', 'MSC', 'Rwanda Mountain Tea', 'Unilever UK Tea Blends', 'DP World Masaka', 'Mombasa Port', 'NORTHERN_CORRIDOR', 'FCL', 'Export Grade CTC Tea Fannings', 24500.00, 2, 'GREEN', 'PENDING_DECLARATION', 'RRA-2026-EXP-00430', 'BORDER_CROSSING', 3, NOW() + INTERVAL '6 hours', NULL, NULL, NULL, 0.0, TRUE, NOW() - INTERVAL '2 days', NOW()),
(15, 'DPW-KGL-2026-1015', 'HLCU1192847', 'SL-HLC-1029', 'Hapag-Lloyd', 'Kigali Ceramic Works', 'Foshan Ceramics Guangdong', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'BULK', 'Vitrified Glazed Floor Tiles & Grout', 31200.00, 2, 'YELLOW', 'DOCUMENT_VERIFICATION', 'RRA-2026-DEC-10350', 'BORDER_CROSSING', 2, NOW() + INTERVAL '4 hours', NULL, NULL, NULL, 0.0, FALSE, NOW() - INTERVAL '3 days', NOW()),
(16, 'DPW-KGL-2026-1016', 'TEMU9928174', 'SL-TEM-8823', 'PIL', 'Bella Flowers Ltd', 'Royal FloraHolland Aalsmeer', 'DP World Masaka', 'Mombasa Port', 'NORTHERN_CORRIDOR', 'COLD_CHAIN', 'Fresh Cut Export Roses (Reefer)', 8800.00, 1, 'GREEN', 'CLEARED', 'RRA-2026-EXP-00445', 'CORRIDOR_TRANSIT', 4, NOW() + INTERVAL '22 hours', NULL, NULL, NULL, 0.0, TRUE, NOW() - INTERVAL '1 day', NOW()),
(17, 'DPW-KGL-2026-1017', 'MSKU5501928', 'SL-MSK-5519', 'Maersk', 'Prime Cement Rwanda', 'Caterpillar Mining USA', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'BULK', 'Heavy Quarry Excavator Spare Assemblies', 36500.00, 2, 'RED', 'PENDING_DECLARATION', 'RRA-2026-DEC-10382', 'CORRIDOR_TRANSIT', 5, NOW() + INTERVAL '18 hours', NULL, NULL, NULL, 0.0, TRUE, NOW() - INTERVAL '2 days', NOW()),

-- Completed / Gate Out Delivered (Historical for metrics & Dwell stats)
(18, 'DPW-KGL-2026-1018', 'MSCU1192048', 'SL-MSC-9934', 'MSC', 'Bralirwa Plc', 'Kronos Beverage Glassware', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'Amber Beer Bottles (24x33cl format)', 25000.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-DEC-09501', 'GATE_OUT_DELIVERED', 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', 48.0, TRUE, NOW() - INTERVAL '8 days', NOW()),
(19, 'DPW-KGL-2026-1019', 'CMAU7718290', 'SL-CMA-1029', 'CMA CGM', 'Inyange Industries Ltd', 'Tetra Pak Arabia', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'FCL', 'Straw Applicator Adhesives & Foil', 19000.00, 1, 'YELLOW', 'CLEARED', 'RRA-2026-DEC-09520', 'GATE_OUT_DELIVERED', 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 38.5, FALSE, NOW() - INTERVAL '9 days', NOW()),
(20, 'DPW-KGL-2026-1020', 'HLCU6619283', 'SL-HLC-4491', 'Hapag-Lloyd', 'Rwanda Medical Supply (RMS)', 'GlaxoSmithKline Belgium', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'COLD_CHAIN', 'Essential Vaccines and Cold Serum', 11400.00, 1, 'BLUE', 'CLEARED', 'RRA-2026-AEO-0010', 'GATE_OUT_DELIVERED', 4, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', 22.0, TRUE, NOW() - INTERVAL '10 days', NOW()),

-- Additional Active Yard & CFS Storage Shipments
(21, 'DPW-KGL-2026-1021', 'MSKU3381920', 'SL-MSK-2219', 'Maersk', 'Afrifoam Plastics Ltd', 'SABIC Petrochemicals', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'High Density Polyethylene Pellets', 27000.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-DEC-10045', 'WAREHOUSE_STORED', 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '32 hours', NOW() - INTERVAL '20 hours', NULL, 32.0, TRUE, NOW() - INTERVAL '4 days', NOW()),
(22, 'DPW-KGL-2026-1022', 'CMAU4491823', 'SL-CMA-7712', 'CMA CGM', 'Trust Industries Ltd', 'Procter & Gamble Egypt', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'FCL', 'Hygiene & Paper Pulp Raw Materials', 22400.00, 1, 'YELLOW', 'CLEARED', 'RRA-2026-DEC-10089', 'WAREHOUSE_STORED', 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '40 hours', NOW() - INTERVAL '16 hours', NULL, 40.0, FALSE, NOW() - INTERVAL '5 days', NOW()),
(23, 'DPW-KGL-2026-1023', 'MSCU9901824', 'SL-MSC-5531', 'MSC', 'Rwanda Mining & Petroleum Board', 'Metalor Technologies Zurich', 'DP World Masaka', 'Dar es Salaam Port', 'CENTRAL_CORRIDOR', 'BULK', 'Refined Wolframite & Coltan Concentrates', 29000.00, 2, 'RED', 'PHYSICAL_SCAN', 'RRA-2026-EXP-00460', 'INSPECTION_BAY', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '15 hours', NULL, NULL, 15.0, TRUE, NOW() - INTERVAL '3 days', NOW()),
(24, 'DPW-KGL-2026-1024', 'HLCU2219034', 'SL-HLC-3390', 'Hapag-Lloyd', 'Volcano Express Logistics', 'Scania Commercial Södertälje', 'Mombasa Port', 'DP World Masaka', 'NORTHERN_CORRIDOR', 'GENERAL_CARGO', 'Commercial Bus Engine Blocks & Transmission', 18200.00, 1, 'YELLOW', 'DOCUMENT_VERIFICATION', 'RRA-2026-DEC-10111', 'YARD_GATE_IN', 2, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '5 hours', NULL, NULL, 5.0, FALSE, NOW() - INTERVAL '2 days', NOW()),
(25, 'DPW-KGL-2026-1025', 'TEMU7718293', 'SL-TEM-1102', 'PIL', 'Urwibutso Enterprises (Nyirangarama)', 'Tetra Pak Arabia', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'FCL', 'Agave Juice & Chili Sauce Food Processing Lines', 23800.00, 2, 'GREEN', 'PENDING_DECLARATION', 'RRA-2026-DEC-10245', 'YARD_GATE_IN', 1, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', NULL, NULL, 3.0, TRUE, NOW() - INTERVAL '2 days', NOW()),
(26, 'DPW-KGL-2026-1026', 'MSKU6629183', 'SL-MSK-4410', 'Maersk', 'East African Granite Industries', 'Breton S.p.A. Italy', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'BULK', 'Diamond Cutting Blades for Granite Slabs', 15400.00, 1, 'YELLOW', 'CLEARED', 'RRA-2026-DEC-10167', 'WAREHOUSE_STORED', 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 hours', NOW() - INTERVAL '14 hours', NULL, 30.0, TRUE, NOW() - INTERVAL '4 days', NOW()),
(27, 'DPW-KGL-2026-1027', 'CMAU3381029', 'SL-CMA-9938', 'CMA CGM', 'Garden Fresh Rwanda', 'Marks & Spencer London', 'DP World Masaka', 'Mombasa Port', 'NORTHERN_CORRIDOR', 'COLD_CHAIN', 'Export French Green Beans & Avocadoes (Reefer)', 14200.00, 1, 'GREEN', 'CLEARED', 'RRA-2026-EXP-00481', 'WAREHOUSE_STORED', 4, NOW() - INTERVAL '1 day', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '16 hours', NULL, 18.0, TRUE, NOW() - INTERVAL '2 days', NOW()),
(28, 'DPW-KGL-2026-1028', 'MSCU4419280', 'SL-MSC-7749', 'MSC', 'Rwanda Energy Group (REG)', 'Siemens Energy Germany', 'Dar es Salaam Port', 'DP World Masaka', 'CENTRAL_CORRIDOR', 'HAZMAT', 'High-Voltage Transformer Dielectric Oil Drums', 31000.00, 2, 'RED', 'PHYSICAL_SCAN', 'RRA-2026-DEC-10190', 'INSPECTION_BAY', 5, NOW() - INTERVAL '1 day', NOW() - INTERVAL '11 hours', NULL, NULL, 11.0, TRUE, NOW() - INTERVAL '3 days', NOW()),
(29, 'DPW-KGL-2026-1029', 'HLCU5529104', 'SL-HLC-6628', 'Hapag-Lloyd', 'Empty Repositioning DPW', 'Maersk Logistics', 'DP World Masaka', 'Dar es Salaam Port', 'CENTRAL_CORRIDOR', 'FCL', 'Empty Dry Standard 40ft High-Cube Containers', 4400.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-EMP-00120', 'WAREHOUSE_STORED', 6, NOW() - INTERVAL '4 days', NOW() - INTERVAL '50 hours', NOW() - INTERVAL '48 hours', NULL, 50.0, FALSE, NOW() - INTERVAL '6 days', NOW()),
(30, 'DPW-KGL-2026-1030', 'TEMU1102948', 'SL-TEM-3312', 'PIL', 'Empty Repositioning DPW', 'CMA CGM Line', 'DP World Masaka', 'Mombasa Port', 'NORTHERN_CORRIDOR', 'COLD_CHAIN', 'Empty Reefer 40ft Pre-Trip Inspected Units', 6200.00, 2, 'GREEN', 'CLEARED', 'RRA-2026-EMP-00121', 'WAREHOUSE_STORED', 6, NOW() - INTERVAL '3 days', NOW() - INTERVAL '38 hours', NOW() - INTERVAL '36 hours', NULL, 38.0, FALSE, NOW() - INTERVAL '5 days', NOW());

SELECT setval('shipments_id_seq', (SELECT MAX(id) FROM shipments));

-- ----------------------------------------------------------------------------
-- 3. Seed: fleet_trips (20+ corridor fleet journeys)
-- ----------------------------------------------------------------------------
INSERT INTO fleet_trips (
    id, trip_number, truck_plate, trailer_number, driver_name, driver_phone, 
    transporter_company, corridor, origin_location, current_checkpoint, destination_hub, 
    status, assigned_shipment_id, departure_time, border_arrival_time, border_clearance_time, 
    gate_in_time, gate_out_time, turnaround_time_minutes, delay_reason, 
    gps_latitude, gps_longitude, created_at, updated_at
) VALUES
-- Dispatched & In Transit
(1, 'TRIP-2026-8801', 'RAD 492 K', 'RL 3901', 'Jean-Claude Bizimana', '+250 788 123 456', 'Bollore Africa Logistics', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Morogoro Weighbridge', 'DP World Masaka', 'IN_TRANSIT', 13, NOW() - INTERVAL '36 hours', NULL, NULL, NULL, NULL, 0, NULL, -6.823490, 37.663340, NOW() - INTERVAL '2 days', NOW()),
(2, 'TRIP-2026-8802', 'KBH 102 Z', 'ZD 8820', 'Omar Hassan Mwangi', '+254 722 987 654', 'Buzeki Enterprises Mombasa', 'NORTHERN_CORRIDOR', 'Mombasa Port', 'Eldoret Bypass', 'DP World Masaka', 'IN_TRANSIT', 16, NOW() - INTERVAL '40 hours', NULL, NULL, NULL, NULL, 0, NULL, 0.514277, 35.269780, NOW() - INTERVAL '2 days', NOW()),
(3, 'TRIP-2026-8803', 'RAC 812 M', 'RL 4412', 'Fidèle Kayitare', '+250 783 555 123', 'Intare Freight Transporters', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Singida Junction', 'DP World Masaka', 'IN_TRANSIT', 17, NOW() - INTERVAL '28 hours', NULL, NULL, NULL, NULL, 0, NULL, -4.816280, 34.743580, NOW() - INTERVAL '2 days', NOW()),

-- Border Crossing / Hold at Rusumo / Kagitumba
(4, 'TRIP-2026-8804', 'T 412 DFP', 'TZ 9912', 'Juma Rashid Bakari', '+255 754 332 110', 'Tahmeed Coach Cargo Dar', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Rusumo One-Stop Border Post', 'DP World Masaka', 'BORDER_HOLD', 15, NOW() - INTERVAL '50 hours', NOW() - INTERVAL '10 hours', NULL, NULL, NULL, 0, 'Tanzania Revenue Authority OSBP single-window sync delay', -2.382760, 30.785210, NOW() - INTERVAL '3 days', NOW()),
(5, 'TRIP-2026-8805', 'KDA 773 X', 'ZE 2201', 'Geoffrey Kiprop', '+254 710 445 990', 'Siginon Global Logistics', 'NORTHERN_CORRIDOR', 'Mombasa Port', 'Kagitumba OSBP', 'DP World Masaka', 'BORDER_HOLD', 14, NOW() - INTERVAL '48 hours', NOW() - INTERVAL '6 hours', NULL, NULL, NULL, 0, 'Uganda/Rwanda Single Customs Territory electronic cargo tracking seal check', -1.042250, 30.457890, NOW() - INTERVAL '3 days', NOW()),

-- Arrived at Masaka Gate / Unloading
(6, 'TRIP-2026-8806', 'RAD 772 P', 'RL 8810', 'Alexandre Munyaneza', '+250 788 667 890', 'Spedag Interfreight Rwanda', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Masaka Terminal Gate', 'DP World Masaka', 'GATE_IN_MASAKA', 10, NOW() - INTERVAL '54 hours', NOW() - INTERVAL '14 hours', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '4 hours', NULL, 0, NULL, -1.996120, 30.198420, NOW() - INTERVAL '3 days', NOW()),
(7, 'TRIP-2026-8807', 'RAD 331 B', 'RL 1109', 'Innocent Rutayisire', '+250 789 221 445', 'Transami Rwanda', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Inspection Bay Scanner #2', 'DP World Masaka', 'UNLOADING', 6, NOW() - INTERVAL '60 hours', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '16 hours', NOW() - INTERVAL '16 hours', NULL, 0, 'Awaiting physical scan RRA officer sign-off', -1.995800, 30.199100, NOW() - INTERVAL '4 days', NOW()),
(8, 'TRIP-2026-8808', 'KCG 550 Q', 'ZD 3310', 'David Mutua', '+254 733 112 344', 'Multiple Hauliers EA', 'NORTHERN_CORRIDOR', 'Mombasa Port', 'Masaka Terminal Gate', 'DP World Masaka', 'GATE_IN_MASAKA', 12, NOW() - INTERVAL '52 hours', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '1 hour', NULL, 0, NULL, -1.996120, 30.198420, NOW() - INTERVAL '3 days', NOW()),
(9, 'TRIP-2026-8809', 'RAD 990 L', 'RL 7731', 'Théogène Habineza', '+250 788 991 223', 'Cargo Link Rwanda', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Cold Hub Reefer Bay D2', 'DP World Masaka', 'UNLOADING', 4, NOW() - INTERVAL '56 hours', NOW() - INTERVAL '32 hours', NOW() - INTERVAL '30 hours', NOW() - INTERVAL '28 hours', NULL, 0, NULL, -1.996450, 30.197800, NOW() - INTERVAL '4 days', NOW()),

-- Fast Truck Turnaround (Departed & Logged)
(10, 'TRIP-2026-8810', 'RAD 118 T', 'RL 2205', 'Eric Ndikubwimana', '+250 788 334 556', 'Bollore Africa Logistics', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Outbound Gate 2', 'DP World Masaka', 'DEPARTED', 1, NOW() - INTERVAL '60 hours', NOW() - INTERVAL '52 hours', NOW() - INTERVAL '50 hours', NOW() - INTERVAL '48 hours', NOW() - INTERVAL '47 hours 18 minutes', 42, NULL, -1.996800, 30.196900, NOW() - INTERVAL '4 days', NOW()),
(11, 'TRIP-2026-8811', 'KBN 921 S', 'ZE 9902', 'Samuel Wanjala', '+254 721 883 221', 'Buzeki Enterprises Mombasa', 'NORTHERN_CORRIDOR', 'Mombasa Port', 'Outbound Gate 1', 'DP World Masaka', 'DEPARTED', 2, NOW() - INTERVAL '45 hours', NOW() - INTERVAL '40 hours', NOW() - INTERVAL '38 hours', NOW() - INTERVAL '36 hours', NOW() - INTERVAL '35 hours 15 minutes', 45, NULL, -1.996800, 30.196900, NOW() - INTERVAL '3 days', NOW()),
(12, 'TRIP-2026-8812', 'RAC 450 N', 'RL 6620', 'Gérard Nshimyumuremyi', '+250 788 554 998', 'Intare Freight Transporters', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Outbound Gate 2', 'DP World Masaka', 'DEPARTED', 5, NOW() - INTERVAL '70 hours', NOW() - INTERVAL '64 hours', NOW() - INTERVAL '62 hours', NOW() - INTERVAL '60 hours', NOW() - INTERVAL '59 hours 10 minutes', 50, NULL, -1.996800, 30.196900, NOW() - INTERVAL '5 days', NOW()),
(13, 'TRIP-2026-8813', 'RAD 552 V', 'RL 3311', 'Lambert Rukundo', '+250 788 772 119', 'Spedag Interfreight Rwanda', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Outbound Gate 1', 'DP World Masaka', 'DEPARTED', 21, NOW() - INTERVAL '38 hours', NOW() - INTERVAL '35 hours', NOW() - INTERVAL '34 hours', NOW() - INTERVAL '32 hours', NOW() - INTERVAL '31 hours 22 minutes', 38, NULL, -1.996800, 30.196900, NOW() - INTERVAL '3 days', NOW()),
(14, 'TRIP-2026-8814', 'KBZ 881 C', 'ZD 1102', 'Anthony Mwangi', '+254 724 661 228', 'Multiple Hauliers EA', 'NORTHERN_CORRIDOR', 'Mombasa Port', 'Outbound Gate 2', 'DP World Masaka', 'DEPARTED', 22, NOW() - INTERVAL '46 hours', NOW() - INTERVAL '42 hours', NOW() - INTERVAL '41 hours', NOW() - INTERVAL '40 hours', NOW() - INTERVAL '39 hours 12 minutes', 48, NULL, -1.996800, 30.196900, NOW() - INTERVAL '4 days', NOW()),
(15, 'TRIP-2026-8815', 'T 980 CVB', 'TZ 3301', 'Haruna Salim', '+255 784 119 220', 'Tahmeed Coach Cargo Dar', 'CENTRAL_CORRIDOR', 'Dar es Salaam Port', 'Outbound Gate 1', 'DP World Masaka', 'DEPARTED', 26, NOW() - INTERVAL '36 hours', NOW() - INTERVAL '32 hours', NOW() - INTERVAL '31 hours', NOW() - INTERVAL '30 hours', NOW() - INTERVAL '29 hours 20 minutes', 40, NULL, -1.996800, 30.196900, NOW() - INTERVAL '3 days', NOW());

SELECT setval('fleet_trips_id_seq', (SELECT MAX(id) FROM fleet_trips));

-- ----------------------------------------------------------------------------
-- 4. Seed: operational_metrics (14-day historical trend data)
-- ----------------------------------------------------------------------------
INSERT INTO operational_metrics (
    id, metric_date, teu_inbound_today, teu_outbound_today, teu_in_yard, 
    avg_truck_turnaround_mins, avg_dwell_time_days, bonded_utilization_pct, 
    non_bonded_utilization_pct, cold_chain_utilization_pct, customs_clearance_rate_pct, 
    green_channel_count, yellow_channel_count, red_channel_count, blue_channel_count, 
    active_bottlenecks_count, recorded_at
) VALUES
(1, CURRENT_DATE - 13, 142, 128, 3050, 48.5, 3.8, 76.2, 62.5, 78.0, 92.4, 28, 14, 6, 4, 1, NOW() - INTERVAL '13 days'),
(2, CURRENT_DATE - 12, 155, 139, 3066, 47.0, 3.7, 77.0, 63.8, 80.5, 93.1, 31, 16, 5, 5, 1, NOW() - INTERVAL '12 days'),
(3, CURRENT_DATE - 11, 138, 144, 3060, 46.2, 3.6, 76.5, 64.0, 81.2, 94.0, 27, 12, 4, 6, 0, NOW() - INTERVAL '11 days'),
(4, CURRENT_DATE - 10, 162, 150, 3072, 45.8, 3.5, 78.1, 65.2, 83.0, 91.8, 33, 18, 7, 4, 2, NOW() - INTERVAL '10 days'),
(5, CURRENT_DATE - 9,  170, 158, 3084, 46.5, 3.6, 79.4, 66.1, 84.5, 92.5, 35, 17, 6, 5, 1, NOW() - INTERVAL '9 days'),
(6, CURRENT_DATE - 8,  148, 142, 3090, 45.0, 3.5, 79.8, 65.9, 85.0, 95.2, 30, 15, 4, 6, 1, NOW() - INTERVAL '8 days'),
(7, CURRENT_DATE - 7,  180, 165, 3105, 44.5, 3.4, 81.0, 67.2, 86.8, 93.8, 38, 20, 8, 5, 2, NOW() - INTERVAL '7 days'),
(8, CURRENT_DATE - 6,  195, 172, 3128, 45.2, 3.4, 82.5, 68.0, 88.2, 91.0, 40, 22, 9, 6, 2, NOW() - INTERVAL '6 days'),
(9, CURRENT_DATE - 5,  188, 179, 3137, 43.8, 3.3, 83.2, 67.8, 89.0, 94.5, 39, 19, 7, 7, 2, NOW() - INTERVAL '5 days'),
(10, CURRENT_DATE - 4, 210, 185, 3162, 44.2, 3.3, 84.0, 68.5, 90.1, 89.8, 44, 24, 11, 6, 3, NOW() - INTERVAL '4 days'),
(11, CURRENT_DATE - 3, 205, 190, 3177, 43.5, 3.2, 84.5, 68.2, 90.5, 92.0, 42, 21, 8, 8, 3, NOW() - INTERVAL '3 days'),
(12, CURRENT_DATE - 2, 225, 198, 3204, 44.0, 3.1, 85.0, 69.1, 91.2, 90.5, 46, 26, 12, 7, 3, NOW() - INTERVAL '2 days'),
(13, CURRENT_DATE - 1, 238, 210, 3232, 43.1, 3.0, 84.8, 68.8, 91.0, 93.2, 49, 23, 10, 9, 3, NOW() - INTERVAL '1 day'),
(14, CURRENT_DATE,     246, 218, 3260, 42.4, 2.9, 84.0, 68.3, 90.8, 94.1, 52, 25, 9, 10, 3, NOW());

SELECT setval('operational_metrics_id_seq', (SELECT MAX(id) FROM operational_metrics));

-- ----------------------------------------------------------------------------
-- 5. Seed: bottleneck_alerts
-- ----------------------------------------------------------------------------
INSERT INTO bottleneck_alerts (
    id, alert_type, severity, title, description, affected_zone_or_corridor, 
    status, impact_summary, suggested_action, created_at, resolved_at
) VALUES
(1, 'BORDER_CROSSING_CONGESTION', 'HIGH', 'Rusumo OSBP Single-Window Synchronization Latency', 'Tanzania Revenue Authority and Rwanda Revenue Authority clearance interface encountering intermittent socket timeouts, causing 14-truck queue at Rusumo border entry.', 'CENTRAL_CORRIDOR (Rusumo Post)', 'ACTIVE', 'Average border crossing transit time increased by +4.8 hours for Dar es Salaam inbound fleet.', 'Authorize manual clearance verification fallback and notify dispatch fleet to schedule staggered departures from Morogoro.', NOW() - INTERVAL '7 hours', NULL),
(2, 'CUSTOMS_RED_CHANNEL_SURGE', 'HIGH', 'Physical Scan Queue Surge at Masaka Inspection Bay', '9 containers assigned to RRA Red Channel inspection awaiting physical examination. Scanner #2 undergoing optical sensor calibration.', 'ZONE-A-BONDED / Inspection Bay', 'ACTIVE', 'Yard dwell time for imported high-value electronics and telecoms cargo increased to 16.4 hours.', 'Divert LCL shipments to Bay 4 manual destuffing and expedite RRA customs officer shift rotation.', NOW() - INTERVAL '5 hours', NULL),
(3, 'COLD_CHAIN_TEMP_ANOMALY', 'MEDIUM', 'Zone D Reefer Bay 3 Temperature Warning (+3.4°C)', 'Cold room ambient reading drifted to 3.4°C (upper target bound: 4.0°C) following rapid destuffing of 2 reefer container boxes.', 'ZONE-D-COLD (Pharma Section)', 'INVESTIGATING', 'No pharmaceutical product breach yet, but threshold alert triggered for proactive containment.', 'Engage secondary HVAC chiller compressor and verify air curtain seal integrity at Bay D3.', NOW() - INTERVAL '2 hours', NULL),
(4, 'GATE_QUEUE_OVERFLOW', 'LOW', 'Morning Inbound Truck Peak at Gate 1 (Kigali Ring Road)', 'Brief traffic queue of 8 trucks on the Masaka access spur road between 07:15 and 08:00 during shift changeover.', 'Gate 1 / Inbound Scales', 'RESOLVED', 'Gate-in processing briefly dipped to 8 mins per truck before recovery.', 'Opened auxiliary scale #3; current gate turnaround normalized to 38 mins.', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '3 hours'),
(5, 'YARD_HIGH_DENSITY', 'MEDIUM', 'Empty Container Yard (Zone F) Capacity Reaching 74.4%', 'High concentration of 40ft High-Cube empties from shipping lines awaiting export cargo backhaul booking.', 'ZONE-F-EMPTY', 'ACTIVE', 'Yard stacking density approaching crane operational threshold.', 'Coordinate with Maersk & CMA CGM regional dispatch for empty re-positioning rakes and trucks to Mombasa/Dar.', NOW() - INTERVAL '1 day', NULL);

SELECT setval('bottleneck_alerts_id_seq', (SELECT MAX(id) FROM bottleneck_alerts));

-- ----------------------------------------------------------------------------
-- 6. Seed: executive_briefings
-- ----------------------------------------------------------------------------
INSERT INTO executive_briefings (
    id, briefing_date, generated_at, title, executive_summary, 
    operational_highlights, critical_risks, strategic_recommendations, raw_kpi_snapshot
) VALUES
(
    1, 
    CURRENT_DATE, 
    NOW() - INTERVAL '6 hours',
    'Masaka Inland Port — Daily Operations & Fleet Status Briefing',
    'Masaka Inland Port logistics and yard operations are running at high throughput today with 246 inbound TEUs and 218 outbound TEUs processed. Total dry port yard occupancy stands at 3,260 TEUs (71.2% overall capacity). Truck turnaround time (TAT) at Masaka gate has improved to an average of 42.4 minutes, well within the 45-minute operational target. Two operational items require shift supervisor attention: border synchronization latency at Rusumo (Central Corridor) and physical inspection queue congestion at the Masaka Red Channel Bay.',
    '[
        "Daily throughput hit 464 TEUs combined, a 5.2% increase compared to yesterday.",
        "Truck Turnaround Time (TAT) reached 42.4 minutes (Target < 45m), driven by fast-track Green Channel AEO releases.",
        "Cold Chain Hub (Zone D) maintains 90.8% occupancy with strict temperature control for critical pharma vaccines and export horticulture.",
        "Central Corridor fleet volume represents 68% of inbound freight, while Northern Corridor accounts for 32%."
    ]',
    '[
        "Rusumo OSBP customs single-window sync delay: 14 trucks experiencing +4.8h border transit delay.",
        "Inspection Bay Red Channel backlog: 9 containers awaiting scanner verification due to sensor maintenance on Scanner #2.",
        "Empty Yard Density (Zone F) at 74.4% capacity with rising 40ft container accumulation."
    ]',
    '[
        "Engage RRA Customs Directorate to deploy mobile container inspection scanner at Masaka Bay 4.",
        "Request Tanzania Port Authority & TRA liaison to activate offline contingency clearing at Rusumo.",
        "Trigger empty container repositioning incentive for tea and mineral export hauliers to evacuate Zone F empties to Mombasa."
    ]',
    '{
        "teuInbound": 246,
        "teuOutbound": 218,
        "teuInYard": 3260,
        "truckTurnaroundMins": 42.4,
        "avgDwellDays": 2.9,
        "bondedUtilPct": 84.0,
        "nonBondedUtilPct": 68.3,
        "coldChainUtilPct": 90.8,
        "customsClearanceRatePct": 94.1,
        "activeBottlenecks": 3
    }'
);

SELECT setval('executive_briefings_id_seq', (SELECT MAX(id) FROM executive_briefings));
