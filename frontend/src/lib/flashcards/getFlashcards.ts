const getFlashcards = async (type: "my" | "class" | "public") => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/${type}`, {
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