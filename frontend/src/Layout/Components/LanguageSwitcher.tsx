import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher({className}: {className?: string}) {
    const { i18n } = useTranslation();
    const isEn = i18n.language === "en";
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        i18n.language = lng;
        localStorage.setItem("i18nextLng", lng);
        window.location.reload();
    };

    return (
        <div className={`flex gap-3 ${className}`}>
            <div
                onClick={() => {
                    changeLanguage("en");
                }}
                className="cursor-pointer hover:opacity-80"
                title="English"
            >
                <ReactCountryFlag
                    className="emojiFlag"
                    countryCode="US"
                    style={{
                        fontSize: "2em",
                        opacity: !isEn ? "0.5" : "1",
                    }}
                />
            </div>
            <div
                onClick={() => {
                    changeLanguage("pl");
                }}
                className="cursor-pointer hover:opacity-80"
                title="Polski"
            >
                <ReactCountryFlag
                    className="emojiFlag"
                    countryCode="PL"
                    style={{
                        fontSize: "2em",
                        opacity: isEn ? "0.5" : "1",
                    }}
                />
            </div>
        </div>
    );
}

export default LanguageSwitcher;