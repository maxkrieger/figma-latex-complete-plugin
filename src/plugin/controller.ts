figma.showUI(__html__);

figma.ui.onmessage = msg => {
    if (msg.type === 'create-latex-svg') {
        const node = figma.createNodeFromSvg(msg.svg);
        const svg = node.children[0];
        svg.resize(msg.scale, svg.height * (msg.scale / svg.width));
        svg.name = msg.source;
        const {x, y} = figma.viewport.center;
        svg.x = x;
        svg.y = y;
        figma.currentPage.appendChild(svg);
        figma.currentPage.selection = [svg];
        node.remove();
    }

    figma.closePlugin();
};
