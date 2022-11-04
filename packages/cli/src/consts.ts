import path from "path";
import { fileURLToPath } from "url";

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

//export const PKG_ROOT = path.dirname(require.main.filename);

export const TITLE_TEXT = `_________                __         .__        
\_   ___ \_____  _______/  |______  |__| ____  
/    \  \/\__  \ \____ \   __\__  \ |  |/    \ 
\     \____/ __ \|  |_> >  |  / __ \|  |   |  \
 \______  (____  /   __/|__| (____  /__|___|  /
        \/     \/|__|             \/        \/ 
`;

