-- Database Schema for Intelligent Pharmacy Inventory Management System (IPIMS)
-- Compatible with MySQL/MariaDB
SET FOREIGN_KEY_CHECKS = 0;
-- -----------------------------------------------------------------------------
-- 1. Users Table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords in production
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -----------------------------------------------------------------------------
-- 2. Categories Table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);
-- -----------------------------------------------------------------------------
-- 3. Suppliers Table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -----------------------------------------------------------------------------
-- 4. Inventory Table (Drugs)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS inventory_items;
CREATE TABLE inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    batch_number VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    current_stock INT DEFAULT 0,
    min_stock_threshold INT DEFAULT 10,
    expiry_date DATE,
    manufactured_date DATE,
    category_id BIGINT,
    supplier_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);
-- -----------------------------------------------------------------------------
-- 5. Transactions Table (History)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id BIGINT NOT NULL,
    type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity_change INT NOT NULL,
    reason VARCHAR(255),
    performed_by VARCHAR(255), -- Could be FK to users(id) if strict tracking needed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);
SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================
-- SAMPLE DATA POPULATION
-- =============================================================================
-- 1. Users
INSERT INTO users (full_name, email, password, role) VALUES
('Pasan Induwara', 'pasan@example.com', '$2a$10$YourHashedPasswordHere', 'ADMIN'), -- Password: password
('Staff Member', 'staff@example.com', '$2a$10$YourHashedPasswordHere', 'USER');
-- 2. Categories
INSERT INTO categories (name, description) VALUES
('Antibiotics', 'Drugs that fight bacterial infections'),
('Analgesics', 'Pain relievers'),
('Antihistamines', 'Allergy relief medications'),
('Antipyretics', 'Fever reducers'),
('Cardiovascular', 'Heart and blood pressure medications'),
('Diabetic', 'Insulin and other diabetes medications'),
('Vitamins', 'Supplements and vitamins'),
('Respiratory', 'Asthma and lung medications'),
('Gastrointestinal', 'Stomach and digestive aids'),
('Topical', 'Creams, ointments and gels');
-- 3. Suppliers
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address) VALUES
('MediCare Pharma', 'John Doe', 'john@medicare.com', '+1 555-0101', '123 Health St, NY'),
('Global Health Supplies', 'Jane Smith', 'jane@globalhealth.com', '+1 555-0102', '456 Wellness Ave, CA'),
('PharmaLine Distributors', 'Robert Brown', 'robert@pharmaline.com', '+1 555-0103', '789 Medicine Rd, TX'),
('Sunshine Medicals', 'Sarah White', 'sarah@sunmed.com', '+1 555-0104', '321 Care Blvd, FL'),
('QuickCure Logistics', 'Mike Green', 'mike@quickcure.com', '+1 555-0105', '654 Fast Ln, WA');
-- 4. Inventory Items (100 Samples)
INSERT INTO inventory_items (brand_name, generic_name, dosage, batch_number, unit_price, current_stock, min_stock_threshold, expiry_date, manufactured_date, category_id, supplier_id) VALUES
-- Antibiotics
('Amoxil', 'Amoxicillin', '500mg', 'BTC001', 0.50, 500, 50, '2025-12-31', '2023-01-01', 1, 1),
('Augmentin', 'Amoxicillin/Clavulanate', '625mg', 'BTC002', 1.20, 200, 30, '2025-11-15', '2023-05-10', 1, 2),
('Zithromax', 'Azithromycin', '250mg', 'BTC003', 2.50, 150, 20, '2024-08-20', '2022-08-20', 1, 3),
('Cipro', 'Ciprofloxacin', '500mg', 'BTC004', 0.80, 400, 40, '2026-01-10', '2024-01-01', 1, 4),
('Keflex', 'Cephalexin', '500mg', 'BTC005', 0.60, 300, 30, '2025-06-30', '2023-06-01', 1, 5),
('Doxy', 'Doxycycline', '100mg', 'BTC006', 0.40, 250, 25, '2024-12-01', '2022-12-01', 1, 1),
('Flagyl', 'Metronidazole', '400mg', 'BTC007', 0.30, 600, 50, '2025-10-20', '2023-10-01', 1, 2),
('Bactrim', 'Sulfamethoxazole', '800mg', 'BTC008', 0.70, 100, 20, '2024-05-15', '2022-05-15', 1, 3), -- Expiring soon maybe?
('Levoria', 'Levofloxacin', '500mg', 'BTC009', 1.50, 80, 20, '2026-03-15', '2024-01-01', 1, 4),
('Vancocin', 'Vancomycin', '250mg', 'BTC010', 5.00, 50, 10, '2025-09-01', '2023-09-01', 1, 5),
-- Analgesics
('Panadol', 'Paracetamol', '500mg', 'BTC011', 0.10, 5000, 500, '2028-01-01', '2024-01-01', 2, 1),
('Tylenol', 'Acetaminophen', '500mg', 'BTC012', 0.12, 4500, 400, '2027-06-15', '2023-06-15', 2, 2),
('Advil', 'Ibuprofen', '400mg', 'BTC013', 0.20, 3000, 300, '2026-11-20', '2023-11-20', 2, 3),
('Motrin', 'Ibuprofen', '200mg', 'BTC014', 0.15, 2000, 200, '2026-12-01', '2023-12-01', 2, 4),
('Aleve', 'Naproxen', '220mg', 'BTC015', 0.25, 1500, 150, '2027-02-28', '2024-02-01', 2, 5),
('Voltaren', 'Diclofenac', '50mg', 'BTC016', 0.40, 1000, 100, '2025-08-10', '2022-08-10', 2, 1),
('Aspirin', 'Acetylsalicylic Acid', '100mg', 'BTC017', 0.05, 8000, 500, '2026-05-05', '2023-05-05', 2, 2),
('Celebrex', 'Celecoxib', '200mg', 'BTC018', 1.10, 400, 40, '2025-12-12', '2023-12-12', 2, 3),
('Tramal', 'Tramadol', '50mg', 'BTC019', 0.80, 300, 30, '2025-04-01', '2022-04-01', 2, 4),
('OxyContin', 'Oxycodone', '10mg', 'BTC020', 3.50, 50, 10, '2024-11-15', '2021-11-15', 2, 5), -- Short expiry
-- Cardiovascular
('Lipitor', 'Atorvastatin', '20mg', 'BTC021', 1.00, 800, 80, '2026-07-20', '2024-01-01', 5, 1),
('Crestor', 'Rosuvastatin', '10mg', 'BTC022', 1.30, 700, 70, '2026-09-10', '2024-01-01', 5, 2),
('Norvasc', 'Amlodipine', '5mg', 'BTC023', 0.40, 1200, 100, '2027-01-15', '2024-01-01', 5, 3),
('Diovan', 'Valsartan', '160mg', 'BTC024', 0.90, 600, 60, '2025-11-05', '2023-01-01', 5, 4),
('Cozaar', 'Losartan', '50mg', 'BTC025', 0.50, 900, 90, '2026-05-30', '2023-05-30', 5, 5),
('Plavix', 'Clopidogrel', '75mg', 'BTC026', 1.40, 500, 50, '2025-08-25', '2023-01-01', 5, 1),
('Lasix', 'Furosemide', '40mg', 'BTC027', 0.20, 400, 40, '2026-02-14', '2024-01-01', 5, 2),
('Inderal', 'Propranolol', '40mg', 'BTC028', 0.30, 350, 35, '2025-10-30', '2023-01-01', 5, 3),
('Tenormin', 'Atenolol', '50mg', 'BTC029', 0.35, 300, 30, '2025-12-01', '2023-01-01', 5, 4),
('Zestril', 'Lisinopril', '10mg', 'BTC030', 0.45, 1100, 100, '2027-03-20', '2024-01-01', 5, 5),
-- Diabetic
('Glucophage', 'Metformin', '500mg', 'BTC031', 0.15, 3000, 300, '2026-11-11', '2023-11-11', 6, 1),
('Januvia', 'Sitagliptin', '100mg', 'BTC032', 2.00, 200, 20, '2025-09-09', '2023-01-01', 6, 2),
('Lantus', 'Insulin Glargine', '100U/ml', 'BTC033', 15.00, 100, 20, '2024-08-15', '2022-08-15', 6, 3), -- Cold storage, watch expiry
('Humalog', 'Insulin Lispro', '100U/ml', 'BTC034', 12.00, 80, 15, '2024-07-01', '2022-07-01', 6, 4), -- Short expiry
('Diamicron', 'Gliclazide', '80mg', 'BTC035', 0.50, 600, 60, '2025-12-25', '2023-01-01', 6, 5),
('Amaryl', 'Glimepiride', '2mg', 'BTC036', 0.40, 500, 50, '2026-04-10', '2024-01-01', 6, 1),
('Actos', 'Pioglitazone', '30mg', 'BTC037', 0.90, 300, 30, '2025-10-10', '2023-01-01', 6, 2),
('Victoza', 'Liraglutide', '6mg/ml', 'BTC038', 40.00, 20, 5, '2025-06-30', '2023-06-30', 6, 3),
('Trulicity', 'Dulaglutide', '1.5mg', 'BTC039', 45.00, 15, 5, '2025-05-15', '2023-05-15', 6, 4),
('Jardiance', 'Empagliflozin', '10mg', 'BTC040', 2.50, 150, 15, '2026-08-08', '2024-01-01', 6, 5),
-- Respiratory
('Ventolin', 'Salbutamol', '100mcg', 'BTC041', 3.50, 500, 50, '2025-11-30', '2023-01-01', 8, 1),
('Symbicort', 'Budesonide/Formoterol', '160/4.5', 'BTC042', 25.00, 100, 20, '2025-07-20', '2023-01-01', 8, 2),
('Seretide', 'Fluticasone/Salmeterol', '250/50', 'BTC043', 30.00, 80, 15, '2025-06-15', '2023-01-01', 8, 3),
('Singulair', 'Montelukast', '10mg', 'BTC044', 0.80, 400, 40, '2026-09-01', '2024-01-01', 8, 4),
('Zyrtec', 'Cetirizine', '10mg', 'BTC045', 0.30, 2000, 200, '2027-02-14', '2024-02-14', 3, 5), -- Antihistamine
('Claritin', 'Loratadine', '10mg', 'BTC046', 0.35, 1800, 180, '2027-03-30', '2024-03-30', 3, 1),
('Allegra', 'Fexofenadine', '180mg', 'BTC047', 0.60, 1000, 100, '2026-12-12', '2023-12-12', 3, 2),
('Benadryl', 'Diphenhydramine', '25mg', 'BTC048', 0.10, 1500, 150, '2025-10-31', '2022-10-31', 3, 3),
('Nasonex', 'Mometasone', '50mcg', 'BTC049', 8.00, 200, 20, '2025-05-20', '2023-01-01', 8, 4),
('Pulmicort', 'Budesonide', '0.5mg', 'BTC050', 1.50, 300, 30, '2025-08-08', '2023-01-01', 8, 5),
-- Gastrointestinal
('Nexium', 'Esomeprazole', '40mg', 'BTC051', 1.20, 600, 60, '2026-04-15', '2024-01-01', 9, 1),
('Losec', 'Omeprazole', '20mg', 'BTC052', 0.50, 1000, 100, '2026-05-20', '2024-01-01', 9, 2),
('Zantac', 'Ranitidine', '150mg', 'BTC053', 0.40, 800, 80, '2025-11-10', '2023-01-01', 9, 3),
('Imodium', 'Loperamide', '2mg', 'BTC054', 0.20, 1200, 120, '2027-01-01', '2024-01-01', 9, 4),
('Dulcolax', 'Bisacodyl', '5mg', 'BTC055', 0.15, 1500, 150, '2026-10-10', '2023-10-10', 9, 5),
('Gaviscon', 'Alginate', '10ml', 'BTC056', 5.00, 300, 30, '2025-09-30', '2023-09-30', 9, 1),
('Buscopan', 'Hyoscine', '10mg', 'BTC057', 0.40, 500, 50, '2026-02-28', '2024-01-01', 9, 2),
('Motilium', 'Domperidone', '10mg', 'BTC058', 0.30, 600, 60, '2025-12-15', '2023-01-01', 9, 3),
('Pepto', 'Bismuth', '30ml', 'BTC059', 4.00, 200, 20, '2025-07-15', '2023-07-15', 9, 4),
('Probiotic', 'Acidophilus', '10Bn CFU', 'BTC060', 15.00, 100, 10, '2025-04-30', '2023-04-30', 9, 5),
-- Vitamins & Supplements
('Centrum', 'Multivitamin', 'Tablet', 'BTC061', 0.20, 2000, 200, '2026-08-01', '2023-08-01', 7, 1),
('Neurobion', 'Vitamin B Complex', 'Tablet', 'BTC062', 0.30, 1500, 150, '2026-09-15', '2023-09-15', 7, 2),
('Caltrate', 'Calcium + D', '600mg', 'BTC063', 0.15, 1200, 120, '2026-11-20', '2023-11-20', 7, 3),
('Feroglobin', 'Iron', 'Capsule', 'BTC064', 0.25, 1000, 100, '2025-12-31', '2022-12-31', 7, 4),
('Vit C', 'Ascorbic Acid', '500mg', 'BTC065', 0.10, 5000, 500, '2027-05-10', '2024-05-10', 7, 5),
('Vit D3', 'Cholecalciferol', '1000IU', 'BTC066', 0.12, 3000, 300, '2027-06-20', '2024-06-20', 7, 1),
('Vit E', 'Tocopherol', '400IU', 'BTC067', 0.18, 2000, 200, '2026-10-05', '2023-10-05', 7, 2),
('Omega 3', 'Fish Oil', '1000mg', 'BTC068', 0.25, 1500, 150, '2025-08-30', '2022-08-30', 7, 3),
('Zinc', 'Zinc Gluconate', '50mg', 'BTC069', 0.15, 1800, 180, '2026-12-15', '2023-12-15', 7, 4),
('Magnesium', 'Magnesium Citrate', '250mg', 'BTC070', 0.20, 1200, 120, '2026-09-09', '2023-09-09', 7, 5),
-- Topical
('Betnovate', 'Betamethasone', '20g', 'BTC071', 3.50, 200, 20, '2025-11-01', '2022-11-01', 10, 1),
('Fucidin', 'Fusidic Acid', '15g', 'BTC072', 4.00, 150, 15, '2025-10-15', '2022-10-15', 10, 2),
('Daktarin', 'Miconazole', '20g', 'BTC073', 3.00, 180, 18, '2026-01-20', '2023-01-01', 10, 3),
('Zovirax', 'Aciclovir', '10g', 'BTC074', 5.00, 100, 10, '2025-12-10', '2022-12-10', 10, 4),
('Canesten', 'Clotrimazole', '20g', 'BTC075', 3.20, 250, 25, '2026-03-05', '2023-03-05', 10, 5),
('Voltaren Gel', 'Diclofenac', '50g', 'BTC076', 6.00, 300, 30, '2025-08-20', '2022-08-20', 10, 1),
('Scabex', 'Permethrin', '30g', 'BTC077', 3.50, 80, 10, '2025-06-15', '2022-06-15', 10, 2),
('Burnol', 'Antiseptic Cream', '20g', 'BTC078', 1.50, 500, 50, '2027-01-01', '2024-01-01', 10, 3),
('Soframycin', 'Framycetin', '20g', 'BTC079', 2.00, 400, 40, '2026-05-15', '2023-05-15', 10, 4),
('Kenacomb', 'Triamcinolone', '15g', 'BTC080', 5.50, 100, 10, '2025-09-10', '2022-09-10', 10, 5),
-- Misc / Reorder items (Low Stock)
('Panadol Extra', 'Paracetamol/Caffeine', '500/65', 'BTC081', 0.15, 20, 50, '2026-10-01', '2024-01-01', 2, 1), -- Low Stock
('Augmentin ES', 'Amox/Clav', '642mg', 'BTC082', 1.50, 5, 25, '2025-12-01', '2023-05-01', 1, 2), -- Very Low Stock
('Amoxil Syrap', 'Amoxicillin', '125mg/5ml', 'BTC083', 2.00, 15, 30, '2025-08-01', '2023-01-01', 1, 1),
('Brufen', 'Ibuprofen', '600mg', 'BTC084', 0.25, 0, 40, '2026-02-01', '2023-01-01', 2, 3), -- Out of Stock
('Ventolin Inh', 'Salbutamol', '200 dose', 'BTC085', 4.00, 45, 50, '2026-01-01', '2023-01-01', 8, 1),
-- Misc / Expiring Soon items
('ShortExpiry1', 'Generic A', '10mg', 'BTC086', 1.00, 100, 10, '2025-01-10', '2023-01-01', 2, 1), -- Expiring very soon (assuming current date is around late 2024/2025 in simulation)
('ShortExpiry2', 'Generic B', '20mg', 'BTC087', 1.00, 100, 10, '2025-01-15', '2023-01-01', 2, 2),
('ShortExpiry3', 'Generic C', '30mg', 'BTC088', 1.00, 100, 10, '2025-01-20', '2023-01-01', 2, 3),
('ShortExpiry4', 'Generic D', '40mg', 'BTC089', 1.00, 100, 10, '2025-01-25', '2023-01-01', 2, 4),
('ExpiredItem1', 'Old Drug A', '50mg', 'BTC090', 0.50, 50, 10, '2023-01-01', '2021-01-01', 2, 5), -- Already Expired 
('ExpiredItem2', 'Old Drug B', '60mg', 'BTC091', 0.50, 50, 10, '2023-06-01', '2021-06-01', 2, 1), -- Already Expired
-- Fillers
('Filler1', 'Test Drug 1', '10mg', 'BTC092', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 1),
('Filler2', 'Test Drug 2', '10mg', 'BTC093', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 2),
('Filler3', 'Test Drug 3', '10mg', 'BTC094', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 3),
('Filler4', 'Test Drug 4', '10mg', 'BTC095', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 4),
('Filler5', 'Test Drug 5', '10mg', 'BTC096', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 5),
('Filler6', 'Test Drug 6', '10mg', 'BTC097', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 1),
('Filler7', 'Test Drug 7', '10mg', 'BTC098', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 2),
('Filler8', 'Test Drug 8', '10mg', 'BTC099', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 3),
('Filler9', 'Test Drug 9', '10mg', 'BTC100', 1.00, 500, 50, '2026-01-01', '2024-01-01', 7, 4);
-- 5. Transactions (Sample History)
INSERT INTO transactions (inventory_item_id, type, quantity_change, reason, performed_by) VALUES
(1, 'IN', 500, 'Initial Stock', 'Pasan Induwara'),
(2, 'IN', 200, 'Initial Stock', 'Pasan Induwara'),
(3, 'IN', 150, 'Initial Stock', 'Pasan Induwara'),
(1, 'OUT', -10, 'Dispensed to patient', 'Staff Member'),
(1, 'OUT', -5, 'Dispensed to patient', 'Staff Member'),
(2, 'OUT', -20, 'Dispensed to patient', 'Staff Member'),
(4, 'IN', 400, 'Initial Stock', 'Pasan Induwara'),
(81, 'IN', 50, 'Restock', 'Pasan Induwara'),
(81, 'OUT', -30, 'Bulk Order', 'Staff Member'),
(84, 'IN', 50, 'Initial Stock', 'Pasan Induwara'),
(84, 'OUT', -50, 'Expired/Damaged', 'Pasan Induwara');