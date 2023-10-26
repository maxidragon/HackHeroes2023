const getFlashcardSet = async (id: string) => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/set/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) throw Error("Something went wrong!");

  return await response.json();
};

export default getFlashcardSet;