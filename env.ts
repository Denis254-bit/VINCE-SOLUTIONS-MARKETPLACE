import fs from "fs";
console.log(Object.keys(process.env).filter(k => !k.startsWith("npm_")));
