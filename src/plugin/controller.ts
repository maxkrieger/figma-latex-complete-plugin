figma.showUI(__html__);

figma.ui.onmessage = msg => {
    if (msg.type === 'create-latex-svg') {
        const node = figma.createNodeFromSvg(msg.svg);
        const svg = node.children[0];
        svg.resize(msg.scale, svg.height * (msg.scale / svg.width));
        svg.name = msg.source;
        figma.currentPage.appendChild(svg);
        figma.currentPage.selection = [svg];
        figma.viewport.scrollAndZoomIntoView([svg]);
        node.remove();
    }

    figma.closePlugin();
};
