import { computed, observable, action } from "mobx";
import {Utils} from "../utils/Utils";

export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    @observable
    public X: number = 0;

    @observable
    public Y: number = 0;

    @observable
    public Width: number = 400;

    @observable
    public Height: number = 400;

    @computed
    public get Transform(): string {
        return "translate(" + this.X + "px, " + this.Y + "px)";
    }

    @observable 
    public linkedNodes:NodeStore[] = new Array();

    @action
    public addLinkNode(node: NodeStore) {
        this.linkedNodes.push(node);
    }
}