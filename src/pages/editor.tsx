import dynamic from "next/dynamic";

const RemirrorEditor = dynamic(import("@/remirror-editor"), { ssr: false });

export default RemirrorEditor;
