import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


export const InformationHover = ({ style, width = 16, height = 16, tooltip = "Tooltip!", placement = "auto" }) => {

    const basicStyle = {
        cursor: "pointer"
    }

    const [mouseOver, setMouseOver] = useState(false);
    const [mergeStyle, setMergeStyle] = useState({ ...basicStyle, ...style });



    //const mergeStyle = { ...style, ...basicStyle }

    useEffect(() => {
        if (mouseOver) {
            setMergeStyle({ ...basicStyle, ...style });
        } else {
            setMergeStyle({ ...basicStyle, ...{ "fill": "rgba(0,0,0,0.6)" }, ...style });
        }
    }, [mouseOver])

    return (
        <>
            <OverlayTrigger
                overlay={<Tooltip>{tooltip}</Tooltip>}
                placement={placement}
            >
                <svg style={mergeStyle} onMouseEnter={() => { setMouseOver(true) }} onMouseLeave={() => { setMouseOver(false) }} xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
            </OverlayTrigger>
        </>
    );
}

export default InformationHover;