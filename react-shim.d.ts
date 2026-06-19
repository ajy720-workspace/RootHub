declare namespace React {
  type ReactNode = any;
  interface FormEvent<T = Element> { preventDefault(): void; currentTarget: T; }
  interface ChangeEvent<T = Element> { target: T; currentTarget: T; }
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);
  interface MutableRefObject<T> { current: T; }
}

declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
}

declare namespace JSX {
  interface Element {}
  interface ElementClass {}
  interface IntrinsicAttributes { key?: any; }
  interface IntrinsicElements { [elemName: string]: any; }
}
