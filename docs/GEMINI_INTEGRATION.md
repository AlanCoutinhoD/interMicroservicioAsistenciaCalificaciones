# Integración con Gemini AI para Informes Académicos

## Configuración Inicial

### 1. Instalar dependencias
```bash
npm install @google/generative-ai
```

### 2. Configurar API Key de Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key
3. Copia la API Key a tu archivo `.env`:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Iniciar el servidor
```bash
npm run dev
```

## Endpoints Disponibles

### 1. Informe de Asistencia
**POST** `/api/informes/asistencia`

```json
{
  "tutorId": "TutorEjemplo",
  "periodo": "2025-1",
  "formato": "detallado",
  "incluirGraficos": true,
  "incluirRecomendaciones": true
}
```

### 2. Informe de Calificaciones
**POST** `/api/informes/calificaciones`

```json
{
  "estudianteId": "123456",
  "tutorId": "TutorEjemplo",
  "periodo": "2025-1",
  "formato": "resumido",
  "incluirRecomendaciones": true
}
```

### 3. Informe Integral
**POST** `/api/informes/integral`

```json
{
  "tutorId": "TutorEjemplo",
  "periodo": "2025-1",
  "formato": "ejecutivo",
  "incluirGraficos": true,
  "incluirRecomendaciones": true
}
```

### 4. Información del Servicio
**GET** `/api/informes/service-info`

## Formato de Respuesta Estándar

Todos los informes siguen el mismo formato JSON:

```json
{
  "success": true,
  "tipo_informe": "asistencia|calificaciones|integral",
  "informe": {
    "titulo": "Título del informe",
    "fecha_generacion": "2025-01-19 15:30:00",
    "resumen_ejecutivo": "Resumen de hallazgos principales...",
    "metricas_clave": {
      "asistencia_promedio": "85%",
      "estudiantes_en_riesgo": "3",
      "mejora_mes_anterior": "5%"
    },
    "analisis_detallado": [
      {
        "seccion": "Análisis de Tendencias",
        "contenido": "Descripción detallada...",
        "hallazgos": ["Hallazgo 1", "Hallazgo 2"]
      }
    ],
    "recomendaciones": [
      {
        "prioridad": "Alta",
        "titulo": "Intervención Inmediata",
        "descripcion": "Descripción de la recomendación...",
        "acciones_sugeridas": ["Acción 1", "Acción 2"]
      }
    ],
    "conclusiones": "Conclusiones finales del análisis",
    "proximos_pasos": ["Paso 1", "Paso 2", "Paso 3"]
  },
  "metadata": {
    "prompt": "Prompt utilizado...",
    "model": "gemini-1.5-flash",
    "timestamp": "2025-01-19T15:30:00.000Z"
  }
}
```

## Ejemplos de Uso

### Ejemplo 1: Generar informe de asistencia para un tutor

```bash
curl -X POST http://localhost:3000/api/informes/asistencia \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId": "TutorEjemplo",
    "periodo": "2025-1",
    "formato": "detallado",
    "incluirRecomendaciones": true
  }'
```

### Ejemplo 2: Informe integral de un estudiante

```bash
curl -X POST http://localhost:3000/api/informes/integral \
  -H "Content-Type: application/json" \
  -d '{
    "estudianteId": "123456",
    "formato": "ejecutivo"
  }'
```

## Tipos de Formato Disponibles

- **detallado**: Análisis completo con todas las secciones
- **resumido**: Versión condensada con puntos clave
- **ejecutivo**: Resumen para directivos con métricas principales

## Características del Sistema

✅ **Formato Consistente**: Todos los informes siguen la misma estructura JSON
✅ **IA Especializada**: Prompts optimizados para análisis educativo
✅ **Múltiples Tipos**: Asistencia, calificaciones e integral
✅ **Configurable**: Diferentes formatos y opciones
✅ **Escalable**: Fácil agregar nuevos tipos de informe

## Troubleshooting

### Error: "GEMINI_API_KEY no encontrada"
- Verifica que el archivo `.env` contenga la variable `GEMINI_API_KEY`
- Asegúrate de que el servidor se reinició después de agregar la variable

### Error: "No se encontraron datos"
- Verifica que existan registros en la base de datos
- Usa los endpoints de datos de prueba: `POST /api/asistencia-tutorado/datos-prueba`

### Error de formato JSON
- El sistema maneja automáticamente respuestas que no sean JSON válido
- Se devuelve como `informe_texto` en lugar de `informe`

## Próximas Mejoras

- [ ] Exportación a PDF
- [ ] Gráficos automáticos
- [ ] Plantillas personalizables
- [ ] Programación de informes automáticos
- [ ] Integración con sistema de notificaciones
