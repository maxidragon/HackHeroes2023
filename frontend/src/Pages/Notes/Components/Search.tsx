import Button from "../../../Components/Button";
import Input from "../../../Components/Input";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../Atoms";
import { t } from "i18next";

export default function Search({
  setCategory,
  setPublicity,
  setSearch,
}: {
  setCategory: Function;
  setPublicity: Function;
  setSearch: Function;
}) {
  const user = useAtomValue(userAtom);
  const categories = [
    "MATH",
    "ENGLISH",
    "GERMAN",
    "FRENCH",
    "BIOLOGY",
    "CHEMISTRY",
    "PHYSICS",
    "HISTORY",
    "GEOGRAPHY",
    "POLITICS",
    "ECONOMICS",
    "PHILOSOPHY",
    "RELIGION",
    "SPORT",
    "MUSIC",
    "ART",
    "COMPUTER_SCIENCE",
    "OTHER",
  ];



  return (
    <div className="xl:w-2/5 md:w-3/5 w-full px-4 flex flex-col items-center gap-4">
      <Input
        type="text"
        placeholder={t('searchPlaceholder')}
        onChange={(e) => setSearch(e.target.value)}
        containerClassName="w-full"
      />
      <div className="flex items-center w-full gap-4">
        <select
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          placeholder={t('selectCategoryPlaceholder')}
          className="w-full py-2 px-2 text-center border-2 border-gray-500 focus:border-purple-400 bg-bgClr rounded-lg text-xl text-white roboto overflow-hidden cursor-pointer"
        >
          <option value="">{t('ALL')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {t(category)}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => {
            setPublicity(e.target.value);
          }}
          placeholder={t('selectPublicityPlaceholder')}
          className="w-full py-2 px-2 text-center border-2 border-gray-500 focus:border-purple-400 bg-bgClr rounded-lg text-xl text-white roboto overflow-hidden cursor-pointer"
        >
          <option value="Public">{t('public')}</option>
          <option value="User">{t('private')}</option>
          <option value="Class">{t('class')}</option>
        </select>
        <Button
          type="alt"
          isLink={true}
          to={user.id ? "/notes/add" : "/login"}
          className="max-[500px]:hidden flex !text-lg w-full"
        >
          {t('createNote')}
        </Button>
      </div>
      <Button
        type="alt"
        isLink={true}
        to={user.id ? "/notes/add" : "/login"}
        className="max-[500px]:flex hidden !text-lg w-full"
      >
        {t('createNote')}
      </Button>
    </div>
  );
}
