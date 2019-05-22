import { observer } from "mobx-react";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { action, observable } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { NodeStore } from "../../stores/NodeStore";
// import {Editor, EditorState, RichUtils} from 'draft-js';
// import 'draft-js/dist/Draft.css';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


interface IProps {
    store: StaticTextNodeStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
}


@observer
export class TextNodeView extends React.Component<IProps> {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // this.state = {editorState: EditorState.createEmpty()};
    }

    
    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable editorState:EditorState = EditorState.createEmpty();

    handleChange = (e: EditorState): void =>{
        this.editorState = e;
        //this.setState({editorState: e});
    }

    // handleKeyCommand = (command) => {
    //     const newState = RichUtils.handleKeyCommand(this.editorState, command)
    //     if (newState) {
    //         this.handleChange(newState);
    //         return 'handled';
    //     }
    //     return 'not-handled';
    // }

    // onItalicClick = () => {
    //     this.handleChange(RichUtils.toggleInlineStyle(this.editorState, 'ITALIC'))
    // }
    // onBoldClick = () => {
    //     this.handleChange(RichUtils.toggleInlineStyle(this.editorState, 'BOLD'))
    // }
    // onUnderlineClick = () => {
    //     this.handleChange(RichUtils.toggleInlineStyle(this.editorState, 'UNDERLINE'))
    // }



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
                        {/* <button onClick={this.onUnderlineClick}>U</button>
                        <button onClick={this.onBoldClick}><b>B</b></button>
                        <button onClick={this.onItalicClick}><em>I</em></button>  */}
                        {/* <Editor editorState={this.editorState}  handleKeyCommand={this.handleKeyCommand} onChange={(e) => this.handleChange(e)} /> */}
                        <Editor
                            toolbarOnFocus
                            editorState={this.editorState}
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