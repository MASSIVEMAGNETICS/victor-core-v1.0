
export interface WorldModel {
  entities: Map<string, any>;
  state: any;
  time: number;
  causality: any[];
  physicsConstraints: any;
}

export interface SelfModel {
  capabilities: string[];
  confidence: number;
  trustScores: Map<string, number>;
  resourceLimits: any;
  internalHealth: string;
}

export interface EnvironmentModel {
  tools: string[];
  permissions: string[];
  interfaces: string[];
  threatSurfaces: any[];
}

export class TriModelManager {
  private worldModel: WorldModel;
  private selfModel: SelfModel;
  private environmentModel: EnvironmentModel;

  constructor() {
    this.worldModel = {
      entities: new Map(),
      state: {},
      time: Date.now(),
      causality: [],
      physicsConstraints: {},
    };

    this.selfModel = {
      capabilities: ["chat", "simulation", "learning"],
      confidence: 1.0,
      trustScores: new Map(),
      resourceLimits: {},
      internalHealth: "OPTIMAL",
    };

    this.environmentModel = {
      tools: ["socket.io", "next.js"],
      permissions: ["read", "write"],
      interfaces: ["chat"],
      threatSurfaces: [],
    };

    console.log("[TriModelManager] Initialized.");
  }

  public getSnapshot() {
    return {
      WM: this.worldModel,
      SM: this.selfModel,
      EM: this.environmentModel,
    };
  }

  public updateWorldState(update: any) {
    this.worldModel.state = { ...this.worldModel.state, ...update };
    this.worldModel.time = Date.now();
  }
}
