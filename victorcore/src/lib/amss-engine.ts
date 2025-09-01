/**
 * Adaptive Multi-Model Semantic Synthesis (AMSS) Engine
 * 
 * This engine now acts as a client to the Victor Omnibrain Python API.
 * It sends user prompts to the Python backend and receives a GenerationResult.
 */

export interface AMSSConfig {
  maxIterations: number;
  qualityThreshold: number;
  ensembleSize: number;
  refinementSteps: number;
  styleTransferStrength: number;
  semanticDepth: number;
}

export interface GenerationResult {
  imageData: string;
  qualityScore: number;
  semanticCoherence: number;
  aestheticScore: number;
  metadata: {
    modelsUsed: string[];
    techniquesApplied: string[];
    processingTime: number;
  };
}

export interface ImageInput {
  data: string;
  type: 'source' | 'style' | 'reference' | 'concept';
  weight?: number;
}

export class AMSSEngine {
  private config: Partial<AMSSConfig>;
  private pythonApiUrl = 'http://localhost:5001/think';

  constructor(config: Partial<AMSSConfig> = {}) {
    this.config = config;
    console.log('AMSS Engine initialized as a client for Victor Omnibrain.');
  }

  // This method is kept for API compatibility but is no longer used to initialize a ZAI SDK.
  async initialize(): Promise<void> {
    console.log('AMSS Engine client is ready.');
    return Promise.resolve();
  }

  /**
   * Core Generation Method
   * This method now calls the Victor Omnibrain Python API.
   */
  async generateImage(
    inputs: ImageInput[],
    prompt: string,
    options: Partial<AMSSConfig> = {}
  ): Promise<GenerationResult> {
    console.log(`🚀 Sending prompt to Victor Omnibrain: "${prompt}"`);

    try {
      const response = await fetch(this.pythonApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Python API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.result) {
        throw new Error('Invalid response structure from Python API');
      }
      
      console.log('✅ Received response from Victor Omnibrain');

      // The Python API now returns data in the expected GenerationResult format.
      return data.result;

    } catch (error) {
      console.error('❌ Error communicating with Victor Omnibrain API:', error);
      // Return a user-friendly error message within the GenerationResult structure if possible
      throw error;
    }
  }

  /**
   * Get engine statistics. This is now a placeholder.
   */
  getStats(): any {
    return {
      engine: 'Victor Omnibrain API Client',
      version: '1.0.0',
      status: 'Connected to Python API',
    };
  }
}

// Export singleton instance
export const amssEngine = new AMSSEngine();