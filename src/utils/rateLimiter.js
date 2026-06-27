class RateLimiter {
  constructor(maxRequests = 3, perMilliseconds = 1000) {
    this.maxRequests = maxRequests;
    this.perMilliseconds = perMilliseconds;
    this.timestamps = [];
  }

  async acquire() {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(
          (t) => now - t < this.perMilliseconds
        );
        if (this.timestamps.length < this.maxRequests) {
          this.timestamps.push(now);
          resolve();
        } else {
          const waitTime = this.perMilliseconds - (now - this.timestamps[0]) + 50;
          setTimeout(tryAcquire, waitTime);
        }
      };
      tryAcquire();
    });
  }
}

export const jikanRateLimiter = new RateLimiter(3, 1100);
