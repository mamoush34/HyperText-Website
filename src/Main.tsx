import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./Main.scss";
import { NodeCollectionStore } from './stores/NodeCollectionStore';
import Dashboard from './Dashboard';


const mainNodeCollection = new NodeCollectionStore();
const storeNodes = new NodeCollectionStore();


ReactDOM.render((
    
    <div>
        <Dashboard collection = {mainNodeCollection} storeNodes = {storeNodes}/>
    </div>), document.getElementById('root'));
