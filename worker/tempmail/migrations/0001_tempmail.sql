-- Migration number: 0001 	 2025-03-06T09:36:34.792Z

DROP TABLE IF EXISTS emails;
CREATE TABLE IF NOT EXISTS emails (
    "id" GUID PRIMARY KEY,
    "subject" VARCHAR(255) NULL,
    "body" VARCHAR(1000) NULL,
    "text" VARCHAR(255) NULL,
    "from" VARCHAR(255) NULL,
    "to" VARCHAR(255) NULL,
    "created_at" TIMESTAMP
);