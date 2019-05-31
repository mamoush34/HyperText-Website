import { observer } from "mobx-react";
import { NodeStore } from "../../stores/NodeStore";
import "./NodeView.scss";
import React = require("react");
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { CollectionStore } from "../../stores/CollectionStore";
import * as Constants from '../../constants/Constants'


interface IProps {
    store: NodeStore;
    instanceCollection: NodeCollectionStore;
    storeNodes: NodeCollectionStore;
    bringFront: () => void;
    bringBack: () => void;
    switchLinkMode: () => boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    setLinkBoxVisible: () => void;
    linkMode:boolean;
}

/**
 * This class models the top bar attached to the node views.
 */
@observer
export class TopBar extends React.Component<IProps> {

    private _isPointerDown = false;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
        this.props.bringFront();
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        this.checkDroppedOut(e);
        this.checkDropped();
        this.props.bringBack();

    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this._isPointerDown) {
            return;
        }
        this.props.store.X += e.movementX;
        this.props.store.Y += e.movementY;


    }

    /**
     * This function is called to check if the node is dropped inside a nested store node, so it can
     * be nested.
     */
    checkDropped = ():void => {
        let p = this.props;
        p.storeNodes.Nodes.forEach((col:CollectionStore) => {
            if (col.X <= p.store.X && p.store.X + p.store.Width <= col.X + col.Width) {
                if (col.Y <= p.store.Y && p.store.Y + p.store.Height <= col.Y + col.Height) {
                    if(p.store !== col) {
                        if(!col.Nodes.Nodes.includes(p.store)) {
                            p.instanceCollection.removeNode(p.store);
                            p.store.X = 0;
                            p.store.Y = 0;
                            col.Nodes.Scale = 1;
                            col.Nodes.X = 0;
                            col.Nodes.Y = 0;
                            p.store.instanceCollection = col.Nodes;
                            col.Nodes.addNode(p.store);
                            return;
                        } else {
                            return;
                        }
                    }
                }
            }
        })
    }

    /**
     * This function is called to check if a node nested in another node is dragged out, and if so
     * it's taken out to parent collection with appropriate coordinates.
     */
    checkDroppedOut = (e: PointerEvent):void => {
        let p = this.props;
        p.storeNodes.Nodes.forEach((node: CollectionStore) => {
            if(node.Nodes.Nodes.includes(p.store)) {
                //mouse location respective of scaling calculated
                let mouseX = (e.pageX - node.instanceCollection.X) / node.instanceCollection.Scale;
                let mouseY = (e.pageY - node.instanceCollection.Y)/ node.instanceCollection.Scale;
                let nodeX = node.X; 
                let nodeY = node.Y; 

                //left-side
                if (mouseX < nodeX ) { 
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.X = node.X - p.store.Width;
                    p.store.Y = mouseY;
                    return;
                }
                //right-side minus link container
                if(mouseX > nodeX + (node.Width * Constants.NODE_TO_DIV_RATIO)) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.X = node.X + node.Width;
                    p.store.Y = mouseY;

                    return;
                }

                //top side
                if(mouseY < nodeY) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.Y = node.Y - p.store.Height;
                    p.store.X = mouseX;

                    return;
                } 

                //bottom side
                if(mouseY > nodeY + node.Height) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.Y = node.Y + node.Height;
                    p.store.X = mouseX;

                    return;
                }
            }
        });
    }

    /**
     * This is the method that is called to open the link mode for the node.
     */
    onLinkClink = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if(this.props.switchLinkMode()) {
            this.props.setLinkModeOpener(this.props.store);
        } else {
            this.props.setLinkModeOpener(undefined);
        }
    }

    /**
     * Function responsible of removing the node from the collection and the store nodes
     * that are kept track of. Also any links between it.
     */
    onRemoveNodeClick = ():void => {
        let p = this.props;
        p.instanceCollection.removeNode(p.store);
        p.store.linkedNodes.forEach((node) => node.linkedNodes.splice(node.linkedNodes.indexOf(p.store), 1))
        if(p.store instanceof CollectionStore) {
            p.storeNodes.removeNode(p.store);
        }
    }

    render() {
        let p = this.props
        return (
            <div className="top" onPointerDown={this.onPointerDown}>
                <button onClick={p.setLinkBoxVisible}
                    style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    textAlign:"center",
                    position: "absolute",
                    left: "0",
                    cursor: "pointer",
                    }}>
                    See Links
                </button>
                <button onClick={this.onLinkClink}
                    style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    textAlign:"center",
                    position: "absolute",
                    left: "43%",
                    cursor: "pointer",
                    background: p.linkMode ? "green" : "white",
                    color: p.linkMode ? "white" : "black"
                    }}>
                    Link!
                </button>
                <div className="removeButton" onClick={this.onRemoveNodeClick}>X</div>
            </div>
        );
    }
}
