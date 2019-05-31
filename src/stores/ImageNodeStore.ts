import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class ImageNodeStore extends NodeStore {

    constructor(initializer: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Url: any;

    @action
    setImageUrl(url: any) {
        this.Url = url;
    }

}