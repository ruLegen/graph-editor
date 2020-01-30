import React,{Component,Fragment} from 'react';
import "./App.css"
import { Graph, } from "react-d3-graph";
import { save } from "save-file";
import {select} from "d3-selection"
import Button from '@material-ui/core/Button';
import {Grid,AppBar, Toolbar, Typography, Fab,} from '@material-ui/core'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {makeid,NodeItem,LinkItem,getCanvasOffset,FloorItem, Plan} from './js/utils'

import EditMenu from './components/EditMenu'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import PlanDialog from './components/PlanDialog';

// graph payload (with minimalist structure)

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop:true,
    directed:true,
    height:"600",
    width:"1000",
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
        strokeWidth:4,
       // type:"CURVE_SMOOTH"
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

let svg;

class App extends Component {
  constructor(props) {
    super(props);
    this.graph=React.createRef();
    this.offset={x:0,y:0}             //Plan Offset
    this.transform={x:0,y:0,k:0}      //Graph offset
    this.state = {
      isOpen:false,
      selectedNode:0,
      mousePositionClick:{top:0,left:0},
      menuPosition:{top:0,left:0},
      currentFloor:0,
      data:[new FloorItem([new NodeItem("test")],[])],
      plans:[new Plan("")],
      isCtrlPressed:false,
      isShiftPressed:false,
      isFloorSwitched:false,

    }
    //close context menu
    this.handleClose =()=>{
        this.setState({isOpen:false})
    }
    //set up last click coords 
    this.onClickGraph = (event)=> {
      event.persist();
      event.preventDefault();

      var rect = event.target.getBoundingClientRect();
      console.log(event)
      if(event.type== "contextmenu")
      {
        let x = event.clientX - rect.x;
        let y = event.clientY - rect.y;
        this.setState({isOpen:true,mousePositionClick:{top:y,left:x},menuPosition:{top:event.clientY,left:event.clientX}},()=>{
         // this.onZoomed()
        })
      }
    };
    //delete or add new node
    this.onNodeClick=(id)=>{

      //if shift pressed delete node
      if(this.state.isShiftPressed)
      {
          //nodes array must be contain atleast 1 item *library requirement*
          if(this.state.data[this.state.currentFloor].nodes.length == 1)
            return
          let selectedNodeindex = this.state.data[this.state.currentFloor].nodes.findIndex((node,index)=>{
          if(node['id'] == id)
            return true
          })
          let selectedNode = this.state.data[this.state.currentFloor].nodes[selectedNodeindex]
          //select previuos node 
          let previuosNodeIndex = this.state.selectedNode 
          if(this.state.selectedNode == selectedNodeindex)  //if we delete selected node => make new selected node
              previuosNodeIndex = (selectedNodeindex-1) % this.state.data[this.state.currentFloor].nodes.length-1;

          let newState={data:[]}
          //Go through all floors and delete this node and all links assosiated with it
          for(let i=0; i < this.state.data.length;i++)
          {
            let newNodeArray = this.state.data[i].nodes.filter((node, index) => index !== selectedNodeindex);
            let newLinkArray = this.state.data[i].links.filter((link, index) => {
              return (link.source !== selectedNode.id && link.target !== selectedNode.id)
            })
            //if(newNodeArray.length > 0)
            newState.data.push(new FloorItem(newNodeArray,newLinkArray))
          }
         
          // console.log(newLinkArray,selectedNode.id)
          // let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
          //   new FloorItem(newNodeArray,newLinkArray),
          //   ...this.state.data.slice(this.state.currentFloor+1),]} 
          console.log(newState)
          this.setState({...newState,selectedNode:previuosNodeIndex})
      }
      //else select node  
      else
      {
          let index = this.state.data[this.state.currentFloor].nodes.findIndex((node,index)=>{
          if(node['id'] == id)
            return true
          })
          this.setState({selectedNode:index})
      }
    }
    //when adding new node on graph
    this.onNodeAdd=()=>{
      let newNode = new NodeItem(makeid(6))
      let offset = getCanvasOffset("#graph-id-graph-container-zoomable")
      
      newNode.x=(this.state.mousePositionClick.left-offset.x)/offset.k
      newNode.y=(this.state.mousePositionClick.top-offset.y)/offset.k

      // let newState = {data:{nodes:[...this.state.data.nodes, newNode],links:[...this.state.data.links]}} 
      let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
        new FloorItem([...this.state.data[this.state.currentFloor].nodes,newNode],this.state.data[this.state.currentFloor].links),
        ...this.state.data.slice(this.state.currentFloor+1),]} 

      
      console.log({...this.state,...newState})
      this.setState({...this.state,...newState},()=>{
        this.handleClose()
      })
    }
    //updating positions
    this.onNodePositionChange=(nodeID,newX,newY)=>{
      let index = this.state.data[this.state.currentFloor].nodes.findIndex((node,index)=>{
        if(node['id'] == nodeID)
          return true
        })
      let newNode = {...this.state.data[this.state.currentFloor].nodes[index]}
      newNode.x = newX;
      newNode.y = newY;
        
      let newNodes = [...this.state.data[this.state.currentFloor].nodes.slice(0, index),newNode,...this.state.data[this.state.currentFloor].nodes.slice(index + 1)]
      let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
                      new FloorItem(newNodes,this.state.data[this.state.currentFloor].links),
                      ...this.state.data.slice(this.state.currentFloor+1),]} 
      
      this.setState({...this.state,...newState})
    }
    //delete link
    this.onClickLink = (source, target)=>{
      let linkIndex = this.state.data[this.state.currentFloor].links.findIndex((link,index)=>{
        if(link.source == source && link.target == target)
          return true
        })

      let newLinkArray = this.state.data[this.state.currentFloor].links.filter((item, index) => index !== linkIndex);
      // let newState = {data:{nodes:[...this.state.data.nodes],links:newLinkArray}} 
     
      let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
        new FloorItem([...this.state.data[this.state.currentFloor].nodes],newLinkArray),
        ...this.state.data.slice(this.state.currentFloor+1),]} 


      console.log(this)
      this.setState({...this.state,...newState})
    }
    //add new link
    this.onRightClickNode = function(event, nodeId) {
      event.preventDefault()
        let currentNode = this.state.data[this.state.currentFloor].nodes[this.state.selectedNode];
        let currentNodeId = this.state.data[this.state.currentFloor].nodes[this.state.selectedNode].id;
        let targetNode = getNodeById(nodeId,this.state.data[this.state.currentFloor].nodes);
        
        // let existingLinkIndex = this.state.data[this.state.currentFloor].links.findIndex((link,index)=>{
        //   if(link.source == currentNodeId && link.target == nodeId && (currentNodeId != nodeId))
        //   return true
        // })
        // if(existingLinkIndex >= 0)
        //   return  //this link already exist

          //just calc vector magnitude
        let weightLink =  Math.sqrt(Math.pow(targetNode.x - currentNode.x,2)+ Math.pow(targetNode.y - currentNode.y,2))

        //check here for link existense
        let link  = []
        // new LinkItem(currentNodeId,nodeId,weightLink),new LinkItem(nodeId,currentNodeId,weightLink)
        if(!isLinkExist(currentNodeId,nodeId,this.state.data[this.state.currentFloor].links))
            link.push(new LinkItem(currentNodeId,nodeId,weightLink))
        if(!isLinkExist(nodeId,currentNodeId,this.state.data[this.state.currentFloor].links))
            link.push(new LinkItem(nodeId,currentNodeId,weightLink))
        console.log(link)
        let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
          new FloorItem([...this.state.data[this.state.currentFloor].nodes],[...this.state.data[this.state.currentFloor].links,...link]),
          ...this.state.data.slice(this.state.currentFloor+1),]} 
    
        this.setState({...this.state,...newState})
    }
    //track key events
    this.handleKeys=(keys,e)=>{
      console.log(keys)
      switch (keys) {
        case "shift":
          if(e.type == "keyup")
            this.setState({isShiftPressed:false})
          else
            this.setState({isShiftPressed:true})
          break;
        case "ctrl":
          if(e.type == "keyup")
          {
            let plan = this.state.plans[this.state.currentFloor]
            this.setState({})
            this.setState({isCtrlPressed:false,plans:[
              ...this.state.plans.slice(0, this.state.currentFloor),
                 new Plan(plan.url,this.offset),
              ...this.state.plans.slice(this.state.currentFloor + 1)
              ]})     //TODO save here plan offset
          }
          else
            if(!this.state.isCtrlPressed)
              this.setState({isCtrlPressed:true})
          break;
        case "up": 
                if(e.type == "keyup")
                  this.onFloorUp();break;
        case "down": 
                if(e.type == "keyup")
                  this.onFloorDown();break;
        default:
          break;
      }
    }
    //in EditMenu changed NodeInfo
    this.onNodeInfoChanged=(nodeID,nodeField,value)=>{
      let index = this.state.data[this.state.currentFloor].nodes.findIndex((node,index)=>{
        if(node['id'] == nodeID)
          return true
        })
      let newNode = {...this.state.data[this.state.currentFloor].nodes[index]}
      if(nodeField =="x" || nodeField =="y")
        value = parseInt(value)

      // ',' is delimetr "event,eve,event3" => ["event","eve","event3"]
      if(nodeField == "events")
        value = value.split(',');
      

      // go through all floors and change all links and nodes with specific id
      if(nodeField == "id")
      {
      
        let newData = []
        for(let floor of this.state.data)
        {
          let newNodeArray = floor.nodes.map((node,index)=>{
            if(node.id == nodeID)
              node.id = value
              return node
          })
          let newLinkArray = floor.links.map((link,index)=>{
            if(link.source == nodeID) link.source = value
            if(link.target == nodeID) link.target = value
            return link
          })
          console.log(floor)
          newData.push(new FloorItem(newNodeArray,newLinkArray))
        }
        this.setState({...newData})
        return
      }
      newNode[nodeField] = value;
      //if you see this constructions, dont confuse. 
      //It's Immutable pattern from 
      //https://blog.cloudboost.io/react-redux-immutable-update-cheat-sheet-296bfdd1f19
      let newNodes = [...this.state.data[this.state.currentFloor].nodes.slice(0, index),newNode,...this.state.data[this.state.currentFloor].nodes.slice(index + 1)]
      // let newState = {data:{nodes:[...newNodes],links:[...this.state.data.links]}} 
      let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
        new FloorItem(newNodes,this.state.data[this.state.currentFloor].links),
        ...this.state.data.slice(this.state.currentFloor+1),]} 
  
      console.log(newState)
      this.setState({...this.state,...newState})

    }
    this.onLinkInfoChanged=(link,event,value)=>{
        let newLink = link
        newLink.events = value.split(',')
        let index = this.state.data[this.state.currentFloor].links.findIndex((element)=>{
            return (element.source == link.source && element.target == link.target)
        })
        if(index == -1)
        {
          console.log("Link doesnt find /// >>??????")
          return
        }


        let newState = {data:[...this.state.data.slice(0,this.state.currentFloor),
          new FloorItem(this.state.data[this.state.currentFloor].nodes,[
            ...this.state.data[this.state.currentFloor].links.slice(0, index),
            newLink,
            ...this.state.data[this.state.currentFloor].links.slice(index + 1)
          ]),
          ...this.state.data.slice(this.state.currentFloor+1),]} 

        this.setState(newState)
    }
    this.handleOpenPlan = (event)=>{
      let file = event.target.files[0]
      let fileReader = new FileReader();
      fileReader.onloadend = (e)=>{
          let readedString = fileReader.result
          try {
            let objectFromJson = JSON.parse(readedString)
            //let newState = {data:{...objectFromJson}} 
            this.setState(objectFromJson.state,()=>{
              this.transform = objectFromJson.transform
              this.offset = this.state.plans[this.state.currentFloor].offset
              this.moveBackground(this.transform)})
            }
          catch (error) {console.log(error)}
      }
      fileReader.readAsText(file)
    }

    this.onFloorNew = ()=>{
      let connectionNode = this.state.data[this.state.currentFloor].nodes[this.state.selectedNode]
      //if floor exist then just add to existed
      if(this.state.data[this.state.currentFloor+1] != undefined)
      {
        let floor = {...this.state.data[this.state.currentFloor+1]}

        //if selected node exist just go to next floor without adding it
        if(getNodeById(connectionNode.id,floor.nodes))
        {
          this.setState({currentFloor:this.state.currentFloor+1,selectedNode:0})
          return
        }
        floor.nodes.push(connectionNode)
        let newFloorIndex = this.state.currentFloor+1
        let newState = {data:[...this.state.data.slice(0,newFloorIndex),floor,...this.state.data.slice(0,newFloorIndex+1)],
          currentFloor:this.state.currentFloor+1,selectedNode:0}
        this.setState(newState,()=>{  
          this.offset = this.state.plans[this.state.currentFloor].offset
          this.moveBackground(this.transform)})

      }
      else
      {
        let newFloor = new FloorItem([{...connectionNode}],[])
        let newState = {data:[...this.state.data,newFloor],plans:[...this.state.plans,new Plan("")],currentFloor:this.state.currentFloor+1,selectedNode:0}
        this.setState(newState,()=>{
          this.offset = this.state.plans[this.state.currentFloor].offset
          this.moveBackground(this.transform)
        })
      }
    }
    this.onFloorDelete = ()=>{
      if(this.state.data.length <=1)
        return
      let newFloorIndex = this.state.currentFloor-1;
      if(newFloorIndex < 0) newFloorIndex = 0;
      let newFloors = this.state.data.filter((item, index) => index !== this.state.currentFloor);
      let newPlans = this.state.plans.filter((item, index) => index !== this.state.currentFloor);
      let newState = {data: newFloors,plans:newPlans,currentFloor:newFloorIndex}
      this.setState(newState,()=>{
        this.offset = this.state.plans[this.state.currentFloor].offset
        this.moveBackground(this.transform)
      })
    }
    this.onFloorUp = ()=>{
      if(this.state.data.length <= 1)
        return
      let newFloor = (this.state.currentFloor+1)%this.state.data.length
      this.setState({currentFloor:newFloor,selectedNode:0},()=>{
        this.offset = this.state.plans[this.state.currentFloor].offset
        this.moveBackground(this.transform)
      })
    }
    this.onFloorDown = ()=>{
      if(this.state.data.length <= 1)
        return
      let newFloor = this.state.currentFloor-1
      if(newFloor < 0)
        newFloor = this.state.data.length-1
      this.setState({currentFloor:newFloor,selectedNode:0},()=>{
          this.offset = this.state.plans[this.state.currentFloor].offset
          this.moveBackground(this.transform)
        })
    }
    this.onZoomed =(transform)=>{
      this.transform = transform;
      this.moveBackground(transform)
    }
    this.moveBackground = (transform)=>{
      svg.style("background-position",`${transform.x+ this.offset.x*transform.k}px ${transform.y+ this.offset.y*transform.k}px`)
      svg.style("background-size",`${transform.k*100}%`)

    }
    this.onPlanChanged=(url)=>{
      let plan = this.state.plans[this.state.currentFloor]
      this.setState({plans:[
        ...this.state.plans.slice(0, this.state.currentFloor),
        new Plan(url,plan.offset),
        ...this.state.plans.slice(this.state.currentFloor + 1)
        ]
      },()=>{     //callback
          this.offset = this.state.plans[this.state.currentFloor].offset
          this.moveBackground(this.transform)
        })
    }
  }
  componentDidUpdate(){
    //this.offset = this.state.plans[this.state.currentFloor].offset
    console.log(this.offset,"updated")
  }
  componentDidMount()
  {
    svg = select('svg[name="svg-container-graph-id"]')

    window.onmousedown =(event)=>{console.log(event)}
    window.onmousemove =(event)=>{
        if(this.state.isCtrlPressed)
        {
          let newOffset = {
            x: this.offset.x + event.movementX,
            y: this.offset.y + event.movementY,
          }
          this.offset = newOffset
          this.moveBackground(this.transform)
          //this.setState({offset:newOffset})
        }
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
      anchorPosition={{top:this.state.menuPosition.top,left:this.state.menuPosition.left}}
      onClose={this.handleClose}>
      <MenuItem onClick={this.onNodeAdd}>Add Node</MenuItem>
    </Menu>
    <AppBar position="static">
      <Toolbar>
            <Button onClick={this.onFloorNew} color="inherit">New</Button>
            <Button onClick={this.onFloorDelete} color="inherit">Delete</Button>
            <Button onClick={this.onFloorUp} color="inherit"> <ArrowUpwardIcon />Up</Button>
            <Button onClick={this.onFloorDown} color="inherit"> <ArrowDownwardIcon/>Down</Button>
            <PlanDialog onApply={this.onPlanChanged}/>

          <Grid container direction="row" justify="flex-end" alignItems="center">
            <Typography variant="h6">
              Floor {this.state.currentFloor}
            </Typography>
          </Grid>
      </Toolbar>
    </AppBar>
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid container item xs={9}>
        <Grid item>
          {<Graph
            ref={this.graph}
            style={{left:'100px'}}
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={this.state.data[this.state.currentFloor]}
            config={myConfig}
            bgImage={`url('${this.state.plans[this.state.currentFloor].url}')`}
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
            onZoomed={this.onZoomed}
            onNodePositionChange={this.onNodePositionChange}
        />}
        </Grid>
      </Grid>
      <Grid item xs={3} >
          <EditMenu onChange={this.onNodeInfoChanged}
                    onLinkChange={this.onLinkInfoChanged}
                    node={this.state.data[this.state.currentFloor].nodes[this.state.selectedNode]}
                    links={this.state.data[this.state.currentFloor].links.filter((link)=>{
                        return link.source == this.state.data[this.state.currentFloor].nodes[this.state.selectedNode].id
                    })}
          />
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
              let saveData = {
                transform:this.transform,
                state:this.state
              }
              save(JSON.stringify(saveData), 'plan.'+Date.now().toString()+".json")
            }}>Save plan</Button>
            <Button style={{marginTop:"3%"}} variant="contained" color="primary"
              onClick={()=>{
                let data = this.state.data.flat()
                let allNodes =[]
                let allLinks =[]

                //it needs for delete duplicates
                let tmpNodeIdArray = new Set()
                //separate all nodes and links to different arrays 
                data.forEach((element)=>{
                    element.nodes.forEach((node)=>{
                      //if set doesn't contain this node then add
                      if(!tmpNodeIdArray.has(node.id))
                        allNodes.push(node)
                      tmpNodeIdArray.add(node.id)
                    })
                    element.links.forEach((link)=>{allLinks.push(link)})
                })
                let resultArray = []
                allNodes.forEach((node)=>{
                  //get all links where node is source
                  let nodeLinks = allLinks.filter((link)=>{
                    return link.source == node.id
                  })
                  let edges = []
                  nodeLinks.forEach((link)=>{
                    edges.push({nodeName:link.target,
                                weight:link.weight,
                                events:link.events})
                  })
                  resultArray.push({node:node,edges:edges})
                })
                save(JSON.stringify(resultArray), 'graph.'+Date.now().toString()+".json")
                console.log(resultArray)
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
  if(targetNodeIndex < 0)
    return false
  else
    return array[targetNodeIndex];
}

function isLinkExist(source,target,linkArray)
{
  //link to yourself is always exist
  if(source == target)
    return true
  let existedLinks = linkArray.filter((link)=>{
    if(link.source == source && link.target == target)
      return true;
  })
  if(existedLinks.length == 0)
    return false
  else
    return true
  // return array[targetNodeIndex];
}
function calcLinkWeight(source,target,array)
{
  let sourceNode = getNodeById(source,array);
  let targetNode = getNodeById(target,array);
  let weightLink = Math.sqrt(Math.pow(targetNode.x - sourceNode.x,2)+ Math.pow(targetNode.y - sourceNode.y,2))
  return  parseInt(weightLink)
}
export default App;
