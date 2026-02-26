const ORIGINAL_ENV = { ...process.env };

export function resetTestEnv(overrides: Record<string, string | undefined> = {}): void {
  process.env = { ...ORIGINAL_ENV };

  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
      return;
    }
    process.env[key] = value;
  });
}

export function restoreTestEnv(): void {
  process.env = { ...ORIGINAL_ENV };
}
