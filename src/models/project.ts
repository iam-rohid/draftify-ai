import { DocumentData, DocumentSnapshot } from "firebase/firestore";

export type ProjectEntity = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  description?: string;
  templateId: string;
  body?: string;
};

export const projectToDoc = (
  project: ProjectEntity
): {
  [field: string]: any;
} => {
  const { name, createdAt, updatedAt, templateId, body, description } = project;
  return {
    createdAt,
    templateId,
    body: body ?? null,
    description: description ?? null,
    name: name ?? null,
    updatedAt: updatedAt ?? null,
  };
};

export const projectFromDoc = (
  doc: DocumentSnapshot<DocumentData>
): ProjectEntity => {
  return {
    id: doc.id,
    createdAt: doc.get("createdAt"),
    updatedAt: doc.get("updatedAt"),
    name: doc.get("name"),
    description: doc.get("description"),
    templateId: doc.get("templateId"),
    body: doc.get("body"),
  };
};
