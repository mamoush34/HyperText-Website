import { observer } from "mobx-react";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { observable } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { NodeStore } from "../../stores/NodeStore";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { Document, Page } from 'react-pdf';


interface IProps {
    store: PdfNodeStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;

}

@observer
export class PdfNodeView extends React.Component<IProps> {
     
    //   onDocumentLoadSuccess = ({ numPages }) => {
    //     this.setState({ numPages });
    //   }

    @observable pdfObject:{} = {numPages :null, pageNumber: 1};

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable numPages:number;
    @observable pageNumber:number = 1;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.addEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
    }
    resizeEvent = (e: PointerEvent) => {
        this.props.resize(e, this._isPointerDown, this.clickedResizer, this.props.store);
    }

    onDocumentLoadSuccess = ({numPages}) => {
        this.pdfObject = {numPages};
    }

    render() {
        let store = this.props.store;
        return (
            <div className="node pdf-node" style={{ transform: store.Transform, height:store.Height, width:store.Width}}>
                <div className="resizer resizer_bottom-right" onPointerDown={(e) => {this.onPointerDown(e);
                    this.clickedResizer = Resizer_Type.BOTTOM_RIGHT}}>
                </div>
                <div className="resizer resizer_top-right" onPointerDown={(e) => {this.onPointerDown(e);
                    this.clickedResizer = Resizer_Type.TOP_RIGHT}}>
                </div>
                <div className="resizer resizer_bottom-left" onPointerDown={(e) => {this.onPointerDown(e);
                    this.clickedResizer = Resizer_Type.BOTTOM_LEFT}}>
                </div>
                <div className="resizer resizer_top-left" onPointerDown={(e) => {this.onPointerDown(e);
                     this.clickedResizer = Resizer_Type.TOP_LEFT}}>
                </div>

                <TopBar store={store} />
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.Title}</h3>
                        <Document
                            file="http://www.africau.edu/images/default/sample.pdf"
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                        <Page pageNumber={this.pageNumber} />
                        </Document>
                    </div>
                </div>
            </div>
        );
    }
}