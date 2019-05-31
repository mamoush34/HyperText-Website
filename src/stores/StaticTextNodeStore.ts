import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { EditorState } from "draft-js";

export class StaticTextNodeStore extends NodeStore {

    constructor(initializer: Partial<StaticTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Text: EditorState = EditorState.createEmpty();

    @action
    assignText(e: EditorState) {
        this.Text = e;
    }

    
}