import { observer } from "mobx-react";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import React = require("react");
import { observable, action } from "mobx";
import { Resizer_Type } from "../freeformcanvas/NodeContainer";
import { NodeStore } from "../../stores/NodeStore";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import LinkContainer from "../linkcontainer/LinkContainer";
import { Canvas_Type } from "../../Dashboard";



interface IProps {
    store: PdfNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => boolean;
    linkMode: boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    linkModeOpener : NodeStore;
    currentView: Canvas_Type;

}

//Configuration for pdf-js.
const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
  };

/**
 * This class models the view of nodes responsible for storing and viewing PDFs.
 */
@observer
export class PdfNodeView extends React.Component<IProps> {
     

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable numPages:number;
    @observable pageNumber:number = 1;

    @observable private nodeZIndex:number = 1;
    @observable private isLinkBoxRendered: boolean = false;
    @observable private title: HTMLInputElement;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.addEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.resizeEvent);
        document.removeEventListener("pointerup", this.onPointerUp);
    }
    resizeEvent = (e: PointerEvent) => {
        this.props.resize(e, this._isPointerDown, this.clickedResizer, this.props.store);
    }

    /**
     * Called when pdf is loaded succesfully.
     */
    onDocumentLoadSuccess = (numPages:{numPages:number}) => {
        this.numPages = numPages.numPages;
    }

    /**
     * Called when a new file is uploaded.
     */
    onFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        let p = this.props;
        p.store.setPdf(event.target.files[0]);
    }

    /**
     * This functions is called to bring the clicked view to the front.
     */
    bringFront = ():void => {
        this.nodeZIndex = 2;
    }

    /**
     * This function is called to let the view back when clicking is done.
     */
    bringBack = ():void => {
        this.nodeZIndex = 1;
    }

     /**
     * The function that is called when the view is get clicked on. It adds the 
     * node to the links of the node that opened the link mode.
     */
    onLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // e.preventDefault();
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

    render() {
        let store = this.props.store;
        return (
            <div className="node pdf-node" style={{ transform: store.Transform, height:store.Height, width:store.Width, zIndex: this.nodeZIndex}} onClick={this.onLinkClick}>
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

                <TopBar store={store} storeNodes={this.props.storeNodes} instanceCollection={this.props.storeCollection} bringFront={this.bringFront} bringBack={this.bringBack} switchLinkMode={this.props.switchLinkMode} setLinkModeOpener={this.props.setLinkModeOpener}  linkMode={this.props.linkMode} setLinkBoxVisible={this.changeLinkBoxOpacity}/>
                {this.renderLinkBox()}

                <div className="scroll-box">
                    <div className="content">
                        <input className="title" type="text" placeholder={store.Title} ref={(e) => this.title = e} onClick={() => this.title.focus()} onKeyPress={this.onEnterPress}/>

                        <div className="FileInputContainer">
                            <label>Load from file:</label>
                            <input
                            type="file"
                            onChange={this.onFileChange}
                            />
                        </div>
                        <Document
                            file={store.Pdf}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            options={options}
                        >
                        {
                            Array.from(new Array(this.numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={store.Width - 30}
                                />
                            ))
                        }
                        </Document>
                    </div>
                </div>
            </div>
        );
    }
}