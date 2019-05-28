import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import './LinkContainer.scss'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";

interface LinkContainerProps {
    Nodes: NodeStore[]
    workspace: NodeCollectionStore
}


@observer
export default class LinkContainer extends React.Component<LinkContainerProps> {

   @observable private listItemArray: React.ReactNode[] = new Array();

   onLinkClick = (node: NodeStore) => {
    let p = this.props;
    let xOffset:number = 600 - node.X;
    let yOffset:number = 600 - node.Y
    let newX:number = p.workspace.X + xOffset;
    let newY:number = p.workspace.Y - yOffset;
    p.workspace.setX(0 + xOffset);
    p.workspace.setY(0 - yOffset);
   }

    render() {
        let p = this.props;
       
        return(
            <div className="link-container">
                <div className="link-list">
                    {this.props.Nodes.map(value => (<li className="link" onClick={() => this.onLinkClick(value)} key={value.Id}>{value.Id}</li>))}
                </div>
                
            </div>
        );
    }

}