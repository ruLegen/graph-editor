import React,{Component, Fragment} from "react";
import Button from '@material-ui/core/Button';
import { Dialog,DialogTitle,TextField,DialogContent,DialogActions, Slider, Switch,FormGroup,FormControlLabel } from "@material-ui/core";
import ImageAspectRatioIcon from '@material-ui/icons/ImageAspectRatio';
//to reduce code, this class get via props Context of parent,and change his state
class SettingsMenu extends Component {
    constructor(props)
    {
        super(props)
        this.textBox = React.createRef();
        this.state = {
        }
        this.onNodeChanged=(key,value)=>{
            console.log(value)
            const {settings,...others} = this.props.context.state
            let newSettings = {...settings}
            newSettings.node[key] = value
            this.props.context.setState({settings:newSettings})            
        }
        this.onNodeSize=(event)=>{

        }
    }


    render(){
        const {settings,...others} = this.props.context.state
        return (this.props.open?
        <Fragment>
            <Dialog open={this.props.open} 
                    onClose={this.props.onClose} 
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                <DialogTitle id="form-dialog-title">Graph Settings</DialogTitle>
                <DialogContent>
                    <FormGroup column>
                        <FormControlLabel
                                label={`Render labels = ${settings.node.renderLabel}`}
                                control={
                                <Switch checked={settings.node.renderLabel}
                                        onChange={(event)=>{this.onNodeChanged("renderLabel",event.target.checked)}} value="node.renderLabel" />}
                                         />
                                <TextField label="Node Size" value={settings.node.size}
                                    onChange={(event)=>{
                                        let value = 0
                                        if(event.target.value.length == 0)
                                            value = 0
                                        else
                                            value = parseInt(event.target.value);
                                        this.onNodeChanged("size",isNaN(value)?settings.node.size:value)
                                    }}
                                />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                   
                </DialogActions>
            </Dialog>
        </Fragment>:null)
    }
}

export default SettingsMenu