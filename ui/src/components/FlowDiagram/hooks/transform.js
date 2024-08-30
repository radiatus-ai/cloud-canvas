import {
  graphStratify,
  sugiyama,
  layeringLongestPath,
  decrossTwoLayer,
  coordCenter,
} from 'd3-dag';

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

  // Modify the layout to be horizontal with reduced spacing
  const layout = sugiyama()
    .nodeSize([80, 100]) // Reduced node size
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

  // Adjust scaling and add max width/height constraints
  const horizontalPadding = 30; // Reduced padding
  const verticalPadding = 30; // Reduced padding
  const maxWidth = Math.min(canvasWidth, 800); // Reduced max width
  const maxHeight = Math.min(canvasHeight, 600); // Reduced max height
  const xScale = Math.min(
    (maxHeight - 2 * verticalPadding) / (maxY - minY || 1),
    100
  ); // Reduced scale
  const yScale = Math.min(
    (maxWidth - 2 * horizontalPadding) / (maxX - minX || 1),
    150
  ); // Reduced scale

  // Transform the layout into ReactFlow nodes
  const nodes = [];
  for (const node of dag.nodes()) {
    const pkg = packages.find((p) => p.id === node.data.id);
    nodes.push({
      id: pkg.id,
      type: 'custom',
      position: {
        x:
          (node.y - minY) * xScale +
          verticalPadding +
          (maxHeight - (maxY - minY) * xScale) / 2,
        y:
          (node.x - minX) * yScale +
          horizontalPadding +
          (maxWidth - (maxX - minX) * yScale) / 2,
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
