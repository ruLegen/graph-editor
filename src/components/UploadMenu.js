import React, { Component, Fragment } from "react";

import Button from '@material-ui/core/Button';
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions, Slider, Switch, FormGroup, FormControlLabel, Grid } from "@material-ui/core";
import ImageAspectRatioIcon from '@material-ui/icons/ImageAspectRatio';
//to reduce code, this class get via props Context of parent,and change his state
class UploadMenu extends Component {
    constructor(props) {
        super(props)
        this.textBox = React.createRef();
        this.state = {
            password:"",
        }
    }

    render() {
        const { appSettings, settings, locationName,...others } = this.props.context.state
       
            return (this.props.open ?
                <Fragment>
                    <Dialog open={this.props.open}
                        onClose={()=>{
                            this.props.onClose()}}
                        aria-labelledby="form-dialog-title"
                        fullWidth={true}>
                        <DialogTitle id="form-dialog-title">Upload to server menu</DialogTitle>
                        <DialogContent>
                            <FormGroup column>
                                <TextField label="Server address" value={appSettings.serverAddress}
                                    onChange={(event) => {
                                       let value =event.target.value
                                       let newAppSettings = {...appSettings};
                                       newAppSettings.serverAddress = value;
                                       this.props.context.setState({ appSettings: newAppSettings }) 
                                    }}
                                />

                                <TextField label="Secret key" value={this.state.password}
                                    onChange={(event) => {
                                        let value =event.target.value
                                        this.setState({password:value});
                                    }}
                                />
                                <TextField label="Location Name" value={appSettings.locationName}
                                    onChange={(event) => {
                                        let value =event.target.value
                                        let newAppSettings = {...appSettings};
                                        newAppSettings.locationName = value;
                                        this.props.context.setState({ appSettings: newAppSettings })
                                    }}
                                />

                                <Grid style={{marginTop:'3vh'}} container direction="row" justify="flex-start" alignItems="center">
                                      <Button onClick={()=>{this.props.onUploadClicked(this.state.password)}} variant="contained" color="primary">Upload</Button>
                                </Grid>

                            </FormGroup>    
                        </DialogContent>
                        <DialogActions>

                        </DialogActions>
                    </Dialog>
                </Fragment> : null)
        }
    }

    export default UploadMenu