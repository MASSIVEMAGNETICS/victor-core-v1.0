import { NextRequest, NextResponse } from 'next/server';
import { amssEngine } from '@/lib/amss-engine';
import { AMSSConfig, ImageInput } from '@/lib/amss-engine';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 AMSS Generation API called');
    
    const body = await request.json();
    const {
      images,
      prompt,
      config
    } = body;

    // Validate input
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Convert images to ImageInput format
    const imageInputs: ImageInput[] = images.map((img: any, index: number) => ({
      data: img.data,
      type: img.type || 'source',
      weight: img.weight || 1.0
    }));

    // Initialize AMSS engine if not already initialized
    if (!amssEngine['zai']) {
      await amssEngine.initialize();
    }

    // Generate image using AMSS
    const result = await amssEngine.generateImage(
      imageInputs,
      prompt,
      config
    );

    console.log('✅ AMSS Generation completed successfully');

    return NextResponse.json({
      success: true,
      result,
      stats: amssEngine.getStats()
    });

  } catch (error) {
    console.error('❌ Error in AMSS generation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return engine statistics
    const stats = amssEngine.getStats();
    
    return NextResponse.json({
      success: true,
      engine: 'Adaptive Multi-Model Semantic Synthesis (AMSS)',
      version: '1.0.0',
      capabilities: [
        'Multi-model ensemble generation',
        'Deep semantic analysis',
        'Iterative refinement',
        'Adaptive style transfer',
        'Quality assessment',
        'Real-time optimization'
      ],
      stats
    });
  } catch (error) {
    console.error('❌ Error getting AMSS stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get engine stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}