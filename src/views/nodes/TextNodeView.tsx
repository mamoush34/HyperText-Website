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
import { Canvas_Type } from "../../Dashboard";


interface IProps {
    store: StaticTextNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => boolean;
    linkMode: boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    linkModeOpener : NodeStore;
    currentView: Canvas_Type;

    // openerLinkList : NodeStore[];
    // setOpenerArray: (nodeList: NodeStore[]) => void;
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
    // @observable private nodeLinkList: NodeStore[] = new Array();
    @observable private isLinkBoxRendered: boolean = false;
    @observable private title: HTMLInputElement;



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


    bringFront = ():void => {
        this.nodeZIndex = 2;
    }

    bringBack = ():void => {
        this.nodeZIndex = 1;
    }

    // becomeCurrentOpenerList = (isLinkModeOpen:boolean): void => {
    //     if(isLinkModeOpen) {
    //         this.props.setOpenerArray(this.nodeLinkList);
    //     } else{
    //         this.props.setOpenerArray(undefined);
    //     }
    // }

    onLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        let p = this.props;
        if (p.linkMode) {
            if (p.linkModeOpener !== p.store) {
                if(!p.linkModeOpener.linkedNodes.includes(p.store)) {
                    p.linkModeOpener.addLinkNode(p.store);
                    console.log("length: " , p.linkModeOpener.linkedNodes.length)
                    p.store.addLinkNode(p.linkModeOpener);

                }

            }
        }
    }

    @action
    changeLinkBoxOpacity = () => {
        console.log("This got called");
        if(this.isLinkBoxRendered) {
            this.isLinkBoxRendered = false;

        } else {
            this.isLinkBoxRendered = true;
            console.log("This is set to true");
        }
    }

    renderLinkBox = () => {
        if(this.isLinkBoxRendered) {
            return <div style={{display: "inherit", position:"absolute", border:"2px solid black", borderRadius:"10px", outline:"none", background:"burlywood", width: "25%", height: "calc(100% - 20px)", right: 0, boxSizing: "border-box"}}><LinkContainer Nodes={this.props.store.linkedNodes} workspace={this.props.storeCollection} currentView={this.props.currentView}/></div>;
        }
        return (null);
    }

    onEnterPress = (e: React.KeyboardEvent): void => {
        if(e.charCode == 13) {
           this.title.blur();
           this.props.store.assignTitle(this.title.value);
        
        }
    }

    
    render() {
        let store = this.props.store;
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
               
                <TopBar store={store} storeNodes={this.props.storeNodes} instanceCollection={this.props.storeCollection} bringFront={this.bringFront} bringBack={this.bringBack} switchLinkMode={this.props.switchLinkMode} setLinkModeOpener={this.props.setLinkModeOpener} linkMode={this.props.linkMode} setLinkBoxVisible={this.changeLinkBoxOpacity}/>
                {this.renderLinkBox()}

                {this.renderLinkBox()}
                <div className="scroll-box">
                    <div className="content">
                        {/* <h3 className="title">{store.Title}</h3> */}
                        <input className="title" type="text" placeholder={store.Title} ref={(e) => this.title = e} onClick={() => this.title.focus()} onKeyPress={this.onEnterPress}/>
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