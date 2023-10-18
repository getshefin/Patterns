// Load and show the UI
figma.showUI(__html__, { width: 300, height: 350 });

const figmaUIApi: UIAPI = figma.ui;

figmaUIApi.onmessage = msg => {
    if (msg.type === 'align-circular') {
        const nodes = figma.currentPage.selection;
        const numberOfNodes = nodes.length;

        if (numberOfNodes === 0) {
            figma.notify('Please select the elements you want to align!');
            return;
        }

        const centerX = nodes.reduce((sum, node) => sum + node.x, 0) / numberOfNodes;
        const centerY = nodes.reduce((sum, node) => sum + node.y, 0) / numberOfNodes;

        // Find the largest node dimension (either width or height)
        const maxNodeDimension = Math.max(...nodes.map(node => Math.max(node.width, node.height)));
        
        const gap = parseFloat(msg.gap);
        const combinedSize = maxNodeDimension + gap;
        
        // Place the first element in the center
        nodes[0].x = centerX - nodes[0].width / 2;
        nodes[0].y = centerY - nodes[0].height / 2;

        let nodesPlaced = 1;
        let circleIndex = 1;

        while (nodesPlaced < numberOfNodes) {
            const currentRadius = circleIndex * combinedSize;
            const circumference = 2 * Math.PI * currentRadius;
            const nodesInThisCircle = Math.min(Math.floor(circumference / combinedSize), numberOfNodes - nodesPlaced);

            for (let j = 0; j < nodesInThisCircle && nodesPlaced < numberOfNodes; j++) {
                const angle = (j / nodesInThisCircle) * 2 * Math.PI;
                nodes[nodesPlaced].x = centerX + currentRadius * Math.cos(angle) - nodes[nodesPlaced].width / 2;
                nodes[nodesPlaced].y = centerY + currentRadius * Math.sin(angle) - nodes[nodesPlaced].height / 2;
                nodesPlaced++;
            }

            circleIndex++;
        }

        figma.notify('Elements aligned in a filled circular pattern!');
    }
};
