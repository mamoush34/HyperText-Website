import { NodeCollectionStore } from "./stores/NodeCollectionStore";
import React = require("react");
import { GridFormCanvas } from "./views/gridformcanvas/GridFormCanvas";
import DashBar from "./views/dashbar/dashbar";
import { FreeFormCanvas } from "./views/freeformcanvas/FreeFormCanvas";
import { observable } from "mobx";
import { observer } from "mobx-react";

interface DashboardProps {
    collection: NodeCollectionStore
}

export enum Canvas_Type {
    FREE_FORM = 0,
    GRID_FORM = 1,
}

@observer
export default class Dashboard extends React.Component<DashboardProps>{
    @observable chosenView: Canvas_Type = Canvas_Type.FREE_FORM;


    renderCanvas = () => {
        let p = this.props;
        switch(this.chosenView) {
            case Canvas_Type.FREE_FORM:
                return <FreeFormCanvas store={p.collection}/>;
            case Canvas_Type.GRID_FORM:
                return <GridFormCanvas store={p.collection}/>;
          

        }

    }

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
                <DashBar mainCollection={p.collection} view={this.changeView}/>
                {/* <GridFormCanvas store={p.collection}/> */}
                {/* <FreeFormCanvas store={p.collection} /> */}
                {this.renderCanvas()}

            </div>
        );
    }

}