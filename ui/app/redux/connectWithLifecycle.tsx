import {Component} from 'react';
import {connect} from 'react-redux';
import {LifecycleComponent, LifecycleProps} from './LifecycleComponent';

/* tslint:disable:typedef */
export function connectWithLifecycle(mapStateToProps?: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return function <P extends LifecycleProps, S = {}, SS = any>(component: typeof Component) {
        function mergeLifecycleProps(stateProps: any, dispatchProps: any, ownProps: any): LifecycleProps {
            if (mergeProps) {
                return {...mergeProps(stateProps, dispatchProps, ownProps), component};
            } else {
                return {...ownProps, ...stateProps, ...dispatchProps, component};
            }
        }

        return connect(mapStateToProps, mapDispatchToProps, mergeLifecycleProps, options)(LifecycleComponent);
    };
}
/* tslint:enable:typedef */
