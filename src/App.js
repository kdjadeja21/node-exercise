import React from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import AppHeader from './components/AppHeader';
import ShowData from './components/ShowData';
import AddData from './components/AddData';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class App extends React.Component {

  state = {
    addData: true,
    editData: false,
    showData: false,
    clearStorage: true,
    unique_id: 0,
    id: 0,
    subject: '',
    priority: '3',
    status: 1,
    user: '',
    assigned_user: '',
    filter: {
      priority: null,
      status: null
    },
    data: [],
    url: 'http://localhost:2113/data'
  }

  componentDidMount() {
    console.log("Component did mount");
    axios.get(this.state.url)
      .then(res => {
        console.log(res.data.data);
        this.setState({
          data: res.data.data
        });
      })
      .catch(err => {
        console.log("====" + err);
      });

  }

  toggleData = () => {
    this.setState({
      showData: !this.state.showData,
      addData: !this.state.addData
    })
  }
  editData = async (id) => {
    const filteredItems = this.state.data.filter(item =>
      item.id === id);
    await this.setState({
      addData: false,
      editData: true,
      showData: false,
      id: id,
      unique_id: this.state.id,
      subject: filteredItems[0].subject,
      priority: filteredItems[0].priority,
      status: filteredItems[0].status,
      user: filteredItems[0].user,
      assigned_user: filteredItems[0].assigned_user
    })
  }
  deleteData = id => {
    const filteredItems = this.state.data.filter(item =>
      item.id !== id);

    this.setState({
      data: filteredItems,
      clearStorage: filteredItems.length === 0
    })
    localStorage.setItem('data', JSON.stringify(filteredItems));
    axios.delete(this.state.url + "/delete/" + id)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  handleBlur = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitHandler = async (e) => {
    // e.preventDefault();
    let itemData = [];
    if (!this.state.subject && !this.state.priority && !this.state.status && !this.state.user && !this.state.assigned_user) {
      alert('Please Fill all the fields.');
    }
    else {
      if (this.state.addData) {
        let datas;
        const newItem = {
          id: this.state.id + 1,
          subject: this.state.subject,
          priority: this.state.priority,
          status: this.state.status,
          user: this.state.user,
          assigned_user: this.state.assigned_user
        }

        itemData = this.state.data ? this.state.data : [];
        itemData.unshift(newItem);
        axios.post(this.state.url + "/insert", newItem)
          .then(res => {
            datas = res.data.data
            console.log(datas);
          })
          .catch(err => {
            console.log(err);
          })
        console.log("Data===========");
        console.log(itemData);

      }
      else if (this.state.editData) {
        itemData = this.state.data;
        itemData.map(item => {
          if (item.id === this.state.id) {
            axios.put(this.state.url + "/update/" + item.id, item)
              .then(res => {
                console.log(item);
              })
              .catch(err => {
                console.log(err);
              })
            return (
              item.subject = this.state.subject,
              item.priority = this.state.priority,
              item.status = this.state.status,
              item.user = this.state.user,
              item.assigned_user = this.state.assigned_user
            )
          }
        })
      }

      console.log(itemData);
      await this.setState({
        data: itemData,
        subject: '',
        priority: '3',
        status: '1',
        user: '',
        assigned_user: '',
        id: this.state.editData ? this.state.unique_id : this.state.id + 1,
        addData: false,
        editData: false,
        showData: true,
        clearStorage: false
      });
      localStorage.setItem('data', JSON.stringify(itemData));
      localStorage.setItem('id', this.state.editData ? this.state.unique_id : this.state.id);
    }
  }
  clearLocalStorage = () => {
    localStorage.clear();
    this.setState({
      id: 0,
      data: [],
      clearStorage: true
    })
  }

  filterData = (e) => {
    var priorityValue = null;
    var statusValue = null;
    console.log(e.target.name);
    e.target.name === "status" ? statusValue = e.target.value : statusValue = this.state.filter.status;
    e.target.name === "priority" ? priorityValue = e.target.value : priorityValue = this.state.filter.priority;
    this.setState({
      filter: {
        priority: priorityValue,
        status: statusValue
      }
    });
    console.log(priorityValue);
    console.log(statusValue);
    let body = {
      "priority": priorityValue,
      "status": statusValue
    }
    console.log(body);
    axios.post('http://localhost:2113/data', body)
      .then(res => {
        this.setState({
          data: res.data.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <AppHeader
          toggleFunction={this.toggleData}
          showData={this.state.showData}
        />
        <center>
          <div
            className={!this.state.showData ? 'addDataForm' : 'showData'}
            style={{ 'box-shadow': '2px 5px 13px 0px #ccc', 'border': '1px solid #fff', 'border-radius': '10px' }}>
            {
              !this.state.showData ?
                <AddData
                  Data={this.state}
                  Handleblur={this.handleBlur}
                  HandleChange={this.handleChange}
                  SubmitHandler={this.submitHandler}
                />
                :
                <React.Fragment>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography><center>Priority</center></Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <FormControl component="fieldset">

                        <RadioGroup row aria-label="position"
                          name="priority"
                          defaultValue="top"
                          onChange={this.filterData.bind(this)}
                        >

                          <FormControlLabel
                            value="3"
                            control={<Radio color="primary" />}
                            label="High"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="Medium"
                            labelPlacement="end"
                          />
                          <FormControlLabel value="1" control={<Radio color="primary" />} label="Low" />
                        </RadioGroup>
                      </FormControl>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Typography>Status</Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <FormControl component="fieldset">
                        <RadioGroup row aria-label="position"
                          name="status"
                          defaultValue="top"
                          onChange={this.filterData.bind(this)}
                        >

                          <FormControlLabel
                            value="1"
                            control={<Radio color="primary" />}
                            label="Open"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="In Progress"
                            labelPlacement="end"
                          />
                          <FormControlLabel value="3" control={<Radio color="primary" />} label="Close" />
                        </RadioGroup>
                      </FormControl>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <br />


                  <ShowData
                    ClearStorage={this.clearLocalStorage}
                    Data={this.state.data}
                    ClearStorageBool={this.state.clearStorage}
                    EditData={this.editData}
                    DeleteData={this.deleteData}
                  />
                </React.Fragment>
            }

          </div>
        </center>
      </div>
    );
  }

}

export default App;
