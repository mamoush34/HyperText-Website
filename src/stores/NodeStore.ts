import { computed, observable, action } from "mobx";
import {Utils} from "../utils/Utils";
import { NodeCollectionStore } from "./NodeCollectionStore";
import * as Constants from '../constants/Constants'


export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    @observable
    public X: number = 0;

    @observable
    public Y: number = 0;

    @observable
    public Width: number = Constants.NODE_DEFAULT_WIDTH;

    @observable
    public Height: number = Constants.NODE_DEFAULT_HEIGHT;

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

    //holds only reference of which collection the node is in, never been
    //used directly when props could be passed in.
    @observable
    public instanceCollection:NodeCollectionStore;
}