import React,{Component} from "react";
import {TextField,Select,MenuItem, InputLabel,Typography} from "@material-ui/core";
class EditMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedLink:{}
        }

        this.linkChanged = (event)=>{
            let selectedId = event.target.value
            let selectedLink = this.props.links.filter((link)=>{return link.target == selectedId})[0]
            this.setState({selectedLink:selectedLink})
        }
    }
    // ??
    // 
    componentDidUpdate(prevProps, prevState, snapshot)
    {
        try{
            if(this.props.node.id != prevProps.node.id)
                 this.setState({selectedLink:{}})
        }
        catch(e)
        {
            // this.setState({selectedLink:{}})
        }
    }

    render() { 
        const {node,links,onChange,onLinkChange,...other} = this.props
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
                    <div>
                           <InputLabel id="label">Link To</InputLabel>
                            <Select onChange={this.linkChanged} labelId="label" id="select" value={this.state.selectedLink.target}>
                            {
                                links.map((link,index)=>{
                                    return (
                                    <MenuItem value={link.target} key={index}>
                                            {link.target}
                                    </MenuItem>)
                                })
                            }
                        </Select>
                    </div>
                    <TextField
                        disabled={!this.state.selectedLink.target}
                        value={this.state.selectedLink.events || ""}
                        label="Link Events"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event)=>{onLinkChange(this.state.selectedLink,"link-events",event.target.value)}}
                    />
                </div>
            )
        }
        return null;
    }
}
 
export default EditMenu;