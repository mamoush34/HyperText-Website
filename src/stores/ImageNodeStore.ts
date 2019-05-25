import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

export class ImageNodeStore extends NodeStore {

    constructor(initializer: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string = "";

    @observable
    public Url: any;


    setImageUrl(url: any) {
        this.Url = url;
    }

}