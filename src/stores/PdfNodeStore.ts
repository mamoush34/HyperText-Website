import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class PdfNodeStore extends NodeStore {

    constructor(initializer: Partial<PdfNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

   
    @observable
    public Pdf: File;

    @action
    setPdf(pdf: File) {
        this.Pdf = pdf;
    }

}