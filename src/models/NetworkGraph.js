import {getServiceName} from "../utils/serviceNames";

export class Graph {
    constructor() {
        this.edges = [];
        this.nodes = [];
    }

    addEdge(source, target, weight) {
        if (source !== target) this.edges.push({ source, target, weight });
    }

    addNode(newNode) {
        this.nodes = this.nodes.concat(newNode);
    }

    removeNode(nodeId) {
        this.nodes = this.nodes.filter((node) => node.id !== nodeId);
    }

    replaceNode(newNode) {
        this.removeNode(newNode.id);
        this.addNode(newNode);
    }

    setNode(newNode) {
        const node = this.nodes.find(x => newNode.id === x.id);

        if (!node) this.addNode(newNode);
        else if (node.value < newNode.value) this.replaceNode(newNode);
    }
}

export class LogsGraph extends Graph {
    static TOP_NODES_LIMIT = 50;

    constructor(stats) {
        super();

        this.fillGraph(stats);
    }

    fillGraph(stats) {
        const nodeValues = {};
        stats.forEach((log) => {
            const fromNodeValue = nodeValues[log.from];
            const toNodeValue = nodeValues[log.to];

            if (fromNodeValue) nodeValues[log.from] += 1;
            else nodeValues[log.from] = 1;

            if (toNodeValue) nodeValues[log.to] += 1;
            else nodeValues[log.to] = 1;
        });

        stats.forEach((log) => {
            if (!this.edges.find((x) => x.source === log.from && x.target === log.to)) {
                this.addEdge(log.from, log.to, 1);
            }

            this.setNode({
                id: log.from,
                value: nodeValues[log.from],
            });
            this.setNode({
                id: log.to,
                value: nodeValues[log.to],
            });
        });
    }
    getTopNodes() {
        return this.nodes
            .sort((a, b) => (a.value < b.value ? 1 : -1))
            .slice(0, LogsGraph.TOP_NODES_LIMIT);
    }
    getTopEdges() {
        const topNodes = this.getTopNodes();

        return this.edges
            .filter(edge => {
                const matchingOuterNode = topNodes.some(node => node.id === edge.source);
                const matchingInnerNode = topNodes.some(node => node.id === edge.target);

                return matchingOuterNode && matchingInnerNode;
            })
            .reduce((edges, edge) => {
                if (!edges.find((x) => x.target === edge.source && x.source === edge.target)) edges.push(edge);
                return edges;
            }, []);
    }
    getTopGraphData() {
        const nodes = this.getTopNodes();
        const edges = this.getTopEdges();

        return { nodes, edges };
    }

    getChartData() {
        const { nodes, edges } = this.getTopGraphData();

        if (!nodes.length) return { nodes, edges };

        const COLORS = ['#32373B', '#4A5859', '#F4D6CC', '#F4B860', '#C83E4D'];

        return {
            edges: edges.map(edge => ({
                from: edge.source,
                to: edge.target,
                value: edge.weight,
                color: null,
            })),
            nodes: nodes.map((node, index) => {
                const color = COLORS[index];
                return {
                    ...node,
                    id: node.id,
                    label: getServiceName(node.id),
                    color: {
                        background: color,
                        border: `${color}60`,
                        hover: {
                            background: color,
                            border: `${color}75`,
                        },
                        highlight: {
                            background: color,
                            border: `${color}60`,
                        },
                    },
                    font: { color: 'rgba(0,0,0,.87)' }
                };
            }),
        };
    }
}
