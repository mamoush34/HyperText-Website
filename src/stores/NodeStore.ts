import { computed, observable, action } from "mobx";
import {Utils} from "../utils/Utils";
import { NodeCollectionStore } from "./NodeCollectionStore";

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

    @observable
    public Title: string = "";


    //holds where the node is located in a grid
    @observable
    public gridIndex:number;

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

    @action
    assignTitle(title:string) {
        this.Title = title;
    }

    @action
    setGridIndex(index:number) {
        this.gridIndex = index;
    }

    //holds only reference of which collection the node is in
    @observable
    public instanceCollection:NodeCollectionStore;
}