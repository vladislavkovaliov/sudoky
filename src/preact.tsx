import { render } from "preact";

import { Header } from "./Header";

export function App() {
  return <Header />;
}

render(<App />, document.querySelector("#preact-header")!);

console.log("preact-header");
