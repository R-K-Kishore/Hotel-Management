-- Hotel Management System - Database Schema
-- Run this file to create the required database and tables

-- Create the database (run this separately if needed)
-- CREATE DATABASE hotel_management;

-- Connect to hotel_management database before running the rest

-- 1. Create the hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id          SERIAL PRIMARY KEY,
  image       VARCHAR(255),
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  address     VARCHAR(255),
  city        VARCHAR(100),
  state       VARCHAR(100),
  country     VARCHAR(100) DEFAULT 'India',
  facilities  TEXT,
  latitude    DECIMAL(10, 7) NOT NULL,
  longitude   DECIMAL(10, 7) NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all optional columns exist if table was already created
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS facilities TEXT;

-- 2. Create the hotel_images gallery table
CREATE TABLE IF NOT EXISTS hotel_images (
  id          SERIAL PRIMARY KEY,
  hotel_id    INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  category    VARCHAR(100) NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  caption     VARCHAR(255),
  source_info VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
