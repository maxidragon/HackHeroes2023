import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";

export default function ClassRegister() {
    const isPresent = useIsPresent();

    return (
      <div className="flex-1">
        <h1>{t('classRegister.title')}</h1>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{
            scaleX: 0,
            transition: { duration: 0.6, ease: "circOut" },
          }}
          exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="privacy-screen z-50"
        />
      </div>
    );
}