import React,{Component, Fragment} from "react";
import Button from '@material-ui/core/Button';
import { Dialog,DialogTitle,TextField,DialogContent,DialogActions } from "@material-ui/core";
import ImageAspectRatioIcon from '@material-ui/icons/ImageAspectRatio';
class PlanDialog extends Component {
    constructor(props)
    {
        super(props)
        this.textBox = React.createRef();
        this.state = {
            url:""
        }
        this.onApply =()=>{
            console.log(this.textBox.current)
            this.props.onApply(this.state.url)
            this.props.onClose();
        }
        this.onTextChanged=(event)=>{
            event.persist()
            this.setState({url:event.target.value})
        }
    }


    render(){
        return (this.props.open?
        <Fragment>
            <Dialog open={this.props.open} 
                    onClose={this.props.onClose} 
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
        </Fragment>:null)
    }
}

export default PlanDialog