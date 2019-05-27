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
    view: (view:Canvas_Type) => void
}

@observer
export default class DashBar extends React.Component<DashBarProps> {

    private maxX:number = 200;
    private maxY:number = 200;
    

    onVideoClick = () => {
        this.props.mainCollection.addNode(new VideoNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Video Node Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
     

    }

    onTextClick = () => {
        this.props.mainCollection.addNode(new StaticTextNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Text Node Title", Text: EditorState.createEmpty()}));
        
    }   

    onImageClick = () => {
        this.props.mainCollection.addNode(new ImageNodeStore({ X: 500, Y: 500, Title:"Image Node", Url:""}));
    }

    onPdfClick = () => {
        this.props.mainCollection.addNode(new PdfNodeStore({ X: 1200, Y: 500, Title:"Pdf Node"}));
    }

    onWebPageClick = () => {
        this.props.mainCollection.addNode(new WebSiteNodeStore({ X: 100, Y: 500, Title:"Web Node", Url:"https://www.google.com/search?igu=1"}));
    }

    onCanvasClick = () => {
        let newCollection: CollectionStore = new CollectionStore({X:800, Y:500, Title:"Store Node"});
        newCollection.Nodes.addNode(new StaticTextNodeStore({ X: Math.random() * 500, Y: Math.random() * 500, Title: "Text Node Title", Text: EditorState.createEmpty() }));

        this.props.mainCollection.addNode(newCollection);
    }

    onFreeFormClick = () => {
        this.props.view(Canvas_Type.FREE_FORM);
    }

    onGridFormClick = () => {
        this.props.view(Canvas_Type.GRID_FORM);
    }


    render() {
        return(
            <div>
                <div className="dashRect">
                    <button className="node_adders" onClick={this.onVideoClick}>
                        VideoNode
                    </button>
                    <button className="node_adders" onClick={this.onTextClick}>
                        TextNode
                    </button>
                    <button className="node_adders" onClick={this.onImageClick}>
                        ImageNode
                    </button>
                    <button className="node_adders" onClick={this.onPdfClick}>
                        PdfNode
                    </button>
                    <button className="node_adders" onClick={this.onWebPageClick}>
                        WebPageNode
                    </button>
                    <button className="node_adders" onClick={this.onCanvasClick}>
                        CanvasNode
                    </button>
                    <button className="view_changers" onClick={this.onFreeFormClick} style={{top:5, right:5}}> 
                        FreeForm
                    </button>
                    <button className="view_changers" onClick={this.onGridFormClick} style={{top:5, right:80}}> 
                        GridForm
                    </button>
                </div>
            </div>
        );
    }
}