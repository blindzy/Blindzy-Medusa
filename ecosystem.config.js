// /var/www/Blindzy-Medusa/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "medusa-api",
      script: "pnpm",
      args: "run start",
      cwd: "/var/www/Blindzy-Medusa",
      interpreter: "none",
      env_file: "/var/www/Blindzy-Medusa/.env",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
