import React, { Component } from "react";
import axios from "axios";
import Alert from "sweetalert-react";
import { SingleDatePicker } from "react-dates"; //not to be used
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import moment, { relativeTimeThreshold } from "moment";
import FormData from "form-data";

import "react-datepicker/dist/react-datepicker.css";

import "react-dropdown/style.css";

import Select from "react-select";

import { store } from "react-notifications-component";
// code, email, integer, float, address, text
import validate from "../validate";
import "rc-time-picker/assets/index.css";

const stateVarNameOpts = [
  { label: "Certificates", value: "certificates" },
  { label: "Registrations", value: "registrations" },
  { label: "Course Visits", value: "visits" }
];

const stateVarIntervalOpts = [
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "500", value: 500 }
];

class GenerateEventVar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      eventPurpose: "",
      useCustomFile: "false",
      inputFile: "",
      postStatus: "",
      postAll: false,
      stateVarName: null,
      stateVarValue: null,
      isRecurring: "false",
      stateVarInterval: null,
      stateVarStartValue: null,
      stateVarStopValue: null,
      postNearestTime: moment()
    };

    this.handlePostFacebookChange = this.handlePostFacebookChange.bind(this);
    this.handlePostTwitterChange = this.handlePostTwitterChange.bind(this);
    this.handlePostTelegramChange = this.handlePostTelegramChange.bind(this);
    this.handlePostLinkedinChange = this.handlePostLinkedinChange.bind(this);
    this.handleUseCustomChange = this.handleUseCustomChange.bind(this);
    this.handleEventPurposeChange = this.handleEventPurposeChange.bind(this);
    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.customFileInputChange = this.customFileInputChange.bind(this);
    this.handleFileReset = this.handleFileReset.bind(this);
    this.handlePostStatusChange = this.handlePostStatusChange.bind(this);
    this.handlePostAllChange = this.handlePostAllChange.bind(this);
    this.handleStateVarNameChange = this.handleStateVarNameChange.bind(this);
    this.handleStateVarValueChange = this.handleStateVarValueChange.bind(this);
    this.handleRecurrToggle = this.handleRecurrToggle.bind(this);
    this.handleStateVarIntervalChange = this.handleStateVarIntervalChange.bind(
      this
    );
    this.handleStateVarStartChange = this.handleStateVarStartChange.bind(this);
    this.handleStateVarStopChange = this.handleStateVarStopChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const eventNameValid = validate("text", this.state.eventName);
    const eventPurposeValid = validate("text", this.state.eventPurpose);
    const postStatus = validate("text", this.state.postStatus);

    if (!eventNameValid) {
      return showNotification(
        "danger",
        "Generate Event By Timestamp",
        "Invalid Event Name"
      );
    }
    if (!eventPurposeValid) {
      return showNotification(
        "danger",
        "Generate Event By Timestamp",
        "Invalid Event Purpose"
      );
    }
    if (!postStatus) {
      return showNotification(
        "danger",
        "Generate Event By Timestamp",
        "Invalid Post Status"
      );
    }

    if (this.state.stateVarName === null) {
      showNotification(
        "danger",
        "Generate Event By Timestamp",
        "Please select a variable name"
      );
    }

    const socialPlatform = {
      facebook: this.state.postOnFacebook,
      twitter: this.state.postOnTwitter,
      linkedin: this.state.postOnLinkedin,
      telegram: this.state.postOnTelegram
    };

    if (
      !this.state.postOnFacebook &&
      !this.state.postOnLinkedin &&
      !this.state.postOnTelegram &&
      !this.state.postOnTwitter
    ) {
      return showNotification(
        "danger",
        "Generate Event By Timestamp",
        "Please select atleast one platform!"
      );
    }

    const isRecurring = this.state.isRecurring === "true";
    console.log("State variable value: ", this.state.stateVarValue);
    if (isRecurring) {
      console.log("is recurring");
      if (this.state.stateVarInterval === null) {
        showNotification(
          "danger",
          "Generate Event By Var",
          "Please select state variable interval"
        );
        return;
      } else if (
        this.state.stateVarStartValue === null ||
        isNaN(this.state.stateVarStartValue)
      ) {
        showNotification(
          "danger",
          "Generate Event By Var",
          "Invalid interval start value"
        );
        return;
      } else if (
        this.state.stateVarStopValue === null ||
        isNaN(this.state.stateVarStopValue)
      ) {
        showNotification(
          "danger",
          "Generate Event By Var",
          "Invalid interval stop value"
        );
        return;
      } else if (this.state.postNearestTime === null) {
        showNotification(
          "danger",
          "Generate Event By Var",
          "Invalid post nearest time value"
        );
        return;
      }
    } else {
      console.log("not recurring");
      console.log(
        this.state.stateVarValue,
        this.state.stateVarValue === null,
        typeof this.state.stateVarValue
      );
      if (this.state.useCustomFile === "true") {
        if (this.state.inputFile === "") {
          showNotification(
            "danger",
            "Generate Event By Var",
            "Please select a file"
          );
          return;
        }
        if (this.state.stateVarValue === null || isNaN(this.state.stateVarValue)) {
          showNotification(
            "danger",
            "Generate Event By Var",
            "Invalid state variable value"
          );
          return;
        }
      }
    }

    // all data ok!
    
  }

  handleStateVarStartChange(event) {
    this.setState({ stateVarStartValue: event.target.value });
  }

  handleStateVarStopChange(event) {
    this.setState({ stateVarStopValue: event.target.value });
  }

  handleStateVarIntervalChange(option) {
    this.setState({ stateVarInterval: option });
  }

  handleRecurrToggle(event) {
    if (event.target.value === "false") {
      this.setState({
        stateVarInterval: null,
        stateVarStartValue: null,
        stateVarStopValue: null,
        isRecurring: event.target.value
      });
    } else if (event.target.value === "true") {
      this.setState({ stateVarValue: null, isRecurring: event.target.value });
    }
    document
      .getElementById("gen-evnt-btn-var")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  handleStateVarNameChange(option) {
    this.setState({ stateVarName: option });
  }

  handleStateVarValueChange(event) {
    this.setState({ stateVarValue: event.target.value });
  }

  handlePostStatusChange(event) {
    this.setState({ postStatus: event.target.value });
  }

  handleEventNameChange(event) {
    this.setState({ eventName: event.target.value });
  }

  handleEventPurposeChange(event) {
    this.setState({ eventPurpose: event.target.value });
  }

  handleFileReset() {
    this.setState({ inputFile: "" });
    document.getElementById("customFileInput_Var").value = "";
  }

  customFileInputChange(event) {
    this.setState({ inputFile: event.target.files[0] });
  }

  handleUseCustomChange(event) {
    const customFileInput = document.getElementById("customFileInput_Var");
    if (event.target.value === "true") {
      customFileInput.disabled = false;
    } else if (event.target.value === "false") {
      customFileInput.disabled = true;
    }
    this.setState({ useCustomFile: event.target.value });
  }

  handlePostFacebookChange(event) {
    this.setState({ postOnFacebook: event.target.checked });
  }

  handlePostTwitterChange(event) {
    this.setState({ postOnTwitter: event.target.checked });
  }

  handlePostTelegramChange(event) {
    this.setState({ postOnTelegram: event.target.checked });
  }

  handlePostLinkedinChange(event) {
    this.setState({ postOnLinkedin: event.target.checked });
  }

  handlePostAllChange(event) {
    console.log("Post on all checked: ", event.target.value);
    if (event.target.checked) {
      this.setState({
        postOnFacebook: true,
        postOnLinkedin: true,
        postOnTwitter: true,
        postOnTelegram: true,
        postAll: true
      });
    } else {
      this.setState({
        postOnFacebook: false,
        postOnLinkedin: false,
        postOnTwitter: false,
        postOnTelegram: false,
        postAll: false
      });
    }
  }

  render() {
    return (
      <div className="card">
        <div className="header">
          <h4>Generate Event On State Variable</h4>
        </div>
        <div className="content">
          <form className="form-horizontal soft-input">
            <div className="form-group">
              <label className="col-md-4 control-label">Event Name</label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={this.state.eventName}
                  placeholder="event name"
                  onChange={this.handleEventNameChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-4 control-label">Event Purpose</label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={this.state.eventPurpose}
                  placeholder="event purpose"
                  onChange={this.handleEventPurposeChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-4 control-label">Post Status</label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={this.state.postStatus}
                  placeholder="post status"
                  onChange={this.handlePostStatusChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="control-label col-md-4">Choose</label>

              <div className="col-md-8 checkbox-grp">
                <div className="row">
                  <div className="col-md-6">
                    <label>
                      <input
                        type="checkbox"
                        onChange={this.handlePostFacebookChange}
                        checked={this.state.postOnFacebook}
                      />
                      &nbsp;&nbsp; Facebook
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label>
                      <input
                        type="checkbox"
                        onChange={this.handlePostTwitterChange}
                        checked={this.state.postOnTwitter}
                      />
                      &nbsp;&nbsp; Twitter
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label>
                      <input
                        type="checkbox"
                        onChange={this.handlePostTelegramChange}
                        checked={this.state.postOnTelegram}
                      />
                      &nbsp;&nbsp; Telegram
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label>
                      <input
                        type="checkbox"
                        onChange={this.handlePostLinkedinChange}
                        checked={this.state.postOnLinkedin}
                      />
                      &nbsp;&nbsp; Linkedin
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label>
                      <input
                        type="checkbox"
                        onChange={this.handlePostAllChange}
                        checked={this.state.postAll}
                      />
                      &nbsp;&nbsp; All
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="control-label col-md-4">
                State Variable Name
              </label>
              <div className="col-md-8">
                <Select
                  value={this.state.stateVarName}
                  onChange={this.handleStateVarNameChange}
                  options={stateVarNameOpts}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="control-label col-md-4">
                Is Event Recurring
              </label>
              <div className="col-md-8 radio-group  ">
                <div className="radio-input-group no-delay">
                  <input
                    id="recurrYesVar"
                    name="recurrEvent"
                    value="true"
                    checked={this.state.isRecurring === "true"}
                    onChange={this.handleRecurrToggle}
                    type="radio"
                  />
                  <label for="recurrYesVar">Yes</label>
                </div>
                <div className="radio-input-group no-delay">
                  <input
                    id="recurrNoVar"
                    name="recurrEvent"
                    type="radio"
                    value="false"
                    checked={this.state.isRecurring === "false"}
                    onChange={this.handleRecurrToggle}
                  />
                  <label for="recurrNoVar">No</label>
                </div>
              </div>
            </div>

            {this.state.isRecurring === "true" ? (
              <div>
                <div className="form-group">
                  <label className="control-label col-md-4">
                    State Variable Interval
                  </label>
                  <div className="col-md-8">
                    <Select
                      onChange={this.handleStateVarIntervalChange}
                      value={this.state.stateVarInterval}
                      options={stateVarIntervalOpts}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-4">
                    Interval Start Value
                  </label>
                  <div className="col-md-8">
                    <input
                      onChange={this.handleStateVarStartChange}
                      value={this.state.stateVarStartValue}
                      placeholder="interval-scope start"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-4">
                    Interval Stop Value
                  </label>
                  <div className="col-md-8">
                    <input
                      onChange={this.handleStateVarStopChange}
                      value={this.state.stateVarStopValue}
                      placeholder="interval-scope stop"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="control-label col-md-4">
                    Use Custom File
                  </label>
                  <div className="col-md-8 radio-group  ">
                    <div className="radio-input-group">
                      <input
                        id="customYes_Var"
                        name="restrictCode"
                        value="true"
                        checked={this.state.useCustomFile === "true"}
                        onChange={this.handleUseCustomChange}
                        type="radio"
                      />
                      <label for="customYes_Var">Yes</label>
                    </div>
                    <div className="radio-input-group">
                      <input
                        id="customNo_Var"
                        name="restrictCode"
                        type="radio"
                        value="false"
                        checked={this.state.useCustomFile === "false"}
                        onChange={this.handleUseCustomChange}
                      />
                      <label for="customNo_Var">No</label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-4">Custom File</label>
                  <div className="control-label col-md-4">
                    <input
                      type="file"
                      name="customFile"
                      onChange={this.customFileInputChange}
                      disabled
                      id="customFileInput_Var"
                      style={{ width: "240px" }}
                    />
                  </div>
                  <div
                    style={{ paddingTop: "3%" }}
                    onClick={this.handleFileReset}
                    className="file-reset-btn"
                  >
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-4">
                    State Variable Value
                  </label>
                  <div className="col-md-8">
                    <input
                      placeholder="enter the state variable value"
                      value={this.state.stateVarValue}
                      onChange={this.handleStateVarValueChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="control-label col-md-4">
                Nearest Post Time
              </label>
              <div className="col-md-8">
                <TimePicker
                  showSecond={false}
                  defaultValue={moment()}
                  value={this.state.postNearestTime}
                  className="xxx"
                  onChange={postNearestTime => {
                    this.setState({ postNearestTime: postNearestTime });
                  }}
                  format={"h:mm a"}
                  use12Hours
                  inputReadOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-3"></label>
              <div className="col-md-9">
                <button
                  id="gen-evnt-btn-var"
                  type="button"
                  onClick={this.handleSubmit}
                  className="right btn btn-fill btn-info"
                >
                  Generate New Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function showNotification(type, title, message) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    width: 200,
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
}

export default GenerateEventVar;
