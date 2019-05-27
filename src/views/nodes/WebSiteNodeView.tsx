import { observer } from "mobx-react";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { observable } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { NodeStore } from "../../stores/NodeStore";
import { WebSiteNodeStore } from "../../stores/WebSiteNodeStore";
import Iframe from 'react-iframe'
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";


interface IProps {
    store: WebSiteNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;

}

@observer
export class WebSiteNodeView extends React.Component<IProps> {

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable private websiteField: HTMLInputElement;


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
    
    onEnterPress = (e: React.KeyboardEvent): void => {
        let p = this.props;
        if(e.charCode == 13) {
            p.store.setUrl(this.websiteField.value);
            this.websiteField.value = "";
        
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="node video-node" style={{ transform: store.Transform, height:store.Height, width:store.Width}}>
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
                <TopBar store={store} />
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.Title}</h3>
                        <input 
                            type="text" 
                            placeholder="Please enter a link starting with https://" 
                            id="linkInput" 
                            ref={(el) => { if (el) { this.websiteField = el;}}} 
                            onPointerDown={() => this.websiteField.focus()} 
                            onKeyPress={this.onEnterPress}
                            style ={{
                                border: "1px solid black",
                                borderRadius: 10,
                                outline: "none",
                                width: "50%",
                                textAlign: "center"
                            }}
                            
                        />
                        <iframe 
                            src={store.Url}
                            width="100%"
                            height="80%"
                            id="firstFrame"
                            className="iFrames"
                            style={{display: "block"}}
                            // // display="initial"
                            // position="relative"
                            >
                            </iframe>
                    </div>
                </div>
            </div>
        );
    }
}