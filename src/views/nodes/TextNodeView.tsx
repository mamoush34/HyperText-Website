import { observer } from "mobx-react";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { action, observable } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { NodeStore } from "../../stores/NodeStore";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import LinkContainer from "../linkcontainer/LinkContainer";


interface IProps {
    store: StaticTextNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => boolean;
    linkMode: boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    linkModeOpener : NodeStore;
    openerLinkList : Set<NodeStore>;
    setOpenerArray: (nodeList: Set<NodeStore>) => void;
}


@observer
export class TextNodeView extends React.Component<IProps> {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    
    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    //@observable editorState:EditorState = this.props.store.Text;
    @observable private nodeZIndex:number = 1;
    @observable private nodeLinkList: Set<NodeStore> = new Set();


    handleChange = (e: EditorState): void =>{
        // this.editorState = e;
        this.props.store.assignText(e);
    }




    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.addEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    resizeEvent = (e: PointerEvent) => {
        this.props.resize(e, this._isPointerDown, this.clickedResizer, this.props.store);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onRemoveNodeClick = ():void => {
        let p = this.props;
        p.storeCollection.removeNode(p.store);
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
                p.openerLinkList.add(p.store);
                console.log("length: " , p.openerLinkList.size)

            }
        }
    }

    
    render() {
        let store = this.props.store;
        console.log("I got called haha");

        return (
          
            <div className="node text-node" style={{ transform: store.Transform, height: store.Height, width:store.Width, zIndex: this.nodeZIndex}} onClick={this.onLinkClick}>
               
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
                <TopBar store={store} storeNodes={this.props.storeNodes} instanceCollection={this.props.storeCollection} bringFront={this.bringFront} bringBack={this.bringBack} switchLinkMode={this.props.switchLinkMode} setLinkModeOpener={this.props.setLinkModeOpener} setCurrentLinkList={this.becomeCurrentOpenerList}/>
                <div style={{display: "inherit", position:"absolute", border:"2px solid black", borderRadius:"10px", outline:"none", background:"burlywood"}}><LinkContainer Nodes={this.nodeLinkList} /></div>
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.Title}</h3>
                        <Editor
                            toolbarOnFocus
                            editorState={this.props.store.Text}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.handleChange}
                        />
                    </div>
                </div>
            </div>
            
          
        );
    }
}