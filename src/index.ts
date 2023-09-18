import { AhriClient } from "./structures/Client";
import { BotData } from "./data";

const Ahri = new AhriClient();
const AhriData = BotData.getInstance();

Ahri.login(AhriData.getToken);

export { Ahri };