import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { InputField } from "../types/input-field";

export type Template = {
  id: string;
  name: string;
  description: string;
  inputs: InputField[];
  tags: string[];
  prompt: string;
};

export const templateFromDoc = (
  doc: DocumentSnapshot<DocumentData>
): Template => {
  return {
    id: doc.id,
    name: doc.get("name"),
    description: doc.get("description"),
    prompt: doc.get("prompt"),
    inputs: doc.get("inputs"),
    tags: doc.get("tags"),
  };
};
