import { defineEventHandler, eventHandler } from "h3";

export default eventHandler(async (event) => {
  //Can take in a validator function from your favorite library, like Zod or Valibot
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<{ name: string }>(
    `http://swapi.dev/api/people/${id}`
  );
  return {...data, name: data.name.toUpperCase()}; //automatically gets serialized as JSON
});
