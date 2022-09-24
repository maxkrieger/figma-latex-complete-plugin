figma.showUI(__html__);

const postSourceCode = () => {
    const selection = figma.currentPage.selection;
    if (selection.length !== 0) {
        const source = selection[0].getPluginData('source');
        figma.ui.postMessage({type: 'source', value: source});
    }
};
postSourceCode();

figma.ui.onmessage = msg => {
    if (msg.type === 'create-latex-svg') {
        const node = figma.createNodeFromSvg(msg.svg);
        if (node.children.length !== 0) {
            const svg = <GroupNode>node.children[0];
            const selection = figma.currentPage.selection;
            svg.setRelaunchData({edit: ''});
            svg.resize(msg.scale, svg.height * (msg.scale / svg.width));
            if (selection.length !== 0 && selection[0].getPluginData('source') != '') {
                const groupNode = <GroupNode>selection[0];
                groupNode.setPluginData('source', msg.source);
                groupNode.name = msg.source;
                svg.x = groupNode.x;
                svg.y = groupNode.y;
                groupNode.appendChild(svg.children[0]);
                groupNode.children[0].remove();
                figma.currentPage.selection = [groupNode];
            } else {
                svg.setPluginData('source', msg.source);
                svg.name = msg.source;
                const {x, y} = figma.viewport.center;
                svg.x = x;
                svg.y = y;
                figma.currentPage.appendChild(svg);
                figma.currentPage.selection = [svg];
            }
        }
        node.remove();
    }

    figma.closePlugin();
};
