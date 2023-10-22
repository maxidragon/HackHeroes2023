import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";

export default function Home() {
  const isPresent = useIsPresent();

  return (
    <div className="h-screen">
      <h1>{t('homeTitle')}</h1>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
