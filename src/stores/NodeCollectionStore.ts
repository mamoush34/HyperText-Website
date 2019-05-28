import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class NodeCollectionStore extends NodeStore {

    @observable
    public Scale: number = 1;

    @observable
    public Nodes: NodeStore[] = new Array<NodeStore>();

    @computed
    public get Transform(): string {
        return "translate(" + this.X + "px," + this.Y + "px) scale(" + this.Scale + "," + this.Scale + ")";
    }

    @action
    public AddNodes(stores: NodeStore[]): void {
        stores.forEach(store => this.Nodes.push(store));
    }
    @action
    public addNode(store: NodeStore): void {
        this.Nodes.push(store);
    }

    @action
    public removeNode(store: NodeStore): void {
        this.Nodes.splice(this.Nodes.indexOf(store), 1);
    }

    @action setX(xCord: number):void {
        this.X = xCord;
    }

    @action setY(yCord: number):void {
        this.Y = yCord;
    }

}