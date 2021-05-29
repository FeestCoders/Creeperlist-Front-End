import React from 'react';

const xAxisDayOfWeek = (props) => {
    const {x, y, payload} = this.props;

    
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={-10} y={30}
                  textAnchor="start"
                  fill="#666">{payload.value}</text>
        </g>
    );
};

export default xAxisDayOfWeek;