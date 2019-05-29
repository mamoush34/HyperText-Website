import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class WebSiteNodeStore extends NodeStore {

    constructor(initializer: Partial<WebSiteNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    

    @observable
    public Url: string;

    @action
    public setUrl(url:string) {
        this.Url = url;
    }

}