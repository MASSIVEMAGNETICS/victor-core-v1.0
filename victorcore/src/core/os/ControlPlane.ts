
export type ModuleStatus = "ACTIVE" | "PAUSED" | "DRAINING" | "STOPPED" | "QUARANTINED";

export interface ModuleLifecycle {
  start(): void;
  pause(): void;
  drain(): void;
  stop(): void;
  quarantine(): void;
  getStatus(): ModuleStatus;
}

export class ControlPlane {
  private modules: Map<string, ModuleLifecycle> = new Map();
  private systemStatus: "NORMAL" | "EMERGENCY" = "NORMAL";

  constructor() {
    console.log("[ControlPlane] Initialized. VictorOS is online.");
  }

  public registerModule(name: string, module: ModuleLifecycle) {
    this.modules.set(name, module);
  }

  public getModuleStatus(name: string): ModuleStatus | undefined {
    return this.modules.get(name)?.getStatus();
  }

  public startModule(name: string) {
    this.modules.get(name)?.start();
  }

  public pauseModule(name: string) {
    this.modules.get(name)?.pause();
  }

  public drainModule(name: string) {
    this.modules.get(name)?.drain();
  }

  public stopModule(name: string) {
    this.modules.get(name)?.stop();
  }

  public quarantineModule(name: string) {
    this.modules.get(name)?.quarantine();
  }

  public shutdownAll() {
    console.log("[ControlPlane] Initiating system-wide shutdown...");
    for (const [name, module] of this.modules) {
      console.log(`[ControlPlane] Stopping ${name}...`);
      module.stop();
    }
  }
}
