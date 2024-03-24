import { command } from "bdsx/command";

// empty parameters
command.register("ccc", "empty params example").overload((param, origin, output) => {

    output.success(`empty params example> origin=${origin.getName()}\n`);
}, {});