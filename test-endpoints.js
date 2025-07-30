const http = require('http');

// Función para hacer una petición HTTP simple
function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({
                        status: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Probar endpoints
async function runTests() {
    console.log('🚀 Iniciando pruebas de endpoints...\n');
    
    try {
        // Test 1: Health check simple
        console.log('1. Probando health check...');
        const healthResult = await testEndpoint('/api/informes/health');
        console.log('✅ Health check:', healthResult);
        
        // Test 2: Test simple
        console.log('\n2. Probando test simple...');
        const testResult = await testEndpoint('/api/informes/test-simple');
        console.log('✅ Test simple:', testResult);
        
        // Test 3: Estudiantes activos (endpoint existente)
        console.log('\n3. Probando estudiantes activos...');
        const estudiantesResult = await testEndpoint('/api/asistencia-tutorado/estudiantes/activos');
        console.log('✅ Estudiantes activos:', estudiantesResult);
        
        // Test 4: Crear datos de prueba primero
        console.log('\n4. Creando datos de prueba...');
        const datosResult = await testEndpoint('/api/asistencia-tutorado/datos-prueba', 'POST', {});
        console.log('✅ Datos de prueba:', datosResult);
        
        // Test 5: Test de Gemini (si hay datos)
        console.log('\n5. Probando Gemini AI...');
        const geminiData = {
            tutorId: 'TutorEjemplo',
            periodo: '2025-1',
            formato: 'resumido'
        };
        
        // Crear una versión simplificada del test
        console.log('Datos para Gemini:', geminiData);
        console.log('Gemini API Key configurada:', !!process.env.GEMINI_API_KEY);
        
    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
    }
}

runTests();
