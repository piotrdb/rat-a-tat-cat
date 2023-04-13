import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const ImageSelector = (props) => {
    const [selected, setSelected] = useState();

    return (
        <>
            <div className="image-selector">
                {props.images.map(image => (
                    <img
                        className={`image-selector-img " ${selected === image ? 'image-selector__checked' : ''}`}
                        key={`image-selector-${image}`}
                        onClick={() => setSelected(image)}
                        alt={`Zdjecie ${image}`}
                        src={`https://ratsapi.online/api/users/availableImages/${image}`}
                    />
                ))}
            </div>
            <Button onClick={() => props.onSubmit(selected)} id="ready" variant="secondary">
                Zmień avatar
            </Button>
        </>

    );
};

export default ImageSelector;
