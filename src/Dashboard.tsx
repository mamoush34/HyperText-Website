import { NodeCollectionStore } from "./stores/NodeCollectionStore";
import React = require("react");
import { GridFormCanvas } from "./views/gridformcanvas/GridFormCanvas";
import DashBar from "./views/dashbar/dashbar";
import { FreeFormCanvas } from "./views/freeformcanvas/FreeFormCanvas";
import { observable } from "mobx";
import { observer } from "mobx-react";

interface DashboardProps {
    collection: NodeCollectionStore
    storeNodes: NodeCollectionStore
}

//Exported enum to symbolize the canvas type.
export enum Canvas_Type {
    FREE_FORM = 0,
    GRID_FORM = 1,
}

/**
 * This class is a wrapper class that alternates the views. 
 */
@observer
export default class Dashboard extends React.Component<DashboardProps>{
    @observable chosenView: Canvas_Type = Canvas_Type.FREE_FORM;

    /**
     * This function is responsible for rendering of the chosen view.
     */
    renderCanvas = () => {
        let p = this.props;
        switch(this.chosenView) {
            case Canvas_Type.FREE_FORM:
                return <FreeFormCanvas store={p.collection} storeNodes={p.storeNodes}/>;
            case Canvas_Type.GRID_FORM:
                return <GridFormCanvas store={p.collection} storeNodes={p.storeNodes}/>;
        }
    }

    /**
     * This function is responsible for changing the chosen view.
     */
    changeView = (view:Canvas_Type) => {
        if(this.chosenView !== view) {
            this.chosenView = view;
        }
    }

    render() {
        let p = this.props;
        return (
            <div>
                <h1 style={{top:0}}>Dash Web</h1>
                <DashBar mainCollection={p.collection} view={this.changeView} storeNodes={p.storeNodes}/>
                {this.renderCanvas()}
            </div>
        );
    }

}