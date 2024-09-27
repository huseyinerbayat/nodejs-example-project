import { Sequelize } from 'sequelize';

// Veritabanı bağlantı ayarları
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',  // Veritabanı sunucunuzun adresi (genellikle localhost)
  dialect: 'mysql',   // Kullanılan veritabanı türü (örnek: 'mysql', 'postgres', 'sqlite', 'mssql')
  logging: false,     // Konsola SQL sorguları yazdırmamak için false
});

export default sequelize;
