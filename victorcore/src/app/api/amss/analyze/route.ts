import { NextRequest, NextResponse } from 'next/server';
import { amssEngine } from '@/lib/amss-engine';
import { ImageInput } from '@/lib/amss-engine';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 AMSS Semantic Analysis API called');
    
    const body = await request.json();
    const { images, prompt } = body;

    // Validate input
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
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

    // Perform deep semantic analysis
    const semanticAnalysis = await amssEngine['performDeepSemanticAnalysis'](
      imageInputs,
      prompt || ''
    );

    console.log('✅ AMSS Semantic Analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysis: semanticAnalysis,
      processingTime: Date.now()
    });

  } catch (error) {
    console.error('❌ Error in AMSS semantic analysis:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to perform semantic analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}