
export type SingleObjectState = {
  loading: boolean;
  object: any;
  error: Error | null;
};

export const state = (): SingleObjectState => ({
  loading: false,
  object: {} as any,
  error: null,
});
