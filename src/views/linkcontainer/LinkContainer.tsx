import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import './LinkContainer.scss'
import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { Canvas_Type } from "../../Dashboard";
import * as Constants from '../../constants/Constants'


interface LinkContainerProps {
    Nodes: NodeStore[]
    workspace: NodeCollectionStore
    currentView: Canvas_Type;

}

/**
 * The class that models the container that is attached to nodes, which shows the links of a node.
 */
@observer
export default class LinkContainer extends React.Component<LinkContainerProps> {

    /**
     * This function is the function, which is called when a link inside a link container
     * gets clicked on.
     */
   onLinkClick = (node: NodeStore) => {
        let p = this.props;
        let xOffset:number;
        let yOffset:number;

        //If the nodes are not in the same collection, the one that
        //is clicked on is brought to the clicker's collection
        if(node.instanceCollection !== p.workspace) {
            node.instanceCollection.removeNode(node);
            p.workspace.addNode(node);
            node.instanceCollection = p.workspace;
        }    

        //If the Dashboard is in grid, nodes get followed in a way
        //that they end up being the left most node on screen.
        //Canvas zooms into the node as well.
        if(p.currentView === Canvas_Type.GRID_FORM) {
            let gridIndex = node.gridIndex + 1;
            let row = Math.ceil(gridIndex / Constants.GRID_COL_NUMBER) - 1;
            let col = (gridIndex % Constants.GRID_COL_NUMBER) - 1;
            xOffset =  -(col * Constants.GRID_LINK_X_FACTOR);
            yOffset = - (row * Constants.GRID_LINK_Y_FACTOR);
            p.workspace.setX(xOffset);
            p.workspace.setY(yOffset);
            p.workspace.Scale = 1;
            
        // It it's any other view they get followed depending on their coordinates and end up being on center.
        //Canvas zooms into the node as well.
        } else{
            xOffset = (window.screen.width / Constants.FREE_LINK_FACTOR) - node.X;
            yOffset = (window.screen.height / Constants.FREE_LINK_FACTOR) - node.Y
            p.workspace.setX(xOffset);
            p.workspace.setY(yOffset);
            p.workspace.Scale = 1;
        }

   }

    render() {
        let p = this.props;
        return(
            <div className="link-container">
                <div className="link-list">
                    {this.props.Nodes.map(value =>
                         (<li className="link" onClick={() => this.onLinkClick(value)} key={value.Id}>{value.Title}</li>))}
                </div>
                
            </div>
        );
    }

}