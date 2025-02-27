import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class VideoNodeStore extends NodeStore {

    constructor(initializer: Partial<VideoNodeStore>) {
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