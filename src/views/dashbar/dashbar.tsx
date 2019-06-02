import React = require("react");
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { NodeStore } from "../../stores/NodeStore";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import './dashbar.scss'
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { WebSiteNodeStore } from "../../stores/WebSiteNodeStore";
import { Canvas_Type } from "../../Dashboard";
import { EditorState } from "draft-js";
import { CollectionStore } from "../../stores/CollectionStore";

interface DashBarProps {
    mainCollection: NodeCollectionStore,
    view: (view:Canvas_Type) => void,
    storeNodes: NodeCollectionStore
}

/**
 * The class models the dashbar located atop of initial view. It
 * holds buttons.
 */
@observer
export default class DashBar extends React.Component<DashBarProps> {
    
    /**
     * Creates new video node on click.
     */
    onVideoClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);

        this.props.mainCollection.addNode(new VideoNodeStore({ X: newX, Y: newY, Title: "Video Node Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4", instanceCollection: this.props.mainCollection }));
    }

    /**
     * Creates new text node on click.
     */
    onTextClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);
        this.props.mainCollection.addNode(new StaticTextNodeStore({ X: newX, Y: newY, Title: "Text Node Title", Text: EditorState.createEmpty(), instanceCollection: this.props.mainCollection}));
        
    }   

    /**
     * Creates new image node on click.
     */
    onImageClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);
        this.props.mainCollection.addNode(new ImageNodeStore({ X: newX, Y: newY, Title:"Image Node", Url:"", instanceCollection: this.props.mainCollection}));
    }

    /**
     * Creates new pdf node on click.
     */
    onPdfClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);
        this.props.mainCollection.addNode(new PdfNodeStore({ X: newX, Y: newY, Title:"Pdf Node", instanceCollection: this.props.mainCollection}));
    }

    /**
     * Creates new iFrame node on click.
     */
    onWebPageClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);
        this.props.mainCollection.addNode(new WebSiteNodeStore({ X: newX, Y: newY, Title:"Web Node", Url:"https://www.bbc.com/", instanceCollection: this.props.mainCollection}));
    }

    /**
     * Creates new storage node on click.
     */
    onCanvasClick = () => {
        let p = this.props;
        let scaledScrenX = window.screen.width / p.mainCollection.Scale;
        let scaledScrenY = window.screen.height / p.mainCollection.Scale;
        let newX = (p.mainCollection.X / -p.mainCollection.Scale) + (scaledScrenX / 2);
        let newY = (p.mainCollection.Y/ -p.mainCollection.Scale) + (scaledScrenY / 2);
        let newCollection: CollectionStore = new CollectionStore({X:newX, Y:newY, Title:"Store Node", instanceCollection: this.props.mainCollection});

        this.props.mainCollection.addNode(newCollection);
        this.props.storeNodes.addNode(newCollection);
    }

    /**
     * Changes the canavs to free form on click.
     */
    onFreeFormClick = () => {
        this.props.mainCollection.resetTranslate();
        this.props.view(Canvas_Type.FREE_FORM);
    }

    /**
     * Changes the canvas to grid form on click.
     */
    onGridFormClick = () => {
        this.props.mainCollection.resetTranslate();
        this.props.view(Canvas_Type.GRID_FORM);
    }


    render() {
        return(
            <div>
                <div className="dashRect">
                    <a className="node_adders" onClick={this.onVideoClick}>
                        VideoNode
                    </a>
                    <a className="node_adders" onClick={this.onTextClick}>
                        TextNode
                    </a>
                    <a className="node_adders" onClick={this.onImageClick}>
                        ImageNode
                    </a>
                    <a className="node_adders" onClick={this.onPdfClick}>
                        PdfNode
                    </a>
                    <a className="node_adders" onClick={this.onWebPageClick}>
                        WebPageNode
                    </a>
                    <a className="node_adders" onClick={this.onCanvasClick}>
                        CanvasNode
                    </a>
                    <a className="view_changers" onClick={this.onFreeFormClick} style={{top:5, right:5}}> 
                        FreeForm
                    </a>
                    <a className="view_changers" onClick={this.onGridFormClick} style={{top:5, right:100}}> 
                        GridForm
                    </a>
                </div>
            </div>
        );
    }
}