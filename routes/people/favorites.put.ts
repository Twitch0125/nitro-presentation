export default eventHandler(async () => {
    const favorites = useStorage('favorites')
    const items = await favorites.getItems(await favorites.getKeys())
    return items
})