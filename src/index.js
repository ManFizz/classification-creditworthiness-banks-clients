import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import ClassesList from "./js/Components/ClassesList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css"
import "./css/main.css";
import { SECTION } from "./js/Definitions";
import NavBar from "./js/Components/NavBar";
import AttributesList from "./js/Components/AttributesList";
import AttributesValues from "./js/Components/AttributesValues";
import ClassesDescription from "./js/Components/ClassesDecription";
import ClassesValues from "./js/Components/ClassesValues";
import CheckCompleteness from "./js/Components/CheckCompleteness";
import DeterminingClass from "./js/Components/DeterminigClass";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: SECTION.CLASSES_LIST,
    };

    this.renderCurrentNav = this.renderCurrentNav.bind(this);
  }

  renderCurrentNav() {
    const { section } = this.state;
    switch(section) {
      case SECTION.CLASSES_LIST: {
        return <ClassesList />;
      }
      case SECTION.ATTRIBUTES: {
        return <AttributesList />;
      }
      case SECTION.ATTRIBUTES_VALUES: {
        return <AttributesValues />;
      }
      case SECTION.CLASSES_DESCRIPTION: {
        return <ClassesDescription />;
      }
      case SECTION.CLASSES_VALUES: {
        return <ClassesValues />;
      }
      case SECTION.CHECK_COMPLETENESS_KNOWLEDGE: {
        return <CheckCompleteness />;
      }
      case SECTION.DETERMINING_THE_CREDITWORTHINESS_CLASS: {
        return <DeterminingClass />;
      }
      default: {
        return <span>Invalid section</span>;
      }
    }
  }

  render() {
    return (
      <React.StrictMode>
        <NavBar setSection={ sect => this.setState({section: sect})}/>
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