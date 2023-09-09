import { IScore } from "../types";

export class Drawer {
  private bodyElement: Element;
  private wrapper: Element;
  private contentElement: Element;
  private headerElement: Element;

  constructor() {
    this.bodyElement = document.querySelector("body")!;
    this.wrapper = document.createElement("div");
    this.contentElement = document.createElement("div");
    this.headerElement = document.createElement("div");
  }

  init = () => {
    this.appendDrawerToBody();
  };

  appendDrawerToBody = () => {
    this.wrapper.classList.add("drawer-wrapper");
    this.contentElement.classList.add("drawer-content");
    this.headerElement.classList.add("drawer-content-header");

    this.headerElement.textContent = "Top 10 Player";

    this.contentElement.append(this.headerElement);
    this.wrapper.append(this.contentElement);

    this.attachClickOutsite();

    this.bodyElement.append(this.wrapper);
  };

  showDrawer = ({ scores }: { scores: IScore[] }) => {
    this.wrapper.classList.add("show");

    const dataElement = document.createElement("div");
    dataElement.classList.add("data");

    scores.map((score) => {
      const recordElement = document.createElement("div");
      const scoreElement = document.createElement("p");
      const timeElement = document.createElement("p");

      recordElement.classList.add("data-record");

      scoreElement.classList.add("data-record-score");
      timeElement.classList.add("data-record-time");

      scoreElement.textContent = `Score - ${score.score}`;
      timeElement.textContent = `Time - ${score.time}`;

      recordElement.append(scoreElement);
      recordElement.append(timeElement);

      dataElement.append(recordElement);
    });

    this.contentElement.append(dataElement);

    setTimeout(() => {
      this.contentElement.classList.add("drawer-content-show");
    }, 350);
  };

  closeDrawer = () => {
    this.contentElement.classList.remove("drawer-content-show");

    setTimeout(() => {
      this.wrapper.classList.remove("show");
    }, 350);
  };

  onDrawerShow = ({ scores }: { scores: IScore[] }) => {
    this.showDrawer({ scores });
  };

  attachClickOutsite = () => {
    this.wrapper.addEventListener("click", (event: Event) => {
      const target = event.target as Element;

      if (target.classList?.contains("drawer-content")) {
        return;
      }

      this.closeDrawer();
    });
  };
}
