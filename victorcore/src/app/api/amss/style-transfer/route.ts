import { NextRequest, NextResponse } from 'next/server';
import { amssEngine } from '@/lib/amss-engine';
import { ImageInput } from '@/lib/amss-engine';

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 AMSS Style Transfer API called');
    
    const body = await request.json();
    const { sourceImage, styleImage, prompt, strength } = body;

    // Validate input
    if (!sourceImage || !styleImage) {
      return NextResponse.json(
        { error: 'Both source and style images are required' },
        { status: 400 }
      );
    }

    // Convert images to ImageInput format
    const imageInputs: ImageInput[] = [
      {
        data: sourceImage.data,
        type: 'source',
        weight: 1.0
      },
      {
        data: styleImage.data,
        type: 'style',
        weight: strength || 0.7
      }
    ];

    // Initialize AMSS engine if not already initialized
    if (!amssEngine['zai']) {
      await amssEngine.initialize();
    }

    // Perform style transfer
    const result = await amssEngine.generateImage(
      imageInputs,
      prompt || 'Apply artistic style transfer',
      {
        maxIterations: 3,
        qualityThreshold: 0.8,
        ensembleSize: 2,
        refinementSteps: 2,
        styleTransferStrength: strength || 0.7,
        semanticDepth: 2
      }
    );

    console.log('✅ AMSS Style Transfer completed successfully');

    return NextResponse.json({
      success: true,
      result,
      transferStrength: strength || 0.7,
      processingTime: result.metadata.processingTime
    });

  } catch (error) {
    console.error('❌ Error in AMSS style transfer:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to perform style transfer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}