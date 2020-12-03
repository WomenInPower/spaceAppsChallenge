DROP TABLE IF EXISTS users;

/**
 * Write SQL that creates a table named 'people'
 * it should match this schema
 * id BIGSERIAL PRIMARY KEY
 * first_name string with length 256 not null
 * last_name string with length 256 not null
 * email string with length 256 not null unique
 * password string with length 256
 * salt string with length 256
 * googleId string with length 256
 * created_at timestamp with timezone not null defaults to now
 * updated_at timestamp with timezone
 * deleted_at timestamp with timezone
 ***/

 CREATE TABLE USERS (
   id BIGSERIAL PRIMARY KEY,
   first_name VARCHAR(256) NOT NULL,
   last_name VARCHAR(256) NOT NULL,
   email VARCHAR(256) NOT NULL UNIQUE,
   password VARCHAR(256),
   salt VARCHAR(256),
   googleId VARCHAR(256),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ,
   deleted_at TIMESTAMPTZ
 )
