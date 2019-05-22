import React = require("react");
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { NodeStore } from "../../stores/NodeStore";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import './dashbar.scss'

interface DashBarProps {
    mainCollection: NodeCollectionStore

}

@observer
export default class DashBar extends React.Component<DashBarProps> {

    private maxX:number = 2000;
    private maxY:number = 2000;

    onVideoClick = () => {
        let nodes:NodeStore[];
        nodes.push(new VideoNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Video Node Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
        this.props.mainCollection.AddNodes(nodes);

    }

    onTextClick = () => {
        let nodes:NodeStore[];
        nodes.push(new StaticTextNodeStore({ X: Math.random() * this.maxX, Y: Math.random() * this.maxY, Title: "Text Node Title", Text: "Small Text"}));
        this.props.mainCollection.AddNodes(nodes);
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
                </div>
            </div>
        );
    }
}