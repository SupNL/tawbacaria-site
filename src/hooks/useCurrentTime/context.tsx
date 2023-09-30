import { createContext } from "react";

const CurrentTimeContext = createContext<CurrentTimeProps | null>(null);
export default CurrentTimeContext;