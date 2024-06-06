-- DropForeignKey
ALTER TABLE `PatientAppointment` DROP FOREIGN KEY `PatientAppointment_patientId_fkey`;

-- AddForeignKey
ALTER TABLE `PatientAppointment` ADD CONSTRAINT `PatientAppointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientAppointment` ADD CONSTRAINT `PatientAppointment_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
