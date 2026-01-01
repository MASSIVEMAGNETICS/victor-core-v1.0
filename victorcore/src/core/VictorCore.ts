
import { IdentityKernel } from "./identity/IdentityKernel";
import { TriModelManager } from "./cognition/TriModelManager";
import { ControlPlane } from "./os/ControlPlane";
import { ThinkBeforeActGate, Intent } from "./gate/ThinkBeforeActGate";
import { SuccessionEngine } from "./continuity/SuccessionEngine";

export class VictorCore {
  public readonly identity: IdentityKernel;
  public readonly cognition: TriModelManager;
  public readonly os: ControlPlane;
  public readonly gate: ThinkBeforeActGate;
  public readonly continuity: SuccessionEngine;

  constructor() {
    console.log("[VictorCore] Booting up...");

    this.identity = new IdentityKernel();
    this.cognition = new TriModelManager();
    this.os = new ControlPlane();
    this.continuity = new SuccessionEngine();

    // Gate needs access to cognition
    this.gate = new ThinkBeforeActGate(this.cognition);

    console.log("[VictorCore] All engines initialized. System ready.");
  }

  public async receiveMessage(message: string, senderId: string): Promise<string> {
    const intent: Intent = {
      type: "CHAT_MESSAGE",
      payload: { text: message, senderId },
      origin: "CHAT_INTERFACE",
    };

    const result = await this.gate.process(intent);

    if (result.success) {
      // In a real system, the gate would produce a response or trigger an action that produces one.
      // For now, we simulate a response.
      return `Victor: I received your message: "${message}". My internal state is optimal.`;
    } else {
      return "Victor: [Action Refused] " + result.message;
    }
  }
}
