import { openai } from "@/libs/openai";
import { useMutation } from "@tanstack/react-query";

export const useCreateCompletionMutation = () => {
  return useMutation({
    mutationKey: ["generate"],
    mutationFn: async (variables: {
      formData: FormData;
      template: {
        inputs: any;
        prompt: string;
      };
      options?: {
        maxTokens?: number;
        choiceCount?: number;
        bestOfCount?: number;
        topP?: number;
        model?: string;
      };
    }) => {
      const {
        template: { prompt },
        formData,
        options,
      } = variables;

      const reg = /\[[\w\d-_]+\]/g;
      const matchs = prompt.match(reg);
      console.log({ matchs });
      if (!matchs || !matchs?.length) {
        throw Error("Invalid prmopt!");
      }

      let finalPrompt = prompt;

      matchs.forEach((key) => {
        const id = key.replaceAll(/[\[\]]/g, "");
        const value = (formData.get(id) || "") as string;
        if (value) {
          finalPrompt = finalPrompt.replaceAll(key, value.trim());
        }
      });

      const {
        data: { choices, model, id },
      } = await openai.createCompletion({
        prompt: finalPrompt,
        model: options?.model || "text-davinci-003",
        max_tokens: options?.maxTokens || 100,
        top_p: options?.topP || 1,
        n: options?.choiceCount || 3,
        best_of: options?.bestOfCount || 4,
      });

      return {
        id,
        choices: choices
          .filter((choice) => !!choice.text && choice.text.length)
          .map((choice) => choice.text!.trimStart().trimEnd() as string),
        model,
        createdAt: new Date().toISOString(),
      };
    },
  });
};
