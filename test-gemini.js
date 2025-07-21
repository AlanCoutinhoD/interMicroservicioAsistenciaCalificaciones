const http = require('http');

function testGeminiEndpoint() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            tutorId: 'TutorEjemplo',
            periodo: '2025-1',
            formato: 'resumido',
            incluirRecomendaciones: true
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/informes/asistencia',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log('📤 Enviando petición a Gemini AI...');
        console.log('📊 Datos:', JSON.parse(data));

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
                        rawData: responseData
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function testGemini() {
    try {
        console.log('🤖 Probando integración con Gemini AI...\n');
        
        const result = await testGeminiEndpoint();
        
        console.log('📋 Resultado:');
        console.log('Status:', result.status);
        
        if (result.data) {
            console.log('✅ Respuesta exitosa:');
            console.log('- Success:', result.data.success);
            console.log('- Tipo:', result.data.tipo_informe);
            
            if (result.data.informe) {
                console.log('- Informe generado:', typeof result.data.informe);
                console.log('- Título:', result.data.informe.titulo);
            } else if (result.data.informe_texto) {
                console.log('- Informe (texto):', result.data.informe_texto.substring(0, 200) + '...');
            }
            
            if (result.data.metadata) {
                console.log('- Modelo usado:', result.data.metadata.model);
                console.log('- Timestamp:', result.data.metadata.timestamp);
            }
        } else {
            console.log('❌ Error en respuesta:');
            console.log(result.rawData);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testGemini();
