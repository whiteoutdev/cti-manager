import * as React from 'react';
import './Spinner.scss';

class Spinner extends React.Component<{}, {}> {
    render() {
        return (
            <div className="Spinner">
                <svg className="circular" viewBox="25 25 50 50">
                    <circle className="path"
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            strokeWidth="5"
                            strokeMiterlimit="10"/>
                </svg>
            </div>
        );
    }
}

export default Spinner;
