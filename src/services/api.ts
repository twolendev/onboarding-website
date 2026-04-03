import { ExternalAIError, CircuitBreaker } from '../utils/errors';
import type { Result } from '../utils/errors';
import { Ok, Err } from '../utils/errors';

export interface OnboardingData {
  statsAndGoals: string;
  schedule: string;
  limitations: string;
}

export interface AIPlanResponse {
  plan: string;
}

// Circuit Breaker: 2 consecutive failures trips it, 10s cooldown
const aiApiCircuitBreaker = new CircuitBreaker(2, 10000);

export async function submitOnboardingToAI(data: OnboardingData): Promise<Result<AIPlanResponse, ExternalAIError>> {
  try {
    const result = await aiApiCircuitBreaker.call(async () => {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${response.status}`);
      }

      const json = await response.json();
      return json as AIPlanResponse;
    });

    return Ok(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Err(new ExternalAIError(err.message, { original: err.message }));
    }
    return Err(new ExternalAIError("An unknown error occurred while generating the plan."));
  }
}
