const world = 'world';

export type MethodInput = {
  who: string;
};
export function hello(who: MethodInput): string {
  return `Hello ${who}! `;
}
