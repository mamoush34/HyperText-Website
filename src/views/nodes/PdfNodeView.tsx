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



interface IProps {
    store: PdfNodeStore;
    storeCollection: NodeCollectionStore;
    resize: (e:PointerEvent, pointerFlag: boolean, clickedResizer: Resizer_Type, nodeStore: NodeStore) => void;
    storeNodes: NodeCollectionStore;
    switchLinkMode: () => boolean;
    linkMode: boolean;
    setLinkModeOpener: (store:NodeStore) => void;
    linkModeOpener : NodeStore;
    // openerLinkList : NodeStore[];
    // setOpenerArray: (nodeList: NodeStore[]) => void;


}

const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
  };

@observer
export class PdfNodeView extends React.Component<IProps> {
     
    //   onDocumentLoadSuccess = ({ numPages }) => {
    //     this.setState({ numPages });
    //   }

   // @observable pdfObject:{} = {numPages :null, pageNumber: 1};

    private _isPointerDown = false;
    @observable private clickedResizer: Resizer_Type;
    @observable numPages:number;
    @observable pageNumber:number = 1;
    @observable private nodeZIndex:number = 1;
    // @observable private nodeLinkList: NodeStore[] = new Array();
    @observable private isLinkBoxRendered: boolean = false;
    @observable private title: HTMLInputElement;



    //@observable curPdf:File;

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

    onDocumentLoadSuccess = (numPages:{numPages:number}) => {
        this.numPages = numPages.numPages;
    }

    onFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
       //this.curPdf = event.target.files[0];
        let p = this.props;
        p.store.setPdf(event.target.files[0]);
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
        if(this.isLinkBoxRendered) {
            this.isLinkBoxRendered = false;

        } else {
            this.isLinkBoxRendered = true;
        }
    }

    renderLinkBox = () => {
        if(this.isLinkBoxRendered) {
            return <div style={{display: "inherit", position:"absolute", border:"2px solid black", borderRadius:"10px", outline:"none", background:"burlywood", width: "25%", height: "calc(100% - 20px)", right: 0, boxSizing: "border-box"}}><LinkContainer Nodes={this.props.store.linkedNodes} workspace={this.props.storeCollection}/></div>;
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

                <div className="removeButton" onClick={this.onRemoveNodeClick}>X</div>
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