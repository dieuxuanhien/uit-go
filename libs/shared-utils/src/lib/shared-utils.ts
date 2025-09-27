export function sharedUtils(): string {
  return 'shared-utils';
}

export function greet(name: string): string {
  return `Hello, ${name} from UIT-GO shared utils!`;
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}
