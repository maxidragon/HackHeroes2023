import { Toaster } from "react-hot-toast";

export default function ToasterComponent() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          className: "",
          duration: 3000,
          style: {
            background: "#abe39f",
            color: "var(--bg-clr)",
            fontSize: "1.2rem",
          },
        },
        error: {
          className: "",
          duration: 3000,
          style: {
            background: "#e39f9f",
            color: "var(--bg-clr)",
            fontSize: "1.2rem",
          },
        },
      }}
    />
  );
}
