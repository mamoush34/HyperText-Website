import { observer } from "mobx-react";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { action, observable } from "mobx";

interface IProps {
    store: StaticTextNodeStore;
}
enum Resizer_Type {
    BOTTOM_RIGHT = 0,
    BOTTOM_LEFT = 1,
    TOP_RIGHT = 2,
    TOP_LEFT = 3
}

@observer
export class TextNodeView extends React.Component<IProps> {

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;


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
        if(this.clickedResizer === Resizer_Type.BOTTOM_RIGHT) {
            
            console.log(e.movementX);
            console.log("width" + this.props.store.Width);
        } 
        switch(this.clickedResizer) {
            case Resizer_Type.BOTTOM_RIGHT:
                this.props.store.Width += e.movementX;
                this.props.store.Height += e.movementY;
                break;
            case Resizer_Type.BOTTOM_LEFT:
                this.props.store.Width -= e.movementX;
                this.props.store.Height += e.movementY;
                this.props.store.X += e.movementX;
                break; 
            case Resizer_Type.TOP_LEFT:
                this.props.store.Width -= e.movementX;
                this.props.store.Height -= e.movementY;
                this.props.store.Y += e.movementY;
                this.props.store.X += e.movementX;
                break; 
            case Resizer_Type.TOP_RIGHT:
                this.props.store.Width += e.movementX;
                this.props.store.Height -= e.movementY;
                this.props.store.Y += e.movementY;
                break;       
        }
        

    }
    render() {
        let store = this.props.store;
        return (
            <div className="node text-node" style={{ transform: store.Transform, height: store.Height, width:store.Width }}>
               
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
               
                
                <TopBar store={store} />
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.Title}</h3>
                        <p className="paragraph">{store.Text}</p>
                    </div>
                </div>
            </div>
        );
    }
}