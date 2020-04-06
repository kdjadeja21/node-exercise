import React from 'react';
import { Button, FormControl, MenuItem, Select, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';

export default class ShowData extends React.Component {

    deleteData = id => e => {
        this.props.DeleteData(id);
    }

    editData = id => e => {
        this.props.EditData(id);
    }

    render() {
        const listitems = this.props.Data.map(row => {
            return (
                <TableRow hover key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.subject}</TableCell>
                    <TableCell align="center">{row.user}</TableCell>
                    <TableCell align="center">{row.assigned_user}</TableCell>
                    <TableCell align="center">
                        <Rating
                            name="priority_value"
                            value={row.priority}
                            max={3}
                            readOnly />
                    </TableCell>
                    <TableCell align="center">
                        <FormControl style={{ 'min-width': '100px' }} disabled>
                            <Select
                                name="statusShow"
                                value={row.status}
                            >
                                <MenuItem value={1}>Open</MenuItem>
                                <MenuItem value={2}>In Progress</MenuItem>
                                <MenuItem value={3}>Close</MenuItem>
                            </Select>
                        </FormControl>
                    </TableCell>
                    <TableCell align="center">
                        <span onClick={this.editData(row.id)}>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        </span>
                        <span onClick={this.deleteData(row.id)}>
                            <IconButton color='secondary'>
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </TableCell>
                </TableRow>
            )
        })

        return (
            <TableContainer style={{ 'border-radius': '10px' }}>
                {/* <Button
                    onClick={this.props.ClearStorage}
                    variant="contained"
                    color="secondary"
                    disabled={this.props.ClearStorageBool}>
                    Clear All
                </Button> */}
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Subject</TableCell>
                            <TableCell align="center">User</TableCell>
                            <TableCell align="center">Assigned User</TableCell>
                            <TableCell align="center">Priority</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listitems}
                    </TableBody>
                </Table>
            </TableContainer >
        )

    }
}