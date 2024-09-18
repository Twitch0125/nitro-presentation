---
# You can also start simply with 'default'
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Nitro
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

# Nitro

The next generation server toolkit

---

# What is Nitro?

A tool to build server-side apps. It's a combination of several projects in the
[UnJS](https://unjs.io) ecosystem. <br /> Started by the Nuxt team, now
maintained by [Pooya Parsa (pi0)](https://github.com/pi0).

[Visualization](https://unjs.io/relations?u[]=automd&u[]=bundle-runner&u[]=c12&u[]=changelogen&u[]=citty&u[]=confbox&u[]=consola&u[]=cookie-es&u[]=crossws&u[]=db0&u[]=defu&u[]=destr&u[]=fontaine&u[]=fs-memo&u[]=get-port-please&u[]=giget&u[]=h3&u[]=hookable&u[]=httpxy&u[]=image-meta&u[]=ipx&u[]=jimp-compact&u[]=jiti&u[]=knitwork&u[]=listhen&u[]=magic-regexp&u[]=magicast&u[]=mdbox&u[]=mkdist&u[]=mlly&u[]=mongoz&u[]=nanotar&u[]=nitropack&u[]=node-fetch-native&u[]=nypm&u[]=ofetch&u[]=ohash&u[]=pathe&u[]=perfect-debounce&u[]=pkg-types&u[]=radix3&u[]=rc9&u[]=scule&u[]=serve-placeholder&u[]=std-env&u[]=theme-colors&u[]=ufo&u[]=unbuild&u[]=uncrypto&u[]=unctx&u[]=undocs&u[]=unenv&u[]=unhead&u[]=unimport&u[]=unpdf&u[]=unplugin&u[]=unstorage&u[]=untun&u[]=untyped&u[]=unwasm&u[]=uqr&u[]=webpackbar&showDependencies=true&showDevDependencies=false&showChildren=false)

- H3 for handling HTTP
  - Express Compatible
- Filesystem Routing
- Optimized for cold start times
- Slick DX
  - Auto Imports
  - Zero Config
  - Storage and Cache layer <span class="opacity-50"> unstorage </span>
  - experimental Web Sockets/SSE, SQL Query Builder, Task Runner
- (maybe) Deploy Anywhere <span class="opacity-50"> unenv </span>

---
layout: center
---

# Why should I care?

<v-click>
The next generation of meta frameworks are using it for their server.

[Solid Start](https://start.solidjs.com/),
[Tanstack Start](https://tanstack.com/start), [Nuxt 3](https://nuxt.com),
[Analog](https://analogjs.org/) and
[Angular (soon?)](https://angular.dev/roadmap#future-work-explorations-and-prototyping)

There's also [Vinxi](https://vinxi.vercel.app/) which wraps Vite and Nitro and
is being worked on by the Solid Start team.
</v-click>

---

# Routing

```
routes/
  index.ts - matches `/`
  people.get.ts - GET `/people`
  people.post.ts
  people/
    [personId].get.ts - GET `/people/2`
  [...].ts - GET/PUT/WHATEVER `/anything/else`
package.json
```

---

# HTTP with h3

```ts {all|3|4-11|11-}
// routes/people/[id].get.ts

export default eventHandler(async (event) => {
  //Can take in a validator function from your favorite library, like Zod or Valibot
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  );
  data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  return data; //automatically gets serialized as JSON
});
```

`$fetch` - instance of [ofetch](https://unjs.io/packages/ofetch)

---

# Cache

````md magic-move
```ts
export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  );
  data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  return data;
});
```

```ts
export default cachedEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  );
  data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  return data;
}, { maxAge: 60 * 60 * 1000 });
```

```ts
export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = cachedFunction(async () => await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  ), { maxAge: 60 * 60 * 1000 })
  data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  return data;
}});
```
````

---

# Cache

```ts
export default defineNitroConfig({
  routeRules: {
    "/people/*": {
      cache: {
        maxAge: 60 * 60 * 1000,
      },
    },
  },
});
```

---

# Storage

````md magic-move
```ts
export default defineNitroConfig({
  storage: {
    cache: {
      driver: "redis",
      host: "HOSTNAME",
      tls: true,
      port: 6380,
      password: "PASSWORD",
    },
  },
});
```

```ts
export default defineNitroConfig({
  storage: {
    cache: {
      driver: "redis",
      host: "HOSTNAME",
      tls: true,
      port: 6380,
      password: "PASSWORD",
    },
    favorites: {
      driver: "fs",
      base: ".data/favorites",
    },
  },
});
```
````

---

# Storage

Maybe we want to save some people as "favorites"

```ts
//routes/favorites/[id].put.ts
export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  );
  const res = data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  await useStorage('favorites').setItem(id, res);
  return res;
});
```

---

# In-Server fetch

URL = Uniform **resource** Locator

Why not reuse our existing resource?

````md magic-move
```ts
export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (data) => {
    const id = Number(data.id);
    if (Number.isNaN(id)) {
      throw new Error("id must be a number");
    }
    return { id: id };
  });
  const data = await $fetch<[{ name: string }]>(
    `http://swapi.dev/api/people/${id}`,
  );
  const res = data.map((item) => ({ ...item, name: item.name.toUpperCase() }));
  await useStorage("favorites").setItem(id, res);
  return res;
});
```

```ts
export default eventHandler(async (event) => {
  const res = await $fetch(`/people/${getRouterParam(event, "id")}`);
  await useStorage("favorites").setItem(id, res);
  return res;
});
```
````

<v-click>
No HTTP Request is actually made to `/people`, Nitro will call the function directly.
</v-click>
