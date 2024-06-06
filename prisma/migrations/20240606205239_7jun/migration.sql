/*
  Warnings:

  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `patientId` VARCHAR(191) NOT NULL;
