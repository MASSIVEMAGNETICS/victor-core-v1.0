import { NextRequest, NextResponse } from 'next/server';
import { realtimeOptimizer } from '@/lib/realtime-optimizer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Initialize optimizer if not already initialized
    if (!realtimeOptimizer['zai']) {
      await realtimeOptimizer.initialize();
    }

    switch (action) {
      case 'stats':
        const stats = realtimeOptimizer.getStats();
        return NextResponse.json({
          success: true,
          action: 'stats',
          data: stats
        });

      case 'recommendations':
        const recommendations = await realtimeOptimizer.getRecommendations();
        return NextResponse.json({
          success: true,
          action: 'recommendations',
          data: recommendations
        });

      case 'start':
        realtimeOptimizer.start();
        return NextResponse.json({
          success: true,
          action: 'start',
          message: 'Real-time optimization started'
        });

      case 'stop':
        realtimeOptimizer.stop();
        return NextResponse.json({
          success: true,
          action: 'stop',
          message: 'Real-time optimization stopped'
        });

      default:
        return NextResponse.json({
          success: true,
          engine: 'Real-time Optimizer',
          version: '1.0.0',
          capabilities: [
            'Real-time performance monitoring',
            'Adaptive feedback loops',
            'Automatic optimization',
            'Predictive modeling',
            'Quality assurance',
            'Resource optimization'
          ],
          status: realtimeOptimizer['config']?.enableRealTimeOptimization ? 'active' : 'inactive',
          stats: realtimeOptimizer.getStats()
        });
    }
  } catch (error) {
    console.error('❌ Error in optimizer API:', error);
    
    return NextResponse.json(
      { 
        error: 'Optimizer API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    // Initialize optimizer if not already initialized
    if (!realtimeOptimizer['zai']) {
      await realtimeOptimizer.initialize();
    }

    switch (action) {
      case 'configure':
        if (config) {
          // Update configuration
          Object.assign(realtimeOptimizer['config'], config);
          return NextResponse.json({
            success: true,
            action: 'configure',
            message: 'Optimizer configuration updated',
            config: realtimeOptimizer['config']
          });
        }
        break;

      case 'clear-history':
        realtimeOptimizer.clearHistory();
        return NextResponse.json({
          success: true,
          action: 'clear-history',
          message: 'Optimizer history cleared'
        });

      case 'force-optimization':
        // Force immediate optimization cycle
        await realtimeOptimizer['runOptimizationCycle']();
        return NextResponse.json({
          success: true,
          action: 'force-optimization',
          message: 'Forced optimization cycle completed'
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Error in optimizer POST API:', error);
    
    return NextResponse.json(
      { 
        error: 'Optimizer POST API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}