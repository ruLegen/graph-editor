import React,{Component,Fragment} from 'react';

import { Graph,Link } from "react-d3-graph";
import { save } from "save-file";
import Button from '@material-ui/core/Button';
import {Grid,Paper} from '@material-ui/core'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import KeyboardEventHandler from 'react-keyboard-event-handler';

import {makeid,NodeItem,LinkItem} from './js/utils'
import EditMenu from './components/EditMenu'

// graph payload (with minimalist structure)

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop:true,
    directed:true,
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
        strokeWidth:4,
        type:"CURVE_SMOOTH"
    },
};



const onMouseOverNode = function(nodeId) {
    console.log(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function(nodeId) {
    console.log(`Mouse out node ${nodeId}`);
};



const onRightClickLink = function(event, source, target) {
    console.log(`Right clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function(source, target) {
    console.log(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function(source, target) {
    console.log(`Mouse out link between ${source} and ${target}`);
};


class App extends Component {
  constructor(props) {
    super(props);
    this.graph=React.createRef();
    this.state = {
      isOpen:false,
      selectedNode:0,
      mousePositionClick:{top:0,left:0},
      data:{
      nodes: [new NodeItem("test")],
      links: [] },
      isShiftPressed:false,  
    }
    //close context menu
    this.handleClose =()=>{
        this.setState({isOpen:false})
    }
    //set up last click coords 
    this.onClickGraph = (event)=> {
      event.persist();
      event.preventDefault();
      console.log(event)
      if(event.type== "contextmenu")
      {
        let x = event.clientX;
        let y = event.clientY;
        this.setState({isOpen:true,mousePositionClick:{top:y,left:x}})
      }
    };
    //delete or add new node
    this.onNodeClick=(id)=>{

      //if shift pressed delete node
      if(this.state.isShiftPressed)
      {
          //nodes array must be contain atleast 1 item *library requirement*
          if(this.state.data.nodes.length == 1)
            return
          let selectedNodeindex = this.state.data.nodes.findIndex((node,index)=>{
          if(node['id'] == id)
            return true
          })
          let selectedNode = this.state.data.nodes[selectedNodeindex]
          //select previuos node 
          let previuosNodeIndex = this.state.selectedNode 
          if(this.state.selectedNode == selectedNodeindex)  //if we delete selected node => make new selected node
              previuosNodeIndex = (selectedNodeindex-1) % this.state.data.nodes.length-1;

            let newNodeArray = this.state.data.nodes.filter((node, index) => index !== selectedNodeindex);
          let newLinkArray = this.state.data.links.filter((link, index) => {
            return (link.source !== selectedNode.id && link.target !== selectedNode.id)
          })

          console.log(newLinkArray,selectedNode.id)
          let newState = {data:{nodes:newNodeArray,links:newLinkArray}} 
          this.setState({...this.state,...newState,selectedNode:previuosNodeIndex})
      }
      //else select node  
      else
      {
          let index = this.state.data.nodes.findIndex((node,index)=>{
          if(node['id'] == id)
            return true
          })
          this.setState({selectedNode:index})
      }
    }
    //when adding new node on graph
    this.onNodeAdd=()=>{
      let newNode = new NodeItem(makeid(6))
      newNode.x=this.state.mousePositionClick.left
      newNode.y=this.state.mousePositionClick.top
      let newState = {data:{nodes:[...this.state.data.nodes, newNode],links:[...this.state.data.links]}} 
      console.log({...this.state,...newState})
      this.setState({...this.state,...newState},()=>{
        this.handleClose()
      })
    }
    //updating positions
    this.onNodePositionChange=(nodeID,newX,newY)=>{
      let index = this.state.data.nodes.findIndex((node,index)=>{
        if(node['id'] == nodeID)
          return true
        })
      let newNode = {...this.state.data.nodes[index]}
      newNode.x = newX;
      newNode.y = newY;
        
      let newNodes = [...this.state.data.nodes.slice(0, index),newNode,...this.state.data.nodes.slice(index + 1)]
      let newState = {data:{nodes:[...newNodes],links:[...this.state.data.links]}} 
      this.setState({...this.state,...newState})
    }
    //delete link
    this.onClickLink = (source, target)=>{
      let linkIndex = this.state.data.links.findIndex((link,index)=>{
        if(link.source == source && link.target == target)
          return true
        })

      let newLinkArray = this.state.data.links.filter((item, index) => index !== linkIndex);
      let newState = {data:{nodes:[...this.state.data.nodes],links:newLinkArray}} 
      console.log(this)
      this.setState({...this.state,...newState})
    }
    //add new link
    this.onRightClickNode = function(event, nodeId) {
      event.preventDefault()
        let currentNode = this.state.data.nodes[this.state.selectedNode];
        let currentNodeId = this.state.data.nodes[this.state.selectedNode].id;
        let targetNode = getNodeById(nodeId,this.state.data.nodes);
        
        let existingLinkIndex = this.state.data.links.findIndex((link,index)=>{
          if(link.source == currentNodeId && link.target == nodeId && (currentNodeId != nodeId))
          return true
        })
        if(existingLinkIndex >= 0)
          return  //this link already exist

          //just calc vector magnitude
        let weightLink =  Math.sqrt(Math.pow(targetNode.x - currentNode.x,2)+ Math.pow(targetNode.y - currentNode.y,2))
        let link  = new LinkItem(currentNodeId,nodeId,weightLink)
        //#uncomment 2 lines after to add 2 links at 1 time
        //#but ont forget change existingLinkIndex cause it does not check this scenario
        //let link  = [new LinkItem(currentNodeId,nodeId,weightLink),new LinkItem(nodeId,currentNodeId,weightLink)]
        //let newState = {data:{nodes:[...this.state.data.nodes],links:[...this.state.data.links,...link]}} 
        
        let newState = {data:{nodes:[...this.state.data.nodes],links:[...this.state.data.links,link]}} 
        this.setState({...this.state,...newState})
    }
    //track
    this.handleKeys=(keys,e)=>{
      switch (keys) {
        case "shift":
          if(e.type == "keyup")
            this.setState({isShiftPressed:false})
          else
            this.setState({isShiftPressed:true})
          break;
        default:
          break;
      }
    }
    //in EditMenu changed NodeInfo
    this.onNodeInfoChanged=(nodeID,nodeField,value)=>{
      let index = this.state.data.nodes.findIndex((node,index)=>{
        if(node['id'] == nodeID)
          return true
        })
      let newNode = {...this.state.data.nodes[index]}
      if(nodeField =="x" || nodeField =="y")
        value = parseInt(value)

      // ',' is delimetr "event,eve,event3" => ["event","eve","event3"]
      if(nodeField == "events")
        value = value.split(',');
      
      newNode[nodeField] = value;
        
      let newNodes = [...this.state.data.nodes.slice(0, index),newNode,...this.state.data.nodes.slice(index + 1)]
      let newState = {data:{nodes:[...newNodes],links:[...this.state.data.links]}} 
      console.log(newState)
      this.setState({...this.state,...newState})

    }
    this.handleOpenPlan = (event)=>{
      let file = event.target.files[0]
      let fileReader = new FileReader();
      fileReader.onloadend = (e)=>{
          let readedString = fileReader.result
          try {
            let objectFromJson = JSON.parse(readedString)
            //let newState = {data:{...objectFromJson}} 
            this.setState(objectFromJson)
          } catch (error) {console.log(error)}
      }
      fileReader.readAsText(file)
    }
  }
  render() { 
  return (
    <Fragment>

    <Menu
      id="simple-menu"
      keepMounted
      open={this.state.isOpen}
      anchorReference="anchorPosition"
      anchorPosition={{top:this.state.mousePositionClick.top,left:this.state.mousePositionClick.left}}
      onClose={this.handleClose}>
      <MenuItem onClick={this.onNodeAdd}>Add Node</MenuItem>
    </Menu>

<Grid
  container
  direction="row"
  justify="center"
  alignItems="center"
>
      <Grid item xs={9}>
          <Graph
            ref={this.graph}
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={this.state.data}
            config={myConfig}
            //this binded to Node class
            onRightClickNode={(event,nodeId)=>{event.persist();this.onRightClickNode(event,nodeId)}}
            onDoubleClickNode={this.onNodeClick}
            onClickGraph={this.onClickGraph}
            onClickLink={this.onClickLink}
            onRightClickLink={onRightClickLink}
            onMouseOverNode={onMouseOverNode}
            onMouseOutNode={onMouseOutNode}
            onMouseOverLink={onMouseOverLink}
            onMouseOutLink={onMouseOutLink}
            onNodePositionChange={this.onNodePositionChange}
        />
      </Grid>
      <Grid item xs={3} >
          <EditMenu onChange={this.onNodeInfoChanged} node={this.state.data.nodes[this.state.selectedNode]}/>
          <Grid container xs={7} direction="column" >
            <input accept="application/json"
              style={{display:"none"}}
              id="contained-button-file"
              type="file"
              onChange={this.handleOpenPlan}
            />
          <label htmlFor="contained-button-file">
            <Button style={{marginTop:"3%",width:"100%"}} variant="contained" color="primary" component="span">
              Open plan
            </Button>
            </label>
          <Button style={{marginTop:"3%"}} variant="contained" color="primary" onClick={()=>{
              save(JSON.stringify(this.state), 'plan.'+Date.now().toString()+".json")
            }}>Save plan</Button>
            <Button style={{marginTop:"3%"}} variant="contained" color="primary"
              onClick={()=>{
                let allLinks=this.graph.current.state.links;
                let nodes = Object.keys(allLinks);
                let nodeArray = [];

                for(let node in allLinks)
                {
                  let edgeObject =allLinks[node]
                  let edgeArray=[]
                  for(let link in edgeObject)
                  {
                    let linkWeight = calcLinkWeight(node,link,this.state.data.nodes)
                    
                    edgeArray.push({nodeName:link,weight:linkWeight})  
                  }
                  nodeArray.push({
                    node: getNodeById(node,this.state.data.nodes),
                    edges:edgeArray
                  })
                }
                save(JSON.stringify(nodeArray), 'graph.'+Date.now().toString()+".json")
                console.log(nodeArray)
              }}
            >Export plan</Button>
          </Grid>
      </Grid>

    </Grid>
      <KeyboardEventHandler handleEventType="keydown" handleKeys={['all']} onKeyEvent={this.handleKeys} />
      <KeyboardEventHandler handleEventType="keyup" handleKeys={['all']} onKeyEvent={this.handleKeys} />
    </Fragment>
    );
  }
}

function getNodeById(id,array)
{
  let targetNodeIndex = array.findIndex((node,index)=>{
    if(node['id'] == id)
      return true
    })
  return array[targetNodeIndex];
}
function calcLinkWeight(source,target,array)
{
  let sourceNode = getNodeById(source,array);
  let targetNode = getNodeById(target,array);
  let weightLink = Math.sqrt(Math.pow(targetNode.x - sourceNode.x,2)+ Math.pow(targetNode.y - sourceNode.y,2))
  return  parseInt(weightLink)
}
export default App;
