import "./style.css";
import { generateSudoku } from "./utils/generateSudoku";

console.log(import.meta.env);

generateSudoku();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
     </div>
`;
