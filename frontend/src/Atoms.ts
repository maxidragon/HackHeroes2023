import { atom } from "jotai";
import getUserObject from "./lib/getUser";

const userAtom = atom(getUserObject());

export { userAtom };
