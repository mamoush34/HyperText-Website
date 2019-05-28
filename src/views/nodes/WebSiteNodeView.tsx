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
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => boolean;
    linkMode: boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    linkModeOpener : NodeStore;
    openerLinkList : NodeStore[];
    setOpenerArray: (nodeList: NodeStore[]) => void;


}

@observer
export class WebSiteNodeView extends React.Component<IProps> {

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable private websiteField: HTMLInputElement;
    @observable private nodeZIndex:number = 1;
    @observable private nodeLinkList: NodeStore[] = new Array();




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

    bringFront = ():void => {
        this.nodeZIndex = 2;
    }

    bringBack = ():void => {
        this.nodeZIndex = 1;
    }

    becomeCurrentOpenerList = (isLinkModeOpen:boolean): void => {
        if(isLinkModeOpen) {
            this.props.setOpenerArray(this.nodeLinkList);
        } else{
            this.props.setOpenerArray(undefined);
        }
    }

    onLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        let p = this.props;
        if (p.linkMode) {
            if (p.linkModeOpener !== p.store) {
                if(!p.openerLinkList.includes(p.store)) {
                    p.openerLinkList.push(p.store);
                    console.log("length: " , p.openerLinkList.length)
                }
            }
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="node video-node" style={{ transform: store.Transform, height:store.Height, width:store.Width, zIndex: this.nodeZIndex}} onClick={this.onLinkClick}>
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
                <TopBar store={store} storeNodes={this.props.storeNodes} instanceCollection={this.props.storeCollection} bringFront={this.bringFront} bringBack={this.bringBack} switchLinkMode={this.props.switchLinkMode} setLinkModeOpener={this.props.setLinkModeOpener} setCurrentLinkList={this.becomeCurrentOpenerList} linkMode={this.props.linkMode}/>
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