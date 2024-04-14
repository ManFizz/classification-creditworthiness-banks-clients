import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css"
import "./css/main.css";
import { SECTION } from "./js/Definitions";
import NavBar from "./js/Components/Layout/NavBar";
import ClassesList from "./js/Components/Pages/ClassesList";
import AttributesList from "./js/Components/Pages/AttributesList";
import AttributesValues from "./js/Components/Pages/AttributesValues";
import ClassesValues from "./js/Components/Pages/ClassesValues";
import CheckCompleteness from "./js/Components/Pages/CheckCompleteness";
import DeterminingClass from "./js/Components/Pages/DeterminigClass";
import axios from "axios";
import isEqual from "lodash/isEqual";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: SECTION.DETERMINING_THE_CREDITWORTHINESS_CLASS,
      classes: [],
      attributes: [],
    };

    this.renderCurrentNav = this.renderCurrentNav.bind(this);
  }
  componentDidMount() {
    this.fetchClasses().then();
    this.fetchAttributes().then();
  }

  fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      await this.setState({ classes: response.data }, this.LinkAttributes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  fetchAttributes = async () => {
    try {
      const response = await axios.get('/api/attributes');
      this.setState({ attributes: response.data }, this.LinkAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  LinkAttributes = () => {
    const { attributes, classes } = this.state;
    if(classes.length > 0 && attributes.length > 0) {
      classes.forEach(c => {
        if(c.attributes === undefined)
          c.attributes = [];
        else {
          c.attributes = c.attributes.map(a => ({
            ...a,
            attr: attributes.find(attr => attr.id === a.id)
          })).filter(a => a.attr !== undefined);
        }
      });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(!isEqual(prevState.attrValues, this.state.attributes)) {
      this.LinkAttributes();
    }
  }

  renderCurrentNav() {
    const { section, classes, attributes } = this.state;
    switch(section) {
      case SECTION.CLASSES_LIST: {
        return <ClassesList
          classes={classes}
          setProps={(arg) => this.setState(arg)}
        />;
      }
      case SECTION.ATTRIBUTES: {
        return <AttributesList
          attributes={attributes}
          setProps={(arg) => this.setState(arg)}
        />;
      }
      case SECTION.ATTRIBUTES_VALUES: {
        return <AttributesValues
          attributes={attributes}
          setProps={(arg) => this.setState(arg)}
        />;
      }
      case SECTION.CLASSES_DESCRIPTION: {
        return <ClassesValues
          classes={classes}
          attributes={attributes}
          setProps={(arg) => this.setState(arg)}
        />;
      }
      case SECTION.CHECK_COMPLETENESS_KNOWLEDGE: {
        return <CheckCompleteness
          classes={classes}
          attributes={attributes}
          setProps={(arg) => this.setState(arg)}
        />;
      }
      case SECTION.DETERMINING_THE_CREDITWORTHINESS_CLASS: {
        return <DeterminingClass
          classes={classes}
          attributes={attributes}
          setSection={ sect => this.setState({section: sect})}
        />;
      }
      default: {
        return <span>Invalid section</span>;
      }
    }
  }

  render() {
    return (
      <React.StrictMode>
        <NavBar
          setSection={ sect => this.setState({section: sect})}
          display={this.state.section !== SECTION.DETERMINING_THE_CREDITWORTHINESS_CLASS}
        />
        <div className="wrapper d-flex align-items-stretch overflow-auto container-xxl flex-wrap">
          {this.renderCurrentNav()}
        </div>
      </React.StrictMode>
    )
  }
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Main));