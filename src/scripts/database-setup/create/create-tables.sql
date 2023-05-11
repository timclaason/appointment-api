CREATE TABLE location (
	locationId TEXT NOT NULL, 
	locationName TEXT NOT NULL,
	PRIMARY KEY (locationId)
);

CREATE TABLE patient (
	mrn TEXT NOT NULL, 
	firstName TEXT NOT NULL,
	lastName TEXT NOT NULL,
	birthdate DATE NOT NULL,
	locationId TEXT NOT NULL,
	PRIMARY KEY (mrn),
	FOREIGN KEY (locationId) REFERENCES location(locationId)
);

CREATE TABLE physician (
	npi TEXT NOT NULL, 
	firstName TEXT NOT NULL,
	lastName TEXT NOT NULL,
	PRIMARY KEY (npi)
);

CREATE TABLE appointment (
	appointmentId TEXT NOT NULL,
	mrn TEXT NOT NULL, 
	npi TEXT NOT NULL, 
	time TIMESTAMP NOT NULL,
	PRIMARY KEY (appointmentId),
	FOREIGN KEY (mrn) REFERENCES patient(mrn)
);