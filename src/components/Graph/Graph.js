// /* eslint-disable react/no-this-in-sfc */

import VisNetworkReactComponent from 'react-vis-graph-wrapper';

import { LogsGraph } from '../../models/NetworkGraph';

const ZOOM_THRESHOLD = 0.19;
const CENTRAL_POSITION = { x: -95, y: 515 };

const NetworkGraph = ({ height = null, logs, onNodeClick = () => {} }) => {
    if (!logs) return null;

    const data = new LogsGraph(logs).getChartData();

    const options = {
        layout: {
            hierarchical: false
        },
        nodes: {
            shape: 'dot',
            borderWidth: 0,
            scaling: {
                min: 20,
                max: 56,
            },
            font: {
                face: '"Inter", "Helvetica Neue", sans-serif',
                size: 18,
            },
        },
        edges: {
            arrowStrikethrough: false,
            color: {
                inherit: 'both',
            },
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 200,
                springConstant: 0.18,
            },
            maxVelocity: 150,
            solver: 'forceAtlas2Based',
            timestep: 0.15,
            stabilization: { fit: true, iterations: 150 },
        },
    };

    return (
        <div style={{ height: height || '100%', position: 'relative' }}>
            <VisNetworkReactComponent
                graph={data}
                options={options}
                events={{
                    click: (x) => (x.nodes ? onNodeClick(data.nodes.find(n => n.id === x.nodes[0])) : null),
                    zoom(x) {
                        if (x.scale <= ZOOM_THRESHOLD) this.moveTo({ scale: ZOOM_THRESHOLD, position: CENTRAL_POSITION });
                    },
                }}
            />
        </div>
    );
};

export default NetworkGraph;
