import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { EditorState } from "draft-js";

export class StaticTextNodeStore extends NodeStore {

    constructor(initializer: Partial<StaticTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string = "";

    @observable
    public Text: EditorState = EditorState.createEmpty();

    assignText(e: EditorState) {
        this.Text = e;
    }
}