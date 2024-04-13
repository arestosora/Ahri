import { AhriClient } from "./structures/Client";
import { Settings } from "./data";

const Ahri = new AhriClient();
Ahri.login(Settings.Credentials.token)

export { Ahri };