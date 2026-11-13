declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.css";

declare module "react-native/Libraries/Types/CodegenTypes" {
  export type UnsafeObject = any;
}
