/*
  Warnings:

  - You are about to drop the `PatientAppointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PatientAppointment` DROP FOREIGN KEY `PatientAppointment_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `PatientAppointment` DROP FOREIGN KEY `PatientAppointment_patientId_fkey`;

-- DropTable
DROP TABLE `PatientAppointment`;
