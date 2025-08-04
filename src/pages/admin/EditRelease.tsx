import React from 'react';
import { useParams } from 'react-router-dom';

const EditRelease: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="edit-release">
            <h1>Edit Release</h1>
            <p>Release editing form will be implemented here for release ID: {id}</p>
        </div>
    );
};

export default EditRelease; 