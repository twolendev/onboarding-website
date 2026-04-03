import { ExternalAIError, CircuitBreaker } from '../utils/errors';
import type { Result } from '../utils/errors';
import { Ok, Err } from '../utils/errors';

export interface OnboardingData {
  statsAndGoals: string;
  schedule: string;
  limitations: string;
}

export interface AIPlanResponse {
  planId: string;
  message: string;
}

// Simulated Circuit Breaker for our API endpoint
const aiApiCircuitBreaker = new CircuitBreaker(2, 5000); // 2 fails trips it, 5s timeout

export async function submitOnboardingToAI(data: OnboardingData): Promise<Result<AIPlanResponse, ExternalAIError>> {
  console.log("Submitting AI Onboarding Form Data:", data); // Prevents unused variables error
  
  try {
    const result = await aiApiCircuitBreaker.call(async () => {
      // MOCK: Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      // MOCK: Randomly fail about 1 in 5 times to simulate backend flakiness and demonstrate error handling
      if (Math.random() < 0.2) {
        throw new Error("Timeout communicating with the AI service");
      }
      
      // Simulate real-ish return
      return {
        planId: `plan_${Math.floor(Math.random() * 10000)}`,
        message: "Your personalized strength plan has been successfully generated."
      };
    });

    return Ok(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Err(new ExternalAIError("Failed to reach AI Engine", { original: err.message }));
    }
    return Err(new ExternalAIError("An unknown error occurred while analyzing the data."));
  }
}
