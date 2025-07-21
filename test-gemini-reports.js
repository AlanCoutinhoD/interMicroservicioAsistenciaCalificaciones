// Cargar variables de entorno
require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');

class GeminiReportTester {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            test_session_id: `session-${Date.now()}`,
            tests_performed: [],
            summary: {
                total_tests: 0,
                successful_tests: 0,
                failed_tests: 0,
                reports_generated: 0
            }
        };
    }

    async testEndpoint(endpoint, method = 'POST', data = {}) {
        return new Promise((resolve, reject) => {
            const postData = method === 'POST' ? JSON.stringify(data) : '';
            
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: endpoint,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Solo agregar Content-Length para métodos que requieren cuerpo
            if (method === 'POST' && postData) {
                options.headers['Content-Length'] = postData.length;
            }

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
                            data: parsed,
                            raw: responseData
                        });
                    } catch (e) {
                        resolve({
                            status: res.statusCode,
                            raw: responseData,
                            parseError: e.message
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.setTimeout(60000, () => {
                req.destroy();
                reject(new Error('Timeout - El informe tomó más de 60 segundos en generarse'));
            });

            if (method === 'POST' && postData) {
                req.write(postData);
            }
            
            req.end();
        });
    }

    async runCompleteGeminiTests() {
        console.log('🤖 Iniciando tests completos de Gemini AI Reports\n');
        
        const testCases = [
            {
                name: 'Test de Informe de Asistencia Básico',
                endpoint: '/api/informes/test-gemini',
                method: 'POST',
                data: {},
                description: 'Prueba el endpoint simplificado con datos de prueba integrados'
            },
            {
                name: 'Health Check de Informes',
                endpoint: '/api/informes/health',
                method: 'GET',
                data: {},
                description: 'Verifica que el sistema de informes esté operativo'
            },
            {
                name: 'Información del Servicio AI',
                endpoint: '/api/informes/service-info',
                method: 'GET',
                data: {},
                description: 'Obtiene información de configuración del servicio Gemini'
            }
        ];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`\n${i + 1}. ${testCase.name}`);
            console.log(`   ${testCase.description}`);
            console.log(`   Endpoint: ${testCase.method} ${testCase.endpoint}`);
            
            try {
                const startTime = Date.now();
                const result = await this.testEndpoint(testCase.endpoint, testCase.method, testCase.data);
                const duration = Date.now() - startTime;
                
                console.log(`   ⏱️  Tiempo de respuesta: ${duration}ms`);
                console.log(`   📊 Status HTTP: ${result.status}`);
                
                const testResult = {
                    test_name: testCase.name,
                    endpoint: testCase.endpoint,
                    method: testCase.method,
                    status_code: result.status,
                    duration_ms: duration,
                    timestamp: new Date().toISOString(),
                    success: result.status >= 200 && result.status < 300,
                    response_summary: {}
                };

                if (result.data) {
                    console.log(`   ✅ Respuesta procesada correctamente`);
                    
                    if (result.data.success !== undefined) {
                        console.log(`   📈 Success: ${result.data.success}`);
                        testResult.response_summary.success = result.data.success;
                    }
                    
                    if (result.data.tipo_informe) {
                        console.log(`   📋 Tipo de informe: ${result.data.tipo_informe}`);
                        testResult.response_summary.report_type = result.data.tipo_informe;
                        this.results.summary.reports_generated++;
                    }
                    
                    if (result.data.informe) {
                        const informe = result.data.informe;
                        console.log(`   📄 Título: ${informe.titulo || 'No especificado'}`);
                        console.log(`   📅 Fecha generación: ${informe.fecha_generacion || 'No especificada'}`);
                        
                        if (informe.resumen_ejecutivo) {
                            console.log(`   📝 Resumen: ${informe.resumen_ejecutivo.substring(0, 100)}...`);
                        }
                        
                        if (informe.recomendaciones && informe.recomendaciones.length > 0) {
                            console.log(`   💡 Recomendaciones: ${informe.recomendaciones.length}`);
                        }
                        
                        testResult.response_summary.report_content = {
                            has_title: !!informe.titulo,
                            has_executive_summary: !!informe.resumen_ejecutivo,
                            recommendations_count: informe.recomendaciones ? informe.recomendaciones.length : 0,
                            has_metrics: !!informe.metricas_clave,
                            has_analysis: !!informe.analisis_detallado
                        };
                    } else if (result.data.informe_texto) {
                        console.log(`   📄 Informe (texto): ${result.data.informe_texto.substring(0, 150)}...`);
                        testResult.response_summary.report_text_length = result.data.informe_texto.length;
                    }
                    
                    if (result.data.metadata) {
                        console.log(`   🤖 Modelo AI: ${result.data.metadata.model}`);
                        testResult.response_summary.ai_model = result.data.metadata.model;
                    }
                    
                    testResult.full_response = result.data;
                } else {
                    console.log(`   ❌ Error en procesamiento de respuesta`);
                    if (result.parseError) {
                        console.log(`   🔧 Error de parsing: ${result.parseError}`);
                    }
                    console.log(`   📜 Respuesta raw: ${result.raw.substring(0, 200)}...`);
                    
                    testResult.error_details = {
                        parse_error: result.parseError,
                        raw_response_preview: result.raw.substring(0, 500)
                    };
                }
                
                this.results.tests_performed.push(testResult);
                
                if (testResult.success) {
                    this.results.summary.successful_tests++;
                    console.log(`   ✅ Test completado exitosamente`);
                } else {
                    this.results.summary.failed_tests++;
                    console.log(`   ❌ Test falló`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error en test: ${error.message}`);
                
                this.results.tests_performed.push({
                    test_name: testCase.name,
                    endpoint: testCase.endpoint,
                    method: testCase.method,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                
                this.results.summary.failed_tests++;
            }
            
            this.results.summary.total_tests++;
        }
        
        // Exportar resultados
        await this.exportResults();
    }

    async exportResults() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `gemini-reports-test-${timestamp}.json`;
            const summaryFilename = `gemini-test-summary-${timestamp}.txt`;
            
            const resultsPath = path.join(__dirname, 'test-results', filename);
            const summaryPath = path.join(__dirname, 'test-results', summaryFilename);
            
            // Exportar resultados completos en JSON
            fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
            
            // Crear resumen legible
            const summary = this.generateTextSummary();
            fs.writeFileSync(summaryPath, summary);
            
            console.log(`\n📤 Resultados exportados:`);
            console.log(`   📄 Resultados completos: ${filename}`);
            console.log(`   📋 Resumen ejecutivo: ${summaryFilename}`);
            console.log(`   📁 Ubicación: ./test-results/`);
            
        } catch (error) {
            console.error(`❌ Error exportando resultados: ${error.message}`);
        }
    }

    generateTextSummary() {
        const { summary, tests_performed, timestamp } = this.results;
        
        let text = `RESUMEN DE PRUEBAS - GEMINI AI REPORTS\n`;
        text += `=============================================\n\n`;
        text += `Fecha y hora: ${timestamp}\n`;
        text += `ID de sesión: ${this.results.test_session_id}\n\n`;
        
        text += `ESTADÍSTICAS GENERALES:\n`;
        text += `- Total de pruebas: ${summary.total_tests}\n`;
        text += `- Pruebas exitosas: ${summary.successful_tests}\n`;
        text += `- Pruebas fallidas: ${summary.failed_tests}\n`;
        text += `- Informes generados: ${summary.reports_generated}\n`;
        text += `- Tasa de éxito: ${((summary.successful_tests / summary.total_tests) * 100).toFixed(1)}%\n\n`;
        
        text += `DETALLES DE PRUEBAS:\n`;
        text += `====================\n\n`;
        
        tests_performed.forEach((test, index) => {
            text += `${index + 1}. ${test.test_name}\n`;
            text += `   Endpoint: ${test.method} ${test.endpoint}\n`;
            text += `   Status: ${test.success ? '✅ EXITOSO' : '❌ FALLIDO'}\n`;
            text += `   Código HTTP: ${test.status_code || 'N/A'}\n`;
            
            if (test.duration_ms) {
                text += `   Duración: ${test.duration_ms}ms\n`;
            }
            
            if (test.response_summary?.report_type) {
                text += `   Tipo de informe: ${test.response_summary.report_type}\n`;
            }
            
            if (test.response_summary?.ai_model) {
                text += `   Modelo AI: ${test.response_summary.ai_model}\n`;
            }
            
            if (test.error) {
                text += `   Error: ${test.error}\n`;
            }
            
            text += `\n`;
        });
        
        return text;
    }
}

// Ejecutar los tests
async function main() {
    const tester = new GeminiReportTester();
    await tester.runCompleteGeminiTests();
    
    console.log(`\n🎯 Tests completados. Revisa los archivos en ./test-results/ para detalles completos.`);
}

main().catch(console.error);
