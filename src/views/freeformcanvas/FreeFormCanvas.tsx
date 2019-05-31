import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import "./FreeFormCanvas.scss";
import { NodeContainer } from "./NodeContainer";
import React = require("react");
import DashBar from "../dashbar/dashbar";
import { Canvas_Type } from "../../Dashboard";

interface IProps {
    store: NodeCollectionStore
    storeNodes: NodeCollectionStore
}

/**
 * This class models the free form canvas, which is one of the view
 * options.
 */
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

    /**
     * This function zooms the canvas in or out depending on yDelta relative to where mouse
     * is.
     */
    onWheelZoom = (e: React.WheelEvent) : void => {
        e.stopPropagation();

        let store = this.props.store;

        //Offsets in both axis are calculated depending on mouse location and node location
        //taking scale into account.
        let xOffset = e.pageX / store.Scale - store.X / store.Scale;
        let yOffset = e.pageY/ store.Scale - store.Y / store.Scale;

        let scaleFactor = e.deltaY * 0.001;
        if((store.Scale + scaleFactor) <= 0.01) {
            return;
        }
        store.Scale += scaleFactor;

        //X and Y coordinates of the canvas gets moved depending on the offset, therefore
        //creating a relative zooming look.
        store.X = -(xOffset - e.pageX/ store.Scale) * store.Scale;
        store.Y =  -(yOffset - e.pageY/ store.Scale) * store.Scale;

    }

    render() {
        let store = this.props.store;
        return (
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown} onWheel={this.onWheelZoom} style={{backgroundImage: 'url(' + require('../../images/canvas_background.jpg') + ')'}}>
                <div className="freeformcanvas" style={{ transform: store.Transform }}>
                    <NodeContainer store={store} storeNodes={this.props.storeNodes} currentView={Canvas_Type.FREE_FORM}/>
                </div>
            </div>
        );
    }
}