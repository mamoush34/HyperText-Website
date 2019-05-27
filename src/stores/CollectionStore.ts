import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";

export class CollectionStore extends NodeStore {

    constructor(initializer: Partial<CollectionStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Nodes: NodeCollectionStore = new NodeCollectionStore();

    @observable
    public Title: string = "";


}