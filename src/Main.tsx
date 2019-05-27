import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./Main.scss";
import { NodeCollectionStore } from './stores/NodeCollectionStore';
import { RootStore } from './stores/RootStore';
import { StaticTextNodeStore } from './stores/StaticTextNodeStore';
import { VideoNodeStore } from './stores/VideoNodeStore';
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';
import DashBar from './views/dashbar/dashbar';
import { ImageNodeView } from './views/nodes/ImageNodeView';
import { ImageNodeStore } from './stores/ImageNodeStore';
import { PdfNodeStore } from './stores/PdfNodeStore';
import { WebSiteNodeStore } from './stores/WebSiteNodeStore';
import { GridFormCanvas } from './views/gridformcanvas/GridFormCanvas';
import { observable } from 'mobx';
import Dashboard from './Dashboard';
import { EditorState } from 'draft-js';
import { CollectionStore } from './stores/CollectionStore';


const mainNodeCollection = new NodeCollectionStore();
const storeNodes = new NodeCollectionStore();


ReactDOM.render((
    
    <div>
        <Dashboard collection = {mainNodeCollection} storeNodes = {storeNodes}/>
    </div>), document.getElementById('root'));

// create a bunch of text and video nodes (you probably want to delete this at some point)
let numNodes = 10;
let maxX = 10000;
let maxY = 10000;
let nodes = []
for (let i = 0; i < numNodes; i++) {
    nodes.push(new StaticTextNodeStore({ X: Math.random() * maxX, Y: Math.random() * maxY, Title: "Text Node Title", Text: EditorState.createEmpty() }));
}

for (let i = 0; i < 20; i++) {
    nodes.push(new VideoNodeStore({ X: Math.random() * maxX, Y: Math.random() * maxY, Title: "Video Node Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
}
nodes.push(new ImageNodeStore({ X: 500, Y: 500, Title:"Image Node", Url:""}));
nodes.push(new WebSiteNodeStore({ X: 100, Y: 500, Title:"Web Node", Url:"https://www.google.com/search?igu=1"}));

nodes.push(new PdfNodeStore({ X: 1200, Y: 500, Title:"Pdf Node"}));


let newCollection: CollectionStore = new CollectionStore({X:800, Y:500, Title:"Store Node"});
newCollection.Nodes.addNode(new StaticTextNodeStore({ X: Math.random() * maxX, Y: Math.random() * maxY, Title: "Text Node Title", Text: EditorState.createEmpty() }));
newCollection.Nodes.addNode(new StaticTextNodeStore({ X: Math.random() * maxX, Y: Math.random() * maxY, Title: "Text Node Title", Text: EditorState.createEmpty() }));
newCollection.Nodes.addNode(new StaticTextNodeStore({ X: Math.random() * maxX, Y: Math.random() * maxY, Title: "Text Node Title", Text: EditorState.createEmpty() }));

storeNodes.addNode(newCollection);


nodes.push(newCollection);


mainNodeCollection.AddNodes(nodes);