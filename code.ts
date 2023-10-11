// Load and show the UI
figma.showUI(__html__, { width: 240, height: 160 });

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
        const radius = parseFloat(msg.radius);

        // Place the first element in the center
        nodes[0].x = centerX - nodes[0].width / 2;
        nodes[0].y = centerY - nodes[0].height / 2;

        // Calculate the number of circles required (layers of nodes around the center)
        const circlesRequired = Math.ceil(Math.sqrt(numberOfNodes));

        // Distribute the remaining nodes among the circles
        for (let i = 1, circle = 1; circle <= circlesRequired; circle++) {
            const nodesInThisCircle = Math.min(numberOfNodes - i, circle * 6);
            const circleRadius = (circle / circlesRequired) * radius;

            for (let j = 0; j < nodesInThisCircle && i < numberOfNodes; j++, i++) {
                const angle = (j / nodesInThisCircle) * 2 * Math.PI;
                nodes[i].x = centerX + circleRadius * Math.cos(angle) - nodes[i].width / 2;
                nodes[i].y = centerY + circleRadius * Math.sin(angle) - nodes[i].height / 2;
            }
        }

        figma.notify('Elements aligned in a filled circular pattern!');
        figma.closePlugin();
    }
};
