const getFlashcards = async (type: "my" | "class" | "public", querySearch = "") => {

  const URL = querySearch ? `${import.meta.env.VITE_API_URL}/flashcard/${type}?search=${querySearch}` : `${import.meta.env.VITE_API_URL}/flashcard/${type}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) return [];

  return await response.json();
};

export default getFlashcards;