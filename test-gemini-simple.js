const http = require('http');

function testGeminiSimple() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({});

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/informes/test-gemini',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log('🤖 Probando Gemini AI (endpoint simplificado)...');

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

async function runGeminiTest() {
    try {
        const result = await testGeminiSimple();
        
        console.log('\n📋 Resultado del test de Gemini:');
        console.log('Status HTTP:', result.status);
        
        if (result.data) {
            console.log('✅ Respuesta procesada:');
            console.log('- Success:', result.data.success);
            
            if (result.data.success) {
                console.log('- Tipo de informe:', result.data.tipo_informe);
                
                if (result.data.informe) {
                    const informe = result.data.informe;
                    console.log('- Título del informe:', informe.titulo);
                    console.log('- Fecha de generación:', informe.fecha_generacion);
                    console.log('- Resumen ejecutivo:', informe.resumen_ejecutivo?.substring(0, 150) + '...');
                    
                    if (informe.metricas_clave) {
                        console.log('- Métricas clave:', Object.keys(informe.metricas_clave));
                    }
                    
                    if (informe.recomendaciones && informe.recomendaciones.length > 0) {
                        console.log('- Número de recomendaciones:', informe.recomendaciones.length);
                        console.log('- Primera recomendación:', informe.recomendaciones[0].titulo);
                    }
                } else if (result.data.informe_texto) {
                    console.log('- Informe (texto plano):', result.data.informe_texto.substring(0, 200) + '...');
                }
                
                if (result.data.metadata) {
                    console.log('- Modelo AI:', result.data.metadata.model);
                    console.log('- Timestamp:', result.data.metadata.timestamp);
                }
            } else {
                console.log('❌ Error reportado:', result.data.message);
                console.log('- Detalles:', result.data.error);
            }
        } else {
            console.log('❌ Respuesta sin procesar:');
            console.log(result.rawData?.substring(0, 300) + '...');
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
    }
}

runGeminiTest();
