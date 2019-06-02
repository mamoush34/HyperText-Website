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
import * as Constants from '../../constants/Constants'



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
}

/**
 * This class models the view for text node stores.
 */
@observer
export class TextNodeView extends React.Component<IProps> {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    
    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable private nodeZIndex:number = Constants.NODE_DEFAULT_Z_INDEX;
    @observable private isLinkBoxRendered: boolean = false;
    @observable private title: HTMLInputElement;
    @observable toolbarState: boolean = false;;


    /**
     * This function is called to store the text of the user in the nodes.
     */
    handleChange = (e: EditorState): void =>{
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

     /**
     * This functions is called to bring the clicked view to the front.
     */
    bringFront = ():void => {
        this.nodeZIndex = Constants.CLICKED_NODE_Z_INDEX;
    }

     /**
     * This function is called to let the view back when clicking is done.
     */
    bringBack = ():void => {
        this.nodeZIndex = Constants.NODE_DEFAULT_Z_INDEX;
    }

    /**
     * The function that is called when the view is get clicked on. It adds the 
     * node to the links of the node that opened the link mode.
     */
    onLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        let p = this.props;
        if (p.linkMode) {
            if (p.linkModeOpener !== p.store) {
                if(!p.linkModeOpener.linkedNodes.includes(p.store)) {
                    p.linkModeOpener.addLinkNode(p.store);
                    p.store.addLinkNode(p.linkModeOpener);

                }

            }
        }
    }

     /**
     * The function that is responsible of setting the condtion of rendering the link box, 
     * when user clicks on the show links.
     */
    @action
    changeLinkBoxOpacity = () => {
        if(this.isLinkBoxRendered) {
            this.isLinkBoxRendered = false;

        } else {
            this.isLinkBoxRendered = true;
        }
    }

    /**
     * The function that is responsible of rending the link box depending on the condition of user's click.
     */
    renderLinkBox = () => {
        if(this.isLinkBoxRendered) {
            return <div style={{display: "inherit", position:"absolute", border:"2px solid black", borderRadius:"10px", outline:"none", background:"burlywood", width: "25%", height: "calc(100% - 20px)", right: 0, boxSizing: "border-box"}}><LinkContainer Nodes={this.props.store.linkedNodes} workspace={this.props.storeCollection} currentView={this.props.currentView}/></div>;
        }
        return (null);
    }

    /**
     * This function is called to assign the title user entered for the store on enter press.
     */
    onEnterPress = (e: React.KeyboardEvent): void => {
        if(e.charCode == 13) {
           this.title.blur();
           this.props.store.assignTitle(this.title.value);
        
        }
    }

    /**
     * This function is called to render the right editor depending on 
     * focus, so that toolbox shows up. It makes sure that a version
     * without toolbox is rendered with user's entered text, when user
     * switches focus.
     */
    renderEditor = () => {
        if(this.toolbarState) {
            return  <Editor
            editorState={this.props.store.Text}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={this.handleChange}
            onBlur={() => this.toolbarState = false}
            />;
        } else {
            return  <Editor
            toolbarHidden
            editorState={this.props.store.Text}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={this.handleChange}
            onFocus={() => this.toolbarState = true}
            />;
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
                <div className="scroll-box" style={{width: this.isLinkBoxRendered ? "75%" : "100%"}}>
                    <div className="content">
                        <input className="title" type="text" placeholder={store.Title} ref={(e) => this.title = e} onClick={() => this.title.focus()} onKeyPress={this.onEnterPress}/>
                        {this.renderEditor()}
                    </div>
                </div>
            </div>
            
          
        );
    }
}