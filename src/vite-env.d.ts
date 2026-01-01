/// <reference types="vite/client" />

declare module '*.wasm' {
    const content: WebAssembly.Module;
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_USE_SERVER_PROXY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
