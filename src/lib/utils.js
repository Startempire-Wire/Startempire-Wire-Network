// Common utility functions
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Add any other utility functions you need

export class NetworkError extends Error {
  constructor(type) {
    super();
    this.recoverySteps = {
      auth: 'Reauthenticate via WordPress',
      content: 'Retry with cached version'
    }[type];
  }
}
