import React,{Component} from "react";
import {TextField,Input, Typography} from "@material-ui/core";
class EditMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    // ??
    // 
    

    render() { 
        const {node,onChange,...other} = this.props
        if(node != null)
        {
            return (
                <div className="edit-menu-container">
                    <Typography>NODE {node.id}</Typography>
                    <TextField
                        value={node.id}
                        label="ID"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onChange(node.id,"id",event.target.value)}}      //use callBack from props. and pass NodeID,change field and New Value
                    />
                     <TextField
                        value={node.mac}
                        label="MAC"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onChange(node.id,"mac",event.target.value)}}
                    />
                    <TextField
                        value={node.x}
                        label="X coord"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onChange(node.id,"x",event.target.value)}}
                    />
                    <TextField
                        value={node.y}
                        label="Y coord"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onChange(node.id,"y",event.target.value)}}
                    />
                     <TextField
                        value={node.events.toString()}
                        label="Events"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onChange(node.id,"events",event.target.value)}}
                    />
                </div>
            )
        }
        return null;
    }
}
 
export default EditMenu;