import React from 'react';
import { useParams } from 'react-router-dom';

const ReleaseDetail: React.FC = () => {
    const { urlTitle } = useParams();

    return (
        <div className="release-detail">
            <h1>Release Detail</h1>
            <p>Release details will be displayed here for: {urlTitle}</p>
        </div>
    );
};

export default ReleaseDetail; 