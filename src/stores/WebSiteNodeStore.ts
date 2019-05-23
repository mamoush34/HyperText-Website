import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

export class WebSiteNodeStore extends NodeStore {

    constructor(initializer: Partial<WebSiteNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string = "";

    @observable
    public Url: string;

}