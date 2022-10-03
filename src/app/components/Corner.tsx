import * as React from 'react';

const Corner = ({}) => {
    const resizeIcon = React.useRef<SVGSVGElement>(undefined);

    const resizeWindow = e => {
        const size = {
            w: Math.max(50, Math.floor(e.clientX + 5)),
            h: Math.max(50, Math.floor(e.clientY + 5)),
        };
        parent.postMessage({pluginMessage: {type: 'resize', size: size}}, '*');
    };

    React.useEffect(() => {
        resizeIcon.current.onpointerdown = e => {
            resizeIcon.current.onpointermove = resizeWindow;
            resizeIcon.current.setPointerCapture(e.pointerId);
        };
        resizeIcon.current.onpointerup = e => {
            resizeIcon.current.onpointermove = null;
            resizeIcon.current.releasePointerCapture(e.pointerId);
        };
    });

    return (
        <div>
            <svg
                ref={resizeIcon}
                id="corner"
                style={{position: 'absolute', right: '1px', bottom: '2px', cursor: 'nwse-resize'}}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M16 0V16H0L16 0Z" fill="white" />
                <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
                <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C" />
            </svg>
        </div>
    );
};

export default Corner;
