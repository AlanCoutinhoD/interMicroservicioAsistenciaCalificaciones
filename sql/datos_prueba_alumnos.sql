-- Script para crear datos de prueba en la base de datos de alumnos
-- Ejecutar este script en la base de datos 'alumnos'

-- Crear la tabla estudiantes si no existe
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    carrera VARCHAR(255),
    estatus_alumno VARCHAR(50) DEFAULT 'Activo',
    cuatrimestre_actual INT,
    grupo_actual VARCHAR(10),
    materia VARCHAR(255),
    periodo VARCHAR(50),
    tutor_academico VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar estudiantes de prueba para TutorEjemplo
INSERT INTO estudiantes (
    matricula, nombre, apellido_paterno, apellido_materno, carrera,
    estatus_alumno, cuatrimestre_actual, grupo_actual, materia, periodo,
    tutor_academico, email
) VALUES 
('123456', 'Juan', 'Pérez', 'García', 'Informática', 'Activo', 3, 'A', 'Matemáticas', '2025-1', 'TutorEjemplo', 'juan.perez@universidad.edu'),
('789012', 'María', 'García', 'López', 'Informática', 'Activo', 3, 'A', 'Matemáticas', '2025-1', 'TutorEjemplo', 'maria.garcia@universidad.edu'),
('345678', 'Pedro', 'López', 'Silva', 'Informática', 'Activo', 3, 'A', 'Matemáticas', '2025-1', 'TutorEjemplo', 'pedro.lopez@universidad.edu'),
('456789', 'Ana', 'Martínez', 'Hernández', 'Informática', 'Activo', 3, 'B', 'Física', '2025-1', 'TutorEjemplo', 'ana.martinez@universidad.edu'),
('567890', 'Carlos', 'Rodríguez', 'González', 'Sistemas', 'Activo', 2, 'A', 'Programación', '2025-1', 'TutorEjemplo', 'carlos.rodriguez@universidad.edu')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    apellido_paterno = VALUES(apellido_paterno),
    apellido_materno = VALUES(apellido_materno),
    carrera = VALUES(carrera),
    estatus_alumno = VALUES(estatus_alumno),
    cuatrimestre_actual = VALUES(cuatrimestre_actual),
    grupo_actual = VALUES(grupo_actual),
    materia = VALUES(materia),
    periodo = VALUES(periodo),
    tutor_academico = VALUES(tutor_academico),
    email = VALUES(email);

-- Insertar estudiantes de prueba para TutorDemo
INSERT INTO estudiantes (
    matricula, nombre, apellido_paterno, apellido_materno, carrera,
    estatus_alumno, cuatrimestre_actual, grupo_actual, materia, periodo,
    tutor_academico, email
) VALUES 
('654321', 'Sofia', 'Hernández', 'Morales', 'Administración', 'Activo', 4, 'A', 'Contabilidad', '2025-1', 'TutorDemo', 'sofia.hernandez@universidad.edu'),
('321987', 'Roberto', 'González', 'Jiménez', 'Administración', 'Activo', 4, 'A', 'Mercadotecnia', '2025-1', 'TutorDemo', 'roberto.gonzalez@universidad.edu'),
('789654', 'Elena', 'Jiménez', 'Ruiz', 'Administración', 'Activo', 4, 'B', 'Finanzas', '2025-1', 'TutorDemo', 'elena.jimenez@universidad.edu')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    apellido_paterno = VALUES(apellido_paterno),
    apellido_materno = VALUES(apellido_materno),
    carrera = VALUES(carrera),
    estatus_alumno = VALUES(estatus_alumno),
    cuatrimestre_actual = VALUES(cuatrimestre_actual),
    grupo_actual = VALUES(grupo_actual),
    materia = VALUES(materia),
    periodo = VALUES(periodo),
    tutor_academico = VALUES(tutor_academico),
    email = VALUES(email);

-- Verificar los datos insertados
SELECT 
    matricula,
    CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) as nombre_completo,
    carrera,
    cuatrimestre_actual,
    grupo_actual,
    tutor_academico,
    estatus_alumno
FROM estudiantes 
WHERE tutor_academico IN ('TutorEjemplo', 'TutorDemo')
ORDER BY tutor_academico, matricula;
