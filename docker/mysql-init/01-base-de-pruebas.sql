-- Base separada para las pruebas de integración: la suite la borra y la recrea en cada corrida.
-- Si cambias DB_USER, cambia también el usuario de esta línea GRANT.
CREATE DATABASE IF NOT EXISTS tutorials_test;
GRANT ALL PRIVILEGES ON tutorials_test.* TO 'tutorials_app'@'%';
FLUSH PRIVILEGES;
