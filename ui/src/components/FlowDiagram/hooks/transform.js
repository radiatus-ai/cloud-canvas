import {
  graphStratify,
  sugiyama,
  layeringLongestPath,
  decrossTwoLayer,
  coordCenter,
} from 'd3-dag';
// import { graphStratify, sugiyama } from 'd3-dag';

const transformPackagesToNodes = (
  packages,
  connections,
  canvasWidth,
  canvasHeight
) => {
  if (!packages || packages.length === 0) return [];

  // Create a graph structure
  const graph = graphStratify();
  const dag = graph(
    packages.map((pkg) => ({
      id: pkg.id,
      parentIds: connections
        .filter((conn) => conn.target_package_id === pkg.id)
        .map((conn) => conn.source_package_id),
    }))
  );

  // Modify the layout to be horizontal
  const layout = sugiyama()
    .nodeSize([100, 150]) // Swap width and height for horizontal layout
    .layering(layeringLongestPath())
    .decross(decrossTwoLayer())
    .coord(coordCenter());

  const { width, height } = layout(dag);

  // Find min and max coordinates to calculate scaling
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const node of dag.nodes()) {
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
  }

  // Swap x and y scales for horizontal layout
  const horizontalPadding = 50;
  const verticalPadding = 50;
  const xScale = (canvasHeight - 2 * verticalPadding) / (maxY - minY || 1);
  const yScale = (canvasWidth - 2 * horizontalPadding) / (maxX - minX || 1);

  // Transform the layout into ReactFlow nodes
  const nodes = [];
  for (const node of dag.nodes()) {
    const pkg = packages.find((p) => p.id === node.data.id);
    nodes.push({
      id: pkg.id,
      type: 'custom',
      position: {
        x: (node.y - minY) * xScale + verticalPadding, // Swap x and y
        y: (node.x - minX) * yScale + horizontalPadding, // Swap x and y
      },
      data: {
        id: pkg.id,
        label: pkg.name || '',
        type: pkg.type || '',
        inputs: pkg.inputs || {},
        outputs: pkg.outputs || {},
        parameters: pkg.parameters || {},
        parameter_data: pkg.parameter_data || {},
        deploy_status: pkg.deploy_status || 'NOT_DEPLOYED',
        isRoot: dag.roots().next().value === node,
        isLeaf: dag.leaves().next().value === node,
        parentCount: node.nparents(),
        childCount: node.nchildren(),
      },
    });
  }

  // Add edge information
  const edges = [];
  for (const link of dag.links()) {
    edges.push({
      id: `${link.source.data.id}-${link.target.data.id}`,
      source: link.source.data.id,
      target: link.target.data.id,
    });
  }

  console.log(`Graph has ${dag.nnodes()} nodes and ${dag.nlinks()} links`);
  console.log(`Graph is ${dag.connected() ? 'connected' : 'not connected'}`);

  return { nodes, edges };
};

export default transformPackagesToNodes;
