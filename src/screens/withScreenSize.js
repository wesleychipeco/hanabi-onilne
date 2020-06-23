import React, { Component } from "react";

export default function withWindowDimensions(WrappedComponent) {
  return class extends Component {
    state = { width: 0, height: 0 };

    updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateWindowDimensions);
    }

    render() {
      const { width, height } = this.state;
      return (
        <div style={{ width, height, flex: 1 }}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
