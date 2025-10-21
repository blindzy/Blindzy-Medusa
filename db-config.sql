ALTER SYSTEM SET max_connections = '150';
ALTER SYSTEM SET superuser_reserved_connections = '3';
ALTER DATABASE medusa CONNECTION LIMIT 100;