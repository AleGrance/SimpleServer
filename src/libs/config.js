const postgres = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS.toString(),
  params: {
    dialect: "postgres",
    host: "host.docker.internal",
    // host: "localhost",
    port: 5432,
  },
};

export { postgres };