import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import "./FreeFormCanvas.scss";
import { NodeContainer } from "./NodeContainer";
import React = require("react");
import DashBar from "../dashbar/dashbar";

interface IProps {
    store: NodeCollectionStore
    storeNodes: NodeCollectionStore
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

        let store = this.props.store;

        let xOffset = e.pageX / store.Scale - store.X / store.Scale;
        let yOffset = e.pageY/ store.Scale - store.Y / store.Scale;

        let scaleFactor = e.deltaY * 0.001;
        if((store.Scale + scaleFactor) <= 0.01) {
            return;
        }
        store.Scale += scaleFactor;

        store.X = -(xOffset - e.pageX/ store.Scale) * store.Scale;
        store.Y =  -(yOffset - e.pageY/ store.Scale) * store.Scale;


    }

    render() {
        let store = this.props.store;
        return (
            // `url(${`images/${filename}`})`
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown} onWheel={this.onWheelZoom} style={{backgroundImage: 'url(' + require('../../images/canvas_background.jpg') + ')'}}>
                <div className="freeformcanvas" style={{ transform: store.Transform }}>
                    <NodeContainer store={store} storeNodes={this.props.storeNodes}/>
                </div>
            </div>
        );
    }
}