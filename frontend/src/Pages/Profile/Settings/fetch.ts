import toast from "react-hot-toast";

const fetchData = async (userId: number, navigate: Function) => {
  await fetch(`${import.meta.env.VITE_API_URL}/user/settings/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status >= 400) {
        toast.error("Something went wrong!");
        navigate(`/profile/${userId}`);
      } else {
        res.json().then((data) => {
          return data;
        });
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!");
      navigate(`/profile/${userId}`);
      console.log(err);
    });

  return undefined;
};

const fetchBanner = async (userId: number, navigate: Function) => {
  await fetch(
    `${import.meta.env.VITE_API_URL}/user/settings/banner/${userId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      if (res.status >= 400) {
        toast.error("Something went wrong!");
        navigate(`/profile/${userId}`);
      } else {
        res.json().then((data) => {
          return data;
        });
      }
    })
    .catch((err) => {
      toast.error("Something went wrong!");
      navigate(`/profile/${userId}`);
      console.log(err);
    });

  return undefined;
};

export { fetchData, fetchBanner };
