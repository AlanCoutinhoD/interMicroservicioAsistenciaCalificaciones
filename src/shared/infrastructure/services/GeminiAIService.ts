import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    timestamp: Date;
    tokensUsed?: number;
  };
}

export interface InformeRequest {
  tipo: 'asistencia' | 'calificaciones' | 'general';
  datos: any;
  parametros?: {
    periodo?: string;
    formato?: 'detallado' | 'resumido' | 'ejecutivo';
    incluirGraficos?: boolean;
    incluirRecomendaciones?: boolean;
  };
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private readonly API_KEY: string;

  constructor() {
    this.API_KEY = process.env.GEMINI_API_KEY || '';
    
    if (!this.API_KEY) {
      throw new Error('GEMINI_API_KEY no encontrada en las variables de entorno');
    }

    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Genera un informe usando Gemini AI
   */
  async generarInforme(request: InformeRequest): Promise<GeminiResponse> {
    try {
      const prompt = this.construirPrompt(request);
      
      console.log(`Generando informe de ${request.tipo} con Gemini AI...`);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text,
        metadata: {
          prompt: prompt.substring(0, 200) + '...',
          model: 'gemini-1.5-flash',
          timestamp: new Date()
        }
      };

    } catch (error) {
      console.error('Error al generar informe con Gemini:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en Gemini AI',
        metadata: {
          prompt: '',
          model: 'gemini-1.5-flash',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Construye el prompt según el tipo de informe solicitado
   */
  private construirPrompt(request: InformeRequest): string {
    const basePrompt = this.getBasePromptTemplate();
    
    switch (request.tipo) {
      case 'asistencia':
        return this.construirPromptAsistencia(request, basePrompt);
      
      case 'calificaciones':
        return this.construirPromptCalificaciones(request, basePrompt);
      
      case 'general':
        return this.construirPromptGeneral(request, basePrompt);
      
      default:
        throw new Error(`Tipo de informe no soportado: ${request.tipo}`);
    }
  }

  /**
   * Template base para todos los informes
   */
  private getBasePromptTemplate(): string {
    return `
Eres un asistente especializado en análisis educativo para instituciones universitarias.
Tu tarea es generar informes profesionales y detallados sobre el rendimiento académico de estudiantes.

FORMATO DE RESPUESTA ESTÁNDAR:
Debes responder SIEMPRE siguiendo esta estructura JSON:

{
  "titulo": "Título del informe",
  "fecha_generacion": "YYYY-MM-DD HH:mm:ss",
  "resumen_ejecutivo": "Resumen de 2-3 párrafos con los hallazgos principales",
  "metricas_clave": {
    "metrica1": "valor",
    "metrica2": "valor",
    "metrica3": "valor"
  },
  "analisis_detallado": [
    {
      "seccion": "Nombre de la sección",
      "contenido": "Análisis detallado de esta sección",
      "hallazgos": ["hallazgo1", "hallazgo2"]
    }
  ],
  "recomendaciones": [
    {
      "prioridad": "Alta|Media|Baja",
      "titulo": "Título de la recomendación",
      "descripcion": "Descripción detallada",
      "acciones_sugeridas": ["acción1", "acción2"]
    }
  ],
  "conclusiones": "Conclusiones finales del análisis",
  "proximos_pasos": ["paso1", "paso2", "paso3"]
}

INSTRUCCIONES IMPORTANTES:
- Usa lenguaje profesional y técnico apropiado para directivos académicos
- Incluye análisis estadístico cuando sea relevante
- Proporciona recomendaciones accionables
- Mantén un tono objetivo y constructivo
- Incluye métricas específicas y cuantificables
`;
  }

  /**
   * Construye prompt específico para informes de asistencia
   */
  private construirPromptAsistencia(request: InformeRequest, basePrompt: string): string {
    const datos = JSON.stringify(request.datos, null, 2);
    const parametros = request.parametros || {};
    
    return `${basePrompt}

TIPO DE INFORME: ANÁLISIS DE ASISTENCIA

Analiza los siguientes datos de asistencia de tutorados:

DATOS:
${datos}

PARÁMETROS ESPECÍFICOS:
- Periodo: ${parametros.periodo || 'No especificado'}
- Formato: ${parametros.formato || 'detallado'}
- Incluir gráficos: ${parametros.incluirGraficos ? 'Sí' : 'No'}
- Incluir recomendaciones: ${parametros.incluirRecomendaciones ? 'Sí' : 'No'}

ENFOQUE DEL ANÁLISIS:
- Identifica patrones de asistencia por estudiante
- Calcula porcentajes de asistencia, retardos y ausencias
- Analiza tendencias temporales
- Identifica estudiantes en riesgo
- Evalúa el impacto en el rendimiento académico
- Proporciona recomendaciones para mejorar la asistencia

Genera un informe completo siguiendo el formato JSON especificado.`;
  }

  /**
   * Construye prompt específico para informes de calificaciones
   */
  private construirPromptCalificaciones(request: InformeRequest, basePrompt: string): string {
    const datos = JSON.stringify(request.datos, null, 2);
    const parametros = request.parametros || {};
    
    return `${basePrompt}

TIPO DE INFORME: ANÁLISIS DE CALIFICACIONES

Analiza los siguientes datos de calificaciones:

DATOS:
${datos}

PARÁMETROS ESPECÍFICOS:
- Periodo: ${parametros.periodo || 'No especificado'}
- Formato: ${parametros.formato || 'detallado'}
- Incluir gráficos: ${parametros.incluirGraficos ? 'Sí' : 'No'}
- Incluir recomendaciones: ${parametros.incluirRecomendaciones ? 'Sí' : 'No'}

ENFOQUE DEL ANÁLISIS:
- Calcula estadísticas descriptivas (media, mediana, desviación estándar)
- Identifica distribución de calificaciones
- Analiza rendimiento por materia/área
- Identifica estudiantes destacados y en riesgo
- Evalúa correlación entre diferentes materias
- Proporciona recomendaciones pedagógicas

Genera un informe completo siguiendo el formato JSON especificado.`;
  }

  /**
   * Construye prompt específico para informes generales
   */
  private construirPromptGeneral(request: InformeRequest, basePrompt: string): string {
    const datos = JSON.stringify(request.datos, null, 2);
    const parametros = request.parametros || {};
    
    return `${basePrompt}

TIPO DE INFORME: ANÁLISIS INTEGRAL (ASISTENCIA + CALIFICACIONES)

Analiza los siguientes datos combinados de asistencia y calificaciones:

DATOS:
${datos}

PARÁMETROS ESPECÍFICOS:
- Periodo: ${parametros.periodo || 'No especificado'}
- Formato: ${parametros.formato || 'detallado'}
- Incluir gráficos: ${parametros.incluirGraficos ? 'Sí' : 'No'}
- Incluir recomendaciones: ${parametros.incluirRecomendaciones ? 'Sí' : 'No'}

ENFOQUE DEL ANÁLISIS:
- Correlaciona asistencia con rendimiento académico
- Identifica patrones de riesgo académico
- Analiza efectividad de las tutorías
- Evalúa el impacto de factores externos
- Proporciona recomendaciones integrales
- Sugiere estrategias de intervención temprana

Genera un informe completo siguiendo el formato JSON especificado.`;
  }

  /**
   * Valida la respuesta de Gemini para asegurar formato correcto
   */
  async validarRespuesta(respuesta: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(respuesta);
      
      // Verificar campos obligatorios
      const camposRequeridos = [
        'titulo',
        'fecha_generacion',
        'resumen_ejecutivo',
        'metricas_clave',
        'analisis_detallado',
        'recomendaciones',
        'conclusiones',
        'proximos_pasos'
      ];

      return camposRequeridos.every(campo => parsed.hasOwnProperty(campo));
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información del modelo y configuración
   */
  getModelInfo(): object {
    return {
      model: 'gemini-1.5-flash',
      provider: 'Google AI Studio',
      configured: !!this.API_KEY,
      timestamp: new Date()
    };
  }
}
