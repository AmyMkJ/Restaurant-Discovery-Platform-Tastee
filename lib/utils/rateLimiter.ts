class RateLimiter {
  private history: Record<string, number[]> = {}

  allow(actionKey: string, limit: number, windowMs: number) {
    const now = Date.now()
    const entries = this.history[actionKey] || []
    const filtered = entries.filter((timestamp) => now - timestamp < windowMs)

    if (filtered.length >= limit) {
      this.history[actionKey] = filtered
      return false
    }

    filtered.push(now)
    this.history[actionKey] = filtered
    return true
  }
}

export const rateLimiter = new RateLimiter()

