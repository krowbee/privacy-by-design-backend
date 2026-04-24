import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
function createBaseClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

const prisma = createBaseClient();

async function main() {
  await prisma.consentDocument.create({
    data: {
      title: 'Privacy Policy Consent',
      version: '1.0.0',
      isActive: true,
      content: `
I agree that my personal data may be collected and processed for the purpose of providing the service.

The personal data may include:
- first name and last name;
- passport details;
- residential address;
- contact and account information.

I understand that my data will be used only for service-related purposes, identity verification, legal compliance, security, and communication.

I understand that I have the right to access, correct, delete, restrict, or object to the processing of my personal data where applicable.

I also understand that I may withdraw my consent at any time, but this will not affect processing that was already lawfully performed before withdrawal.

By continuing, I confirm that I have read and accepted this Privacy Policy Consent.
      `.trim(),
    },
  });

  console.log('Consent document seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
