import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const staffPassword = process.env.SEED_STAFF_PASSWORD || "Staff@12345";

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const staffHash = await bcrypt.hash(staffPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "माननीय विधायक (Admin)",
      email: "admin@example.com",
      passwordHash: adminHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const staff = await prisma.adminUser.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      name: "कार्यालय स्टाफ",
      email: "staff@example.com",
      passwordHash: staffHash,
      role: "STAFF",
      status: "ACTIVE",
    },
  });

  console.log("Seed complete:");
  console.log(`  ADMIN  -> email: ${admin.email}  password: ${adminPassword}`);
  console.log(`  STAFF  -> email: ${staff.email}  password: ${staffPassword}`);
  console.log("\nChange these passwords after first login in production.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
