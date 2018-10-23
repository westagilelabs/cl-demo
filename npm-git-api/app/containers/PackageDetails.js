import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Package from '../components/Package';
import * as CounterActions from '../actions/counter';

function mapStateToProps(state,ownProps) {
  console.log(state);
  return {
    counter: state.counter,
    package: ownProps.match.params.package
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Package);
