import React, { Component } from "react";
import { TextField, Select, MenuItem, InputLabel, Typography, Checkbox, Grid } from "@material-ui/core";
import { CONSTANTS } from "../js/utils.js";

class EditMenu extends Component {
    constructor(props) {
        super(props)
        this.idTextField = React.createRef();
        this.state = {
            selectedLink: {},
            idText: "",
            phantomID: 0
        }
        this.onBlur = (event) => {
            this.props.onChange(this.props.node.id, "id", event.target.value)
        }
        this.onCheckboxChange = (event) => {
            let isPhantom = event.target.checked;
            // If checkbox it true then make it phantom
            if (isPhantom)
                this.props.onChange(this.props.node.id, "mac", CONSTANTS.phantomBeaconId)
            // If checkbox is false then make it default
            if (!isPhantom)
                this.props.onChange(this.props.node.id, "mac", CONSTANTS.defaultMac)
            this.props.onChange(this.props.node.id, "isPhantom", isPhantom)
            
        }
        this.linkChanged = (event) => {
            let selectedId = event.target.value
            let selectedLink = this.props.links.filter((link) => { return link.target == selectedId })[0]
            this.setState({ selectedLink: selectedLink })
        }
    }
    // ??
    // 
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            if (this.props.node.id != prevProps.node.id)
                this.setState({ selectedLink: {}, idText: "" })
        }
        catch (e) {
            // this.setState({selectedLink:{}})
        }
    }

    render() {
        const { node, links, onChange, onLinkChange, ...other } = this.props
        if (node != null) {
            let isPhantom = node.isPhantom
            let isDestinct = node.isDestinct
            let isRouteSpelling = node.isRouteSpelling
            return (
                <div className="edit-menu-container">
                    <Typography>NODE {node.id}</Typography>
                    <div>
                        <Typography>Is destinctable <Checkbox
                            checked={isDestinct}
                            onChange={(event) => {
                                onChange(node.id, "isDestinct", event.target.checked)
                            }}
                        />    </Typography>
                        <Typography>Is RouteSpelling <Checkbox
                            checked={isRouteSpelling}
                            onChange={(event) => {
                                onChange(node.id, "isRouteSpelling", event.target.checked)
                            }}
                        />    </Typography>

                    </div>
                    <TextField
                        value={this.state.idText.length > 0 ? this.state.idText : node.id}
                        ref={this.idTextField}
                        label="ID"
                        inputProps={{ onBlur: this.onBlur }}
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event) => { this.setState({ idText: event.target.value }) }}      //use callBack from props. and pass NodeID,change field and New Value
                    />
                    <TextField
                        value={node.name}
                        label="Name"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event) => {
                            let name = event.target.value;
                            if (name.length == 0)
                                name = CONSTANTS.defaultName
                            onChange(node.id, "name", name)
                        }}      //use callBack from props. and pass NodeID,change field and New Value
                    />

                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                    >
                        <TextField
                            value={node.mac}
                            label="MAC"
                            defaultValue=""
                            margin="normal"
                            disabled={isPhantom}
                            variant="filled"
                            onChange={(event) => { onChange(node.id, "mac", event.target.value) }}
                        />
                        <div>
                            <Checkbox
                                checked={isPhantom}
                                label="MAC"
                                onChange={this.onCheckboxChange}
                            />
                        </div>

                    </Grid>
                        <TextField
                            value={node.x}
                            label="X coord"
                            defaultValue=""
                            margin="normal"
                            variant="filled"
                            onChange={(event) => { onChange(node.id, "x", event.target.value) }}
                        />
                        <TextField
                            value={node.y}
                            label="Y coord"
                            defaultValue=""
                            margin="normal"
                            variant="filled"
                            onChange={(event) => { onChange(node.id, "y", event.target.value) }}
                        />

                    <TextField
                        value={node.events.toString()}
                        label="Events"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event) => { onChange(node.id, "events", event.target.value) }}
                    />
                     <TextField
                        value={node.broadcast}
                        label="Broadcast"
                        defaultValue=""
                        margin="normal"
                        variant="filled"
                        onChange={(event) => { onChange(node.id, "broadcast", event.target.value) }}
                    />
                    <div>
                        <InputLabel id="label">Link To</InputLabel>
                        <Select onChange={this.linkChanged} labelId="label" id="select" value={this.state.selectedLink.target}>
                            {
                                links.map((link, index) => {
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
                        onChange={(event) => { onLinkChange(this.state.selectedLink, "link-events", event.target.value) }}
                    />
                </div>
            )
        }
        return null;
    }
}

export default EditMenu;