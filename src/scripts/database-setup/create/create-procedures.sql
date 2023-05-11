CREATE PROCEDURE find_patient_by_name_and_birthdate( IN first_name TEXT, IN last_name TEXT, IN birthdate TEXT)
AS
BEGIN
    SELECT * FROM patient WHERE firstName = first_name AND lastName = last_name AND birthdate = birthdate;
END

CREATE PROCEDURE find_patient_by_mrn_and_location(IN mrn TEXT,IN location TEXT)
AS
BEGIN
    SELECT * FROM patient WHERE mrn = mrn AND location = location;
END