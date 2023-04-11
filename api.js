export const Api = {
  GET: async (value) => {
    try {
      let data = await fetch(`https://jsonplaceholder.typicode.com/${value}`)
        .then((res) => res.json())
        .then((data) => data);

      return await data;
    } catch {
      return undefined;
    }
  },
  POST: async (value, data) => {
    try {
      let respons = await fetch(
        `https://jsonplaceholder.typicode.com/${value}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((res) => res.json())
        .then((json) => json);

      return respons;
    } catch {
      return alert("xatolik bo'ldi");
    }
  },
  DELETE: async (value) => {
    try {
      let respons = await fetch(
        `https://jsonplaceholder.typicode.com/${value}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => res.json())
        .then((json) => json);

      return respons;
    } catch {
      return alert("xato");
    }
  },
};
