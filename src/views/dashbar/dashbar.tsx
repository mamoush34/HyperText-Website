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

interface DashBarProps {
    mainCollection: NodeCollectionStore
}

@observer
export default class DashBar extends React.Component<DashBarProps> {

    private maxX:number = 200;
    private maxY:number = 200;

    onVideoClick = () => {
        this.props.mainCollection.addNode(new VideoNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Video Node Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
     

    }

    onTextClick = () => {
        this.props.mainCollection.addNode(new StaticTextNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Text Node Title", Text: "Small Text"}));
        
    }   

    onImageClick = () => {
        this.props.mainCollection.addNode(new ImageNodeStore({ X: 500, Y: 500, Title:"Image Node", Url:"news.jpg"}));
    }

    onPdfClick = () => {
        this.props.mainCollection.addNode(new PdfNodeStore({ X: 1200, Y: 500, Title:"Pdf Node", Url:""}));
    }

    onWebPageClick = () => {
        this.props.mainCollection.addNode(new WebSiteNodeStore({ X: 100, Y: 500, Title:"Web Node", Url:"https://www.google.com/search?igu=1"}));
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
                </div>
            </div>
        );
    }
}