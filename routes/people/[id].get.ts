export default eventHandler(
  async (event) => {
    const { id } = await getValidatedRouterParams(event, (data) => {
      getRouterParam()
      const id = Number(data.id);
      if (Number.isNaN(id)) {
        throw new Error("id must be a number");
      }
      return { id: id };
    });
    const data = cachedFunction(
      async () =>
        await $fetch<{ name: string }>(`http://swapi.dev/api/people/${id}`),
      { maxAge: 60 * 60 * 1000,  }
    );
    return { ...data, name: data.name.toUpperCase() }; 
); 
