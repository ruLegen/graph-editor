import React,{Component, Fragment} from "react";
import Button from '@material-ui/core/Button';
import { Dialog,DialogTitle,TextField,DialogContent,DialogActions } from "@material-ui/core";

class PlanDialog extends Component {
    constructor(props)
    {
        super(props)
        this.textBox = React.createRef();
        this.state = {
            isOpen:false,
            url:""
        }
        this.onClose = ()=>{
            this.setState({isOpen:false})
        }
        this.onApply =()=>{
            console.log(this.textBox.current)
            this.props.onApply(this.state.url)
            this.onClose();
        }
        this.onTextChanged=(event)=>{
            event.persist()
            this.setState({url:event.target.value})
        }
    }


    render(){
        return (<Fragment>
            <Button onClick={()=>{this.setState({isOpen:true})}} color="inherit">Plan</Button>
            <Dialog open={this.state.isOpen} 
                    onClose={this.onClose} 
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}>
                <DialogTitle id="form-dialog-title">Plan image URL</DialogTitle>
                <DialogContent>
                    <TextField
                        ref={this.textBox}
                        autoFocus
                        id="name"
                        label="URL"
                        value={this.state.url}
                        fullWidth
                        onChange={this.onTextChanged}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onApply} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>)
    }
}

export default PlanDialog