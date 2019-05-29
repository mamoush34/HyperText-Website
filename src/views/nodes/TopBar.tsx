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
    setCurrentLinkList: (isLinkModeOpen: boolean) => void;
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
            if (col.X <= p.store.X && p.store.X <= col.X + col.Width) {
                if (col.Y <= p.store.Y && p.store.Y <= col.Y + col.Height) {
                    if(!(p.store instanceof CollectionStore)) {
                        console.log("Called");
                        console.log("Collection Title: ", col.Title);
                        console.log("Collection Id: ", col.Id);
                        console.log("Collection X: ", col.X);
                        console.log("Collection Y: ", col.Y);
                        if(p.store === col) {
                            "SORUN BURDA";
                        }
                        console.log("Store Id: ", p.store.Id);
                        console.log("Store X: ", p.store.X);
                        console.log("Store Y: ", p.store.Y);
                        p.instanceCollection.removeNode(p.store);
                        col.Nodes.addNode(p.store);
                        return;
                    }
                }
            }
        })
    }
    onLinkClink = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if(this.props.switchLinkMode()) {
            this.props.setLinkModeOpener(this.props.store);
            this.props.setCurrentLinkList(true);
        } else {
            this.props.setLinkModeOpener(undefined);
            this.props.setCurrentLinkList(false);

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
            </div>
        );
    }
}
