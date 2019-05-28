import { observer } from "mobx-react";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { observable } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { NodeStore } from "../../stores/NodeStore";
import ImageUpload from "../../imageupload/ImageUploader";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";

interface IProps {
    store: ImageNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => void;
    linkMode: boolean;

}

@observer
export class ImageNodeView extends React.Component<IProps> {

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable private nodeZIndex:number = 1;


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

    onRemoveNodeClick = ():void => {
        let p = this.props;
        p.storeCollection.removeNode(p.store);
    }

    bringFront = ():void => {
        this.nodeZIndex = 2;
    }

    bringBack = ():void => {
        this.nodeZIndex = 1;
    }

    render() {
        let store = this.props.store;
        return (
            <div className="node image-node" style={{ transform: store.Transform, height:store.Height, width:store.Width, zIndex: this.nodeZIndex}}>
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
                <div className="removeButton" onClick={this.onRemoveNodeClick}>X</div>
                <TopBar store={store} storeNodes={this.props.storeNodes} instanceCollection={this.props.storeCollection} bringFront={this.bringFront} bringBack={this.bringBack} switchLinkMode={this.props.switchLinkMode}/>
                <div className="scroll-box">
                    <div className="content">
                        {/* <h3 className="title">{store.Title}</h3> */}
                        {/* <img src={`images/${store.Url}`}/> */}
                        <ImageUpload imageNode ={store}/>
                    </div>
                </div>
            </div>
        );
    }
}