export type Size = [width: number, height: number];

export type Point = [x: number, y: number];

export type FieldsToInstance<T> = {
  [K in keyof T]: T[K];
};

