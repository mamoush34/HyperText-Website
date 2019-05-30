import { observer } from "mobx-react";
import { NodeStore } from "../../stores/NodeStore";
import "./NodeView.scss";
import React = require("react");
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { CollectionStore } from "../../stores/CollectionStore";

interface IProps {
    store: NodeStore;
    instanceCollection: NodeCollectionStore;
    storeNodes: NodeCollectionStore;
    bringFront: () => void;
    bringBack: () => void;
    switchLinkMode: () => boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    // setCurrentLinkList: (isLinkModeOpen: boolean) => void;
    setLinkBoxVisible: () => void;
    linkMode:boolean;
}

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

    checkDropped = ():void => {
        let p = this.props;
        p.storeNodes.Nodes.forEach((col:CollectionStore) => {
            if (col.X <= p.store.X && p.store.X + p.store.Width <= col.X + col.Width) {
                if (col.Y <= p.store.Y && p.store.Y + p.store.Height <= col.Y + col.Height) {
                    if(p.store !== col) {
                        // console.log("Called");
                        // console.log("Collection Title: ", col.Title);
                        // console.log("Collection Id: ", col.Id);
                        // console.log("Collection X: ", col.X);
                        // console.log("Collection Y: ", col.Y);
                        // console.log("Store Id: ", p.store.Title);
                        // console.log("Store X: ", p.store.X);
                        // console.log("Store Y: ", p.store.Y);
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

    checkDroppedOut = (e: PointerEvent):void => {
        let p = this.props;
        p.storeNodes.Nodes.forEach((node: CollectionStore) => {
            if(node.Nodes.Nodes.includes(p.store)) {
                let mouseX = (e.pageX - node.instanceCollection.X) / node.instanceCollection.Scale;
                let mouseY = (e.pageY - node.instanceCollection.Y)/ node.instanceCollection.Scale;
                let nodeX = node.X; //+ node.instanceCollection.X;
                let nodeY = node.Y; //+ node.instanceCollection.Y;
                console.log("Mouse X:", mouseX, " storeWidth: ", node.Width * 0.75, " node X: ", nodeX);
                console.log("Mouse Y:", mouseY, " storeHeight: ", node.Height, " node Y: ", nodeY);

                console.log("Scale of Node: ", node.instanceCollection.Scale);

                if (mouseX < nodeX ) { 
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.X = node.X - p.store.Width;
                    p.store.Y = mouseY;
                    console.log("First Condition Called!");
                    return;
                }
                if(mouseX > nodeX + (node.Width * 0.75)) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.X = node.X + node.Width;
                    p.store.Y = mouseY;
                    console.log("Second Condition Called!");

                    return;
                }
                if(mouseY < nodeY) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.Y = node.Y - p.store.Height;
                    p.store.X = mouseX;
                    console.log("Third Condition Called!");

                    return;
                } 
                if(mouseY > nodeY + node.Height) {
                    node.Nodes.removeNode(p.store);
                    node.instanceCollection.addNode(p.store);
                    p.store.Y = node.Y + node.Height;
                    p.store.X = mouseX;
                    console.log("Fourth Condition Called!");

                    return;
                }
            }
        });
    }
    onLinkClink = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if(this.props.switchLinkMode()) {
            this.props.setLinkModeOpener(this.props.store);
            // this.props.setCurrentLinkList(true);
        } else {
            this.props.setLinkModeOpener(undefined);
            // this.props.setCurrentLinkList(false);

        }
    }

    onRemoveNodeClick = ():void => {
        let p = this.props;
        p.instanceCollection.removeNode(p.store);
        p.store.linkedNodes.forEach((node) => node.linkedNodes.splice(node.linkedNodes.indexOf(p.store), 1))
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
