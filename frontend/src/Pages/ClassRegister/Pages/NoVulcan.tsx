import { t } from "i18next";

export default function NoVulcan() {
  return (
    <div className="w-full h-full flex items-center flex-col justify-center gap-8">
      <h1 className="text-center text-gray-400 text-3xl roboto">
        {t("noVulcan")}
      </h1>
      <h2 className="text-center text-gray-400 text-2xl roboto">
        {t("noVulcanWhereInputs")}
      </h2>
      <h3 className="text-center text-gray-400 text-2xl roboto">
        {t("relogAgain")}
      </h3>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/2K_WBqGYbbM?si=nS_h7oPY9p2IUz2E"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-xl border-4 border-purple-400"
      ></iframe>
    </div>
  );
}
