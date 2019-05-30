import React = require("react");
import { NodeStore } from "../../stores/NodeStore";
import './LinkContainer.scss'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { Canvas_Type } from "../../Dashboard";

interface LinkContainerProps {
    Nodes: NodeStore[]
    workspace: NodeCollectionStore
    currentView: Canvas_Type;

}


@observer
export default class LinkContainer extends React.Component<LinkContainerProps> {

   @observable private listItemArray: React.ReactNode[] = new Array();

   onLinkClick = (node: NodeStore) => {
    let p = this.props;
    let xOffset:number;
    let yOffset:number;

    if(p.currentView === Canvas_Type.GRID_FORM) {
        let gridIndex = node.gridIndex + 1;
        let row = Math.ceil(gridIndex / 5) - 1;
        let col = (gridIndex % 5) - 1;
        xOffset =  -(col * 550);
        yOffset = - (row * 500);
        p.workspace.setX(xOffset);
        p.workspace.setY(yOffset);
        p.workspace.Scale = 1;
        
    } else{
        xOffset = 600 - node.X;
        yOffset = 300 - node.Y
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
                    {this.props.Nodes.map(value => (<li className="link" onClick={() => this.onLinkClick(value)} key={value.Id}>{value.Title}</li>))}
                </div>
                
            </div>
        );
    }

}