export interface TokenGenerator {
  generateToken(payload: { sub: number; email: string; role: string }): string;
}
export const TOKEN_GENERATOR = Symbol('TokenGenerator');
