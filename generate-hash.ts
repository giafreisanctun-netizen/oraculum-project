import bcrypt from "bcryptjs";

async function run() {
  const hash = await bcrypt.hash("admin123", 10);

  console.log("HASH GERADO:");
  console.log(hash);
}

run();
