'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Wand2, 
  Palette, 
  Brain, 
  Zap, 
  Sparkles, 
  Image as ImageIcon,
  Settings,
  BarChart3,
  Layers,
  Target
} from 'lucide-react';

interface GenerationResult {
  imageData: string;
  qualityScore: number;
  semanticCoherence: number;
  aestheticScore: number;
  metadata: {
    processingTime: number;
    modelsUsed: string[];
    techniquesApplied: string[];
  };
}

interface AMSSConfig {
  maxIterations: number;
  qualityThreshold: number;
  ensembleSize: number;
  refinementSteps: number;
  styleTransferStrength: number;
  semanticDepth: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('generate');
  const [images, setImages] = useState<{ file: File; preview: string; type: string }[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<AMSSConfig>({
    maxIterations: 5,
    qualityThreshold: 0.85,
    ensembleSize: 3,
    refinementSteps: 3,
    styleTransferStrength: 0.7,
    semanticDepth: 3
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'source'
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setResult(null);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // Convert images to base64
      const imagePromises = images.map(async img => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(img.file);
        });
      });

      const imageDatas = await Promise.all(imagePromises);

      const response = await fetch('/api/amss/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: imageDatas.map((data, index) => ({
            data,
            type: images[index].type,
            weight: 1.0
          })),
          prompt,
          config
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setResult(data.result);
      setProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const resetForm = () => {
    setImages([]);
    setPrompt('');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AMSS Engine
            </h1>
            <Sparkles className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Adaptive Multi-Model Semantic Synthesis - A breakthrough proprietary image generation algorithm 
            that combines deep semantic understanding, multi-model ensemble, and iterative refinement 
            to create state-of-the-art visual content.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="style-transfer" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Style Transfer
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Input Configuration
                  </CardTitle>
                  <CardDescription>
                    Upload images and provide creative guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Source Images</Label>
                    <div 
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-sm text-slate-400">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Images */}
                  {images.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Uploaded Images</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                              {image.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prompt Input */}
                  <div>
                    <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                      Creative Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your vision... The AI will use semantic understanding to interpret your intent and generate groundbreaking imagery."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      rows={4}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || images.length === 0 || !prompt.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isGenerating ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AMSS
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Progress */}
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Generation Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-slate-400">
                        AMSS is performing semantic analysis, multi-model ensemble generation, and iterative refinement...
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Result Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-green-400" />
                    Generation Result
                  </CardTitle>
                  <CardDescription>
                    State-of-the-art AI-generated imagery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      {/* Generated Image */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Generated Image</Label>
                        <div className="relative group">
                          <img
                            src={result.imageData}
                            alt="Generated result"
                            className="w-full rounded-lg shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Badge className="mb-2">AMSS Generated</Badge>
                              <p className="text-sm">Click to view full size</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quality Metrics */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Quality Assessment</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {(result.qualityScore * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">Overall Quality</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {(result.semanticCoherence * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">Semantic Coherence</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {(result.aestheticScore * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">Aesthetic Score</div>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Generation Details</Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Processing Time:</span>
                            <span>{result.metadata.processingTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Models Used:</span>
                            <span>{result.metadata.modelsUsed.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Techniques Applied:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.metadata.techniquesApplied.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400">
                        Your groundbreaking AI-generated image will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Semantic Analysis
                </CardTitle>
                <CardDescription>
                  Deep semantic understanding and concept extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold mb-2">Advanced Semantic Analysis</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    Upload images to perform deep semantic analysis including concept extraction, 
                    relationship mapping, style signature analysis, and emotional content assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Style Transfer Tab */}
          <TabsContent value="style-transfer" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Adaptive Style Transfer
                </CardTitle>
                <CardDescription>
                  Intelligent style fusion with semantic awareness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Palette className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                  <h3 className="text-xl font-semibold mb-2">Adaptive Style Transfer</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    Combine content and style images with our advanced adaptive fusion engine that 
                    understands semantic relationships and preserves content structure while applying 
                    artistic styles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-yellow-400" />
                  AMSS Configuration
                </CardTitle>
                <CardDescription>
                  Fine-tune the breakthrough generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxIterations" className="text-sm font-medium mb-2 block">
                      Max Iterations: {config.maxIterations}
                    </Label>
                    <Input
                      id="maxIterations"
                      type="range"
                      min="1"
                      max="10"
                      value={config.maxIterations}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="qualityThreshold" className="text-sm font-medium mb-2 block">
                      Quality Threshold: {config.qualityThreshold}
                    </Label>
                    <Input
                      id="qualityThreshold"
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={config.qualityThreshold}
                      onChange={(e) => setConfig(prev => ({ ...prev, qualityThreshold: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ensembleSize" className="text-sm font-medium mb-2 block">
                      Ensemble Size: {config.ensembleSize}
                    </Label>
                    <Input
                      id="ensembleSize"
                      type="range"
                      min="1"
                      max="5"
                      value={config.ensembleSize}
                      onChange={(e) => setConfig(prev => ({ ...prev, ensembleSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="refinementSteps" className="text-sm font-medium mb-2 block">
                      Refinement Steps: {config.refinementSteps}
                    </Label>
                    <Input
                      id="refinementSteps"
                      type="range"
                      min="1"
                      max="5"
                      value={config.refinementSteps}
                      onChange={(e) => setConfig(prev => ({ ...prev, refinementSteps: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="font-semibold mb-3">AMSS Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-medium">Multi-Model Ensemble</div>
                        <div className="text-sm text-slate-400">Combines multiple AI models</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">Semantic Understanding</div>
                        <div className="text-sm text-slate-400">Deep concept analysis</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="font-medium">Iterative Refinement</div>
                        <div className="text-sm text-slate-400">Continuous improvement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium">Quality Assessment</div>
                        <div className="text-sm text-slate-400">Comprehensive evaluation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}