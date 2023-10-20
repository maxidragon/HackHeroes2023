import { useState, useCallback, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";
import Avatar from "react-avatar";

const AvatarComponent = (props: {
  userId: number;
  className?: string;
  userName: string;
  size: string;
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const AvatarSpinner = () => (
    <ColorRing
      visible={true}
      width={props.size}
      height={props.size}
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      colors={["##a78bfa", "##5b21b6", "##9333ea", "##e879f9", "##f5d0fe"]}
    />
  );

  const getAvatarUrl = useCallback(async (): Promise<void> => {
    fetch(
      `${import.meta.env.VITE_API_URL}/user/settings/avatar/${props.userId}`,
      {
        credentials: "include",
        method: "GET",
      }
    )
      .then((res: Response) => {
        if (!res.ok || res.status === 204) throw new Error();
        return res.blob();
      })
      .then((blob) => setAvatarUrl(URL.createObjectURL(blob)))
      .catch(() => setAvatarUrl(""))
      .finally(() => {
        setIsLoading(false);
      });
  }, [props.userId]);

  useEffect(() => {
    getAvatarUrl();
  }, [getAvatarUrl]);

  return (
    <>
      {isLoading ? (
        <AvatarSpinner />
      ) : avatarUrl ? (
        <img
          className={props.className}
          style={{
            width: props.size,
            height: props.size,
            borderRadius: "50%",
          }}
          src={avatarUrl}
          alt="User's avatar"
        />
      ) : (
        <Avatar name={props.userName} size={props.size} round={true} />
      )}
    </>
  );
};

export default AvatarComponent;
