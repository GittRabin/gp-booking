import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the passwords for security
  const adminPassword = await bcrypt.hash('adminpassword', 10);
  const doctorPassword = await bcrypt.hash('doctorpassword', 10);
  const patientPassword = await bcrypt.hash('patientpassword', 10);

  // Create Admin users
  const user1 = await prisma.user.create({
    data: {
      name: 'ADMIN 1',
      email: 'admin1@example.com',
      password: adminPassword,
    },
  });

  const admin1 = await prisma.admin.create({
    data: {
      userId: user1.id,
    },
  });

  // Create Clinics
  const clinic1 = await prisma.clinic.create({
    data: {
      name: 'Clinic One',
      location: 'Location One',
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'Clinic Two',
      location: 'Location Two',
    },
  });

  // Create Doctor users
  const doctor1 = await prisma.user.create({
    data: {
      name: 'Doctor One',
      email: 'doctor1@example.com',
      password: doctorPassword,
      doctor: {
        create: {
          name: 'Doctor One',
          location: 'Location One',
          clinics: {
            create: {
              clinic: {
                connect: { id: clinic1.id },
              },
            },
          },
        },
      },
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'doctor2@example.com',
      password: doctorPassword,
      name: 'Doctor Two',
      doctor: {
        create: {
          name: 'Doctor Two',
          location: 'Location Two',
          clinics: {
            create: {
              clinic: {
                connect: { id: clinic2.id },
              },
            },
          },
        },
      },
    },
  });

  const doctor3 = await prisma.user.create({
    data: {
      email: 'doctor3@example.com',
      password: doctorPassword,
      name: 'Doctor Three',
      doctor: {
        create: {
          name: 'Doctor Three',
          location: 'Location Three',
          clinics: {
            create: {
              clinic: {
                connect: { id: clinic1.id },
              },
            },
          },
        },
      },
    },
  });

  // Create Patient users
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@example.com',
      password: patientPassword,
      name: 'Patient One',
      patient: {
        create: {
          name: 'Patient One',
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@example.com',
      password: patientPassword,
      name: 'Patient Two',
      patient: {
        create: {
          name: 'Patient Two',
        },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'patient3@example.com',
      password: patientPassword,
      name: 'Patient Three',
      patient: {
        create: {
          name: 'Patient Three',
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
