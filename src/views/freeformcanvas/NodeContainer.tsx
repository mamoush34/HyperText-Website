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

interface IProps {
    store: NodeCollectionStore
}

export enum Resizer_Type {
    BOTTOM_RIGHT = 0,
    BOTTOM_LEFT = 1,
    TOP_RIGHT = 2,
    TOP_LEFT = 3
}



@observer
export class NodeContainer extends React.Component<IProps> {

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
    

    render() {
        return (
            <div className="node-container" onWheel={(e) => e.stopPropagation()}>
                {this.props.store.Nodes.map(nodeStore => {
                    if (nodeStore instanceof StaticTextNodeStore) {
                        return (<TextNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as StaticTextNodeStore} resize={this.resizeNode} />)
                    } else if (nodeStore instanceof VideoNodeStore) {
                        return (<VideoNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as VideoNodeStore} resize={this.resizeNode}/>)
                    } else if (nodeStore instanceof ImageNodeStore) {
                        return (<ImageNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as ImageNodeStore} resize={this.resizeNode}/>)
                    } else if (nodeStore instanceof PdfNodeStore) {
                        return (<PdfNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as PdfNodeStore} resize={this.resizeNode}/>)
                    } else if (nodeStore instanceof WebSiteNodeStore) {
                        return (<WebSiteNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as WebSiteNodeStore} resize={this.resizeNode}/>)
                    } else if (nodeStore instanceof CollectionStore) {
                        return (<CollectionStoreNodeView key={nodeStore.Id} storeCollection={this.props.store} store={nodeStore as CollectionStore} resize= {this.resizeNode}/>)
                    }
                })}
            </div>
        );
    }
}