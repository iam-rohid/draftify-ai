import { Template } from "@/models/template";

export const templates: Template[] = [
  new Template({
    id: "facebook-ad",
    description: "Create facebook ad for your brand and product",
    name: "Facebook Ad",
    tags: ["Marketing", "Social Media"],
    prompt: `
    Write a creative ad for the following product to run on Facebook aimed at [aming-at]:

    Product Name: [product-name]

    Product Description: [proudct-description]

    `,
    inputs: [
      {
        id: "product-name",
        label: "Name of your product",
        type: "text",
        isRequired: true,
        defaultValue: "Draftify",
        placeholder: "Draftify",
        maxLength: 100,
      },
      {
        id: "aiming-at",
        label: "Who are you aiming for?",
        type: "text",
        isRequired: true,
        defaultValue: "Content creator",
        placeholder: "Content creator",
        maxLength: 100,
      },
      {
        id: "product-description",
        label: "Discribe your product",
        type: "textarea",
        isRequired: true,
        defaultValue:
          "Draftify is an online ai content creation tool which helps users create content without having knowledge on writing content.",
        placeholder:
          "Draftify is an online ai content creation tool which helps users create content without having knowledge on writing content.",
        minLength: 50,
        maxLength: 300,
      },
    ],
  }),
];
