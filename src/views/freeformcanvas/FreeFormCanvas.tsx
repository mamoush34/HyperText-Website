import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import "./FreeFormCanvas.scss";
import { NodeContainer } from "./NodeContainer";
import React = require("react");

interface IProps {
    store: NodeCollectionStore
}

@observer
export class FreeFormCanvas extends React.Component<IProps> {

    private _isPointerDown: boolean;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
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

    onWheelZoom = (e: React.WheelEvent) : void => {
        e.stopPropagation();
        // e.preventDefault();
        console.log("ScreenX: " + e.screenX);
        console.log("ScreenY: " + e.screenY);
        console.log("PageX: " + e.pageX);
        console.log("PageY: " + e.pageY);



        let xOffset = e.pageX;
        let yOffset = e.pageY;
        this.props.store.X += xOffset;
        this.props.store.Y += yOffset;
        this.props.store.Scale += (e.deltaY * 0.001);
        this.props.store.X -= xOffset;
        this.props.store.Y -= yOffset;

    }

    render() {
        let store = this.props.store;
        return (
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown} onWheel={this.onWheelZoom}>
                <div className="freeformcanvas" style={{ transform: store.Transform }}>
                    <NodeContainer store={store}/>
                </div>
            </div>
        );
    }
}