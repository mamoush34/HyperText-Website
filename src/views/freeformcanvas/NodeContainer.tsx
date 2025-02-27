import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import { TextNodeView } from "../nodes/TextNodeView";
import { VideoNodeView } from "../nodes/VideoNodeView";
import "./FreeFormCanvas.scss";
import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { ImageNodeView } from "../nodes/ImageNodeView";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { PdfNodeView } from "../nodes/PdfNodeView";
import { WebSiteNodeStore } from "../../stores/WebSiteNodeStore";
import { WebSiteNodeView } from "../nodes/WebSiteNodeView";
import { CollectionStore } from "../../stores/CollectionStore";
import { CollectionStoreNodeView } from "../nodes/CollectionStoreNodeView";
import { observable, action } from "mobx";
import { Canvas_Type } from "../../Dashboard";

interface IProps {
    store: NodeCollectionStore
    storeNodes: NodeCollectionStore
    currentView: Canvas_Type;
}

//enums that represent which corner of the resizer is
export enum Resizer_Type {
    BOTTOM_RIGHT = 0,
    BOTTOM_LEFT = 1,
    TOP_RIGHT = 2,
    TOP_LEFT = 3
}



@observer
export class NodeContainer extends React.Component<IProps> {

    //Both of the linkMode and linkModeOpener variables are in here, so that user won't be able to link across
    //different collections. Also made sure linking closes, when user changes view.
    //storing the status of linking in a higher level like here to be able to pass to all views under it.
    @observable private linkMode: boolean = false;
    //storing which nodeStore opened the linkMode so that keeping track of the which node to pair with clicks.
    @observable private linkModeOpener: NodeStore = undefined;

    /**
     * The method that resizes the nodes that is passed in according to correct resizer.
     */
    resizeNode = (e: PointerEvent, isPointerDown: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!isPointerDown) {
            return;
        }
        switch(clickedResizer) {
            case Resizer_Type.BOTTOM_RIGHT:
                nodeStore.Width += e.movementX;
                nodeStore.Height += e.movementY;
                break;
            case Resizer_Type.BOTTOM_LEFT:
                nodeStore.Width -= e.movementX;
                nodeStore.Height += e.movementY;
                nodeStore.X += e.movementX;
                break; 
            case Resizer_Type.TOP_LEFT:
                nodeStore.Width -= e.movementX;
                nodeStore.Height -= e.movementY;
                nodeStore.Y += e.movementY;
                nodeStore.X += e.movementX;
                break; 
            case Resizer_Type.TOP_RIGHT:
                nodeStore.Width += e.movementX;
                nodeStore.Height -= e.movementY;
                nodeStore.Y += e.movementY;
                break;       
        }
        
    
    }

    /**
     * Function that is passed down to switch link mode on/off.
     */
    @action
    switchLinkMode = () => {
        if(this.linkMode){ 
            return this.linkMode = false;
        } else {
            return this.linkMode = true;
        }
    }

    /**
     * Function that is passed down to views to set which node opened the link mode.
     */
    @action
    setLinkModeOpener = (store: NodeStore) => {
        this.linkModeOpener = store;
    }

    render() {
        return (
            <div className="node-container" onWheel={(e) => e.stopPropagation()}>
                {this.props.store.Nodes.map((nodeStore, index) => {
                    if(this.props.currentView === Canvas_Type.GRID_FORM) {
                        nodeStore.setGridIndex(index);
                    }
                    if (nodeStore instanceof StaticTextNodeStore) {
                        return (<TextNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as StaticTextNodeStore} resize={this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    } else if (nodeStore instanceof VideoNodeStore) {
                        return (<VideoNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as VideoNodeStore} resize={this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    } else if (nodeStore instanceof ImageNodeStore) {
                        return (<ImageNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as ImageNodeStore} resize={this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    } else if (nodeStore instanceof PdfNodeStore) {
                        return (<PdfNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as PdfNodeStore} resize={this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    } else if (nodeStore instanceof WebSiteNodeStore) {
                        return (<WebSiteNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as WebSiteNodeStore} resize={this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    } else if (nodeStore instanceof CollectionStore) {
                        return (<CollectionStoreNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as CollectionStore} resize= {this.resizeNode} storeNodes={this.props.storeNodes} linkMode={this.linkMode} switchLinkMode={this.switchLinkMode} setLinkModeOpener={this.setLinkModeOpener} linkModeOpener={this.linkModeOpener} currentView={this.props.currentView}/>)
                    }
                })}
            </div>
        );
    }
}