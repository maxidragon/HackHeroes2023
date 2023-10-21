import AvatarEditor from "react-avatar-editor";
import { TbArrowBackUp, TbArrowForwardUp, TbX } from "react-icons/tb";
import Button from "../../../../Components/Button";
import { useRef } from "react";

export default function avatarEditorModal({
  setIsUserEditingAvatar,
  setAvatarBlob,
  avatarEditingOptions,
  setAvatarEditingOptions,
  avatarBlob,
}: any) {
  const newAvatarRef = useRef<any>(null);

  function closeModal() {
    setIsUserEditingAvatar(false);
    setAvatarBlob(undefined);
    setAvatarEditingOptions(undefined);
  }

  function setRotate(direction: string) {
    if (direction === "left")
      setAvatarEditingOptions({
        scale: avatarEditingOptions?.scale || 1,
        rotate: (avatarEditingOptions?.rotate || 0) - 90,
      });
    else
      setAvatarEditingOptions({
        scale: avatarEditingOptions?.scale || 1,
        rotate: (avatarEditingOptions?.rotate || 0) + 90,
      });
  }

  function setScale(e: any) {
    setAvatarEditingOptions({
      scale: e.target.value,
      rotate: avatarEditingOptions?.rotate || 0,
    });
  }

  function saveAvatarImage() {
    if (!newAvatarRef.current) return;
    const canvas = newAvatarRef.current.getImage();
    canvas.toBlob((blob: Blob) => {
      if (!blob) return;
      setAvatarBlob(blob);
      setIsUserEditingAvatar(false);
    });
    setAvatarEditingOptions(undefined);
    setIsUserEditingAvatar(false);
  }

  return (
    <div className="absolute w-screen h-screen flex items-center justify-center z-30 bg-[#2e2f307a] left-0 top-0">
      <div className="bg-[#3f4142] flex flex-col gap-8 p-8 rounded-xl items-center relative">
        <TbX
          onClick={closeModal}
          className="text-gray-100 text-xl cursor-pointer absolute left-2 top-2"
        />
        <AvatarEditor
          image={avatarBlob ? URL.createObjectURL(avatarBlob) : ""}
          width={16 * 16}
          height={16 * 16}
          borderRadius={150}
          color={[173, 181, 189, 0.6]}
          scale={+(avatarEditingOptions?.scale || 1)}
          rotate={avatarEditingOptions?.rotate || 0}
          ref={newAvatarRef}
        />
        <div className="flex items-center gap-2">
          <Button
            type="alt"
            onClick={() => {
              setRotate("left");
            }}
            width="w-full"
          >
            <TbArrowBackUp />
          </Button>
          <input
            type="range"
            min={1}
            max={3}
            onChange={setScale}
            step={0.01}
            defaultValue={1}
          />
          <Button
            type="alt"
            onClick={() => {
              setRotate("right");
            }}
            width="w-full"
          >
            <TbArrowForwardUp />
          </Button>
        </div>
        <Button type="default" onClick={saveAvatarImage} width="w-full">
          Save
        </Button>
      </div>
    </div>
  );
}
