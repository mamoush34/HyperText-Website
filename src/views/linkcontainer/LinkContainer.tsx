import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import './LinkContainer.scss'
import { observer } from "mobx-react";
import { observable, action } from "mobx";

interface LinkContainerProps {
    Nodes: Set<NodeStore>
}


@observer
export default class LinkContainer extends React.Component<LinkContainerProps> {

   @observable private listItemArray: React.ReactNode[] = new Array();
   @observable private nodeArray: Set<NodeStore> = this.props.Nodes;

    renderListItem = (store:NodeStore) => {
        this.listItemArray.push(<li key={store.Id}>{store.Id}</li>);
        console.log("ListSize: ", this.listItemArray.length);
    }

    @action 
    renderListEach = () => {
        this.nodeArray.forEach((value:NodeStore) => this.renderListItem(value));
    }

    render() {
        let p = this.props;
        console.log("Nodes size", p.Nodes.size);
        // p.Nodes.forEach((value:NodeStore) => this.nodeArray.push(value));
        // const listItems = this.nodeArray.map((d: NodeStore) => <li key={d.Id}>{d.Id}</li>);
        console.log("I got called");


        return(
            <div className="link-container">
                <button onClick={()=> console.log("Nodes size", this.listItemArray.length)}>Size</button>
                <div className="link-list">
                    {this.renderListEach()}
                    {this.listItemArray}
                </div>
                
            </div>
        );
    }

}