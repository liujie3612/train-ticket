import "./App.css";
import { connect } from "react-redux";

function App(props) {}

// 被connect包装后的新组件
export default connect(
  function mapStateToProps(state) {},
  function mapDispatchToProps(dispatch) {}
)(App);
