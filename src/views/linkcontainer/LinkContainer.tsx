import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import './LinkContainer.scss'

interface LinkContainerProps {
    store: NodeStore
    Nodes: NodeStore[]
}


export default class LinkContainer extends React.Component<LinkContainerProps> {

    render() {
        let p = this.props;
        return(
            <div className="link-container">
                <div className="link-list">
                    {p.Nodes.map((item,index) => <li key={index}>{item.Id}</li>)}
                </div>
                
            </div>
        );
    }

}